export const GITHUB_STARS_API = 'https://api.github.com/repos/BotHarness/DeepSeekBot';
export const GITHUB_STARS_TTL = 5 * 60 * 1000;
const CACHE_KEY = 'dsb-github-stars-v1';
type Listener = (count: number | null) => void;
type Cache = { count: number; checkedAt: number };

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

/** One request and one verified cache, shared by every GitHub button on a page. */
export function createGitHubStarsSource({
  fetcher = globalThis.fetch,
  now = Date.now,
  storage,
}: {
  fetcher?: typeof fetch;
  now?: () => number;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
} = {}) {
  const listeners = new Set<Listener>();
  let count: number | null = null;
  let nextCheck = 0;
  let pending: Promise<void> | undefined;
  try {
    const cached = JSON.parse(storage?.getItem(CACHE_KEY) ?? 'null') as Cache | null;
    if (
      cached &&
      isCount(cached.count) &&
      Number.isFinite(cached.checkedAt) &&
      cached.checkedAt <= now() &&
      now() - cached.checkedAt < GITHUB_STARS_TTL
    ) {
      count = cached.count;
      nextCheck = cached.checkedAt + GITHUB_STARS_TTL;
    }
  } catch {
    // Storage may be unavailable or contain an old, malformed value.
  }
  const publish = (next: number | null) => {
    count = next;
    for (const listener of listeners) listener(count);
  };
  return {
    refreshAfter: () => Math.max(0, nextCheck - now()),
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(count);
      return () => {
        listeners.delete(listener);
      };
    },
    refresh(): Promise<void> {
      if (pending) return pending;
      if (now() < nextCheck) return Promise.resolve();
      pending = (async () => {
        let result: number | null = null;
        try {
          const response = await fetcher(GITHUB_STARS_API, {
            headers: { Accept: 'application/vnd.github+json' },
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            signal: AbortSignal.timeout(6000),
          });
          if (!response.ok) throw new Error('GitHub stars unavailable');
          const data: unknown = await response.json();
          if (
            !data ||
            typeof data !== 'object' ||
            !('stargazers_count' in data) ||
            !isCount(data.stargazers_count)
          )
            throw new Error('Invalid GitHub star count');
          result = data.stargazers_count;
        } catch {
          // A failed or rate-limited request must never become a fake zero.
        }
        const checkedAt = now();
        nextCheck = checkedAt + GITHUB_STARS_TTL;
        try {
          if (result === null) storage?.removeItem(CACHE_KEY);
          else storage?.setItem(CACHE_KEY, JSON.stringify({ count: result, checkedAt }));
        } catch {
          // Fetching and rendering work even when storage is blocked.
        }
        publish(result);
      })().finally(() => {
        pending = undefined;
      });
      return pending;
    },
  };
}

let storage: Storage | undefined;
try {
  storage = globalThis.localStorage;
} catch {
  // Private browsing can deny even access to the storage object.
}
const source = createGitHubStarsSource({ storage });
let subscribers = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const pageVisible = () => document.visibilityState !== 'hidden';
const refreshVisible = async () => {
  clearTimeout(timer);
  if (!pageVisible()) return;
  await source.refresh();
  clearTimeout(timer);
  if (subscribers > 0 && pageVisible())
    timer = setTimeout(() => void refreshVisible(), source.refreshAfter());
};

export function subscribeGitHubStars(listener: Listener): () => void {
  const unsubscribe = source.subscribe(listener);
  if (++subscribers === 1) {
    void refreshVisible();
    document.addEventListener('visibilitychange', refreshVisible);
  }
  return () => {
    unsubscribe();
    if (--subscribers === 0) {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', refreshVisible);
    }
  };
}
