import test from 'node:test';
import assert from 'node:assert/strict';
import { createConsentPrompt } from '../src/analyticsConsent.ts';

test('pending consent delegates the exact explicit choice once, then publishes guide-ready status', () => {
  for (const accept of [false, true]) {
    const prompt = createConsentPrompt();
    const observed = [];
    const calls = [];
    const unsubscribe = prompt.subscribe(() => observed.push(prompt.snapshot()));
    assert.equal(prompt.snapshot(), 'unavailable');
    prompt.loading();
    prompt.choose(accept);
    assert.deepEqual(calls, []);
    prompt.configure('pending', (value) => calls.push(value));
    assert.equal(prompt.snapshot(), 'pending');
    prompt.choose(accept);
    prompt.choose(!accept);
    assert.deepEqual(calls, [accept]);
    assert.deepEqual(observed, ['loading', 'pending', accept ? 'accepted' : 'declined']);
    unsubscribe();
    prompt.configure('unavailable');
    assert.equal(observed.length, 3);
  }
});
test('returning consent and failed decision never silently grant permission', () => {
  for (const status of ['accepted', 'declined', 'unavailable']) {
    const prompt = createConsentPrompt();
    prompt.configure(status, () => assert.fail('must not replay a saved decision'));
    prompt.choose(true);
    assert.equal(prompt.snapshot(), status);
  }
  const prompt = createConsentPrompt();
  prompt.configure('pending', () => {
    throw Error('failed');
  });
  assert.throws(() => prompt.choose(true), /failed/);
  assert.equal(prompt.snapshot(), 'pending');
});
