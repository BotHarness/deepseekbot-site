import {
  cellsFromRows,
  morphPixels,
  pixelPathMarkup,
  type PixelCell,
  type PixelMorphRun,
} from '@botharness/pixel-morph';
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import type { Mode } from '../site';
import { MORPH_FRAME_MS, MORPH_MS, prefersReducedMotion } from './PixelAvatar';

const GRID = 24;
const SPRITES = {
  light: cellsFromRows(
    [
      '........R........',
      '..R.....Y.....R..',
      '...Y.........Y...',
      '......OOOOO......',
      '.....OYYYYYO.....',
      '....OYLLLLYYO....',
      '...OYLLLLYYYYO...',
      '...OYLLYYYYYYO...',
      'RY.OYYYYYYYYMO.YR',
      '...OYYYYYYYMMO...',
      '...OYYYYYYMMMO...',
      '....OYYYMMMMO....',
      '.....OMMMMMO.....',
      '......OOOOO......',
      '...Y.........Y...',
      '..R.....Y.....R..',
      '........R........',
    ],
    { R: '#d88a28', Y: '#ffc94e', L: '#fff2a8', O: '#973f32', M: '#ec8a31' },
    4,
    4,
  ),
  dark: cellsFromRows(
    [
      '.......OOOO......',
      '.....OOHHHO...S..',
      '....OHLLLO...SSS.',
      '...OHLLLO.....S..',
      '..OHLLLO.........',
      '..OLLLLO.........',
      '.OHLLLLO.........',
      '.OHLLLLLO.......S',
      '.OLLLLLLLO.......',
      '.OLLLMLLLLO...OO.',
      '.OLMLLLLLLLOOOL..',
      '..OLLLLLLLLLLO...',
      '..OMLLLLLLLLMO...',
      '...OMMMMMMMMO....',
      '....OOOMMOOO.....',
      '.......OO........',
    ],
    { O: '#666ab4', H: '#ffffff', L: '#e7e5ff', M: '#aaa7e2', S: '#fff1b5' },
    4,
    4,
  ),
} as const;

export function HeroThemeToggle({
  lang,
  mode,
  onMode,
}: {
  lang: Lang;
  mode: Mode;
  onMode: (mode: Mode) => void;
}) {
  const group = useRef<SVGGElement>(null);
  const sprite = useRef<readonly PixelCell[] | undefined>(undefined);
  const run = useRef<PixelMorphRun | null>(null);

  useLayoutEffect(() => {
    const layer = group.current;
    const to = SPRITES[mode];
    if (!layer || sprite.current === to) return;
    const from = run.current?.current() ?? sprite.current;
    sprite.current = to;
    if (!from || prefersReducedMotion()) {
      run.current?.cancel();
      run.current = null;
      layer.innerHTML = pixelPathMarkup(to);
      return;
    }

    const animation = morphPixels(layer, from, to, MORPH_MS, {
      size: GRID,
      frameMs: MORPH_FRAME_MS,
      markup: pixelPathMarkup,
    });
    run.current = animation;
    void animation.finished.then(() => {
      if (run.current === animation) run.current = null;
    });
  }, [mode]);

  useEffect(() => () => run.current?.cancel(), []);

  const t = HERO_COPY[lang];
  const next = mode === 'light' ? 'dark' : 'light';
  const label = next === 'dark' ? t.switchNight : t.switchDay;
  return (
    <button
      className="hero-theme-toggle"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onMode(next)}
    >
      <svg viewBox={`0 0 ${GRID} ${GRID}`} shapeRendering="crispEdges" aria-hidden="true">
        <g ref={group} />
      </svg>
    </button>
  );
}
