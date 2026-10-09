# AGENTS.md — deepseekbot.app

Product site for DeepSeekBot. Static pages pre-rendered at build; Cloudflare Workers only redirects old hostnames to the canonical one.

## Commands

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm verify   # format:check, lint, docs-sync regression tests, typecheck, build
```

## Conventions

- `content/` is the source. `docs/`, `changelog/`, `blog/`, `privacy/` page trees are generated at build by `scripts/docs.ts`, `scripts/changelog.ts`, `scripts/blog.ts` — never edit generated HTML, never commit it (gitignored).
- Bilingual: Chinese default at `/`, English under `/en/`. Every new section ships both: content in `content/<section>/{zh,en}/`, hreflang alternates, sitemap entries with both languages. A page without an English mirror must not emit an `/en/` URL anywhere (sitemap, alternates).
- Copy lives in `src/content.ts` and is covered by docs-sync regression tests; keep claims to what has shipped.
- The generated-page header test (`scripts/header.test.mjs`) pins the topnav link count and order — update it when adding a nav entry.
- Check `README.md` before changing share cards, fonts, or the search index; all three have build-time pipelines with non-obvious constraints.

## Pull requests

- Never push to `main` directly; ship through PRs for maintainer review.
- For UI changes, capture real screenshots (Playwright against `dist/`, matched viewport/theme/locale) into `.github/pr-assets/<topic>/` and embed them in the PR body via `raw.githubusercontent` branch URLs. New section with no predecessor: screenshot the live absence (404) as Before.
- PR body shape: Why / Special things to note (merge risk: reversibility, blast radius, review focus) / Change outline with the evidence next to each view. `pnpm verify` must be green; say so with the test count.
