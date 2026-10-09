# Connections and optional tools

**Check the version first:** the website installs npm **deepseekbot v1.1.0** (checked on 2026-10-08). It includes Core, Client and a qualified IM Provider, but no optional Computer / Browser components. The newer binding flow and targets here describe [source revision `636a5a6c`](https://github.com/BotHarness/BotHarness/tree/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192) from that date; installing v1.1.0 does not give you every newer control.

[Install the release](/docs/installation) · [All user guides](/docs/overview) · [Release ledger](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/CHANGELOG.md)

## Connect an IM identity

Verify a real local Bot DM reply before connecting an app. Platform scopes differ:

| Platform | Current scope | Connection guide |
| --- | --- | --- |
| Lark / Feishu | Application bot; mentions in groups it has joined, with intake and replies governed by platform and conversation rules | [Lark / Feishu](/docs/lark-connection) |
| Slack | Conversations accessible to the app; channel mentions reply in the original thread, while DMs follow the DM path | [Slack](/docs/slack-connection) |
| Discord | The bound Bot app; server, channel and message-content permissions constrain intake, with no promise to read arbitrary channels | [Identity and conversation management](/docs/channel-sidebar/external-identities) · [Discord qualification](https://github.com/BotHarness/BotHarness/pull/1125) |
| Personal WeChat | DMs between the QR-scanning owner and the WeChat Bot; excludes groups, other contacts and Enterprise WeChat | [Personal WeChat](/docs/wechat-connection) |

**QQ group integration is being delivered in slices and is not a complete stable-release feature yet.** See [QQ group permissions in mobile QQ](/docs/qq-connection) for message reception and proactive speech, and [#1149](https://github.com/BotHarness/DeepSeekBot/issues/1149) for delivery status. The QQ community group at the bottom is a separate community entry.

## Bind an app in newer builds

These are current-source steps. v1.1.0 can have a different layout and intake policy; older Profile screenshots are historical records. Check your installed version and release ledger before looking for newer, unreleased controls.

1. Connect the platform app in **Settings → IM bots**, keeping credentials local. Pair personal WeChat here by QR code.
2. Open the intended Bot DM, expand **External identities** in its sidebar, then choose **Bind app**.
3. Select a connected app. An app belongs to one Bot; apps owned by another Bot cannot be selected. Resolve connection problems first.
4. Confirm **Ready** and send a platform test: mention the app in an appropriate Lark or Slack test group/channel, use the QR owner's DM for WeChat, or a test conversation the Discord app can read. Inspect the Bot Inbox and the platform reply.
5. New conversations follow **Automatic** or **Ask first**. With Ask first, allow the conversation and send a fresh message; earlier messages are not backfilled. Mute, set rules or block per conversation.

You do not need to save every group as a send target or authorize each group in the old Profile. Platform permissions and app connection state still apply; external messages are not automatically mirrored into the local DM.

[Open the External identities guide](/docs/channel-sidebar/external-identities)

## Choose a computer or browser target

These are **optional source components**. Computer Access and Browser Access are separate; each Session asks before its first action by default. Daily-browser access also needs an explicit connection and a document or Profile grant from the user.

| Target | What it can do | Requirements and limits |
| --- | --- | --- |
| Local Computer | Observe and operate the local desktop | `@botharness/computer`; local target currently **macOS only**, with the required system permissions; no Docker needed |
| Daily browser: read-only share | Read one explicitly shared document | `@botharness/browser` + source extension; Chrome / Edge, **no clicking, typing or navigation**; real verification uses Chrome |
| Daily Chrome: document control | Observe, click and type in the granted document | Browser component + official Playwright extension; no arbitrary navigation or full managed-browser toolset; navigation / reload ends the document grant |
| Daily Chrome: Profile control | List/select tabs, navigate, observe, click and type | Browser component + BotHarness Profile extension; requires an explicit broader grant, with fewer tools than the managed browser; verified in Chrome |
| Managed Bot Browser | Navigate and run supported web actions in a separate browser | Browser component; local or Docker, with its own browser data, without default access to your daily browser |
| Docker Bot Computer | Operate and watch a container desktop | Computer component + Docker; a different target from the local macOS desktop |

[Daily-browser connection modes and permissions](/docs/daily-browser) · [Target settings](/docs/settings)

## Install optional components

npm `deepseekbot@1.1.0` **does not include** `@botharness/browser` or `@botharness/computer`; enabling access in Settings cannot install them. They are currently private source packages, so their names are not public npm installation commands.

Start with the [README's source development steps](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/README.md#从源码开始使用): install Node ≥22 and pnpm 12.4.2, clone the repository, install dependencies and build, then launch a fresh isolated Profile with the development launcher. It links local Bundles including the optional Computer / Browser components. Enable the appropriate per-Bot Access, choose a target and connect the extension using its guide. Configure a working model and approve one limited test action. Docker is needed for container targets.

[Local source instance and installation details](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/docs/client-bridge.md#7-本地开发环路dsh-020-rc1)
