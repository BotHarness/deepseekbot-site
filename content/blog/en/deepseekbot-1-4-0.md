---
{
  "title": "DeepSeekBot 1.4.0: Tob, panels and approvals",
  "description": "What changed since 1.3.1: easier Bot team management, a flexible workspace, and changes to chat, the CLI and the mobile development app.",
  "date": "2026-10-19",
  "tags": ["Release", "DeepSeekBot"]
}
---

**DeepSeekBot 1.4.0 is published on npm.** Here are the core changes since 1.3.1; see the [complete changelog](/en/changelog/#v1.4.0) for every entry. The [installation guide](/en/docs/installation/) now selects the exact `deepseekbot@1.4.0` package.

The focus is making a team of Bots with persistent identities and memory easier to manage: see what is happening, handle decisions and arrange the workspace around your work.

## Tob and Home: start with a request

Meet **Tob**, the local steward. Start a conversation from Home to create a Bot with a persona and initial memory, create a group, invite members, or adjust models and supported runtime settings. Management actions retain the existing approvals and permission checks.

Home keeps its composer and an editable greeting, followed by just two cards: **Token history** and **Bot activity**. They sit side by side in a wide panel and stack in a narrow one. Click a Bot to return to its existing DM. Suggested questions fill the draft first; you decide when to send.

### Onboarding that ends in a real conversation

The new Desktop journey covers model setup, creating a Bot and group with Tob, and arranging panels. Finish by clicking the actual Home title to close it and enter the original Tob DM. Newly created Bots no longer receive an automatic welcome message; completed or skipped onboarding stays settled for existing users.

## A workspace you can arrange

In supported wide desktop layouts, open the panels you need, drag to split them, and resize messages, sessions, memory, schedules, Browser and Computer controls. Panels inside a conversation can form nested rows and columns, with layouts remembered per channel.

This round also fixes clipped rounded borders on panel switches, size jumps while dragging dividers, and lost proportions after reopening panels. Toggling Home preserves the surrounding layout. On macOS Desktop, the compact icon-and-title area toggles or drags a panel; blank header and control-rail space moves the window, reducing accidental panel drags.

## Automatic approvals with rules you can read

Choose a built-in approval template or write your own in Markdown, and optionally select a separate reviewer model. Decisions leave an inspectable record. Uncertainty or an error sends the request back to you.

Rejected operations appear in your Inbox, where you can allow that exact call once. Repeated rejections pause automatic approval for the session when its rejection thresholds are reached. Reviews of applicable secret tools see redacted arguments, never secret values.

## Chat and messaging: find, follow and resume

- **Everyday chat:** drag in attachments, search within a conversation, react, return to unread messages, mute a channel, and use quick switching or custom shortcuts. A Bot can also create another Bot from a conversation.
- **Model selection:** use the Bot context menu or `/model` and `/effort` in its DM to choose a model and reasoning effort.
- **IM commands:** in an authorized DM, `/help`, `/status`, `/model`, `/stop`, `/new` and other commands run directly without starting a model turn. Commands that change state still check permissions.
- **WeChat continuity:** optionally mirror the QR-bound account's DM locally or forward local DM messages back to that same account. Both switches start off; local approval and private-input cards stay local.
- **Group reliability:** fixes for typed Bot mentions and wakeups, plus optional per-group reply review to check an old draft against new messages, yield to an existing answer, or explicitly recover after interruption.

## More CLI coverage and control over memory

The online Host CLI expands Memory, schedule, group, Inbox, model, usage, IM, marketplace and update management. Browser, Computer and applicable Bot tools can run directly without a model; `bot-trace` helps isolate failures.

Choose a memory directory when creating a Bot, or move an existing Bot's Memory to another folder while preserving chat and memory history. The chat composer footer also lets you show, hide and reorder model, workspace, Token and generation-speed items.

## The mobile development app

The development app adds or expands QR pairing, switching computers, native group chats, attachments, speech-to-text, approval and question cards, notifications, schedules and usage views. With permission, you can watch and take over a Browser or local Computer. Other changes address long-reply rendering, keyboard obstruction, back navigation and system text sizing.

These are **mobile development app changes**. An npm update does not install the phone app, and this npm release does not announce an App Store or Google Play release. Notifications and device capabilities depend on the build and configuration.

Separately, development/UAT cloud collaboration now has workspaces, channels, invitations and guests, channel Agents and health checks. It remains a separate trial scope, rather than a public cloud-service launch.

## Compatibility and release timing

1.4.0 declares DSH admission of `>=0.2.0-rc.2 <0.3.0-0`. The exact released packages passed fresh installation, Host startup, Bot/DM creation and restart persistence on **DSH 0.2.0-rc.2 and 0.2.1-rc.2**. Use 0.2.1-rc.2 as the recommended version. Admission of other 0.2.x versions does not qualify every runtime.

Back up your Profile before upgrading. This release includes schema upgrades, so returning to an older binary may require restoring the pre-upgrade backup. Start with the [installation guide](/en/docs/installation/) or the [GitHub Release](https://github.com/BotHarness/DeepSeekBot/releases/tag/v1.4.0).

### Related links

For complete release details and source changes, explore the [canonical changelog](https://github.com/BotHarness/DeepSeekBot/blob/df454d5cebda2a8e4c1300f939267f295571f0f9/CHANGELOG.md) and the [GitHub Release](https://github.com/BotHarness/DeepSeekBot/releases/tag/v1.4.0).
