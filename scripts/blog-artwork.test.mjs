import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('./check-blog-artwork.mjs', import.meta.url));
const pixels = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
  'base64',
);

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'blog-artwork-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'content/blog/zh'), { recursive: true });
  mkdirSync(join(dir, 'public/blog-covers'), { recursive: true });
  const article = join(dir, 'content/blog/zh/weekend.md');
  const cover = join(dir, 'public/blog-covers/weekend-zh.png');
  const metadata = cover.replace('.png', '.artwork.json');
  const title = 'A weekend group conversation';
  writeFileSync(article, `---\n${JSON.stringify({ title })}\n---\n\nA real case.\n`);
  writeFileSync(cover, pixels);
  writeFileSync(
    metadata,
    JSON.stringify({
      articleTitle: title,
      sha256: createHash('sha256').update(pixels).digest('hex'),
    }),
  );
  return {
    article,
    cover,
    metadata,
    run: () =>
      spawnSync(process.execPath, [checker], { cwd: dir, encoding: 'utf8', timeout: 10000 }),
  };
}

test('release checker accepts matching artwork and preserves its exact image and metadata bytes', (t) => {
  const f = fixture(t);
  const original = readFileSync(f.metadata);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 1 curated blog covers/);
  assert.deepEqual(readFileSync(f.cover), pixels);
  assert.deepEqual(readFileSync(f.metadata), original);
});

test('release checker refuses a retitled article without replacing the approved image', (t) => {
  const f = fixture(t);
  writeFileSync(f.article, '---\n{"title":"A different story"}\n---\n');
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /article title changed/);
  assert.deepEqual(readFileSync(f.cover), pixels);
});

test('release checker refuses changed image bytes', (t) => {
  const f = fixture(t);
  const changed = Buffer.concat([pixels, Buffer.from('different pixels')]);
  writeFileSync(f.cover, changed);
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /image hash changed/);
  assert.deepEqual(readFileSync(f.cover), changed);
});

test('release checker refuses a missing approved image instead of falling back to a template', (t) => {
  const f = fixture(t);
  rmSync(f.cover);
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /image missing/);
  assert.equal(existsSync(f.cover), false);
});

test('release checker refuses malformed artwork metadata', (t) => {
  const f = fixture(t);
  writeFileSync(f.metadata, '{bad json');
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid artwork metadata/);
});

test('release checker refuses reviewed artwork whose article has been removed', (t) => {
  const f = fixture(t);
  rmSync(f.article);
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /article missing/);
});

test('release checker leaves ordinary template covers alone', (t) => {
  const f = fixture(t);
  rmSync(f.metadata);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 0 curated blog covers/);
  assert.deepEqual(readFileSync(f.cover), pixels);
});
