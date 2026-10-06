// Pixel icons for header links. Rows of '#' (ink) and '.' (empty), drawn in
// currentColor so they follow the link colour in both themes. Plain strings so
// the static docs header (scripts/docs.ts) can reuse them.
const ROWS = {
  docs: [
    '.##.....##.',
    '#..##.##..#',
    '#....#....#',
    '#.##.#.##.#',
    '#....#....#',
    '#.##.#.##.#',
    '#....#....#',
    '.####.####.',
  ],
  changelog: [
    '...#####...',
    '..#.....#..',
    '.#...#...#.',
    '.#...#...#.',
    '.#...###.#.',
    '.#.......#.',
    '..#.....#..',
    '...#####...',
  ],
  market: [
    '.#########.',
    '###########',
    '#.#.#.#.#.#',
    '.#.......#.',
    '.#.###.#.#.',
    '.#.#.#.#.#.',
    '.#.#.#...#.',
    '###########',
  ],
} as const;

export type NavIcon = keyof typeof ROWS;

export function navIconSvg(name: NavIcon): string {
  const rows = ROWS[name];
  const w = rows[0].length;
  const h = rows.length;
  let d = '';
  rows.forEach((row, y) => {
    for (const m of row.matchAll(/#+/g)) d += `M${m.index} ${y}h${m[0].length}v1h-${m[0].length}z`;
  });
  return `<svg class="nav-icon" viewBox="0 0 ${w} ${h}" width="${w * 1.6}" height="${h * 1.6}" aria-hidden="true" shape-rendering="crispEdges"><path fill="currentColor" d="${d}"/></svg>`;
}
