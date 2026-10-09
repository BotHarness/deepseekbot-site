import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { canonicalRedirect } from '../worker/index.ts';

const assets = { fetch: async (request) => new Response(`asset ${new URL(request.url).pathname}`) };

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
  assert.equal(
    canonicalRedirect(new URL('http://deepseekbot.dev:8080/market')),
    'https://deepseekbot.app/market',
  );
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
