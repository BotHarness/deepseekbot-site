import assert from 'node:assert/strict';
import test from 'node:test';
import { copyText } from '../src/clipboard.ts';
import { communityIconSvg } from '../src/communityIcons.ts';

test('copy waits for the exact clipboard write before reporting success', async () => {
  let resolveWrite;
  let written;
  let settled = false;
  const result = copyText('1125565676', {
    writeText(text) {
      written = text;
      return new Promise((resolve) => {
        resolveWrite = resolve;
      });
    },
  }).then((success) => {
    settled = true;
    return success;
  });
  await Promise.resolve();
  assert.equal(written, '1125565676');
  assert.equal(settled, false);
  resolveWrite();
  assert.equal(await result, true);
});

test('denied and missing clipboard APIs never report copied', async () => {
  assert.equal(await copyText('1125565676', undefined), false);
  assert.equal(
    await copyText('1125565676', {
      writeText() {
        return Promise.reject(new Error('NotAllowedError'));
      },
    }),
    false,
  );
});

test('static header SVGs share nonempty, bounded pixel geometry without scripts', () => {
  for (const brand of ['discord', 'github', 'qq']) {
    const svg = communityIconSvg(brand);
    assert.match(svg, /viewBox="0 0 24 24"/);
    assert.match(svg, /aria-hidden="true"/);
    assert.doesNotMatch(svg, /<script|on\w+=|<image|transform=/);
    const runs = [...svg.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g)];
    assert.ok(runs.length > 15);
    for (const [, x, y, width] of runs) {
      assert.ok(Number(x) + Number(width) <= 24);
      assert.ok(Number(y) < 24);
    }
  }
  assert.match(communityIconSvg('discord'), /fill="#5865F2"/);
  assert.match(communityIconSvg('github'), /fill="currentColor"/);
});
