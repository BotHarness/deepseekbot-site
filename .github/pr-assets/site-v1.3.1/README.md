# DeepSeekBot 1.3.1 website evidence

Captured with the T3 collaborative Playwright browser against `vite preview` serving `dist/`.
Before: `540dacc` (current main, including the earlier changelog/install identity sync).
After: this branch. All paired views use a 1440 × 1000 viewport, light theme, and the same locale.
Hero animations and the site's companion can differ between captures.

- `*-home-{before,after}.png`: release badge, exact install spec and DSH requirement.
- `*-capabilities-{before,after}.png`: IM connections, bundled Browser/Computer, and new CLI card.
- `*-install-{before,after}.png`: desktop installation and release compatibility note.
- `*-changelog-after.png`: published 1.3.1 entries, already synced on main by PR #99.
- `en-install-cli-after.png`: DSH 0.2.0-rc.2 and deepseekbot@1.3.1 CLI commands.

Validation: `pnpm verify` passed all 46 tests, format checking, lint, typechecking and production build.
The complete 1.3.1 entries in both ledgers match the product's `v1.3.1` tag. Older ledger entries
retain the site's existing ADR label corrections. Browser checks confirmed the badge reaches its
localized release anchor and neither locale overflows at 390 × 844 or 1440 × 1000.
