import assert from 'node:assert/strict';
import test from 'node:test';
import { createGitHubStarsSource, GITHUB_STARS_API, GITHUB_STARS_TTL } from '../src/githubStars.ts';

const response = (count) => new Response(JSON.stringify({ stargazers_count: count }));
function memoryStorage(value = null) {
  return {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
    removeItem: () => {
      value = null;
    },
  };
}

test('Hero and header share one live request, and zero is accepted only from GitHub', async () => {
  let resolve;
  let requests = 0;
  const source = createGitHubStarsSource({
    fetcher: (url, options) => {
      assert.equal(url, GITHUB_STARS_API);
      assert.equal(options.credentials, 'omit');
      assert.ok(options.signal instanceof AbortSignal);
      requests++;
      return new Promise((done) => {
        resolve = done;
      });
    },
  });
  const hero = [],
    header = [];
  const stopHero = source.subscribe((count) => hero.push(count));
  const stopHeader = source.subscribe((count) => header.push(count));
  const first = source.refresh();
  assert.equal(source.refresh(), first);
  assert.equal(requests, 1);
  assert.deepEqual(hero, [null]);
  resolve(response(0));
  await first;
  assert.deepEqual(hero, [null, 0]);
  assert.deepEqual(header, hero);
  stopHero();
  stopHeader();
});

test('fresh cross-page cache avoids calls, then refreshes at its five-minute expiry', async () => {
  let now = 1000;
  let requests = 0;
  const storage = memoryStorage(JSON.stringify({ count: 96, checkedAt: now }));
  const source = createGitHubStarsSource({
    now: () => now,
    storage,
    fetcher: async () => {
      requests++;
      return response(101);
    },
  });
  const values = [];
  source.subscribe((count) => values.push(count));
  await source.refresh();
  assert.equal(requests, 0);
  assert.equal(source.refreshAfter(), GITHUB_STARS_TTL);
  now += GITHUB_STARS_TTL;
  await source.refresh();
  assert.equal(requests, 1);
  assert.deepEqual(values, [96, 101]);
  assert.deepEqual(JSON.parse(storage.getItem()), { count: 101, checkedAt: now });
});

test('rate limits and network errors hide expired counts, clear cache, and back off', async () => {
  for (const fail of [
    async () => new Response('', { status: 403 }),
    async () => {
      throw new Error('offline');
    },
  ]) {
    let now = 1000;
    let requests = 0;
    const storage = memoryStorage(JSON.stringify({ count: 96, checkedAt: now }));
    const source = createGitHubStarsSource({
      now: () => now,
      storage,
      fetcher: async () => {
        requests++;
        return fail();
      },
    });
    const values = [];
    source.subscribe((count) => values.push(count));
    now += GITHUB_STARS_TTL;
    await source.refresh();
    await source.refresh();
    assert.equal(requests, 1);
    assert.deepEqual(values, [96, null]);
    assert.equal(storage.getItem(), null);
    assert.equal(source.refreshAfter(), GITHUB_STARS_TTL);
  }
});

test('invalid API values never appear as star counts', async () => {
  for (const count of [-1, 1.5, '96', null, undefined, Number.MAX_SAFE_INTEGER + 1]) {
    const values = [];
    const source = createGitHubStarsSource({ fetcher: async () => response(count) });
    source.subscribe((value) => values.push(value));
    await source.refresh();
    assert.deepEqual(values, [null, null]);
  }
});

test('denied storage does not prevent live data or leak a rejection', async () => {
  const denied = () => {
    throw new Error('storage denied');
  };
  const source = createGitHubStarsSource({
    storage: { getItem: denied, setItem: denied, removeItem: denied },
    fetcher: async () => response(96),
  });
  const values = [];
  source.subscribe((value) => values.push(value));
  await source.refresh();
  assert.deepEqual(values, [null, 96]);
});

test('expired, malformed and future-dated cache entries are ignored', async () => {
  for (const value of [
    'broken',
    'null',
    JSON.stringify({ count: '96', checkedAt: 0 }),
    JSON.stringify({ count: 96, checkedAt: 0 }),
    JSON.stringify({ count: 96, checkedAt: 2 * GITHUB_STARS_TTL }),
  ]) {
    const source = createGitHubStarsSource({
      now: () => GITHUB_STARS_TTL,
      storage: memoryStorage(value),
      fetcher: async () => response(97),
    });
    const values = [];
    source.subscribe((value) => values.push(value));
    await source.refresh();
    assert.deepEqual(values, [null, 97]);
  }
});
