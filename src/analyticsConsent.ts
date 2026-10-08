/** Presentation bridge only: PostHog owns the saved choice and analytics identity. */
export type ConsentStatus = 'unavailable' | 'loading' | 'pending' | 'accepted' | 'declined';
export function createConsentPrompt() {
  let status: ConsentStatus = 'unavailable';
  let decide: ((accept: boolean) => void) | undefined;
  const listeners = new Set<() => void>();
  const publish = (next: ConsentStatus) => {
    status = next;
    for (const listener of listeners) listener();
  };
  return {
    snapshot: () => status,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    loading() {
      publish('loading');
    },
    configure(next: ConsentStatus, choose?: (accept: boolean) => void) {
      decide = choose;
      publish(next);
    },
    choose(accept: boolean) {
      if (status !== 'pending' || !decide) return;
      decide(accept);
      publish(accept ? 'accepted' : 'declined');
    },
  };
}
export const analyticsConsent = createConsentPrompt();
export const CONSENT_COPY = {
  zh: {
    text: '嗨！我想用匿名统计了解哪些内容对你有帮助。可以在这台设备保存匿名 ID，认出下次来访的你吗？拒绝的话，只记住你的选择，访问仍以不带标识的方式匿名计数。',
    accept: '好呀，同意',
    reject: '不用了，拒绝',
    more: '隐私说明',
    privacy: '/privacy/',
  },
  en: {
    text: 'Hi! I use anonymous analytics to learn what helps you. May I save an anonymous ID on this device to recognise your next visit? If you decline, only your choice is saved and visits are still counted without an identifier.',
    accept: 'Sure, accept',
    reject: 'No thanks, decline',
    more: 'Privacy',
    privacy: '/en/privacy/',
  },
} as const;
