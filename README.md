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
- **Share cards**: `/` is the Chinese entry and `/en/` the English one, each with its own
  title, description, Open Graph and Twitter card, hreflang and JSON-LD. `pnpm og` re-renders
  `public/og-zh.png`, `public/og-en.png` and the apple-touch-icon from the same avatars and font.
- **Frames**: the wooden nine-slice frame is pixel art in `scripts/frame-svg.mjs`; run
  `pnpm frames` after editing it to regenerate `src/frames.css`.
- The visual direction takes cues from Stardew Valley UIs such as
  [stardewUi](https://github.com/a985987819/stardewUi); no code or assets are copied from it
  (its license forbids commercial use).

## Deploy

`wrangler.jsonc` deploys `dist/` as static assets on the Worker `deepseekbot-site`, with the custom
domain `deepseekbot.botharness.ai` in the account that holds the `botharness.ai` zone.

Recommended: connect this repository in Cloudflare (Workers & Pages → Create → Import a
repository) with build command `pnpm build` and deploy command `npx wrangler deploy`. Pushes to
`main` go live; other branches get preview URLs (`npx wrangler versions upload`).

Manual: `pnpm deploy` (production) or `pnpm deploy:preview` (preview URL only), after
`npx wrangler login`.
