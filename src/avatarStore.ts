import { isPixelAvatarRecipe, type PixelAvatarRecipe } from '@botharness/pixel-avatar';

/**
 * The visitor's Playground design, kept in this browser so a reload shows the same Bot: the name it
 * is seeded from and, once edited, the edited recipe (which may wear drawn parts).
 */
export interface SavedDesign {
  name: string;
  recipe: PixelAvatarRecipe | null;
}

export const DESIGN_KEY = 'dsb-avatar-design';
export const DEFAULT_NAME = 'DeepSeekBot';
export const MAX_NAME = 32;

/** The saved design, or `null` when there is none or it can't be read back as a valid one. */
export function parseDesign(raw: string | null): SavedDesign | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const { version, name, recipe } = value as Record<string, unknown>;
  if (version !== 1 || typeof name !== 'string' || name.length > MAX_NAME) return null;
  if (recipe !== null && !isPixelAvatarRecipe(recipe)) return null;
  return { name, recipe };
}

/** What to store for a design, or `null` for the untouched default, which needs no entry. */
export function serializeDesign(design: SavedDesign): string | null {
  if (design.name === DEFAULT_NAME && design.recipe === null) return null;
  return JSON.stringify({ version: 1, name: design.name, recipe: design.recipe });
}
