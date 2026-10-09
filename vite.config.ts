import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import subsetFont from 'subset-font';
import { defineConfig, type Plugin } from 'vite';
import { changelogPath, renderChangelog } from './scripts/changelog.ts';
import { blogPath, blogSitemap, renderBlog } from './scripts/blog.ts';
import { docsSitemap, renderDocs, searchIndex } from './scripts/docs.ts';

const require = createRequire(import.meta.url);
const FONT_URL = '/fonts/pixel.woff2';
const SITE = 'https://deepseekbot.app';
// the Chinese entry at / and the English one at /en/, each with its own share card, plus the
// guides rendered from content/docs and the changelog from content/changelog
const PAGES = [
  'index.html',
  'en/index.html',
  'market.html',
  'en/market.html',
  'avatar.html',
  'en/avatar.html',
  ...renderDocs(),
  ...renderChangelog(),
  ...renderBlog(),
];
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
  // guide and changelog bodies are set in the system font; only their titles, headings and
  // section toggles and changelog chips use the pixel face
  for (const page of PAGES) {
    const html = readFileSync(page, 'utf8');
    if (!/(?:docs|changelog)\//.test(page)) add(html);
    else
      for (const m of html.matchAll(
        /<(h[1-6]|nav|header|summary|a class="pager[^"]*"|p class="kicker"|span class="changelog-(?:chip|latest)")[^>]*>([\s\S]*?)<\/(h[1-6]|nav|header|summary|a|p|span)>/g,
      ))
        add(m[2]!.replace(/<[^>]+>/g, ''));
  }
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
 * build ships only the glyphs the site uses. Also the sitemap and the docs search indexes.
 */
function pixelAssets(): Plugin {
  return {
    name: 'deepseekbot-pixel-assets',
    configureServer(server) {
      server.middlewares.use(FONT_URL, (_req, res) => {
        res.setHeader('Content-Type', 'font/woff2');
        res.end(fontFile());
      });
      for (const lang of ['zh', 'en'] as const)
        server.middlewares.use(`/search/${lang}.json`, (_req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(searchIndex(lang)));
        });
    },
    async generateBundle() {
      const subset = await subsetFont(fontFile(), siteCharacters(), { targetFormat: 'woff2' });
      this.emitFile({ type: 'asset', fileName: FONT_URL.slice(1), source: subset });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
      // the docs search box loads its language's index on first open
      for (const lang of ['zh', 'en'] as const)
        this.emitFile({
          type: 'asset',
          fileName: `search/${lang}.json`,
          source: JSON.stringify(searchIndex(lang)),
        });
    },
  };
}

const sitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[
  ['/', '/', '/en/'],
  ['/en/', '/', '/en/'],
  ['/market', '/market', '/en/market'],
  ['/en/market', '/market', '/en/market'],
  ['/avatar', '/avatar', '/en/avatar'],
  ['/en/avatar', '/avatar', '/en/avatar'],
  [changelogPath('zh'), changelogPath('zh'), changelogPath('en')],
  [changelogPath('en'), changelogPath('zh'), changelogPath('en')],
  [blogPath('zh'), blogPath('zh'), blogPath('en')],
  [blogPath('en'), blogPath('zh'), blogPath('en')],
  ['/privacy/', '/privacy/', '/en/privacy/'],
  ['/en/privacy/', '/privacy/', '/en/privacy/'],
]
  .map(
    ([path, zh, en]) => `  <url>
    <loc>${SITE}${path}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE}${zh}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${zh}" />
  </url>`,
  )
  .join('\n')}
${docsSitemap()}
${blogSitemap()}
</urlset>
`;

export default defineConfig({
  plugins: [react(), pixelAssets()],
  build: { rollupOptions: { input: PAGES } },
});
