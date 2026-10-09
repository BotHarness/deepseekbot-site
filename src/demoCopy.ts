import type { PixelSymbol } from '@botharness/pixel-avatar';

// Copy for the simulated Bot mode window under the Hero and the small demos beside each feature.
// Everything here is a scripted replay of what DeepSeekBot does; nothing talks to a model. Keep the
// scripts to features the main copy (src/content.ts) already claims.

/** One line in the Channel sidebar: a memory file, a commit, a session, a schedule, a member… */
export interface PanelItem {
  id: string;
  title: string;
  meta?: string;
  badge?: string;
  tone?: 'ok' | 'warn' | 'info';
}

/** A lucide icon, as the real app draws its sidebar sections and timeline events. */
export type DemoIcon =
  | 'members'
  | 'sessions'
  | 'files'
  | 'history'
  | 'schedules'
  | 'workspace'
  | 'asleep';

export interface PanelSection {
  id: string;
  icon: DemoIcon;
  title: string;
  items: PanelItem[];
}

/** Adds an item to a sidebar section, or replaces the one with the same id. */
export interface PanelPatch {
  section: string;
  item: PanelItem;
}

export type DemoStep =
  | { kind: 'user'; text: string }
  /** the Bot's avatar turns into each tool in turn while the status line names it */
  | { kind: 'work'; bot: string; tools: PixelSymbol[] }
  | { kind: 'bot'; bot: string; text: string }
  | { kind: 'checks'; bot: string; rows: { label: string; detail: string }[] }
  | { kind: 'event'; icon: DemoIcon; text: string; strong?: string }
  /** playback waits here until the visitor answers */
  | { kind: 'approval'; bot: string; text: string; detail: string };

export type DemoStepWithPanel = DemoStep & { panel?: PanelPatch[] };

export interface DemoChannel {
  id: string;
  kind: 'group' | 'dm';
  title: string;
  /** the DM's Bot, or the group members (the first one answers typed messages) */
  bots: string[];
  preview: string;
  time: string;
  steps: DemoStepWithPanel[];
  panel: PanelSection[];
}

export interface DemoCopy {
  kicker: string;
  title: string;
  lead: string;
  windowLabel: string;
  app: string;
  newChat: string;
  plugins: string;
  botMode: string;
  messages: string;
  human: string;
  you: string;
  today: string;
  working: string;
  composer: string;
  send: string;
  allow: string;
  deny: string;
  allowed: string;
  denied: string;
  waiting: string;
  replay: string;
  sidebar: string;
  hideSidebar: string;
  showSidebar: string;
  /** the reply to anything a visitor types */
  fallback: string;
  fallbackCta: string;
  note: string;
  channels: DemoChannel[];
}

export interface FeatureDemoCopy {
  identity: {
    label: string;
    bots: { name: string; role: string; soul: string[]; memory: string[] }[];
  };
  memory: {
    label: string;
    branch: string;
    changed: string;
    commits: { sha: string; message: string; time: string; file: string; diff: string[] }[];
  };
  groups: {
    label: string;
    policies: { all: string; digest: string; mentions: string; muted: string };
    policyLabel: string;
    messagesLabel: string;
    messages: { text: string; mentions: string[] }[];
    results: { woken: string; mentioned: string; digest: string; skipped: string; muted: string };
    members: { name: string; policy: 'all' | 'digest' | 'mentions' | 'muted' }[];
  };
  folders: {
    label: string;
    bot: string;
    alert: string;
    clear: string;
    approve: string;
    reset: string;
    jobs: { folder: string; title: string; ask?: string }[];
    status: { running: string; waiting: string; done: string };
  };
  schedules: {
    label: string;
    runNow: string;
    lock: string;
    unlock: string;
    locked: string;
    enable: string;
    paused: string;
    next: string;
    history: string;
    manual: string;
    handled: string;
    items: { name: string; when: string; next: string }[];
    initial: { name: string; time: string }[];
  };
}

const zhDemo: DemoCopy = {
  kicker: '实时演示',
  title: '看一组 Bot 怎么一起做事',
  lead: '这是 DeepSeekBot 的 Bot 模式。点左侧切换对话，替 Bot 做决定，或者直接发一句话试试。',
  windowLabel: 'DeepSeekBot Bot 模式的仿真界面',
  app: 'DeepSeek Harness',
  newChat: '新会话',
  plugins: '插件',
  botMode: 'Bot 模式',
  messages: '消息',
  human: 'Human',
  you: '你',
  today: '今天',
  working: '{bot} 正在{tool}…',
  composer: '发消息给 {name}',
  send: '发送',
  allow: '允许',
  deny: '先不',
  allowed: '你允许了',
  denied: '你拒绝了，Bot 不会访问这个文件夹',
  waiting: '等你回答，演示才会继续',
  replay: '再看一遍',
  sidebar: 'Channel sidebar',
  hideSidebar: '收起 Channel sidebar',
  showSidebar: '展开 Channel sidebar',
  fallback:
    '这里是预设脚本的演示，我还不能真的回答你。把 DeepSeekBot 装进 DeepSeek Harness，就能和真正的我聊了。',
  fallbackCta: '开始安装 →',
  note: '仿真演示：界面与对话是预设脚本，不连接模型，也不会发送你输入的内容。',
  channels: [
    {
      id: 'launch',
      kind: 'group',
      title: '发布小队',
      bots: ['Mira', 'Nova', 'Theo'],
      preview: 'Nova：定价页已改好，等你批准',
      time: '16:01',
      panel: [
        {
          id: 'members',
          icon: 'members',
          title: '成员',
          items: [
            { id: 'h', title: 'Human', badge: 'Human（你）' },
            { id: 'mira', title: 'Mira', meta: '研究', badge: '每条消息' },
            { id: 'nova', title: 'Nova', meta: '实现', badge: '每条消息' },
            { id: 'theo', title: 'Theo', meta: '设计', badge: '仅直接 @' },
          ],
        },
        {
          id: 'sessions',
          icon: 'sessions',
          title: '会话',
          items: [],
        },
      ],
      steps: [
        { kind: 'user', text: '@Mira 调研三家竞品的定价，@Nova 按结果更新我们的定价页。' },
        {
          kind: 'event',
          icon: 'asleep',
          text: 'Theo 设为「仅直接 @」，这条没有 @ 它，所以没有被叫醒',
        },
        {
          kind: 'work',
          bot: 'Mira',
          tools: ['web', 'fetch', 'write'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'r',
                title: '竞品定价调研',
                meta: 'Mira · ~/notes',
                badge: '运行中',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'checks',
          bot: 'Mira',
          rows: [
            { label: '网页搜索', detail: '3 家竞品定价页' },
            { label: '抓取网页', detail: '9 档套餐，2 家刚调过价' },
            { label: '写文件', detail: 'research/pricing.md' },
          ],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'r',
                title: '竞品定价调研',
                meta: 'Mira · ~/notes',
                badge: '已完成',
                tone: 'ok',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Mira',
          text: '整理好了。三家都把入门档降到了 ¥39 以下，细节在 research/pricing.md。@Nova 交给你。',
        },
        {
          kind: 'work',
          bot: 'Nova',
          tools: ['read', 'edit', 'bash'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: '更新定价页',
                meta: 'Nova · ~/code/site',
                badge: '运行中',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'approval',
          bot: 'Nova',
          text: 'Nova 想把定价页的改动推到 GitHub',
          detail: 'git push origin pricing-update',
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: '更新定价页',
                meta: 'Nova · ~/code/site',
                badge: '需要你批准',
                tone: 'warn',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Nova',
          text: '推好了，分支 pricing-update。入门档改成 ¥29，对比表也加上了，等你合并。',
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: '更新定价页',
                meta: 'Nova · ~/code/site',
                badge: '已完成',
                tone: 'ok',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'mira',
      kind: 'dm',
      title: 'Mira',
      bots: ['Mira'],
      preview: '每周五 17:30 我会发到这里',
      time: '15:42',
      panel: [
        {
          id: 'files',
          icon: 'files',
          title: '记忆文件',
          items: [
            { id: 'soul', title: 'SOUL.md' },
            { id: 'memory', title: 'MEMORY.md' },
            { id: 'notes', title: 'research/pricing.md' },
          ],
        },
        {
          id: 'commits',
          icon: 'history',
          title: '记忆演化',
          items: [{ id: 'c1', title: '整理竞品定价', meta: 'a41c9e2 · 昨天', badge: 'main' }],
        },
        {
          id: 'schedules',
          icon: 'schedules',
          title: '定时任务',
          items: [{ id: 's1', title: '每日早报', meta: '下次 明天 09:00', badge: '每天 09:00' }],
        },
      ],
      steps: [
        { kind: 'user', text: '以后每周五下午帮我汇总竞品动态。记住，我最关心定价变化。' },
        { kind: 'work', bot: 'Mira', tools: ['thinking', 'todo'] },
        {
          kind: 'event',
          icon: 'schedules',
          text: '创建了定时任务',
          strong: '竞品周报 · 每周五 17:30',
          panel: [
            {
              section: 'schedules',
              item: {
                id: 's2',
                title: '竞品周报',
                meta: '下次 周五 17:30',
                badge: '周五 17:30',
                tone: 'info',
              },
            },
          ],
        },
        { kind: 'work', bot: 'Mira', tools: ['write'] },
        {
          kind: 'event',
          icon: 'history',
          text: '记忆已更新',
          strong: 'MEMORY.md +1 行',
          panel: [
            {
              section: 'commits',
              item: {
                id: 'c2',
                title: '记住：最关心定价变化',
                meta: '7d03b51 · 刚刚',
                badge: 'HEAD',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Mira',
          text: '好。每周五 17:30 我会把汇总发到这里，定价变化放在最前面。这条我记进了 MEMORY.md，换个文件夹工作也记得。',
        },
      ],
    },
    {
      id: 'nova',
      kind: 'dm',
      title: 'Nova',
      bots: ['Nova'],
      preview: '两个仓库都升到 1.2.0 了',
      time: '14:18',
      panel: [
        {
          id: 'sessions',
          icon: 'sessions',
          title: '会话',
          items: [{ id: 'main', title: '主会话', meta: '盯着 Bot 收件箱', badge: '空闲' }],
        },
        {
          id: 'grants',
          icon: 'workspace',
          title: '工作区授权',
          items: [{ id: 'api', title: '~/code/api', meta: '读写' }],
        },
      ],
      steps: [
        { kind: 'user', text: '把 api 和 web 两个仓库的版本号都升到 1.2.0。' },
        {
          kind: 'work',
          bot: 'Nova',
          tools: ['search', 'read'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'api',
                title: '升级版本号',
                meta: '~/code/api',
                badge: '运行中',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'approval',
          bot: 'Nova',
          text: 'Nova 想写入 ~/code/web，这个文件夹还没有授权',
          detail: '授权后，Nova 在这个文件夹里也能读写',
        },
        {
          kind: 'event',
          icon: 'sessions',
          text: '新开了一个会话',
          strong: '~/code/web',
          panel: [
            {
              section: 'grants',
              item: { id: 'web', title: '~/code/web', meta: '读写', tone: 'ok' },
            },
            {
              section: 'sessions',
              item: {
                id: 'web',
                title: '升级版本号',
                meta: '~/code/web',
                badge: '运行中',
                tone: 'info',
              },
            },
          ],
        },
        { kind: 'work', bot: 'Nova', tools: ['edit', 'bash'] },
        {
          kind: 'checks',
          bot: 'Nova',
          rows: [
            { label: '~/code/api', detail: '1.1.4 → 1.2.0 · 测试通过' },
            { label: '~/code/web', detail: '1.1.4 → 1.2.0 · 构建通过' },
          ],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'api',
                title: '升级版本号',
                meta: '~/code/api',
                badge: '已完成',
                tone: 'ok',
              },
            },
            {
              section: 'sessions',
              item: {
                id: 'web',
                title: '升级版本号',
                meta: '~/code/web',
                badge: '已完成',
                tone: 'ok',
              },
            },
          ],
        },
        { kind: 'bot', bot: 'Nova', text: '两个仓库都升到 1.2.0 了，各自开了分支，等你合并。' },
      ],
    },
  ],
};

const enDemo: DemoCopy = {
  kicker: 'Live demo',
  title: 'Watch a crew of Bots get work done',
  lead: 'This is DeepSeekBot’s Bot mode. Switch chats on the left, make the call when a Bot asks, or type a message yourself.',
  windowLabel: 'A simulation of DeepSeekBot’s Bot mode',
  app: 'DeepSeek Harness',
  newChat: 'New chat',
  plugins: 'Plugins',
  botMode: 'Bot mode',
  messages: 'Messages',
  human: 'Human',
  you: 'you',
  today: 'Today',
  working: '{bot} · {tool}…',
  composer: 'Message {name}',
  send: 'Send',
  allow: 'Allow',
  deny: 'Not now',
  allowed: 'You allowed',
  denied: 'You declined; the Bot stays out of that folder',
  waiting: 'The demo waits for your answer',
  replay: 'Replay',
  sidebar: 'Channel sidebar',
  hideSidebar: 'Hide the Channel sidebar',
  showSidebar: 'Show the Channel sidebar',
  fallback:
    'This demo plays a script, so I can’t really answer you yet. Add DeepSeekBot to DeepSeek Harness and you can talk to the real me.',
  fallbackCta: 'Install →',
  note: 'Simulated demo: the interface and chats are a script. Nothing talks to a model, and nothing you type is sent.',
  channels: [
    {
      id: 'launch',
      kind: 'group',
      title: 'Launch crew',
      bots: ['Mira', 'Nova', 'Theo'],
      preview: 'Nova: pricing page is ready for review',
      time: '16:01',
      panel: [
        {
          id: 'members',
          icon: 'members',
          title: 'Members',
          items: [
            { id: 'h', title: 'Human', badge: 'Human (you)' },
            { id: 'mira', title: 'Mira', meta: 'Research', badge: 'Every message' },
            { id: 'nova', title: 'Nova', meta: 'Engineering', badge: 'Every message' },
            { id: 'theo', title: 'Theo', meta: 'Design', badge: 'Mentions only' },
          ],
        },
        { id: 'sessions', icon: 'sessions', title: 'Sessions', items: [] },
      ],
      steps: [
        {
          kind: 'user',
          text: '@Mira look into three competitors’ pricing, and @Nova update our pricing page from it.',
        },
        {
          kind: 'event',
          icon: 'asleep',
          text: 'Theo is on mentions only and wasn’t @-ed, so it stays asleep',
        },
        {
          kind: 'work',
          bot: 'Mira',
          tools: ['web', 'fetch', 'write'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'r',
                title: 'Competitor pricing',
                meta: 'Mira · ~/notes',
                badge: 'Running',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'checks',
          bot: 'Mira',
          rows: [
            { label: 'Web search', detail: '3 competitor pricing pages' },
            { label: 'Fetch', detail: '9 plans, 2 repriced this month' },
            { label: 'Write', detail: 'research/pricing.md' },
          ],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'r',
                title: 'Competitor pricing',
                meta: 'Mira · ~/notes',
                badge: 'Done',
                tone: 'ok',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Mira',
          text: 'Done. All three dropped their entry plan below $6; details in research/pricing.md. @Nova over to you.',
        },
        {
          kind: 'work',
          bot: 'Nova',
          tools: ['read', 'edit', 'bash'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: 'Update pricing page',
                meta: 'Nova · ~/code/site',
                badge: 'Running',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'approval',
          bot: 'Nova',
          text: 'Nova wants to push the pricing page changes to GitHub',
          detail: 'git push origin pricing-update',
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: 'Update pricing page',
                meta: 'Nova · ~/code/site',
                badge: 'Needs approval',
                tone: 'warn',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Nova',
          text: 'Pushed to pricing-update. The entry plan is now $4 and there’s a comparison table, ready for you to merge.',
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'p',
                title: 'Update pricing page',
                meta: 'Nova · ~/code/site',
                badge: 'Done',
                tone: 'ok',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'mira',
      kind: 'dm',
      title: 'Mira',
      bots: ['Mira'],
      preview: 'Every Friday at 17:30, right here',
      time: '15:42',
      panel: [
        {
          id: 'files',
          icon: 'files',
          title: 'Memory files',
          items: [
            { id: 'soul', title: 'SOUL.md' },
            { id: 'memory', title: 'MEMORY.md' },
            { id: 'notes', title: 'research/pricing.md' },
          ],
        },
        {
          id: 'commits',
          icon: 'history',
          title: 'Memory history',
          items: [
            {
              id: 'c1',
              title: 'Sort competitor pricing',
              meta: 'a41c9e2 · yesterday',
              badge: 'main',
            },
          ],
        },
        {
          id: 'schedules',
          icon: 'schedules',
          title: 'Scheduled tasks',
          items: [
            {
              id: 's1',
              title: 'Morning brief',
              meta: 'Next: tomorrow 09:00',
              badge: 'Daily 09:00',
            },
          ],
        },
      ],
      steps: [
        {
          kind: 'user',
          text: 'Every Friday afternoon, round up what competitors did. And remember: pricing changes matter most to me.',
        },
        { kind: 'work', bot: 'Mira', tools: ['thinking', 'todo'] },
        {
          kind: 'event',
          icon: 'schedules',
          text: 'Created a scheduled task',
          strong: 'Competitor digest · Fridays 17:30',
          panel: [
            {
              section: 'schedules',
              item: {
                id: 's2',
                title: 'Competitor digest',
                meta: 'Next: Fri 17:30',
                badge: 'Fri 17:30',
                tone: 'info',
              },
            },
          ],
        },
        { kind: 'work', bot: 'Mira', tools: ['write'] },
        {
          kind: 'event',
          icon: 'history',
          text: 'Memory updated',
          strong: 'MEMORY.md +1 line',
          panel: [
            {
              section: 'commits',
              item: {
                id: 'c2',
                title: 'Remember: pricing first',
                meta: '7d03b51 · just now',
                badge: 'HEAD',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Mira',
          text: 'Got it. Every Friday at 17:30 the digest lands here, pricing changes first. That’s in MEMORY.md now, so I’ll remember it in any folder.',
        },
      ],
    },
    {
      id: 'nova',
      kind: 'dm',
      title: 'Nova',
      bots: ['Nova'],
      preview: 'Both repos are on 1.2.0',
      time: '14:18',
      panel: [
        {
          id: 'sessions',
          icon: 'sessions',
          title: 'Sessions',
          items: [
            { id: 'main', title: 'Main session', meta: 'Watching the Bot Inbox', badge: 'Idle' },
          ],
        },
        {
          id: 'grants',
          icon: 'workspace',
          title: 'Workspace access',
          items: [{ id: 'api', title: '~/code/api', meta: 'Read & write' }],
        },
      ],
      steps: [
        { kind: 'user', text: 'Bump the version in both the api and web repos to 1.2.0.' },
        {
          kind: 'work',
          bot: 'Nova',
          tools: ['search', 'read'],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'api',
                title: 'Bump version',
                meta: '~/code/api',
                badge: 'Running',
                tone: 'info',
              },
            },
          ],
        },
        {
          kind: 'approval',
          bot: 'Nova',
          text: 'Nova wants to write to ~/code/web, which isn’t authorized yet',
          detail: 'Once allowed, Nova can read and write in that folder too',
        },
        {
          kind: 'event',
          icon: 'sessions',
          text: 'Started another session in',
          strong: '~/code/web',
          panel: [
            {
              section: 'grants',
              item: { id: 'web', title: '~/code/web', meta: 'Read & write', tone: 'ok' },
            },
            {
              section: 'sessions',
              item: {
                id: 'web',
                title: 'Bump version',
                meta: '~/code/web',
                badge: 'Running',
                tone: 'info',
              },
            },
          ],
        },
        { kind: 'work', bot: 'Nova', tools: ['edit', 'bash'] },
        {
          kind: 'checks',
          bot: 'Nova',
          rows: [
            { label: '~/code/api', detail: '1.1.4 → 1.2.0 · tests pass' },
            { label: '~/code/web', detail: '1.1.4 → 1.2.0 · build passes' },
          ],
          panel: [
            {
              section: 'sessions',
              item: {
                id: 'api',
                title: 'Bump version',
                meta: '~/code/api',
                badge: 'Done',
                tone: 'ok',
              },
            },
            {
              section: 'sessions',
              item: {
                id: 'web',
                title: 'Bump version',
                meta: '~/code/web',
                badge: 'Done',
                tone: 'ok',
              },
            },
          ],
        },
        {
          kind: 'bot',
          bot: 'Nova',
          text: 'Both repos are on 1.2.0, each on its own branch, ready for you to merge.',
        },
      ],
    },
  ],
};

const zhFeatureDemos: FeatureDemoCopy = {
  identity: {
    label: '选一个 Bot，看它的 SOUL.md 和 MEMORY.md',
    bots: [
      {
        name: 'Mira',
        role: '研究',
        soul: [
          '# Mira',
          '你是研究员。先找一手资料，再下结论。',
          '',
          '## 表达',
          '- 先说结论，再给出处',
          '- 不确定就直说不确定',
        ],
        memory: [
          '# 核心记忆',
          '- 用户最关心定价变化',
          '- 竞品清单在 research/competitors.md',
          '- 周报每周五 17:30 发到私聊',
        ],
      },
      {
        name: 'Theo',
        role: '设计',
        soul: [
          '# Theo',
          '你是设计师，在意一致性和可读性。',
          '',
          '## 工作原则',
          '- 改之前先截图对比',
          '- 一次只提一个方向',
        ],
        memory: [
          '# 核心记忆',
          '- 品牌色 #3d5afe，像素风',
          '- 用户不喜欢渐变按钮',
          '- 设计稿在 ~/design/site',
        ],
      },
      {
        name: 'Nova',
        role: '实现',
        soul: [
          '# Nova',
          '你是工程师。小步提交，测试先过再说完成。',
          '',
          '## 边界',
          '- 推送和发布前先问',
          '- 不碰没授权的文件夹',
        ],
        memory: [
          '# 核心记忆',
          '- api 用 pnpm，web 用 vite',
          '- 发版前跑 pnpm verify',
          '- 分支名用 feat/ 或 fix/ 开头',
        ],
      },
    ],
  },
  memory: {
    label: '点一个 commit，看这次记住了什么',
    branch: 'main',
    changed: '改动文件',
    commits: [
      {
        sha: '7d03b51',
        message: '记住：最关心定价变化',
        time: '刚刚',
        file: 'MEMORY.md',
        diff: [' # 核心记忆', ' - 竞品清单在 research/competitors.md', '+- 用户最关心定价变化'],
      },
      {
        sha: 'a41c9e2',
        message: '整理竞品定价',
        time: '昨天',
        file: 'research/pricing.md',
        diff: [
          '+# 竞品定价',
          '+| 竞品 | 入门档 | 变化 |',
          '+| A | ¥39 | 降 ¥10 |',
          '+| B | ¥35 | 新增 |',
        ],
      },
      {
        sha: '3be8f10',
        message: '调整表达：先说结论',
        time: '3 天前',
        file: 'SOUL.md',
        diff: [' ## 表达', '-- 按时间顺序讲清楚', '+- 先说结论，再给出处'],
      },
      {
        sha: 'b173048',
        message: 'Initialize memory repository',
        time: '上周',
        file: '.gitattributes',
        diff: ['+* text=auto eol=lf'],
      },
    ],
  },
  groups: {
    label: '给每个成员选提醒方式，再看一条消息会叫醒谁',
    policyLabel: '{name} 的消息提醒',
    policies: { all: '每条消息', digest: '消息汇总', mentions: '仅直接 @', muted: '静默收件' },
    messagesLabel: '发到群里',
    messages: [
      { text: '今天的发布延后到周五。', mentions: [] },
      { text: '@Theo 帮忙看下新首页的配色。', mentions: ['Theo'] },
    ],
    results: {
      woken: '被叫醒',
      mentioned: '被 @，一定叫醒',
      digest: '攒进汇总，到条数或时间再看',
      skipped: '没 @ 它，继续睡',
      muted: '静默收进收件箱',
    },
    members: [
      { name: 'Mira', policy: 'all' },
      { name: 'Theo', policy: 'mentions' },
      { name: 'Nova', policy: 'digest' },
    ],
  },
  folders: {
    label: '同一个 Bot，三个文件夹里的三项工作',
    bot: 'Nova',
    alert: '1 项需要你批准',
    clear: '没有等你处理的事',
    approve: '批准',
    reset: '重来',
    jobs: [
      { folder: '~/code/api', title: '升级依赖' },
      { folder: '~/code/web', title: '更新定价页', ask: '想运行 git push origin pricing-update' },
      { folder: '~/notes', title: '整理周报' },
    ],
    status: { running: '运行中', waiting: '需要你批准', done: '已完成' },
  },
  schedules: {
    label: '试试立即运行、锁定和暂停',
    runNow: '立即运行',
    lock: '锁定，Bot 不能修改',
    unlock: '解锁',
    locked: '已锁定',
    enable: '启用',
    paused: '已暂停',
    next: '下次 {when}',
    history: '处理记录',
    manual: '手动触发',
    handled: '{name} · Mira 已处理',
    items: [
      { name: '每日早报', when: '每天 09:00', next: '明天 09:00' },
      { name: '竞品周报', when: '周五 17:30', next: '周五 17:30' },
      { name: '构建巡检', when: '每 30 分钟', next: '15:47' },
    ],
    initial: [
      { name: '构建巡检', time: '15:17' },
      { name: '每日早报', time: '09:00' },
    ],
  },
};

const enFeatureDemos: FeatureDemoCopy = {
  identity: {
    label: 'Pick a Bot to read its SOUL.md and MEMORY.md',
    bots: [
      {
        name: 'Mira',
        role: 'Research',
        soul: [
          '# Mira',
          'You are a researcher. Primary sources first, conclusions second.',
          '',
          '## Voice',
          '- Lead with the answer, then the source',
          '- Say so when you are unsure',
        ],
        memory: [
          '# Core memory',
          '- Pricing changes matter most to the user',
          '- Competitor list: research/competitors.md',
          '- Weekly digest goes to the DM, Fri 17:30',
        ],
      },
      {
        name: 'Theo',
        role: 'Design',
        soul: [
          '# Theo',
          'You are a designer who cares about consistency and legibility.',
          '',
          '## Principles',
          '- Screenshot before and after every change',
          '- Propose one direction at a time',
        ],
        memory: [
          '# Core memory',
          '- Brand color #3d5afe, pixel style',
          '- The user dislikes gradient buttons',
          '- Mockups live in ~/design/site',
        ],
      },
      {
        name: 'Nova',
        role: 'Engineering',
        soul: [
          '# Nova',
          'You are an engineer. Small commits; it is done when tests pass.',
          '',
          '## Boundaries',
          '- Ask before pushing or releasing',
          '- Stay out of folders you were not given',
        ],
        memory: [
          '# Core memory',
          '- api uses pnpm, web uses vite',
          '- Run pnpm verify before a release',
          '- Branches start with feat/ or fix/',
        ],
      },
    ],
  },
  memory: {
    label: 'Click a commit to see what the Bot learned',
    branch: 'main',
    changed: 'Changed files',
    commits: [
      {
        sha: '7d03b51',
        message: 'Remember: pricing first',
        time: 'just now',
        file: 'MEMORY.md',
        diff: [
          ' # Core memory',
          ' - Competitor list: research/competitors.md',
          '+- Pricing changes matter most to the user',
        ],
      },
      {
        sha: 'a41c9e2',
        message: 'Sort competitor pricing',
        time: 'yesterday',
        file: 'research/pricing.md',
        diff: [
          '+# Competitor pricing',
          '+| Name | Entry plan | Change |',
          '+| A | $6 | -$2 |',
          '+| B | $5 | new |',
        ],
      },
      {
        sha: '3be8f10',
        message: 'Voice: lead with the answer',
        time: '3 days ago',
        file: 'SOUL.md',
        diff: [' ## Voice', '-- Tell it in order', '+- Lead with the answer, then the source'],
      },
      {
        sha: 'b173048',
        message: 'Initialize memory repository',
        time: 'last week',
        file: '.gitattributes',
        diff: ['+* text=auto eol=lf'],
      },
    ],
  },
  groups: {
    label: 'Pick how each member is notified, then see who a message wakes',
    policyLabel: 'Notifications for {name}',
    policies: {
      all: 'Every message',
      digest: 'Digest',
      mentions: 'Mentions only',
      muted: 'Silent',
    },
    messagesLabel: 'Post to the Group',
    messages: [
      { text: 'Today’s release moves to Friday.', mentions: [] },
      { text: '@Theo can you check the new homepage colors?', mentions: ['Theo'] },
    ],
    results: {
      woken: 'Woken up',
      mentioned: '@-ed, always woken',
      digest: 'Held for the digest',
      skipped: 'Not @-ed, keeps sleeping',
      muted: 'Filed silently in the inbox',
    },
    members: [
      { name: 'Mira', policy: 'all' },
      { name: 'Theo', policy: 'mentions' },
      { name: 'Nova', policy: 'digest' },
    ],
  },
  folders: {
    label: 'One Bot, three jobs in three folders',
    bot: 'Nova',
    alert: '1 needs your approval',
    clear: 'Nothing waiting on you',
    approve: 'Approve',
    reset: 'Reset',
    jobs: [
      { folder: '~/code/api', title: 'Upgrade dependencies' },
      {
        folder: '~/code/web',
        title: 'Update pricing page',
        ask: 'wants to run git push origin pricing-update',
      },
      { folder: '~/notes', title: 'Write the weekly report' },
    ],
    status: { running: 'Running', waiting: 'Needs approval', done: 'Done' },
  },
  schedules: {
    label: 'Try run now, lock and pause',
    runNow: 'Run now',
    lock: 'Lock against Bot edits',
    unlock: 'Unlock',
    locked: 'Locked',
    enable: 'Enabled',
    paused: 'Paused',
    next: 'Next {when}',
    history: 'History',
    manual: 'Manual run',
    handled: '{name} · handled by Mira',
    items: [
      { name: 'Morning brief', when: 'Daily 09:00', next: 'tomorrow 09:00' },
      { name: 'Competitor digest', when: 'Fri 17:30', next: 'Fri 17:30' },
      { name: 'Build check', when: 'Every 30 min', next: '15:47' },
    ],
    initial: [
      { name: 'Build check', time: '15:17' },
      { name: 'Morning brief', time: '09:00' },
    ],
  },
};

export const ZH_DEMO = zhDemo;
export const EN_DEMO = enDemo;
export const ZH_FEATURE_DEMOS = zhFeatureDemos;
export const EN_FEATURE_DEMOS = enFeatureDemos;
