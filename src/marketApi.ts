import type { Lang } from './content';

// Public read API of the Bot Marketplace Worker (BotHarness packages/market, "Public read API (v1)").
export const MARKET_API = 'https://market.botharness.ai/v1';

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
  topics: string[];
  stars: number;
  pushedAt: string;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  headCommit: { sha: string; committedAt: string } | null;
}

export type MarketplaceBanner = { recipe: { scene: string; seed: number } } | { image: string };

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
