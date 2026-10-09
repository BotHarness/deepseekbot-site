import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import type { PixelAvatarRecipe } from '@botharness/pixel-avatar';
import { track } from './analytics';
import { DEFAULT_NAME, DESIGN_KEY, MAX_NAME, parseDesign, serializeDesign } from './avatarStore';
import { recipeFor } from './mascot';
import { read } from './site';

// report a restored design once per page load (StrictMode runs effects twice in development)
let restoredReported = false;

const NAMES = ['Mira', 'Theo', 'Nova', 'Juno', 'Kai', 'Lumi', 'Orion', 'Pixel', 'Sora', 'Ada'];

function store(value: string | null) {
  try {
    if (value === null) localStorage.removeItem(DESIGN_KEY);
    else localStorage.setItem(DESIGN_KEY, value);
  } catch {
    // private windows may refuse storage; the design just won't survive a reload
  }
}

/**
 * One current appearance, owned by App and consumed by the editor and companion. It is restored
 * from this browser on load and saved on every change.
 */
export function useAvatarDesign() {
  const [saved] = useState(() => parseDesign(read(DESIGN_KEY)));
  const [name, setName] = useState(saved?.name ?? DEFAULT_NAME);
  const seed = useDeferredValue(name.trim() || DEFAULT_NAME);
  const named = useMemo(() => recipeFor(seed, 2), [seed]);
  const [custom, setCustom] = useState<PixelAvatarRecipe | null>(saved?.recipe ?? null);
  const recipe = custom ?? named;

  useEffect(() => {
    if (!saved || restoredReported) return;
    restoredReported = true;
    track('avatar_restored', {
      edited: saved.recipe !== null,
      species: (saved.recipe ?? recipeFor(saved.name.trim() || DEFAULT_NAME, 2)).species ?? 'human',
    });
  }, [saved]);
  useEffect(() => store(serializeDesign({ name, recipe: custom })), [name, custom]);

  return {
    name,
    seed,
    recipe,
    edited: custom !== null,
    rename(value: string) {
      setCustom(null);
      setName(value.slice(0, MAX_NAME));
    },
    edit: setCustom,
    reset() {
      setCustom(null);
    },
    shuffle() {
      const others = NAMES.filter((n) => n !== name);
      setCustom(null);
      setName(others[Math.floor(Math.random() * others.length)]!);
    },
  };
}
export type AvatarDesign = ReturnType<typeof useAvatarDesign>;
