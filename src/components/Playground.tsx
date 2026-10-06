import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import type { PixelAvatarRecipe, PixelSymbol } from '@botharness/pixel-avatar';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { SYMBOL_ORDER, type Copy } from '../content';
import { track } from '../analytics';
import { downloadAvatar } from '../download';
import { recipeFor } from '../mascot';
import { FaceEditor } from './FaceEditor';
import { PixelAvatar, type PixelAvatarHandle } from './PixelAvatar';
import { SymbolIcon } from './SymbolIcon';

const NAMES = ['Mira', 'Theo', 'Nova', 'Juno', 'Kai', 'Lumi', 'Orion', 'Pixel', 'Sora', 'Ada'];

export function Playground({ copy }: { copy: Copy }) {
  const [name, setName] = useState('DeepSeekBot');
  const seed = useDeferredValue(name.trim() || 'DeepSeekBot');
  const named = useMemo(() => recipeFor(seed), [seed]);
  // a face edited in the editor wins until the name changes or it is reset
  const [custom, setCustom] = useState<PixelAvatarRecipe | null>(null);
  const recipe = custom ?? named;
  const avatar = useRef<PixelAvatarHandle>(null);
  const [tool, setTool] = useState<PixelSymbol | null>(null);
  const t = copy.playground;

  const use = (symbol: PixelSymbol | null) => {
    setTool(symbol);
    void avatar.current?.show(symbol);
  };

  const shuffle = () => {
    const others = NAMES.filter((n) => n !== name);
    setTool(null);
    setCustom(null);
    setName(others[Math.floor(Math.random() * others.length)]!);
  };

  return (
    <div className="playground">
      <div className="playground-stage frame">
        <PixelAvatar ref={avatar} recipe={recipe} size={256} label={seed} />
        <p className="playground-status" aria-live="polite">
          <strong title={seed}>{seed}</strong>
          <span>{tool ? copy.symbols[tool] : ' '}</span>
        </p>
      </div>
      <div className="playground-controls">
        <div className="playground-name">
          <TextInput
            label={t.nameLabel}
            value={name}
            placeholder={t.namePlaceholder}
            onChange={(value) => {
              setTool(null);
              setCustom(null);
              setName(value.slice(0, 32));
            }}
          />
          <div className="playground-buttons">
            <Button label={t.shuffle} onClick={shuffle} />
            <Button
              label={t.download}
              variant="primary"
              clickAction={() => {
                track('avatar_downloaded', { edited: custom !== null });
                return downloadAvatar(recipe, seed);
              }}
            />
          </div>
        </div>
        <FaceEditor
          copy={copy}
          recipe={recipe}
          edited={custom !== null}
          onChange={(next) => {
            setTool(null);
            setCustom(next);
          }}
          onReset={() => {
            setTool(null);
            setCustom(null);
          }}
        />
        <fieldset className="playground-tools">
          <legend>{t.toolsLabel}</legend>
          <div className="tool-grid">
            {SYMBOL_ORDER.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className="tool-chip"
                aria-pressed={tool === symbol}
                onClick={() => use(tool === symbol ? null : symbol)}
              >
                <SymbolIcon symbol={symbol} color={recipe.hairColor} />
                <span>{copy.symbols[symbol]}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="playground-actions">
          <Button label={t.face} isDisabled={!tool} onClick={() => use(null)} />
        </div>
        <p className="caption">{t.caption}</p>
      </div>
    </div>
  );
}
