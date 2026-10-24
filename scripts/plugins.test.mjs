import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  installCommand,
  pluginPath,
  pluginsLlms,
  pluginsPath,
  pluginsSitemap,
  readPlugins,
  renderPlugins,
} from './plugins.ts';

const SITE = 'https://tobs.app';

function inFixture(run) {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-plugins-test-'));
  try {
    cpSync(join(cwd, 'content/plugins'), join(fixture, 'content/plugins'), { recursive: true });
    cpSync(join(cwd, 'public/guides/plugins'), join(fixture, 'public/guides/plugins'), {
      recursive: true,
    });
    process.chdir(fixture);
    run(fixture);
  } finally {
    process.chdir(cwd);
    rmSync(fixture, { recursive: true, force: true });
  }
}

test('VRM Companion is listed in both languages with its install command, requirements and licenses', () => {
  inFixture(() => {
    const plugin = readPlugins().find((p) => p.slug === 'vrm-companion');
    assert.ok(plugin);
    assert.equal(
      installCommand(plugin),
      'dsh plugin --profile <your-profile> add @botharness/vrm-companion@0.2.0',
    );
    renderPlugins();
    for (const lang of ['zh', 'en']) {
      for (const path of [pluginsPath(lang), pluginPath(lang, 'vrm-companion')]) {
        const html = readFileSync(`${path.slice(1)}index.html`, 'utf8');
        const self = path.replace(/^\/en\//, '/');
        assert.ok(html.includes(`<link rel="canonical" href="${SITE}${path}"`), path);
        assert.ok(html.includes(`hreflang="zh-Hans" href="${SITE}${self}"`), path);
        assert.ok(html.includes(`hreflang="en" href="${SITE}/en${self}"`), path);
        assert.ok(
          html.includes(
            'dsh plugin --profile &lt;your-profile&gt; add @botharness/vrm-companion@0.2.0',
          ),
          path,
        );
        assert.ok(html.includes('&gt;=0.2.0-rc.2 &lt;0.3.0'), path);
        assert.ok(html.includes('1.4.1'), path);
        assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, path);
        // every image the page shows exists, and its URL stays short enough to share
        for (const [, src] of html.matchAll(/<(?:img|video)[^>]* src="([^"]+)"/g)) {
          if (src.startsWith('/logo')) continue;
          assert.ok(existsSync(`public${src}`), `${path}: ${src}`);
          assert.ok(`${SITE}${src}`.length <= 150, src);
        }
      }
      const detail = readFileSync(
        `${pluginPath(lang, 'vrm-companion').slice(1)}index.html`,
        'utf8',
      );
      assert.match(detail, /AvatarSample_A/);
      assert.match(detail, /KayKit/);
      assert.match(detail, /CC0/);
      assert.match(detail, /MIT/);
      assert.ok(
        detail.includes('https://github.com/BotHarness/DeepSeekBot/blob/main/docs/panel-plugin.md'),
      );
      assert.ok(detail.includes('https://www.npmjs.com/package/@botharness/vrm-companion/v/0.2.0'));
      assert.match(detail, /VRM Companion/);
    }
  });
});

test('a new plugin needs only a data file and its media', () => {
  inFixture(() => {
    const base = JSON.parse(readFileSync('content/plugins/vrm-companion.json', 'utf8'));
    writeFileSync(
      'content/plugins/second.json',
      JSON.stringify({
        ...base,
        order: 2,
        package: '@botharness/second',
        zh: { ...base.zh, title: '第二个' },
        en: { ...base.en, title: 'Second' },
      }),
    );
    renderPlugins();
    for (const lang of ['zh', 'en']) {
      const list = readFileSync(`${pluginsPath(lang).slice(1)}index.html`, 'utf8');
      assert.ok(list.indexOf('vrm-companion/') < list.indexOf('second/'));
      assert.ok(existsSync(`${pluginPath(lang, 'second').slice(1)}index.html`));
    }
    assert.ok(pluginsSitemap().includes(`${SITE}/en/plugins/second/`));
    assert.ok(pluginsLlms().includes(`${SITE}/en/plugins/second/`));
  });
});

test('sitemap and llms.txt list the plugin pages in both languages', () => {
  inFixture(() => {
    const sitemap = pluginsSitemap();
    const llms = pluginsLlms();
    for (const path of [
      '/plugins/',
      '/en/plugins/',
      '/plugins/vrm-companion/',
      '/en/plugins/vrm-companion/',
    ]) {
      assert.ok(sitemap.includes(`<loc>${SITE}${path}</loc>`), path);
      assert.ok(llms.includes(`${SITE}${path}`), path);
    }
    assert.ok(llms.includes('@botharness/vrm-companion@0.2.0'));
  });
});

test('a plugin without its cover image fails the build', () => {
  inFixture(() => {
    rmSync('public/guides/plugins/vrm-companion/cover-light.webp');
    assert.throws(() => readPlugins(), /cover/);
  });
});
