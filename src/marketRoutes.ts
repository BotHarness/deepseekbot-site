// The Bot Marketplace's URLs, shared by the page and the Worker that pre-renders them for
// search engines. Plain TypeScript with no imports, so the Worker and its Node tests load it as is.

export type MarketLang = 'zh' | 'en';

export type SectionName = 'hot' | 'new' | 'rising';

export const SECTIONS: SectionName[] = ['hot', 'new', 'rising'];

export type MarketView =
  | { kind: 'home' }
  | { kind: 'bot'; id: string }
  | { kind: 'digest'; day: string }
  | { kind: 'archive' }
  | { kind: 'section'; section: SectionName };

// Labels both the page and the pre-rendered HTML use; content.ts reads them from here.
export const MARKET_LABELS = {
  zh: {
    kicker: '市场',
    back: '← 返回市场',
    github: '在 GitHub 查看',
    allBots: '全部 Bot',
    dailyPicks: '每日精选',
    pastPicks: '往期精选',
    sections: { hot: '热门', new: '新上架', rising: '上升最快' },
  },
  en: {
    kicker: 'Marketplace',
    back: '← Back to the Marketplace',
    github: 'View on GitHub',
    allBots: 'All Bots',
    dailyPicks: 'Daily picks',
    pastPicks: 'Past picks',
    sections: { hot: 'Hot', new: 'New', rising: 'Rising' },
  },
} as const;

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const BOT_ID = /^[\w-]{1,100}$/;

export const marketBase = (lang: MarketLang) => (lang === 'zh' ? '/market' : '/en/market');

/** The path of a view: /market, /market/bot/<id>, /market/picks[/<day>], /market/<section>. */
export function marketHref(lang: MarketLang, view: MarketView): string {
  const base = marketBase(lang);
  switch (view.kind) {
    case 'home':
      return base;
    case 'bot':
      return `${base}/bot/${encodeURIComponent(view.id)}`;
    case 'digest':
      return `${base}/picks/${view.day}`;
    case 'archive':
      return `${base}/picks`;
    case 'section':
      return `${base}/${view.section}`;
  }
}

/** The language and view a Marketplace path shows, or null for any other path. */
export function parseMarketPath(pathname: string): { lang: MarketLang; view: MarketView } | null {
  const match = /^(\/en)?\/market(?:\/(.*?))?\/?$/.exec(pathname);
  if (!match) return null;
  const lang: MarketLang = match[1] ? 'en' : 'zh';
  const parts = (match[2] ?? '').split('/').filter(Boolean);
  if (parts.length === 0) return { lang, view: { kind: 'home' } };
  const [head, rest, ...extra] = parts;
  if (extra.length > 0) return null;
  if (head === 'bot' && rest !== undefined) {
    let id: string;
    try {
      id = decodeURIComponent(rest);
    } catch {
      return null;
    }
    return BOT_ID.test(id) ? { lang, view: { kind: 'bot', id } } : null;
  }
  if (head === 'picks') {
    if (rest === undefined) return { lang, view: { kind: 'archive' } };
    return DAY.test(rest) ? { lang, view: { kind: 'digest', day: rest } } : null;
  }
  if (rest === undefined && SECTIONS.includes(head as SectionName))
    return { lang, view: { kind: 'section', section: head as SectionName } };
  return null;
}

/** The view an older ?bot=, ?digest=, ?picks=past or ?section= link meant, if any. */
export function legacyMarketView(search: string): MarketView | null {
  const params = new URLSearchParams(search);
  const bot = params.get('bot');
  if (bot && BOT_ID.test(bot)) return { kind: 'bot', id: bot };
  const day = params.get('digest');
  if (day && DAY.test(day)) return { kind: 'digest', day };
  if (params.get('picks') === 'past') return { kind: 'archive' };
  const section = params.get('section');
  if (SECTIONS.includes(section as SectionName))
    return { kind: 'section', section: section as SectionName };
  return null;
}
