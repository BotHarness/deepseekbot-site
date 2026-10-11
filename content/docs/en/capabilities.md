---
{
  "title": "Connections and optional tools",
  "description": "Choose an IM connection or computer/browser target, with release and permission boundaries.",
  "order": 11,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/en/capabilities.md"
}
---

**Check your installed version:** the current npm release is **deepseekbot v1.2.1** (checked on 2026-10-12), with Core, Client and IM Provider `4.32.0-botharness.16`, but no optional Computer / Browser components. The table lists available platform connections; the QQ qualification below identifies the tested build, rather than promising identical controls in every older release.

[Installation guide](/docs/installation) · [All user guides](/docs/overview) · [Release notes](https://github.com/BotHarness/DeepSeekBot/releases/tag/v1.2.1)

## Connect an IM identity

Supported connections include **QQ, Lark / Feishu, Slack, Discord and personal WeChat**. Verify a real local Bot DM reply before connecting an app; platform scopes differ:

| Platform | Current scope | Connection guide |
| --- | --- | --- |
| QQ | Official QQ Bot app; PersonaBot binding, group text @ replies and retained authorization/binding after Host restart have been verified | [QQ: registration, setup and group verification](/docs/qq-connection) |
| Lark / Feishu | Application bot; mentions in groups it has joined, with intake and replies governed by platform and conversation rules | [Lark / Feishu](/docs/lark-connection) |
| Slack | Conversations accessible to the app; channel mentions reply in the original thread, while DMs follow the DM path | [Slack](/docs/slack-connection) |
| Discord | The bound Bot app; server, channel and message-content permissions constrain intake, with no promise to read arbitrary channels | [Identity and conversation management](/docs/channel-sidebar/external-identities) · [Discord qualification](https://github.com/BotHarness/BotHarness/pull/1125) |
| Personal WeChat | DMs between the QR-scanning owner and the WeChat Bot; excludes groups, other contacts and Enterprise WeChat | [Personal WeChat](/docs/wechat-connection) |

**QQ has passed real group-chat verification.** The tested source candidate was `1.2.1-vps.20261012.sha031a14db`, with DSH `0.2.0-rc.1` and qualified QQ Provider `4.32.0-botharness.19`; both the initial reply and a fresh reply after restart appeared in the original group. This does not qualify the `.16` Provider shipped with npm v1.2.1. Follow the [complete QQ guide](/docs/qq-connection) to check official App eligibility, platform environment and Provider, then bind it to the intended Bot. Only one Host receives an App. Images, full-group message intake and arbitrary proactive messages were outside this verification.

## Bind an app in newer builds

These are newer binding steps. Older releases can have a different layout and intake policy; older Profile screenshots are historical records. Check your installed version and release ledger before looking for newer, unreleased controls.

1. Connect the platform app in **Settings → IM bots**, keeping credentials local. For an existing QQ App, use **QQ → Manual setup**; pair personal WeChat here by QR code.
2. Open the intended Bot DM, expand **External identities** in its sidebar, then choose **Bind app**.
3. Select a connected app. An app belongs to one Bot; apps owned by another Bot cannot be selected. Resolve connection problems first.
4. Confirm **Ready** and send a platform test: use a real @ mention in an authorized QQ, Lark or Slack test group/channel, use the QR owner's DM for WeChat, or a test conversation the Discord app can read. Inspect the Bot Inbox and the reply actually rendered on the original platform.
5. New conversations follow **Automatic** or **Ask first**. With Ask first, allow the conversation and send a fresh message; earlier messages are not backfilled. Mute, set rules or block per conversation.

You do not need to save every group as a send target or authorize each group in the old Profile. Platform permissions and app connection state still apply; external messages are not automatically mirrored into the local DM.

[Open the External identities guide](/docs/channel-sidebar/external-identities)

## Choose a computer or browser target

The following targets and permissions retain their [recorded source qualification at `636a5a6c`](https://github.com/BotHarness/DeepSeekBot/tree/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192). These are **optional source components**. Computer Access and Browser Access are separate; each Session asks before its first action by default. Daily-browser access also needs an explicit connection and a document or Profile grant from the user.

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

npm `deepseekbot@1.2.1` **does not include** `@botharness/browser` or `@botharness/computer`; enabling access in Settings cannot install them. They are currently private source packages, so their names are not public npm installation commands.

Start with the [README's source development steps](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/README.md#从源码开始使用): install Node ≥22 and pnpm 12.4.2, clone the repository, install dependencies and build, then launch a fresh isolated Profile with the development launcher. It links local Bundles including the optional Computer / Browser components. Enable the appropriate per-Bot Access, choose a target and connect the extension using its guide. Configure a working model and approve one limited test action. Docker is needed for container targets.

[Local source instance and installation details](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/docs/client-bridge.md#7-本地开发环路dsh-020-rc1)
