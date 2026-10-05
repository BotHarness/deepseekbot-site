// Renders the share cards (public/og-zh.png, public/og-en.png, 1200×630) and the
// apple-touch-icon from the same BotPixel avatars and pixel font as the site.
// Run `pnpm og` after changing the copy below. Needs a Chromium: Playwright's own
// (PLAYWRIGHT_BROWSERS_PATH) or CHROMIUM_PATH.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pixelAvatarSvg, pixelSymbolCells, seededRecipe } from '@botharness/pixel-avatar';
import { pixelPathMarkup } from '@botharness/pixel-morph';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
// inlined: a page set with setContent cannot load file:// fonts
const font = `data:font/woff2;base64,${readFileSync(
  require.resolve('@fontsource/fusion-pixel-12px-proportional-sc/files/fusion-pixel-12px-proportional-sc-latin-400-normal.woff2'),
).toString('base64')}`;

const CARDS = {
  zh: {
    lang: 'zh-CN',
    headline: '开源的 GrokBot 平替',
    sub: '一组有各自身份、人格和记忆的 bots，一起做事',
    chips: ['基于 DeepSeek Harness', '兼容其他 DSH 插件', '连接飞书 / Slack', 'MIT 开源'],
  },
  en: {
    lang: 'en',
    headline: 'The open-source Grok Bot alternative',
    sub: 'Bots with their own identity, persona and memory, working together',
    chips: ['Built on DeepSeek Harness', 'Works with DSH plugins', 'Lark + Slack', 'MIT'],
  },
};

// who stands on the grass, and which tool they are using (null: their face)
const CREW = [
  ['Mira', 'read'],
  ['Theo', null],
  ['DeepSeekBot', null],
  ['Nova', 'bash'],
  ['Juno', null],
];

function avatar(name, symbol, size) {
  const recipe = seededRecipe(name);
  let svg = pixelAvatarSvg(recipe);
  if (symbol) {
    svg = svg
      .replace(
        '<g data-avatar-pixel-morph=""></g>',
        `<g>${pixelPathMarkup(pixelSymbolCells(symbol, recipe.hairColor))}</g>`,
      )
      .replace('<svg ', '<svg class="tool" ');
  }
  return svg.replace('width="512" height="512"', `width="${size}" height="${size}"`);
}

const page = (card) => `<!doctype html>
<html lang="${card.lang}"><head><meta charset="utf-8"><style>
@font-face { font-family: Px; src: url('${font}') format('woff2'); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Px, sans-serif; color: #3b2414;
  background: linear-gradient(#7cc6ff, #d4efff 70%); position: relative; -webkit-font-smoothing: none; }
.tool .bh-illustrated-body, .tool .bh-illustrated-head { visibility: hidden; }
svg { image-rendering: pixelated; filter: drop-shadow(6px 6px 0 rgb(59 36 20 / .35)); }
.cloud { position: absolute; background: #fff; box-shadow: 0 12px 0 #fff, 12px 12px 0 #fff; }
.copy { position: absolute; left: 64px; top: 52px; width: 1072px; }
.mark { font-size: 96px; line-height: 1; color: #fff; letter-spacing: 2px;
  text-shadow: 6px 0 #3b2414, -6px 0 #3b2414, 0 6px #3b2414, 0 -6px #3b2414, 6px 6px #3b2414,
    -6px -6px #3b2414, 6px -6px #3b2414, -6px 6px #3b2414, 12px 12px #3d5afe, 18px 18px #3b2414; }
.headline { margin-top: 34px; font-size: 48px; line-height: 1.2; }
.headline span { background: #3d5afe; color: #fff; padding: 0 12px; outline: 4px solid #3b2414; }
.sub { margin-top: 18px; font-size: 24px; }
.chips { display: flex; gap: 14px; margin-top: 20px; }
.chips span { font-size: 24px; line-height: 36px; padding: 0 12px; background: #fffbea; outline: 4px solid #3b2414; }
.crew { position: absolute; right: 44px; bottom: 66px; display: flex; align-items: flex-end; gap: 14px; }
.ground { position: absolute; left: 0; right: 0; bottom: 0; height: 84px; border-top: 6px solid #3b2414;
  background: linear-gradient(#8fb85d 0 10px, transparent 10px),
    repeating-linear-gradient(90deg, #71964a 0 18px, #8fb85d 18px 27px, #71964a 27px 45px) 0 0 / 100% 28px no-repeat,
    repeating-linear-gradient(90deg, #8b5a2b 0 27px, #6b4220 27px 36px); }
.url { position: absolute; left: 64px; bottom: 22px; font-size: 24px; color: #fff3d1;
  text-shadow: 3px 3px 0 #3b2414; }
</style></head><body>
<div class="cloud" style="left:930px;top:40px;width:84px;height:24px"></div>
<div class="cloud" style="left:1040px;top:110px;width:60px;height:24px"></div>
<div class="copy">
  <h1 class="mark">DeepSeekBot</h1>
  <p class="headline"><span>${card.headline}</span></p>
  <p class="sub">${card.sub}</p>
  <div class="chips">${card.chips.map((c) => `<span>${c}</span>`).join('')}</div>
</div>
<div class="ground"></div>
<div class="crew">${CREW.map(([n, s]) => avatar(n, s, n === 'DeepSeekBot' ? 176 : 124)).join('')}</div>
<p class="url">deepseekbot.botharness.ai</p>
</body></html>`;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [key, card] of Object.entries(CARDS)) {
  await tab.setContent(page(card), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: `public/og-${key}.png` });
}
await tab.setViewportSize({ width: 180, height: 180 });
await tab.setContent(
  `<body style="margin:0">${avatar('DeepSeekBot', null, 180).replace(/filter:[^;]*;/, '')}</body>`,
);
await tab.screenshot({ path: 'public/apple-touch-icon.png', omitBackground: true });
await browser.close();
console.log('wrote public/og-zh.png, public/og-en.png, public/apple-touch-icon.png');
