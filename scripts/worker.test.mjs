import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.ts';

const assets = { fetch: async (request) => new Response(`asset ${new URL(request.url).pathname}`) };

const naverVerificationPath = '/naver2c42ccd37d36f1ee05627e66c5827ac4.html';

test('Naver verification file contains the downloaded verification payload', () => {
  assert.equal(
    readFileSync(new URL(`../public${naverVerificationPath}`, import.meta.url), 'utf8'),
    `naver-site-verification: ${naverVerificationPath.slice(1)}`,
  );
});

test('Naver GET and HEAD internally resolve the HTML asset without a client redirect', async () => {
  for (const method of ['GET', 'HEAD']) {
    const request = new Request(`https://tobs.app${naverVerificationPath}?check=1`, {
      method,
      headers: { 'X-Verification-Test': 'preserved' },
    });
    const assetResponse = new Response(method === 'HEAD' ? null : 'verification payload');
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async (assetRequest) => {
          assert.equal(
            assetRequest.url,
            `https://tobs.app${naverVerificationPath.slice(0, -5)}?check=1`,
          );
          assert.equal(assetRequest.method, method);
          assert.equal(assetRequest.headers.get('X-Verification-Test'), 'preserved');
          return assetResponse;
        },
      },
    });
    assert.equal(response, assetResponse);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
  }
});

test('Naver verification preserves canonical redirects before resolving the asset', async () => {
  for (const origin of ['https://www.tobs.app', 'http://tobs.app']) {
    const response = await worker.fetch(new Request(`${origin}${naverVerificationPath}`), {
      ASSETS: {
        fetch: () => {
          throw new Error('Canonical redirects must run before asset lookup');
        },
      },
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), `https://tobs.app${naverVerificationPath}`);
  }
});

test('Naver exception does not rewrite other paths or unsupported methods', async () => {
  for (const [path, method] of [
    [naverVerificationPath, 'POST'],
    [naverVerificationPath, 'OPTIONS'],
    [`${naverVerificationPath}/`, 'GET'],
    ['/naver-unregistered.html', 'GET'],
    ['/baidu_verify_codeva-ZL1kxPPyWo.html', 'GET'],
  ]) {
    const request = new Request(`https://tobs.app${path}`, { method });
    await worker.fetch(request, {
      ASSETS: {
        fetch: async (assetRequest) => {
          assert.equal(assetRequest, request);
          return new Response(null, { status: 404 });
        },
      },
    });
  }
});

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
      const response = await worker.fetch(new Request(`https://tobs.app${path}`, { method }), {
        ASSETS: { fetch: async () => notFound },
      });
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
            `https://tobs.app/r/v${version}${suffix}?utm_source=spoof&url=https://evil.example`,
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
        assert.equal(target.origin, 'https://tobs.app');
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
    const response = await worker.fetch(new Request(`https://tobs.app${path}`), {
      ASSETS: assets,
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
  }
  const trailing = await worker.fetch(new Request('https://tobs.app/r/v1.2.1/'), {
    ASSETS: assets,
  });
  const plain = await worker.fetch(new Request('https://tobs.app/r/v1.2.1'), {
    ASSETS: assets,
  });
  assert.equal(trailing.headers.get('location'), plain.headers.get('location'));
});

test('Release short links refuse unsafe methods', async () => {
  const response = await worker.fetch(
    new Request('https://tobs.app/r/v1.2.1', { method: 'POST' }),
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
  assert.equal(response.headers.get('location'), 'https://tobs.app/r/v1.2.1/install');
});

test('the other product hostnames 301 to the same path on tobs.app', async () => {
  for (const host of [
    'deepseekbot.app',
    'www.deepseekbot.app',
    'deepseekbot.botharness.ai',
    'deepseekbot.dev',
    'www.deepseekbot.dev',
    'www.tobs.app',
  ]) {
    const response = await worker.fetch(new Request(`https://${host}/en/docs/overview/?ref=x`), {
      ASSETS: assets,
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://tobs.app/en/docs/overview/?ref=x');
  }
  const response = await worker.fetch(new Request('http://deepseekbot.dev:8080/market'), {
    ASSETS: assets,
  });
  assert.equal(response.headers.get('location'), 'https://tobs.app/market');
});

test('Worker entrypoint exports only the supported default handler', async () => {
  assert.deepEqual(Object.keys(await import('../worker/index.ts')), ['default']);
});

test('HTTP requests on the canonical product host permanently redirect to HTTPS', async () => {
  for (const path of ['/', '/en/', '/docs/concepts/', '/r/v1.2.1/install']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await worker.fetch(
        new Request(`http://tobs.app:8080${path}?ref=gsc`, { method }),
        {
          ASSETS: {
            fetch: () => {
              throw new Error('HTTP product requests must redirect before fetching assets');
            },
          },
        },
      );
      assert.equal(response.status, 301);
      assert.equal(response.headers.get('location'), `https://tobs.app${path}?ref=gsc`);
    }
  }
});

test('tobs.app, preview URLs and local dev are served from the assets', async () => {
  for (const url of [
    'https://tobs.app/market',
    'https://abc123-deepseekbot-site.example.workers.dev/market',
    'http://localhost:8787/market',
  ]) {
    const response = await worker.fetch(new Request(url), { ASSETS: assets });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'asset /market');
  }
});

test('device tunnel subdomains are outside website redirect ownership', async () => {
  const response = await worker.fetch(new Request('https://device.deepseekbot.dev/market'), {
    ASSETS: assets,
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('location'), null);
});
