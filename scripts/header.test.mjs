import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { renderDocs } from './docs.ts';
import { renderChangelog } from './changelog.ts';
import { renderBlog } from './blog.ts';
import { COMMUNITY_LINKS, QQ_GROUP } from '../src/communityLinks.ts';
import { HEADER_COMMUNITY_COPY, headerCommunityMarkup } from '../src/headerCommunity.ts';

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

test('all generated guides, privacy and changelog pages use the shared header and retain search, locale and current-page links', () => {
  const cwd = process.cwd();
  const fixture = mkdtempSync(join(tmpdir(), 'site-header-test-'));
  try {
    cpSync(join(cwd, 'content'), join(fixture, 'content'), { recursive: true });
    process.chdir(fixture);
    const paths = [...renderDocs(), ...renderChangelog()];
    assert.ok(paths.length > 10);
    for (const path of paths) {
      const lang = path.split(/[\\/]/)[0] === 'en' ? 'en' : 'zh';
      const html = readFileSync(path, 'utf8');
      assert.doesNotMatch(html, /href="[^"]*\\/, path);
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
