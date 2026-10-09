// Renders content/blog/{zh,en}/*.md into /blog/ and /blog/<slug>/ (Chinese) plus the
// /en/ mirrors. Each post carries {title, description, date} frontmatter; the slug is the
// filename. The pages are generated, not committed; content/blog is the source.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Marked } from 'marked';
import { headerCommunityMarkup } from '../src/headerCommunity.ts';
import { navIconSvg, type NavIcon } from '../src/navIcons.ts';
import { privacyPath, searchButton } from './docs.ts';

type Lang = 'zh' | 'en';
const SITE = 'https://deepseekbot.app';
const CONTENT = 'content/blog';
export const BLOG_OUT = ['blog', 'en/blog'];

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
}

const UI = {
  zh: {
    htmlLang: 'zh-Hans',
    ogLocale: 'zh_CN',
    title: '博客',
    suffix: 'DeepSeekBot',
    description: 'DeepSeekBot 的实战文章：玩转 AI 机器人的指南与复盘。',
    lead: '把机器人用好的实战文章：指南、对比与复盘。',
    posts: '文章',
    back: '返回博客',
    nav: {
      features: '能力',
      install: '安装',
      market: 'Bot 市场',
      avatar: '头像工坊',
      changelog: '更新日志',
      blog: '博客',
      docs: '文档',
      community: '社区',
    },
    lang: '语言',
    mode: '昼夜',
    light: '白天',
    dark: '夜晚',
    skip: '跳到正文',
    source: '在 GitHub 查看原文',
    footer: '开源，MIT 许可。',
    privacy: '隐私说明',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Blog',
    suffix: 'DeepSeekBot',
    description:
      'Hands-on DeepSeekBot writing: guides and retrospectives on getting the most out of AI bots.',
    lead: 'Hands-on writing about getting the most out of bots: guides, comparisons and retrospectives.',
    posts: 'Posts',
    back: 'Back to the blog',
    nav: {
      features: 'Features',
      install: 'Install',
      market: 'Marketplace',
      avatar: 'Avatar Studio',
      changelog: 'Changelog',
      blog: 'Blog',
      docs: 'Docs',
      community: 'Community',
    },
    lang: 'Language',
    mode: 'Day or night',
    light: 'Day',
    dark: 'Night',
    skip: 'Skip to content',
    source: 'View the source on GitHub',
    footer: 'Open source under the MIT license.',
    privacy: 'Privacy',
  },
} as const;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const home = (lang: Lang) => (lang === 'zh' ? '/' : '/en/');
export const blogPath = (lang: Lang) => `${lang === 'zh' ? '' : '/en'}/blog/`;
export const blogPostPath = (lang: Lang, slug: string) => `${blogPath(lang)}${slug}/`;

function parsePost(slug: string, markdown: string): Post {
  const match = markdown.replaceAll('\r\n', '\n').match(/^---\n(\{[\s\S]*?\})\n---\n/);
  if (!match) throw new Error(`post ${slug} is missing JSON frontmatter`);
  const meta = JSON.parse(match[1]) as { title?: string; description?: string; date?: string };
  if (!meta.title || !meta.description || !meta.date)
    throw new Error(`post ${slug} needs title, description and date`);
  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    body: markdown.slice(match[0].length),
  };
}

export function readPosts(lang: Lang): Post[] {
  const dir = `${CONTENT}/${lang}`;
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  return files
    .map((f) => parsePost(f.replace(/\.md$/, ''), readFileSync(`${dir}/${f}`, 'utf8')))
    .toSorted((a, b) => (a.date < b.date ? 1 : -1));
}

const md = new Marked({ gfm: true });

function topnav(lang: Lang) {
  const t = UI[lang];
  const icon = (name: NavIcon) => `<span class="nav-icon-wrap">${navIconSvg(name)}</span>`;
  return `<nav class="topnav" aria-label="DeepSeekBot">
        <a href="${home(lang)}#features">${t.nav.features}</a>
        <a href="${home(lang)}#install">${t.nav.install}</a>
        <a href="${home(lang)}market">${icon('market')}${t.nav.market}</a>
        <a href="${home(lang)}avatar">${icon('avatar')}${t.nav.avatar}</a>
        <a href="${home(lang)}docs/overview/">${icon('docs')}${t.nav.docs}</a>
        <a class="nav-changelog" href="${home(lang)}changelog/">${icon('changelog')}${t.nav.changelog}</a>
        <a href="${blogPath(lang)}" aria-current="page">${icon('blog')}${t.nav.blog}</a>
        ${searchButton(lang)}
      </nav>`;
}

function shell(
  lang: Lang,
  url: string,
  title: string,
  description: string,
  main: string,
  enUrl?: string,
) {
  const t = UI[lang];
  const image = `${SITE}/og-${lang}-v2.png`;
  // Without an English mirror, alternates point at the Chinese page, never a 404.
  const en = enUrl ?? url.replace(SITE + '/', SITE + '/en/');
  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="zh-Hans" href="${url.replace('/en/', '/')}" />
    <link rel="alternate" hreflang="en" href="${en}" />
    <link rel="alternate" hreflang="x-default" href="${url.replace('/en/', '/')}" />
    <meta name="theme-color" content="#f6e7c1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DeepSeekBot" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:locale" content="${t.ogLocale}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
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
  <body data-docs data-blog data-lang="${lang}">
    <a class="skip" href="#main">${t.skip}</a>
    <header class="topbar">
      <a class="brand" href="${home(lang)}">
        <span class="brand-logo"><img src="/logo.png" width="32" height="32" alt="" /></span>
        <span>DeepSeekBot</span>
      </a>
      ${topnav(lang)}
      <div class="header-actions">
        ${headerCommunityMarkup(lang)}
        <div class="toggles">
        <nav class="lang-switch" aria-label="${t.lang}">
          <a href="${blogPath('zh')}" hreflang="zh-Hans" lang="zh-Hans"${lang === 'zh' ? ' aria-current="page"' : ''}>中文</a>
          <a href="${blogPath('en')}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
        </nav>
        <div class="mode-switch" role="group" aria-label="${t.mode}">
          <button type="button" data-mode="light" aria-label="${t.light}" title="${t.light}">${navIconSvg('sun')}</button>
          <button type="button" data-mode="dark" aria-label="${t.dark}" title="${t.dark}">${navIconSvg('moon')}</button>
        </div>
      </div>
      </div>
    </header>
    ${main}
    <footer class="footer"><p>DeepSeekBot · ${t.footer} <a href="${privacyPath(lang)}">${t.privacy}</a></p></footer>
    <script type="module" src="/src/docs.ts"></script>
  </body>
</html>
`;
}

function indexMain(lang: Lang, posts: Post[]) {
  const t = UI[lang];
  const items = posts
    .map(
      (p) =>
        `<li><a href="${blogPostPath(lang, p.slug)}">${escape(p.title)}</a><time datetime="${p.date}">${p.date}</time><p>${escape(p.description)}</p></li>`,
    )
    .join('');
  const nav = posts
    .map((p) => `<li><a href="${blogPostPath(lang, p.slug)}">${escape(p.title)}</a></li>`)
    .join('');
  return `<div class="docs-layout">
      <nav class="docs-nav" aria-label="${t.posts}"><details open><summary>${t.posts}</summary><p class="docs-nav-title">${t.posts}</p><ul>${nav}</ul></details></nav>
      <main id="main" class="docs-main">
        <article class="docs-article frame">
          <p class="kicker">DeepSeekBot</p>
          <h1>${t.title}</h1>
          <p class="docs-lead">${t.lead}</p>
          <ul class="blog-index">${items}</ul>
        </article>
      </main>
    </div>`;
}

function postMain(lang: Lang, post: Post, posts: Post[]) {
  const t = UI[lang];
  const html = md.parse(post.body, { async: false }) as string;
  const nav = posts
    .map(
      (p) =>
        `<li><a href="${blogPostPath(lang, p.slug)}"${p.slug === post.slug ? ' aria-current="page"' : ''}>${escape(p.title)}</a></li>`,
    )
    .join('');
  const source = `https://github.com/BotHarness/deepseekbot-site/blob/main/content/blog/${lang}/${post.slug}.md`;
  return `<div class="docs-layout">
      <nav class="docs-nav" aria-label="${t.posts}"><details open><summary>${t.posts}</summary><p class="docs-nav-title">${t.posts}</p><ul>${nav}</ul></details></nav>
      <main id="main" class="docs-main">
        <article class="docs-article frame">
          <p class="kicker">DeepSeekBot</p>
          <h1>${escape(post.title)}</h1>
          <p class="docs-lead">${escape(post.description)}</p>
          <p><time datetime="${post.date}">${post.date}</time> · <a href="${blogPath(lang)}">${t.back}</a></p>
          <div class="docs-body">${html}</div>
        </article>
        <p class="docs-source"><a href="${source}" target="_blank" rel="noreferrer">${t.source}</a></p>
      </main>
    </div>`;
}

/** Writes the blog index and every post page and returns their paths, for Vite's inputs. */
export function renderBlog(): string[] {
  for (const dir of BLOG_OUT) rmSync(dir, { recursive: true, force: true });
  const written: string[] = [];
  for (const lang of ['zh', 'en'] as const) {
    const posts = readPosts(lang);
    const other = readPosts(lang === 'zh' ? 'en' : 'zh');
    const mirror = new Set(other.map((p) => p.slug));
    const index = `${blogPath(lang).slice(1)}index.html`;
    mkdirSync(dirname(index), { recursive: true });
    writeFileSync(
      index,
      shell(
        lang,
        `${SITE}${blogPath(lang)}`,
        `${UI[lang].title} · ${UI[lang].suffix}`,
        UI[lang].description,
        indexMain(lang, posts),
      ),
    );
    written.push(index);
    for (const post of posts) {
      const file = `${blogPostPath(lang, post.slug).slice(1)}index.html`;
      mkdirSync(dirname(file), { recursive: true });
      const postUrl = `${SITE}${blogPostPath(lang, post.slug)}`;
      writeFileSync(
        file,
        shell(
          lang,
          postUrl,
          `${post.title} · ${UI[lang].suffix}`,
          post.description,
          postMain(lang, post, posts),
          lang === 'zh' && !mirror.has(post.slug) ? postUrl : undefined,
        ),
      );
      written.push(file);
    }
  }
  return written;
}

/** Sitemap entries for the blog index and every post, with both languages linked. */
export function blogSitemap(): string {
  const enSlugs = new Set(readPosts('en').map((p) => p.slug));
  const urls = [blogPath('zh'), ...readPosts('zh').map((p) => blogPostPath('zh', p.slug))];
  return urls
    .map((path) => {
      const zh = `${SITE}${path}`;
      const slug = path === blogPath('zh') ? undefined : path.slice(blogPath('zh').length, -1);
      // A post without an English mirror gets a Chinese-only entry, never a 404.
      const locs =
        slug && !enSlugs.has(slug) ? [zh] : [zh, `${SITE}${path.replace('/blog/', '/en/blog/')}`];
      const [first, second] = [locs[0]!, locs[1] ?? locs[0]!];
      return locs
        .map(
          (loc) => `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${first}" />
    <xhtml:link rel="alternate" hreflang="en" href="${second}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${first}" />
  </url>`,
        )
        .join('\n');
    })
    .join('\n');
}
