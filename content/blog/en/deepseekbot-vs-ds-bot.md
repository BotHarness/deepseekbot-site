---
{
  "title": "DeepSeekBot vs DS Bot: Two DeepSeek Harness Plugins Compared",
  "description": "Compare DeepSeekBot and DS Bot, two independent DeepSeek Harness plugins: installation, Git memory, team coordination, coding, IM connections, permissions and maintenance.",
  "date": "2026-10-11",
  "tags": ["Comparison", "Guide"]
}
---

**Consider DeepSeekBot for inspectable Git Memory, separate task delegation and IM identities; try DS Bot if you prefer a Chief to set up the team and group admins to coordinate replies.** Both turn DeepSeek Harness (DSH) into a persistent Bot team. Both require your own model quota and a running host. The useful comparison is how their working mechanisms fit your tasks.

First, identify the projects: **DeepSeekBot is maintained by BotHarness and uses npm package `deepseekbot`; DS Bot is maintained by FeiZhuLulu and uses `ds-bot`.** A search for “DeepSeek Bot” can find either, or an unrelated chatbot. DS Bot is not an abbreviation for DeepSeekBot. Both are independent community projects, not official DeepSeek products.

This article is written by the BotHarness team. Its **October 11, 2026** baseline is the published npm **DeepSeekBot 1.2.0** and **DS Bot 0.1.0**. It compares release metadata and published documentation. We have not run both in a matched environment, so there are no claims about measured speed, success rates or token savings.

## Quick comparison: shared foundation, different mechanisms

On narrow screens, scroll the table sideways or continue to the task walkthroughs below.

<div class="table-wrap comparison-table" role="region" aria-label="DeepSeekBot and DS Bot quick comparison" tabindex="0">

| Dimension | DeepSeekBot 1.2.0 | DS Bot 0.1.0 |
| --- | --- | --- |
| Identity and installation | BotHarness/DeepSeekBot; `deepseekbot`; MIT | FeiZhuLulu/DeepSeek-Bot; `ds-bot`; Apache-2.0 |
| Host and models | DSH plugin with your model configuration and a running host | DSH plugin with your models; release documentation uses DSH 0.2.1-alpha.1 as its test baseline |
| Memory and review | PersonaBot memory is a Git working tree: files, branches, commits, diffs and GitHub sharing | Personal and shared team memory in Markdown, with sources, dates, an editing panel and a change journal |
| Coordination and delivery | Groups, mentions and Assignments with separate Sessions and reports | Chief/Main Bots manage the team; group admins answer by default and involve members in turn |
| Connections and coding | Lark/Feishu, Slack, Discord and WeChat identities; host files and terminal within authorized Workspaces | Documented GitHub connector for repositories, issues and PR tools; Bots use DSH tools and models |
| Permissions and browser scope | Workspace access and approval settings; published npm package excludes Computer/Browser Bundles | Main Bot, group-admin and member management roles; Desktop Bot browser reads pages without clicking or typing |
| Setup and cost | Configure DSH, models and connected accounts; pay for model calls, hosting and maintenance | Configure DSH and models; model and hosting costs also apply, and group participation adds calls |

</div>

**Multiple Bots, persistent memory, schedules and local data are shared capabilities.** DS Bot 0.1.0 documents all of them and a token-usage view. Choose by how you inspect memory, coordinate members, review outputs and connect applications. [DS Bot 0.1.0 release notes](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/CHANGELOG.md)

## Daily work: maintain a weekly competitor brief

Use the same task for both: collect releases and project updates, preserve unresolved follow-ups, and deliver a sourced draft for human review before sending it outside the team.

### What stays in memory, and how you correct it

DeepSeekBot’s Git Memory suits readers who want to inspect what changed this week. Files, commits and diffs provide reviewable history; GitHub can carry shared memory. This does not make every remembered fact correct. You still need to identify and correct obsolete information. [Git Memory guide](/en/docs/channel-sidebar/memory-evolution/)

DS Bot maintains personal and team memory. Its versioned documentation describes per-turn memory review, source/date annotations and a `journal.jsonl` recording changes. Main Bots and group admins can write shared team memory. It would be inaccurate to call this “no memory history”: its review and sharing mechanisms differ from a Git working tree. [DS Bot memory](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#memory)

Decide whether you want ordinary Git workflows for memory, or a Bot panel for summaries and entry edits with team notes. Check who may change shared information in either setup.

### Delegation, reminders and external delivery

DeepSeekBot lets PersonaBots coordinate in Groups and retain separate task Sessions and reports through Assignments. IM identities may help when your work already happens in Lark, Slack, Discord or WeChat. Platform permissions and conversation scope still need configuration; personal WeChat support does not mean arbitrary group-chat support. [Connections and capabilities](/en/docs/capabilities/)

DS Bot organizes team management through Main Bots and group admins, delivers scheduled messages to chats, and provides a GitHub connector for issue/PR work. Equivalent four-platform IM identity binding is unverified in its 0.1.0 documentation; that is not a claim that every external integration is unavailable.

For either product, ask for a private, sourced draft first. Specify recipients and authorization before external delivery, shared-memory changes or recurring execution.

## Coding: investigate, edit, test and deliver a patch

Use the same acceptance criteria: **an explicit working directory and branch, a reviewable code diff, test commands and actual results, then a decision about opening a PR.** A chat message saying “fixed” is not the deliverable.

DeepSeekBot’s Workspace and Assignment mechanisms can give a repair an explicit scope and a separate report. A Git Memory diff records memory edits; a code-repository diff records implementation edits. Review each for its own purpose. Inspectable memory does not establish superior code quality.

DS Bot runs its Bots in DSH Sessions using host tools and documents a GitHub connector. It can therefore participate in development rather than only chat. A connector does not prove that cloning, building, testing and submitting a patch work end to end in your environment; we have not tested that workflow here. [DS Bot architecture and tools](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md)

### Reading a page is different from operating a computer

- The published **DeepSeekBot 1.2.0** package includes Core, Client and IM Provider by default, with no Computer/Browser GUI automation Bundle. Current-source automation and changes to default bundling are not capabilities installed by this published package. [npm 1.2.0](https://www.npmjs.com/package/deepseekbot/v/1.2.0)
- **DS Bot 0.1.0** documents a Desktop-only Bot browser that reads structured page text. Bots cannot click, type, scroll or open addresses through it. Per-Bot browser storage partitions do not establish complete isolation of system files or Shell access. [Bot browser limitations](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#bot-browser)

If computer or browser operation is central to your task, verify the installed version, host and permissions before choosing. Product names and screenshots do not establish complete GUI automation.

## Which should you choose?

**Consider DeepSeekBot first** when Git review/sharing for memory, separate Assignment records or independent IM identities match your work. You take responsibility for the host, models and connected accounts, and must distinguish published packages from source components.

**Consider DS Bot first** when you prefer Chief-led setup, admin-coordinated group replies, personal/team memory and a built-in GitHub tools entry. Its 0.1 release is an early preview: the documentation notes evolving features, tools and storage formats, host compatibility limits and a single-writer rule. [Release and limitations](https://github.com/FeiZhuLulu/DeepSeek-Bot/releases/tag/v0.1.0)

Keep your current tool if it already delivers what you need. Before switching, compare one brief and one repair using the same inputs and acceptance criteria. Start with test data you are comfortable providing.

## Installation and migration FAQ

### How do I install the right DeepSeek Bot?

Check the owner and package: this site covers **BotHarness/DeepSeekBot → `deepseekbot`**; the other project is **FeiZhuLulu/DeepSeek-Bot → `ds-bot`**. They are not different upgrade versions of one product. [Install DeepSeekBot](/en/docs/installation/) · [Install DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/README.md#install)

### Does open source mean no costs?

Both licenses allow use under their terms. Model calls, hosting, storage and maintenance can still cost money. Token counts are not a billing statement, and multiple group participants affect calls. This comparison has no measured cost winner.

### Can they share Bots, memory or browser logins directly?

Cross-project import and storage compatibility are unverified here. Back up your existing Profile, try the other product in a fresh DSH Profile, and configure its permissions and credentials separately. Do not expect replacing the plugin to convert old data automatically.

### What about other personal AI agents?

For managed Grok Bot, Meta Muse, Manus Cue or ChatGPT Dots, see our [personal AI agents comparison for work and coding](/en/blog/personal-ai-agents-comparison/). Both DSH plugins here depend on your own running host; managed-cloud availability does not automatically apply to them.
