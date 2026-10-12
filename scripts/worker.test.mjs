import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.ts';

const assets = { fetch: async (request) => new Response(`asset ${new URL(request.url).pathname}`) };

test('static asset routing does not fall back to the homepage for missing URLs', () => {
  const config = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
  assert.match(config, /"not_found_handling"\s*:\s*"none"/);
  assert.doesNotMatch(config, /"not_found_handling"\s*:\s*"single-page-application"/);
});

test('missing pages and files preserve asset 404 responses for GET and HEAD', async () => {
  for (const path of [
    '/missing-page',
    '/en/missing-page',
    '/blog/missing-post/',
    '/en/docs/missing-guide/',
    '/missing-script.js',
    '/r/v1.2.1/install/fr',
  ]) {
    for (const method of ['GET', 'HEAD']) {
      const notFound = new Response(null, { status: 404 });
      const response = await worker.fetch(
        new Request(`https://deepseekbot.app${path}`, { method }),
        { ASSETS: { fetch: async () => notFound } },
      );
      assert.equal(response, notFound);
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('location'), null);
    }
  }
});

test('Release short links carry fixed version and entry-point attribution', async () => {
  for (const version of ['1.2.1', '1.3.0-alpha.1', '1.3.0-beta.2', '1.3.0-rc.1']) {
    for (const [suffix, pathname, content] of [
      ['', '/', 'website'],
      ['/install', '/docs/installation/', 'install_zh'],
      ['/install/en', '/en/docs/installation/', 'install_en'],
    ]) {
      for (const method of ['GET', 'HEAD']) {
        const response = await worker.fetch(
          new Request(
            `https://deepseekbot.app/r/v${version}${suffix}?utm_source=spoof&url=https://evil.example`,
            { method },
          ),
          {
            ASSETS: {
              fetch: () => {
                throw new Error('Short links must not fetch assets');
              },
            },
          },
        );
        assert.equal(response.status, 302);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
        const target = new URL(response.headers.get('location'));
        assert.equal(target.origin, 'https://deepseekbot.app');
        assert.equal(target.pathname, pathname);
        assert.deepEqual(Object.fromEntries(target.searchParams), {
          utm_source: 'github',
          utm_medium: 'release',
          utm_campaign: `deepseekbot_v${version}`,
          utm_content: content,
        });
      }
    }
  }
});

test('invalid or arbitrary short-link targets do not redirect', async () => {
  for (const path of [
    '/r/v01.2.1',
    '/r/v1.2',
    '/r/v1.2.1-preview.1',
    '/r/v1.2.1-rc.01',
    '/r/v1.2.1/https://evil.example',
    '/r/v1.2.1/install/fr',
  ]) {
    const response = await worker.fetch(new Request(`https://deepseekbot.app${path}`), {
      ASSETS: assets,
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
  }
  const trailing = await worker.fetch(new Request('https://deepseekbot.app/r/v1.2.1/'), {
    ASSETS: assets,
  });
  const plain = await worker.fetch(new Request('https://deepseekbot.app/r/v1.2.1'), {
    ASSETS: assets,
  });
  assert.equal(trailing.headers.get('location'), plain.headers.get('location'));
});

test('Release short links refuse unsafe methods', async () => {
  const response = await worker.fetch(
    new Request('https://deepseekbot.app/r/v1.2.1', { method: 'POST' }),
    { ASSETS: assets },
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
  assert.equal(response.headers.get('location'), null);
});

test('legacy host short links canonicalize before attribution redirects', async () => {
  const response = await worker.fetch(new Request('https://deepseekbot.dev/r/v1.2.1/install'), {
    ASSETS: assets,
  });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://deepseekbot.app/r/v1.2.1/install');
});

test('the other product hostnames 301 to the same path on deepseekbot.app', async () => {
  for (const host of [
    'deepseekbot.botharness.ai',
    'deepseekbot.dev',
    'www.deepseekbot.dev',
    'www.deepseekbot.app',
  ]) {
    const response = await worker.fetch(new Request(`https://${host}/en/docs/overview/?ref=x`), {
      ASSETS: assets,
    });
    assert.equal(response.status, 301);
    assert.equal(
      response.headers.get('location'),
      'https://deepseekbot.app/en/docs/overview/?ref=x',
    );
  }
  const response = await worker.fetch(new Request('http://deepseekbot.dev:8080/market'), {
    ASSETS: assets,
  });
  assert.equal(response.headers.get('location'), 'https://deepseekbot.app/market');
});

test('Worker entrypoint exports only the supported default handler', async () => {
  assert.deepEqual(Object.keys(await import('../worker/index.ts')), ['default']);
});

test('HTTP requests on the canonical product host permanently redirect to HTTPS', async () => {
  for (const path of ['/', '/en/', '/docs/concepts/', '/r/v1.2.1/install']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(
        new Request(`http://deepseekbot.app:8080${path}?ref=gsc`, { method }),
        {
          ASSETS: {
            fetch: () => {
              throw new Error('HTTP product requests must redirect before fetching assets');
            },
          },
        },
      );
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('location'), `https://deepseekbot.app${path}?ref=gsc`);
    }
  }
});

test('deepseekbot.app, preview URLs and local dev are served from the assets', async () => {
  for (const url of [
    'https://deepseekbot.app/market',
    'https://abc123-deepseekbot-site.example.workers.dev/market',
    'http://localhost:8787/market',
  ]) {
    const response = await worker.fetch(new Request(url), { ASSETS: assets });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'asset /market');
  }
});
