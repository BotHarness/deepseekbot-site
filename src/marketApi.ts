import type { Lang } from './content';

// Public read API of the Bot Marketplace Worker (BotHarness packages/market, "Public read API (v1)").
export const MARKET_ORIGIN = 'https://market.botharness.ai';
export const MARKET_API = `${MARKET_ORIGIN}/v1`;

export interface MarketplaceEntry {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  displayName: string | null;
  roles: string[];
  // bot.json `bio`, else the GitHub description; absent from Workers older than the bio column
  bio?: string | null;
  // true when `bio` is the Marketplace's generated summary for the asked language
  bioGenerated?: boolean;
  description: string | null;
  // bot.json `banner`: a pixel-banner recipe, or the uploaded image as a raw GitHub URL
  banner?: MarketplaceBanner | null;
  // bot.json `avatar`: an avatar recipe, or the uploaded image; null draws the name's seeded face
  avatar?: MarketplaceAvatar | null;
  topics: string[];
  stars: number;
  installs?: number;
  pushedAt: string;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  headCommit: { sha: string; committedAt: string } | null;
}

export type MarketplaceBanner = { recipe: { scene: string; seed: number } } | { image: string };

export type MarketplaceAvatar = { recipe: unknown } | { image: string };

// A Bot a Marketplace Digest picks, as the cover draws it.
export interface DigestPick {
  id: string;
  displayName: string | null;
  banner: MarketplaceBanner | null;
  avatar: MarketplaceAvatar | null;
}

export interface DigestSummary {
  day: string;
  lang: Lang;
  title: string;
  lede: string;
  picks: DigestPick[];
}

export interface Digest extends DigestSummary {
  // `bot` is null once the listing is hidden or blocked
  sections: { heading: string; body: string; bot: MarketplaceEntry | null }[];
}

export type SectionName = 'hot' | 'new' | 'rising';

export const SECTIONS: SectionName[] = ['hot', 'new', 'rising'];

export interface Section {
  section: SectionName;
  day: string | null;
  entries: { bot: MarketplaceEntry; score: number }[];
}

export interface MarketplacePage {
  bots: MarketplaceEntry[];
  nextCursor?: string;
}

export interface MarketplaceDetail {
  bot: MarketplaceEntry;
  readme: string | null;
  // which README.<lang>.md `readme` is, null for README.md; absent from older Workers
  readmeLanguage?: Lang | null;
  commitSha: string | null;
}

export type Sort = 'updated' | 'stars';

export class MarketError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${MARKET_API}${path}`, {
    headers: { accept: 'application/json' },
    signal,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { code?: string } } | null;
    throw new MarketError(body?.error?.code ?? `http-${res.status}`);
  }
  return (await res.json()) as T;
}

export const listBots = (
  query: { sort: Sort; q: string; topic: string; lang: Lang; cursor?: string },
  signal?: AbortSignal,
) => {
  // lang picks the author's README.<lang>.md and bot.json translation, else a generated bio
  const params = new URLSearchParams({ limit: '24', lang: query.lang });
  // search ranks by relevance, so sort only applies when browsing
  if (query.q) params.set('q', query.q);
  else params.set('sort', query.sort);
  if (query.topic) params.set('topic', query.topic);
  if (query.cursor) params.set('cursor', query.cursor);
  return get<MarketplacePage>(`/bots?${params}`, signal);
};

export const listTopics = (signal?: AbortSignal) =>
  get<{ topics: { topic: string; count: number }[] }>('/topics', signal);

export const getBot = (id: string, lang: Lang, signal?: AbortSignal) =>
  get<MarketplaceDetail>(`/bots/${encodeURIComponent(id)}?lang=${lang}`, signal);

// The Daily Picks row and the past-picks page read the same list, so one request serves both.
const digestLists = new Map<Lang, Promise<DigestSummary[]>>();

export const listDigests = (lang: Lang) => {
  let list = digestLists.get(lang);
  if (!list) {
    list = get<{ digests: DigestSummary[] }>(`/digests?lang=${lang}`).then((r) => r.digests);
    list.catch(() => digestLists.delete(lang));
    digestLists.set(lang, list);
  }
  return list;
};

export const getDigest = (day: string, lang: Lang, signal?: AbortSignal) =>
  get<{ digest: Digest }>(`/digests/${encodeURIComponent(day)}?lang=${lang}`, signal).then(
    (r) => r.digest,
  );

// A section opened from its row keeps the entries it showed; a shared link loads them.
const sectionLists = new Map<string, Promise<Section>>();

export const getSection = (section: SectionName, lang: Lang) => {
  const key = `${section}:${lang}`;
  let loaded = sectionLists.get(key);
  if (!loaded) {
    loaded = get<Section>(`/sections/${section}?lang=${lang}`);
    loaded.catch(() => sectionLists.delete(key));
    sectionLists.set(key, loaded);
  }
  return loaded;
};
