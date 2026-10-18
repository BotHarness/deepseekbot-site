import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { renderDocs } from './docs.ts';
import { renderChangelog } from './changelog.ts';
import { renderBlog } from './blog.ts';
import { COMMUNITY_LINKS, QQ_GROUP } from '../src/communityLinks.ts';
import { HEADER_COMMUNITY_COPY, headerCommunityMarkup } from '../src/headerCommunity.ts';
import { DESKTOP_PACKAGE } from '../src/installRelease.ts';

test('rendered changelogs preserve every release-summary paragraph in both languages', () => {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-release-summary-'));
  try {
    mkdirSync(join(fixture, 'content/changelog'), { recursive: true });
    for (const lang of ['zh', 'en']) {
      const intro = lang === 'zh' ? '托布与新的 Home。' : 'Tob and a new Home.';
      const warning =
        lang === 'zh'
          ? '手机与云端仍为开发／UAT；回退前请恢复备份。'
          : 'Mobile and Cloud remain development/UAT; restore the backup before rollback.';
      writeFileSync(
        join(fixture, 'content/changelog', `${lang}.md`),
        `## [Unreleased]\n\nPending.\n\n## [1.4.0] - 2026-10-19\n\n${intro}\n\n${warning}\n\n### Added\n\n- Added Tob.\n`,
      );
    }
    process.chdir(fixture);
    renderChangelog();
    for (const [lang, prefix] of [
      ['zh', ''],
      ['en', 'en/'],
    ]) {
      const html = readFileSync(`${prefix}changelog/index.html`, 'utf8');
      assert.ok(html.includes(lang === 'zh' ? '托布与新的 Home。' : 'Tob and a new Home.'));
      assert.ok(
        html.includes(
          lang === 'zh'
            ? '手机与云端仍为开发／UAT；回退前请恢复备份。'
            : 'Mobile and Cloud remain development/UAT; restore the backup before rollback.',
        ),
      );
      assert.equal([...html.matchAll(/<p class="changelog-summary">/g)].length, 2);
      assert.ok(html.includes('Added Tob.'));
      assert.ok(!html.includes('Pending.'));
      assert.ok(html.includes(`<code>${DESKTOP_PACKAGE}</code>`));
      assert.ok(html.includes(`href="/${prefix}docs/installation/"`));
      assert.ok(html.includes(lang === 'zh' ? '历史安装版本' : 'historical install versions'));
    }
  } finally {
    process.chdir(cwd);
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('bilingual blog pages keep self-canonicals and reciprocal locale alternates', () => {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-blog-seo-test-'));
  try {
    cpSync(join(cwd, 'content'), join(fixture, 'content'), { recursive: true });
    cpSync(join(cwd, 'public'), join(fixture, 'public'), { recursive: true });
    process.chdir(fixture);
    const paths = renderBlog();
    for (const path of paths) {
      const html = readFileSync(path, 'utf8');
      const pathname = `/${path.replace(/index\.html$/, '')}`;
      const chinesePath = pathname.replace(/^\/en\//, '/');
      assert.ok(
        html.includes(`<link rel="canonical" href="https://deepseekbot.app${pathname}"`),
        path,
      );
      assert.ok(
        html.includes(`hreflang="zh-Hans" href="https://deepseekbot.app${chinesePath}"`),
        path,
      );
      assert.ok(
        html.includes(`hreflang="en" href="https://deepseekbot.app/en${chinesePath}"`),
        path,
      );
      assert.doesNotMatch(html, /\/en\/en\//, path);
    }
    for (const prefix of ['', 'en/']) {
      const html = readFileSync(`${prefix}blog/tailscale-remote-ai-workspace/index.html`, 'utf8');
      const lang = prefix ? 'en' : 'zh';
      assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
      assert.match(html, /<meta name="description" content="[^"]+"/);
      assert.ok(
        html.includes(
          `https://deepseekbot.app/blog-covers/tailscale-remote-ai-workspace-${lang}.png`,
        ),
      );
      assert.ok(
        readFileSync(`${prefix}blog/index.html`, 'utf8').includes('tailscale-remote-ai-workspace'),
      );
      for (const imageName of ['greeting', 'readonly-commands', 'workspace-result']) {
        const imagePath = `/blog-images/tailscale-remote-ai-workspace/${imageName}.png`;
        assert.ok(html.includes(`src="${imagePath}"`), `${lang}: ${imageName}`);
        assert.ok(readFileSync(`public${imagePath}`).length > 0);
      }
    }
  } finally {
    process.chdir(cwd);
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('personal memory article keeps paired metadata, covers and existing guide destinations', () => {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-memory-article-test-'));
  try {
    cpSync(join(cwd, 'content'), join(fixture, 'content'), { recursive: true });
    cpSync(join(cwd, 'public'), join(fixture, 'public'), { recursive: true });
    process.chdir(fixture);
    renderDocs();
    renderBlog();
    for (const lang of ['zh', 'en']) {
      const prefix = lang === 'en' ? '/en' : '';
      const articlePath = `${prefix}/blog/personal-ai-agent-memory/`;
      const html = readFileSync(`.${articlePath}index.html`, 'utf8');
      const source = readFileSync(`content/blog/${lang}/personal-ai-agent-memory.md`, 'utf8');
      const metadata = JSON.parse(source.match(/^---\n(\{[\s\S]*?\})\n---/)[1]);
      assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1);
      for (const attribute of ['property="og:title"', 'name="twitter:title"']) {
        assert.ok(html.includes(`<meta ${attribute} content="${metadata.title} · DeepSeekBot"`));
      }
      for (const attribute of [
        'name="description"',
        'property="og:description"',
        'name="twitter:description"',
      ]) {
        assert.ok(html.includes(`<meta ${attribute} content="${metadata.description}"`));
      }
      const cover = `/blog-covers/personal-ai-agent-memory-${lang}.png`;
      assert.ok(html.includes(`content="https://deepseekbot.app${cover}"`));
      assert.ok(readFileSync(`public${cover}`).length > 0);
      assert.ok(readFileSync(`.${prefix}/blog/index.html`, 'utf8').includes(articlePath));
      for (const destination of [
        'docs/installation',
        'docs/channel-sidebar/memory-files',
        'docs/channel-sidebar/memory-evolution',
        'docs/capabilities',
        'blog/first-agent-briefing',
        'blog/personal-ai-agents-comparison',
      ]) {
        const path = `${prefix}/${destination}/`;
        assert.ok(html.includes(`href="${path}"`));
        assert.ok(readFileSync(`.${path}index.html`).length > 0);
      }
      assert.doesNotMatch(source, /Grok Bot|grok-bot/);
      assert.match(source, /1\.2\.0/);
      assert.match(source, /SOUL\.md/);
      assert.match(source, /MEMORY\.md/);
      assert.match(source, /MIT/);
      for (const figureId of ['bot-conversations', 'bot-group']) {
        assert.ok(html.includes(`id="${figureId}"`));
      }
      for (const imagePath of [
        `/blog-figures/first-task/product-overview-${lang}.jpg`,
        `/blog-figures/personal-agent-memory/group-${lang}.jpg`,
      ]) {
        assert.ok(html.includes(`src="${imagePath}" width="2880" height="1800"`));
        const imageBytes = readFileSync(`public${imagePath}`);
        assert.deepEqual([...imageBytes.subarray(0, 3)], [255, 216, 255]);
      }
      assert.ok(html.includes('viewBox="560 170 1680 920"'));
    }
  } finally {
    process.chdir(cwd);
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('localized controls retain destinations, hidden descriptions and click-only QQ copying', () => {
  for (const lang of ['zh', 'en']) {
    const markup = headerCommunityMarkup(lang);
    const copy = HEADER_COMMUNITY_COPY[lang];
    assert.match(markup, /data-placement="header"/);
    for (const brand of ['github', 'discord', 'qq']) {
      assert.ok(markup.includes(`aria-label="${copy[brand]}"`));
      assert.ok(markup.includes(`aria-describedby="header-community-${brand}"`));
      assert.ok(markup.includes(`id="header-community-${brand}" role="tooltip" hidden`));
    }
    for (const href of Object.values(COMMUNITY_LINKS)) {
      assert.ok(markup.includes(`href="${href}" target="_blank" rel="noreferrer"`));
    }
    assert.match(markup, /<button type="button"[^>]*data-header-qq>/);
    assert.ok(markup.includes(`<p class="header-qq-number">${QQ_GROUP}</p>`));
    assert.match(markup, /<p data-qq-result role="status"><\/p>/);
    assert.doesNotMatch(markup, /onclick|onmouseover|<script/);
  }
});

test('all generated guides, privacy, changelog and blog pages retain the shared header and correct locale links', () => {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-header-test-'));
  try {
    cpSync(join(cwd, 'content'), join(fixture, 'content'), { recursive: true });
    process.chdir(fixture);
    const paths = [...renderDocs(), ...renderChangelog(), ...renderBlog()];
    assert.ok(paths.length > 10);
    for (const path of paths) {
      const lang = path.split(/[\\/]/)[0] === 'en' ? 'en' : 'zh';
      const html = readFileSync(path, 'utf8');
      assert.doesNotMatch(html, /href="[^"]*\\/, path);
      if (lang === 'en' && path.includes('blog')) {
        const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
        assert.ok(canonical, path);
        assert.ok(
          html.includes(`<link rel="alternate" hreflang="en" href="${canonical}"`),
          `${path}: English alternate must point to the page itself`,
        );
        assert.doesNotMatch(html, /\/en\/en\//, path);
      }
      const header = html.match(/<header class="topbar">([\s\S]*?)<\/header>/)?.[1];
      assert.ok(header, path);
      assert.ok(header.includes(headerCommunityMarkup(lang)), path);
      assert.match(header, /data-search-open/);
      assert.ok(
        header.includes(`data-search-open aria-label="${lang === 'zh' ? '搜索' : 'Search'}"`),
      );
      assert.match(header, /hrefLang="en"|hreflang="en"/);
      assert.match(header, /hrefLang="zh-Hans"|hreflang="zh-Hans"/);
      const nav = header.match(/<nav class="topnav"[\s\S]*?<\/nav>/)?.[0];
      assert.equal([...nav.matchAll(/<a /g)].length, 7, path);
      assert.ok(nav.includes(lang === 'zh' ? '头像工坊' : 'Avatar Studio'), path);
      assert.doesNotMatch(nav, /undefined/, path);
      assert.doesNotMatch(nav, /#community|#avatar|github\.com/);
      assert.match(
        nav,
        /#features[\s\S]*#install[\s\S]*\/market[\s\S]*\/avatar[\s\S]*\/docs[\s\S]*\/changelog[\s\S]*\/blog/,
      );
      if (path.includes('privacy')) assert.doesNotMatch(nav, /aria-current="page"/);
      else assert.match(nav, /aria-current="page"/);
    }
  } finally {
    process.chdir(cwd);
    rmSync(fixture, { recursive: true, force: true });
  }
});
