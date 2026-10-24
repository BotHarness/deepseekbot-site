// Renders content/plugins/<slug>.json into the plugin shelf next to the Bot marketplace:
// /plugins/ and /en/plugins/ list every plugin, /plugins/<slug>/ and /en/plugins/<slug>/ hold
// its demo, install command, usage, performance and license notes. Adding a plugin is one JSON
// file plus its media under public/; no page code. The pages are generated, not committed.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Marked } from 'marked';
import { headerCommunityMarkup } from '../src/headerCommunity.ts';
import { navIconSvg, type NavIcon } from '../src/navIcons.ts';
import { privacyPath, searchButton } from './docs.ts';

type Lang = 'zh' | 'en';
const SITE = 'https://tobs.app';
const CONTENT = 'content/plugins';
export const PLUGINS_OUT = ['plugins', 'en/plugins'];

interface Image {
  light: string;
  dark?: string;
}

interface Still extends Image {
  zh: string;
  en: string;
}

interface Copy {
  title: string;
  pitch: string;
  description: string;
  tags: string[];
  usage: string[];
  controls: { name: string; text: string }[];
  customCharacter?: string;
  performance: string[];
  licenses: string[];
}

export interface Plugin {
  slug: string;
  order: number;
  package: string;
  version: string;
  official: boolean;
  platform: string;
  dsh: string;
  /** The last Tobs version that is too old; the plugin needs a newer one. */
  deepseekbot: string;
  source: string;
  guide: string;
  /** Folder under public/ holding the plugin's media; the file names below are relative to it. */
  media: string;
  cover: Image;
  video?: { src: string; poster?: string };
  stills: Still[];
  zh: Copy;
  en: Copy;
}

const UI = {
  zh: {
    htmlLang: 'zh-Hans',
    ogLocale: 'zh_CN',
    title: '插件',
    suffix: 'Tobs',
    description: 'Tobs 插件：截图、安装命令、版本要求、用法和素材许可。',
    lead: '插件给 Tobs 加上新的面板和能力。每个插件单独发布在 npm 上，用一条命令装进你的 Profile。',
    shelves: '市场分类',
    bots: 'Bot',
    plugins: '插件',
    back: '全部插件',
    details: '查看详情',
    install: '安装',
    installNote: '装好后重启 Host。',
    profile: '<your-profile>',
    requires: '版本要求',
    dsh: 'DeepSeek Harness',
    deepseekbot: 'Tobs',
    newerThan: (v: string) => `高于 ${v}`,
    links: '链接',
    npm: 'npm',
    source: '源代码',
    guide: '完整指南',
    demo: '演示',
    about: '简介',
    usage: '使用',
    controls: '面板顶栏',
    customCharacter: '使用自己的角色',
    performance: '性能',
    licenses: '素材与许可',
    licenseLink: '完整许可说明',
    nav: {
      features: '能力',
      install: '安装',
      market: '市场',
      avatar: '头像工坊',
      changelog: '更新日志',
      blog: '博客',
      docs: '文档',
    },
    lang: '语言',
    mode: '昼夜',
    light: '白天',
    dark: '夜晚',
    skip: '跳到正文',
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败',
    footer: '开源，MIT 许可。',
    privacy: '隐私说明',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Plugins',
    suffix: 'Tobs',
    description:
      'Tobs plugins: screenshots, install commands, requirements, usage and asset licenses.',
    lead: 'Plugins add new Panels and abilities to Tobs. Each one is published on npm on its own and installs into your Profile with one command.',
    shelves: 'Marketplace shelves',
    bots: 'Bots',
    plugins: 'Plugins',
    back: 'All plugins',
    details: 'Details',
    install: 'Install',
    installNote: 'Restart the Host after installing.',
    profile: '<your-profile>',
    requires: 'Requirements',
    dsh: 'DeepSeek Harness',
    deepseekbot: 'Tobs',
    newerThan: (v: string) => `newer than ${v}`,
    links: 'Links',
    npm: 'npm',
    source: 'Source',
    guide: 'Full guide',
    demo: 'Demo',
    about: 'About',
    usage: 'Usage',
    controls: 'Panel header',
    customCharacter: 'Use your own character',
    performance: 'Performance',
    licenses: 'Assets and licenses',
    licenseLink: 'Full license notes',
    nav: {
      features: 'Features',
      install: 'Install',
      market: 'Marketplace',
      avatar: 'Avatar Studio',
      changelog: 'Changelog',
      blog: 'Blog',
      docs: 'Docs',
    },
    lang: 'Language',
    mode: 'Day or night',
    light: 'Day',
    dark: 'Night',
    skip: 'Skip to content',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    footer: 'Open source under the MIT license.',
    privacy: 'Privacy',
  },
} as const;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const inline = (text: string) => new Marked({ gfm: true }).parseInline(text, { async: false });

const home = (lang: Lang) => (lang === 'zh' ? '/' : '/en/');
export const pluginsPath = (lang: Lang) => `${lang === 'zh' ? '' : '/en'}/plugins/`;
export const pluginPath = (lang: Lang, slug: string) => `${pluginsPath(lang)}${slug}/`;
export const installCommand = (plugin: Plugin, profile = '<your-profile>') =>
  `dsh plugin --profile ${profile} add ${plugin.package}@${plugin.version}`;
const npmUrl = (plugin: Plugin) =>
  `https://www.npmjs.com/package/${plugin.package}/v/${plugin.version}`;

/** A media path under public/, or null while the file has not been recorded yet. */
const media = (plugin: Plugin, file: string | undefined) =>
  file && existsSync(`public${plugin.media}${file}`) ? `${plugin.media}${file}` : null;

/** Width and height of a WebP or PNG, so images reserve their space before they load. */
export function imageSize(path: string): { width: number; height: number } {
  const b = readFileSync(path);
  if (b.length < 30) throw new Error(`${path}: image file is truncated`);
  if (b.toString('ascii', 1, 4) === 'PNG')
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP')
    throw new Error(`${path}: plugin media must be WebP or PNG`);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ')
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
}

/** The image in the site's current theme: the dark capture shows only on the night palette. */
function picture(plugin: Plugin, image: Image, alt: string, className: string, lazy = true) {
  const light = media(plugin, image.light);
  if (!light) return '';
  const dark = media(plugin, image.dark);
  const img = (src: string, theme: string) => {
    const { width, height } = imageSize(`public${src}`);
    return `<img class="${className}" src="${src}" width="${width}" height="${height}" alt="${escape(alt)}"${dark ? ` data-theme-only="${theme}"` : ''}${lazy ? ' loading="lazy"' : ''} />`;
  };
  return dark ? img(light, 'light') + img(dark, 'dark') : img(light, 'light');
}

function command(lang: Lang, text: string) {
  const t = UI[lang];
  return `<div class="command plugin-command"><code><span class="prompt" aria-hidden="true">$ </span>${escape(text)}</code><button type="button" class="code-copy" data-copy-command="${escape(text)}" data-copied="${t.copied}" data-copy-failed="${t.copyFailed}">${t.copy}</button></div>`;
}

function tags(copy: Copy) {
  return `<ul class="plugin-tags">${copy.tags.map((tag) => `<li class="topic-chip">${escape(tag)}</li>`).join('')}</ul>`;
}

function requirements(lang: Lang, plugin: Plugin) {
  const t = UI[lang];
  return `<dl class="plugin-requires">
  <dt>${t.dsh}</dt><dd><code>${escape(plugin.dsh)}</code></dd>
  <dt>${t.deepseekbot}</dt><dd>${t.newerThan(escape(plugin.deepseekbot))}</dd>
</dl>`;
}

/** The two shelves of the marketplace; the Bot list is the React page at /market. */
export function shelves(lang: Lang, current: 'bots' | 'plugins') {
  const t = UI[lang];
  const at = (shelf: 'bots' | 'plugins') => (current === shelf ? ' aria-current="page"' : '');
  return `<nav class="market-shelves" aria-label="${t.shelves}"><a class="topic-chip" href="${home(lang)}market"${at('bots')}>${t.bots}</a><a class="topic-chip" href="${pluginsPath(lang)}"${at('plugins')}>${t.plugins}</a></nav>`;
}

function card(lang: Lang, plugin: Plugin) {
  const t = UI[lang];
  const copy = plugin[lang];
  const href = pluginPath(lang, plugin.slug);
  return `<li><article class="plugin-card frame">
  <a class="plugin-card-cover" href="${href}" tabindex="-1" aria-hidden="true">${picture(plugin, plugin.cover, '', 'plugin-cover')}</a>
  <div class="plugin-card-body">
    <h2><a href="${href}">${escape(copy.title)}</a></h2>
    ${tags(copy)}
    <p class="plugin-pitch">${escape(copy.pitch)}</p>
    <p class="plugin-package"><a href="${npmUrl(plugin)}" target="_blank" rel="noreferrer"><code>${escape(plugin.package)}@${escape(plugin.version)}</code></a></p>
    ${command(lang, installCommand(plugin, t.profile))}
    ${requirements(lang, plugin)}
    <a class="plugin-more" href="${href}">${t.details} →</a>
  </div>
</article></li>`;
}

function listMain(lang: Lang, plugins: Plugin[]) {
  const t = UI[lang];
  return `<main id="main" class="section market-page plugins-page">
      <p class="kicker">${t.nav.market}</p>
      <h1 class="market-title">${t.title}</h1>
      <p class="section-lead">${t.lead}</p>
      ${shelves(lang, 'plugins')}
      <ul class="plugin-grid">${plugins.map((p) => card(lang, p)).join('')}</ul>
    </main>`;
}

function detailMain(lang: Lang, plugin: Plugin) {
  const t = UI[lang];
  const copy = plugin[lang];
  const video = plugin.video && media(plugin, plugin.video.src);
  const poster = plugin.video && media(plugin, plugin.video.poster);
  const demo = video
    ? `<video class="plugin-video" src="${video}"${poster ? ` poster="${poster}"` : ''} controls muted loop playsinline preload="metadata"></video>`
    : picture(plugin, plugin.cover, copy.title, 'plugin-hero', false);
  const stills = plugin.stills
    .filter((still) => media(plugin, still.light))
    .map(
      (still) =>
        `<li><figure>${picture(plugin, still, still[lang], 'plugin-still')}<figcaption>${escape(still[lang])}</figcaption></figure></li>`,
    )
    .join('');
  const list = (items: string[], tag = 'ul') =>
    `<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join('')}</${tag}>`;
  return `<main id="main" class="section market-page plugins-page plugin-detail">
      ${shelves(lang, 'plugins')}
      <a class="market-back" href="${pluginsPath(lang)}">← ${t.back}</a>
      <div class="detail-layout">
        <div class="detail-main">
          <p class="kicker">${t.title}</p>
          <h1 class="market-title">${escape(copy.title)}</h1>
          ${tags(copy)}
          <p class="detail-desc">${escape(copy.pitch)}</p>
          <section class="plugin-section" aria-labelledby="demo"><h2 id="demo">${t.demo}</h2>
            <div class="plugin-demo">${demo}</div>
            ${stills ? `<ul class="plugin-stills">${stills}</ul>` : ''}
          </section>
          <section class="plugin-section readme frame" aria-labelledby="about">
            <div class="readme-body">
              <h2 id="about">${t.about}</h2>
              <p>${escape(copy.description)}</p>
              <h2 id="usage">${t.usage}</h2>
              ${list(copy.usage, 'ol')}
              <h3>${t.controls}</h3>
              <dl class="plugin-controls">${copy.controls.map((c) => `<dt>${escape(c.name)}</dt><dd>${inline(c.text)}</dd>`).join('')}</dl>
              ${copy.customCharacter ? `<h3>${t.customCharacter}</h3><p>${inline(copy.customCharacter)}</p>` : ''}
              <h2 id="performance">${t.performance}</h2>
              ${list(copy.performance)}
              <h2 id="licenses">${t.licenses}</h2>
              ${list(copy.licenses)}
              <p><a href="${plugin.source}#license" target="_blank" rel="noreferrer">${t.licenseLink}</a></p>
            </div>
          </section>
        </div>
        <aside class="detail-side">
          <div class="detail-card frame">
            <h2>${t.install}</h2>
            ${command(lang, installCommand(plugin, t.profile))}
            <p class="detail-label">${t.installNote}</p>
            <h2>${t.requires}</h2>
            ${requirements(lang, plugin)}
            <h2>${t.links}</h2>
            <ul class="plugin-links">
              <li><a href="${npmUrl(plugin)}" target="_blank" rel="noreferrer">${t.npm}: <code>${escape(plugin.package)}</code></a></li>
              <li><a href="${plugin.source}" target="_blank" rel="noreferrer">${t.source}</a></li>
              <li><a href="${plugin.guide}" target="_blank" rel="noreferrer">${t.guide}</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </main>`;
}

function page(
  lang: Lang,
  at: (lang: Lang) => string,
  title: string,
  description: string,
  main: string,
  image: string | null,
) {
  const t = UI[lang];
  const url = `${SITE}${at(lang)}`;
  const fullTitle = `${title} · ${t.suffix}`;
  const og = image ? `${SITE}${image}` : `${SITE}/og-${lang}-v2.png`;
  const icon = (name: NavIcon) => `<span class="nav-icon-wrap">${navIconSvg(name)}</span>`;
  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(fullTitle)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="zh-Hans" href="${SITE}${at('zh')}" />
    <link rel="alternate" hreflang="en" href="${SITE}${at('en')}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${at('zh')}" />
    <meta name="theme-color" content="#f6e7c1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Tobs" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(fullTitle)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:locale" content="${t.ogLocale}" />
    <meta property="og:image" content="${og}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(fullTitle)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${og}" />
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
  <body data-docs data-plugins data-lang="${lang}">
    <a class="skip" href="#main">${t.skip}</a>
    <header class="topbar">
      <a class="brand" href="${home(lang)}">
        <span class="brand-logo"><img src="/logo.png" width="32" height="32" alt="" /></span>
        <span>Tobs</span>
      </a>
      <nav class="topnav" aria-label="Tobs">
        <a href="${home(lang)}#features">${t.nav.features}</a>
        <a href="${home(lang)}#install">${t.nav.install}</a>
        <a href="${home(lang)}market" aria-current="page">${icon('market')}${t.nav.market}</a>
        <a href="${home(lang)}avatar">${icon('avatar')}${t.nav.avatar}</a>
        <a href="${home(lang)}docs/overview/">${icon('docs')}${t.nav.docs}</a>
        <a class="nav-changelog" href="${home(lang)}changelog/">${icon('changelog')}${t.nav.changelog}</a>
        <a href="${home(lang)}blog/">${icon('blog')}${t.nav.blog}</a>
        ${searchButton(lang)}
      </nav>
      <div class="header-actions">
        ${headerCommunityMarkup(lang)}
        <div class="toggles">
        <nav class="lang-switch" aria-label="${t.lang}">
          <a href="${at('zh')}" hreflang="zh-Hans" lang="zh-Hans"${lang === 'zh' ? ' aria-current="page"' : ''}>中文</a>
          <a href="${at('en')}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
        </nav>
        <div class="mode-switch" role="group" aria-label="${t.mode}">
          <button type="button" data-mode="light" aria-label="${t.light}" title="${t.light}">${navIconSvg('sun')}</button>
          <button type="button" data-mode="dark" aria-label="${t.dark}" title="${t.dark}">${navIconSvg('moon')}</button>
        </div>
      </div>
      </div>
    </header>
    ${main}
    <footer class="footer"><p>Tobs · ${t.footer} <a href="${privacyPath(lang)}">${t.privacy}</a></p></footer>
    <script type="module" src="/src/plugins.ts"></script>
  </body>
</html>
`;
}

export function readPlugins(): Plugin[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  return files
    .map((f) => {
      const plugin = {
        slug: f.replace(/\.json$/, ''),
        ...JSON.parse(readFileSync(`${CONTENT}/${f}`, 'utf8')),
      } as Plugin;
      for (const lang of ['zh', 'en'] as const)
        if (!plugin[lang]?.title || !plugin[lang].pitch)
          throw new Error(`plugin ${plugin.slug} needs a ${lang} title and pitch`);
      if (!plugin.cover?.light || !media(plugin, plugin.cover.light))
        throw new Error(
          `plugin ${plugin.slug}: cover ${plugin.media}${plugin.cover?.light ?? ''} is missing`,
        );
      return plugin;
    })
    .toSorted((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** Writes the plugin list and one page per plugin in both languages; returns them for Vite. */
export function renderPlugins(): string[] {
  for (const dir of PLUGINS_OUT) rmSync(dir, { recursive: true, force: true });
  const plugins = readPlugins();
  const written: string[] = [];
  const write = (path: string, html: string) => {
    const file = `${path.slice(1)}index.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    written.push(file);
  };
  for (const lang of ['zh', 'en'] as const) {
    const t = UI[lang];
    write(
      pluginsPath(lang),
      page(lang, pluginsPath, t.title, t.description, listMain(lang, plugins), null),
    );
    for (const plugin of plugins)
      write(
        pluginPath(lang, plugin.slug),
        page(
          lang,
          (l) => pluginPath(l, plugin.slug),
          plugin[lang].title,
          plugin[lang].pitch,
          detailMain(lang, plugin),
          media(plugin, plugin.cover.light),
        ),
      );
  }
  return written;
}

const alternates = (zh: string, en: string) =>
  [zh, en]
    .map(
      (path) => `  <url>
    <loc>${SITE}${path}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE}${zh}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${zh}" />
  </url>`,
    )
    .join('\n');

export function pluginsSitemap(): string {
  return [
    alternates(pluginsPath('zh'), pluginsPath('en')),
    ...readPlugins().map((p) => alternates(pluginPath('zh', p.slug), pluginPath('en', p.slug))),
  ].join('\n');
}

/** The plugin section of /llms.txt: one line per plugin and language. */
export function pluginsLlms(): string {
  const plugins = readPlugins();
  return [
    '## Plugins',
    '',
    `- [Plugins](${SITE}${pluginsPath('en')}): Tobs plugins published on npm, with install commands and requirements ([中文](${SITE}${pluginsPath('zh')}))`,
    ...plugins.map(
      (p) =>
        `- [${p.en.title}](${SITE}${pluginPath('en', p.slug)}): ${p.en.pitch} Install: \`${installCommand(p)}\`. Requires DeepSeek Harness ${p.dsh} and Tobs newer than ${p.deepseekbot}. ([中文](${SITE}${pluginPath('zh', p.slug)}))`,
    ),
  ].join('\n');
}
