import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DESKTOP_PACKAGE, VERSION } from '../src/installRelease.ts';

test('Hero and bilingual installation guides share the stable exact package spec', () => {
  assert.match(VERSION, /^\d+\.\d+\.\d+$/);
  assert.equal(DESKTOP_PACKAGE, `deepseekbot@${VERSION}`);
  const copy = readFileSync('src/content.ts', 'utf8');
  assert.ok(copy.includes('dsh plugin --profile web add ${DESKTOP_PACKAGE}'));
  for (const lang of ['zh', 'en']) {
    const guide = readFileSync(`content/docs/${lang}/installation.md`, 'utf8');
    assert.ok(guide.includes(`\n${DESKTOP_PACKAGE}\n`));
    assert.ok(guide.includes(`add ${DESKTOP_PACKAGE}`));
    assert.ok(guide.includes(`npm pack ${DESKTOP_PACKAGE}`));
    assert.doesNotMatch(guide, /add deepseekbot(?:\s|`)|npm pack deepseekbot(?:\s|`)/);
    assert.doesNotMatch(
      guide,
      /The package name alone installs the latest release|只填包名会安装最新正式版/,
    );
  }
});
