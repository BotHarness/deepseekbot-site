// Search engines get the Bot Marketplace as HTML: the Worker fills the static market page with
// each view's title, description, canonical and language links, structured data and readable
// text, then the page's own script takes over as usual. /sitemap-market.xml lists every view.
import {
  legacyMarketView,
  MARKET_LABELS,
  marketBase,
  marketHref,
  parseMarketPath,
  SECTIONS,
  type MarketLang,
  type MarketView,
} from '../src/marketRoutes.ts';

const SITE = 'https://tobs.app';
const MARKET_API = 'https://market.botharness.ai/v1';
export const MARKET_SITEMAP_PATH = '/sitemap-market.xml';
// how long a rendered view (and the API reads behind it) may be served from cache
const CACHE_SECONDS = 300;
const README_CHARS = 6000;

interface Assets {
  fetch(request: Request): Promise<Response>;
}

interface Bot {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  displayName: string | null;
  bio?: string | null;
  description: string | null;
  topics: string[];
  pushedAt: string;
  htmlUrl: string;
}

interface DigestSummary {
  day: string;
  title: string;
  lede: string;
}

interface Digest extends DigestSummary {
  sections: { heading: string; body: string; bot: Bot | null }[];
}

class MarketApiError extends Error {}

/** A Marketplace API read, or null when it answers 400/404; anything else throws. */
async function api<T>(path: string): Promise<T | null> {
  const response = await fetch(`${MARKET_API}${path}`, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(4000),
    // Cloudflare keeps the read at the edge, so crawls do not each reach the Marketplace
    cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
  } as RequestInit);
  if (response.status === 400 || response.status === 404) return null;
  if (!response.ok) throw new MarketApiError(`market api ${response.status}`);
  return (await response.json()) as T;
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

const botName = (bot: Bot) => bot.displayName ?? bot.name;
const botBio = (bot: Bot) => bot.bio ?? bot.description ?? '';

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

const longDate = (day: string, lang: MarketLang) => {
  const at = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(at)
    ? day
    : new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(at);
};

const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;

/** README Markdown as escaped headings and paragraphs: readable text, never author markup. */
export function readmeText(markdown: string): string {
  const plain = markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .slice(0, README_CHARS);
  return plain
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = /^#{1,6}\s+(.*)$/.exec(block);
      if (heading && !block.includes('\n')) return `<h2>${escapeHtml(heading[1]!)}</h2>`;
      const text = block
        .split('\n')
        .map((line) => line.replace(/^\s*(?:#{1,6}|[-*+>]|\d+\.)\s+/, '').replace(/[*_`~]/g, ''))
        .join(' ');
      return `<p>${escapeHtml(text)}</p>`;
    })
    .join('');
}

interface Rendered {
  status: number;
  title?: string;
  description?: string;
  body: string;
  jsonLd?: Record<string, unknown>;
}

const notFound = (lang: MarketLang): Rendered => ({
  status: 404,
  body: `<p>${link(marketBase(lang), MARKET_LABELS[lang].back)}</p>`,
});

async function renderView(lang: MarketLang, view: MarketView): Promise<Rendered> {
  const t = MARKET_LABELS[lang];
  const url = `${SITE}${marketHref(lang, view)}`;
  const back = `<p>${link(marketBase(lang), t.back)}</p>`;
  switch (view.kind) {
    case 'home': {
      const [digests, page] = await Promise.all([
        api<{ digests: DigestSummary[] }>(`/digests?lang=${lang}`),
        api<{ bots: Bot[] }>(`/bots?limit=50&lang=${lang}`),
      ]);
      const picks = (digests?.digests ?? []).slice(0, 7);
      return {
        status: 200,
        body: `${
          picks.length > 0
            ? `<h2>${escapeHtml(t.dailyPicks)}</h2><ul>${picks
                .map(
                  (digest) =>
                    `<li>${link(marketHref(lang, { kind: 'digest', day: digest.day }), digest.title)}</li>`,
                )
                .join('')}</ul>`
            : ''
        }<h2>${escapeHtml(t.allBots)}</h2><ul>${(page?.bots ?? [])
          .map(
            (bot) =>
              `<li>${link(marketHref(lang, { kind: 'bot', id: bot.id }), botName(bot))} ${escapeHtml(botBio(bot))}</li>`,
          )
          .join('')}</ul>`,
      };
    }
    case 'bot': {
      const detail = await api<{ bot: Bot; readme: string | null }>(
        `/bots/${encodeURIComponent(view.id)}?lang=${lang}`,
      );
      if (!detail) return notFound(lang);
      const { bot, readme } = detail;
      const bio = botBio(bot);
      return {
        status: 200,
        title: botName(bot),
        description: clip(bio || bot.fullName, 160),
        body: `${back}<article><p class="kicker">${escapeHtml(t.kicker)}</p><h1 class="market-title">${escapeHtml(botName(bot))}</h1><p>${escapeHtml(bot.fullName)}</p>${
          bio ? `<p class="section-lead">${escapeHtml(bio)}</p>` : ''
        }${
          bot.topics.length > 0
            ? `<ul>${bot.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>`
            : ''
        }<p>${link(bot.htmlUrl, t.github)}</p>${readme ? `<section>${readmeText(readme)}</section>` : ''}</article>`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: botName(bot),
          description: bio || undefined,
          url,
          codeRepository: bot.htmlUrl,
          dateModified: bot.pushedAt,
          author: { '@type': 'Person', name: bot.owner },
          keywords: bot.topics.length > 0 ? bot.topics.join(', ') : undefined,
        },
      };
    }
    case 'digest': {
      const loaded = await api<{ digest: Digest }>(`/digests/${view.day}?lang=${lang}`);
      if (!loaded) return notFound(lang);
      const { digest } = loaded;
      return {
        status: 200,
        title: digest.title,
        description: clip(digest.lede, 160),
        body: `${back}<article><p class="kicker">${escapeHtml(`${t.dailyPicks} · ${longDate(digest.day, lang)}`)}</p><h1 class="market-title">${escapeHtml(digest.title)}</h1><p class="section-lead">${escapeHtml(digest.lede)}</p>${digest.sections
          .map(
            (section) =>
              `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p>${
                section.bot
                  ? `<p>${link(marketHref(lang, { kind: 'bot', id: section.bot.id }), botName(section.bot))}</p>`
                  : ''
              }</section>`,
          )
          .join('')}<p>${link(marketHref(lang, { kind: 'archive' }), t.pastPicks)}</p></article>`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: digest.title,
          description: digest.lede,
          datePublished: digest.day,
          inLanguage: lang === 'zh' ? 'zh-Hans' : 'en',
          url,
          publisher: { '@type': 'Organization', name: 'Tobs', url: SITE },
        },
      };
    }
    case 'archive': {
      const loaded = await api<{ digests: DigestSummary[] }>(`/digests?lang=${lang}`);
      const digests = loaded?.digests ?? [];
      return {
        status: 200,
        title: t.pastPicks,
        description: clip(digests.map((digest) => digest.title).join(' · ') || t.pastPicks, 160),
        body: `${back}<h1 class="market-title">${escapeHtml(t.pastPicks)}</h1><ul>${digests
          .map(
            (digest) =>
              `<li>${link(marketHref(lang, { kind: 'digest', day: digest.day }), `${longDate(digest.day, lang)} · ${digest.title}`)}</li>`,
          )
          .join('')}</ul>`,
      };
    }
    case 'section': {
      const loaded = await api<{ entries: { bot: Bot }[] }>(
        `/sections/${view.section}?lang=${lang}`,
      );
      const bots = (loaded?.entries ?? []).map((entry) => entry.bot);
      const title = t.sections[view.section];
      return {
        status: 200,
        title,
        description: clip(bots.map(botName).join(' · ') || title, 160),
        body: `${back}<h1 class="market-title">${escapeHtml(title)}</h1><ul>${bots
          .map(
            (bot) =>
              `<li>${link(marketHref(lang, { kind: 'bot', id: bot.id }), botName(bot))} ${escapeHtml(botBio(bot))}</li>`,
          )
          .join('')}</ul>`,
      };
    }
  }
}

const replaceAttr = (html: string, pattern: RegExp, value: string) =>
  html.replace(pattern, (_, start: string) => `${start}${escapeHtml(value)}"`);

/** The market page with the view's head tags and text filled in. */
export function fillShell(
  shell: string,
  lang: MarketLang,
  view: MarketView,
  rendered: Rendered,
): string {
  let html = shell;
  const pageTitle = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? 'Tobs';
  if (rendered.title !== undefined) {
    // the shell's title is already escaped
    const title = `${escapeHtml(rendered.title)} · ${pageTitle}`;
    html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`);
    html = html.replace(
      /(<meta\s+(?:property="og:title"|name="twitter:title")\s+content=")[^"]*"/g,
      (_, start: string) => `${start}${title}"`,
    );
  }
  if (rendered.description !== undefined)
    html = replaceAttr(
      html,
      /(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*"/g,
      rendered.description,
    );
  const zh = `${SITE}${marketHref('zh', view)}`;
  const en = `${SITE}${marketHref('en', view)}`;
  const self = lang === 'zh' ? zh : en;
  html = replaceAttr(html, /(<link rel="canonical" href=")[^"]*"/, self);
  html = replaceAttr(html, /(<meta property="og:url" content=")[^"]*"/, self);
  html = replaceAttr(html, /(<link rel="alternate" hreflang="zh-Hans" href=")[^"]*"/, zh);
  html = replaceAttr(html, /(<link rel="alternate" hreflang="en" href=")[^"]*"/, en);
  html = replaceAttr(html, /(<link rel="alternate" hreflang="x-default" href=")[^"]*"/, zh);
  const head = [
    rendered.status === 404 ? '<meta name="robots" content="noindex" />' : '',
    rendered.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(rendered.jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ].join('');
  if (head) html = html.replace('</head>', () => `${head}</head>`);
  return html.replace(
    '<div id="root"></div>',
    () => `<div id="root"><main class="section market-page">${rendered.body}</main></div>`,
  );
}

const htmlResponse = (body: string, status: number, cache: string, method: string) =>
  new Response(method === 'HEAD' ? null : body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': cache },
  });

/** A Marketplace view rendered for crawlers, a redirect to its canonical path, or null. */
export async function marketPage(
  request: Request,
  url: URL,
  assets: Assets,
): Promise<Response | null> {
  if (!['GET', 'HEAD'].includes(request.method)) return null;
  const route = parseMarketPath(url.pathname);
  if (!route) return null;
  const { lang } = route;
  let { view } = route;
  // older links named the view in the query
  const legacy = view.kind === 'home' ? legacyMarketView(url.search) : null;
  if (legacy) view = legacy;
  const path = marketHref(lang, view);
  if (legacy || url.pathname !== path) {
    // same origin, so preview URLs and local dev stay where they are
    const next = new URL(path, url);
    if (!legacy) next.search = url.search;
    return Response.redirect(next.toString(), 301);
  }
  const shell = await assets.fetch(new Request(new URL(marketBase(lang), url)));
  if (!shell.ok) return shell;
  const html = await shell.text();
  let rendered: Rendered;
  try {
    rendered = await renderView(lang, view);
  } catch {
    // the Marketplace is unreachable: the page still loads and fetches for itself
    return htmlResponse(html, 200, 'no-store', request.method);
  }
  return htmlResponse(
    fillShell(html, lang, view, rendered),
    rendered.status,
    rendered.status === 200 ? `public, max-age=${CACHE_SECONDS}` : 'no-store',
    request.method,
  );
}

/** Every Marketplace view, both languages, for search engines. */
export async function marketSitemap(): Promise<Response> {
  try {
    const [zh, en] = await Promise.all(
      (['zh', 'en'] as const).map((lang) =>
        api<{ digests: DigestSummary[] }>(`/digests?lang=${lang}`),
      ),
    );
    const days = [...new Set([...(zh?.digests ?? []), ...(en?.digests ?? [])].map((d) => d.day))];
    const bots: Bot[] = [];
    let cursor: string | undefined;
    // 50 a page; stops well past today's catalog so a bad cursor cannot loop
    for (let page = 0; page < 40; page++) {
      const query = new URLSearchParams({ limit: '50', sort: 'updated' });
      if (cursor) query.set('cursor', cursor);
      const loaded = await api<{ bots: Bot[]; nextCursor?: string }>(`/bots?${query}`);
      bots.push(...(loaded?.bots ?? []));
      cursor = loaded?.nextCursor;
      if (!cursor) break;
    }
    const views: { view: MarketView; lastmod?: string }[] = [
      { view: { kind: 'archive' }, lastmod: days[0] },
      ...SECTIONS.map((section) => ({ view: { kind: 'section', section } as MarketView })),
      ...days.map((day) => ({ view: { kind: 'digest', day } as MarketView, lastmod: day })),
      ...bots.map((bot) => ({
        view: { kind: 'bot', id: bot.id } as MarketView,
        lastmod: bot.pushedAt.slice(0, 10),
      })),
    ];
    const urls = views.flatMap(({ view, lastmod }) =>
      (['zh', 'en'] as const).map(
        (lang) => `  <url>
    <loc>${SITE}${escapeHtml(marketHref(lang, view))}</loc>${lastmod ? `\n    <lastmod>${escapeHtml(lastmod)}</lastmod>` : ''}
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE}${escapeHtml(marketHref('zh', view))}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${escapeHtml(marketHref('en', view))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${escapeHtml(marketHref('zh', view))}" />
  </url>`,
      ),
    );
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
      {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      },
    );
  } catch {
    return new Response('Marketplace unavailable', {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Retry-After': '600' },
    });
  }
}
