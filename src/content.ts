import { EN_AVATAR_LABELS, ZH_AVATAR_LABELS, type AvatarLabels } from './avatar-labels';
import type { PixelSymbol } from '@botharness/pixel-avatar';

export type Lang = 'zh' | 'en';

export const VERSION = '1.0.1';
export const DSH_VERSION = '0.2.0-rc.1';

export const LINKS = {
  github: 'https://github.com/BotHarness/BotHarness',
  docs: 'https://botharness.ai',
  npm: 'https://www.npmjs.com/package/deepseekbot',
  botpixel: 'https://github.com/BotHarness/BotPixel',
  dsh: 'https://github.com/deepseek-ai/deepseek-harness',
  changelog: 'https://github.com/BotHarness/BotHarness/blob/main/CHANGELOG.md',
  issues: 'https://github.com/BotHarness/BotHarness/issues',
  discord: 'https://discord.gg/aEB2Ayhu7B',
  lark: 'https://github.com/BotHarness/BotHarness/blob/main/docs/lark-connection.md',
  slack: 'https://github.com/BotHarness/BotHarness/blob/main/docs/slack-connection.md',
} as const;

/** What to type into the desktop app's "Add plugin" field. */
export const DESKTOP_PACKAGE = 'deepseekbot';

/** Public R2 bucket for large media, served on its own domain. */
export const MEDIA_BASE = 'https://media.botharness.ai';

export const QQ_GROUP = '1125565676';

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
    qq: { title: string; body: string };
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
    lead: 'DeepSeekBot 是 BotHarness 的首个产品，以一个 npm 包装进 DeepSeek Harness（DSH）：Bot 名册、私聊与 Group、看得见的 Git Memory、任务委派，以及 Bot 自己的 IM 身份。',
    ctaInstall: '开始安装',
    ctaGithub: '在 GitHub 查看',
    crewLabel: '一组正在工作的 PersonaBots，头像会变成它们正在使用的工具',
    chips: [
      'GrokBot 的开源平替',
      '基于 DeepSeek Harness',
      '兼容其他 DSH 插件',
      '连接飞书 / Slack / Discord / 微信',
      'MIT 开源',
    ],
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
    lead: '以下都是已经交付的能力。安装后账号默认不连接，由你逐个开启。',
    items: [
      {
        icon: 'present',
        title: '持久身份',
        body: '创建负责研究、设计或实现的 PersonaBots。每个 Bot 有自己的名字、人格（PERSONA.md）和头像，跨对话、Session 与 Workspace 延续。',
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
        title: 'Assignments 委派',
        body: '授予 Workspace 后，Bot 可以委派独立的 Assignment，各自保留 Session 与报告；需要你回答或批准时，侧栏会显示待办数。',
      },
      {
        icon: 'web',
        title: '自己的 IM 身份',
        body: '在飞书 / Lark、Slack、Discord 和微信里绑定 Bot 自己的身份，被 @ 时在原话题里回复。只有你授权过的群和频道才会进入 Bot 的 Inbox。',
      },
      {
        icon: 'bash',
        title: 'Computer 与 Browser use',
        body: 'Bot 可以操作共享桌面（需要 Docker）或受管浏览器，你能实时观看，也能暂停它的浏览器操作。按 Bot 单独开启，默认每个 Session 第一次操作前先请你授权。',
        tag: '源码版可选',
      },
    ],
  },
  video: {
    kicker: '宣传片',
    title: '三分钟看懂 DeepSeekBot',
    lead: '一座像素小镇里，一群有名字、有记忆的 Bot 各忙各的，也会一起做事。',
    src: `${MEDIA_BASE}/pv/botharness-town-v12-zh.mp4`,
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
    lead: '每个 Bot 的默认头像都由名字生成：同一个名字，在哪里都是同一张脸。Bot 工作时，头像会一颗像素一颗像素地变成它正在用的工具。',
    nameLabel: 'Bot 名字',
    namePlaceholder: '比如 Mira',
    toolsLabel: '让它用一个工具',
    face: '变回脸',
    shuffle: '随机名字',
    download: '下载高清头像',
    editor: {
      title: '捏脸',
      lead: '从名字生成的脸开始，逐个换发型、五官、服装和颜色，捏好直接下载。',
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
    copy: '复制',
    copied: '已复制',
    after:
      '打开后进入 Bot mode，创建 PersonaBot，先私聊，再建 Group 邀请成员。要接入飞书、Slack、Discord 或微信，到「设置 → IM bots」连接应用，再在 Bot 的 Profile 里绑定身份、授权群组。',
    note: '想先试试又不想动现有配置，可以换一个新的 Profile 名字。',
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
    qq: { title: 'QQ 群', body: '群号' },
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
    lead: 'DeepSeekBot is the first BotHarness product, installed into DeepSeek Harness (DSH) as one npm package: a Bot roster, DMs and Groups, Git Memory you can see, delegation, and IM identities of the Bots’ own.',
    ctaInstall: 'Install',
    ctaGithub: 'View on GitHub',
    crewLabel: 'A crew of working PersonaBots whose avatars turn into the tool each one is using',
    chips: [
      'Open-source Grok Bot alternative',
      'Built on DeepSeek Harness',
      'Works with other DSH plugins',
      'Lark, Slack, Discord and WeChat',
      'MIT licensed',
    ],
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
    lead: 'Everything below has shipped. Accounts start disconnected after install; you turn each one on.',
    items: [
      {
        icon: 'present',
        title: 'Lasting identity',
        body: 'Create PersonaBots for research, design or engineering. Each keeps its own name, persona (PERSONA.md) and avatar across chats, Sessions and Workspaces.',
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
        title: 'Assignments',
        body: 'Grant a Workspace and a Bot can delegate independent Assignments, each with its own Session and report. When one needs your answer or approval, the sidebar counts it.',
      },
      {
        icon: 'web',
        title: 'Their own IM identity',
        body: 'Bind a Bot to its own identity in Lark / Feishu, Slack, Discord and WeChat, and it replies in the original thread when mentioned. Only groups and channels you authorize reach its Inbox.',
      },
      {
        icon: 'bash',
        title: 'Computer and Browser use',
        body: 'Bots can drive a shared desktop (needs Docker) or a managed browser. You can watch live and pause its browsing. Enabled per Bot, and by default each Session asks you before its first action.',
        tag: 'Source build, optional',
      },
    ],
  },
  video: {
    kicker: 'Video',
    title: 'DeepSeekBot in three minutes',
    lead: 'A pixel town of Bots with names and memories, each busy with its own work, and working together.',
    src: `${MEDIA_BASE}/pv/botharness-town-v12-en.mp4`,
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
    lead: 'Every Bot’s default avatar is generated from its name: the same name gives the same face everywhere. While a Bot works, its avatar turns into the tool it is using, pixel by pixel.',
    nameLabel: 'Bot name',
    namePlaceholder: 'e.g. Mira',
    toolsLabel: 'Hand it a tool',
    face: 'Back to face',
    shuffle: 'Random name',
    download: 'Download HD avatar',
    editor: {
      title: 'Make your own',
      lead: 'Start from the face your name gives, swap hair, features, outfit and colors, then download it.',
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
    copy: 'Copy',
    copied: 'Copied',
    after:
      'Open Bot mode, create a PersonaBot, DM it, then start a Group and invite members. To use Lark, Slack, Discord or WeChat, connect the app in Settings → IM bots, then bind the identity and authorize a group in the Bot’s Profile.',
    note: 'To try it without touching your current setup, use a new Profile name.',
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
    qq: { title: 'QQ group', body: 'Group number' },
  },
  footer: {
    built: 'Built with React, Astryx and BotPixel. Hosted on Cloudflare.',
    license: 'Open source under the MIT license.',
    community: 'QQ community group 1125565676',
    privacy: 'Privacy',
  },
};

export const COPY: Record<Lang, Copy> = { zh, en };
