import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { DOC_PAGES } from './docs-pages.mjs';

const script = resolve('scripts/sync-docs.mjs');
const put = (path, text) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};

// Run the real sync against disposable source/site trees: full sync removes generated
// copies, while scoped sync must leave every unrelated guide and media file alone.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'site-doc-sync-'));
  const upstream = join(root, 'upstream');
  const site = join(root, 'site');
  mkdirSync(upstream);
  mkdirSync(site);
  execFileSync('git', ['init', '--quiet', upstream]);
  execFileSync('git', [
    '-C',
    upstream,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.com',
    'commit',
    '--quiet',
    '--allow-empty',
    '-m',
    'Fixture',
  ]);
  const revision = execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();
  for (const page of DOC_PAGES) {
    for (const lang of ['zh', 'en']) {
      const body = `# Fixture guide\n\n${page.siteSource ? 'Site-owned copy' : 'Upstream copy'}\n\n![Fixture](/guides/fixture.png)\n\n[Developer guide](/dev/guides/client-bridge)\n`;
      put(join(page.siteSource ? site : upstream, page[lang].source), body);
    }
  }
  put(join(upstream, 'apps/docs/public/guides/fixture.png'), 'fixture image');
  put(join(site, 'content/docs/en/untouched.md'), 'unrelated guide');
  put(join(site, 'public/guides/untouched.png'), 'unrelated media');
  const run = (args) =>
    execFileSync(process.execPath, [script, ...args], {
      cwd: site,
      env: { ...process.env, BOTHARNESS: upstream },
      encoding: 'utf8',
      stdio: 'pipe',
    });
  return { site, revision, run, clean: () => rmSync(root, { recursive: true, force: true }) };
}

test('scoped sync preserves unrelated files, pins source, retains site-owned copy and copies only media links', () => {
  const f = fixture();
  try {
    f.run(['--only', 'daily-browser,capabilities']);
    assert.equal(
      readFileSync(join(f.site, 'content/docs/en/untouched.md'), 'utf8'),
      'unrelated guide',
    );
    assert.equal(
      readFileSync(join(f.site, 'public/guides/untouched.png'), 'utf8'),
      'unrelated media',
    );
    assert.equal(readFileSync(join(f.site, 'public/guides/fixture.png'), 'utf8'), 'fixture image');
    const doc = readFileSync(join(f.site, 'content/docs/en/daily-browser.md'), 'utf8');
    assert.ok(doc.includes(f.revision));
    assert.ok(doc.includes('Version scope: current-source guide.'));
    assert.ok(
      readFileSync(join(f.site, 'content/docs/en/capabilities.md'), 'utf8').includes(
        'Site-owned copy',
      ),
    );
    assert.ok(
      readFileSync(join(f.site, 'content/site-guides/en/capabilities.md'), 'utf8').includes(
        'Site-owned copy',
      ),
    );
    f.run(['--only', 'daily-browser,capabilities']);
    assert.equal(readFileSync(join(f.site, 'content/docs/en/daily-browser.md'), 'utf8'), doc);
  } finally {
    f.clean();
  }
});

test('full sync retains authored site guides after replacing generated copies', () => {
  const f = fixture();
  try {
    f.run([]);
    assert.ok(
      readFileSync(join(f.site, 'content/docs/zh/capabilities.md'), 'utf8').includes(
        'Site-owned copy',
      ),
    );
    assert.ok(
      readFileSync(join(f.site, 'content/site-guides/zh/capabilities.md'), 'utf8').includes(
        'Site-owned copy',
      ),
    );
  } finally {
    f.clean();
  }
});

test('invalid scoped slug fails before touching existing guides or media', () => {
  const f = fixture();
  try {
    assert.throws(() => f.run(['--only', 'unknown-guide']), /--only expects/);
    assert.equal(
      readFileSync(join(f.site, 'content/docs/en/untouched.md'), 'utf8'),
      'unrelated guide',
    );
    assert.equal(
      readFileSync(join(f.site, 'public/guides/untouched.png'), 'utf8'),
      'unrelated media',
    );
  } finally {
    f.clean();
  }
});

test('full and scoped sync preserve site-owned screenshots rather than replacing them with upstream media', () => {
  const f = fixture();
  try {
    for (const lang of ['zh', 'en'])
      put(
        join(f.site, 'content/site-guides', lang, 'capabilities.md'),
        '# Site-owned guide\n\n![Phone](/guides/qq/mobile-permissions.png)\n',
      );
    put(join(f.site, 'public/guides/qq/mobile-permissions.png'), 'Human-supplied screenshot');
    put(join(f.site, 'public/guides/fixture.png'), 'Site-owned shared screenshot');
    put(
      join(f.site, 'content/site-guides/en/qq-connection.md'),
      '# QQ\n\n![Shared](/guides/fixture.png)\n',
    );
    f.run([]);
    assert.equal(
      readFileSync(join(f.site, 'public/guides/qq/mobile-permissions.png'), 'utf8'),
      'Human-supplied screenshot',
    );
    assert.equal(
      readFileSync(join(f.site, 'public/guides/fixture.png'), 'utf8'),
      'Site-owned shared screenshot',
    );
    f.run(['--only', 'capabilities,qq-connection']);
    assert.equal(
      readFileSync(join(f.site, 'public/guides/qq/mobile-permissions.png'), 'utf8'),
      'Human-supplied screenshot',
    );
    assert.ok(
      readFileSync(join(f.site, 'content/docs/en/qq-connection.md'), 'utf8').includes(
        '/guides/fixture.png',
      ),
    );
  } finally {
    f.clean();
  }
});
