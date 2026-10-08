import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import type { PixelSymbol } from '@botharness/pixel-avatar';
import { useRef, useState } from 'react';
import { SYMBOL_ORDER, type Copy } from '../content';
import { track } from '../analytics';
import { downloadAvatar } from '../download';
import type { AvatarDesign } from '../avatarDesign';
import { FaceEditor } from './FaceEditor';
import { PixelAvatar, type PixelAvatarHandle } from './PixelAvatar';
import { SymbolIcon } from './SymbolIcon';

export function Playground({ copy, design }: { copy: Copy; design: AvatarDesign }) {
  const { name, seed, recipe, edited } = design;
  const avatar = useRef<PixelAvatarHandle>(null);
  const [tool, setTool] = useState<PixelSymbol | null>(null);
  const t = copy.playground;

  const use = (symbol: PixelSymbol | null) => {
    setTool(symbol);
    void avatar.current?.show(symbol);
  };

  const shuffle = () => {
    setTool(null);
    design.shuffle();
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
              design.rename(value);
            }}
          />
          <div className="playground-buttons">
            <Button label={t.shuffle} onClick={shuffle} />
            <Button
              label={t.download}
              variant="primary"
              clickAction={() => {
                track('avatar_downloaded', { edited: edited });
                return downloadAvatar(recipe, seed);
              }}
            />
          </div>
        </div>
        <FaceEditor
          copy={copy}
          recipe={recipe}
          edited={edited}
          onChange={(next) => {
            setTool(null);
            design.edit(next);
          }}
          onReset={() => {
            setTool(null);
            design.reset();
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
