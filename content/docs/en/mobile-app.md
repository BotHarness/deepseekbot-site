---
{
  "title": "Get started with the phone app",
  "description": "Install DeepSeek Harness and DeepSeekBot, connect over Tailscale and pair your phone.",
  "order": 16,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/en/mobile-app.md"
}
---

The DeepSeekBot phone app is a remote for DeepSeek Harness (DSH) running on your own computer. Your Bots, chats and approvals stay on the computer; the phone shows them and lets you chat and approve from anywhere. This guide goes from a clean computer to a paired phone in about 20 minutes.

The software is free. DSH and DeepSeekBot are open source and need no account. The phone reaches the computer over your own [Tailscale](https://tailscale.com) network, which is free for personal use but needs a Tailscale account. The only possible cost is your model provider: DeepSeek and most others bill API usage by token.

**Watch the whole flow first:** [1-minute video](https://youtube.com/shorts/MWGKtM5xwkQ).

**Version scope:** checked against DeepSeek Harness desktop `0.2.1-rc.2`, the DeepSeekBot plugin `1.4.1` and the iOS beta on TestFlight (October 21, 2026).

## What you need

- A Mac (Apple Silicon or Intel) or a Windows x64 computer that stays on while you use the phone. Linux works with the command-line install.
- An iPhone with the DeepSeekBot beta from TestFlight, or an Android phone with the Google Play internal test. Both are invitation-only for now: open the invitation link you received and install the app from there.
- A [DeepSeek API key](https://platform.deepseek.com/api_keys), or a DeepSeek account to sign in with, so your Bots can reply.
- A Tailscale account. You can sign up with Google, Microsoft, GitHub, Apple and others.

The steps:

1. Install DeepSeek Harness on the computer.
2. Install the DeepSeekBot plugin and create a Bot.
3. Sign the computer and the phone in to the same Tailscale account.
4. Publish DSH on your tailnet with `tailscale serve`.
5. Pair the phone by scanning a QR code.

## 1. Install DeepSeek Harness

DeepSeek Harness (DSH) is DeepSeek's open-source desktop app for AI agents. DeepSeekBot runs inside it as a plugin. This guide uses version **0.2.1-rc.2**.

**Download.** Open the [DeepSeek Harness download page](https://www.deepseek.com/harness/), or download the installer for your computer directly:

| Computer                       | Installer                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| Mac with Apple Silicon (M series) | [dsh-latest-macos-arm64.dmg](https://download.deepseek.com/desktop/dsh-latest-macos-arm64.dmg) |
| Mac with an Intel chip         | [dsh-latest-macos-x64.dmg](https://download.deepseek.com/desktop/dsh-latest-macos-x64.dmg)     |
| Windows (x64)                  | [dsh-latest-windows-x64.exe](https://download.deepseek.com/desktop/dsh-latest-windows-x64.exe) |

To check your Mac's chip, open the Apple menu → **About This Mac**.

**Install on macOS.** Open the `.dmg`, drag **DeepSeek Harness** into **Applications**, then open it from Applications or Launchpad. The app is signed and notarized by DeepSeek, so macOS opens it normally.

**Install on Windows.** Run the `.exe`, follow the installer and click **Finish** to launch it. When you close the window later, DSH keeps running in the system tray; quit it from the tray icon.

**First launch.** The welcome window asks how to use DeepSeek models:

- **Add API Key**: paste your DeepSeek API key and click **Save and continue**.
- **Sign in**: sign in with your DeepSeek account in the browser.

You can also click **Set up later** and add a model provider in settings afterwards. To check the installed version, open the app menu → **About DeepSeek Harness**. DeepSeekBot 1.4.1 works with DSH 0.2.0-rc.2 and later 0.2.x releases, so a newer 0.2.x download also works.

**Command line (Linux, or if you prefer it).** With Node 22 or later:

```bash
npm i -g @deepseek-ai/dsh@0.2.1-rc.2
dsh web
```

`dsh web` opens DSH in your browser at `http://127.0.0.1:3080`. The rest of this guide is the same in the browser and in the desktop app.

## 2. Install DeepSeekBot and create a Bot

1. In DeepSeek Harness, click **Plugins** in the left sidebar, then **Add plugin**.
2. In **Package name or address**, enter this exact value, keep **npm official registry**, and click **Install**:

   ```text
   deepseekbot@1.4.1
   ```

3. When the task shows **Installed**, click **Enable now**. If DSH asks for a restart, restart it.
4. Click **Bot mode** in the sidebar. Follow the Home onboarding to choose a model, then ask Tob, the built-in helper, to create your first Bot.
5. Send the new Bot a short message on the computer. A reply means the model works.

Screenshots and fixes for each step are in [Install DeepSeekBot](/docs/installation) and [API and Bot models](/docs/model-setup). Bot mode also needs Git; if it is missing, click **Install Git** in the notice.

## 3. Sign in to Tailscale on both devices

| Device  | Download                                                                                                                                                             |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| iPhone  | [App Store: Tailscale](https://apps.apple.com/app/tailscale/id1470499037)                                                                                            |
| Android | [Google Play: Tailscale](https://play.google.com/store/apps/details?id=com.tailscale.ipn)                                                                            |
| Desktop | [tailscale.com/download](https://tailscale.com/download) (macOS, Windows, Linux). On macOS, the standalone download is easiest because it includes the `tailscale` command. |

Sign in on the computer and on the phone with **the same account**, and keep Tailscale connected on both. On the phone, allow the VPN configuration the first time.

Then open the [DNS page of the Tailscale admin console](https://login.tailscale.com/admin/dns) and check that **MagicDNS** and **HTTPS Certificates** are both on. The phone only connects over HTTPS.

## 4. Publish DSH with `tailscale serve`

On the computer, open **Bot mode**, click the gear at the bottom left to open **Bot settings**, and choose **Devices**.

If Tailscale is not publishing DSH yet, the page shows a yellow notice with a command:

![The Devices page with the tailscale serve command](/guides/mobile-pairing/03-tailscale-missing-en.webp)

Open a terminal on the computer and run the command exactly as shown. Your port may differ:

```bash
tailscale serve --bg 3080
```

- `--bg` keeps it running after you close the terminal or restart the computer.
- On macOS, if `tailscale` is not found, run `/Applications/Tailscale.app/Contents/MacOS/Tailscale serve --bg 3080` instead.
- If it prints a link saying HTTPS is not enabled, open the link, turn HTTPS on and run the command again.

This publishes DSH only to devices signed in to your own tailnet. It is not reachable from the internet. Close and reopen **Devices**. When the notice is gone and only **Pair a phone** shows, continue.

![The Devices page when Tailscale is ready](/guides/mobile-pairing/01-devices-en.webp)

## 5. Pair the phone

On the computer, click **Pair a phone**. A QR code opens. It works once and expires after 10 minutes; click **New code** if it runs out.

![The pairing QR code on the computer](/guides/mobile-pairing/02-pair-qr-en.webp)

On the phone:

1. Check that Tailscale is connected.
2. Open the DeepSeekBot app. On first launch it shows **Pair with your computer**.
3. Allow the camera and scan the code on the computer. If scanning does not work, click **Copy pairing link** on the computer, send the link to your phone and paste it into **Or paste the pairing link**.
4. Optionally name the computer under **Name on this phone**, then tap **Pair**.

![The Pair with your computer screen on the phone](/guides/mobile-pairing/04-phone-pair-en.webp)

The phone now shows the Bots and groups on your computer. Open a Bot and send it a message: the reply comes from your computer. The computer's **Devices** page lists the phone under **Paired devices**. You don't need to pair again after restarting the computer or DSH.

![The phone after pairing, showing the computer's Bots](/guides/mobile-pairing/06-phone-paired-en.webp)

## If something does not work

**The phone cannot reach the computer.** Check that Tailscale is connected on both devices with the same account, the computer is awake and DSH is running. Open `https://<computer>.<tailnet>.ts.net` in the phone's browser: any page from the computer means the network works.

**The yellow notice is back after restarting DSH.** The port changed. Run the new command it shows, then click **New code**.

**A phone is lost.** Click **Revoke** next to it under **Paired devices** on the computer. The phone is cut off at once.

More answers are in [Pair your phone](/docs/mobile-pairing). For anything else, [open an issue on GitHub](https://github.com/BotHarness/DeepSeekBot/issues).
