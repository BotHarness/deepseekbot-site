// Renders content/changelog/{zh,en}.md (the BotHarness Release Ledger, synced by
// `pnpm changelog:sync`) into /changelog/ (Chinese) and /en/changelog/ (English). Each released
// version gets an anchor (#v1.0.1) so the plugin and release posts can link straight to it.
// The pages are generated, not committed; content/changelog is the source.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { Marked, type Tokens } from 'marked';
import { navIconSvg, type NavIcon } from '../src/navIcons.ts';
import { privacyPath, searchButton } from './docs.ts';

type Lang = 'zh' | 'en';
const SITE = 'https://deepseekbot.botharness.ai';
const GITHUB_BLOB = 'https://github.com/BotHarness/BotHarness/blob/main/';
export const CHANGELOG_OUT = ['changelog', 'en/changelog'];
const SECTION_ORDER = [
  'Added',
  'Changed',
  'Fixed',
  'Security',
  'Documentation',
  'Breaking Changes',
  'Deprecated',
  'Removed',
];

interface Section {
  name: string;
  entries: string[];
}

interface Release {
  identity: string;
  date: string;
  summary: string;
  sections: Section[];
}

const UI = {
  zh: {
    htmlLang: 'zh-Hans',
    ogLocale: 'zh_CN',
    title: '更新日志',
    suffix: 'DeepSeekBot',
    description: 'DeepSeekBot 每个版本的新增、变更和修复。',
    lead: '每个 DeepSeekBot 版本的变化。插件会在更新后弹出同样的内容。',
    versions: '版本',
    development: '开发历史',
    developmentNote: '首个 npm 版本之前的开发记录，没有对应的安装包。',
    latest: '最新',
    count: (n: number) => `${n} 项`,
    nav: {
      features: '能力',
      install: '安装',
      market: 'Bot 市场',
      changelog: '更新日志',
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
    sections: {
      Added: '新增',
      Changed: '变更',
      Fixed: '修复',
      Documentation: '文档',
      'Breaking Changes': '不兼容',
      Deprecated: '弃用',
      Removed: '移除',
      Security: '安全',
    } as Record<string, string>,
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Changelog',
    suffix: 'DeepSeekBot',
    description: 'What was added, changed and fixed in each DeepSeekBot release.',
    lead: 'What changed in each DeepSeekBot release. The plugin shows the same notes after an update.',
    versions: 'Versions',
    development: 'Development history',
    developmentNote: 'Work before the first npm release; it has no installable package.',
    latest: 'Latest',
    count: (n: number) => `${n} changes`,
    nav: {
      features: 'Features',
      install: 'Install',
      market: 'Marketplace',
      changelog: 'Changelog',
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
    sections: {
      Added: 'Added',
      Changed: 'Changed',
      Fixed: 'Fixed',
      Documentation: 'Docs',
      'Breaking Changes': 'Breaking',
      Deprecated: 'Deprecated',
      Removed: 'Removed',
      Security: 'Security',
    } as Record<string, string>,
  },
} as const;

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const home = (lang: Lang) => (lang === 'zh' ? '/' : '/en/');
export const changelogPath = (lang: Lang) => `${lang === 'zh' ? '' : '/en'}/changelog/`;
const anchor = (release: Release) =>
  release.identity === 'Development' ? 'development' : `v${release.identity}`;

/** The Release Ledger shape: ## [version] - date, a summary line, ### sections of "- " entries. */
export function parseLedger(markdown: string): Release[] {
  const releases: Release[] = [];
  let release: Release | undefined;
  let section: Section | undefined;
  for (const line of markdown.replaceAll('\r\n', '\n').split('\n')) {
    const heading = line.match(/^## \[([^\]]+)](?: - (\d{4}-\d{2}-\d{2}))?$/);
    if (heading) {
      release = { identity: heading[1]!, date: heading[2] ?? '', summary: '', sections: [] };
      releases.push(release);
      section = undefined;
    } else if (!release) continue;
    else if (line.startsWith('### ')) {
      section = { name: line.slice(4).trim(), entries: [] };
      release.sections.push(section);
    } else if (section && line.startsWith('- ')) section.entries.push(line.slice(2));
    else if (section && /^\s{2,}\S/.test(line) && section.entries.length > 0)
      section.entries[section.entries.length - 1] += ` ${line.trim()}`;
    else if (!section && !release.summary && line.trim()) release.summary = line.trim();
  }
  // Unreleased is work in progress; it appears here once it ships under a version. Sections
  // follow the ledger's reading order for users: what's new first, developer migrations after.
  const rank = (name: string) => {
    const index = SECTION_ORDER.indexOf(name);
    return index === -1 ? SECTION_ORDER.length : index;
  };
  return releases
    .filter((r) => r.identity !== 'Unreleased' && r.date)
    .map((r) => ({ ...r, sections: r.sections.toSorted((a, b) => rank(a.name) - rank(b.name)) }));
}

function inline() {
  const md = new Marked({ gfm: true });
  md.use({
    walkTokens(token) {
      if (token.type === 'link') {
        const link = token as Tokens.Link;
        // relative links in the ledger point into the BotHarness repository
        if (!/^[a-z][a-z0-9+.-]*:|^#|^\//i.test(link.href))
          link.href = GITHUB_BLOB + link.href.replace(/^\.?\//, '');
      }
    },
    renderer: {
      link({ href: url, tokens }) {
        return `<a href="${escape(url)}" target="_blank" rel="noreferrer">${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  return (text: string) => md.parseInline(text, { async: false }) as string;
}

const KIND: Record<string, string> = {
  Added: 'added',
  Changed: 'changed',
  Fixed: 'fixed',
  Documentation: 'docs',
  'Breaking Changes': 'breaking',
  Deprecated: 'deprecated',
  Removed: 'removed',
  Security: 'security',
};

function body(lang: Lang, releases: Release[]) {
  const t = UI[lang];
  const render = inline();
  return releases
    .map((release, index) => {
      const id = anchor(release);
      const development = release.identity === 'Development';
      const entries = release.sections.flatMap((section) =>
        section.entries.map(
          (entry) =>
            `<li><span class="changelog-chip" data-kind="${KIND[section.name] ?? 'other'}">${escape(
              t.sections[section.name] ?? section.name,
            )}</span><span class="changelog-text">${render(entry)}</span></li>`,
        ),
      );
      return `<details class="changelog-release" id="${id}"${index === 0 ? ' open' : ''}>
  <summary class="changelog-head"><h2>${development ? t.development : `v${escape(release.identity)}`}</h2><time datetime="${release.date}">${release.date}</time>${
    index === 0 ? `<span class="changelog-latest">${t.latest}</span>` : ''
  }<span class="changelog-rule" aria-hidden="true"></span><span class="changelog-count">${t.count(entries.length)}</span></summary>
  <div class="changelog-content">
  <p class="changelog-summary">${render(release.summary)}</p>
  ${development ? `<p class="changelog-note">${t.developmentNote}</p>` : ''}
  <ul class="changelog-entries">${entries.join('')}</ul>
  </div>
</details>`;
    })
    .join('\n');
}

function sidebar(lang: Lang, releases: Release[]) {
  const t = UI[lang];
  const items = releases
    .map(
      (r) =>
        `<li><a href="#${anchor(r)}">${r.identity === 'Development' ? t.development : `v${escape(r.identity)}`}</a></li>`,
    )
    .join('');
  return `<nav class="docs-nav" aria-label="${t.versions}"><details open><summary>${t.versions}</summary><p class="docs-nav-title">${t.versions}</p><ul>${items}</ul></details></nav>`;
}

function page(lang: Lang, releases: Release[]) {
  const t = UI[lang];
  const url = `${SITE}${changelogPath(lang)}`;
  const title = `${t.title} · ${t.suffix}`;
  const image = `${SITE}/og-${lang}-v2.png`;
  const icon = (name: NavIcon) => `<span class="nav-icon-wrap">${navIconSvg(name)}</span>`;
  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(t.description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="zh-Hans" href="${SITE}${changelogPath('zh')}" />
    <link rel="alternate" hreflang="en" href="${SITE}${changelogPath('en')}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${changelogPath('zh')}" />
    <meta name="theme-color" content="#f6e7c1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DeepSeekBot" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(t.description)}" />
    <meta property="og:locale" content="${t.ogLocale}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(t.description)}" />
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
  <body data-docs data-changelog data-lang="${lang}">
    <a class="skip" href="#main">${t.skip}</a>
    <header class="topbar">
      <a class="brand" href="${home(lang)}">
        <span class="brand-logo"><img src="/logo.png" width="32" height="32" alt="" /></span>
        <span>DeepSeekBot</span>
      </a>
      <nav class="topnav" aria-label="DeepSeekBot">
        <a href="${home(lang)}#features">${t.nav.features}</a>
        <a href="${home(lang)}#install">${t.nav.install}</a>
        <a href="${home(lang)}market">${icon('market')}${t.nav.market}</a>
        <a href="${home(lang)}docs/overview/">${icon('docs')}${t.nav.docs}</a>
        <a href="${changelogPath(lang)}" aria-current="page">${icon('changelog')}${t.nav.changelog}</a>
        <a href="${home(lang)}#community">${t.nav.community}</a>
        <a href="https://github.com/BotHarness/BotHarness" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <div class="toggles">
        ${searchButton(lang)}
        <nav class="lang-switch" aria-label="${t.lang}">
          <a href="${changelogPath('zh')}" hreflang="zh-Hans" lang="zh-Hans"${lang === 'zh' ? ' aria-current="page"' : ''}>中文</a>
          <a href="${changelogPath('en')}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
        </nav>
        <div class="mode-switch" role="group" aria-label="${t.mode}">
          <button type="button" data-mode="light">${t.light}</button>
          <button type="button" data-mode="dark">${t.dark}</button>
        </div>
      </div>
    </header>
    <div class="docs-layout">
      ${sidebar(lang, releases)}
      <main id="main" class="docs-main">
        <article class="docs-article frame">
          <p class="kicker">DeepSeekBot</p>
          <h1>${t.title}</h1>
          <p class="docs-lead">${t.lead}</p>
          <div class="docs-body changelog-body">${body(lang, releases)}</div>
        </article>
        <p class="docs-source"><a href="${GITHUB_BLOB}${lang === 'zh' ? 'CHANGELOG.zh.md' : 'CHANGELOG.md'}" target="_blank" rel="noreferrer">${t.source}</a></p>
      </main>
    </div>
    <footer class="footer"><p>DeepSeekBot · ${t.footer} <a href="${privacyPath(lang)}">${t.privacy}</a></p></footer>
    <script type="module" src="/src/docs.ts"></script>
  </body>
</html>
`;
}

/** Writes both changelog pages and returns their paths, for Vite's inputs. */
export function renderChangelog(): string[] {
  for (const dir of CHANGELOG_OUT) rmSync(dir, { recursive: true, force: true });
  return (['zh', 'en'] as const).map((lang) => {
    const releases = parseLedger(readFileSync(`content/changelog/${lang}.md`, 'utf8'));
    const file = `${changelogPath(lang).slice(1)}index.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page(lang, releases));
    return file;
  });
}
