# Four Tobs article intents

Issue: [#144](https://github.com/BotHarness/deepseekbot-site/issues/144).

This batch adds four paired English/Chinese guides. It does not change existing articles, the homepage or an observed ranking target. The recurring character-memory experiment is a separate project; this batch contains no new runtime, recall-quality or cost comparison.

| Slug              | Reader question                              | Distinct contribution                                                                      |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| ai-group-chat     | How do I talk with several Bots in one room? | Original scene setup, member attention and shared conversation boundaries                  |
| ai-agent-teams    | How do Bots divide work I can review?        | Source notes → brief → draft → review, explicit handoffs and permissions                   |
| team-of-bots      | What is Tobs, and why keep a team?           | Product name, persistent identity, inspectable memory, starting with one Bot               |
| ai-character-chat | How do I shape one character and its memory? | Original persona, lasting versus temporary details, memory inspection and later-use checks |

Each article links to the others where their reader questions diverge. They are not four spelling variants of one target. Team of Bots is brand education; exact-phrase demand was not established. The character guide links the existing Day 0 diary without upgrading that evidence to cross-day recall.

## Evidence and claims

All workflows are suggested setups, with sample user requests or original persona snippets. No generated model reply, successful completed task, fresh product screenshot or comparative benchmark is invented.

Current first-party product references checked October 27, 2026:

- [Group management](https://tobs.app/en/docs/channel-sidebar/groups/): per-member attention policies; an @ does not mute other members; Done includes failed and stopped Assignments.
- [Soul and Core Memory](https://tobs.app/en/docs/soul-and-core-memory/): standing file snapshots, other files read as needed, next-Session/compaction update timing.
- [Memory files](https://tobs.app/en/docs/channel-sidebar/memory-files/) and [evolution](https://tobs.app/en/docs/channel-sidebar/memory-evolution/): visible files and Git history.
- [Workspace Grants](https://tobs.app/en/docs/channel-sidebar/workspaces/): a Bot's file access is distinct from group membership or a path mentioned in chat.
- [Models](https://tobs.app/en/docs/model-setup/): model routes and costs depend on configuration.
- [Installation](https://tobs.app/en/docs/installation/): current install identity; article CTAs link the guide instead of copying a fast-aging package/version command.
- [Phone pairing](https://tobs.app/en/docs/mobile-pairing/): mobile Beta is a remote client of an available computer; no claim of phone-hosted execution or universal store availability.
- [Existing preference diary](https://tobs.app/en/blog/ai-companion-preference-memory/): real Day 0 file write/readback, not evidence of later-day recall.

Local files do not imply offline model inference or a guarantee that model context stays on the device. Independent Bot memory does not imply an automatic aggregate of all members' private notes. App reopen, new topic and new Session are not interchangeable memory tests.

## Search scope

English editorial slice: Google / United States / English / desktop. Prior provider estimates: ai group chat monthly 590/KD13, ai agent team singular 140/KD28, ai character chat 40,500/KD42. Plural ai agent teams was not separately measured. Volume estimates are not forecasts of our traffic, nor do they establish an easy-ranking claim.

Chinese editorial slice: Baidu / mainland China / Simplified Chinese / desktop, baseline unknown. Chinese reader questions are AI 群聊、AI Agent 团队、Tobs 托布 / Bot 团队 and AI 角色聊天. Do not assign US metrics to these queries.

The batch creates no tracker, paid research, keyword saves or schedules. Merge is not deployment; after Human review and authorized publication, record actual deployment time before any locale-specific observation. Impressions, clicks, effective trial and ranking changes remain unknown.

## Review and validation

Each writer owns one article pair. Integration checks bilingual scope, sample/actual distinctions, public internal links, JSON frontmatter, generated one-H1 pages, canonical/hreflang/OG/sitemap/index, existing-cover preservation and responsive rendering. Run the repository's complete pnpm verify gate. Article screenshots show real generated pages, not a model's execution of the suggested examples.

No separate behavior explainer is needed: the PR changes article content, covers and one cover-domain literal, without new application lifecycle, permissions or persistence behavior. The PR's article map and native page screenshots provide the review path.
