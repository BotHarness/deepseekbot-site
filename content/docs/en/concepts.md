---
{
  "title": "Concepts",
  "description": "How BOT mode, channels, sections, inboxes, bridges, sessions, and Builder work together.",
  "order": 30,
  "source": "apps/docs/src/content/docs/docs/concepts.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

BotHarness gives you **PersonaBots**: agents with a persistent persona and memory that outlive any single session. In the DSH interface, you work with them in **BOT mode**.

## Two modes

- **DSH mode** is the native workspace view: sessions live inside folders, and you pick a project directory before starting work.
- **BOT mode** is chat-first: you talk directly to Bots in DMs or group chats, while sessions run behind the scenes as execution details.

Switch to **BOT mode** from the entry right below *New Session* in the sidebar. Clicking *New Session* takes you back to DSH mode at any time.

## Talking to a Bot

- Clicking a Bot opens a **DM**—a clean conversation view where internal thinking and raw tool traces stay out of the way.
- **Group chats** work just like a team messaging app: create a channel, add a few specialized Bots (and yourself), and let everyone collaborate in one place.
- Send a message and the Bot replies once it has processed your request. Unread activity shows as a badge dot until you view it.

## Channels and sections

A **Channel** is a conversation space—either a **DM** (one Bot and you) or a **group chat** (multiple participants). Channel history is stored locally on your machine as readable files, so your transcripts stay yours.

**Channel sections** are optional collapsible folders in the left sidebar for organizing your channels. They are purely a local layout preference and are never included when you export or share a Bot.

## Bot Inbox and your notifications

Each Bot has its own **Bot Inbox** holding incoming events from local channels and external messaging apps. A Bot works through its inbox much like a person does: reading messages, marking them handled, and taking action, while paging through older channel history on demand when extra context is needed.

Meanwhile, the dashboard's notification inbox gathers everything across all your Bots that needs **your** attention or approval.

For each channel, you can set a Bot's wake policy to `all` (read every message, the default), `mentions` (wake only when `@`-mentioned), or `muted`. A direct `@` mention always wakes the Bot.

## Sessions, the right sidebar, and workspaces

A Bot performs its reasoning and tool calls inside **sessions**. Opening the right-hand Channel sidebar in any DM or group shows the Bot's active and recent sessions, their working directory, and their current status.

Every Bot has a long-lived **main session** that watches its Bot Inbox, handles direct conversation, and dispatches background task sessions (Assignments) for heavier work.

Bots aren't locked to a single folder—they can work across your computer. Each session runs in a specific workspace directory; you can pre-authorize trusted folders in the sidebar, and whenever a Bot needs access outside its authorized folders, DSH prompts you for approval first.

## External identities and bridges

Through **External identities** and **External connectors**, you can connect external messaging platforms—such as Lark / Feishu, QQ, WeChat, Slack, and Discord—to a Bot's Inbox or sync them into a local Channel. The Bot receives messages from those platforms and replies directly in the original external thread or chat.

Every external message retains its full provenance (platform, conversation, and sender) so context stays clear across channels.

## Builder and creating Bots

When you open Bot mode for the first time with no Bots, the built-in helper (Tob / Builder) walks you through creating your first Bot by chatting. Afterwards, you can click the **+** button at any time to create new Bots either by chatting with the helper or by filling out a form.

## Memory

A Bot's persona and memory belong to the Bot itself, not to an individual session. The same memory travels with the Bot across every DM, group chat, external messaging app, and workspace folder. Conversation history lives in channels, while low-level execution traces stay in session logs.
