---
{
  "title": "Deploy on a 2-core / 4 GB VPS with Tailscale and QQ",
  "description": "Set up a Linux VPS with SSH and Tailscale, run the Host as a systemd service, and connect an official QQ Bot for group chats.",
  "order": 13,
  "source": "docs/vps-qq-tutorial.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

This tutorial walks through a complete deployment on a 2-core / 4 GB Ubuntu 26.04 VPS: configuring SSH, joining a Tailscale tailnet, installing the runtime and plugin, running the Host under `systemd`, creating a PersonaBot, and connecting an official QQ Bot App that replies in group chats and survives restarts.

## Before you start

Make sure you have the following ready:

- A Linux VPS with cloud-console access and a local OpenSSH client.
- A [Tailscale](https://tailscale.com) account so your VPS and local computer can talk over a private tailnet.
- A working model API key (such as a DeepSeek API key).
- An official QQ Bot App created on the [QQ Open Platform](https://bot.q.qq.com/open) and a test QQ group that you manage.

All addresses, keys, AppIDs, and group numbers below are placeholders. Check what services are already running on your server before choosing directories and ports. This walkthrough uses the following layout:

| Resource | Tutorial example |
| --- | --- |
| Application directory | `/opt/botharness/seo-tutorial` |
| Runtime system user | `bh-seo` |
| Writable DSH home / Profile | `home/dsh` / `seo-tutorial` |
| systemd service unit | `botharness-seo-tutorial.service` |
| Loopback Host listener | `127.0.0.1:31971` |
| Tailnet HTTPS route | HTTPS port 443 routed to the loopback listener |

## 1. Inspect the server and set up SSH key login

In your cloud provider's web console, check the OS version, CPU, memory, disk space, and active listeners:

```bash
whoami
hostname
cat /etc/os-release
nproc
free -m
df -h /
swapon --show
ss -lntup
systemctl --type=service --state=running
command -v docker >/dev/null && docker ps
```

On your local machine, generate a dedicated key pair with `ssh-keygen -t ed25519 -f <private-key-path>`. Then, in the cloud console, add the **public** key to `~/.ssh/authorized_keys`:

```bash
set -eu
umask 077
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
key='ssh-ed25519 REPLACE_WITH_YOUR_PUBLIC_KEY tutorial-client'
if ! grep -qxF -- "$key" "$HOME/.ssh/authorized_keys"; then
  printf '\n%s\n' "$key" >> "$HOME/.ssh/authorized_keys"
fi
chmod 600 "$HOME/.ssh/authorized_keys"
printf 'KEY_OK\n'
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Verify the server's host key fingerprint against the console output, save it to your `known_hosts` file, and test your SSH connection:

```bash
ssh -F none -i <private-key-path> -o IdentitiesOnly=yes \
  -o UserKnownHostsFile=<verified-known-hosts> \
  -o StrictHostKeyChecking=yes -o BatchMode=yes \
  <verified-user>@<confirmed-host> whoami
```

## 2. Join Tailscale and verify private connectivity

Install Tailscale using the [official Linux installation script](https://tailscale.com/docs/install/linux):

```bash
curl -fsSL https://tailscale.com/install.sh -o /root/tailscale-install.sh
sha256sum /root/tailscale-install.sh
sh /root/tailscale-install.sh
tailscale version
sudo tailscale up
```

Open the login URL printed by `sudo tailscale up` in your browser, sign in to your Tailscale account, and approve the server in your tailnet. Next, give the server a clear hostname and check its private Tailscale IPv4 address:

```bash
sudo tailscale set --hostname=deepseekbot-internal
tailscale ip -4
```

From your local machine (signed in to the same tailnet), run `tailscale ping <hostname>` and verify that you can SSH into the server over its Tailscale address.

## 3. Build a source package off the VPS (optional)

If you are installing the standard npm release, you can install `@botharness/tobs@1.6.0` directly via `dsh plugin add`. If you are building from a specific git revision, build the package on your local development machine first (using Node `24.21.0` and pnpm `12.4.2`) so you don't run a heavy build on a small 2-core / 4 GB VPS:

```bash
git clone https://github.com/BotHarness/DeepSeekBot.git botharness-product
cd botharness-product
git checkout 031a14db43af5b3bf52e76b01c30e27828e6e9c9
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm build
git clone https://github.com/DoodleBears/dsh-im.git qualified-provider
git -C qualified-provider checkout 602baa37fa327f7069545aaadbbd34db8a8f4636
cd qualified-provider
npm ci --ignore-scripts
cd ..
node scripts/product-artifacts.mjs \
  --output .humanlayer/product-candidate \
  --provider-source qualified-provider \
  --version 1.2.1-vps.20261012.sha031a14db
```

Package the build output and installation helpers into a tarball and copy them to your VPS over `scp`:

```bash
cd ..
git clone https://github.com/BotHarness/DeepSeekBot.git botharness-helpers
git -C botharness-helpers fetch origin codex/1438-vps-qq-tutorial
git -C botharness-helpers checkout ac30b3a4fc41a2882b3ea417bddd486fc4c22465
mkdir installation-kit
for helper in install-source-profile packaged-profile product-artifacts dev-im-provider dev-package-manager; do
  cp "botharness-helpers/scripts/$helper.mjs" installation-kit/
done
tar -czf product-candidate.tar.gz -C botharness-product/.humanlayer/product-candidate .
sha256sum product-candidate.tar.gz
```

## 4. Install the runtime toolchain and Profile on the VPS

On the VPS, create the dedicated `bh-seo` system user and directory layout, then install Node.js, pnpm, and DSH:

```bash
set -eu
umask 077
base=/opt/botharness/seo-tutorial
test ! -e "$base"
if getent passwd bh-seo >/dev/null; then exit 1; fi
apt-get update
apt-get install --no-install-recommends -y ca-certificates curl git xz-utils build-essential python3
if test ! -e /opt/botharness; then install -d -m 755 /opt/botharness; fi
mkdir -p "$base/toolchain" "$base/artifacts" "$base/evidence"
chmod 755 "$base" "$base/toolchain" "$base/artifacts"
useradd --system --create-home --home-dir "$base/home" --shell /usr/sbin/nologin bh-seo
runuser -u bh-seo -- test -x /opt/botharness
mkdir -p "$base/home/dsh"
chown -R bh-seo:bh-seo "$base/home"
chmod 700 "$base/home" "$base/home/dsh"
cd "$base/toolchain"
curl -fSL https://nodejs.org/dist/v24.21.0/node-v24.21.0-linux-x64.tar.xz -o node-v24.21.0-linux-x64.tar.xz
curl -fSL https://nodejs.org/dist/v24.21.0/SHASUMS256.txt -o SHASUMS256.txt
grep ' node-v24.21.0-linux-x64.tar.xz$' SHASUMS256.txt > node-checksum.txt
test "$(wc -l < node-checksum.txt)" = 1
sha256sum -c node-checksum.txt
tar -xJf node-v24.21.0-linux-x64.tar.xz --strip-components=1
export PATH="$base/toolchain/bin:$PATH"
npm install --global --prefix "$base/toolchain" pnpm@12.4.2 @deepseek-ai/dsh@0.2.0-rc.1
chmod -R a+rX "$base/toolchain"
node --version
pnpm --version
dsh --version
```

Next, verify the uploaded archive's checksum, extract it, and install the Profile as `bh-seo`:

```bash
printf '%s  /root/product-candidate.tar.gz\n' '<your-development-machine-sha256>' | sha256sum -c -
mkdir /opt/botharness/seo-tutorial/artifacts/source-candidate
tar -xzf /root/product-candidate.tar.gz -C /opt/botharness/seo-tutorial/artifacts/source-candidate
cp -R /root/installation-kit /opt/botharness/seo-tutorial/installation-kit
cd /opt/botharness/seo-tutorial/installation-kit
npm install --ignore-scripts --no-audit --no-fund yaml@2.9.1 semver@7.8.5
chmod -R a+rX /opt/botharness/seo-tutorial/installation-kit /opt/botharness/seo-tutorial/artifacts/source-candidate
cd /opt/botharness/seo-tutorial/home
runuser -u bh-seo -- env \
  DSH_HOME=/opt/botharness/seo-tutorial/home/dsh \
  PATH=/opt/botharness/seo-tutorial/toolchain/bin:/usr/bin:/bin \
  node /opt/botharness/seo-tutorial/installation-kit/install-source-profile.mjs \
  --home /opt/botharness/seo-tutorial/home/dsh --profile seo-tutorial \
  --artifacts /opt/botharness/seo-tutorial/artifacts/source-candidate \
  --dsh /opt/botharness/seo-tutorial/toolchain/bin/dsh
```

## 5. Run the loopback Host under systemd

Replace `tutorial.example.ts.net` with your machine's actual Tailscale MagicDNS name and create `/etc/systemd/system/botharness-seo-tutorial.service`:

```ini
[Unit]
Description=DeepSeekBot tutorial
After=network-online.target tailscaled.service
Wants=network-online.target

[Service]
Type=simple
User=bh-seo
Group=bh-seo
WorkingDirectory=/opt/botharness/seo-tutorial/home
Environment=DSH_HOME=/opt/botharness/seo-tutorial/home/dsh
Environment=PATH=/opt/botharness/seo-tutorial/toolchain/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/opt/botharness/seo-tutorial/toolchain/bin/dsh --profile seo-tutorial --host 127.0.0.1 --port 31971 --trusted-host tutorial.example.ts.net --no-open
Restart=on-failure
RestartSec=5
UMask=0077
StandardOutput=append:/opt/botharness/seo-tutorial/home/dsh/host.log
StandardError=append:/opt/botharness/seo-tutorial/home/dsh/host.log

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
systemctl daemon-reload
systemctl enable --now botharness-seo-tutorial.service
systemctl is-active botharness-seo-tutorial.service
ss -lntp '( sport = :31971 )'
```

The Host listens only on `127.0.0.1:31971` and is not exposed to the public internet. Check `home/dsh/host.log` for the private Owner login URL. If you plan to use the CLI, save the Owner token in `home/dsh/owner-token` (owned by `bh-seo` with mode `0600`) rather than passing tokens on the command line.

## 6. Expose HTTPS on your tailnet and sign in

Publish the local loopback port to your tailnet over HTTPS using `tailscale serve`:

```bash
tailscale serve --bg --https=443 --yes http://127.0.0.1:31971
```

On another device in your tailnet, open `https://<your-device>.ts.net` using the Owner login URL from `host.log` to sign in to the Web UI.

## 7. Configure the model and create a PersonaBot

You can configure your model provider and create a Bot either from the Web UI or via the CLI. To do it from the CLI on the VPS:

```bash
base=/opt/botharness/seo-tutorial
cli=$base/home/dsh/profiles/seo-tutorial/node_modules/deepseekbot/dist/deepseekbot.mjs
live() {
  runuser -u bh-seo -- env DSH_HOME="$base/home/dsh" PATH="$base/toolchain/bin:/usr/bin:/bin" \
    node "$cli" "$@" --host http://127.0.0.1:31971 --token-file "$base/home/dsh/owner-token"
}
```

Pass your API key via standard input so it never appears in shell history or process arguments:

```bash
set +x
read -rsp 'DeepSeek API key: ' tutorial_model_key
printf '\n'
printf '%s' "$tutorial_model_key" | runuser -u bh-seo -- env \
  DSH_HOME="$base/home/dsh" PATH="$base/toolchain/bin:/usr/bin:/bin" \
  node "$cli" secret-put DEEPSEEK_API_KEY
unset tutorial_model_key
```

Next, create a model preset, create your Bot, and send a test DM:

```bash
live model-preset-create --name 'SEO Tutorial DeepSeek' \
  --orchestrator-provider deepseek-official --orchestrator-model deepseek-flash --orchestrator-effort low \
  --assignment-provider deepseek-official --assignment-model deepseek-flash --assignment-effort low
live create --name 'VPS SEO Tutorial Bot' \
  --description 'Dedicated VPS and QQ tutorial Bot' \
  --persona 'Help with deployment. For verification requests, reproduce the requested marker exactly.' \
  --preset <id-returned-by-model-preset-create>
printf 'Please reply only TUTORIAL_DM_A_OK' | live send <new-bot-id> --body-stdin
```

Open the Bot's DM in the Web UI to confirm the reply:

![Real model reply in the Bot DM](/guides/vps-source/01-real-dm-031a14db.png)

## 8. Connect your QQ Bot App and bind it to the Bot

For step-by-step instructions on registering a Tencent developer account, creating an official QQ Bot App, setting up a sandbox group, and enabling mobile group permissions, see [Connect a QQ Bot: registration to group replies](/en/docs/qq-connection/).

Keep in mind that **only one running Host can receive events for a given QQ Bot App at a time**—do not connect the same AppID/AppSecret from two machines simultaneously.

1. In the Web UI, open **Settings → IM bots → QQ → Manual setup**, enter your **AppID** and **AppSecret**, and click **Connect**.
2. Open your Bot's DM, expand **External identities** in the right sidebar, and bind the connected QQ App.

![Confirmation that the QQ App is bound to the Bot](/guides/vps-source/02-qq-app-bound.png)

## 9. Test QQ group replies and restart persistence

In your test QQ group, `@`-mention the robot and send a message. The Bot will process the mention and reply right in the QQ group.

To confirm everything persists across restarts, restart the systemd service:

```bash
systemctl restart botharness-seo-tutorial.service
systemctl is-active botharness-seo-tutorial.service
live im-apps
```

Once the service is back up, send another `@`-mention in the QQ group and verify that the Bot replies normally:

![QQ group replies before and after restarting the Host service](/guides/vps-source/04-qq-group-before-after.png)

## Troubleshooting and maintenance

| Symptom | What to check |
| --- | --- |
| SSH host-key mismatch | Compare the fingerprint against your cloud console before updating your local `known_hosts` file |
| Tailscale device listed but unreachable | Confirm the device is approved in the same tailnet and test connectivity with `tailscale ping` |
| Installer refuses an existing Profile | Choose a new Profile name or back up before upgrading; do not delete active Profile data |
| `host-unauthorized` in CLI | Refresh `home/dsh/owner-token` if the Host issued a new Owner token after restart |
| `host-unreachable` in CLI | Check `systemctl status` and `ss -lntp` to ensure the loopback listener on `127.0.0.1:31971` is running |
| QQ connected, but no group reply | Check that local DMs work, the QQ App is bound to the Bot, the group conversation is active, and no other Host is connected to the same App |
| Memory pressure during installation | Build artifacts on your local machine first and copy them over rather than running a full build on a 2-core / 4 GB VPS |

You can check memory usage or stop/start the service at any time (peak memory usage during normal operation is around 370 MiB):

```bash
systemctl show botharness-seo-tutorial.service -p MemoryCurrent -p MemoryPeak
systemctl stop botharness-seo-tutorial.service
systemctl start botharness-seo-tutorial.service
```

Always stop the service and back up your Profile directory before upgrading.
