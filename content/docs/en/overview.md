---
{
  "title": "Overview",
  "description": "What BotHarness is, why it exists, and how its core pieces fit together.",
  "order": 10,
  "source": "apps/docs/src/content/docs/docs/overview.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

BotHarness is a **plugin layer built on top of DeepSeek Harness (DSH)** that gives LLM agents a persistent identity: the **PersonaBot**.

Most agent harnesses work one session at a time—at best sharing a loose "cloud memory" between chats, without a persistent Bot that keeps its own persona and carries work across conversations. BotHarness fills that gap:

- **PersonaBot**: a first-class digital teammate with its own persona, cross-session memory, state, channel bindings, and the ability to handle multiple sessions at once
- **File-first memory**: stored as local Markdown files with frontmatter, directory-tree context injection, tool-driven updates, and Git version history
- **Delegation and background work**: mention `@PersonaBot` to hand off a task; the Bot works on it in the background, reports back when done, and asks for tiered approval when needed
- **No DSH fork required**: delivered as a standard SDK and plugin bundle, with messaging integrations powered by providers like `dsh-im`

## Two names to know

| Name | What it is |
| --- | --- |
| **BotHarness** | The platform layer: PersonaBot entities, memory, state management, and task orchestration |
| **Tobs (formerly DeepSeekBot)** | The flagship app plugin: brings PersonaBots into the DSH sidebar (create Bots, `@`-delegate tasks, collaborate across chats) and connects external messaging apps like Lark / Feishu, QQ, WeChat, and Slack |

## Where to start

- [Concepts](/docs/concepts): BOT mode, channels, sections, inboxes, bridges, sessions, and Builder
- [Quickstart](/docs/quickstart): install the plugin, configure a model provider, and create your first Bot
- [Channel sidebar](/docs/channel-sidebar): Memory files and evolution, Sessions, Bot Inbox, Workspace Grants, groups, and display controls
- [Connections and optional tools](/docs/capabilities): messaging app integrations, daily browser collaboration, and desktop control
- [Changelog](/changelog): see what shipped in each release
