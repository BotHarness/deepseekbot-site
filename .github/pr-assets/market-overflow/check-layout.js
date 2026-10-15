// Run in the marketplace page after its catalog has rendered.
(() => {
  const cards = [...document.querySelectorAll('.bot-card')];
  const originals = cards.map((c) => [
    c.querySelector('.bot-card-name').textContent,
    c.querySelector('.bot-card-repo').textContent,
  ]);
  cards.forEach((c) => {
    c.querySelector('.bot-card-name').textContent = 'LongBotName'.repeat(30);
    c.querySelector('.bot-card-repo').textContent = 'owner/' + 'repository'.repeat(20);
  });
  const failures = cards.flatMap((c) => {
    const name = c.querySelector('.bot-card-name'),
      rect = c.getBoundingClientRect(),
      cell = c.parentElement.getBoundingClientRect(),
      style = getComputedStyle(name);
    return rect.right > cell.right + 1 ||
      rect.left < cell.left - 1 ||
      style.textOverflow !== 'ellipsis' ||
      name.scrollWidth <= name.clientWidth ||
      name.getBoundingClientRect().right > rect.right + 1
      ? [{ card: rect.width, cell: cell.width }]
      : [];
  });
  cards.forEach((c, i) => {
    c.querySelector('.bot-card-name').textContent = originals[i][0];
    c.querySelector('.bot-card-repo').textContent = originals[i][1];
  });
  if (!cards.length || failures.length)
    throw new Error(JSON.stringify({ cards: cards.length, failures }));
  return {
    path: location.pathname,
    theme: document.documentElement.dataset.theme,
    viewport: innerWidth,
    cards: cards.length,
    failures,
  };
})();
