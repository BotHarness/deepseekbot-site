---
{
  "title": "在 2 核 4 GB VPS 上部署 Tailscale 与 QQ 机器人",
  "description": "在 Ubuntu VPS 上配置 SSH 与 Tailscale 私网，将服务托管在 systemd 下常驻运行，并绑定官方 QQ 机器人实现群内对话。",
  "order": 13,
  "source": "docs/vps-qq-tutorial.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

本教程以一台真实的 2 核 4 GB Ubuntu 26.04 云服务器为例，完整演示从配置 SSH、加入 Tailscale 私网、安装插件与服务、配置 `systemd` 后台常驻、创建 PersonaBot，到绑定独立官方 QQ 机器人并在群聊中收发消息的全过程。

## 开始前准备

在动手之前，请准备好以下环境与账号：

- 一台可通过云厂商控制台访问的 Linux VPS，以及本地电脑上的 OpenSSH 客户端。
- 一个 [Tailscale](https://tailscale.com) 账号，用于将 VPS 与你的本地电脑组建在同一私有网络（tailnet）中。
- 一个可用的模型服务商 API Key（如 DeepSeek API Key）。
- 一个已在 [QQ 开放平台](https://bot.q.qq.com/open) 创建的官方 QQ 机器人应用，以及一个你拥有管理权限的测试 QQ 群。

下文中出现的所有地址、密钥、AppID 与群号均为示例占位符。部署前请先检查服务器上已有的服务，避免路径或端口冲突。本教程示例使用的目录与端口规划如下：

| 资源项 | 教程示例配置 |
| --- | --- |
| 应用目录 | `/opt/botharness/seo-tutorial` |
| 运行系统用户 | `bh-seo` |
| 可写 DSH 目录 / Profile | `home/dsh` / `seo-tutorial` |
| systemd 服务单元 | `botharness-seo-tutorial.service` |
| 本地回环监听地址 | `127.0.0.1:31971` |
| Tailnet HTTPS 入口 | 通过 Tailscale Serve 映射的 443 端口 |

## 1. 检查服务器环境并配置 SSH 密钥登录

先在云厂商控制台的终端里检查系统版本、CPU、内存、磁盘与正在监听的端口：

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

在你的本地开发机上运行 `ssh-keygen -t ed25519 -f <私钥路径>` 生成专用密钥对，然后将**公钥**追加到服务器的 `~/.ssh/authorized_keys` 中：

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

核对服务器的主机指纹无误后，将其加入本地 `known_hosts`，再通过 SSH 测试连接是否畅通：

```bash
ssh -F none -i <private-key-path> -o IdentitiesOnly=yes \
  -o UserKnownHostsFile=<verified-known-hosts> \
  -o StrictHostKeyChecking=yes -o BatchMode=yes \
  <verified-user>@<confirmed-host> whoami
```

## 2. 加入 Tailscale 私网并验证连通性

参照 [Tailscale Linux 官方安装文档](https://tailscale.com/docs/install/linux) 安装并启动 Tailscale：

```bash
curl -fsSL https://tailscale.com/install.sh -o /root/tailscale-install.sh
sha256sum /root/tailscale-install.sh
sh /root/tailscale-install.sh
tailscale version
sudo tailscale up
```

执行 `sudo tailscale up` 后，在浏览器中打开终端输出的登录链接，登录你的 Tailscale 账号并批准该设备加入 tailnet。接着可以为服务器设置一个好记的主机名，并查看分配到的私网 IP：

```bash
sudo tailscale set --hostname=deepseekbot-internal
tailscale ip -4
```

随后在同处一个 tailnet 的本地电脑上运行 `tailscale ping <设备名>`，并尝试直接通过 Tailscale 私网地址进行 SSH 登录，确认私网通信正常。

## 3. 在开发机打包构建产物（可选源码构建方式）

如果你直接安装 npm 正式版，可以在第 4 步直接通过 `dsh plugin add @botharness/tobs@1.6.0` 安装。如果你需要从特定源码版本构建完整产物包，可以在开发机（Node `24.21.0`、pnpm `12.4.2`）上打包后再上传到小内存 VPS，避免在 2 核 4 GB 机器上直接跑大型全量编译：

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

将产物与安装辅助脚本打包为归档文件，并通过 `scp` 上传到 VPS：

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

## 4. 在 VPS 上安装运行环境与独立 Profile

在 VPS 上以管理员身份创建专用的系统用户 `bh-seo` 与目录结构，并安装 Node.js、pnpm 与 DSH：

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

接着解压前面上传的产物包，并将其安装到独立的 `seo-tutorial` Profile 中：

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

## 5. 配置 systemd 常驻服务（仅监听本地回环）

将 `tutorial.example.ts.net` 替换为你这台机器实际的 Tailscale 域名，新建 `/etc/systemd/system/botharness-seo-tutorial.service`：

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

启动服务并设置开机自启：

```bash
systemctl daemon-reload
systemctl enable --now botharness-seo-tutorial.service
systemctl is-active botharness-seo-tutorial.service
ss -lntp '( sport = :31971 )'
```

此时服务仅监听在 `127.0.0.1:31971`，不会直接暴露在公网上。你可以在 `home/dsh/host.log` 中找到带 Owner Token 的登录链接，后续如果需要在命令行调用 CLI，也可以将该 Token 保存在权限为 `0600` 的 `home/dsh/owner-token` 文件中。

## 6. 开启 Tailscale HTTPS 转发并登录 Web 界面

使用 `tailscale serve` 将本机的 `127.0.0.1:31971` 映射为 tailnet 内部的 HTTPS 服务：

```bash
tailscale serve --bg --https=443 --yes http://127.0.0.1:31971
```

在已登录同一 Tailscale 账号的电脑浏览器中打开 `https://<设备域名>.ts.net` 并使用 Owner 登录链接完成认证，即可安全地通过 HTTPS 访问 Web 界面。

## 7. 配置模型并创建 PersonaBot

你既可以直接在 Web 界面中配置模型和创建 Bot，也可以在服务器上通过 CLI 完成。以下是通过 CLI 写入 `DEEPSEEK_API_KEY`、创建模型预设并新建 Bot 的方式：

```bash
base=/opt/botharness/seo-tutorial
cli=$base/home/dsh/profiles/seo-tutorial/node_modules/deepseekbot/dist/deepseekbot.mjs
live() {
  runuser -u bh-seo -- env DSH_HOME="$base/home/dsh" PATH="$base/toolchain/bin:/usr/bin:/bin" \
    node "$cli" "$@" --host http://127.0.0.1:31971 --token-file "$base/home/dsh/owner-token"
}
```

通过标准输入安全地写入 API Key（不会留在命令历史或进程参数中）：

```bash
set +x
read -rsp 'DeepSeek API key: ' tutorial_model_key
printf '\n'
printf '%s' "$tutorial_model_key" | runuser -u bh-seo -- env \
  DSH_HOME="$base/home/dsh" PATH="$base/toolchain/bin:/usr/bin:/bin" \
  node "$cli" secret-put DEEPSEEK_API_KEY
unset tutorial_model_key
```

接着创建模型预设、新建 Bot 并发送一条私聊测试消息：

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

打开 Web 界面的 Bot 私聊窗口，即可看到模型返回的真实回复：

![更新后的 Bot 私聊真实模型回复](/guides/vps-source/01-real-dm-031a14db.png)

## 8. 连接官方 QQ 机器人应用并绑定给 Bot

关于腾讯开放平台注册、创建官方机器人应用、配置沙箱群以及打开手机 QQ 群权限的完整步骤，请参考图文指南[接入 QQ 机器人：从注册到群内回复](/docs/qq-connection)。

请注意：**同一个 QQ 机器人应用同一时间只能由一个运行中的 Host 实例接收消息**，切勿在多台机器上同时用同一个 AppID/AppSecret 抢占连接。

1. 在 Web 界面打开左下角 **设置 → IM 机器人 → QQ → 手动接入**，填入你的 **AppID** 与 **AppSecret** 并点击连接。
2. 打开刚刚创建的 Bot 私聊，在右侧栏展开 **外部身份（External identities）**，选择已连接的 QQ 应用完成绑定。

![QQ 应用已成功绑定到目标 Bot](/guides/vps-source/02-qq-app-bound.png)

## 9. 在 QQ 群内测试回复与服务重启恢复

在已配置好权限的测试 QQ 群中 `@` 该机器人并发送一条消息。机器人收到提及后会调用模型并在原 QQ 群中直接回复。

你还可以重启一次 systemd 服务，验证重启后配置、连接与绑定均自动恢复：

```bash
systemctl restart botharness-seo-tutorial.service
systemctl is-active botharness-seo-tutorial.service
live im-apps
```

服务重启完成后，再次在 QQ 群里 `@` 机器人发送新消息，确认它依然能正常在群内回复：

![Host 重启前后在原 QQ 群内的真实回复记录](/guides/vps-source/04-qq-group-before-after.png)

## 常见问题排查与日常维护

| 现象 | 排查与处理建议 |
| --- | --- |
| SSH 提示主机密钥不匹配 | 对照云控制台中的公钥指纹核实机器身份，确认无误后再更新本地 `known_hosts` |
| Tailscale 设备在线但无法连接 | 检查设备是否已在 Tailscale 后台批准加入同一 tailnet，并先用 `tailscale ping` 测试连通性 |
| 安装脚本提示 Profile 已存在 | 请指定一个新的 Profile 名称，或按升级流程先备份再更新，不要直接删除正在使用的数据目录 |
| CLI 报 `host-unauthorized` | 服务重启后如果生成了新的 Owner Token，请更新 `home/dsh/owner-token` 并重新登录 |
| CLI 报 `host-unreachable` | 先用 `systemctl status` 和 `ss -lntp` 检查后台服务与 `127.0.0.1:31971` 是否在正常监听 |
| QQ 显示已连接但群内无回复 | 确认本地私聊能正常回复、QQ 应用已绑定到该 Bot、群会话未处于待批准/免打扰状态，且没有另一台机器占用同一个 QQ 应用 |
| 小内存机器安装时内存紧张 | 建议在本地开发机打包好产物后再上传到 VPS 安装，避免在 2 核 4 GB 机器上直接跑并行编译 |

日常查看服务内存占用或启停服务可以使用以下命令（实测稳定运行时内存峰值仅约 370 MiB 左右）：

```bash
systemctl show botharness-seo-tutorial.service -p MemoryCurrent -p MemoryPeak
systemctl stop botharness-seo-tutorial.service
systemctl start botharness-seo-tutorial.service
```

每次升级版本前，建议先停止服务并备份整个 Profile 目录，确保数据安全。
