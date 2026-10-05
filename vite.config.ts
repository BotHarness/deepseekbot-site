import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pixelAvatarSvg, seededRecipe } from '@botharness/pixel-avatar';
import react from '@vitejs/plugin-react';
import subsetFont from 'subset-font';
import { defineConfig, type Plugin } from 'vite';

const require = createRequire(import.meta.url);
const FONT_URL = '/fonts/pixel.woff2';
// the Chinese entry at / and the English one at /en/, each with its own share card
const PAGES = ['index.html', 'en/index.html'];
const fontFile = () =>
  readFileSync(
    require.resolve('@fontsource/fusion-pixel-12px-proportional-sc/files/fusion-pixel-12px-proportional-sc-latin-400-normal.woff2'),
  );

/** Every character the site can render: the source text plus printable ASCII. */
function siteCharacters(): string {
  const chars = new Set<string>();
  for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
  const add = (text: string) => {
    for (const ch of text) chars.add(ch);
  };
  for (const page of PAGES) add(readFileSync(page, 'utf8'));
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.(tsx?|css)$/.test(entry.name)) add(readFileSync(path, 'utf8'));
    }
  };
  walk('src');
  // punctuation the copy may grow into
  add('，。、；：？！“”‘’（）《》「」…—·→ ');
  return [...chars].join('');
}

/**
 * Fusion Pixel covers all of simplified Chinese (~600 KB). Dev serves the whole font; the
 * build ships only the glyphs the site uses, and the favicon is the mascot's BotPixel face.
 */
function pixelAssets(): Plugin {
  return {
    name: 'deepseekbot-pixel-assets',
    configureServer(server) {
      server.middlewares.use(FONT_URL, (_req, res) => {
        res.setHeader('Content-Type', 'font/woff2');
        res.end(fontFile());
      });
      server.middlewares.use('/favicon.svg', (_req, res) => {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(favicon());
      });
    },
    async generateBundle() {
      const subset = await subsetFont(fontFile(), siteCharacters(), { targetFormat: 'woff2' });
      this.emitFile({ type: 'asset', fileName: FONT_URL.slice(1), source: subset });
      this.emitFile({ type: 'asset', fileName: 'favicon.svg', source: favicon() });
    },
  };
}

const favicon = () =>
  pixelAvatarSvg(seededRecipe('DeepSeekBot')).replace(' aria-hidden="true"', '');

export default defineConfig({
  plugins: [react(), pixelAssets()],
  build: { rollupOptions: { input: PAGES } },
});
