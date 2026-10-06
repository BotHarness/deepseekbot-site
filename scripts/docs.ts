// Renders content/docs/{zh,en}/**/*.md into static pages: /docs/<slug>/ (Chinese) and
// /en/docs/<slug>/ (English), each a full HTML entry for Vite with the site's header, a guide
// sidebar and the article. The pages are generated, not committed; content/docs is the source.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { Marked, type Tokens } from 'marked';
import { navIconSvg } from '../src/navIcons.ts';

type Lang = 'zh' | 'en';
const SITE = 'https://deepseekbot.botharness.ai';
const UPSTREAM = 'https://botharness.ai';
const CONTENT = 'content/docs';
export const DOCS_OUT = ['docs', 'en/docs'];

interface Doc {
  slug: string;
  title: string;
  description: string;
  order: number;
  parent?: string;
  source: string;
  body: string;
}

const UI = {
  zh: {
    htmlLang: 'zh-Hans',
    ogLocale: 'zh_CN',
    docs: '文档',
    suffix: 'DeepSeekBot 文档',
    guides: '使用教程',
    menu: '目录',
    nav: { features: '能力', install: '安装', market: 'Bot 市场', community: '社区' },
    lang: '语言',
    mode: '昼夜',
    light: '白天',
    dark: '夜晚',
    prev: '上一篇',
    next: '下一篇',
    edit: '在 GitHub 查看原文',
    skip: '跳到正文',
    copy: '复制',
    copied: '已复制',
    footer: '开源，MIT 许可。',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    docs: 'Docs',
    suffix: 'DeepSeekBot docs',
    guides: 'Guides',
    menu: 'Contents',
    nav: {
      features: 'Features',
      install: 'Install',
      market: 'Marketplace',
      community: 'Community',
    },
    lang: 'Language',
    mode: 'Day or night',
    light: 'Day',
    dark: 'Night',
    prev: 'Previous',
    next: 'Next',
    edit: 'View the source on GitHub',
    skip: 'Skip to content',
    copy: 'Copy',
    copied: 'Copied',
    footer: 'Open source under the MIT license.',
  },
} as const;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const home = (lang: Lang) => (lang === 'zh' ? '/' : '/en/');
export const docPath = (lang: Lang, slug: string) => `${lang === 'zh' ? '' : '/en'}/docs/${slug}/`;

function read(lang: Lang): Doc[] {
  const docs: Doc[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.md')) {
        const text = readFileSync(path, 'utf8');
        const match = text.match(/^---\n([\s\S]*?)\n---\n/);
        if (!match) throw new Error(`${path}: missing front matter`);
        const meta = JSON.parse(match[1]!) as Omit<Doc, 'slug' | 'body'>;
        const slug = relative(join(CONTENT, lang), path).replace(/\.md$/, '');
        docs.push({ ...meta, slug, body: text.slice(match[0].length) });
      }
    }
  };
  walk(join(CONTENT, lang));
  // sidebar order: top-level pages by order, each followed by its children
  const top = docs.filter((d) => !d.parent).sort((a, b) => a.order - b.order);
  return top.flatMap((d) => [
    d,
    ...docs.filter((c) => c.parent === d.slug).sort((a, b) => a.order - b.order),
  ]);
}

/** Internal links stay on this site in the page's language; developer docs go to botharness.ai. */
function href(lang: Lang, url: string, slugs: Set<string>): string {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const [path = '', hash = ''] = url.split(/(?=#)/);
  const doc = path.match(/^\/(?:(zh|en)\/)?docs\/?(.*?)\/?$/);
  if (doc) {
    const slug = doc[2] || 'overview';
    if (!slugs.has(slug)) return `${UPSTREAM}${path}${hash}`;
    return docPath(doc[1] === 'zh' ? 'zh' : doc[1] === 'en' ? 'en' : lang, slug) + hash;
  }
  if (path.startsWith('/guides/')) return url;
  // /dev, /changelog and the rest live on botharness.ai, where Chinese sits under /zh
  const upstream = lang === 'zh' && !path.startsWith('/zh/') ? `/zh${path}` : path;
  return `${UPSTREAM}${upstream}${hash}`;
}

function markdown(lang: Lang, slugs: Set<string>) {
  const md = new Marked({ gfm: true });
  const ids = new Map<string, number>();
  md.use({
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') {
        const t = token as Tokens.Link | Tokens.Image;
        t.href = href(lang, t.href, slugs);
      }
    },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, '');
        const base =
          plain
            .toLowerCase()
            .replace(/&[a-z]+;/g, '')
            .replace(/[^\p{L}\p{N}]+/gu, '-')
            .replace(/^-|-$/g, '') || 'section';
        const n = ids.get(base) ?? 0;
        ids.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${depth}>\n`;
      },
      link({ href: url, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:/.test(url) && !url.startsWith(SITE);
        return `<a href="${escape(url)}"${title ? ` title="${escape(title)}"` : ''}${
          external ? ' target="_blank" rel="noreferrer"' : ''
        }>${text}</a>`;
      },
      image({ href: url, title, text }) {
        return `<img src="${escape(url)}" alt="${escape(text)}"${
          title ? ` title="${escape(title)}"` : ''
        } loading="lazy" decoding="async">`;
      },
    },
  });
  return (body: string) => {
    ids.clear();
    // wide tables scroll inside their own box instead of widening the page
    return (md.parse(body, { async: false }) as string)
      .replaceAll('<table>', '<div class="table-wrap"><table>')
      .replaceAll('</table>', '</table></div>');
  };
}

function sidebar(lang: Lang, docs: Doc[], current: string) {
  const items = docs
    .map(
      (d) =>
        `<li${d.parent ? ' class="docs-nav-child"' : ''}><a href="${docPath(lang, d.slug)}"${
          d.slug === current ? ' aria-current="page"' : ''
        }>${escape(d.title)}</a></li>`,
    )
    .join('');
  const t = UI[lang];
  return `<nav class="docs-nav" aria-label="${t.guides}"><details open><summary>${t.menu}</summary><p class="docs-nav-title">${t.guides}</p><ul>${items}</ul></details></nav>`;
}

function page(lang: Lang, doc: Doc, docs: Doc[], html: string) {
  const t = UI[lang];
  const i = docs.indexOf(doc);
  const prev = docs[i - 1];
  const next = docs[i + 1];
  const url = `${SITE}${docPath(lang, doc.slug)}`;
  const title = `${doc.title} · ${t.suffix}`;
  const image = `${SITE}/og-${lang}-v2.png`;
  const pager = [
    prev
      ? `<a class="pager-prev frame" href="${docPath(lang, prev.slug)}"><span>${t.prev}</span>${escape(prev.title)}</a>`
      : '<span></span>',
    next
      ? `<a class="pager-next frame" href="${docPath(lang, next.slug)}"><span>${t.next}</span>${escape(next.title)}</a>`
      : '<span></span>',
  ].join('');
  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(doc.description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="zh-Hans" href="${SITE}${docPath('zh', doc.slug)}" />
    <link rel="alternate" hreflang="en" href="${SITE}${docPath('en', doc.slug)}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${docPath('zh', doc.slug)}" />
    <meta name="theme-color" content="#f6e7c1" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="DeepSeekBot" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(doc.description)}" />
    <meta property="og:locale" content="${t.ogLocale}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(doc.description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preload" href="/fonts/pixel.woff2" as="font" type="font/woff2" crossorigin />
    <style>
      @font-face {
        font-family: 'DSB Pixel';
        src: url('/fonts/pixel.woff2') format('woff2');
        font-display: swap;
      }
    </style>
    <script>
      try {
        var m = localStorage.getItem('dsb-mode');
        if (m !== 'light' && m !== 'dark')
          m = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = m;
      } catch (e) {}
    </script>
  </head>
  <body data-docs data-copy="${t.copy}" data-copied="${t.copied}">
    <a class="skip" href="#main">${t.skip}</a>
    <header class="topbar">
      <a class="brand" href="${home(lang)}">
        <img class="brand-logo" src="/logo.png" width="32" height="32" alt="" />
        <span>DeepSeekBot</span>
      </a>
      <nav class="topnav" aria-label="DeepSeekBot">
        <a href="${docPath(lang, 'overview')}" aria-current="page"><span class="nav-icon-wrap">${navIconSvg('docs')}</span>${t.docs}</a>
        <a href="${home(lang)}#features">${t.nav.features}</a>
        <a href="${home(lang)}#install">${t.nav.install}</a>
        <a href="${home(lang)}market"><span class="nav-icon-wrap">${navIconSvg('market')}</span>${t.nav.market}</a>
        <a href="${home(lang)}#community">${t.nav.community}</a>
        <a href="https://github.com/BotHarness/BotHarness" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <div class="toggles">
        <nav class="lang-switch" aria-label="${t.lang}">
          <a href="${docPath('zh', doc.slug)}" hreflang="zh-Hans" lang="zh-Hans"${lang === 'zh' ? ' aria-current="page"' : ''}>中文</a>
          <a href="${docPath('en', doc.slug)}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
        </nav>
        <div class="mode-switch" role="group" aria-label="${t.mode}">
          <button type="button" data-mode="light">${t.light}</button>
          <button type="button" data-mode="dark">${t.dark}</button>
        </div>
      </div>
    </header>
    <div class="docs-layout">
      ${sidebar(lang, docs, doc.slug)}
      <main id="main" class="docs-main">
        <article class="docs-article frame">
          <p class="kicker">${t.docs}</p>
          <h1>${escape(doc.title)}</h1>
          ${doc.description ? `<p class="docs-lead">${escape(doc.description)}</p>` : ''}
          <div class="docs-body">${html}</div>
        </article>
        <nav class="docs-pager" aria-label="${t.prev} / ${t.next}">${pager}</nav>
        <p class="docs-source"><a href="https://github.com/BotHarness/BotHarness/blob/main/${doc.source}" target="_blank" rel="noreferrer">${t.edit}</a></p>
      </main>
    </div>
    <footer class="footer"><p>DeepSeekBot · ${t.footer}</p></footer>
    <script type="module" src="/src/docs.ts"></script>
  </body>
</html>
`;
}

/** Writes every guide page and returns their paths, for Vite's inputs. */
export function renderDocs(): string[] {
  for (const dir of DOCS_OUT) rmSync(dir, { recursive: true, force: true });
  const written: string[] = [];
  for (const lang of ['zh', 'en'] as const) {
    const docs = read(lang);
    const render = markdown(lang, new Set(docs.map((d) => d.slug)));
    for (const doc of docs) {
      const file = join(docPath(lang, doc.slug).slice(1), 'index.html');
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, page(lang, doc, docs, render(doc.body)));
      written.push(file);
    }
  }
  return written;
}

/** Sitemap entries for every guide, with both languages linked. */
export function docsSitemap(): string {
  return read('zh')
    .map((d) => {
      const zh = `${SITE}${docPath('zh', d.slug)}`;
      const en = `${SITE}${docPath('en', d.slug)}`;
      return [zh, en]
        .map(
          (loc) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${zh}" />
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${zh}" />
  </url>`,
        )
        .join('\n');
    })
    .join('\n');
}
