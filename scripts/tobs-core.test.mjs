import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const core = read('src/tobs-core.css');
const declared = (css, name) =>
  [...css.matchAll(new RegExp(`${name}:\\s*([^;]+);`, 'g'))].map((m) => m[1].trim());

test('the synced core file defines light and dark brand and status colours', () => {
  assert.match(core, /:root\[data-theme='dark'\]/);
  for (const name of ['brand', 'brand-vivid', 'on-solid', 'success', 'warning', 'danger', 'info']) {
    assert.equal(declared(core, `--tobs-core-${name}`).length, 2, `--tobs-core-${name}`);
  }
});

test('styles.css loads core before its own palette', () => {
  const styles = read('src/styles.css');
  assert.ok(styles.indexOf("@import './tobs-core.css';") > -1);
  assert.ok(styles.indexOf("@import './tobs-core.css';") < styles.indexOf(':root {'));
});

test('brand, accent and status colours read core instead of local hex values', () => {
  const pairs = [
    ['src/styles.css', '--accent', 'var(--tobs-core-brand-vivid)'],
    ['src/styles.css', '--accent-ink', 'var(--tobs-core-on-solid)'],
    ['src/demo.css', '--app-accent', 'var(--tobs-core-brand)'],
    ['src/demo.css', '--app-ok', 'var(--tobs-core-success)'],
    ['src/demo.css', '--app-ok-bg', 'var(--tobs-core-success-tint)'],
    ['src/demo.css', '--app-warn', 'var(--tobs-core-warning)'],
    ['src/demo.css', '--app-warn-bg', 'var(--tobs-core-warning-tint)'],
    ['src/demo.css', '--app-info', 'var(--tobs-core-info)'],
    ['src/demo.css', '--app-info-bg', 'var(--tobs-core-info-tint)'],
  ];
  for (const [file, name, value] of pairs) {
    assert.deepEqual(declared(read(file), name), [value], `${file} ${name}`);
  }
  const chips = read('src/docs.css');
  for (const status of ['success', 'info', 'warning', 'danger']) {
    assert.match(chips, new RegExp(`--chip: var\\(--tobs-core-${status}\\)`));
  }
});
