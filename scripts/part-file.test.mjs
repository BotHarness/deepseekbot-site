import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { customPartId } from '@botharness/pixel-avatar';
import {
  decodePartFile,
  decodePartFiles,
  encodePartFile,
  encodePartLibrary,
  partFileName,
} from '../src/partFile.ts';

// The fixtures were written by BotHarness's own encoder (packages/core/src/bots/part-file.ts),
// so these tests keep the site's part files importable into DeepSeekBot and back.
const fixture = (name) => readFileSync(new URL(`fixtures/part-file/${name}`, import.meta.url));
const files = JSON.parse(fixture('files.json'));

test('a part PNG is byte-identical to the one DeepSeekBot exports', async () => {
  assert.deepEqual(Buffer.from(await encodePartFile(files[0])), fixture('crown.png'));
});

test('a DeepSeekBot part PNG imports with its name, author and identity', () => {
  const file = decodePartFile(new Uint8Array(fixture('crown.png')));
  assert.equal(file.name, '小皇冠');
  assert.equal(file.author, 'Mira');
  assert.equal(customPartId(file.part), customPartId(files[0].part));
});

test('a DeepSeekBot library zip (deflated entries) imports every part', async () => {
  const result = await decodePartFiles(new Uint8Array(fixture('library.zip')));
  assert.equal(result.refused, 0);
  assert.deepEqual(
    result.files.map((file) => customPartId(file.part)),
    files.map((file) => customPartId(file.part)),
  );
});

test('the site library zip round-trips and names entries like DeepSeekBot', async () => {
  const zip = await encodePartLibrary(files);
  const result = await decodePartFiles(zip);
  assert.deepEqual(
    result.files.map((file) => file.name),
    files.map((file) => file.name),
  );
  const names = new TextDecoder().decode(zip);
  for (const file of files) assert.ok(names.includes(partFileName(file)));
});

test('other files are refused with a reason', async () => {
  assert.equal(await decodePartFiles(new Uint8Array([1, 2, 3])), 'not-png');
  const png = new Uint8Array(fixture('crown.png'));
  const broken = png.slice();
  broken[broken.length - 20] ^= 1;
  assert.equal(decodePartFile(broken), 'not-png');
});
