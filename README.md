# deepseekbot.app

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
pnpm verify   # format:check, lint, docs-sync regression tests, typecheck, build
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
  to `public/guides`). To update a bounded set without replacing other guides or media, use
  `BOTHARNESS=../BotHarness pnpm docs:sync --only capabilities,channel-sidebar/external-identities,lark-connection,slack-connection,wechat-connection,daily-browser,settings,installation`.
  Site-owned copy lives in `content/site-guides/{zh,en}` and is included via `siteSource` in
  `scripts/docs-pages.mjs`; both full and scoped syncs preserve its authored source and referenced site-owned screenshots. Current-source
  guides carry a release notice and the copied upstream SHA. `editorialBody` in the sync script
  corrects historical pre-release installation statements without discarding qualification records.
  The build renders them into static pages at `/docs/<slug>/` and
  `/en/docs/<slug>/` (`scripts/docs.ts`; the generated `docs/` and `en/docs/` folders are not
  committed) and lists them in `sitemap.xml`. Each guide gets an "On this page" list of its h2/h3
  sections on the right (folded above the article below 1180px). Ctrl/⌘+K or the header's search
  button opens a client-side search over `/search/zh.json` or `/search/en.json`, built from the
  same Markdown at build time (one entry per section, plain substring matching so Chinese needs no
  segmenter; `src/search.ts`). Developer docs stay on botharness.ai.
- **Frames**: the wooden nine-slice frame is pixel art in `scripts/frame-svg.mjs`; run
  `pnpm frames` after editing it to regenerate `src/frames.css`.
- The visual direction takes cues from Stardew Valley UIs such as
  [stardewUi](https://github.com/a985987819/stardewUi); no code or assets are copied from it
  (its license forbids commercial use).

## Analytics

Anonymous PostHog analytics, as decided in BotHarness ADR-0132 (`src/analytics.ts`). A build sends nothing unless `VITE_POSTHOG_KEY` (the project's public `phc_…` key) is set, for example in `.env.production`; `VITE_POSTHOG_HOST` overrides the ingest proxy (default `https://t.botharness.ai`). Visitors get a consent box: accepting keeps an anonymous ID for cross-day attribution, declining falls back to PostHog's cookieless mode, which must also be enabled in the PostHog project settings. `?ref=<x>` is rewritten to `utm_source=<x>` before PostHog starts. `/privacy/` and `/en/privacy/` render from `content/privacy/{zh,en}.md`.

Every event carries `source: site`, `lang` and `page` (`home`, `market`, `docs`, `privacy`, `changelog`). Named events go through `track()` in the component that owns the control: `install_tab_switched` and `install_command_copied` (`tab`; with `placement: hero` from the Hero's one-line install), `qq_group_copied` (`placement: hero` from the Hero's QQ button), `video_played`, `avatar_downloaded` (`edited`, `species`, `drawn_parts`), in the Playground editor `avatar_preset_selected` (`index`, `species`), `avatar_species_selected`, `avatar_headpiece_selected`, `avatar_part_draw_started` (`slot`, `start`: `new`, `edit` or `piece`), `avatar_part_saved` (`slot`, `derived`), `avatar_part_draw_cancelled`, `avatar_part_worn` and `avatar_part_deleted` (`slot`), `avatar_part_exported` (`scope`: `part` or `library`, `count`), `avatar_part_imported` (`count`, `added`, `refused`, `zip`), `avatar_part_import_failed` (`reason`), `market_bot_opened`, `market_install_clicked`, and on the docs and changelog pages `docs_search_opened` (`via`: `shortcut` or `button`), `docs_search_queried` (`query`, `results`; sent once typing pauses for a second) and `docs_search_result_opened` (`query`, `position`, `target`). Outbound GitHub, Discord and DeepSeek Harness download links, in-page install buttons, links into the marketplace, docs and changelog, and the language switch are caught by one delegated click listener in `src/analytics.ts`, so they also work on the static docs pages: `github_clicked` (`target` path), `discord_clicked`, `dsh_download_clicked`, `install_cta_clicked` (buttons to `#install`), `market_clicked`, `docs_clicked`, `changelog_clicked` (`target` path; not fired for links within the same page family) and `language_switched` (`to`), each with a `placement`: a `data-placement` on the link or an ancestor (`hero`, `hero_quick_install`, `hero_signpost`, `install_desktop`, `install_dev`), else `header`, `footer`, or the section id.

## Deploy

`wrangler.jsonc` deploys `dist/` as static assets on the Worker `deepseekbot-site`, in the account
that holds the `deepseekbot.app`, `deepseekbot.dev` and `botharness.ai` zones. **deepseekbot.app** is
the canonical domain: canonical links, share cards, the sitemap and `SITE` in `vite.config.ts`,
`scripts/docs.ts` and `scripts/changelog.ts` use it. `www.deepseekbot.app`, `deepseekbot.dev`,
`www.deepseekbot.dev` and the original `deepseekbot.botharness.ai` stay bound as custom domains and
301 to the same path on deepseekbot.app through the small Worker in `worker/index.ts` (it runs before
the assets; preview URLs are served directly). The Marketplace API and the analytics ingest proxy
(BotHarness `packages/market`, `packages/ingest`) must allow the site's origin for CORS.

Recommended: connect this repository in Cloudflare (Workers & Pages → Create → Import a
repository) with build command `pnpm build` and deploy command `npx wrangler deploy`. Pushes to
`main` go live; other branches get preview URLs (`npx wrangler versions upload`).

Manual: `pnpm deploy` (production) or `pnpm deploy:preview` (preview URL only), after
`npx wrangler login`.
