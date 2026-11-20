import { isPixelAvatarRecipe } from '@botharness/pixel-avatar';
import { useMemo, useState } from 'react';
import { MARKET_ORIGIN, type MarketplaceAvatar, type MarketplaceEntry } from '../marketApi';
import { recipeFor } from '../mascot';
import { pixelTileSvg } from '../pixelTile';

export const botName = (bot: MarketplaceEntry) => bot.displayName ?? bot.name;

// Author art is shown only from GitHub's raw files or the Marketplace itself.
export const marketArtUrl = (url: string) =>
  url.startsWith('https://raw.githubusercontent.com/') || url.startsWith(`${MARKET_ORIGIN}/`)
    ? url
    : null;

// The author's avatar recipe or image when bot.json sets one, else the face seeded from `seed`.
export function BotFace({
  avatar,
  seed,
  size,
}: {
  avatar: MarketplaceAvatar | null | undefined;
  seed: string;
  size: number;
}) {
  const recipe =
    avatar && 'recipe' in avatar && isPixelAvatarRecipe(avatar.recipe) ? avatar.recipe : null;
  const image = avatar && 'image' in avatar ? marketArtUrl(avatar.image) : null;
  const [failed, setFailed] = useState<string | null>(null);
  const svg = useMemo(
    () =>
      image && image !== failed
        ? null
        : pixelTileSvg(recipe ?? recipeFor(seed)).replace(
            'width="512" height="512"',
            `width="${size}" height="${size}"`,
          ),
    [recipe, seed, size, image, failed],
  );
  if (svg === null && image)
    return (
      <span className="bot-face" aria-hidden="true">
        <img
          src={image}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(image)}
        />
      </span>
    );
  return (
    <span className="bot-face" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg ?? '' }} />
  );
}

export const botBio = (bot: MarketplaceEntry) => bot.bio ?? bot.description;
