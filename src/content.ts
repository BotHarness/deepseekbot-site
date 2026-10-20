import { EN_AVATAR_LABELS, ZH_AVATAR_LABELS, type AvatarLabels } from './avatar-labels';
import type { PixelSymbol } from '@botharness/pixel-avatar';
import { COMMUNITY_LINKS } from './communityLinks';
import {
  EN_DEMO,
  EN_FEATURE_DEMOS,
  ZH_DEMO,
  ZH_FEATURE_DEMOS,
  type DemoCopy,
  type FeatureDemoCopy,
} from './demoCopy';
import { QQ_GROUP } from './communityLinks';
import { VERSION, DESKTOP_PACKAGE } from './installRelease';
export { QQ_GROUP };

export type Lang = 'zh' | 'en';

export { VERSION, DESKTOP_PACKAGE };
export const DSH_VERSION = '0.2.1-rc.2';

export const LINKS = {
  github: COMMUNITY_LINKS.github,
  docs: 'https://botharness.ai',
  npm: 'https://www.npmjs.com/package/deepseekbot',
  botpixel: 'https://github.com/BotHarness/BotPixel',
  dsh: 'https://github.com/deepseek-ai/deepseek-harness',
  issues: 'https://github.com/BotHarness/DeepSeekBot/issues',
  discord: COMMUNITY_LINKS.discord,
  lark: 'https://github.com/BotHarness/DeepSeekBot/blob/main/docs/lark-connection.md',
  slack: 'https://github.com/BotHarness/DeepSeekBot/blob/main/docs/slack-connection.md',
} as const;

/** Public R2 bucket for large media, served on its own domain. */
export const MEDIA_BASE = 'https://media.botharness.ai';

export const INSTALL_STEPS = [
  `npm i -g @deepseek-ai/dsh@${DSH_VERSION}`,
  `dsh plugin --profile web add ${DESKTOP_PACKAGE}`,
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
  /** an on-page link in place of a guide, such as the community section */
  cta?: { label: string; href: string };
  /** the hands-on demo shown beside it; features without one are listed as cards */
  demo?: keyof FeatureDemoCopy;
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
    blog: string;
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
    /** the one-line install in the Hero, for people who already run DSH */
    quick: {
      label: string;
      cliTab: string;
      /** for people without DSH: where to get it first */
      noDsh: string;
      getDsh: string;
      desktopHint: string;
      cliHint: string;
    };
    qqCopied: string;
    qqFailed: string;
  };
  symbols: SymbolLabels;
  features: {
    kicker: string;
    title: string;
    lead: string;
    release: { text: string; label: string; href: string };
    items: Feature[];
  };
  faq: {
    kicker: string;
    title: string;
    items: {
      id: string;
      question: string;
      answer: string;
      links?: { label: string; href: string }[];
    }[];
  };
  demo: DemoCopy;
  featureDemos: FeatureDemoCopy;
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
  studio: {
    pageTitle: string;
    kicker: string;
    title: string;
    lead: string;
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
    generatedBio: string;
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
    /** the home page's way into the Avatar Studio, which holds the full editor */
    studio: { title: string; body: string; cta: string };
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
  pageTitle: 'DeepSeekBot（DSB）：开源的 GrokBot 平替，基于 DeepSeek Harness',
  nav: {
    features: '能力',
    avatar: '头像工坊',
    install: '安装',
    market: 'Bot 市场',
    docs: '文档',
    changelog: '更新日志',
    blog: '博客',
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
    lead: 'DeepSeekBot 是 BotHarness 开发的个人 AI 智能体协作工具，作为 deepseekbot 插件装进 DeepSeek Harness（DSH）。创建各有身份与 Git Memory 的 Bot，在群组中协作、委派任务，并连接飞书、Slack、Discord、QQ 和微信。',
    ctaInstall: '开始安装',
    ctaGithub: '在 GitHub 查看',
    crewLabel: '一组正在工作的 PersonaBots，头像会变成它们正在使用的工具',
    signpost: 'Bot 市场',
    signpostLabel: '去 Bot 市场找别人分享的 Bot',
    chips: ['GrokBot 开源平替', '基于 DeepSeek Harness', 'MIT 开源'],
    quick: {
      label: '一行安装',
      cliTab: '命令行',
      noDsh: '还没有 DSH？',
      getDsh: '先去 DeepSeek 官网下载 DeepSeek Harness',
      desktopHint: `请先使用 DSH ${DSH_VERSION}。复制这个 npm 包名，到「插件 → 添加插件」里粘贴，点「安装」。`,
      cliHint: `推荐 DSH ${DSH_VERSION}，也已验证 0.2.0-rc.2。在终端运行这一行，装好后用 dsh web 打开。`,
    },
    qqCopied: '已复制群号',
    qqFailed: `复制失败，QQ 群号是 ${QQ_GROUP}，请手动复制。`,
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
    lead: `v${VERSION} 已发布：第一次进入 Bot 模式时，托布五步带你上手；主题配色、半透明面板和壁纸库让 Bot 模式换成你喜欢的样子；/compact 和空闲压缩让长对话保持轻快，快速搜索能直达任意设置项。`,
    release: {
      text: 'Memory 可以预览图片和 Markdown，审批简化为「允许这次／始终允许／拒绝」，并修复了 Windows Desktop、活动中心和缩放的一批问题。',
      label: '查看 1.4.1 更新日志',
      href: `/changelog/#v${VERSION}`,
    },
    items: [
      {
        icon: 'present',
        demo: 'identity',
        title: '持久身份',
        body: '创建负责研究、设计或实现的 PersonaBots。每个 Bot 有自己的名字和头像：SOUL.md 保存人格、表达方式与工作原则，MEMORY.md 保存核心记忆，跨对话和文件夹延续。',
      },
      {
        icon: 'read',
        demo: 'memory',
        title: '看得见的 Git Memory',
        body: 'Bot 的记忆是一个普通 Git 工作树。在侧栏浏览记忆文件、分支、commit 历史与 diff，恢复到任意历史 commit，也能推到 GitHub，在多台机器之间共享同一份记忆。',
      },
      {
        icon: 'subagent',
        demo: 'groups',
        title: 'Group 协作',
        body: '把不同的 bots 带进 Group，消息保留各自身份，需要谁就 @ 谁。每个成员可以选择每条提醒、摘要、仅提及或静默。',
      },
      {
        icon: 'workflow',
        demo: 'folders',
        title: '跨文件夹工作',
        body: '授权文件夹后，同一个 Bot 可以在多个文件夹中开展工作。每项工作保留独立会话和进展；需要你回答或批准时，侧栏会提醒你。',
      },
      {
        icon: 'todo',
        demo: 'schedules',
        title: '定时任务',
        body: '设置计划，或让 Bot 帮你管理。查看每次触发及处理记录，随时暂停，也可锁定以防 Bot 修改。应用运行时按计划执行。',
      },
      {
        icon: 'present',
        demo: 'mobile',
        title: '手机 App',
        body: '扫码把手机和电脑上的 Host 配对，电脑重启后依然有效，也能随时撤销。在手机上和 Bot 私聊、进群聊，回复以 Markdown 流式显示；请求和回复会推送通知，工具审批在通知里就能处理。还能实时查看 Bot 的浏览器和电脑并接管，在 Bot 资料里看用量、Memory 活动、定时任务和模型。iOS 与 Android 都是原生界面。测试版通过 TestFlight 和 Google Play 内部测试分发，尚未上架应用商店。',
        tag: 'Beta',
        cta: { label: '加入社区，获取测试邀请', href: '#community' },
      },
      {
        icon: 'web',
        title: '自己的 IM 身份',
        body: '连接飞书 / Lark、Slack、Discord、QQ 或个人微信。先在设置中连接应用，再在私聊侧栏「外部身份」绑定 Bot。微信仅接收扫码者私聊；其他平台按各自权限和会话规则收件、回复，新会话可自动接收或先询问。',
        tag: '按需连接',
        guide: { slug: 'capabilities', label: '平台范围与绑定步骤' },
      },
      {
        icon: 'bash',
        title: 'Computer 与 Browser use',
        body: 'Browser 与 Computer 已随正式包附带，每个 Bot 默认关闭访问，授权后才能操作。支持 macOS、Windows、Linux 本机电脑与 Docker Computer，Bot 浏览器可实时预览并由你接管；首次使用可能需要下载驱动或安装系统依赖。只读分享不能点击或导航，agent-browser 试用驱动为可选加装。',
        tag: '随包附带 · 按需授权',
        guide: { slug: 'capabilities', label: '选择操作目标与配置' },
      },
      {
        icon: 'ask',
        title: '托布总管与 Home',
        body: '和托布对话创建带人格与记忆的 Bot、组建群聊、邀请成员和调整模型，管理操作仍经过审批。Home 用两张卡片展示 Token 历史和 Bot 活跃情况；新手引导从模型配置带你进入真实对话。',
        tag: 'v1.4.0',
      },
      {
        icon: 'present',
        title: '按你习惯摆放的工作区',
        body: '在适用的桌面宽屏布局中，按需开关面板、拖拽标题分割、调整大小，记忆、会话、定时任务和设备控制可在消息内展开，并按频道保存布局。macOS Desktop 的标题栏空白可拖动窗口。',
        tag: 'v1.4.0',
      },
      {
        icon: 'approval',
        title: '可查看的自动审批',
        body: '选择内置模板或用 Markdown 写自己的规则，也可指定审批员模型。结果保留记录，拿不准就交给你；拒绝后可放行同一次调用，连续拒绝会暂停自动审批。',
        tag: 'v1.4.0',
      },
      {
        icon: 'bash',
        title: '命令行管理 Host',
        body: 'deepseekbot CLI 可管理在线 Host 的模型、Bot、群组、Memory、定时任务、收件箱、IM 和 Bot 市场；浏览器、电脑及适用的 Bot 工具也能绕过模型直接调用，配合 bot-trace 排查问题。危险操作仍需确认，凭证不会打印。',
        tag: 'v1.4.0',
      },
    ],
  },
  faq: {
    kicker: 'FAQ',
    title: '常见问题',
    items: [
      {
        id: 'affiliation',
        question: 'DeepSeekBot 和 DeepSeek 有什么关系？',
        answer:
          'DeepSeekBot 是独立的开源项目，与 DeepSeek 公司没有隶属关系，也不是其官方产品。它基于 DeepSeek Harness（DSH），以插件形式提供 Bot 的身份、人格、记忆与协作能力。',
      },
      {
        id: 'project-identity',
        question: '这是哪个 DeepSeek Bot？和 DS Bot 是同一个项目吗？',
        answer:
          '这里是 BotHarness 的 DeepSeekBot，简称 DSB，安装包为 deepseekbot，官网为 deepseekbot.app，MIT 开源。DS Bot 使用 ds-bot 安装，Apache-2.0，由 Fei2411/DeepSeek-Bot 维护，是另一个独立项目。两者都基于 DeepSeek Harness，都不是 DeepSeek 官方产品。',
        links: [{ label: 'DeepSeekBot 与 DS Bot 怎么选', href: '/blog/deepseekbot-vs-ds-bot/' }],
      },
      {
        id: 'project-focus',
        question: 'DeepSeekBot（DSB）和 DS Bot 的重心有什么不同？',
        answer:
          'DeepSeekBot 让每个 Bot 成为能走出 DSH 窗口的长期同事：可审阅的 Git 记忆、Bot 自己的飞书 / Slack / Discord / 微信身份、定时任务、任务委派和 Bot 市场。DS Bot 把 DSH 本身变成 Bot 聊天应用：主 Bot Chief 带你建团队，群管理员默认统筹回复，并提供按 Bot 和模型的用量统计。',
      },
      {
        id: 'capabilities',
        question: 'DeepSeekBot 能帮我做什么？',
        answer:
          '你可以创建负责研究、设计或实现的 Bot，分别私聊，或让它们在 Group 中协作。每个 Bot 保留自己的身份和记忆，可以在授权的文件夹中开展工作，也能设置定时任务。定时任务需要应用保持运行。',
      },
      {
        id: 'getting-started',
        question: '如何安装并开始使用？',
        answer: `先安装 DeepSeek Harness ${DSH_VERSION}，在「插件 → 添加插件」中输入 ${DESKTOP_PACKAGE}，安装并启用。进入「Bot 模式」后，按 Home 引导配置模型，和托布创建 Bot、组建群聊，再学习开关与调整面板。`,
        links: [{ label: '安装教程', href: '/docs/installation/' }],
      },
      {
        id: 'models',
        question: '只能使用 DeepSeek 模型吗？',
        answer:
          '不限于 DeepSeek。DeepSeekBot 使用你在 DSH 中配置的模型提供商，也支持通过 DSH 配置兼容 API 或自部署服务。能否使用某个模型取决于接口支持、凭据和模型配置。',
        links: [{ label: '模型配置', href: '/docs/model-setup/' }],
      },
      {
        id: 'cost',
        question: '使用 DeepSeekBot 需要付费吗？',
        answer:
          'DeepSeekBot 采用 MIT 许可开源，可免费使用。模型服务需要自行配置凭据，调用可能产生服务商费用；开源软件不等于免费的模型额度。',
      },
      {
        id: 'data-and-access',
        question: '我的数据存在哪里？Bot 能访问哪些文件？',
        answer:
          'Bot 的记忆和聊天记录保存在运行 DSH 的设备上；调用模型时，相关上下文会发送给你配置的模型服务。文件夹访问由你授权，执行操作受权限与批准设置约束。插件的匿名统计不收集对话或记忆内容，也可以关闭。',
        links: [
          { label: '文件夹权限', href: '/docs/channel-sidebar/workspaces/' },
          { label: '隐私说明', href: '/privacy/' },
        ],
      },
      {
        id: 'chat-platforms',
        question: '可以连接哪些聊天平台？',
        answer:
          '可连接飞书 / Lark、Slack、Discord、QQ 和个人微信，需要先配置相应的平台应用或账号，并绑定到 Bot。个人微信目前仅支持扫码者私聊；其他平台的收发范围受平台权限、发送者限制和会话设置约束。',
        links: [{ label: '接入与可选能力', href: '/docs/capabilities/' }],
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
  studio: {
    pageTitle: '头像工坊 · DeepSeekBot',
    kicker: 'BotPixel',
    title: '头像工坊',
    lead: '换物种、发型、五官和颜色，或者自己画头饰、头发和其他部件，画好直接下载。设计保存在这个浏览器里，首页的小伙伴也会换上它。',
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
    generatedBio: '作者没写中文简介，这句由 AI 根据 README 生成',
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
    studio: {
      title: '想细细捏一张脸？',
      body: '头像工坊里有全部物种、部件、颜色和绘制工具，画好的部件还能导出。设计会保存在这个浏览器里。',
      cta: '打开头像工坊',
    },
  },
  avatarLabels: ZH_AVATAR_LABELS,
  demo: ZH_DEMO,
  featureDemos: ZH_FEATURE_DEMOS,
  install: {
    kicker: '安装',
    title: '装进 DeepSeek Harness',
    tabsLabel: '安装方式',
    desktopTab: '桌面端',
    devTab: '开发者（命令行）',
    desktop: {
      lead: `使用 DeepSeek Harness ${DSH_VERSION} 桌面端，点「插件 → 添加插件」，在「包名或地址」里输入 ${DESKTOP_PACKAGE}，点「安装」。`,
      download: '还没装 DeepSeek Harness？先下载桌面端',
      steps: [
        '打开 DeepSeek Harness 桌面端，点左侧「插件」，再点「添加插件」',
        '在「包名或地址」里输入下面这一行，保持「npm 官方源」，点「安装」',
        '显示「已安装」后点「立即启用」；如果提示重启，重启当前 Profile',
        '进入「Bot 模式」，跟随 Home 引导配置模型，再和托布创建第一个 Bot 与群聊',
      ],
      docs: 'DSH 官方文档：打包与安装插件',
      docsUrl: 'https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish',
      downloadUrl: 'https://www.deepseek.com/harness/',
    },
    lead: `需要 Node 22 以上。推荐 DSH ${DSH_VERSION}；1.4.0 的同包安装、启动和重启持久化已在 DSH 0.2.0-rc.2 与 0.2.1-rc.2 验证。声明安装范围为 >=0.2.0-rc.2 <0.3.0-0，不代表所有后续版本均已验证。`,
    steps: ['安装 DeepSeek Harness', '把 DeepSeekBot 装进 web Profile', '启动并打开 Bot mode'],
    next: {
      title: '装好了？选择接入方式与可选能力',
      button: '查看接入与配置',
      overview: '使用文档总览',
    },
    copy: '复制',
    copied: '已复制',
    after:
      '打开后进入 Bot mode，创建 PersonaBot，先私聊，再建 Group 邀请成员。从私聊侧栏「外部身份」绑定已连接的应用；Browser 与 Computer 需为每个 Bot 显式开启访问。',
    note: `此入口安装 npm 正式版 v${VERSION}。Browser 与 Computer 随包附带，首次使用按提示配置驱动。升级前请备份 Profile；回退旧版可能需要恢复升级前备份。想独立试用，可使用新的 Profile。`,
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
  pageTitle: 'DeepSeekBot (DSB): the open-source Grok Bot alternative for DeepSeek Harness',
  nav: {
    features: 'Features',
    avatar: 'Avatar Studio',
    install: 'Install',
    market: 'Marketplace',
    docs: 'Docs',
    changelog: 'Changelog',
    blog: 'Blog',
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
    lead: 'DeepSeekBot is BotHarness’s personal AI agent collaboration tool for DeepSeek Harness (DSH). Install the deepseekbot plugin to create Bots with persistent identities and Git-backed memory, collaborate in groups, delegate tasks, and connect them to Lark, Slack, Discord, QQ and WeChat.',
    ctaInstall: 'Install',
    ctaGithub: 'View on GitHub',
    crewLabel: 'A crew of working PersonaBots whose avatars turn into the tool each one is using',
    signpost: 'Marketplace',
    signpostLabel: 'Find Bots other people shared in the Bot Marketplace',
    chips: ['Open-source Grok Bot alternative', 'Built on DeepSeek Harness', 'MIT open source'],
    quick: {
      label: 'One-line install',
      cliTab: 'CLI',
      noDsh: 'No DSH yet?',
      getDsh: 'Get DeepSeek Harness from DeepSeek first',
      desktopHint: `Use DSH ${DSH_VERSION} first. Copy this npm package name, paste it into Plugins → Add plugin, and click Install.`,
      cliHint: `Use DSH ${DSH_VERSION}; 0.2.0-rc.2 is also qualified. Run this line in a terminal, then open it with dsh web.`,
    },
    qqCopied: 'Group number copied',
    qqFailed: `Copy failed. The QQ group number is ${QQ_GROUP}; copy it by hand.`,
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
    lead: `v${VERSION} is out: Tob walks you through a five-step intro the first time you enter Bot mode; themes, see-through panels and a wallpaper library make Bot mode your own; /compact and Idle Compaction keep long conversations fast, and quick search reaches any setting.`,
    release: {
      text: 'Memory previews images and Markdown, approvals come down to Allow once, Always allow and Reject, and a batch of Windows Desktop, Activity and zoom issues are fixed.',
      label: 'Read the 1.4.1 changelog',
      href: `/en/changelog/#v${VERSION}`,
    },
    items: [
      {
        icon: 'present',
        demo: 'identity',
        title: 'Lasting identity',
        body: 'Create PersonaBots for research, design or engineering. Each has its own name and avatar: SOUL.md holds its persona, voice and working principles; MEMORY.md holds core memory that lasts across chats and folders.',
      },
      {
        icon: 'read',
        demo: 'memory',
        title: 'Git Memory you can see',
        body: 'A Bot’s memory is a plain Git working tree. Browse its files, branches, commits and diffs in the sidebar, restore any past commit, or push it to GitHub to share the same memory across machines.',
      },
      {
        icon: 'subagent',
        demo: 'groups',
        title: 'Groups',
        body: 'Bring different Bots into a Group. Messages keep each Bot’s identity, and you @ whoever you need. Each member picks every message, digest, mentions only or silent.',
      },
      {
        icon: 'workflow',
        demo: 'folders',
        title: 'Work across folders',
        body: 'Authorize folders so the same Bot can work in several of them. Each job keeps its own conversation and progress; the sidebar alerts you when it needs your answer or approval.',
      },
      {
        icon: 'todo',
        demo: 'schedules',
        title: 'Scheduled tasks',
        body: 'Set a schedule or ask your Bot to manage one. Review triggers and handling history, pause it, or lock it against Bot edits. Tasks run while the app is running.',
      },
      {
        icon: 'present',
        demo: 'mobile',
        title: 'Mobile app',
        body: 'Scan a QR code to pair your phone with the Host on your computer; access survives restarts and you can revoke it anytime. Chat with Bots in DMs and groups as Markdown replies stream in. Get notified about requests and replies, and decide tool approvals right from the notification. Watch a Bot’s Browser or Computer live and take over, and see usage, Memory activity, schedules and models in its profile. Native on iOS and Android. Testing builds go out through TestFlight and Google Play internal testing; it is not in the app stores yet.',
        tag: 'Beta',
        cta: { label: 'Join the community for a test invite', href: '#community' },
      },
      {
        icon: 'web',
        title: 'Their own IM identity',
        body: 'Connect Lark / Feishu, Slack, Discord, QQ or personal WeChat. Connect an app in Settings, then bind it to a Bot in the DM sidebar’s External identities. WeChat accepts only the QR owner’s DMs; other platforms follow their permissions and conversation rules. New conversations can be automatic or ask first.',
        tag: 'Connect as needed',
        guide: { slug: 'capabilities', label: 'Platform scope and binding steps' },
      },
      {
        icon: 'ask',
        title: 'Tob and Home',
        body: 'Ask Tob to create Bots with a persona and memory, organize groups, invite members and adjust models, with approvals intact. Home shows Token history and Bot activity; onboarding takes you from model setup into a real conversation.',
        tag: 'v1.4.0',
      },
      {
        icon: 'present',
        title: 'A workspace you can arrange',
        body: 'In supported wide desktop layouts, open panels as needed, drag titles to split them and resize them. Memory, sessions, schedules and device controls open inside a conversation, with layouts saved per channel. Header whitespace moves the macOS Desktop window.',
        tag: 'v1.4.0',
      },
      {
        icon: 'approval',
        title: 'Inspectable automatic approvals',
        body: 'Choose a template or write rules in Markdown, optionally with a separate reviewer model. Decisions stay visible; uncertainty returns to you. Override one exact rejected call, while repeated rejections pause automatic approval.',
        tag: 'v1.4.0',
      },
      {
        icon: 'bash',
        title: 'Computer and Browser use',
        body: 'Browser and Computer are bundled, with access off for each Bot until you enable it. Use a local macOS, Windows or Linux computer, or Docker Computer; watch the Bot Browser live and take over when needed. First use may download drivers or require system dependencies. Read-only sharing cannot click or navigate; the agent-browser trial driver is an optional add-on.',
        tag: 'Bundled · access by permission',
        guide: { slug: 'capabilities', label: 'Choose a target and set it up' },
      },
      {
        icon: 'bash',
        title: 'Manage a Host from the CLI',
        body: 'The deepseekbot CLI manages models, Bots, groups, Memory, schedules, Inbox, IM and Marketplace on a live Host. Run Browser, Computer and applicable Bot tools directly without a model, and inspect bot-trace. Dangerous actions still require confirmation; credentials are never printed.',
        tag: 'v1.4.0',
      },
    ],
  },
  faq: {
    kicker: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      {
        id: 'affiliation',
        question: 'Is DeepSeekBot affiliated with DeepSeek?',
        answer:
          'DeepSeekBot is an independent open-source project. It is not affiliated with DeepSeek and is not an official DeepSeek product. It runs as a plugin on DeepSeek Harness (DSH), giving Bots their own identity, persona, memory and collaboration tools.',
      },
      {
        id: 'project-identity',
        question: 'Which DeepSeek Bot is this? Is it the same as DS Bot?',
        answer:
          'This is DeepSeekBot by BotHarness, DSB for short: npm package deepseekbot, website deepseekbot.app, MIT licensed. DS Bot installs as ds-bot, is Apache-2.0 licensed and lives at Fei2411/DeepSeek-Bot; it is a separate project. Both run on DeepSeek Harness, and neither is an official DeepSeek product.',
        links: [
          { label: 'Compare DeepSeekBot and DS Bot', href: '/en/blog/deepseekbot-vs-ds-bot/' },
        ],
      },
      {
        id: 'project-focus',
        question: 'How do DeepSeekBot (DSB) and DS Bot differ in focus?',
        answer:
          "DeepSeekBot makes each Bot a long-lived colleague that works beyond the DSH window: Git memory you can review, the Bot's own Lark / Slack / Discord / WeChat identity, schedules, delegated Assignments and a Bot Marketplace. DS Bot turns DSH itself into a bot chat app: a main Bot, Chief, builds your team, a group admin answers first, and a Usage page shows tokens by Bot and model.",
      },
      {
        id: 'capabilities',
        question: 'What can DeepSeekBot help me do?',
        answer:
          'Create Bots for research, design or implementation, chat with them individually, or bring them together in a Group. Each Bot keeps its own identity and memory, can work in folders you authorize, and can run scheduled tasks. Scheduled tasks require the app to keep running.',
      },
      {
        id: 'getting-started',
        question: 'How do I install it and get started?',
        answer: `Install DeepSeek Harness ${DSH_VERSION} first. In Plugins → Add plugin, enter ${DESKTOP_PACKAGE}, then install and enable it. Open Bot mode and follow Home onboarding to configure a model, ask Tob to create a Bot and group, and learn the panel controls.`,
        links: [{ label: 'Installation guide', href: '/en/docs/installation/' }],
      },
      {
        id: 'models',
        question: 'Can I use models other than DeepSeek?',
        answer:
          'Yes. DeepSeekBot uses the model providers you configure in DSH, including compatible APIs or self-hosted services configured through DSH. Whether a model works depends on interface support, credentials and model configuration.',
        links: [{ label: 'Model setup', href: '/en/docs/model-setup/' }],
      },
      {
        id: 'cost',
        question: 'Does DeepSeekBot cost money to use?',
        answer:
          'DeepSeekBot is open source under the MIT license and free to use. You supply your own model credentials, and model calls may incur charges from your provider. Open-source software does not include free model credits.',
      },
      {
        id: 'data-and-access',
        question: 'Where is my data stored, and which files can Bots access?',
        answer:
          'Bot memory and chat history are stored on the device running DSH. When you call a model, relevant context is sent to the model service you configured. You authorize folder access, and actions are governed by permission and approval settings. The plugin’s anonymous analytics do not collect conversations or memory content and can be disabled.',
        links: [
          { label: 'Folder permissions', href: '/en/docs/channel-sidebar/workspaces/' },
          { label: 'Privacy', href: '/en/privacy/' },
        ],
      },
      {
        id: 'chat-platforms',
        question: 'Which chat platforms can I connect?',
        answer:
          'Connect Feishu / Lark, Slack, Discord, QQ or personal WeChat by setting up the relevant platform app or account and binding it to a Bot. Personal WeChat currently supports only the QR owner’s DMs; other platforms’ message scope depends on platform permissions, sender restrictions and conversation settings.',
        links: [{ label: 'Connections and optional tools', href: '/en/docs/capabilities/' }],
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
  studio: {
    pageTitle: 'Avatar Studio · DeepSeekBot',
    kicker: 'BotPixel',
    title: 'Avatar Studio',
    lead: 'Swap species, hair, features and colors, or draw your own headpiece, hair and other parts, then download it. Your design is saved in this browser, and the companion on the home page wears it too.',
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
    generatedBio: 'The author wrote no English bio; AI wrote this from the README',
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
    studio: {
      title: 'Want to get every detail right?',
      body: 'The Avatar Studio has every species, part, color and drawing tool, and drawn parts can be exported. Your design is saved in this browser.',
      cta: 'Open the Avatar Studio',
    },
  },
  avatarLabels: EN_AVATAR_LABELS,
  demo: EN_DEMO,
  featureDemos: EN_FEATURE_DEMOS,
  install: {
    kicker: 'Install',
    title: 'Add it to DeepSeek Harness',
    tabsLabel: 'How to install',
    desktopTab: 'Desktop',
    devTab: 'Developers (CLI)',
    desktop: {
      lead: `Use the DeepSeek Harness ${DSH_VERSION} desktop app, go to Plugins → Add plugin, enter ${DESKTOP_PACKAGE} as the package name or address, and click Install.`,
      download: 'No DeepSeek Harness yet? Get the desktop app',
      steps: [
        'Open the DeepSeek Harness desktop app, click Plugins in the sidebar, then Add plugin',
        'Enter this line as the package name or address, keep the official npm registry, and click Install',
        'When it shows Installed, click Enable now; if DSH asks, restart the current Profile',
        'Open Bot mode and follow Home onboarding: set up a model, then ask Tob to create a Bot and group',
      ],
      docs: 'DSH docs: package and install a plugin',
      docsUrl: 'https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/publish',
      downloadUrl: 'https://www.deepseek.com/en/harness/',
    },
    lead: `Needs Node 22 or later. Use DSH ${DSH_VERSION}. The exact 1.4.0 packages passed installation, startup and restart persistence on DSH 0.2.0-rc.2 and 0.2.1-rc.2. Declared admission is >=0.2.0-rc.2 <0.3.0-0; later versions are not all runtime-qualified.`,
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
      'Open Bot mode, create a PersonaBot, DM it, then invite members to a Group. Bind connected apps in the DM sidebar’s External identities; explicitly enable Browser and Computer access for each Bot.',
    note: `This installs npm v${VERSION}. Browser and Computer are bundled; follow the driver setup prompts on first use. Back up the Profile before upgrading: returning to an older binary may require the pre-upgrade backup. Use a new Profile for a separate trial.`,
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
