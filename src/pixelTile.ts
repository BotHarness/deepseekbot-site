import { pixelAvatarSvg, type PixelAvatarRecipe } from '@botharness/pixel-avatar';

// The package draws a smoothly rounded tile (rx=6 on the 32 grid). The site squares it off into
// stepped pixel corners, two art pixels deep, like its wooden frames.
const STEPPED = 'M2 0H30V1H31V2H32V30H31V31H30V32H2V31H1V30H0V2H1V1H2Z';

export const pixelTileSvg = (recipe: PixelAvatarRecipe) =>
  pixelAvatarSvg(recipe).replace(
    /<rect width="32" height="32" rx="6" fill="([^"]+)"\/>/,
    `<path d="${STEPPED}" fill="$1"/>`,
  );
