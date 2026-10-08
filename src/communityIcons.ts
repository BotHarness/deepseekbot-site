// Single pixel geometry source for React and generated static headers.
// Discord/GitHub: supplied SVGs in issue #22, sampled at cell centres onto
// a 24×24 grid (Discord 256×199 centred vertically; GitHub normalized to
// 16×16 before its scale(64)). QQ: penguin, scarf and feet on the same grid.
const ROWS = {
  discord: [
    '........................',
    '........................',
    '........................',
    '.....####......####.....',
    '...##################...',
    '...##################...',
    '..####################..',
    '..####################..',
    '.######################.',
    '.######################.',
    '.######..######..######.',
    '######....####....######',
    '######....####....######',
    '######....####....######',
    '######....####....######',
    '########################',
    '########################',
    '########################',
    '.#####..########..#####.',
    '..#####..........#####..',
    '....###..........###....',
    '........................',
    '........................',
    '........................',
  ],
  github: [
    '.........######.........',
    '......############......',
    '.....##############.....',
    '....################....',
    '...##################...',
    '..####..########...###..',
    '.####..............####.',
    '.####..............####.',
    '.####..............####.',
    '#####..............#####',
    '####................####',
    '####................####',
    '####................####',
    '#####..............#####',
    '#####..............#####',
    '.#####............#####.',
    '.######..........######.',
    '.###.#####....#########.',
    '..###.###......#######..',
    '...##..........######...',
    '....##.........#####....',
    '.....####......####.....',
    '......###......###......',
    '........................',
  ],
  qq: [
    '.........WWWWWW.........',
    '.......WW######WW.......',
    '......W##########W......',
    '.....W############W.....',
    '.....W##WWWWWWWW##W.....',
    '....W###WWWWWWWW###W....',
    '....W##WW#WWWW#WW##W....',
    '....W##WW#WWWW#WW##W....',
    '....W##WWWWWWWWWW##W....',
    '....W###WWYYYYWW###W....',
    '...W####WYYYYYYW####W...',
    '..W######WWWWWW######W..',
    '.W####RRRRRRRRRRRR####W.',
    '.W###RRRRRRRRRRRRRR###W.',
    '.W####RWWWWWWWWRR#####W.',
    '..W###WWWWWWWWWWRR###W..',
    '...W##WWWWWWWWWWRR##W...',
    '...W##WWWWWWWWWW####W...',
    '...W###WWWWWWWW#####W...',
    '....W###WWWWWW#####W....',
    '....W##############W....',
    '...W#YYYYY####YYYYY#W...',
    '...W#YYYYY#WW#YYYYY#W...',
    '....W#####W..W#####W....',
  ],
} as const;

export type CommunityBrand = keyof typeof ROWS;

const PALETTES = {
  discord: { '#': '#5865F2' },
  github: { '#': 'currentColor' },
  qq: { '#': '#17202c', W: '#ffffff', R: '#e9424c', Y: '#ffc544' },
} as const;

/** Safe, decorative SVG markup; no visitor input or interactive behaviour. */
export function communityIconSvg(brand: CommunityBrand): string {
  const rows = ROWS[brand];
  const palette: Record<string, string> = PALETTES[brand];
  let paths = '';
  for (const [ink, fill] of Object.entries(palette)) {
    let d = '';
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (row[x] !== ink) {
          x++;
          continue;
        }
        const start = x;
        while (row[x] === ink) x++;
        const width = x - start;
        d += `M${start} ${y}h${width}v1h-${width}z`;
      }
    });
    paths += `<path fill="${fill}" d="${d}"/>`;
  }
  return `<svg class="community-icon community-icon--${brand}" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" focusable="false" shape-rendering="crispEdges">${paths}</svg>`;
}
