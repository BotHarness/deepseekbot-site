# deepseekbot.botharness.ai

The product site for [DeepSeekBot](https://www.npmjs.com/package/deepseekbot), the first
[BotHarness](https://github.com/BotHarness/BotHarness) product. A single pixel-art page in Chinese
and English, with day and night palettes. Every face on it is a
[BotPixel](https://github.com/BotHarness/BotPixel) avatar seeded from a Bot's name, morphing into
the tool it is using.

## Stack

pnpm 12 · TypeScript 7 · Vite 8 · React 19.3 · [Astryx](https://github.com/facebook/astryx)
(`@astryxdesign/core` with a custom pixel theme in `src/theme.ts`) · Oxlint · Oxfmt ·
Cloudflare Workers static assets.

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm verify   # format:check, lint, typecheck, build
```

- **Copy** lives in `src/content.ts`. It only claims what the BotHarness README, CONTEXT and
  CHANGELOG say has shipped; keep it that way when editing.
- **Font**: Fusion Pixel 12px SC (OFL). Dev serves the whole font; `vite build` subsets it to the
  characters in `index.html` and `src/` (about 13 KB instead of 600 KB), so new copy is covered
  automatically.
- **Languages** follow botharness.ai: the language is the path. Chinese is the default at `/`
  (`/zh/*` redirects there, see `public/_redirects`), English is under `/en/`; the header links
  switch between them.
- **Share cards**: `/` is the Chinese entry and `/en/` the English one, each with its own
  title, description, Open Graph and Twitter card, hreflang and JSON-LD. `pnpm og` re-renders
  `public/og-zh-v2.png`, `public/og-en-v2.png` (same layout as the launch covers) and the
  apple-touch-icon from BotPixel presets and the DeepSeekBot logo
  (`scripts/assets/deepseekbot-logo.png`, from BotHarness). When the design changes, bump the
  file suffix and the meta tags in both entries so social caches refetch; old files stay so
  links already shared keep working.
- **Docs**: the DeepSeekBot guides (formerly botharness.ai/docs) live in `content/docs/{zh,en}`,
  copied from a BotHarness checkout with `BOTHARNESS=../BotHarness pnpm docs:sync` (screenshots go
  to `public/guides`). The build renders them into static pages at `/docs/<slug>/` and
  `/en/docs/<slug>/` (`scripts/docs.ts`; the generated `docs/` and `en/docs/` folders are not
  committed) and lists them in `sitemap.xml`. Developer docs stay on botharness.ai.
- **Frames**: the wooden nine-slice frame is pixel art in `scripts/frame-svg.mjs`; run
  `pnpm frames` after editing it to regenerate `src/frames.css`.
- The visual direction takes cues from Stardew Valley UIs such as
  [stardewUi](https://github.com/a985987819/stardewUi); no code or assets are copied from it
  (its license forbids commercial use).

## Analytics

Anonymous PostHog analytics, as decided in BotHarness ADR-0132 (`src/analytics.ts`). A build sends nothing unless `VITE_POSTHOG_KEY` (the project's public `phc_…` key) is set, for example in `.env.production`; `VITE_POSTHOG_HOST` overrides the ingest proxy (default `https://t.botharness.ai`). Visitors get a consent box: accepting keeps an anonymous ID for cross-day attribution, declining falls back to PostHog's cookieless mode, which must also be enabled in the PostHog project settings. `?ref=<x>` is rewritten to `utm_source=<x>` before PostHog starts. `/privacy/` and `/en/privacy/` render from `content/privacy/{zh,en}.md`.

Every event carries `source: site`, `lang` and `page` (`home`, `market`, `docs`, `privacy`, `changelog`). Named events go through `track()` in the component that owns the control: `install_tab_switched`, `install_command_copied`, `qq_group_copied`, `video_played`, `avatar_downloaded`, `market_bot_opened`, `market_install_clicked`. Outbound GitHub and Discord links, links into the marketplace, docs and changelog, and the language switch are caught by one delegated click listener in `src/analytics.ts`, so they also work on the static docs pages: `github_clicked` (`target` path), `discord_clicked`, `market_clicked`, `docs_clicked`, `changelog_clicked` (`target` path; not fired for links within the same page family) and `language_switched` (`to`), each with a `placement`: a `data-placement` on the link or an ancestor (`hero_signpost`, `install_desktop`, `install_dev`), else `header`, `footer`, or the section id.

## Deploy

`wrangler.jsonc` deploys `dist/` as static assets on the Worker `deepseekbot-site`, with the custom
domain `deepseekbot.botharness.ai` in the account that holds the `botharness.ai` zone.

Recommended: connect this repository in Cloudflare (Workers & Pages → Create → Import a
repository) with build command `pnpm build` and deploy command `npx wrangler deploy`. Pushes to
`main` go live; other branches get preview URLs (`npx wrangler versions upload`).

Manual: `pnpm deploy` (production) or `pnpm deploy:preview` (preview URL only), after
`npx wrangler login`.
