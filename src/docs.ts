import '@astryxdesign/core/reset.css';
import './styles.css';
import './docs.css';

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
