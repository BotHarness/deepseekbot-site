---
{
  "title": "DeepSeekBot (DSB) vs DS Bot (ds-bot): Two DeepSeek Harness Plugins Compared",
  "description": "Compare DeepSeekBot and DS Bot, two independent DeepSeek Harness plugins: installation, Git memory, team coordination, coding, IM connections, permissions and maintenance.",
  "date": "2026-10-11",
  "tags": ["Comparison", "Guide"]
}
---

**Choose DeepSeekBot if you want inspectable Git Memory, dedicated task delegation, and native IM identities; try DS Bot if you prefer a Chief Bot to help set up your team and group admins to coordinate turn-by-turn replies.** Both plugins turn DeepSeek Harness (DSH) into a persistent Bot team, and both require your own model quota and a running host. The real difference comes down to which workflow fits how you work.

First, a quick note on naming: **DeepSeekBot is maintained by BotHarness (`deepseekbot` on npm), while DS Bot is maintained by FeiZhuLulu (`ds-bot` on npm).** Searching for "DeepSeek Bot" can surface either project—or an unrelated chatbot altogether. DS Bot is not shorthand for DeepSeekBot; both are independent community projects, and neither is an official product from DeepSeek.

This guide is written by the BotHarness team using a baseline of **October 11, 2026**, comparing the published npm packages **DeepSeekBot 1.2.0** and **DS Bot 0.1.0** based on their release metadata and public documentation. Because we did not benchmark both plugins in an identical test environment, we focus on how their workflows operate rather than making claims about speed, success rates, or token savings. (As of October 12, 2026, DS Bot has updated to 0.1.3 on npm and moved its repository to [Fei2411/DeepSeek-Bot](https://github.com/Fei2411/DeepSeek-Bot); our notes below reflect 0.1.0, so check its [CHANGELOG](https://github.com/Fei2411/DeepSeek-Bot/blob/main/CHANGELOG.md) for newer updates. We also abbreviate DeepSeekBot as DSB below.)

## Quick comparison: shared foundation, different workflows

On narrow screens, scroll the table horizontally or jump straight to the workflow walkthroughs below.

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

**Multi-Bot collaboration, persistent memory, scheduled tasks, and local storage are shared by both plugins.** DS Bot 0.1.0 supports all of them and includes a built-in token-usage view. [DS Bot 0.1.0 release notes](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/CHANGELOG.md) The practical differences lie in how you inspect memory, how group conversations are coordinated, where task outputs live, and how external apps connect.

## Daily work: maintaining a weekly competitor brief

Imagine running the same recurring task in either tool: gather release notes and project updates, keep track of open questions, and produce a sourced draft for your review before sharing it with the wider team.

### What stays in memory, and how you correct it

DeepSeekBot's Git Memory is built for people who want to see exactly what changed from week to week. Because memory lives in a Git working tree, you get files, commits, and diffs—and you can push shared memory to GitHub. Of course, version history doesn't guarantee that every saved note is accurate, so you still need to review and prune outdated facts from time to time. [Git Memory guide](/en/docs/channel-sidebar/memory-evolution/)

DS Bot also keeps a full memory history, but it organizes review and sharing around Markdown files and a change journal rather than a Git working tree. It maintains both personal and shared team memory: its 0.1.0 docs describe per-turn memory reviews, source and date annotations, and a `journal.jsonl` log that records edits before and after each change, with Main Bots and group admins able to update shared team memory. [DS Bot memory](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#memory)

When choosing between them, ask whether you prefer managing memory through standard Git workflows or editing summaries and shared notes directly inside a Bot panel—and check which team members have permission to modify shared knowledge.

### Delegation, reminders, and external delivery

DeepSeekBot lets PersonaBots collaborate in Groups while keeping dedicated task Sessions and final reports inside Assignments. If your team already lives in Lark/Feishu, Slack, Discord, or WeChat, giving each Bot its own IM identity makes it easy to bring them into existing channels—though you will still need to configure platform permissions and chat scope (for instance, personal WeChat access doesn't automatically extend to arbitrary group chats). [Connections and capabilities](/en/docs/capabilities/)

DS Bot organizes teamwork around Main Bots and group admins, sends scheduled messages to designated chats, and includes a GitHub connector for working with issues and PRs. Its 0.1.0 documentation does not list the same four-platform IM identity bindings as DeepSeekBot, so check its latest release notes if external chat integrations are a priority.

Whichever plugin you use, it pays to have your Bot deliver a sourced draft in a private chat first. Review the draft and confirm recipients and permissions before sending updates externally, modifying shared memory, or turning on recurring schedules.

## Coding: investigate, edit, test, and deliver a patch

For coding tasks, a good acceptance bar looks the same in any tool: **a clear working directory and branch, a reviewable code diff, the exact test commands run, and the actual test output—before anyone opens a PR.** A chat message saying "I fixed it" is no substitute for the diff and test log.

DeepSeekBot's Workspace and Assignment model helps scope a bug fix to a specific directory and preserves a standalone task report. Keep in mind that a Git Memory diff only shows changes to the Bot's notes, whereas your code repository diff shows the actual implementation changes—you'll want to review each on its own terms.

DS Bot runs its Bots inside DSH Sessions with access to host tools and a documented GitHub connector for repositories, issues, and PRs, making it capable of participating in development workflows rather than just chatting. [DS Bot architecture and tools](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md)

### Reading a web page is different from operating a computer

- **DeepSeekBot 1.2.0** on npm ships with Core, Client, and IM Providers by default, without the Computer/Browser GUI automation Bundle. While GUI and browser automation components exist in the source repository, they are not bundled into the default 1.2.0 npm install. [npm 1.2.0](https://www.npmjs.com/package/deepseekbot/v/1.2.0)
- **DS Bot 0.1.0** includes a Desktop-only Bot browser that extracts structured text from web pages. By design, Bots cannot click, type, scroll, or navigate to new URLs through it. Each Bot's browser uses its own storage partition to separate web sessions, though that browser partitioning is distinct from full OS file or shell sandboxing. [Bot browser limitations](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#bot-browser)

If interactive browser or desktop automation is central to your workflow, double-check the exact package version, host requirements, and permission boundaries before diving in.

## Which one fits your workflow?

**Consider DeepSeekBot first** if you want Git-based memory review and sharing, standalone Assignment records, or independent Bot identities inside Lark, Slack, Discord, or WeChat. In exchange, you manage your own host, model configs, and connected chat accounts, and should keep in mind what ships in the npm package versus the source repo.

**Consider DS Bot first** if you like having a Chief Bot guide team creation, group admins coordinate turn-taking replies, a two-tier personal/team memory panel, and a built-in GitHub connector. Note that 0.1 is an early preview: its features, tools, and storage formats are actively evolving, and the release notes outline host compatibility requirements and single-writer constraints. [Release and limitations](https://github.com/FeiZhuLulu/DeepSeek-Bot/releases/tag/v0.1.0)

If your current setup already handles your daily tasks well, there is no rush to switch. When you do want to compare them hands-on, try running one briefing task and one small bug fix through both using the same test inputs and acceptance criteria.

## Installation and migration FAQ

### How do I make sure I install the right DeepSeek Bot?

Check the GitHub organization and npm package name: this site covers **BotHarness/DeepSeekBot → `deepseekbot`**, while the other project is **FeiZhuLulu/DeepSeek-Bot → `ds-bot`**. They are two separate projects rather than different versions of the same plugin. [Install DeepSeekBot](/en/docs/installation/) · [Install DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/README.md#install)

### Since both are open source, are they completely free to run?

Both projects are free to use under their open-source licenses, but you still pay for model API calls, hosting, and ongoing maintenance. In-app token counters are helpful estimates rather than official billing statements, and having multiple Bots chime in during group chats will naturally increase model usage.

### Can they share Bots, memory, or browser sessions directly?

No—the two projects use their own storage layouts and configuration formats. If you want to try the other plugin, back up your existing DSH Profile first, spin up a fresh Profile for the test, and configure its credentials and permissions separately.

### How do these compare to other personal AI agents?

If you are also weighing managed cloud agents like Grok Bot, Meta Muse, Manus Cue, or ChatGPT Dots, check out our [personal AI agents comparison for work and coding](/en/blog/personal-ai-agents-comparison/). Both DSH plugins covered here run on your own host machine, offering local control in exchange for managing your own environment.
