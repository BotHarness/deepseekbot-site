import {
  faceCells,
  pixelSymbolCells,
  type PixelAvatarRecipe,
  type PixelCell,
  type PixelSymbol,
} from '@botharness/pixel-avatar';
import { pixelTileSvg } from '../pixelTile';
import { morphPixels, pixelPathMarkup, type PixelMorphRun } from '@botharness/pixel-morph';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, type Ref } from 'react';

export const MORPH_MS = 800;
// 24 steps a second keeps the hop chunky, like a sprite animation
const FRAME_MS = 1000 / 24;

export interface PixelAvatarHandle {
  /** Morph into `symbol`, or back to the face when `null`. Resolves when the morph lands. */
  show(symbol: PixelSymbol | null): Promise<void>;
}

interface Props {
  recipe: PixelAvatarRecipe;
  size: number;
  label?: string;
  ref?: Ref<PixelAvatarHandle>;
}

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function PixelAvatar({ recipe, size, label, ref }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  // the latest morph; its `current()` is what is on screen, so the next one starts from there
  const run = useRef<PixelMorphRun | null>(null);
  const shown = useRef<PixelCell[] | null>(null);
  const svg = useMemo(() => pixelTileSvg(recipe), [recipe]);
  const face = useMemo(() => faceCells(recipe), [recipe]);

  // a new recipe resets to its plain face
  useEffect(() => {
    run.current?.cancel();
    run.current = null;
    shown.current = null;
    host.current?.removeAttribute('data-morphing');
  }, [svg]);

  const show = useCallback(
    async (symbol: PixelSymbol | null) => {
      const root = host.current;
      const layer = root?.querySelector<SVGGElement>('[data-avatar-pixel-morph]');
      if (!root || !layer) return;
      const from = run.current?.current() ?? shown.current ?? face;
      const to = symbol ? pixelSymbolCells(symbol, recipe.hairColor) : face;
      // draw the start pose before hiding the rig, so no frame is blank
      layer.innerHTML = pixelPathMarkup(from);
      root.setAttribute('data-morphing', '');
      if (prefersReducedMotion()) {
        run.current?.cancel();
        run.current = null;
      } else {
        const next = morphPixels(layer, from, to, MORPH_MS, {
          frameMs: FRAME_MS,
          markup: pixelPathMarkup,
        });
        run.current = next;
        // a newer morph took over this layer; it settles the state
        if (!(await next.finished)) return;
        run.current = null;
      }
      shown.current = symbol ? to : null;
      if (symbol) {
        layer.innerHTML = pixelPathMarkup(to);
      } else {
        root.removeAttribute('data-morphing');
        layer.innerHTML = '';
      }
    },
    [face, recipe.hairColor],
  );

  useImperativeHandle(ref, () => ({ show }), [show]);

  return (
    <span
      ref={host}
      className="pixel-avatar"
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      // the markup is generated locally by pixel-avatar from a validated recipe
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
