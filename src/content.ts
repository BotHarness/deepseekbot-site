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
import { MARKET_LABELS } from './marketRoutes';
import { VERSION, DESKTOP_PACKAGE, DSH_VERSION } from './installRelease';
import { PREVIEW_COPY } from './previewCopy';
export { QQ_GROUP };

export type Lang = 'zh' | 'en';

export { VERSION, DESKTOP_PACKAGE, DSH_VERSION };

export const LINKS = {
  github: COMMUNITY_LINKS.github,
  docs: 'https://botharness.ai',
  npm: 'https://www.npmjs.com/package/@botharness/tobs',
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
  demo?: keyof FeatureDemoCopy | 'browser';
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
  compare: {
    kicker: string;
    title: string;
    note: string;
    items: { title: string; description: string; href: string }[];
  };
  faq: {
    kicker: string;
    title: string;
    items: {
      id: string;
      question: string;
      answer: string;
      points?: string[];
      links?: { label: string; href: string }[];
    }[];
  };
  demo: DemoCopy;
  featureDemos: FeatureDemoCopy;
  dsh: { title: string; body: string; issues: string };
  /** Anonymous quotes from users, the same ones the app shows in onboarding. */
  reviews: { kicker: string; title: string; lead: string; quotes: readonly string[] };
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
    shelvesLabel: string;
    shelfBots: string;
    shelfPlugins: string;
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
    // the discovery rows above the full list, matching the Tobs app's Bot Marketplace
    discover: {
      dailyPicks: string;
      read: string;
      pastPicks: string;
      seePast: string;
      noPast: string;
      digestMissing: string;
      sections: { readonly hot: string; readonly new: string; readonly rising: string };
      seeAll: string;
      sectionEmpty: string;
      allBots: string;
      installs: string;
      installsLabel: string;
    };
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
      downloadUrl: string;
    };
    lead: string;
    steps: string[];
    next: { title: string; button: string; overview: string };
    copy: string;
    copied: string;
  };
  footer: {
    built: string;
    community: string;
    privacy: string;
    terms: string;
  };
}

const zh: Copy = {
  htmlLang: 'zh-Hans',
  pageTitle: 'Tobs（托布）：开源的 GrokBot 平替，基于 DeepSeek Harness',
  nav: {
    features: '能力',
    avatar: '头像工坊',
    install: '安装',
    market: '市场',
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
    title: 'Tobs',
    tagline: '托布：你的专属 Bot 团队，各有身份、性格与长期记忆。',
    lead: 'Tobs（托布）意为 Team of bots，也寓意 Thousands of Bots，是 BotHarness 开发的个人 AI 智能体协作工具，作为 Tobs 插件装进 DeepSeek Harness（DSH）。创建各有身份与 Git Memory 的 Bot，在群组中协作、委派任务，并连接飞书、Slack、Discord、QQ 和微信。',
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
    lead: `v${VERSION} 已发布：与 Bot 通话，在支持的平台分享屏幕或摄像头；搜索手机上已保存的聊天，查看 Bot 发来的图表与丰富文档。`,
    release: {
      text: '实时通话需要支持的 Mac/Windows Host，通过局域网或 Tailscale 连接。手机应用单独发布。',
      label: `查看 ${VERSION} 更新日志`,
      href: `/changelog/#v${VERSION}`,
    },
    items: [
      {
        icon: 'present',
        demo: 'identity',
        title: '持久身份',
        body: '按分工创建负责研究、设计或开发的 Bot，每个都有自己的名字和头像。SOUL.md 记录性格、语气和工作原则，MEMORY.md 沉淀核心记忆，跨对话、跨文件夹持续延续。',
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
        body: '自己设定执行计划，或交给 Bot 帮你维护。每次触发和处理记录都清晰可查，随时可以暂停，也能锁定以防 Bot 改动；只要应用保持运行，任务就会按时执行。',
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
        icon: 'subagent',
        title: PREVIEW_COPY.zh.teamTitle,
        body: PREVIEW_COPY.zh.teamBody,
      },
      {
        icon: 'thinking',
        title: PREVIEW_COPY.zh.modelsTitle,
        body: PREVIEW_COPY.zh.modelsBody,
      },
      {
        icon: 'workflow',
        title: PREVIEW_COPY.zh.enginesTitle,
        body: PREVIEW_COPY.zh.enginesBody,
      },
      {
        icon: 'goal',
        title: PREVIEW_COPY.zh.sessionsTitle,
        body: PREVIEW_COPY.zh.sessionsBody,
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
        demo: 'browser',
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
  compare: {
    kicker: '产品对比',
    title: '对比 Tobs',
    note: '文章中的 DeepSeekBot 是 Tobs 的旧名称；对比以各篇注明的版本为准。',
    items: [
      {
        title: 'Tobs vs Grok Bot',
        description: '自托管、Git 记忆与模型选择',
        href: '/blog/grokbot-alternative/',
      },
      {
        title: 'Tobs vs DS Bot',
        description: '同一 DSH 生态，不同的协作方式',
        href: '/blog/deepseekbot-vs-ds-bot/',
      },
      {
        title: '个人 AI Agent 怎么选',
        description: 'Grok Bot、Muse、Dots 与 Cue',
        href: '/blog/personal-ai-agents-comparison/',
      },
    ],
  },
  faq: {
    kicker: 'FAQ',
    title: '常见问题',
    items: [
      {
        id: 'multiple-bots',
        question: '模型已经这么强了，为什么还需要多个 Bot？',
        answer:
          '其实很多时候一个就够了。大多数人完全可以先用一个全能助手，等真正需要分工时再添新成员。',
        points: [
          '多 Bot 首先是为了隔离上下文。就像不同项目有各自的 Git 仓库，研究、写作和发布分开管理，互不干扰。',
          '角色分工也是典型场景：不同职责需要独立的系统提示词与记忆，文件权限和工作边界同样可以按 Bot 切分。',
          '预算充足时可以全用最强模型；预算有限时，把日常或轻量任务交给性价比更高的模型会划算得多。',
          '就像刚起步的团队，先一个人把事跑通，等工作量和分工需求上来了，再按需招人。',
        ],
      },
      {
        id: 'affiliation',
        question: 'Tobs 和 DeepSeek 有什么关系？',
        answer:
          'Tobs 是独立的开源项目，与 DeepSeek 公司没有隶属关系，也不是官方产品。它以插件形式运行在 DeepSeek Harness（DSH）之上，为 Bot 提供独立的身份、性格、记忆与协作能力。',
      },
      {
        id: 'project-identity',
        question: '这是哪个 DeepSeek Bot？和 DS Bot 是同一个项目吗？',
        answer:
          'Tobs 是 BotHarness 的开源项目，原名 DeepSeekBot，官网是 tobs.app，npm 包名为 @botharness/tobs，采用 MIT 许可。DS Bot 是 Fei2411/DeepSeek-Bot 维护的独立项目，包名是 ds-bot，采用 Apache-2.0 许可。',
        links: [{ label: 'Tobs 与 DS Bot 怎么选', href: '/blog/deepseekbot-vs-ds-bot/' }],
      },
      {
        id: 'project-focus',
        question: 'Tobs（托布）和 DS Bot 的侧重点有什么不同？',
        answer:
          'Tobs 把每个 Bot 当成能走出 DSH 窗口的长期同事：拥有可审阅的 Git 记忆、独立的飞书 / Slack / Discord / QQ / 微信身份、定时任务、任务委派和 Bot 市场。DS Bot 则侧重把 DSH 本身打造成 Bot 聊天应用：由主 Bot Chief 带你组建团队，群管理员默认统筹回复，并提供按 Bot 与模型划分的用量统计。',
      },
      {
        id: 'capabilities',
        question: 'Tobs 能帮我做什么？',
        answer:
          '你可以按分工创建负责研究、设计或开发的 Bot，一对一私聊，或在群聊里让多个 Bot 共享上下文协作。每个 Bot 都保留独立的身份和记忆，能在你授权的文件夹里干活，也可以按计划执行定时任务（需要应用保持运行）。',
      },
      {
        id: 'getting-started',
        question: '怎么安装并开始使用？',
        answer: `在 DeepSeek Harness ${DSH_VERSION} 的「插件 → 添加插件」里输入 ${DESKTOP_PACKAGE}，安装并启用。进入 Bot 模式，配置好模型，就可以创建第一个 Bot。`,
        links: [{ label: '安装教程', href: '/docs/installation/' }],
      },
      {
        id: 'mobile-standalone',
        question: '只装手机 App 就能用吗？',
        answer:
          '目前还不行。Tobs 的 Bot 运行在你的 Windows、Linux 或 macOS 电脑上，手机端更像一块随身遥控屏：先在电脑上装好 DeepSeek Harness 和 Tobs，再把手机连上去，出门在外也能随时和电脑上的 Bot 协作。',
        links: [{ label: '安装桌面端', href: '/docs/installation/' }],
      },
      {
        id: 'mobile-features',
        question: '在手机上都能做些什么？',
        answer:
          '可以和 Bot 私聊、参与群聊、接收实时通知，并在 Activity 里查看和处理工具审批。电脑负责真正执行任务，手机让你随时跟进进度、发消息和批准操作。',
      },
      {
        id: 'mobile-host-online',
        question: '用手机连的时候，电脑必须一直开着吗？',
        answer:
          '是的。对应的电脑需要保持开机、联网，并且运行着 DeepSeek Harness 和 Tobs。一旦电脑关机、休眠或退出应用，手机就暂时连不上这台电脑的 Bot；等它重新上线后即可恢复连接。',
      },
      {
        id: 'mobile-connection',
        question: '手机和电脑必须在同一个 Wi-Fi 下吗？',
        answer:
          '不用。既可以通过 Connect 登录同一个账号远程连接，也可以按配对指南配置 Tailscale。配好之后出门在外也能连，只要手机和电脑各自有网就行。',
        links: [{ label: '手机连接教程', href: '/docs/mobile-pairing/' }],
      },
      {
        id: 'mobile-multiple-hosts',
        question: '一部手机能连多台电脑吗？',
        answer:
          '可以。在每台电脑上装好 Tobs 并分别连接后，手机端可以自由切换 Host，也能在全部聊天和 Activity 里汇总查看多台电脑的消息与待审批请求。各台电脑的 Bot 和数据仍保存在本机。',
      },
      {
        id: 'models',
        question: '只能用 DeepSeek 模型吗？',
        answer:
          '不是的。你可以在 DSH 中配置任意兼容 API 或自部署模型，也能在本机 Host 通过官方 Codex 或 Claude Code CLI 登录符合条件的订阅来运行 Bot。具体可用哪些模型，取决于接口兼容性、凭据和你的订阅或配置。',
        links: [{ label: '模型配置', href: '/docs/model-setup/' }],
      },
      {
        id: 'team-preview',
        question: PREVIEW_COPY.zh.teamQuestion,
        answer: PREVIEW_COPY.zh.teamAnswer,
      },
      {
        id: 'engines-preview',
        question: PREVIEW_COPY.zh.engineQuestion,
        answer: PREVIEW_COPY.zh.engineAnswer,
      },
      {
        id: 'acp-preview',
        question: PREVIEW_COPY.zh.acpTitle,
        answer: PREVIEW_COPY.zh.acpBody,
        links: [
          { label: 'ACP 接入讨论', href: 'https://github.com/BotHarness/DeepSeekBot/issues/4254' },
        ],
      },
      {
        id: 'sessions-preview',
        question: PREVIEW_COPY.zh.sessionsQuestion,
        answer: PREVIEW_COPY.zh.sessionsAnswer,
      },
      {
        id: 'cost',
        question: '使用 Tobs 需要付费吗？',
        answer:
          'Tobs 按 MIT 协议开源，软件本身永久免费使用，由赞助支持持续开发。模型 API、订阅或自托管服务器的费用直接由你选择的第三方服务商收取，开源软件不包含免费的模型额度。',
      },
      {
        id: 'data-and-access',
        question: '我的数据存在哪里？Bot 能访问哪些文件？',
        answer:
          'Bot 的记忆和聊天记录保存在运行 DSH 的设备上。调用模型时，相关上下文会发给你配置的模型服务。文件夹访问由你授权，工具操作遵循权限与审批设置。你可以关闭插件的匿名统计，统计内容不包含对话或记忆。',
        links: [
          { label: '文件夹权限', href: '/docs/channel-sidebar/workspaces/' },
          { label: '隐私说明', href: '/privacy/' },
        ],
      },
      {
        id: 'chat-platforms',
        question: '目前支持连接哪些聊天平台？',
        answer:
          '目前支持飞书 / Lark、Slack、Discord、QQ 和个人微信，只需先配置对应平台的应用或账号，再绑定到 Bot 即可。个人微信仅支持扫码账号的一对一私聊，其他平台的收发范围取决于各自权限与绑定设置。WhatsApp、Telegram 和企业微信正在开发中。',
        links: [{ label: '接入与可选能力', href: '/docs/capabilities/' }],
      },
    ],
  },
  video: {
    kicker: '宣传片',
    title: '三分钟看懂 Tobs',
    lead: '一座像素小镇里，一群有名字、有记忆的 Bot 各忙各的，也会一起做事。',
    src: `${MEDIA_BASE}/pv/botharness-town-v19-1080p-lite-zh.mp4`,
    poster: '/pv-poster-zh-v1.png',
    label: 'Tobs 宣传片（中文）',
    play: '播放宣传片',
  },
  studio: {
    pageTitle: '头像工坊 · Tobs',
    kicker: 'BotPixel',
    title: '头像工坊',
    lead: '换物种、发型、五官和颜色，或者自己画头饰、头发和其他部件，画好直接下载。设计保存在这个浏览器里，首页的小伙伴也会换上它。',
  },
  market: {
    pageTitle: '市场 · Tobs',
    kicker: MARKET_LABELS.zh.kicker,
    title: '找一个现成的 Bot',
    lead: '这里收录了大家放在公开 GitHub 仓库里的 Bot。在 Tobs 里安装后，它会成为一个新的 Bot，带着作者写好的 Memory。',
    shelvesLabel: '市场分类',
    shelfBots: 'Bot',
    shelfPlugins: '插件',
    searchLabel: '搜索 Bot',
    searchPlaceholder: '搜索名称、描述、话题或 README，回车搜索',
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
      body: '把 Bot 的 Memory 发布成公开 GitHub 仓库并加上 botharness-bot 话题，每天会自动收录；也可以在 Tobs 的「Bot 市场」里贴入仓库地址，立即收录。',
      docs: '分享 Bot 教程：发布前检查、一键复制给 Bot 的提示词、名称和头像设置',
    },
    open: '查看 {name} 详情',
    back: MARKET_LABELS.zh.back,
    github: MARKET_LABELS.zh.github,
    stars: '★ {count}',
    updated: '更新于 {date}',
    notFound: '这个 Bot 已不在市场中。',
    generatedBio: '作者没写中文简介，这句由 AI 根据 README 生成',
    readmeLoading: '正在加载 README…',
    noReadme: '这个仓库没有 README。',
    gitUrl: 'Git 仓库地址',
    installTitle: '在 Tobs 里安装',
    installSteps: [
      '打开 Tobs，点侧栏消息列表上方的「＋」，选「Bot 市场」，搜索这个 Bot，点「安装」。',
      '也可以在「＋」里选「创建 PersonaBot」，记忆来源选「从 Git 仓库导入」，粘贴上面的地址。',
    ],
    risk: '这是第三方仓库：它的文件会成为新 Bot 的 Memory，可能包含有害内容或会被 Bot 执行的指令。请只安装你信任的仓库。',
    commit: '最新提交 {sha} · {date}',
    getApp: '还没装 Tobs？',
    discover: {
      dailyPicks: MARKET_LABELS.zh.dailyPicks,
      read: '阅读每日精选：{title}',
      pastPicks: MARKET_LABELS.zh.pastPicks,
      seePast: '查看往期精选',
      noPast: '还没有往期精选。',
      digestMissing: '这期精选不存在。',
      sections: MARKET_LABELS.zh.sections,
      seeAll: '查看全部',
      sectionEmpty: '这里暂时还没有 Bot。',
      allBots: MARKET_LABELS.zh.allBots,
      installs: '↓ {count}',
      installsLabel: '{count} 次安装',
    },
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
      downloadUrl: 'https://www.deepseek.com/harness/',
    },
    lead: '需要 Node.js 22 或更高版本。',
    steps: ['安装 DeepSeek Harness', '把 Tobs 装进 web Profile', '启动并打开 Bot mode'],
    next: {
      title: '装好了？选择接入方式与可选能力',
      button: '查看接入与配置',
      overview: '使用文档总览',
    },
    copy: '复制',
    copied: '已复制',
  },
  dsh: {
    title: '站在 DeepSeek Harness 上',
    body: 'Tobs 的 API 模型使用 DSH 的 Session 管理和 Harness。Bot 可选你在 DSH 配置的兼容模型，Tobs 也可与其他 DSH 插件一起安装。个别插件可能还不兼容，遇到了欢迎提 Issue 或 PR。',
    issues: '去 GitHub 提 Issue',
  },
  reviews: {
    kicker: '用户评价',
    title: '用过的人怎么说',
    lead: '来自 QQ 群和社区用户的真实反馈。',
    quotes: [
      '界面做得挺清爽的，功能多但不乱，找东西很快。',
      '这将是跨时代的！',
      '很多的小巧思和细节的打磨。',
      'Tobs 前端再优化一下我就该退订 Grok Bot 了。',
      '打算再品鉴一下，如果老马实在搬不出合适的解决方案的话，就考虑纯用 Tobs 了。',
    ],
  },
  community: {
    kicker: '社区',
    title: '一起来聊',
    lead: '问题、想法，还有你做出来的 Bot，都欢迎带来。',
    discord: {
      title: 'Discord',
      body: '加入 Tobs 的 Discord 服务器。',
      cta: '加入 Discord',
    },
    github: {
      title: 'GitHub',
      body: '查看源码，报告问题，或一起改进 Tobs。',
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
    community: 'QQ 社区群 1125565676',
    privacy: '隐私说明',
    terms: '服务条款',
  },
};

const en: Copy = {
  htmlLang: 'en',
  pageTitle: 'Tobs: the open-source Grok Bot alternative for DeepSeek Harness',
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
    title: 'Tobs',
    tagline: 'A team of Bots—each with its own identity, persona, and lasting memory.',
    lead: 'Tobs means Team of bots, with the ambition of Thousands of Bots. It is BotHarness’s personal AI agent collaboration tool for DeepSeek Harness (DSH). Install the Tobs plugin to create Bots with persistent identities and Git-backed memory, collaborate in groups, delegate tasks, and connect them to Lark, Slack, Discord, QQ and WeChat.',
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
    lead: `v${VERSION} is out: call your Bots and share your screen or camera on supported platforms; search saved mobile chats and open charts and rich documents from Bots.`,
    release: {
      text: 'Real-time calls need a supported Mac/Windows Host over LAN or Tailscale. Mobile apps are released separately.',
      label: `Read the ${VERSION} changelog`,
      href: `/en/changelog/#v${VERSION}`,
    },
    items: [
      {
        icon: 'present',
        demo: 'identity',
        title: 'Persistent identity',
        body: 'Create Bots for research, design, or engineering, each with its own name and avatar. SOUL.md defines its persona, voice, and working principles, while MEMORY.md preserves core memory across chats and folders.',
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
        body: 'Set up recurring schedules yourself or let a Bot manage them for you. Inspect every trigger and run log, pause anytime, or lock a schedule so Bots cannot modify it—tasks run automatically while the app is open.',
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
        icon: 'subagent',
        title: PREVIEW_COPY.en.teamTitle,
        body: PREVIEW_COPY.en.teamBody,
      },
      {
        icon: 'thinking',
        title: PREVIEW_COPY.en.modelsTitle,
        body: PREVIEW_COPY.en.modelsBody,
      },
      {
        icon: 'workflow',
        title: PREVIEW_COPY.en.enginesTitle,
        body: PREVIEW_COPY.en.enginesBody,
      },
      {
        icon: 'goal',
        title: PREVIEW_COPY.en.sessionsTitle,
        body: PREVIEW_COPY.en.sessionsBody,
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
        demo: 'browser',
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
  compare: {
    kicker: 'Compare',
    title: 'Compare Tobs',
    note: 'These articles use our former name, DeepSeekBot, and the versions stated in each comparison.',
    items: [
      {
        title: 'Tobs vs Grok Bot',
        description: 'Self-hosting, Git memory and model choice',
        href: '/en/blog/grokbot-alternative/',
      },
      {
        title: 'Tobs vs DS Bot',
        description: 'One DSH ecosystem, different ways to collaborate',
        href: '/en/blog/deepseekbot-vs-ds-bot/',
      },
      {
        title: 'Choosing a personal AI agent',
        description: 'Grok Bot, Muse, Dots and Cue',
        href: '/en/blog/personal-ai-agents-comparison/',
      },
    ],
  },
  faq: {
    kicker: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      {
        id: 'multiple-bots',
        question: 'If models are already this capable, why use more than one Bot?',
        answer:
          'Often you don’t need to. Most people do fine starting with a single assistant and adding more only when the work calls for it.',
        points: [
          'Multiple Bots start with clean context boundaries—just like separate Git repos keep research, writing, and releases from stepping on each other.',
          'Distinct roles need distinct system prompts and memory, and separating Bots also lets you scope permissions and folder access per job.',
          'If token budget is no concern, run your strongest model everywhere; when budget matters, you can route routine work to faster, lower-cost models.',
          'Think of a small startup: begin with one generalist, then bring in specialists once the workload justifies it.',
        ],
      },
      {
        id: 'affiliation',
        question: 'Is Tobs affiliated with DeepSeek?',
        answer:
          'No. Tobs is an independent open-source project and is not affiliated with or endorsed by DeepSeek. It runs as a plugin on DeepSeek Harness (DSH), adding persistent Bot identities, personas, Git memory, and collaboration.',
      },
      {
        id: 'project-identity',
        question: 'Which DeepSeek Bot is this? Is it the same as DS Bot?',
        answer:
          'Tobs is BotHarness’s MIT-licensed project, formerly called DeepSeekBot. Its website is tobs.app and its npm package is @botharness/tobs. DS Bot is a separate Apache-2.0 project maintained at Fei2411/DeepSeek-Bot and packaged as ds-bot.',
        links: [{ label: 'Compare Tobs and DS Bot', href: '/en/blog/deepseekbot-vs-ds-bot/' }],
      },
      {
        id: 'project-focus',
        question: 'How do Tobs and DS Bot differ in focus?',
        answer:
          'Tobs treats each Bot as a long-lived teammate that works beyond the DSH window—with inspectable Git memory, its own Lark / Slack / Discord / QQ / WeChat identity, scheduled tasks, delegated Assignments, and a Bot Marketplace. DS Bot turns DSH itself into a bot chat app, where a lead Bot (Chief) builds your team, a group admin coordinates replies, and a Usage view tracks tokens by Bot and model.',
      },
      {
        id: 'capabilities',
        question: 'What can Tobs help me do?',
        answer:
          'Create dedicated Bots for research, design, or engineering—chat with them one-on-one or bring them together in a Group to collaborate on shared context. Each Bot keeps its own identity and memory, works inside folders you authorize, and runs scheduled tasks while the app is open.',
      },
      {
        id: 'getting-started',
        question: 'How do I install Tobs and get started?',
        answer: `In DeepSeek Harness ${DSH_VERSION}, go to Plugins → Add plugin, then install and enable ${DESKTOP_PACKAGE}. Switch to Bot mode and set up a model, then create your first Bot.`,
        links: [{ label: 'Installation guide', href: '/en/docs/installation/' }],
      },
      {
        id: 'mobile-standalone',
        question: 'Can I use Tobs with just the mobile app?',
        answer:
          'Not yet. Tobs Bots run on a Windows, Linux, or macOS computer rather than directly on your phone. Think of the mobile app as a pocket remote: install DeepSeek Harness and Tobs on your computer first, then pair your phone to stay connected on the go.',
        links: [{ label: 'Install on your computer', href: '/en/docs/installation/' }],
      },
      {
        id: 'mobile-features',
        question: 'What can I do from my phone?',
        answer:
          'Chat with Bots in DMs and Groups, get push notifications, and review or approve tool requests in Activity. Your computer does the heavy lifting while your phone lets you check progress, reply, and approve actions from anywhere.',
      },
      {
        id: 'mobile-host-online',
        question: 'Does my computer need to stay on?',
        answer:
          'Yes. The computer needs to stay awake and online with DeepSeek Harness and Tobs running. If it shuts down, goes to sleep, or quits the app, your phone cannot reach its Bots until the Host comes back online.',
      },
      {
        id: 'mobile-connection',
        question: 'Do my phone and computer need to be on the same Wi-Fi?',
        answer:
          'No. Sign in to the same account via Connect, or set up Tailscale by following the pairing guide. Once configured, you can reach your Bots from anywhere as long as both devices have internet access.',
        links: [{ label: 'Connect your phone', href: '/en/docs/mobile-pairing/' }],
      },
      {
        id: 'mobile-multiple-hosts',
        question: 'Can one phone connect to multiple computers?',
        answer:
          'Yes. Install Tobs on each computer and connect them separately. From your phone, you can switch between Hosts or view messages and pending approvals across all of them in All Chats and Activity, while each computer keeps storing its own Bots and data.',
      },
      {
        id: 'models',
        question: 'Can I use models other than DeepSeek?',
        answer:
          'Yes. Tobs works with any compatible API or self-hosted model configured in DSH, and on a local Host you can also sign in with an eligible ChatGPT or Claude subscription through the official Codex or Claude Code CLI. Model availability depends on API compatibility, credentials, and your plan.',
        links: [{ label: 'Model setup', href: '/en/docs/model-setup/' }],
      },
      {
        id: 'team-preview',
        question: PREVIEW_COPY.en.teamQuestion,
        answer: PREVIEW_COPY.en.teamAnswer,
      },
      {
        id: 'engines-preview',
        question: PREVIEW_COPY.en.engineQuestion,
        answer: PREVIEW_COPY.en.engineAnswer,
      },
      {
        id: 'acp-preview',
        question: PREVIEW_COPY.en.acpTitle,
        answer: PREVIEW_COPY.en.acpBody,
        links: [
          {
            label: 'ACP integration discussion',
            href: 'https://github.com/BotHarness/DeepSeekBot/issues/4254',
          },
        ],
      },
      {
        id: 'sessions-preview',
        question: PREVIEW_COPY.en.sessionsQuestion,
        answer: PREVIEW_COPY.en.sessionsAnswer,
      },
      {
        id: 'cost',
        question: 'Does Tobs cost money to use?',
        answer:
          'Tobs is open source under the MIT license and permanently free to use, supported by sponsors. Any costs for model APIs, subscriptions, or hosting are billed directly by the third-party providers you choose—Tobs does not include free model credits.',
      },
      {
        id: 'data-and-access',
        question: 'Where is my data stored, and which files can Bots access?',
        answer:
          'The device running DSH stores Bot memory and chat history. Model calls send relevant context to the provider you configured. You grant folder access and set approval rules for tool actions. You can turn off anonymous plugin analytics, which exclude conversations and memory.',
        links: [
          { label: 'Folder permissions', href: '/en/docs/channel-sidebar/workspaces/' },
          { label: 'Privacy', href: '/en/privacy/' },
        ],
      },
      {
        id: 'chat-platforms',
        question: 'Which messaging platforms can I connect?',
        answer:
          'You can connect Feishu / Lark, Slack, Discord, QQ, and personal WeChat by setting up the platform app or account and binding it to a Bot. Personal WeChat currently supports one-to-one DMs from the account that scanned the QR code only; other platforms follow their own permissions and binding rules. WhatsApp, Telegram, and WeCom integrations are in development.',
        links: [{ label: 'Connections and optional tools', href: '/en/docs/capabilities/' }],
      },
    ],
  },
  video: {
    kicker: 'Video',
    title: 'Tobs in three minutes',
    lead: 'A pixel town of Bots with names and memories, each busy with its own work, and working together.',
    src: `${MEDIA_BASE}/pv/botharness-town-v19-1080p-lite-en.mp4`,
    poster: '/pv-poster-en-v1.png',
    label: 'Tobs promo video (English)',
    play: 'Play the video',
  },
  studio: {
    pageTitle: 'Avatar Studio · Tobs',
    kicker: 'BotPixel',
    title: 'Avatar Studio',
    lead: 'Swap species, hair, features and colors, or draw your own headpiece, hair and other parts, then download it. Your design is saved in this browser, and the companion on the home page wears it too.',
  },
  market: {
    pageTitle: 'Bot Marketplace · Tobs',
    kicker: MARKET_LABELS.en.kicker,
    title: 'Find a ready-made Bot',
    lead: 'Bots that people share as public GitHub repositories. Install one in Tobs and it becomes a new Bot with the Memory its author wrote.',
    shelvesLabel: 'Marketplace shelves',
    shelfBots: 'Bots',
    shelfPlugins: 'Plugins',
    searchLabel: 'Search Bots',
    searchPlaceholder: 'Search names, descriptions, topics or READMEs, then press Enter',
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
      body: 'Put its Memory in a public GitHub repository and add the botharness-bot topic: it is picked up daily. Or paste the repository URL into the Bot Marketplace inside Tobs to list it right away.',
      docs: 'Share a Bot: checks before publishing, a prompt to paste to your Bot, name and avatar',
    },
    open: 'Open {name}',
    back: MARKET_LABELS.en.back,
    github: MARKET_LABELS.en.github,
    stars: '★ {count}',
    updated: 'Updated {date}',
    notFound: 'This Bot is no longer in the Marketplace.',
    generatedBio: 'The author wrote no English bio; AI wrote this from the README',
    readmeLoading: 'Loading the README…',
    noReadme: 'This repository has no README.',
    gitUrl: 'Git repository URL',
    installTitle: 'Install it in Tobs',
    installSteps: [
      'In Tobs, click + above the message list in the sidebar, choose Bot Marketplace, search for this Bot and click Install.',
      'Or choose + → Create PersonaBot, set Memory source to Import from a Git repository and paste the URL above.',
    ],
    risk: 'This is a third-party repository: its files become the new Bot’s Memory and may contain harmful content or instructions the Bot will follow. Install only repositories you trust.',
    commit: 'Latest commit {sha} · {date}',
    getApp: 'Don’t have Tobs yet?',
    discover: {
      dailyPicks: MARKET_LABELS.en.dailyPicks,
      read: 'Read the daily picks: {title}',
      pastPicks: MARKET_LABELS.en.pastPicks,
      seePast: 'See past picks',
      noPast: 'No past picks yet.',
      digestMissing: 'This edition of the daily picks does not exist.',
      sections: MARKET_LABELS.en.sections,
      seeAll: 'See all',
      sectionEmpty: 'No Bots here yet.',
      allBots: MARKET_LABELS.en.allBots,
      installs: '↓ {count}',
      installsLabel: '{count} installs',
    },
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
      downloadUrl: 'https://www.deepseek.com/en/harness/',
    },
    lead: 'Requires Node.js 22 or later.',
    steps: [
      'Install DeepSeek Harness',
      'Add Tobs to the web Profile',
      'Start it and open Bot mode',
    ],
    next: {
      title: 'Installed? Choose connections and optional tools',
      button: 'Connections and setup',
      overview: 'All user guides',
    },
    copy: 'Copy',
    copied: 'Copied',
  },
  dsh: {
    title: 'Built on DeepSeek Harness',
    body: 'Tobs uses DSH’s session management and harness for API models. Bots can use compatible models configured in DSH, and Tobs can be installed alongside other DSH plugins. Some plugins may not be compatible yet; if you hit one, please open an issue or a PR.',
    issues: 'Open an issue on GitHub',
  },
  reviews: {
    kicker: 'Reviews',
    title: 'What people say',
    lead: 'Real feedback from our QQ group and community.',
    quotes: [
      'Clean and uncluttered. Lots of features, yet I find things fast.',
      'This is going to define an era!',
      'So many small clever touches and polished details.',
      'A little more polish on the Tobs frontend and I’m cancelling Grok Bot.',
      'I’ll give it one more look. If Musk can’t come up with a proper fix, I’m switching to Tobs entirely.',
    ],
  },
  community: {
    kicker: 'Community',
    title: 'Come say hi',
    lead: 'Questions, ideas and the Bots you build are all welcome.',
    discord: {
      title: 'Discord',
      body: 'Join the Tobs Discord server.',
      cta: 'Join Discord',
    },
    github: {
      title: 'GitHub',
      body: 'Explore the source, report a problem, or help improve Tobs.',
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
    community: 'QQ community group 1125565676',
    privacy: 'Privacy',
    terms: 'Terms of Service',
  },
};

export const COPY: Record<Lang, Copy> = { zh, en };
