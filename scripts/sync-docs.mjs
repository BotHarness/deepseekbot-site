// Copies the DeepSeekBot user guides from a BotHarness checkout into content/docs/{zh,en}
// and their screenshots into public/guides. Run after the guides change upstream:
//   BOTHARNESS=../BotHarness pnpm docs:sync
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
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
const installIdentityPath = join(ROOT, 'scripts/install-release.json');
const installVersion = existsSync(installIdentityPath)
  ? JSON.parse(readFileSync(installIdentityPath, 'utf8')).version
  : undefined;
const reviewedInstallVersion =
  typeof installVersion === 'string' &&
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(installVersion)
    ? installVersion
    : undefined;
const media = new Set();
const siteMedia = new Map();
// A site-owned asset directory also owns its transcripts, manifests and caption
// sidecars. Keep those together when a full sync replaces upstream guides.
const preserveSiteDirectory = (path) => {
  for (const entry of readdirSync(join('public', path), { withFileTypes: true })) {
    const child = posix.join(path, entry.name);
    if (entry.isDirectory()) preserveSiteDirectory(child);
    else if (entry.isFile()) siteMedia.set(child, readFileSync(join('public', child)));
  }
};
const preservedDirectories = new Set();
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
  if (slug === 'installation') {
    // 1.4.0/1.4.1 install-identity sync retains historical screenshot records upstream.
    // Correct only reviewed releases; future guides must be reviewed again.
    if (reviewedInstallVersion === '1.4.0' || reviewedInstallVersion === '1.4.1') {
      body = body
        .replace(
          lang === 'zh'
            ? /^本页安装公共 npm (?:包|正式包).*$/m
            : /^(?:This guide installs the public npm package|Install the stable npm package).*$/m,
          lang === 'zh'
            ? `本页安装公共 npm 正式包 **\`deepseekbot@${reviewedInstallVersion}\`**。推荐 **DSH \`0.2.1-rc.2\`**；同一组发布包已在 **0.2.0-rc.2 与 0.2.1-rc.2** 验证安装、Host 启动、Bot／DM 创建和重启持久化。声明安装范围为 \`>=0.2.0-rc.2 <0.3.0-0\`，不代表所有版本均已运行验证。下方 DSH 0.2.0-rc.1 截图属于历史界面记录；请按当前文字步骤操作。升级前备份 Profile，回退旧版可能需要恢复升级前备份。`
            : `Install the stable npm package **\`deepseekbot@${reviewedInstallVersion}\`**. Use **DSH \`0.2.1-rc.2\`**; the same released packages passed installation, Host startup, Bot/DM creation and restart persistence on **0.2.0-rc.2 and 0.2.1-rc.2**. Declared admission is \`>=0.2.0-rc.2 <0.3.0-0\`, not runtime qualification of every version. The DSH 0.2.0-rc.1 screenshots below are historical UI records; follow the current text. Back up the Profile before upgrading; returning to an older binary may require the pre-upgrade backup.`,
        )
        .replace(
          /^## 4\. [\s\S]*?(?=\n## 5\.)/m,
          lang === 'zh'
            ? '## 4. 跟随 Home 引导开始\n\n进入 **Bot 模式**，在 Home 配置模型，向托布发送可编辑的创建请求。跟随引导实际创建 Bot 与群聊，管理操作仍需原有审批；再学习拖动面板标题、调整大小，以及通过控制列开关面板。最后点击 **Home 标题**关闭 Home，进入原来的托布私聊。\n\n新 Bot 不再自动生成欢迎消息；你可以直接向它发送问候，收到真实回复后再确认模型可用。模型凭据仍由 DSH 管理，npm 安装不会提供凭据。模型配置见 [API 与 Bot 模型](/docs/model-setup/)，新界面介绍见 [1.4.0 更新](/blog/deepseekbot-1-4-0/)。\n'
            : '## 4. Start with Home onboarding\n\nOpen **Bot mode**, configure a model in Home and send Tob an editable creation request. Follow the journey to create a real Bot and group, with existing management approvals, then learn to drag panel titles, resize panels and reopen them from the control rail. Finish by clicking the **Home title** to close Home and enter the original Tob DM.\n\nNew Bots no longer receive an automatic welcome message. Send your own greeting and check a real reply to verify model usability. DSH still manages credentials; npm installation does not provide them. See [API and Bot models](/en/docs/model-setup/) and the [1.4.0 introduction](/en/blog/deepseekbot-1-4-0/).\n',
        )
        .replace(
          lang === 'zh'
            ? /(?:安装 DSH 0\.2\.0-rc\.2 后再装；随包的 Computer 运行时只匹配这个版本。|请使用已验证的 DSH 0\.2\.0-rc\.2 或 0\.2\.1-rc\.2，并确认安装的是 deepseekbot@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?。)/
            : /(?:Install DSH 0\.2\.0-rc\.2 and install again; the bundled Computer runtime only matches that release\.|Use qualified DSH 0\.2\.0-rc\.2 or 0\.2\.1-rc\.2 and confirm the exact deepseekbot@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)? package\.)/,
          lang === 'zh'
            ? `请使用已验证的 DSH 0.2.0-rc.2 或 0.2.1-rc.2，并确认安装的是 deepseekbot@${reviewedInstallVersion}。`
            : `Use qualified DSH 0.2.0-rc.2 or 0.2.1-rc.2 and confirm the exact deepseekbot@${reviewedInstallVersion} package.`,
        );
    }
    return body.replace(
      lang === 'zh'
        ? /^首次安装没有已连接的 IM 账号。.*$/m
        : /^The initial installation has no IM accounts connected\..*$/m,
      lang === 'zh'
        ? '首次安装没有已连接的 IM 账号。先确认本地 DM 正常，再按[接入与可选能力](/docs/capabilities)选择平台、核对版本并绑定应用。当前源码通过私聊侧栏「外部身份」绑定；新会话可自动接收或先询问，不要求逐群在 Profile 中手工授权。'
        : 'The initial installation has no connected IM accounts. After a local DM works, use [Connections and optional tools](/docs/capabilities) to choose a platform, check your version and bind an app. Current source binds in the DM sidebar’s External identities; new conversations can be automatic or ask first, without per-group Profile authorization.',
    );
  }
  if (slug === 'lark-connection')
    return body
      .replace(
        lang === 'zh'
          ? /^\*\*公开 npm 产品尚未发布。\*\*.*$/m
          : /^\*\*The public npm product has not been published\.\*\*.*$/m,
        lang === 'zh'
          ? '**历史验证记录（#823）：** 以下测试包用于当时的源码预览，不是今天的 npm 安装命令。正式版现已发布至 deepseekbot v1.4.1；安装与各能力的版本范围见[接入与可选能力](/docs/capabilities)。已有 #823 验证产物只用于复现对应历史记录。'
          : '**Historical qualification (#823):** the test packages below belonged to that source preview and are not today’s npm installation commands. The public product is now at deepseekbot v1.4.1; see [Connections and optional tools](/docs/capabilities) for current release and capability scope. Existing #823 artifacts reproduce that historical record only.',
      )
      .replace('<summary>当前源码预览：', '<summary>历史源码预览：')
      .replace('<summary>Current source preview:', '<summary>Historical source preview:');
  if (slug === 'slack-connection')
    return (
      body
        .replace(
          '**本指南对应已验证的源码预览，不代表 npm 产品已经发布。**',
          '**历史验证记录（#868；正式版现已发布至 deepseekbot v1.4.1）：**',
        )
        .replace(
          '**This guide documents the qualified source preview, not a published npm release.**',
          '**Historical qualification (#868; the public product is now at deepseekbot v1.4.1):**',
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
    const notice =
      page.slug === 'installation' && reviewedInstallVersion
        ? lang === 'zh'
          ? `> **版本范围：正式版 ${reviewedInstallVersion}。** 安装版本与双语更新日志已同步；历史截图不代表本版界面。\n\n`
          : `> **Version scope: stable ${reviewedInstallVersion}.** Installation identity and bilingual release notes are synchronized; historical screenshots do not show the current UI.\n\n`
        : page.currentSource
          ? lang === 'zh'
            ? '> **版本范围：当前源码教程。** 本页同步自当前源码（正式版现已发布至 deepseekbot v1.4.1）；文中的旧测试包版本和 DSH 0.2.0-rc.1 截图属于历史验证记录。正式版与各能力的版本范围见[接入与可选能力](/docs/capabilities)。\n\n'
            : '> **Version scope: current-source guide.** Synced from current source (the public release is now deepseekbot v1.4.1); older test package versions and DSH 0.2.0-rc.1 screenshots are historical verification records. See [Connections and optional tools](/docs/capabilities) for release and capability scope.\n\n'
          : '';
    writeFileSync(file, `---\n${JSON.stringify(head, null, 2)}\n---\n\n${notice}${body}`);
    for (const match of body.matchAll(
      /\/guides\/[^\s"')<>]+\.(?:webp|png|jpe?g|gif|svg|mp4|webm|vtt|srt|md|json|typescript|timing)(?=[\s"')<>]|$)/g,
    )) {
      if (!page.siteSource) media.add(match[0]);
      else {
        const source = join('public', match[0]);
        if (existsSync(source)) siteMedia.set(match[0], readFileSync(source));
        const directory = posix.dirname(match[0]);
        if (directory !== '/guides' && !preservedDirectories.has(directory)) {
          if (existsSync(join('public', directory))) preserveSiteDirectory(directory);
          preservedDirectories.add(directory);
        }
      }
    }
  }
}
if (!requested) {
  if (existsSync('public/guides/plugins') && !preservedDirectories.has('/guides/plugins')) {
    preserveSiteDirectory('/guides/plugins');
    preservedDirectories.add('/guides/plugins');
  }
  rmSync('public/guides', { recursive: true, force: true });
  cpSync(resolve(ROOT, 'apps/docs/public/guides'), 'public/guides', { recursive: true });
} else {
  for (const path of media) {
    const target = join('public', path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(ROOT, 'apps/docs/public', path), target);
  }
}
for (const [path, bytes] of siteMedia) {
  const target = join('public', path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
}
console.log(`synced ${pages.length} guides × 2 languages from ${ROOT} at ${revision}`);
