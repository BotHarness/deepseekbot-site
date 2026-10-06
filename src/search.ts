// The docs search box: Ctrl/⌘+K or the header button opens it. The index (one entry per guide
// section, built by scripts/docs.ts searchIndex) is fetched on first open, and matching is a plain
// substring search so Chinese needs no word segmentation.
import { track } from './analytics';

export interface SearchEntry {
  t: string;
  h: string;
  u: string;
  x: string;
}

export interface SearchHit {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

const COPY = {
  zh: {
    label: '搜索文档',
    placeholder: '搜索教程…',
    hint: '输入关键词，搜索全部使用教程',
    empty: '没有找到相关内容',
    error: '搜索索引加载失败，请稍后再试',
    loading: '正在加载…',
    help: '↑↓ 选择 · Enter 打开 · Esc 关闭',
    close: '关闭',
  },
  en: {
    label: 'Search the docs',
    placeholder: 'Search the guides…',
    hint: 'Type a keyword to search every guide',
    empty: 'No matching results',
    error: 'The search index failed to load. Please try again later.',
    loading: 'Loading…',
    help: '↑↓ to select · Enter to open · Esc to close',
    close: 'Close',
  },
} as const;

const fold = (text: string) => text.normalize('NFKC').toLowerCase();

const count = (haystack: string, needle: string) => {
  let n = 0;
  for (let at = haystack.indexOf(needle); at !== -1 && n < 5; at = haystack.indexOf(needle, at + 1))
    n++;
  return n;
};

const SNIPPET = 110;

/** Up to `limit` sections containing every word of the query, best first. */
export function search(entries: SearchEntry[], query: string, limit = 20): SearchHit[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const entry of entries) {
    const title = fold(entry.t);
    const heading = fold(entry.h);
    const text = fold(entry.x);
    let score = 0;
    let missing = false;
    for (const term of terms) {
      const s =
        (title.includes(term) ? 8 : 0) + (heading.includes(term) ? 5 : 0) + count(text, term);
      if (!s) {
        missing = true;
        break;
      }
      score += s;
    }
    if (missing) continue;
    // a guide's own intro outranks its sections when the title is what matched
    if (!entry.h && terms.some((term) => title.includes(term))) score += 2;
    // the snippet starts a little before the first word found in the text
    const found = terms.map((term) => text.indexOf(term)).filter((i) => i >= 0);
    const first = found.length ? Math.min(...found) : 0;
    const start = Math.max(0, first - 30);
    const body = entry.x.slice(start, start + SNIPPET);
    const snippet = `${start > 0 ? '…' : ''}${body}${start + SNIPPET < entry.x.length ? '…' : ''}`;
    hits.push({ entry, score, snippet });
  }
  // Array.prototype.sort is stable, so equal scores keep the sidebar's order
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The text with every query word wrapped in <mark>, HTML-escaped. */
export function highlight(text: string, query: string): string {
  const terms = query
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return escapeHtml(text);
  const pattern = new RegExp(`(${terms.join('|')})`, 'giu');
  return text
    .split(pattern)
    .map((part, i) => (i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join('');
}

export function initSearch() {
  const lang = document.body.dataset.lang === 'en' ? 'en' : 'zh';
  const t = COPY[lang];
  const openers = document.querySelectorAll<HTMLButtonElement>('[data-search-open]');
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  for (const kbd of document.querySelectorAll('[data-search-kbd]'))
    kbd.textContent = mac ? '⌘K' : 'Ctrl K';

  let dialog: HTMLDialogElement | undefined;
  let entries: Promise<SearchEntry[]> | undefined;

  const load = () =>
    (entries ??= fetch(`/search/${lang}.json`).then((res) => {
      if (!res.ok) throw new Error(`search index: ${res.status}`);
      return res.json() as Promise<SearchEntry[]>;
    }));

  const build = () => {
    const d = document.createElement('dialog');
    d.className = 'search-dialog';
    d.dataset.placement = 'search';
    d.setAttribute('aria-label', t.label);
    d.innerHTML = `<div class="search-panel frame">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 7 7" width="16" height="16" aria-hidden="true" shape-rendering="crispEdges"><path fill="currentColor" d="M1 0h3v1H1zM0 1h1v3H0zM4 1h1v3H4zM1 4h3v1H1zM4 4h1v1H4zM5 5h2v1H5zM5 6h2v1H5z"/></svg>
        <input type="search" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list" autocomplete="off" spellcheck="false" />
        <button type="button" class="search-close" aria-label="${t.close}">Esc</button>
      </div>
      <ul id="search-results" class="search-results" role="listbox" aria-label="${t.label}"></ul>
      <p class="search-status" role="status"></p>
      <p class="search-help">${t.help}</p>
    </div>`;
    document.body.append(d);
    const input = d.querySelector('input')!;
    const list = d.querySelector('ul')!;
    const status = d.querySelector<HTMLParagraphElement>('.search-status')!;
    input.placeholder = t.placeholder;
    input.setAttribute('aria-label', t.label);
    status.textContent = t.hint;

    let hits: SearchHit[] = [];
    let active = 0;
    let logged: ReturnType<typeof setTimeout> | undefined;

    const select = (i: number) => {
      const options = list.querySelectorAll<HTMLAnchorElement>('[role="option"]');
      if (!options.length) return input.removeAttribute('aria-activedescendant');
      active = (i + options.length) % options.length;
      options.forEach((o, n) => o.setAttribute('aria-selected', String(n === active)));
      input.setAttribute('aria-activedescendant', options[active]!.id);
      options[active]!.scrollIntoView({ block: 'nearest' });
    };

    const render = async () => {
      const query = input.value.trim();
      clearTimeout(logged);
      if (!query) {
        hits = [];
        list.replaceChildren();
        input.setAttribute('aria-expanded', 'false');
        status.textContent = t.hint;
        status.hidden = false;
        return;
      }
      let index: SearchEntry[];
      try {
        if (!list.childElementCount) status.textContent = t.loading;
        index = await load();
      } catch {
        entries = undefined;
        status.textContent = t.error;
        return;
      }
      // a newer keystroke already rendered
      if (input.value.trim() !== query) return;
      hits = search(index, query);
      list.innerHTML = hits
        .map(
          ({ entry, snippet }, i) =>
            `<li role="none"><a id="search-hit-${i}" role="option" href="${escapeHtml(entry.u)}" data-index="${i}"><span class="search-hit-title">${highlight(entry.t, query)}${
              entry.h
                ? `<span class="search-hit-sep" aria-hidden="true"> › </span>${highlight(entry.h, query)}`
                : ''
            }</span><span class="search-hit-text">${highlight(snippet, query)}</span></a></li>`,
        )
        .join('');
      input.setAttribute('aria-expanded', String(hits.length > 0));
      status.textContent = hits.length ? '' : t.empty;
      status.hidden = hits.length > 0;
      select(0);
      // what people look for, once they stop typing
      logged = setTimeout(
        () => track('docs_search_queried', { query, results: hits.length }),
        1000,
      );
    };

    const open = (i: number) => {
      const hit = hits[i];
      if (!hit) return;
      track('docs_search_result_opened', {
        query: input.value.trim(),
        position: i + 1,
        target: hit.entry.u,
      });
      d.close();
      location.href = hit.entry.u;
    };

    input.addEventListener('input', () => void render());
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        select(active + (event.key === 'ArrowDown' ? 1 : -1));
      } else if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        open(active);
      }
    });
    list.addEventListener('click', (event) => {
      const option = (event.target as Element).closest<HTMLAnchorElement>('[role="option"]');
      if (!option || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      open(Number(option.dataset.index));
    });
    list.addEventListener('mousemove', (event) => {
      const option = (event.target as Element).closest<HTMLAnchorElement>('[role="option"]');
      if (option && Number(option.dataset.index) !== active) select(Number(option.dataset.index));
    });
    d.querySelector('.search-close')!.addEventListener('click', () => d.close());
    // a click on the backdrop (the dialog itself, outside the panel) closes it
    d.addEventListener('click', (event) => {
      if (event.target === d) d.close();
    });
    d.addEventListener('close', () => document.documentElement.classList.remove('search-locked'));
    return d;
  };

  const show = (via: 'shortcut' | 'button') => {
    dialog ??= build();
    if (dialog.open) return;
    void load().catch(() => (entries = undefined));
    dialog.showModal();
    document.documentElement.classList.add('search-locked');
    const input = dialog.querySelector('input')!;
    input.select();
    track('docs_search_opened', { via });
  };

  for (const button of openers) button.addEventListener('click', () => show('button'));
  addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog?.open) dialog.close();
      else show('shortcut');
    }
  });
}
