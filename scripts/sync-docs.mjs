// Copies the DeepSeekBot user guides from a BotHarness checkout into content/docs/{zh,en}
// and their screenshots into public/guides. Run after the guides change upstream:
//   BOTHARNESS=../BotHarness pnpm docs:sync
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { DOC_PAGES } from './docs-pages.mjs';

const ROOT = process.env.BOTHARNESS;
if (!ROOT) throw new Error('Set BOTHARNESS to a BotHarness checkout');
const GITHUB_BLOB = 'https://github.com/BotHarness/BotHarness/blob/main/';

const frontmatterOf = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^(title|description):\s*(.*)$/);
    if (field) meta[field[1]] = field[2].replace(/^["']|["']$/g, '');
    const order = line.match(/^\s+order:\s*(\d+)/);
    if (order) meta.order = Number(order[1]);
  }
  return { meta, body: text.slice(match[0].length) };
};

// relative .md links point into the BotHarness repo; send ADRs and the bridge guide to the
// developer docs on botharness.ai, anything else to GitHub
const rewriteRelative = (body, source) =>
  body.replace(
    /\]\((?!https?:|\/|#|mailto:)([^)\s]+?\.md)(#[^)\s]*)?\)/g,
    (_m, path, hash = '') => {
      const repoPath = posix.normalize(posix.join(posix.dirname(source), path));
      const adr = repoPath.match(/^docs\/adr\/([0-9]{4}-[a-z0-9-]+)\.md$/);
      if (adr) return `](/dev/adr/${adr[1]}${hash})`;
      if (/^docs\/client-bridge(\.zh)?\.md$/.test(repoPath))
        return `](/dev/guides/client-bridge${hash})`;
      return `](${GITHUB_BLOB}${repoPath}${hash})`;
    },
  );

// the .mdx sources write a few attributes the JSX way; plain HTML needs the DOM spelling
const htmlFromJsx = (body) =>
  body
    .replace(
      /style=\{\{([^}]*)\}\}/g,
      (_m, css) =>
        `style="${css
          .split(',')
          .map((rule) => {
            const [key, value] = rule.split(':').map((part) => part.trim());
            return `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value.replace(/^'|'$/g, '')}`;
          })
          .join(';')}"`,
    )
    .replace(/\bplaysInline\b/g, 'playsinline')
    .replace(/\bsrcLang=/g, 'srclang=');

const prepare = (text, source) => {
  const { meta, body } = frontmatterOf(text);
  const title = meta.title ?? body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const cleaned = body
    .replace(/^(#\s+[^\r\n]*\r?\n+)\s*<!--[\s\S]*?-->\s*\r?\n+/, '$1')
    .replace(/^#\s+.*\r?\n+/, '');
  return {
    meta: { ...meta, title },
    body: htmlFromJsx(rewriteRelative(cleaned, source)).trimEnd() + '\n',
  };
};

rmSync('content/docs', { recursive: true, force: true });
for (const page of DOC_PAGES) {
  for (const lang of ['zh', 'en']) {
    const variant = page[lang];
    const { meta, body } = prepare(
      readFileSync(join(ROOT, variant.source), 'utf8'),
      variant.source,
    );
    const head = {
      title: variant.title ?? meta.title,
      description: variant.description ?? meta.description ?? '',
      order: page.order ?? meta.order ?? 99,
      ...(page.parent ? { parent: page.parent } : {}),
      source: variant.source,
    };
    const file = join('content/docs', lang, `${page.slug}.md`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `---\n${JSON.stringify(head, null, 2)}\n---\n\n${body}`);
  }
}
rmSync('public/guides', { recursive: true, force: true });
cpSync(resolve(ROOT, 'apps/docs/public/guides'), 'public/guides', { recursive: true });
console.log(`synced ${DOC_PAGES.length} guides × 2 languages from ${ROOT}`);
