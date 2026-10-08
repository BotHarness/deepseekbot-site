import { copyText } from './clipboard';
import { QQ_GROUP } from './communityLinks';
import { HEADER_COMMUNITY_COPY } from './headerCommunity';

/** Pointer/focus explanations and click-only copying; no scroll or automatic invitation. */
export function initHeaderCommunity(root: ParentNode, onCopied: () => void): () => void {
  const cleanups: (() => void)[] = [];
  for (const nav of root.querySelectorAll<HTMLElement>('[data-header-community]')) {
    const abort = new AbortController();
    const items = [...nav.querySelectorAll<HTMLElement>('[data-community-item]')];
    const t = HEADER_COMMUNITY_COPY[nav.dataset.lang === 'en' ? 'en' : 'zh'];
    let alive = true;
    for (const item of items) {
      const tip = item.querySelector<HTMLElement>('[role="tooltip"]')!;
      const control = item.querySelector<HTMLElement>('.header-community-control')!;
      const close = () => {
        tip.hidden = true;
      };
      const show = () => {
        for (const other of items) {
          if (other !== item) other.querySelector<HTMLElement>('[role="tooltip"]')!.hidden = true;
        }
        tip.hidden = false;
      };
      const options = { signal: abort.signal };
      item.addEventListener(
        'pointerenter',
        (e) => {
          if (e.pointerType !== 'touch') show();
        },
        options,
      );
      item.addEventListener(
        'pointerleave',
        () => {
          if (!item.matches(':focus-within')) close();
        },
        options,
      );
      item.addEventListener('focusin', show, options);
      item.addEventListener(
        'focusout',
        (e) => {
          if (!(e.relatedTarget instanceof Node) || !item.contains(e.relatedTarget)) close();
        },
        options,
      );
      nav.ownerDocument.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'Escape' && !tip.hidden) {
            e.preventDefault();
            close();
          }
        },
        options,
      );
      nav.ownerDocument.addEventListener(
        'pointerdown',
        (e) => {
          if (e.target instanceof Node && !item.contains(e.target)) close();
        },
        options,
      );
      if (!control.hasAttribute('data-header-qq')) continue;
      const result = item.querySelector<HTMLElement>('[data-qq-result]')!;
      let copying = false;
      control.addEventListener(
        'click',
        async () => {
          if (copying) return;
          copying = true;
          control.setAttribute('aria-busy', 'true');
          result.textContent = '';
          show();
          const success = await copyText(QQ_GROUP);
          if (!alive) return;
          copying = false;
          control.removeAttribute('aria-busy');
          result.textContent = success ? t.copied : t.failed;
          if (success) onCopied();
        },
        options,
      );
    }
    cleanups.push(() => {
      alive = false;
      abort.abort();
      for (const item of items) {
        item.querySelector<HTMLElement>('[role="tooltip"]')!.hidden = true;
        item.querySelector('[aria-busy]')?.removeAttribute('aria-busy');
      }
    });
  }
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
