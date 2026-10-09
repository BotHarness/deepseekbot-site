import { EN_AVATAR_LABELS, ZH_AVATAR_LABELS, type AvatarLabels } from './avatar-labels';
import type { PixelSymbol } from '@botharness/pixel-avatar';
import { COMMUNITY_LINKS } from './communityLinks';
export { QQ_GROUP } from './communityLinks';

export type Lang = 'zh' | 'en';

export const VERSION = '1.1.0';
export const DSH_VERSION = '0.2.0-rc.1';

export const LINKS = {
  github: COMMUNITY_LINKS.github,
  docs: 'https://botharness.ai',
  npm: 'https://www.npmjs.com/package/deepseekbot',
  botpixel: 'https://github.com/BotHarness/BotPixel',
  dsh: 'https://github.com/deepseek-ai/deepseek-harness',
  issues: 'https://github.com/BotHarness/BotHarness/issues',
  discord: COMMUNITY_LINKS.discord,
  lark: 'https://github.com/BotHarness/BotHarness/blob/main/docs/lark-connection.md',
  slack: 'https://github.com/BotHarness/BotHarness/blob/main/docs/slack-connection.md',
} as const;

/** What to type into the desktop app's "Add plugin" field. */
export const DESKTOP_PACKAGE = 'deepseekbot';

/** Public R2 bucket for large media, served on its own domain. */
export const MEDIA_BASE = 'https://media.botharness.ai';

export const INSTALL_STEPS = [
  `npm i -g @deepseek-ai/dsh@${DSH_VERSION}`,
  'dsh plugin --profile web add deepseekbot',
  'dsh web',
] as const;

/** The names in the hero crew; each one is a name-seeded BotPixel face. */
export const CREW = ['Mira', 'Theo', 'Nova', 'DeepSeekBot', 'Juno', 'Kai', 'Lumi'] as const;

export const SYMBOL_ORDER: readonly PixelSymbol[] = [
  'thinking',
  'read',
  'write',
  'edit',
  'bash',
  'search',
  'web',
  'fetch',
  'todo',
  'subagent',
  'workflow',
  'goal',
  'present',
  'approval',
  'ask',
  'other',
];

type SymbolLabels = Record<PixelSymbol, string>;

interface Feature {
  icon: PixelSymbol;
  title: string;
  body: string;
  tag?: string;
  guide?: { slug: string; label: string };
}

export interface Copy {
  htmlLang: string;
  /** Matches the <title> of this language's entry page. */
  pageTitle: string;
  nav: {
    features: string;
    avatar: string;
    install: string;
    market: string;
    docs: string;
    changelog: string;
    community: string;
    github: string;
  };
  langLabel: string;
  modeLabel: string;
  modeLight: string;
  modeDark: string;
  hero: {
    badge: string;
    title: string;
    tagline: string;
    lead: string;
    ctaInstall: string;
    ctaGithub: string;
    crewLabel: string;
    signpost: string;
    signpostLabel: string;
    chips: string[];
  };
  symbols: SymbolLabels;
  features: { kicker: string; title: string; lead: string; items: Feature[] };
  dsh: { title: string; body: string; issues: string };
  community: {
    kicker: string;
    title: string;
    lead: string;
    discord: { title: string; body: string; cta: string };
    github: { title: string; body: string; cta: string };
    qq: { title: string; body: string; cta: string; copyFailed: string };
  };
  video: {
    kicker: string;
    title: string;
    lead: string;
    src: string;
    poster: string;
    label: string;
    play: string;
  };
  market: {
    pageTitle: string;
    kicker: string;
    title: string;
    lead: string;
    searchLabel: string;
    searchPlaceholder: string;
    relevance: string;
    sortLabel: string;
    sortUpdated: string;
    sortStars: string;
    topicsLabel: string;
    topicsAll: string;
    loading: string;
    loadMore: string;
    loadingMore: string;
    retry: string;
    unavailable: string;
    empty: string;
    emptySearch: string;
    author: { title: string; body: string; docs: string };
    open: string;
    back: string;
    github: string;
    stars: string;
    updated: string;
    notFound: string;
    readmeLoading: string;
    noReadme: string;
    gitUrl: string;
    installTitle: string;
    installSteps: string[];
    risk: string;
    commit: string;
    getApp: string;
  };
  playground: {
    kicker: string;
    title: string;
    lead: string;
    nameLabel: string;
    namePlaceholder: string;
    toolsLabel: string;
    face: string;
    shuffle: string;
    download: string;
    editor: { title: string; lead: string; parts: string; reset: string; shuffle: string };
    caption: string;
    botpixel: { ask: string; link: string; tip: string };
  };
  avatarLabels: AvatarLabels;
  install: {
    kicker: string;
    title: string;
    tabsLabel: string;
    desktopTab: string;
    devTab: string;
    desktop: {
      lead: string;
      download: string;
      steps: string[];
      docs: string;
      docsUrl: string;
      downloadUrl: string;
    };
    lead: string;
    steps: string[];
    next: { title: string; button: string; overview: string };
    copy: string;
    copied: string;
    after: string;
    note: string;
  };
  footer: {
    built: string;
    license: string;
    community: string;
    privacy: string;
  };
}

const zh: Copy = {
  htmlLang: 'zh-Hans',
  pageTitle: 'DeepSeekBot：开源的 GrokBot 平替，基于 DeepSeek Harness',
  nav: {
    features: '能力',
    avatar: '像素头像',
    install: '安装',
    market: 'Bot 市场',
    docs: '文档',
    changelog: '更新日志',
    community: '社区',
    github: 'GitHub',
  },
  langLabel: '语言',
  modeLabel: '昼夜',
  modeLight: '白天',
  modeDark: '夜晚',
  hero: {
    badge: `v${VERSION} 正式版`,
    title: 'DeepSeekBot',
    tagline: '一组有各自身份、人格和记忆的 bots，一起做事。',
    lead: 'DeepSeekBot 是 BotHarness 的首个产品，以一个 npm 包装进 DeepSeek Harness（DSH）：Bot 名册、私聊与 Group、看得见的 Git Memory、跨文件夹工作与定时任务，以及 Bot 自己的 IM 身份。',
    ctaInstall: '开始安装',
    ctaGithub: '在 GitHub 查看',
    crewLabel: '一组正在工作的 PersonaBots，头像会变成它们正在使用的工具',
    signpost: 'Bot 市场',
    signpostLabel: '去 Bot 市场找别人分享的 Bot',
    chips: ['GrokBot 开源平替', '基于 DeepSeek Harness', 'MIT 开源'],
  },
  symbols: {
    thinking: '思考',
    ask: '提问',
    read: '读文件',
    write: '写文件',
    edit: '编辑',
    bash: '终端',
    search: '搜索',
    web: '网页搜索',
    fetch: '抓取网页',
    todo: '待办',
    subagent: '子 agent',
    workflow: '工作流',
    goal: '目标',
    present: '展示',
    approval: '等你批准',
    other: '其他工具',
  },
  features: {
    kicker: '能力',
    title: '每个 Bot 都是一位同事',
    lead: '核心能力随 v1.1.0 提供。下方另有最新源码的接入流程与可选组件；外部账号和操作权限由你开启。',
    items: [
      {
        icon: 'present',
        title: '持久身份',
        body: '创建负责研究、设计或实现的 PersonaBots。每个 Bot 有自己的名字和头像：SOUL.md 保存人格、表达方式与工作原则，MEMORY.md 保存核心记忆，跨对话和文件夹延续。',
      },
      {
        icon: 'read',
        title: '看得见的 Git Memory',
        body: 'Bot 的记忆是一个普通 Git 工作树。在侧栏浏览记忆文件、分支、commit 历史与 diff，也能推到 GitHub，在多台机器之间共享同一份记忆。',
      },
      {
        icon: 'subagent',
        title: 'Group 协作',
        body: '把不同的 bots 带进 Group，消息保留各自身份，需要谁就 @ 谁。每个成员可以选择每条提醒、摘要、仅提及或静默。',
      },
      {
        icon: 'workflow',
        title: '跨文件夹工作',
        body: '授权文件夹后，同一个 Bot 可以在多个文件夹中开展工作。每项工作保留独立会话和进展；需要你回答或批准时，侧栏会提醒你。',
      },
      {
        icon: 'todo',
        title: '定时任务',
        body: '设置计划，或让 Bot 帮你管理。查看每次触发及处理记录，随时暂停，也可锁定以防 Bot 修改。应用运行时按计划执行。',
      },
      {
        icon: 'web',
        title: '自己的 IM 身份',
        body: '连接飞书 / Lark、Slack、Discord 或个人微信。微信仅接收扫码者私聊；其他平台按各自会话规则收件、回复。最新源码：设置连接应用 → 私聊侧栏「外部身份」绑定 → 发消息测试；新会话可自动接收或先询问。',
        tag: '接入流程：最新源码',
        guide: { slug: 'capabilities', label: '平台范围与绑定步骤' },
      },
      {
        icon: 'bash',
        title: 'Computer 与 Browser use',
        body: '可用 macOS 本机电脑、授权的日常 Chrome 页面 / Profile、本机或 Docker 受管浏览器，以及 Docker Bot Computer。浏览器只读分享不能点击或导航，各模式权限不同。需从源码安装可选组件，npm 主包尚未包含。',
        tag: '可选组件',
        guide: { slug: 'capabilities', label: '选择操作目标与配置' },
      },
    ],
  },
  video: {
    kicker: '宣传片',
    title: '三分钟看懂 DeepSeekBot',
    lead: '一座像素小镇里，一群有名字、有记忆的 Bot 各忙各的，也会一起做事。',
    src: `${MEDIA_BASE}/pv/botharness-town-v19-1080p-lite-zh.mp4`,
    poster: '/pv-poster-zh-v1.png',
    label: 'DeepSeekBot 宣传片（中文）',
    play: '播放宣传片',
  },
  market: {
    pageTitle: 'Bot 市场 · DeepSeekBot',
    kicker: 'Bot 市场',
    title: '找一个现成的 Bot',
    lead: '这里收录了大家放在公开 GitHub 仓库里的 Bot。在 DeepSeekBot 里安装后，它会成为一个新的 PersonaBot，带着作者写好的 Memory。',
    searchLabel: '搜索 Bot',
    searchPlaceholder: '搜索名称、描述、话题或 README',
    relevance: '搜索结果按相关度排序，最多显示前 200 个。',
    sortLabel: '排序',
    sortUpdated: '最近更新',
    sortStars: '最多 Star',
    topicsLabel: '按话题筛选',
    topicsAll: '全部',
    loading: '正在加载 Bot 市场…',
    loadMore: '加载更多',
    loadingMore: '加载中…',
    retry: '重试',
    unavailable: 'Bot 市场暂时无法访问，请稍后重试。',
    empty: '还没有收录的 Bot。',
    emptySearch: '没有符合条件的 Bot。换个关键词或话题试试。',
    author: {
      title: '想让你的 Bot 出现在这里？',
      body: '把 Bot 的 Memory 发布成公开 GitHub 仓库并加上 botharness-bot 话题，每天会自动收录；也可以在 DeepSeekBot 的「Bot 市场」里贴入仓库地址，立即收录。',
      docs: '分享 Bot 教程：发布前检查、一键复制给 Bot 的提示词、名称和头像设置',
    },
    open: '查看 {name} 详情',
    back: '← 返回 Bot 市场',
    github: '在 GitHub 查看',
    stars: '★ {count}',
    updated: '更新于 {date}',
    notFound: '这个 Bot 已不在市场中。',
    readmeLoading: '正在加载 README…',
    noReadme: '这个仓库没有 README。',
    gitUrl: 'Git 仓库地址',
    installTitle: '在 DeepSeekBot 里安装',
    installSteps: [
      '打开 DeepSeekBot，点侧栏消息列表上方的「＋」，选「Bot 市场」，搜索这个 Bot，点「安装」。',
      '也可以在「＋」里选「创建 PersonaBot」，记忆来源选「从 Git 仓库导入」，粘贴上面的地址。',
    ],
    risk: '这是第三方仓库：它的文件会成为新 Bot 的 Memory，可能包含有害内容或会被 Bot 执行的指令。请只安装你信任的仓库。',
    commit: '最新提交 {sha} · {date}',
    getApp: '还没装 DeepSeekBot？',
  },
  playground: {
    kicker: 'BotPixel',
    title: '输入名字，得到一张脸',
    lead: '每个 Bot 的默认头像都由名字生成，同一个名字总是生成同一张脸。Bot 工作时，头像会一颗像素一颗像素地变成它正在用的工具。',
    nameLabel: 'Bot 名字',
    namePlaceholder: '比如 Mira',
    toolsLabel: '让它用一个工具',
    face: '变回脸',
    shuffle: '随机名字',
    download: '下载高清头像',
    editor: {
      title: '捏脸',
      lead: '从名字生成的脸开始，逐个换物种、发型、五官、服装、头饰和颜色，也能自己画头饰、头发和其他部件，捏好直接下载。',
      parts: '部位',
      reset: '回到名字生成的脸',
      shuffle: '随机捏一个',
    },
    caption: '头像来自开源的 @botharness/pixel-avatar，变形来自 @botharness/pixel-morph。',
    botpixel: {
      ask: '想在自己的项目里用像素头像？',
      link: 'BotPixel 开源在 GitHub',
      tip: '同一个名字生成同一张脸，还能变成工具图标。npm i @botharness/pixel-avatar',
    },
  },
  avatarLabels: ZH_AVATAR_LABELS,
  install: {
    kicker: '安装',
    title: '装进 DeepSeek Harness',
    tabsLabel: '安装方式',
    desktopTab: '桌面端',
    devTab: '开发者（命令行）',
    desktop: {
      lead: `一句话：打开 DeepSeek Harness 桌面端，点「插件 → 添加插件」，在「包名或地址」里输入 ${DESKTOP_PACKAGE}，点「安装」。`,
      download: '还没装 DeepSeek Harness？先下载桌面端',
      steps: [
        '打开 DeepSeek Harness 桌面端，点左侧「插件」，再点「添加插件」',
        '在「包名或地址」里输入下面这一行，保持「npm 官方源」，点「安装」',
        '显示「已安装」后点「立即启用」；如果提示重启，重启当前 Profile',
        '侧栏出现「Bot 模式」，创建你的第一个 PersonaBot',
      ],
      docs: 'DSH 官方文档：打包与安装插件',
      docsUrl: 'https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish',
      downloadUrl: 'https://www.deepseek.com/harness/',
    },
    lead: `需要 Node 22 以上。DeepSeekBot 当前支持 DSH ${DSH_VERSION} 起的 0.2 系列。`,
    steps: ['安装 DeepSeek Harness', '把 DeepSeekBot 装进 web Profile', '启动并打开 Bot mode'],
    next: {
      title: '装好了？选择接入方式与可选能力',
      button: '查看接入与配置',
      overview: '使用文档总览',
    },
    copy: '复制',
    copied: '已复制',
    after:
      '打开后进入 Bot mode，创建 PersonaBot，先私聊，再建 Group 邀请成员。接入指南区分 v1.1.0 与最新源码流程；在新版中，从私聊侧栏「外部身份」绑定已连接的应用。',
    note: '此入口安装 npm 正式版 v1.1.0，不包含可选 Computer / Browser 组件。想独立试用，可换一个新的 Profile 名字。',
  },
  dsh: {
    title: '站在 DeepSeek Harness 上',
    body: 'DeepSeekBot 直接用 DSH 自己的 Session 管理和 Harness：你在 DSH 里接入的任何 LLM 模型 provider，Bot 都能用；也可以和其他 DSH 插件装在一起。个别插件可能还不兼容，遇到了欢迎提 Issue 或 PR。',
    issues: '去 GitHub 提 Issue',
  },
  community: {
    kicker: '社区',
    title: '一起来聊',
    lead: '问题、想法，还有你做出来的 Bot，都欢迎带来。',
    discord: {
      title: 'Discord',
      body: '加入 DeepSeekBot 的 Discord 服务器。',
      cta: '加入 Discord',
    },
    github: {
      title: 'GitHub',
      body: '查看源码，报告问题，或一起改进 DeepSeekBot。',
      cta: '在 GitHub 查看',
    },
    qq: {
      title: 'QQ 群',
      body: '群号',
      cta: '复制 QQ 群号',
      copyFailed: '复制失败，请长按或选中上方群号手动复制。',
    },
  },
  footer: {
    built: '用 React、Astryx 和 BotPixel 搭建，部署在 Cloudflare。',
    license: '开源，MIT 许可。',
    community: 'QQ 社区群 1125565676',
    privacy: '隐私说明',
  },
};

const en: Copy = {
  htmlLang: 'en',
  pageTitle: 'DeepSeekBot: the open-source Grok Bot alternative for DeepSeek Harness',
  nav: {
    features: 'Features',
    avatar: 'Avatars',
    install: 'Install',
    market: 'Marketplace',
    docs: 'Docs',
    changelog: 'Changelog',
    community: 'Community',
    github: 'GitHub',
  },
  langLabel: 'Language',
  modeLabel: 'Day or night',
  modeLight: 'Day',
  modeDark: 'Night',
  hero: {
    badge: `v${VERSION} is out`,
    title: 'DeepSeekBot',
    tagline: 'A crew of bots, each with its own identity, persona and memory, working together.',
    lead: 'DeepSeekBot is the first BotHarness product, installed into DeepSeek Harness (DSH) as one npm package: a Bot roster, DMs and Groups, Git Memory you can see, work across folders, scheduled tasks, and IM identities of the Bots’ own.',
    ctaInstall: 'Install',
    ctaGithub: 'View on GitHub',
    crewLabel: 'A crew of working PersonaBots whose avatars turn into the tool each one is using',
    signpost: 'Marketplace',
    signpostLabel: 'Find Bots other people shared in the Bot Marketplace',
    chips: ['Open-source Grok Bot alternative', 'Built on DeepSeek Harness', 'MIT open source'],
  },
  symbols: {
    thinking: 'Thinking',
    ask: 'Asking',
    read: 'Read',
    write: 'Write',
    edit: 'Edit',
    bash: 'Shell',
    search: 'Search',
    web: 'Web search',
    fetch: 'Fetch',
    todo: 'Todo',
    subagent: 'Subagent',
    workflow: 'Workflow',
    goal: 'Goal',
    present: 'Present',
    approval: 'Needs approval',
    other: 'Other tool',
  },
  features: {
    kicker: 'Features',
    title: 'Every Bot is a colleague',
    lead: 'Core features come with v1.1.0. Current-source setup and optional components are labelled below; you enable external accounts and action permissions.',
    items: [
      {
        icon: 'present',
        title: 'Lasting identity',
        body: 'Create PersonaBots for research, design or engineering. Each has its own name and avatar: SOUL.md holds its persona, voice and working principles; MEMORY.md holds core memory that lasts across chats and folders.',
      },
      {
        icon: 'read',
        title: 'Git Memory you can see',
        body: 'A Bot’s memory is a plain Git working tree. Browse its files, branches, commits and diffs in the sidebar, or push it to GitHub to share the same memory across machines.',
      },
      {
        icon: 'subagent',
        title: 'Groups',
        body: 'Bring different Bots into a Group. Messages keep each Bot’s identity, and you @ whoever you need. Each member picks every message, digest, mentions only or silent.',
      },
      {
        icon: 'workflow',
        title: 'Work across folders',
        body: 'Authorize folders so the same Bot can work in several of them. Each job keeps its own conversation and progress; the sidebar alerts you when it needs your answer or approval.',
      },
      {
        icon: 'todo',
        title: 'Scheduled tasks',
        body: 'Set a schedule or ask your Bot to manage one. Review triggers and handling history, pause it, or lock it against Bot edits. Tasks run while the app is running.',
      },
      {
        icon: 'web',
        title: 'Their own IM identity',
        body: 'Connect Lark / Feishu, Slack, Discord or personal WeChat. WeChat accepts only the QR owner’s DMs; each platform has its own intake and reply rules. Current source: connect in Settings → bind in the DM sidebar’s External identities → send a test. New conversations can be automatic or ask first.',
        tag: 'Setup: current source',
        guide: { slug: 'capabilities', label: 'Platform scope and binding steps' },
      },
      {
        icon: 'bash',
        title: 'Computer and Browser use',
        body: 'Choose a local macOS computer, an authorized daily Chrome document / Profile, a local or Docker managed browser, or a Docker Bot Computer. Read-only sharing cannot click or navigate; tools differ by mode. Optional components require a source setup and are absent from the npm product.',
        tag: 'Optional components',
        guide: { slug: 'capabilities', label: 'Choose a target and set it up' },
      },
    ],
  },
  video: {
    kicker: 'Video',
    title: 'DeepSeekBot in three minutes',
    lead: 'A pixel town of Bots with names and memories, each busy with its own work, and working together.',
    src: `${MEDIA_BASE}/pv/botharness-town-v19-1080p-lite-en.mp4`,
    poster: '/pv-poster-en-v1.png',
    label: 'DeepSeekBot promo video (English)',
    play: 'Play the video',
  },
  market: {
    pageTitle: 'Bot Marketplace · DeepSeekBot',
    kicker: 'Marketplace',
    title: 'Find a ready-made Bot',
    lead: 'Bots that people share as public GitHub repositories. Install one in DeepSeekBot and it becomes a new PersonaBot with the Memory its author wrote.',
    searchLabel: 'Search Bots',
    searchPlaceholder: 'Search names, descriptions, topics or READMEs',
    relevance: 'Search results are ranked by relevance, top 200 only.',
    sortLabel: 'Sort',
    sortUpdated: 'Recently updated',
    sortStars: 'Most stars',
    topicsLabel: 'Filter by topic',
    topicsAll: 'All',
    loading: 'Loading the Bot Marketplace…',
    loadMore: 'Load more',
    loadingMore: 'Loading…',
    retry: 'Retry',
    unavailable: 'The Bot Marketplace is unreachable right now. Try again later.',
    empty: 'No Bots are listed yet.',
    emptySearch: 'No Bots match. Try another keyword or topic.',
    author: {
      title: 'Want your Bot listed here?',
      body: 'Put its Memory in a public GitHub repository and add the botharness-bot topic: it is picked up daily. Or paste the repository URL into the Bot Marketplace inside DeepSeekBot to list it right away.',
      docs: 'Share a Bot: checks before publishing, a prompt to paste to your Bot, name and avatar',
    },
    open: 'Open {name}',
    back: '← Back to the Marketplace',
    github: 'View on GitHub',
    stars: '★ {count}',
    updated: 'Updated {date}',
    notFound: 'This Bot is no longer in the Marketplace.',
    readmeLoading: 'Loading the README…',
    noReadme: 'This repository has no README.',
    gitUrl: 'Git repository URL',
    installTitle: 'Install it in DeepSeekBot',
    installSteps: [
      'In DeepSeekBot, click + above the message list in the sidebar, choose Bot Marketplace, search for this Bot and click Install.',
      'Or choose + → Create PersonaBot, set Memory source to Import from a Git repository and paste the URL above.',
    ],
    risk: 'This is a third-party repository: its files become the new Bot’s Memory and may contain harmful content or instructions the Bot will follow. Install only repositories you trust.',
    commit: 'Latest commit {sha} · {date}',
    getApp: 'Don’t have DeepSeekBot yet?',
  },
  playground: {
    kicker: 'BotPixel',
    title: 'Type a name, get a face',
    lead: 'Every Bot’s default avatar is generated from its name, and the same name always gives the same face. While a Bot works, its avatar turns into the tool it is using, pixel by pixel.',
    nameLabel: 'Bot name',
    namePlaceholder: 'e.g. Mira',
    toolsLabel: 'Hand it a tool',
    face: 'Back to face',
    shuffle: 'Random name',
    download: 'Download HD avatar',
    editor: {
      title: 'Make your own',
      lead: 'Start from the face your name gives, swap species, hair, features, outfit, headpiece and colors, or draw your own headpiece, hair and other parts, then download it.',
      parts: 'Parts',
      reset: 'Back to the name’s face',
      shuffle: 'Surprise me',
    },
    caption:
      'Avatars by the open-source @botharness/pixel-avatar, morphs by @botharness/pixel-morph.',
    botpixel: {
      ask: 'Want pixel avatars in your own project?',
      link: 'BotPixel is open source on GitHub',
      tip: 'The same name always gives the same face, and it morphs into tool icons. npm i @botharness/pixel-avatar',
    },
  },
  avatarLabels: EN_AVATAR_LABELS,
  install: {
    kicker: 'Install',
    title: 'Add it to DeepSeek Harness',
    tabsLabel: 'How to install',
    desktopTab: 'Desktop',
    devTab: 'Developers (CLI)',
    desktop: {
      lead: `In one line: open the DeepSeek Harness desktop app, go to Plugins → Add plugin, enter ${DESKTOP_PACKAGE} as the package name or address, and click Install.`,
      download: 'No DeepSeek Harness yet? Get the desktop app',
      steps: [
        'Open the DeepSeek Harness desktop app, click Plugins in the sidebar, then Add plugin',
        'Enter this line as the package name or address, keep the official npm registry, and click Install',
        'When it shows Installed, click Enable now; if DSH asks, restart the current Profile',
        'Bot mode appears in the sidebar: create your first PersonaBot',
      ],
      docs: 'DSH docs: package and install a plugin',
      docsUrl: 'https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/publish',
      downloadUrl: 'https://www.deepseek.com/en/harness/',
    },
    lead: `Needs Node 22 or later. DeepSeekBot supports the DSH 0.2 line from ${DSH_VERSION}.`,
    steps: [
      'Install DeepSeek Harness',
      'Add DeepSeekBot to the web Profile',
      'Start it and open Bot mode',
    ],
    next: {
      title: 'Installed? Choose connections and optional tools',
      button: 'Connections and setup',
      overview: 'All user guides',
    },
    copy: 'Copy',
    copied: 'Copied',
    after:
      'Open Bot mode, create a PersonaBot, DM it, then invite members to a Group. The setup guide separates v1.1.0 from current source; newer builds bind connected apps in the DM sidebar’s External identities.',
    note: 'This installs npm v1.1.0 without the optional Computer / Browser components. Use a new Profile name for a separate trial.',
  },
  dsh: {
    title: 'Built on DeepSeek Harness',
    body: 'DeepSeekBot runs on DSH’s own session management and harness, so any LLM provider you connect in DSH works for your Bots, and it installs alongside other DSH plugins. Some plugins may not be compatible yet; if you hit one, please open an issue or a PR.',
    issues: 'Open an issue on GitHub',
  },
  community: {
    kicker: 'Community',
    title: 'Come say hi',
    lead: 'Questions, ideas and the Bots you build are all welcome.',
    discord: {
      title: 'Discord',
      body: 'Join the DeepSeekBot Discord server.',
      cta: 'Join Discord',
    },
    github: {
      title: 'GitHub',
      body: 'Explore the source, report a problem, or help improve DeepSeekBot.',
      cta: 'View on GitHub',
    },
    qq: {
      title: 'QQ group',
      body: 'Group number',
      cta: 'Copy QQ group number',
      copyFailed: 'Copy failed. Select or long-press the number above to copy it manually.',
    },
  },
  footer: {
    built: 'Built with React, Astryx and BotPixel. Hosted on Cloudflare.',
    license: 'Open source under the MIT license.',
    community: 'QQ community group 1125565676',
    privacy: 'Privacy',
  },
};

export const COPY: Record<Lang, Copy> = { zh, en };
