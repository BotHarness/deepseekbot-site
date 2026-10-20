import './market.css';
import './plugins.css';
import './docs';

// The plugin pages are static HTML; this adds the copy buttons beside the install commands.
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-command]')) {
  const label = button.textContent;
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copyCommand ?? '');
    button.textContent = button.dataset.copied ?? label;
    setTimeout(() => (button.textContent = label), 1600);
  });
}
