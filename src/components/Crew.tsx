import { seededRecipe, type PixelSymbol } from '@botharness/pixel-avatar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CREW, SYMBOL_ORDER, type Copy } from '../content';
import { MORPH_MS, PixelAvatar, prefersReducedMotion, type PixelAvatarHandle } from './PixelAvatar';

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const id = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      resolve();
    });
  });

const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)]!;

/** One crew member: idles as a face, then picks up a tool, works a while and puts it down. */
function Member({ name, symbols }: { name: string; symbols: Copy['symbols'] }) {
  const recipe = useMemo(() => seededRecipe(name), [name]);
  const avatar = useRef<PixelAvatarHandle>(null);
  const [tool, setTool] = useState<PixelSymbol | null>(null);
  const hero = name === 'DeepSeekBot';

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const stop = new AbortController();
    const { signal } = stop;
    void (async () => {
      await wait(400 + Math.random() * 2600, signal);
      while (!signal.aborted) {
        // a turn: one to three tools in a row, then back to the face
        const turn = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < turn && !signal.aborted; i++) {
          const next = pick(SYMBOL_ORDER.filter((s) => s !== 'other'));
          setTool(next);
          await avatar.current?.show(next);
          await wait(900 + Math.random() * 900, signal);
        }
        if (signal.aborted) break;
        setTool(null);
        await avatar.current?.show(null);
        await wait(MORPH_MS + 1500 + Math.random() * 3500, signal);
      }
    })();
    return () => stop.abort();
  }, []);

  return (
    <li className={hero ? 'crew-member crew-member--hero' : 'crew-member'}>
      <span className="crew-bubble" data-visible={tool ? '' : undefined} aria-hidden="true">
        {tool ? symbols[tool] : ' '}
      </span>
      <PixelAvatar ref={avatar} recipe={recipe} size={hero ? 128 : 88} />
      <span className="crew-name">{name}</span>
    </li>
  );
}

export function Crew({ copy }: { copy: Copy }) {
  return (
    <ul className="crew" aria-label={copy.hero.crewLabel}>
      {CREW.map((name) => (
        <Member key={name} name={name} symbols={copy.symbols} />
      ))}
    </ul>
  );
}
