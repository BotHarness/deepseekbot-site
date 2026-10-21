import { copyText } from './clipboard';
import './market.css';
import './plugins.css';
import './docs';

// The plugin pages are static HTML; this adds the copy buttons beside the install commands.
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-command]')) {
  const label = button.textContent;
  let reset: ReturnType<typeof setTimeout> | undefined;
  button.addEventListener('click', async () => {
    const copied = await copyText(button.dataset.copyCommand ?? '');
    clearTimeout(reset);
    button.textContent = (copied ? button.dataset.copied : button.dataset.copyFailed) ?? label;
    reset = setTimeout(() => (button.textContent = label), 1600);
  });
}
