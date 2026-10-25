import assert from 'node:assert/strict';
import test from 'node:test';
import { EN_DEMO, ZH_DEMO } from '../src/demoCopy.ts';
import { HERO_COPY } from '../src/heroCopy.ts';
import { phoneChannel } from '../src/heroPhoneData.ts';

test('same-named Bots on two computers keep different identities and conversations in both locales', () => {
  for (const [lang, demo] of [
    ['en', EN_DEMO],
    ['zh', ZH_DEMO],
  ]) {
    const original = demo.channels[1];
    const snapshot = structuredClone(original);
    const studio = phoneChannel(original, 1, 'studio', HERO_COPY[lang]);
    const research = phoneChannel(original, 1, 'research', HERO_COPY[lang]);
    assert.notEqual(studio.id, research.id);
    assert.equal(studio.title, research.title);
    assert.deepEqual(studio.steps, original.steps);
    assert.notDeepEqual(studio.steps, research.steps);
    assert.equal(research.steps.at(-1).text, HERO_COPY[lang].researchReply);
    assert.deepEqual(original, snapshot);
  }
});

test('the linked introductory task retains the original approval and its result steps', () => {
  for (const [lang, demo] of [
    ['en', EN_DEMO],
    ['zh', ZH_DEMO],
  ]) {
    const original = demo.channels[0];
    const approval = original.steps.findIndex((step) => step.kind === 'approval');
    const linked = phoneChannel(original, 0, 'studio', HERO_COPY[lang]);
    assert.equal(linked.steps[0].text, HERO_COPY[lang].introPrompt);
    assert.equal(linked.steps[2].text, HERO_COPY[lang].introReply);
    assert.deepEqual(linked.steps.slice(3), original.steps.slice(approval));
  }
});
