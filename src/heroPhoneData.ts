import type { DemoChannel, DemoStep } from './demoCopy';

export type PhoneHostId = 'studio' | 'research';
export const PHONE_HOSTS = [
  { id: 'studio', name: 'Studio Mac' },
  { id: 'research', name: 'Research PC' },
] as const;
export const PHONE_REQUESTS = [
  { id: 'studio-check', host: 'studio', bot: 'Nova', command: 'git diff --check' },
  { id: 'research-report', host: 'research', bot: 'Mira', command: 'python summarize.py' },
] as const;

type Story = {
  introPrompt: string;
  introReply: string;
  researchPrompt: string;
  researchReply: string;
  checkPrompt: string;
  checkReply: string;
};

export function phoneChannelKey(host: PhoneHostId, channel: string): string {
  return `${host}:${channel}`;
}

/** A same-named Bot on another computer has a distinct identity and conversation. */
export function phoneChannel(
  channel: DemoChannel,
  index: number,
  host: PhoneHostId,
  story: Story,
): DemoChannel {
  let steps = channel.steps;
  if (host === 'research' && index > 0) {
    steps = [
      { kind: 'user', text: index === 1 ? story.researchPrompt : story.checkPrompt },
      { kind: 'work', bot: channel.bots[0]!, tools: ['thinking', 'write'] },
      {
        kind: 'bot',
        bot: channel.bots[0]!,
        text: index === 1 ? story.researchReply : story.checkReply,
      },
    ];
  } else if (index === 0) {
    const approval = steps.findIndex((step) => step.kind === 'approval');
    if (approval >= 0) {
      const intro: DemoStep[] = [
        { kind: 'user', text: story.introPrompt },
        { kind: 'work', bot: channel.bots[0]!, tools: ['thinking', 'write'] },
        { kind: 'bot', bot: channel.bots[0]!, text: story.introReply },
      ];
      steps = [...intro, ...steps.slice(approval)];
    }
  }
  return { ...channel, id: phoneChannelKey(host, channel.id), steps };
}
