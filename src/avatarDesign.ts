import { useDeferredValue, useMemo, useState } from 'react';
import type { PixelAvatarRecipe } from '@botharness/pixel-avatar';
import { recipeFor } from './mascot';

const NAMES = ['Mira', 'Theo', 'Nova', 'Juno', 'Kai', 'Lumi', 'Orion', 'Pixel', 'Sora', 'Ada'];
/** One current appearance, owned by App and consumed by the editor and companion. */
export function useAvatarDesign() {
  const [name, setName] = useState('DeepSeekBot');
  const seed = useDeferredValue(name.trim() || 'DeepSeekBot');
  const named = useMemo(() => recipeFor(seed), [seed]);
  const [custom, setCustom] = useState<PixelAvatarRecipe | null>(null);
  return {
    name,
    seed,
    recipe: custom ?? named,
    edited: custom !== null,
    rename(value: string) {
      setCustom(null);
      setName(value.slice(0, 32));
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
