# tobs.app

The bilingual product website for [Tobs](https://www.npmjs.com/package/deepseekbot),
maintained by [BotHarness](https://github.com/BotHarness/DeepSeekBot) at [tobs.app](https://tobs.app).
It includes the homepage, guides, changelog, blog, marketplace and avatar studio in Chinese
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

For repeatable local model setup across product worktrees, see the
[shared model wizard](planning/task-evidence/README.md).

- **Live demo**: the Hero pairs the complete desktop panel with a native-style phone presentation
  (`src/components/LiveDemo.tsx`, `HeroPhoneChat.tsx`, `HeroPhoneHome.tsx`). Both share the script
  and approval resolver from `src/demoCopy.ts`; nothing talks to a model. The separate duplicate
  demo below the Hero has been removed. Keep the scripts to what the copy already claims.
- **Native screenshots**: the 1.5 release article reuses historical iOS Simulator captures, with
  source revisions, hashes and scope in `public/blog-figures/tobs-1-5/provenance.json`. Keep the
  originals unchanged and display them at their original aspect ratio. They are not evidence of
  the currently distributed mobile binary; the pixel-art cover is a separate illustration.
- **AI-assisted setup**: `src/setupPrompt.ts` generates localized instructions from the qualified
  install identity. It targets the desktop-owned Profile via the actual desktop app/bundled CLI;
  copying is not installation. No installer runs in the browser. Keep the OS/user-confirmation,
  compatibility, Profile preservation and Bot-mode verification boundaries when editing it.
- **Copy** lives in `src/content.ts`, `src/heroCopy.ts` and `src/setupPrompt.ts`. It only claims what the BotHarness README, CONTEXT and
  CHANGELOG say has shipped; keep it that way when editing.
- **Avatar Studio**: `/avatar` and `/en/avatar` (`avatar.html`, `src/AvatarApp.tsx`) hold the full avatar editor in three panels: stage and tools, parts and drawing, colors and shape. The home page keeps the name, stage and tool morphs and links there. Both read and write the same design in this browser (`src/avatarStore.ts`).
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
- **Reviewed blog covers**: per-post artwork lives in `public/blog-covers/<slug>-<lang>.png`, with a matching `.artwork.json` containing its article title and SHA-256. `pnpm blog:covers:check` checks these without rewriting images and runs before every `pnpm build` (including verify and both deploy commands). A retitled article, missing image or changed pixels fails the build for review; uncurated template covers are unaffected. `pnpm blog:covers` uses the same validation before retaining reviewed artwork.
- **Docs**: the DeepSeekBot guides (formerly botharness.ai/docs) live in `content/docs/{zh,en}`,
  copied from a BotHarness checkout with `BOTHARNESS=../BotHarness pnpm docs:sync` (screenshots go
  to `public/guides`). To update a bounded set without replacing other guides or media, use
  `BOTHARNESS=../BotHarness pnpm docs:sync --only capabilities,channel-sidebar/external-identities,lark-connection,slack-connection,wechat-connection,daily-browser,settings,installation`.
  Site-owned copy lives in `content/site-guides/{zh,en}` and is included via `siteSource` in
  `scripts/docs-pages.mjs`; both full and scoped syncs preserve its authored source and referenced site-owned screenshots. Referenced site-owned asset directories also retain transcripts, manifests and caption sidecars. Original terminal output and timing files preserve their bytes through Git. Current-source
  guides carry a release notice and the copied upstream SHA. `editorialBody` in the sync script
  corrects historical pre-release installation statements without discarding qualification records.
  The build renders them into static pages at `/docs/<slug>/` and
  `/en/docs/<slug>/` (`scripts/docs.ts`; the generated `docs/` and `en/docs/` folders are not
  committed) and lists them in `sitemap.xml`. Each guide gets an "On this page" list of its h2/h3
  sections on the right (folded above the article below 1180px). Ctrl/⌘+K or the header's search
  button opens a client-side search over `/search/zh.json` or `/search/en.json`, built from the
  same Markdown at build time (one entry per section, plain substring matching so Chinese needs no
  segmenter; `src/search.ts`). Developer docs stay on botharness.ai.
- **Plugins**: `/plugins/` and `/en/plugins/` are the second shelf of the marketplace, next to the
  Bot list at `/market`. Each plugin is one file, `content/plugins/<slug>.json` (package, version,
  requirements, links, media file names and the zh/en copy); its media lives under
  `public/guides/plugins/<slug>/`. `scripts/plugins.ts` renders the list and one page per plugin
  at build, adds them to `sitemap.xml` and `/llms.txt`, and leaves out media that has not been
  recorded yet (only the cover is required).
- **Frames**: the wooden nine-slice frame is pixel art in `scripts/frame-svg.mjs`; run
  `pnpm frames` after editing it to regenerate `src/frames.css`.
- The visual direction takes cues from Stardew Valley UIs such as
  [stardewUi](https://github.com/a985987819/stardewUi); no code or assets are copied from it
  (its license forbids commercial use).

## Analytics

Homepage beta links use the existing analytics configuration and consent behavior:
`mobile_install_clicked` carries only `platform: ios`, `destination: testflight` and `placement`;
`mobile_beta_menu_opened` carries `platform: android` and `placement`. Android Discord selection
uses the existing `discord_clicked` event, and successful QQ copies use `qq_group_copied`, both
with `placement: android_beta_hero` or `android_beta_install`. `setup_prompt_copied` records only `placement: hero`, never
the copied prompt or an email. The scripted Hero follows the existing demo interaction events without recording message text.
These record website intent, not a completed app installation or beta membership.

Anonymous PostHog analytics, as decided in BotHarness ADR-0132 (`src/analytics.ts`). A build sends nothing unless `VITE_POSTHOG_KEY` (the project's public `phc_…` key) is set, for example in `.env.production`; `VITE_POSTHOG_HOST` overrides the ingest proxy (default `https://t.botharness.ai`). Visitors get a consent box: accepting keeps an anonymous ID for cross-day attribution, declining falls back to PostHog's cookieless mode, which must also be enabled in the PostHog project settings. `?ref=<x>` is rewritten to `utm_source=<x>` before PostHog starts. `/privacy/` and `/en/privacy/` render from `content/privacy/{zh,en}.md`.

### GitHub Release short links

Every product Release can use its own versioned URLs; the Worker expands them with fixed campaign parameters:

| Short path             | Destination              | `utm_content` |
| ---------------------- | ------------------------ | ------------- |
| `/r/v1.2.1`            | `/`                      | `website`     |
| `/r/v1.2.1/install`    | `/docs/installation/`    | `install_zh`  |
| `/r/v1.2.1/install/en` | `/en/docs/installation/` | `install_en`  |

All destinations carry `utm_source=github`, `utm_medium=release`, and `utm_campaign=deepseekbot_v1.2.1`.
Replace the version for each release; stable and `alpha.N`, `beta.N`, `rc.N` versions are supported.
`ref` remains compatible for existing links, but Release attribution uses UTMs to separate source,
version and entry point. Incoming query parameters cannot override attribution or choose another
destination. GET/HEAD redirects are 302, `no-store` and `noindex, nofollow`; no per-click server
analytics, cookies, project settings or consent behavior are added.

Deploy the Site short-link support before publishing short URLs in the product Release template.
Until then, use direct destination URLs with the same UTMs. Redirect tests prove routing and
campaign parameters, not ingested events or installation conversions. Use the existing analytics
consent boundary and group actual pageviews by source, campaign and content when reviewing traffic.
See [PostHog UTM segmentation](https://posthog.com/docs/data/utm-segmentation) for field semantics.

Every event carries `source: site`, `lang` and `page` (`home`, `market`, `avatar`, `docs`, `privacy`, `changelog`). Named events go through `track()` in the component that owns the control: `install_tab_switched` and `install_command_copied` (`tab`; with `placement: hero` from the Hero's one-line install), `qq_group_copied` (`placement: hero` from the Hero's QQ button), `video_played`, in the live demo under the Hero `demo_channel_opened` (`channel`), `demo_approval_answered` (`channel`, `answer`: `allow` or `deny`, `scope`: `once` or `always`) and `demo_message_sent` (`channel`; the typed text is never sent), `feature_demo_used` (`feature`: `identity`, `memory`, `groups`, `folders`, `schedules` or `mobile`; `action`) from the demos beside each feature, `avatar_downloaded` (`edited`, `species`, `drawn_parts`), `avatar_restored` (`edited`, `species`; once per page load when a saved Playground design comes back), in the Playground editor `avatar_tab_selected` (`tab`, `species`), `avatar_preset_selected` (`index`, `species`), `avatar_species_selected`, `avatar_headpiece_selected`, `avatar_part_draw_started` (`slot`, `start`: `new`, `edit` or `piece`), `avatar_part_saved` (`slot`, `derived`), `avatar_part_draw_cancelled`, `avatar_part_worn` and `avatar_part_deleted` (`slot`), `avatar_part_exported` (`scope`: `part` or `library`, `count`), `avatar_part_imported` (`count`, `added`, `refused`, `zip`), `avatar_part_import_failed` (`reason`), `market_bot_opened`, `market_install_clicked`, and on the docs and changelog pages `docs_search_opened` (`via`: `shortcut` or `button`), `docs_search_queried` (`query`, `results`; sent once typing pauses for a second) and `docs_search_result_opened` (`query`, `position`, `target`). Outbound GitHub, Discord and DeepSeek Harness download links, in-page install buttons, links into the marketplace, docs and changelog, and the language switch are caught by one delegated click listener in `src/analytics.ts`, so they also work on the static docs pages: `github_clicked` (`target` path), `discord_clicked`, `dsh_download_clicked`, `install_cta_clicked` (buttons to `#install`), `market_clicked`, `avatar_clicked`, `docs_clicked`, `changelog_clicked` (`target` path; not fired for links within the same page family) and `language_switched` (`to`), each with a `placement`: a `data-placement` on the link or an ancestor (`hero`, `hero_quick_install`, `hero_signpost`, `install_desktop`, `install_dev`), else `header`, `footer`, or the section id.

## Deploy

### Updating public install instructions

After the product stable release is published and qualified, update its `scripts/install-release.json`
and run its `pnpm install:sync`. Then run `BOTHARNESS=<qualified-product-checkout> pnpm install:sync`
here. This copies the stable identity and only the canonical bilingual installation guides;
Hero copy buttons and CLI steps derive from the copied identity. `pnpm verify` detects guide/spec
drift. Review and ship the product and Site PRs normally; the sync does not publish anything.
Do not use development versions, bare names or `@latest` as the install identity, and never disable
supply-chain protection globally to avoid a new-release age-policy refusal.

`wrangler.jsonc` deploys `dist/` as static assets on the Worker `deepseekbot-site`, in the account
that holds the `tobs.app`, `deepseekbot.app`, `deepseekbot.dev` and `botharness.ai` zones. **tobs.app** is
the canonical domain: canonical links, share cards, the sitemap and `SITE` in `vite.config.ts`,
`scripts/docs.ts` and `scripts/changelog.ts` use it. `www.tobs.app`, `deepseekbot.app`, `www.deepseekbot.app`, `deepseekbot.dev`,
`www.deepseekbot.dev` and the original `deepseekbot.botharness.ai` stay bound as custom domains and
301 to the same path on tobs.app through the small Worker in `worker/index.ts` (it runs before
the assets; preview URLs are served directly). It also renders the Bot Marketplace for search engines: every view
has a path (`/market`, `/market/bot/<id>`, `/market/picks[/<YYYY-MM-DD>]`, `/market/hot|new|rising`,
and the same under `/en/`), and `worker/market.ts` fills the built market page with that view's
title, description, canonical and hreflang links, JSON-LD and readable text from the Marketplace API
(edge-cached for five minutes) before the page's script takes over. Older `?bot=`, `?digest=`,
`?picks=past` and `?section=` links 301 to their paths, a missing Bot or Digest is a `noindex` 404,
and `/sitemap-market.xml` (listed in `robots.txt`) covers every Bot and Digest in both languages. The Marketplace API and the analytics ingest proxy
(BotHarness `packages/market`, `packages/ingest`) must allow the site's origin for CORS.

Missing pages and files return HTTP 404 (`assets.not_found_handling: "none"`). The site uses
build-generated pages, not a client-side router: do not enable the SPA homepage fallback,
which serves unrelated URLs as HTTP 200 with the homepage canonical. Keep Cloudflare's default
HTML handling so existing extensionless URLs and directory index pages still resolve.
HTTP requests on the canonical product hostname also 301 to HTTPS, preserving the path and
query. Local HTTP development and Workers preview hostnames still serve assets directly.
Naver ownership verification uses `public/naver2c42ccd37d36f1ee05627e66c5827ac4.html`.
The Worker internally resolves this exact GET/HEAD path to the extensionless asset URL so
Cloudflare's HTML handling does not redirect the verification request. Other asset paths
and canonical-host redirects are unchanged.

For local Worker asset checks, use `pnpm exec wrangler dev --local --local-upstream localhost`;
Wrangler otherwise defaults its upstream hostname to the product route and rewrites redirects
back to its development address.

Recommended: connect this repository in Cloudflare (Workers & Pages → Create → Import a
repository) with build command `pnpm build` and deploy command `npx wrangler deploy`. Pushes to
`main` go live; other branches get preview URLs (`npx wrangler versions upload`).

Manual: `pnpm deploy` (production) or `pnpm deploy:preview` (preview URL only), after
`npx wrangler login`.

## Tobs brand migration

Tobs (托布) means **Team of bots**, with the ambition of **Thousands of Bots**. The site uses `tobs.app`; previous product hostnames redirect to the same path and query. Device subdomains under `deepseekbot.dev` are outside this Worker’s redirect allowlist. Existing npm install instructions, release campaign identifiers, local browser storage and historical articles retain their compatible identities. The Worker stays named `deepseekbot-site`.
