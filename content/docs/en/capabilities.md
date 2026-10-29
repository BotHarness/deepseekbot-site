---
{
  "title": "Connections and optional tools",
  "description": "Connect messaging apps to your Bots and configure optional browser or desktop execution targets.",
  "order": 11,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/en/capabilities.md"
}
---

The plugin package bundles the core runtime, web client, browser integration (`@botharness/browser`), desktop integration (`@botharness/computer`), and the IM connection provider. You can connect messaging apps to individual PersonaBots and optionally enable browser or computer access per Bot.

[Installation guide](/docs/installation) · [All user guides](/docs/overview) · [Changelog](/changelog)

## Connect a messaging app (IM)

Before connecting an external app, send a quick message in a local Bot DM to confirm your model replies properly. Supported platforms include **QQ, Lark / Feishu, Slack, Discord, and personal WeChat**:

| Platform | Scope and behavior | Connection guide |
| --- | --- | --- |
| QQ | Official QQ Bot app; supports binding to a PersonaBot, replying to `@` mentions in QQ groups, and retaining connections across restarts | [QQ Bot: registration to group replies](/docs/qq-connection) |
| Lark / Feishu | Custom organization app bot; handles DMs and `@` mentions in groups it has joined, plus optional ordinary-message intake, topic following, and approval cards | [Connect to Lark / Feishu](/docs/lark-connection) |
| Slack | Channels and DMs accessible to the app; channel `@` mentions reply in the same thread, while DMs reply directly in the DM | [Connect to Slack](/docs/slack-connection) |
| Discord | Bound Discord Bot app; message intake follows the server, channel, and message-content permissions granted to the bot | [External identities and conversation management](/docs/channel-sidebar/external-identities) |
| Personal WeChat | 1:1 DMs between your WeChat account (that scanned the QR code) and the WeChat Bot—supporting text, files, images, voice, video, and quotes; does not include group chats, other contacts, or WeCom | [Connect personal WeChat](/docs/wechat-connection) |

### How to bind an app to a Bot

1. Connect the platform account in **Settings → IM bots** (for example, use **QQ → Manual setup** for an existing QQ Bot, or scan the QR code for personal WeChat). Credentials stay stored locally on your machine.
2. Open the target Bot's DM, expand **External identities** in the right-hand sidebar, and click **Bind app**.
3. Select the connected app. Each external app belongs to one Bot at a time.
4. Once the status shows **Ready**, send a test message on the platform (such as an `@` mention in a test QQ, Lark, or Slack group, or a DM to your paired WeChat Bot) and check both the Bot Inbox and the reply on the platform.
5. Choose how **New conversations** are handled: **Automatic** admits new chats on their first message, while **Ask first** holds new chats in a waiting list until you approve them. You can also mute, customize intake rules, or block individual conversations.

[Learn more in the External identities guide](/docs/channel-sidebar/external-identities)

## Choose a computer or browser target

`@botharness/computer` and `@botharness/browser` come bundled with the plugin package. To keep you in control, **Computer Access** and **Browser Access** are off by default and enabled separately for each Bot. By default, the first action in each session also asks for your approval.

| Target | What it can do | Requirements and scope |
| --- | --- | --- |
| Local Computer | View and operate your computer's desktop | Built-in `@botharness/computer`; supports **macOS, Windows, and Linux** with standard OS screen-recording and accessibility permissions (no Docker needed) |
| Daily browser: read-only tab share | Read a single web page you explicitly share | `@botharness/browser` + browser extension; works in Chrome and Edge, strictly read-only (**no clicking, typing, or navigation**) |
| Daily Chrome: current-document control | Observe, click, and type within the currently authorized page | Browser component + official Playwright extension; limited to the active document—navigating or reloading ends the authorization |
| Daily Chrome: profile control | List/switch tabs, navigate, observe, click, and type | Browser component + BotHarness profile extension; requires explicit permission for broader tab control |
| Managed Bot Browser | Browse and interact with web pages in a separate browser instance | Browser component; runs locally or in Docker with its own isolated profile, separate from your personal browser |
| Docker Bot Computer | View and operate an isolated container desktop | Computer component + Docker; runs inside an isolated container desktop separate from your host OS |

[Daily browser connection modes and permissions](/docs/daily-browser) · [Target settings guide](/docs/settings)

## Optional plugins and extensions

- To connect your **daily browser**, follow the [Daily browser guide](/docs/daily-browser) to load the browser extension and pair your tab or profile.
- To use container-isolated targets like **Docker Bot Computer**, make sure Docker is installed and running on your machine.
- Standalone optional plugins such as [VRM Companion (`@botharness/vrm-companion@0.2.0`)](/en/plugins/vrm-companion/) can be installed separately with `dsh plugin --profile <your-profile> add @botharness/vrm-companion@0.2.0`.
