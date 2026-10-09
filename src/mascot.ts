import {
  DEFAULT_RECIPE,
  detailedRecipe,
  seededRecipe,
  seededRecipeV2,
  type PixelAvatarRecipe,
} from '@botharness/pixel-avatar';

/**
 * DeepSeekBot's own face: the maid girl from the logo (blue hair with an ahoge, blue eyes,
 * white frilled headband, maid dress), redrawn from BotPixel parts. The headband takes
 * `shirtColor`, so that is the white.
 */
export const DEEPSEEKBOT_RECIPE: PixelAvatarRecipe = detailedRecipe({
  ...DEFAULT_RECIPE,
  head: 'round',
  pose: 'front',
  hair: 'ahoge',
  eyes: 'sparkle',
  brows: 'soft',
  nose: 'none',
  mouth: 'open',
  cheeks: 'blush',
  glasses: 'none',
  outfit: 'maid',
  backdrop: 'sparkles',
  accessory: 'headband',
  skinColor: '#ffe3cf',
  hairColor: '#4468d0',
  eyeColor: '#3a7ae8',
  shirtColor: '#f4f1ec',
});

/**
 * The same name always gives the same face; "DeepSeekBot" gives the mascot. Seed 2 is the face a
 * new Bot gets in BotHarness, drawn from every species; seed 1 is the face existing Bots keep.
 */
export const recipeFor = (name: string, seed: 1 | 2 = 1): PixelAvatarRecipe =>
  name.trim().toLowerCase() === 'deepseekbot'
    ? DEEPSEEKBOT_RECIPE
    : seed === 2
      ? seededRecipeV2(name)
      : seededRecipe(name);
