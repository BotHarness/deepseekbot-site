// Renders per-post blog covers (public/blog-covers/<slug>-<lang>.png, 1200×630) from the
// same BotPixel avatars and pixel font as the share cards. Run `pnpm blog:covers` after
// adding or retitling a post; the PNGs are committed, blog.ts falls back to a theme block
// when a cover is missing. Needs a Chromium: Playwright's own (PLAYWRIGHT_BROWSERS_PATH)
// or CHROMIUM_PATH.
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { AVATAR_PRESETS, pixelAvatarSvg } from '@botharness/pixel-avatar';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
const font = `data:font/woff2;base64,${readFileSync(
  require.resolve('@fontsource/fusion-pixel-12px-proportional-sc/files/fusion-pixel-12px-proportional-sc-latin-400-normal.woff2'),
).toString('base64')}`;
const LOGO = `data:image/png;base64,${readFileSync(new URL('./assets/deepseekbot-logo.png', import.meta.url)).toString('base64')}`;

// Three sky palettes; the slug hash picks one so posts are distinguishable at a glance.
const SKIES = [
  ['#6dbcfb', '#d8efff'],
  ['#8a7cfb', '#e6e2ff'],
  ['#4fc9b5', '#dcf7ef'],
];
const pick = (slug) => SKIES[[...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % SKIES.length];
const CREW = [2, 9, 'logo', 7, 10];

const avatar = (preset, size) =>
  pixelAvatarSvg(AVATAR_PRESETS[preset]).replace(
    'width="512" height="512"',
    `width="${size}" height="${size}"`,
  );

const frontmatter = (markdown) => {
  const match = markdown.replaceAll('\r\n', '\n').match(/^---\n(\{[\s\S]*?\})\n---\n/);
  if (!match) throw new Error('post is missing JSON frontmatter');
  return JSON.parse(match[1]);
};

const page = (title, tags, slug, sky) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: Px; src: url('${font}') format('woff2'); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Px, sans-serif; color: #3b2414;
  background: linear-gradient(${sky[0]}, ${sky[1]} 85%); position: relative; -webkit-font-smoothing: none;
  display: flex; flex-direction: column; align-items: center; }
.mark { margin-top: 88px; max-width: 1020px; text-align: center; font-size: 72px; line-height: 1.25;
  color: #fff; letter-spacing: 2px;
  text-shadow: 5px 0 #3b2414, -5px 0 #3b2414, 0 5px #3b2414, 0 -5px #3b2414, 5px 5px #3b2414,
    -5px -5px #3b2414, 5px -5px #3b2414, -5px 5px #3b2414, 10px 10px #3d5afe, 15px 15px #3b2414; }
.chips { display: flex; gap: 12px; margin-top: 26px; }
.chips span { white-space: nowrap; font-size: 24px; line-height: 36px; padding: 0 14px; background: #fffbea;
  outline: 3px solid #3b2414; box-shadow: 5px 5px 0 rgb(59 36 20 / .3); }
.crew { position: absolute; bottom: 52px; left: 0; right: 0; display: flex; justify-content: center; align-items: flex-end; gap: 20px; }
.tile { border: 6px solid #3b2414; border-radius: 22px; overflow: hidden; display: flex; align-items: flex-end;
  justify-content: center; box-shadow: 8px 8px 0 rgb(59 36 20 / .3); width: 120px; height: 120px; }
.tile svg { image-rendering: pixelated; display: block; }
.tile--logo { width: 170px; height: 170px; }
.tile--logo img { width: 100%; height: 100%; display: block; }
.ground { position: absolute; left: 0; right: 0; bottom: 0; height: 52px;
  background: linear-gradient(#7cc04a 0 8px, #5d9a36 8px 14px, #8b5a2b 14px); }
.url { position: absolute; left: 24px; bottom: 12px; font-size: 20px; color: #fff3d1; text-shadow: 3px 3px 0 #3b2414; }
</style></head><body>
<h1 class="mark">${title}</h1>
<div class="chips">${tags.map((t) => `<span>${t}</span>`).join('')}</div>
<div class="ground"></div>
<div class="crew">${CREW.map((who) =>
  who === 'logo'
    ? `<div class="tile tile--logo"><img src="${LOGO}" alt=""></div>`
    : `<div class="tile">${avatar(who, 108)}</div>`,
).join('')}</div>
<p class="url">deepseekbot.app/blog/${slug}/</p>
</body></html>`;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
mkdirSync('public/blog-covers', { recursive: true });
const written = [];
for (const lang of ['zh', 'en']) {
  for (const file of readdirSync(`content/blog/${lang}`).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const meta = frontmatter(readFileSync(`content/blog/${lang}/${file}`, 'utf8'));
    const out = `public/blog-covers/${slug}-${lang}.png`;
    await tab.setContent(page(meta.title, meta.tags ?? [], slug, pick(slug)), {
      waitUntil: 'load',
    });
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: out });
    written.push(out);
  }
}
await browser.close();
console.log(`wrote ${written.join(', ')}`);
