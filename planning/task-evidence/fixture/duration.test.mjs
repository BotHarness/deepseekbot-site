import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDuration } from './duration.mjs';

test('converts a normal work duration to minutes', () => {
  assert.equal(parseDuration('1:30'), 90);
});
