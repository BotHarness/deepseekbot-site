// The DeepSeekBot user guides on botharness.ai/docs, in its sidebar order. Titles and
// descriptions come from BotHarness scripts/sync-docs.mjs, or the .mdx frontmatter when absent.
export const DOC_PAGES = [
  {
    slug: 'channel-sidebar',
    order: 15,
    en: {
      source: 'docs/channel-sidebar/index.md',
      title: 'Channel sidebar',
      description:
        'Find the tools beside a Bot chat or group, then open the matching feature guide.',
    },
    zh: {
      source: 'docs/channel-sidebar/index.zh.md',
      title: 'Channel sidebar',
      description: '了解 Bot 私聊与群聊旁的功能入口，并按功能打开操作教程。',
    },
  },
  {
    slug: 'channel-sidebar/memory-files',
    order: 1,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/memory-files.md',
      title: 'Memory files',
      description: 'Browse a Bot’s current Memory files and inspect their contents.',
    },
    zh: {
      source: 'docs/channel-sidebar/memory-files.zh.md',
      title: '记忆文件',
      description: '浏览 Bot 当前的记忆文件，并在聊天主体中查看内容。',
    },
  },
  {
    slug: 'channel-sidebar/memory-evolution',
    order: 2,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/memory-evolution.md',
      title: 'Memory evolution',
      description:
        'Inspect working changes, Git history, branch requests and recovery checkpoints.',
    },
    zh: {
      source: 'docs/channel-sidebar/memory-evolution.zh.md',
      title: '记忆演化',
      description: '查看未提交改动、Git 历史、分支请求与恢复检查点。',
    },
  },
  {
    slug: 'channel-sidebar/sessions',
    order: 3,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/sessions.md',
      title: 'Sessions',
      description: 'Open a Bot’s owned DSH Sessions and choose the list scope and layout.',
    },
    zh: {
      source: 'docs/channel-sidebar/sessions.zh.md',
      title: '会话',
      description: '打开 Bot 所属的 DSH 会话，并调整列表范围与排列方式。',
    },
  },
  {
    slug: 'channel-sidebar/bot-inbox',
    order: 4,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/bot-inbox.md',
      title: 'Bot Inbox',
      description:
        'Inspect a Bot’s received items, their processing state and their original source.',
    },
    zh: {
      source: 'docs/channel-sidebar/bot-inbox.zh.md',
      title: 'Bot 收件箱',
      description: '检查 Bot 收件、处理状态，并打开对应的原始来源。',
    },
  },
  {
    slug: 'channel-sidebar/workspaces',
    order: 5,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/workspaces.md',
      title: 'Workspace Grants',
      description: 'Review a Bot’s folders and understand the separate task and tool permissions.',
    },
    zh: {
      source: 'docs/channel-sidebar/workspaces.zh.md',
      title: '工作区授权',
      description: '查看 Bot 可用的文件夹，区分文件夹授权、任务权限与工具批准。',
    },
  },
  {
    slug: 'channel-sidebar/groups',
    order: 6,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/groups.md',
      title: 'Members and group management',
      description: 'Manage a local group’s members, invitations, attention settings and identity.',
    },
    zh: {
      source: 'docs/channel-sidebar/groups.zh.md',
      title: '成员与群管理',
      description: '管理本地群聊的成员、邀请、提醒设置与群信息。',
    },
  },
  {
    slug: 'channel-sidebar/display',
    order: 7,
    parent: 'channel-sidebar',
    en: {
      source: 'docs/channel-sidebar/display.md',
      title: 'Display and layout',
      description:
        'Resize, reorder and hide sidebar entries, with explicit save and cancel behavior.',
    },
    zh: {
      source: 'docs/channel-sidebar/display.zh.md',
      title: '显示与布局',
      description: '调整侧栏宽度、项目顺序与显示，了解完成和取消的作用。',
    },
  },
  {
    slug: 'wechat-connection',
    order: 25,
    en: {
      source: 'docs/wechat-connection.md',
      title: 'Connect a Bot to personal WeChat',
      description:
        'Pair a WeChat Bot, authorize owner text DMs and verify original-conversation replies.',
    },
    zh: {
      source: 'docs/wechat-connection.zh.md',
      title: '连接个人微信',
      description: '扫码绑定微信 Bot、授权扫码者文字私聊，并核对原会话回复。',
    },
  },
  {
    slug: 'model-setup',
    order: 13,
    en: {
      source: 'docs/model-setup.md',
      title: 'API and Bot models',
      description: 'Configure API providers, choose each Bot’s models and verify its model preset.',
    },
    zh: {
      source: 'docs/model-setup.zh.md',
      title: 'API 与 Bot 模型',
      description: '配置 API 提供商，为每个 Bot 选择模型并验证模型预设。',
    },
  },
  {
    slug: 'settings',
    order: 14,
    en: {
      source: 'docs/settings.md',
      title: 'Settings guide',
      description: 'Find non-IM settings, understand each field and its application scope.',
    },
    zh: {
      source: 'docs/settings.zh.md',
      title: '设置指南',
      description: '找到非 IM 设置入口，了解每个参数、默认值与生效范围。',
    },
  },
  {
    slug: 'installation',
    order: 12,
    en: {
      source: 'docs/installation.md',
      title: 'Install DeepSeekBot',
      description: 'Import the public npm plugin in DSH, enable Bot mode and create a PersonaBot.',
    },
    zh: {
      source: 'docs/installation.zh.md',
      title: '安装 DeepSeekBot',
      description: '通过 DSH 导入公开 npm 插件，启用 Bot 模式并创建 PersonaBot。',
    },
  },
  {
    slug: 'slack-connection',
    order: 24,
    en: {
      source: 'docs/slack-connection.md',
      title: 'Connect a Bot to Slack',
      description:
        'Configure a Slack app, bind a Bot identity and verify authorized public-channel messages.',
    },
    zh: {
      source: 'docs/slack-connection.zh.md',
      title: '连接 Slack',
      description: '配置 Slack 应用、绑定 Bot 身份，并验证已授权公共频道的收件与原话题回复。',
    },
  },
  {
    slug: 'lark-connection',
    order: 23,
    en: {
      source: 'docs/lark-connection.md',
      title: 'Connect a Bot to Lark / Feishu',
      description:
        'Set up an application bot, bind its identity and route authorized group messages.',
    },
    zh: {
      source: 'docs/lark-connection.zh.md',
      title: '连接 Lark / 飞书',
      description: '配置应用机器人、绑定外部身份，并把授权群消息接入 Bot 收件箱或频道。',
    },
  },
  {
    slug: 'daily-browser',
    order: 22,
    en: {
      source: 'docs/daily-browser.md',
      title: 'Share a browser tab',
      description: 'Explicitly lend one daily-browser tab read-only to a PersonaBot.',
    },
    zh: {
      source: 'docs/daily-browser.zh.md',
      title: '分享浏览器标签页',
      description: '将日常浏览器的一个标签页明确借给 PersonaBot 只读观察。',
    },
  },
  {
    slug: 'file-open',
    order: 21,
    en: {
      source: 'docs/file-open.md',
      title: 'Open files on the Host',
      description: 'Open Memory, Workspace and message files in native applications.',
    },
    zh: {
      source: 'docs/file-open.zh.md',
      title: '在 Host 上打开文件',
      description: '在系统软件中打开 Memory、Workspace 和消息文件。',
    },
  },
  {
    slug: 'share-bot',
    order: 26,
    en: {
      source: 'docs/share-bot.md',
      title: 'Share a Bot',
      description: 'Publish a Bot’s Memory to GitHub and list it in the Bot Marketplace.',
    },
    zh: {
      source: 'docs/share-bot.zh.md',
      title: '分享 Bot',
      description: '把 Bot 的 Memory 发布到 GitHub，并收录进 Bot 市场。',
    },
  },
  {
    slug: 'overview',
    en: {
      source: 'apps/docs/src/content/docs/docs/overview.mdx',
    },
    zh: {
      source: 'apps/docs/src/content/docs-zh/docs/overview.mdx',
    },
  },
  {
    slug: 'quickstart',
    en: {
      source: 'apps/docs/src/content/docs/docs/quickstart.mdx',
    },
    zh: {
      source: 'apps/docs/src/content/docs-zh/docs/quickstart.mdx',
    },
  },
  {
    slug: 'slides',
    en: {
      source: 'apps/docs/src/content/docs/docs/slides.mdx',
    },
    zh: {
      source: 'apps/docs/src/content/docs-zh/docs/slides.mdx',
    },
  },
  {
    slug: 'computer-export',
    en: {
      source: 'apps/docs/src/content/docs/docs/computer-export.mdx',
    },
    zh: {
      source: 'apps/docs/src/content/docs-zh/docs/computer-export.mdx',
    },
  },
  {
    slug: 'concepts',
    en: {
      source: 'apps/docs/src/content/docs/docs/concepts.mdx',
    },
    zh: {
      source: 'apps/docs/src/content/docs-zh/docs/concepts.mdx',
    },
  },
];
