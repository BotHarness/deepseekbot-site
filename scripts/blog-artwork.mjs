import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/** Check reviewed artwork without modifying it; false means use the ordinary template. */
export function validateCuratedArtwork(cover, title) {
  const metadata = cover.replace(/\.png$/, '.artwork.json');
  if (!existsSync(metadata)) return false;
  const refuse = (reason) => {
    throw new Error(`Curated cover needs review: ${cover} (${reason})`);
  };
  let artwork;
  try {
    artwork = JSON.parse(readFileSync(metadata, 'utf8'));
  } catch {
    refuse('invalid artwork metadata');
  }
  if (artwork?.articleTitle !== title) refuse('article title changed');
  if (!existsSync(cover)) refuse('image missing');
  if (createHash('sha256').update(readFileSync(cover)).digest('hex') !== artwork.sha256)
    refuse('image hash changed');
  return true;
}
