import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { DOC_PAGES } from './docs-pages.mjs';
import { docsMarkdown, docsSitemap, searchIndex } from './docs.ts';

const methods = ['private-named-tunnel', 'private-ingress', 'private-relay'];

test('private deployment is discoverable in both languages and agents receive the full prompt', () => {
  const markdown = docsMarkdown();
  const sitemap = docsSitemap();
  for (const lang of ['zh', 'en']) {
    const prefix = lang === 'zh' ? '' : '/en';
    const index = searchIndex(lang);
    for (const slug of methods) {
      const page = DOC_PAGES.find((entry) => entry.slug === slug);
      assert.equal(page.parent, 'private-connect');
      assert.ok(sitemap.includes(`https://tobs.app${prefix}/docs/${slug}/`));
      assert.ok(index.some((entry) => entry.u.startsWith(`${prefix}/docs/${slug}/`)));
      const guide = markdown.find(
        (entry) => entry.path === `${prefix.slice(1)}${prefix ? '/' : ''}docs/${slug}.md`,
      );
      assert.ok(guide, `${lang}/${slug} has a machine-readable sibling`);
      assert.match(guide.body, /```text\n[\s\S]+?\n```/);
      assert.ok(guide.body.includes(`https://tobs.app${prefix}/docs/${slug}/`));
      assert.ok(guide.body.includes('https://github.com/BotHarness/DeepSeekBot/'));
    }
    const pairing = readFileSync(`content/docs/${lang}/mobile-pairing.md`, 'utf8');
    assert.ok(pairing.includes('/docs/private-connect/'));
  }
});

test('guide links stay on the product site and preserve explicit language changes', () => {
  const markdown = docsMarkdown();
  const english = markdown.find((entry) => entry.path === 'en/docs/private-connect.md');
  const chinese = markdown.find((entry) => entry.path === 'docs/private-ingress.md');
  assert.ok(english.body.includes('https://tobs.app/en/docs/private-relay/'));
  assert.ok(chinese.body.includes('https://tobs.app/en/docs/private-ingress/#reference-configs'));
  assert.ok(chinese.body.includes('https://tobs.app/docs/private-named-tunnel/'));
});
