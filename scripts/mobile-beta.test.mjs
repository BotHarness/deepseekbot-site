import assert from 'node:assert/strict';
import test from 'node:test';
import { mobileInstallEvent, TESTFLIGHT_URL } from '../src/mobileBeta.ts';
import { setupPrompt } from '../src/setupPrompt.ts';
import { DESKTOP_PACKAGE, DSH_VERSION } from '../src/installRelease.ts';

test('TestFlight clicks identify platform and placement without URL query or user data', () => {
  for (const placement of ['install']) {
    assert.deepEqual(
      mobileInstallEvent(new URL(TESTFLIGHT_URL + '?email=private@example.invalid'), placement),
      ['mobile_install_clicked', { platform: 'ios', destination: 'testflight', placement }],
    );
  }
});

test('unrelated and lookalike links cannot count as this TestFlight installation', () => {
  for (const url of [
    'https://testflight.apple.com.evil.invalid/join/sA9EznXr',
    'http://testflight.apple.com/join/sA9EznXr',
    'https://testflight.apple.com/join/another',
    'https://discord.gg/aEB2Ayhu7B',
  ])
    assert.equal(mobileInstallEvent(new URL(url), 'install'), null);
});

test('both setup prompts target the published package and desktop-owned Profile', () => {
  for (const lang of ['zh', 'en']) {
    const prompt = setupPrompt(lang);
    assert.ok(prompt.includes(DESKTOP_PACKAGE));
    assert.ok(prompt.includes(DSH_VERSION));
    assert.ok(prompt.includes(`plugin --profile desktop add ${DESKTOP_PACKAGE}`));
    assert.ok(prompt.includes('runtime/cli/bin/dsh'));
    assert.doesNotMatch(
      prompt,
      /npm\s+(?:i|install)\s+-g|plugin --profile web add|@latest|curl[^\n]*\|\s*(?:sh|bash)/,
    );
    assert.ok(prompt.includes(`https://tobs.app/${lang === 'en' ? 'en/' : ''}docs/installation/`));
  }
});

test('localized prompts distinguish permission, verification and optional follow-ups', () => {
  const zh = setupPrompt('zh'),
    en = setupPrompt('en');
  assert.match(zh, /没有时请给我清楚的手动步骤/);
  assert.match(zh, /先询问我是否安装/);
  assert.match(zh, /不绕过系统签名或安全提示/);
  assert.match(zh, /本轮不以它们作为安装完成条件/);
  assert.match(en, /do not claim to have executed/);
  assert.match(en, /ask whether I want to install/);
  assert.match(en, /outside this installation completion criterion/);
  assert.match(en, /ordinary npm dsh CLI cannot manage the Desktop Profile/);
});
