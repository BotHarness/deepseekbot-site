import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.ts';
import { legacyMarketView, marketHref, parseMarketPath } from '../src/marketRoutes.ts';

const API = 'https://market.botharness.ai/v1';

// the built market page, cut down to the tags the Worker fills in
const shell = (lang) => `<!doctype html>
<html><head>
<title>${lang === 'zh' ? '市场 · Tobs' : 'Bot Marketplace · Tobs'}</title>
<meta
  name="description"
  content="shell description"
/>
<link rel="canonical" href="https://tobs.app${lang === 'zh' ? '/market' : '/en/market'}" />
<link rel="alternate" hreflang="zh-Hans" href="https://tobs.app/market" />
<link rel="alternate" hreflang="en" href="https://tobs.app/en/market" />
<link rel="alternate" hreflang="x-default" href="https://tobs.app/market" />
<meta property="og:url" content="https://tobs.app/market" />
<meta property="og:title" content="shell" />
<meta
  property="og:description"
  content="shell description"
/>
<meta name="twitter:title" content="shell" />
<meta
  name="twitter:description"
  content="shell description"
/>
</head><body><div id="root"></div></body></html>`;

const assets = {
  fetch: async (request) => {
    const path = new URL(request.url).pathname;
    if (path === '/market') return new Response(shell('zh'));
    if (path === '/en/market') return new Response(shell('en'));
    return new Response(`asset ${path}`);
  },
};

const bot = (id, extra = {}) => ({
  id,
  owner: 'octo',
  name: `bot-${id}`,
  fullName: `octo/bot-${id}`,
  displayName: `Bot ${id}`,
  bio: `Bio of ${id}`,
  description: null,
  topics: ['notes'],
  pushedAt: '2026-10-28T10:00:00Z',
  htmlUrl: `https://github.com/octo/bot-${id}`,
  ...extra,
});

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

/** Answers Marketplace reads from `routes` (path and query → body), recording each request. */
function stubApi(routes) {
  const seen = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    assert.ok(url.href.startsWith(API), `unexpected fetch ${url.href}`);
    const key = url.href.slice(API.length);
    seen.push(key);
    const route = routes[key];
    if (route === undefined) return json({ error: { code: 'not-found' } }, 404);
    return typeof route === 'function' ? route() : json(route);
  };
  return { seen, restore: () => (globalThis.fetch = original) };
}

const get = (path, init) =>
  worker.fetch(new Request(`https://tobs.app${path}`, init), { ASSETS: assets });

test('Marketplace paths round-trip through marketHref and parseMarketPath', () => {
  const views = [
    { kind: 'home' },
    { kind: 'bot', id: 'R_kgDOVZ-zDA' },
    { kind: 'digest', day: '2026-10-29' },
    { kind: 'archive' },
    { kind: 'section', section: 'rising' },
  ];
  for (const lang of ['zh', 'en'])
    for (const view of views)
      assert.deepEqual(parseMarketPath(marketHref(lang, view)), { lang, view });
  assert.equal(
    marketHref('en', { kind: 'digest', day: '2026-10-29' }),
    '/en/market/picks/2026-10-29',
  );
  for (const path of [
    '/market/bot',
    '/market/bot/a/b',
    '/market/bot/%3Cscript%3E',
    '/market/picks/2026-1-1',
    '/market/trending',
    '/marketplace',
    '/de/market',
  ])
    assert.equal(parseMarketPath(path), null, path);
  assert.deepEqual(legacyMarketView('?bot=R_1'), { kind: 'bot', id: 'R_1' });
  assert.deepEqual(legacyMarketView('?picks=past'), { kind: 'archive' });
  assert.equal(legacyMarketView('?q=notes'), null);
});

test('older query links and trailing slashes redirect to the canonical path', async () => {
  for (const [from, to] of [
    ['/market?bot=R_kgDOVZ-zDA', '/market/bot/R_kgDOVZ-zDA'],
    ['/en/market?digest=2026-10-29', '/en/market/picks/2026-10-29'],
    ['/market?picks=past', '/market/picks'],
    ['/en/market?section=hot', '/en/market/hot'],
    ['/market/hot/', '/market/hot'],
    ['/market/', '/market'],
  ]) {
    const response = await get(from);
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), `https://tobs.app${to}`, from);
  }
});

test('a Digest is served with its own head, structured data and article text', async () => {
  const api = stubApi({
    '/digests/2026-10-29?lang=zh': {
      digest: {
        day: '2026-10-29',
        title: '知识库 <script>alert(1)</script> & 小助手',
        lede: '今天带来两款新 Bot。',
        sections: [
          { heading: 'Obsidian 知识库治理', body: '整理知识库。', bot: bot('R_a') },
          { heading: '已下架', body: '这个 Bot 已隐藏。', bot: null },
        ],
      },
    },
  });
  try {
    const response = await get('/market/picks/2026-10-29');
    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control'), /max-age=300/);
    const html = await response.text();
    assert.match(
      html,
      /<title>知识库 &lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; 小助手 · 市场 · Tobs<\/title>/,
    );
    assert.doesNotMatch(html, /<script>alert/);
    assert.match(html, /<meta\s+name="description"\s+content="今天带来两款新 Bot。"/);
    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/tobs.app\/market\/picks\/2026-10-29"/,
    );
    assert.match(html, /hreflang="en" href="https:\/\/tobs.app\/en\/market\/picks\/2026-10-29"/);
    assert.match(
      html,
      /<meta property="og:url" content="https:\/\/tobs.app\/market\/picks\/2026-10-29"/,
    );
    const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)[1]);
    assert.equal(ld['@type'], 'Article');
    assert.equal(ld.datePublished, '2026-10-29');
    assert.match(
      html,
      /<h2>Obsidian 知识库治理<\/h2><p>整理知识库。<\/p><p><a href="\/market\/bot\/R_a">Bot R_a<\/a>/,
    );
    assert.match(html, /<a href="\/market\/picks">往期精选<\/a>/);
    assert.doesNotMatch(html, /noindex/);
  } finally {
    api.restore();
  }
});

test('a Bot page shows its README as escaped text, never author markup', async () => {
  const api = stubApi({
    '/bots/R_a?lang=en': {
      bot: bot('R_a', { bio: 'Keeps an Obsidian vault tidy.' }),
      readme:
        '# Vault keeper\n\nSee [the docs](https://example.com) <img src=x onerror=alert(1)>\n\n```sh\nrm -rf /\n```\n\n- **Archive** sources',
    },
  });
  try {
    const response = await get('/en/market/bot/R_a');
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<title>Bot R_a · Bot Marketplace · Tobs<\/title>/);
    assert.match(
      html,
      /<meta\s+property="og:description"\s+content="Keeps an Obsidian vault tidy."/,
    );
    assert.match(html, /<h2>Vault keeper<\/h2><p>See the docs<\/p><p>Archive sources<\/p>/);
    assert.doesNotMatch(html, /onerror|rm -rf/);
    assert.match(html, /<a href="https:\/\/github.com\/octo\/bot-R_a">View on GitHub<\/a>/);
    const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)[1]);
    assert.equal(ld['@type'], 'SoftwareSourceCode');
    assert.equal(ld.codeRepository, 'https://github.com/octo/bot-R_a');
  } finally {
    api.restore();
  }
});

test('a missing Bot or Digest is a 404 search engines are told not to index', async () => {
  const api = stubApi({});
  try {
    for (const path of ['/market/bot/R_gone', '/en/market/picks/2020-01-01']) {
      const response = await get(path);
      assert.equal(response.status, 404, path);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match(await response.text(), /<meta name="robots" content="noindex" \/>/);
    }
  } finally {
    api.restore();
  }
});

test('the home, archive and ranking views link every Bot and Digest they list', async () => {
  const api = stubApi({
    '/digests?lang=zh': { digests: [{ day: '2026-10-29', title: '今日精选', lede: '' }] },
    '/bots?limit=50&lang=zh': { bots: [bot('R_a'), bot('R_b')] },
    '/sections/hot?lang=zh': {
      section: 'hot',
      day: '2026-10-29',
      entries: [{ bot: bot('R_b'), score: 9 }],
    },
  });
  try {
    const home = await (await get('/market')).text();
    assert.match(home, /<title>市场 · Tobs<\/title>/);
    assert.match(home, /<a href="\/market\/picks\/2026-10-29">今日精选<\/a>/);
    assert.match(home, /<a href="\/market\/bot\/R_a">Bot R_a<\/a>/);
    assert.match(home, /<link rel="canonical" href="https:\/\/tobs.app\/market"/);
    const archive = await (await get('/market/picks')).text();
    assert.match(archive, /<title>往期精选 · 市场 · Tobs<\/title>/);
    assert.match(archive, /href="\/market\/picks\/2026-10-29">2026年10月29日 · 今日精选/);
    const hot = await (await get('/market/hot')).text();
    assert.match(hot, /<title>热门 · 市场 · Tobs<\/title>/);
    assert.match(hot, /<a href="\/market\/bot\/R_b">Bot R_b<\/a>/);
  } finally {
    api.restore();
  }
});

test('an unreachable Marketplace still serves the page uncached for the browser to load', async () => {
  const api = stubApi({ '/bots/R_a?lang=zh': () => json({}, 503) });
  try {
    const response = await get('/market/bot/R_a');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const html = await response.text();
    assert.match(html, /<title>市场 · Tobs<\/title>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/tobs.app\/market\/bot\/R_a"/);
    assert.match(html, /hreflang="en" href="https:\/\/tobs.app\/en\/market\/bot\/R_a"/);
    assert.doesNotMatch(html, /noindex|ld\+json/);
  } finally {
    api.restore();
  }
});

test('HEAD gets the rendered status without a body, and other methods reach the assets', async () => {
  const api = stubApi({ '/digests?lang=zh': { digests: [] } });
  try {
    const head = await get('/market/picks', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    const post = await get('/market/picks', { method: 'POST' });
    assert.equal(await post.text(), 'asset /market/picks');
  } finally {
    api.restore();
  }
});

test('the Marketplace sitemap lists every view in both languages and follows the cursor', async () => {
  const api = stubApi({
    '/digests?lang=zh': { digests: [{ day: '2026-10-29', title: '', lede: '' }] },
    '/digests?lang=en': { digests: [{ day: '2026-10-28', title: '', lede: '' }] },
    '/bots?limit=50&sort=updated': { bots: [bot('R_a')], nextCursor: 'next' },
    '/bots?limit=50&sort=updated&cursor=next': { bots: [bot('R_b')] },
  });
  try {
    const response = await get('/sitemap-market.xml');
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/xml/);
    const xml = await response.text();
    for (const path of [
      '/market/picks',
      '/en/market/picks',
      '/market/hot',
      '/en/market/rising',
      '/market/picks/2026-10-29',
      '/en/market/picks/2026-10-28',
      '/market/bot/R_a',
      '/en/market/bot/R_b',
    ])
      assert.match(xml, new RegExp(`<loc>https://tobs.app${path}</loc>`), path);
    assert.match(xml, /<lastmod>2026-10-28<\/lastmod>/);
    assert.match(xml, /hreflang="en" href="https:\/\/tobs.app\/en\/market\/bot\/R_a"/);
  } finally {
    api.restore();
  }
});

test('the sitemap is a retryable 503 while the Marketplace is down', async () => {
  const api = stubApi({ '/digests?lang=zh': () => json({}, 500) });
  try {
    const response = await get('/sitemap-market.xml');
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('retry-after'), '600');
  } finally {
    api.restore();
  }
});

test('an oversized README with unclosed markup renders in bounded time', async () => {
  const { readmeText } = await import('../worker/market.ts');
  const started = Date.now();
  readmeText('<!--<a'.repeat(200000));
  assert.ok(Date.now() - started < 500);
});
