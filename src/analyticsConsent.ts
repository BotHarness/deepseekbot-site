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
    text: '允许收集匿名浏览和使用统计，帮助我们改进网站吗？',
    accept: '好呀，同意',
    reject: '不用了，拒绝',
    more: '隐私说明',
    privacy: '/privacy/',
  },
  en: {
    text: 'May we collect anonymous browsing and usage analytics to improve this site?',
    accept: 'Sure, accept',
    reject: 'No thanks, decline',
    more: 'Privacy',
    privacy: '/en/privacy/',
  },
} as const;
