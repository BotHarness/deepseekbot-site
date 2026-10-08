import '@astryxdesign/core/reset.css';
import './styles.css';
import './docs.css';
import { initAnalytics, track } from './analytics';
import { initSearch } from './search';
import { initHeaderCommunity } from './headerCommunityEvents';

void initAnalytics();
initSearch();
initHeaderCommunity(document, () => track('qq_group_copied', { placement: 'header' }));

// The guide pages are static HTML; this adds the day/night switch and copy buttons.
const root = document.documentElement;
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-mode]');
const show = () => {
  for (const button of buttons)
    button.setAttribute('aria-pressed', String(button.dataset.mode === root.dataset.theme));
};
for (const button of buttons)
  button.addEventListener('click', () => {
    root.dataset.theme = button.dataset.mode;
    try {
      localStorage.setItem('dsb-mode', button.dataset.mode ?? 'light');
    } catch {
      // private windows may refuse storage; the choice just won't persist
    }
    show();
  });
show();

const { copy = 'Copy', copied = 'Copied' } = document.body.dataset;
for (const pre of document.querySelectorAll<HTMLPreElement>('.docs-body pre')) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'code-copy';
  button.textContent = copy;
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(
      pre.querySelector('code')?.textContent ?? pre.textContent ?? '',
    );
    button.textContent = copied;
    setTimeout(() => (button.textContent = copy), 1600);
  });
  pre.append(button);
}

// on a phone the contents list starts folded so the article comes first
if (matchMedia('(max-width: 860px)').matches)
  document.querySelector<HTMLDetailsElement>('.docs-nav details')?.removeAttribute('open');

// the contents list on the right marks the section being read; on narrower screens it sits folded
// above the article
const toc = document.querySelector<HTMLElement>('.docs-toc');
if (toc) {
  const narrow = matchMedia('(max-width: 1180px)');
  const details = toc.querySelector('details')!;
  if (narrow.matches) details.removeAttribute('open');
  const sections = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].flatMap((link) => {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    return heading ? [{ link, heading }] : [];
  });
  let current: HTMLAnchorElement | undefined;
  let queued = false;
  const mark = () => {
    queued = false;
    // the last heading that has scrolled under the top bar, or the first before any has
    const line = (document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0) + 48;
    let at = 0;
    sections.forEach(({ heading }, i) => {
      if (heading.getBoundingClientRect().top <= line) at = i;
    });
    // at the very bottom the last short sections can never reach the line
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2)
      at = sections.length - 1;
    const link = sections[at]?.link;
    if (link === current) return;
    current?.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'location');
    current = link;
  };
  addEventListener(
    'scroll',
    () => {
      if (!queued) requestAnimationFrame(mark);
      queued = true;
    },
    { passive: true },
  );
  mark();
  toc.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a') && narrow.matches) details.removeAttribute('open');
  });
}

// changelog releases fold; a version link or #anchor opens the release it points at
const reveal = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target instanceof HTMLDetailsElement) target.open = true;
};
addEventListener('hashchange', reveal);
reveal();
