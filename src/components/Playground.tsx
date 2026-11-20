import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { PART_SLOTS, wornPart, type PartSlot, type PixelSymbol } from '@botharness/pixel-avatar';
import { useRef, useState } from 'react';
import { SYMBOL_ORDER, type Copy } from '../content';
import { track } from '../analytics';
import { downloadAvatar } from '../download';
import type { AvatarDesign } from '../avatarDesign';
import { FaceEditor } from './FaceEditor';
import { PixelAvatar, type PixelAvatarHandle } from './PixelAvatar';
import { SymbolIcon } from './SymbolIcon';

const CUSTOM_SLOTS = Object.keys(PART_SLOTS) as PartSlot[];

/** The Avatar Studio stage, tool morphs and editor panels. */
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

  const editor = (
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
  );

  const stage = (
    <>
      <div className="playground-stage frame">
        <PixelAvatar ref={avatar} recipe={recipe} size={256} label={seed} />
        <p className="playground-status" aria-live="polite">
          <strong title={seed}>{seed}</strong>
          <span>{tool ? copy.symbols[tool] : ' '}</span>
        </p>
      </div>
    </>
  );

  const tools = (
    <>
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
    </>
  );

  const controls = (
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
              track('avatar_editor:avatar_download', {
                edited,
                species: recipe.species ?? 'human',
                drawn_parts: CUSTOM_SLOTS.filter((slot) => wornPart(recipe, slot)).length,
              });
              return downloadAvatar(recipe, seed);
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="studio">
      <div className="studio-left">
        {stage}
        {controls}
      </div>
      {editor}
      <div className="studio-tools">{tools}</div>
    </div>
  );
}
