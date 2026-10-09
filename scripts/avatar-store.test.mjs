import test from 'node:test';
import assert from 'node:assert/strict';
import { seededRecipeV2, withSpecies } from '@botharness/pixel-avatar';
import { parseDesign, serializeDesign } from '../src/avatarStore.ts';

test('an edited design round-trips', () => {
  const recipe = withSpecies(seededRecipeV2('Mira'), 'cat');
  const raw = serializeDesign({ name: 'Mira', recipe });
  assert.deepEqual(parseDesign(raw), { name: 'Mira', recipe });
});

test('a renamed design without edits keeps only the name', () => {
  assert.deepEqual(parseDesign(serializeDesign({ name: 'Nova', recipe: null })), {
    name: 'Nova',
    recipe: null,
  });
});

test('the untouched default stores nothing', () => {
  assert.equal(serializeDesign({ name: 'DeepSeekBot', recipe: null }), null);
});

test('missing, broken or invalid entries fall back to the default', () => {
  for (const raw of [
    null,
    '',
    '{',
    '[]',
    JSON.stringify({ version: 2, name: 'Mira', recipe: null }),
    JSON.stringify({ version: 1, name: 'x'.repeat(33), recipe: null }),
    JSON.stringify({ version: 1, name: 'Mira', recipe: { family: 'illustrated' } }),
  ])
    assert.equal(parseDesign(raw), null);
});
