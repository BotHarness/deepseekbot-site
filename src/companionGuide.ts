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
export const COMPANION_COPY = {
  zh: {
    label: '官网 Bot 伴侣',
    settings: '伴侣设置',
    talk: '和 Bot 互动',
    restore: '叫回 Bot',
    close: '收起对话',
    hide: '隐藏 Bot',
    pause: '暂停散步',
    resume: '继续散步',
    quiet: '减少动作',
    animated: '开启动作',
    guide: '预设互动导览',
    hint: '可以拖动我；方向键移动，Enter 打开对话，Esc 收起。',
    bots: '认识 Bot',
    appearance: '换个形象',
    community: '聊聊社区',
    discord: '加入 Discord',
    qq: '复制 QQ 群号',
    copied: '群号已复制',
    failed: '复制失败，请选中或长按群号手动复制。',
    busy: '复制中…',
    messages: {
      welcome: '嗨！我是这里的 Bot。可以抓起我，也可以聊聊这里有什么。',
      drop: '我跳下来，陪你继续看。',
      drag: '轻一点，抓稳啦！',
      land: '稳稳落地，继续一起逛吧。',
      community: '看得有兴趣？来社区一起聊聊你想做的 Bot 吧。',
      bots: '每个 Bot 都有自己的名字、人格和记忆，也能跨文件夹工作。下面的能力区有介绍。',
      appearance: '下面可以给我换发型、衣服和颜色。你捏的那张脸，就是现在的我。',
    },
  },
  en: {
    label: 'Website Bot companion',
    settings: 'Bot controls',
    talk: 'Talk to the Bot',
    restore: 'Bring back the Bot',
    close: 'Close conversation',
    hide: 'Hide Bot',
    pause: 'Pause wandering',
    resume: 'Resume wandering',
    quiet: 'Reduce motion',
    animated: 'Enable motion',
    guide: 'Preset interactive guide',
    hint: 'Drag me; use arrow keys to move, Enter to talk, and Esc to close.',
    bots: 'Meet the Bots',
    appearance: 'Change my look',
    community: 'About the community',
    discord: 'Join Discord',
    qq: 'Copy QQ number',
    copied: 'Group number copied',
    failed: 'Copy failed. Select or long-press the number to copy it manually.',
    busy: 'Copying…',
    messages: {
      welcome: 'Hi! I am your Bot guide. Pick me up, or ask what is here.',
      drop: 'Let me hop down and keep you company.',
      drag: 'Easy there — hold on tight!',
      land: 'Landed! Let us keep exploring.',
      community: 'Interested? Come chat with us about the Bot you would like to build.',
      bots: 'Every Bot has a name, personality and memory, and can work across folders. Explore the Features section below.',
      appearance:
        'Change my hair, clothes and colors in the avatar designer below. The face you make there is my face, too.',
    },
  },
} as const;
