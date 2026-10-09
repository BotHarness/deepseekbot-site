// Renders content/blog/{zh,en}/*.md into /blog/ and /blog/<slug>/ (Chinese) plus the
// /en/ mirrors. Each post carries {title, description, date} frontmatter; the slug is the
// filename. The pages are generated, not committed; content/blog is the source.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
  tags: string[];
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
    readMore: '阅读全文',
    allPosts: '全部文章',
    toc: '本页内容',
    minRead: (n: number) => `${n} 分钟阅读`,
    copyUrl: '复制链接',
    copied: '已复制',
    byTeam: 'DoodleBear（BotHarness 团队）',
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
    readMore: 'Read more',
    allPosts: 'All posts',
    toc: 'On this page',
    minRead: (n: number) => `${n} MIN READ`,
    copyUrl: 'Copy URL',
    copied: 'Copied',
    byTeam: 'DoodleBear (BotHarness Team)',
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
  const meta = JSON.parse(match[1]) as {
    title?: string;
    description?: string;
    date?: string;
    tags?: string[];
  };
  if (!meta.title || !meta.description || !meta.date)
    throw new Error(`post ${slug} needs title, description and date`);
  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    tags: meta.tags ?? [],
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
    .toSorted((a, b) =>
      a.date !== b.date ? (a.date < b.date ? 1 : -1) : a.slug.localeCompare(b.slug),
    );
}

/** Minutes to read: ~400 CJK characters or ~200 English words per minute. */
export function readMinutes(lang: Lang, text: string): number {
  const units =
    lang === 'zh'
      ? text.replace(/\s/g, '').length / 400
      : text.split(/\s+/).filter(Boolean).length / 200;
  return Math.max(1, Math.ceil(units));
}

/** Cover art for a post, or null when it has not been generated yet. */
export function coverFor(lang: Lang, slug: string): string | null {
  return existsSync(`public/blog-covers/${slug}-${lang}.png`)
    ? `/blog-covers/${slug}-${lang}.png`
    : null;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

/** Renders a post body, tagging h2s with ids and collecting them for the TOC. */
function renderBody(body: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const seen = new Map<string, number>();
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, '');
        if (depth !== 2) return `<h${depth}>${text}</h${depth}>\n`;
        const base = slugify(plain) || 'section';
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n === 0 ? base : `${base}-${n}`;
        toc.push({ id, text: plain });
        return `<h2 id="${escape(id)}">${text}</h2>\n`;
      },
    },
  });
  return { html: md.parse(body, { async: false }) as string, toc };
}

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
  cover?: string,
) {
  const t = UI[lang];
  const image = cover ? `${SITE}${cover}` : `${SITE}/og-${lang}-v2.png`;
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

function card(lang: Lang, post: Post) {
  const cover = coverFor(lang, post.slug);
  return `<li class="blog-card frame"><a href="${blogPostPath(lang, post.slug)}">${
    cover
      ? `<img src="${cover}" alt="" loading="lazy" />`
      : `<span class="blog-card-fallback" aria-hidden="true"></span>`
  }<time datetime="${post.date}">${post.date}</time><strong>${escape(post.title)}</strong><span>${escape(post.description)}</span></a></li>`;
}

function indexMain(lang: Lang, posts: Post[]) {
  const t = UI[lang];
  const [hero, ...rest] = posts;
  const heroCover = hero ? coverFor(lang, hero.slug) : null;
  const heroBlock = hero
    ? `<section class="blog-hero frame"><div><time datetime="${hero.date}">${hero.date}</time><h2><a href="${blogPostPath(lang, hero.slug)}">${escape(hero.title)}</a></h2><p>${escape(hero.description)}</p><p><a class="blog-readmore" href="${blogPostPath(lang, hero.slug)}">${t.readMore} →</a></p></div>${
        heroCover
          ? `<a href="${blogPostPath(lang, hero.slug)}"><img src="${heroCover}" alt="" /></a>`
          : ''
      }</section>`
    : '';
  const nav = posts
    .map((p) => `<li><a href="${blogPostPath(lang, p.slug)}">${escape(p.title)}</a></li>`)
    .join('');
  void nav;
  return `<div class="blog-index-layout">
      <main id="main" class="docs-main">
        <article class="docs-article">
          <p class="kicker">DeepSeekBot</p>
          <h1>${t.title}</h1>
          <p class="docs-lead">${t.lead}</p>
          ${heroBlock}
          ${rest.length > 0 ? `<ul class="blog-cards">${rest.map((p) => card(lang, p)).join('')}</ul>` : ''}
          <h2>${t.allPosts}</h2>
          <ul class="blog-index">${posts
            .map(
              (p) =>
                `<li class="frame blog-index-row"><time datetime="${p.date}">${p.date}</time> · <a href="${blogPostPath(lang, p.slug)}">${escape(p.title)}</a><p>${escape(p.description)}</p></li>`,
            )
            .join('')}</ul>
        </article>
      </main>
    </div>`;
}

function postMain(lang: Lang, post: Post, posts: Post[]) {
  const t = UI[lang];
  const { html, toc } = renderBody(post.body);
  const cover = coverFor(lang, post.slug);
  const minutes = readMinutes(lang, post.body);
  const tags = post.tags.map((tag) => `<span class="blog-tag">${escape(tag)}</span>`).join('');
  const tocItems = toc.map((h) => `<li><a href="#${h.id}">${escape(h.text)}</a></li>`).join('');
  const source = `https://github.com/BotHarness/deepseekbot-site/blob/main/content/blog/${lang}/${post.slug}.md`;
  return `<div class="blog-post-layout">
      <main id="main" class="docs-main">
        <article class="docs-article frame">
          <p class="blog-crumb"><a href="${blogPath(lang)}">${t.title}</a>${tags}</p>
          <time datetime="${post.date}">${post.date}</time>
          <h1>${escape(post.title)}</h1>
          <p class="blog-byline">${t.byTeam} · ${t.minRead(minutes)} · <button type="button" data-copy-url data-label="${t.copyUrl}" data-ok="${t.copied}">${t.copyUrl}</button></p>
          ${cover ? `<img class="blog-cover" src="${cover}" alt="" />` : ''}
          <p class="docs-lead">${escape(post.description)}</p>
          ${toc.length > 0 ? `<details class="blog-toc blog-toc-mobile"><summary>${t.toc}</summary><ul>${tocItems}</ul></details>` : ''}
          <div class="docs-body">${html}</div>
        </article>
        <p class="docs-source"><a href="${source}" target="_blank" rel="noreferrer">${t.source}</a></p>
      </main>
      ${toc.length > 0 ? `<aside class="blog-rail" aria-label="${t.toc}"><div class="blog-rail-sticky"><p class="toc-label">${t.toc}</p><ul>${tocItems}</ul></div></aside>` : ''}
    </div>
    <script>
      (function () {
        var b = document.querySelector('[data-copy-url]');
        if (!b) return;
        b.addEventListener('click', function () {
          var ok = function (good) {
            b.textContent = good ? b.dataset.ok : b.dataset.label;
          };
          if (navigator.clipboard && navigator.clipboard.writeText)
            navigator.clipboard.writeText(location.href).then(
              function () { ok(true); },
              function () { ok(false); },
            );
        });
      })();
    </script>`;
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
          coverFor(lang, post.slug) ?? undefined,
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
