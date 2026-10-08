export const COMPANION_SESSION_KEY = 'dsb-companion-v1';
export interface CompanionChoices {
  invited: boolean;
  hidden: boolean;
  walking: boolean;
  quiet: boolean;
}
export const defaultChoices = (): CompanionChoices => ({
  invited: false,
  hidden: false,
  walking: true,
  quiet: false,
});
export function loadChoices(storage: Pick<Storage, 'getItem'> | undefined): CompanionChoices {
  try {
    const stored = JSON.parse(storage?.getItem(COMPANION_SESSION_KEY) ?? '{}');
    return {
      invited: stored.invited === true,
      hidden: stored.hidden === true,
      walking: stored.walking !== false,
      quiet: stored.quiet === true,
    };
  } catch {
    return defaultChoices();
  }
}
export function saveChoices(
  storage: Pick<Storage, 'setItem'> | undefined,
  choices: CompanionChoices,
) {
  try {
    storage?.setItem(COMPANION_SESSION_KEY, JSON.stringify(choices));
  } catch {
    /* private browsing: keep the in-memory choice */
  }
}
export type GuideMessage =
  | 'welcome'
  | 'drop'
  | 'drag'
  | 'land'
  | 'community'
  | 'bots'
  | 'appearance';
const GUIDE_SEQUENCE = ['welcome', 'bots', 'appearance', 'community'] as const;
/** Explicit taps vary the conversation; no timer replaces a message being read. */
export function nextGuideMessage(current: GuideMessage | undefined): GuideMessage {
  const index = GUIDE_SEQUENCE.findIndex((message) => message === current);
  return GUIDE_SEQUENCE[(index + 1) % GUIDE_SEQUENCE.length]!;
}
export const COMPANION_COPY = {
  zh: {
    label: '官网 Bot 伴侣',
    talk: '和 Bot 互动',
    restore: '叫回 Bot',
    close: '收起对话',
    hint: '可以拖动我；方向键移动，点击或 Enter 聊聊，Esc 收起。',
    discord: '加入 Discord',
    qq: '加入 QQ 群',
    qqHint: '点击复制群号，再到 QQ 搜索加入',
    copied: '群号已复制',
    failed: '复制失败，请重试，或到页面底部社区查看群号。',
    busy: '复制中…',
    messages: {
      welcome: '嗨！我是这里的 Bot。一起逛逛吧，想聊想法也欢迎来我们的社区。',
      drop: '我跳下来，陪你继续看。',
      drag: '轻一点，抓稳啦！',
      land: '稳稳落地！有想做的 Bot 吗？社区里可以一起聊聊。',
      community: '看得有兴趣？来社区一起聊聊你想做的 Bot 吧。',
      bots: '每个 Bot 都有自己的名字、人格和记忆，也能跨文件夹工作。下面的能力区有介绍。',
      appearance: '下面可以给我换发型、衣服和颜色。捏好我的新形象，也欢迎带到社区分享。',
    },
  },
  en: {
    label: 'Website Bot companion',
    talk: 'Talk to the Bot',
    restore: 'Bring back the Bot',
    close: 'Close conversation',
    hint: 'Drag me; use arrow keys to move, click or Enter to chat, and Esc to close.',
    discord: 'Join Discord',
    qq: 'Join QQ',
    qqHint: 'Copy the group number, then search for it in QQ to join',
    copied: 'Group number copied',
    failed: 'Copy failed. Try again, or find the number in the Community section below.',
    busy: 'Copying…',
    messages: {
      welcome: 'Hi! Explore with me, and come share your ideas in our community.',
      drop: 'Let me hop down and keep you company.',
      drag: 'Easy there — hold on tight!',
      land: 'Landed! Got a Bot in mind? Come talk it through with our community.',
      community: 'Interested? Come chat with us about the Bot you would like to build.',
      bots: 'Every Bot has a name, personality and memory, and can work across folders. Explore the Features section below.',
      appearance:
        'Change my hair, clothes and colors below. Share the new look you make for me with our community, too.',
    },
  },
} as const;
