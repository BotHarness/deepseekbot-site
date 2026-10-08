// Copies the DeepSeekBot user guides from a BotHarness checkout into content/docs/{zh,en}
// and their screenshots into public/guides. Run after the guides change upstream:
//   BOTHARNESS=../BotHarness pnpm docs:sync
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { DOC_PAGES } from './docs-pages.mjs';

const ROOT = process.env.BOTHARNESS;
if (!ROOT) throw new Error('Set BOTHARNESS to a BotHarness checkout');
const only = process.argv.indexOf('--only');
const requested = only === -1 ? null : process.argv[only + 1]?.split(',');
if (
  only !== -1 &&
  (!requested?.length || requested.some((slug) => !DOC_PAGES.some((page) => page.slug === slug)))
)
  throw new Error('--only expects comma-separated guide slugs from docs-pages.mjs');
const pages = requested ? DOC_PAGES.filter((page) => requested.includes(page.slug)) : DOC_PAGES;
const revision = execFileSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
const media = new Set();
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

// Keep old qualification records, but do not present their pre-release install advice
// as today's product status. These website-only corrections survive every sync.
const editorialBody = (body, slug, lang) => {
  if (slug === 'installation')
    return body.replace(
      lang === 'zh'
        ? /^首次安装没有已连接的 IM 账号。.*$/m
        : /^The initial installation has no IM accounts connected\..*$/m,
      lang === 'zh'
        ? '首次安装没有已连接的 IM 账号。先确认本地 DM 正常，再按[接入与可选能力](/docs/capabilities)选择平台、核对版本并绑定应用。当前源码通过私聊侧栏「外部身份」绑定；新会话可自动接收或先询问，不要求逐群在 Profile 中手工授权。'
        : 'The initial installation has no connected IM accounts. After a local DM works, use [Connections and optional tools](/docs/capabilities) to choose a platform, check your version and bind an app. Current source binds in the DM sidebar’s External identities; new conversations can be automatic or ask first, without per-group Profile authorization.',
    );
  if (slug === 'lark-connection')
    return body
      .replace(
        lang === 'zh'
          ? /^\*\*公开 npm 产品尚未发布。\*\*.*$/m
          : /^\*\*The public npm product has not been published\.\*\*.*$/m,
        lang === 'zh'
          ? '**历史验证记录（#823）：** 以下测试包用于当时的源码预览，不是今天的 npm 安装命令。正式版已发布为 deepseekbot v1.1.0；安装及最新源码流程的区别见[接入与可选能力](/docs/capabilities)。已有 #823 验证产物只用于复现对应历史记录。'
          : '**Historical qualification (#823):** the test packages below belonged to that source preview and are not today’s npm installation commands. The public product is now deepseekbot v1.1.0; see [Connections and optional tools](/docs/capabilities) for release and current-source differences. Existing #823 artifacts reproduce that historical record only.',
      )
      .replace('<summary>当前源码预览：', '<summary>历史源码预览：')
      .replace('<summary>Current source preview:', '<summary>Historical source preview:');
  if (slug === 'slack-connection')
    return (
      body
        .replace(
          '**本指南对应已验证的源码预览，不代表 npm 产品已经发布。**',
          '**历史验证记录（#868；正式版现已发布为 deepseekbot v1.1.0）：**',
        )
        .replace(
          '**This guide documents the qualified source preview, not a published npm release.**',
          '**Historical qualification (#868; the public product is now deepseekbot v1.1.0):**',
        )
        .replace('本指南涵盖已验证的 **公共频道**', '以下历史资格验证涵盖 **公共频道**')
        .replace(
          'This guide covers qualified **public-channel**',
          'The historical qualification below covers **public-channel**',
        ) +
      (lang === 'zh'
        ? '\n当前源码的 Slack 私聊路径另在 [#1125](https://github.com/BotHarness/BotHarness/pull/1125) 验证；上述 #868 公共频道证据不证明私聊。绑定步骤见[外部身份](/docs/channel-sidebar/external-identities)。\n'
        : '\nThe current-source Slack DM path was qualified separately in [#1125](https://github.com/BotHarness/BotHarness/pull/1125); the #868 public-channel evidence above does not prove DMs. See [External identities](/docs/channel-sidebar/external-identities) for binding.\n')
    );
  return body;
};

if (!requested) rmSync('content/docs', { recursive: true, force: true });
for (const page of pages) {
  for (const lang of ['zh', 'en']) {
    const variant = page[lang];
    const prepared = prepare(
      readFileSync(join(page.siteSource ? process.cwd() : ROOT, variant.source), 'utf8'),
      variant.source,
    );
    const { meta } = prepared;
    const body = editorialBody(prepared.body, page.slug, lang);
    const head = {
      title: variant.title ?? meta.title,
      description: variant.description ?? meta.description ?? '',
      order: page.order ?? meta.order ?? 99,
      ...(page.parent ? { parent: page.parent } : {}),
      source: page.siteSource
        ? `https://github.com/BotHarness/deepseekbot-site/blob/main/${variant.source}`
        : variant.source,
      ...(!page.siteSource ? { sourceRevision: revision } : {}),
    };
    const file = join('content/docs', lang, `${page.slug}.md`);
    mkdirSync(dirname(file), { recursive: true });
    const notice = page.currentSource
      ? lang === 'zh'
        ? '> **版本范围：当前源码教程。** 下列步骤包含尚未进入 npm v1.1.0 的界面更新；文中的旧测试包版本和截图属于历史验证记录。正式版与可选组件的区别见[接入与可选能力](/docs/capabilities)。\n\n'
        : '> **Version scope: current-source guide.** These steps include UI updates absent from npm v1.1.0; older test packages and screenshots are historical verification records. See [Connections and optional tools](/docs/capabilities) for release and component boundaries.\n\n'
      : '';
    writeFileSync(file, `---\n${JSON.stringify(head, null, 2)}\n---\n\n${notice}${body}`);
    if (!page.siteSource) {
      for (const match of body.matchAll(
        /\/guides\/[^\s"')<>]+\.(?:webp|png|jpe?g|gif|svg|mp4|webm|vtt)(?=[\s"')<>]|$)/g,
      ))
        media.add(match[0]);
    }
  }
}
if (!requested) {
  rmSync('public/guides', { recursive: true, force: true });
  cpSync(resolve(ROOT, 'apps/docs/public/guides'), 'public/guides', { recursive: true });
} else {
  for (const path of media) {
    const target = join('public', path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(ROOT, 'apps/docs/public', path), target);
  }
}
console.log(`synced ${pages.length} guides × 2 languages from ${ROOT} at ${revision}`);
