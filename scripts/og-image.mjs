// Renders the share cards (public/og-{zh,en}-v2.png, 1200×630; bump the suffix when the
// design changes so social caches refetch) and the
// apple-touch-icon from the same BotPixel avatars and pixel font as the site.
// Run `pnpm og` after changing the copy below. Needs a Chromium: Playwright's own
// (PLAYWRIGHT_BROWSERS_PATH) or CHROMIUM_PATH.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { AVATAR_PRESETS, pixelAvatarSvg } from '@botharness/pixel-avatar';
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
    // matches Bilibili cover A; English cards only use the Grok Bot line
    extra: 'ChatGPT Dots 平替',
    chips: [
      '基于 DeepSeek Harness',
      '兼容其他 DSH 插件',
      '飞书 / Slack / Discord / 微信',
      'MIT 开源',
    ],
  },
  en: {
    lang: 'en',
    headline: 'The open-source Grok Bot alternative',
    chips: [
      'Built on DeepSeek Harness',
      'Works with DSH plugins',
      'Lark / Slack / Discord / WeChat',
      'MIT',
    ],
  },
};

// Same composition as the launch covers: centred pixel title, tags, and a row of BotPixel
// presets on the grass with the DeepSeekBot logo (from BotHarness
// packages/client/assets/bot/deepseekbot-light.png) in the biggest, middle tile.
const LOGO = `data:image/png;base64,${readFileSync(new URL('./assets/deepseekbot-logo.png', import.meta.url)).toString('base64')}`;
const CREW = [
  [2, 116, '#fbe3e6'],
  [9, 132, '#ebe6fb'],
  ['logo', 214, '#e3ebfb'],
  [7, 132, '#e3ebfb'],
  [10, 116, '#fbe3ef'],
];

const avatar = (preset, size) =>
  pixelAvatarSvg(AVATAR_PRESETS[preset]).replace(
    'width="512" height="512"',
    `width="${size}" height="${size}"`,
  );
const tile = ([who, size, bg]) =>
  `<div class="tile${who === 'logo' ? ' tile--logo' : ''}" style="width:${size}px;height:${size}px;background:${bg}">${
    who === 'logo' ? `<img src="${LOGO}" alt="">` : avatar(who, size - 12)
  }</div>`;

const page = (card) => `<!doctype html>
<html lang="${card.lang}"><head><meta charset="utf-8"><style>
@font-face { font-family: Px; src: url('${font}') format('woff2'); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Px, sans-serif; color: #3b2414;
  background: linear-gradient(#6dbcfb, #d8efff 80%); position: relative; -webkit-font-smoothing: none;
  display: flex; flex-direction: column; align-items: center; }
.cloud { position: absolute; background: #fff; box-shadow: 14px 14px 0 #fff; }
.mark { margin-top: ${card.extra ? 14 : 30}px; font-size: 118px; line-height: 1.05; color: #fff; letter-spacing: 3px;
  text-shadow: 6px 0 #3b2414, -6px 0 #3b2414, 0 6px #3b2414, 0 -6px #3b2414, 6px 6px #3b2414,
    -6px -6px #3b2414, 6px -6px #3b2414, -6px 6px #3b2414, 12px 12px #3d5afe, 18px 18px #3b2414; }
.tag { margin-top: 18px; padding: 2px 22px; outline: 6px solid #3b2414; white-space: nowrap; }
.tag--blue { font-size: ${card.extra ? 52 : 50}px; line-height: 1.25; background: #3d5afe; color: #fff; }
.tag--yellow { margin-top: 20px; font-size: 32px; line-height: 1.3; background: #ffcf3a; padding: 0 18px; outline-width: 5px; }
.chips { display: flex; gap: 12px; margin-top: 22px; }
.chips span { white-space: nowrap; font-size: 20px; line-height: 32px; padding: 0 10px; background: #fffbea;
  outline: 3px solid #3b2414; box-shadow: 5px 5px 0 rgb(59 36 20 / .3); }
.crew { position: absolute; bottom: 52px; left: 0; right: 0; display: flex; justify-content: center; align-items: flex-end; gap: 22px; }
.tile { border: 6px solid #3b2414; border-radius: 22px; overflow: hidden; display: flex; align-items: flex-end;
  justify-content: center; box-shadow: 8px 8px 0 rgb(59 36 20 / .3); }
.tile svg { image-rendering: pixelated; display: block; }
.tile--logo { border-width: 8px; border-radius: 34px; }
.tile--logo img { width: 100%; height: 100%; display: block; }
.ground { position: absolute; left: 0; right: 0; bottom: 0; height: 52px;
  background: linear-gradient(#7cc04a 0 8px, #5d9a36 8px 14px, #8b5a2b 14px); }
.url { position: absolute; left: 24px; bottom: 12px; font-size: 20px; color: #fff3d1; text-shadow: 3px 3px 0 #3b2414; }
</style></head><body>
<div class="cloud" style="left:70px;top:40px;width:96px;height:24px"></div>
<div class="cloud" style="left:1050px;top:60px;width:72px;height:24px"></div>
<h1 class="mark">DeepSeekBot</h1>
<p class="tag tag--blue">${card.headline}</p>
${card.extra ? `<p class="tag tag--yellow">${card.extra}</p>` : ''}
<div class="chips">${card.chips.map((c) => `<span>${c}</span>`).join('')}</div>
<div class="ground"></div>
<div class="crew">${CREW.map(tile).join('')}</div>
<p class="url">deepseekbot.botharness.ai</p>
</body></html>`;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [key, card] of Object.entries(CARDS)) {
  await tab.setContent(page(card), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: `public/og-${key}-v2.png` });
}
await tab.setViewportSize({ width: 180, height: 180 });
await tab.setContent(
  `<body style="margin:0;background:#fff"><img src="${LOGO}" width="180" height="180"></body>`,
);
await tab.screenshot({ path: 'public/apple-touch-icon.png' });
await browser.close();
console.log('wrote public/og-zh-v2.png, public/og-en-v2.png, public/apple-touch-icon.png');
