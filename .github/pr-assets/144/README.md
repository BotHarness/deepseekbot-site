# Four bilingual article pages

Issue: [#144](https://github.com/BotHarness/deepseekbot-site/issues/144). Captured October 27, 2026, Chrome on Windows, desktop viewport 1440 × 1000, light theme. Screenshots show actual website pages, not Bot task execution.

| Prefix | New article path  | Before                     | After                          |
| ------ | ----------------- | -------------------------- | ------------------------------ |
| 1      | ai-group-chat     | Live path returns HTTP 404 | Built article returns HTTP 200 |
| 2      | ai-agent-teams    | Live path returns HTTP 404 | Built article returns HTTP 200 |
| 3      | team-of-bots      | Live path returns HTTP 404 | Built article returns HTTP 200 |
| 4      | ai-character-chat | Live path returns HTTP 404 | Built article returns HTTP 200 |

Each prefix has English and Chinese pairs: `<prefix>-<en|zh>-b.png` and `<prefix>-<en|zh>-a.png`. The English path starts `/en/blog/`; Chinese starts `/blog/`. Before is the actual browser-rendered error for the live missing path, including the operating system's Chinese error text. It is not a fabricated site 404 design. After is the production build served locally at the same viewport/theme, with the anonymous-analytics prompt declined so it does not obscure the article.

All eight article pages were additionally checked at 390 × 844: no document-wide horizontal overflow, all article images loaded, no page-script errors. Each page has one H1, its intended canonical, English/Chinese alternates, a generated cover, index and sitemap entries, and existing internal link destinations. `checks.json` records these results.

Validation: the complete `pnpm verify` gate passed 79 tests, lint, formatting, type checks and production build. The Windows worktree was verified with LF source representation; checkout-only line-ending changes were excluded from the commit. Existing articles, homepage and existing cover bytes are unchanged. No model conversation, native mobile app or performance benchmark was run for this PR; the articles explicitly label their suggested setups.
