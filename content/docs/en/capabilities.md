---
{
  "title": "Connections and optional tools",
  "description": "Choose an IM connection or computer/browser target, with release and permission boundaries.",
  "order": 11,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/en/capabilities.md"
}
---

**Check your installed version:** the current npm release is **deepseekbot v1.4.1** (released on 2026-10-20), which bundles Core, Client, Browser (`@botharness/browser`), Computer (`@botharness/computer`) and the qualified IM Provider `4.32.0-botharness.21` (recommended on **DSH `0.2.1-rc.2`**, also qualified on `0.2.0-rc.2`, declared range `>=0.2.0-rc.2 <0.3.0-0`). The table below lists available platform connections; the QQ qualification record identifies the historical build used for real group-chat verification rather than promising identical controls in every older release.

[Installation guide](/docs/installation) · [All user guides](/docs/overview) · [Release notes](https://github.com/BotHarness/DeepSeekBot/releases/tag/v1.4.1)

## Connect an IM identity

Supported connections include **QQ, Lark / Feishu, Slack, Discord and personal WeChat**. Verify a real local Bot DM reply before connecting an app; platform scopes differ:

| Platform | Current scope | Connection guide |
| --- | --- | --- |
| QQ | Official QQ Bot app; PersonaBot binding, group text @ replies and retained authorization/binding after Host restart have been verified | [QQ: registration, setup and group verification](/docs/qq-connection) |
| Lark / Feishu | Application bot; mentions in groups it has joined, with intake and replies governed by platform and conversation rules | [Lark / Feishu](/docs/lark-connection) |
| Slack | Conversations accessible to the app; channel mentions reply in the original thread, while DMs follow the DM path | [Slack](/docs/slack-connection) |
| Discord | The bound Bot app; server, channel and message-content permissions constrain intake, with no promise to read arbitrary channels | [Identity and conversation management](/docs/channel-sidebar/external-identities) · [Discord qualification](https://github.com/BotHarness/BotHarness/pull/1125) |
| Personal WeChat | DMs between the QR-scanning owner and the WeChat Bot; excludes groups, other contacts and Enterprise WeChat | [Personal WeChat](/docs/wechat-connection) |

**QQ has passed real group-chat verification.** Current `deepseekbot@1.4.1` ships on DSH `0.2.1-rc.2` with bundled QQ Provider `4.32.0-botharness.21`. The recorded group-chat qualification used source candidate `1.2.1-vps.20261012.sha031a14db` (commit `031a14db43af5b3bf52e76b01c30e27828e6e9c9`), DSH `0.2.0-rc.1` and qualified QQ Provider `4.32.0-botharness.19`; both the initial reply and a fresh reply after restart appeared in the original group (distinct from the `.16` Provider shipped in historical npm v1.2.1). Follow the [complete QQ guide](/docs/qq-connection) to check official App eligibility, platform environment and Provider, then bind it to the intended Bot. Only one Host receives an App. Images, full-group message intake and arbitrary proactive messages were outside that verification.

## Bind an app in newer builds

These are newer binding steps. Older releases can have a different layout and intake policy; older Profile screenshots are historical records. Check your installed version and release ledger before looking for newer, unreleased controls.

1. Connect the platform app in **Settings → IM bots**, keeping credentials local. For an existing QQ App, use **QQ → Manual setup**; pair personal WeChat here by QR code.
2. Open the intended Bot DM, expand **External identities** in its sidebar, then choose **Bind app**.
3. Select a connected app. An app belongs to one Bot; apps owned by another Bot cannot be selected. Resolve connection problems first.
4. Confirm **Ready** and send a platform test: use a real @ mention in an authorized QQ, Lark or Slack test group/channel, use the QR owner's DM for WeChat, or a test conversation the Discord app can read. Inspect the Bot Inbox and the reply actually rendered on the original platform.
5. New conversations follow **Automatic** or **Ask first**. With Ask first, allow the conversation and send a fresh message; earlier messages are not backfilled. Mute, set rules or block per conversation.

There is no need to pre-register every group as a send target or manually authorize each group in an old Profile. Platform permissions and app connectivity still apply, and external messages are not automatically mirrored into the local DM.

[Open the External identities guide](/docs/channel-sidebar/external-identities)

## Choose a computer or browser target

In **deepseekbot v1.4.1**, `@botharness/computer` and `@botharness/browser` are bundled with the public npm package (in v1.2.1 and at [historical source commit `636a5a6c`](https://github.com/BotHarness/DeepSeekBot/tree/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192) they were source-only components, and Local Computer was macOS-only). Computer Access and Browser Access remain off by default and are enabled separately per Bot; by default, the first action in each Session requires approval. A daily browser also requires the user to connect it and grant page or profile access.

| Target | What it can do | Requirements and scope |
| --- | --- | --- |
| Local Computer | Observe and operate the local desktop | `@botharness/computer` (bundled in `deepseekbot@1.4.1`); supports **macOS, Windows and Linux** with required system permissions and no Docker (was macOS-only at historical commit `636a5a6c`) |
| Daily browser: read-only tab share | Read one explicitly shared document | `@botharness/browser` + source extension; Chrome / Edge, read-only, **no click, type or navigate**; verified in Chrome |
| Daily Chrome: current-document control | Observe, click and type in the authorized document | Browser component + official Playwright extension; no arbitrary navigation or full managed-browser toolset; navigation/reload ends authorization |
| Daily Chrome: profile control | List/select tabs, navigate, observe, click and type | Browser component + BotHarness profile extension; requires explicit broader permission; not identical to every managed-browser tool, verified in Chrome |
| Managed Bot Browser | Navigate and run supported web actions in a separate browser | Browser component; local or Docker, with its own browser data, without default access to your daily browser |
| Docker Bot Computer | Operate and watch a container desktop | Computer component + Docker; an isolated container desktop separate from the host desktop |

[Daily-browser connection modes and permissions](/docs/daily-browser) · [Target settings](/docs/settings)

## Install optional components

npm `deepseekbot@1.4.1` **already includes** `@botharness/browser` and `@botharness/computer` (earlier releases such as `deepseekbot@1.2.1` did not bundle them). After installing `deepseekbot@1.4.1`, enable per-Bot Browser Access or Computer Access in Bot settings and select your target. Container targets still require Docker, and daily-browser modes still require loading the unpacked browser extension from a repository checkout ([daily-browser guide](/docs/daily-browser)). Optional standalone plugins such as [VRM Companion (`@botharness/vrm-companion@0.1.0`)](/en/plugins/vrm-companion/) are installed separately with `dsh plugin --profile <your-profile> add @botharness/vrm-companion@0.1.0`.

To run from source or load unpacked extensions from a checkout, follow the [README's source development steps](https://github.com/BotHarness/DeepSeekBot/blob/main/README.md#从源码开始使用) (historical snapshot: [`636a5a6c`](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/README.md#从源码开始使用)): install Node ≥22 and pnpm 12.4.2, clone the repository, install dependencies and build, then launch a fresh isolated Profile with the development launcher. Enable the appropriate per-Bot Access, choose a target and connect the extension using its guide. Configure a working model and approve one limited test action.

[Local source instance and installation details](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/client-bridge.md#7-本地开发环路dsh-020-rc2)
