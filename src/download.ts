import { pixelAvatarSvg, type PixelAvatarRecipe } from '@botharness/pixel-avatar';

/** 32 art pixels at 32× each: a crisp 1024×1024 PNG. */
const SIZE = 1024;

/** Saves the avatar as a PNG named after the bot. */
export async function downloadAvatar(recipe: PixelAvatarRecipe, name: string) {
  // a full square: drop the tile's rounded corners the site shows
  const svg = pixelAvatarSvg(recipe)
    .replace('width="512" height="512"', `width="${SIZE}" height="${SIZE}"`)
    .replace('<rect width="32" height="32" rx="6"', '<rect width="32" height="32"');
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image(SIZE, SIZE);
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, SIZE, SIZE);
    const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(png);
    link.download = `${name.replace(/[\\/:*?"<>|\s]+/g, '-').slice(0, 40) || 'bot'}-pixel-avatar.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
