import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { PART_SLOTS, wornPart, type PartSlot, type PixelSymbol } from '@botharness/pixel-avatar';
import { useRef, useState } from 'react';
import { SYMBOL_ORDER, type Copy, type Lang } from '../content';
import { avatarPath } from '../site';
import { track } from '../analytics';
import { downloadAvatar } from '../download';
import type { AvatarDesign } from '../avatarDesign';
import { FaceEditor } from './FaceEditor';
import { PixelAvatar, type PixelAvatarHandle } from './PixelAvatar';
import { SymbolIcon } from './SymbolIcon';

const CUSTOM_SLOTS = Object.keys(PART_SLOTS) as PartSlot[];

/**
 * The avatar stage, name and tool morphs. On the home page it links to the Avatar Studio; in the
 * studio (`studio`) the full editor sits beside it in two more panels.
 */
export function Playground({
  copy,
  lang,
  design,
  studio = false,
}: {
  copy: Copy;
  lang: Lang;
  design: AvatarDesign;
  studio?: boolean;
}) {
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

  const editor = studio ? (
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
  ) : (
    <div className="studio-card frame" data-placement="playground">
      <h3>{t.studio.title}</h3>
      <p>{t.studio.body}</p>
      <Button label={`${t.studio.cta} →`} variant="primary" size="lg" href={avatarPath(lang)} />
    </div>
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
              track('avatar_downloaded', {
                edited,
                species: recipe.species ?? 'human',
                drawn_parts: CUSTOM_SLOTS.filter((slot) => wornPart(recipe, slot)).length,
              });
              return downloadAvatar(recipe, seed);
            }}
          />
        </div>
      </div>
      {studio ? null : editor}
      {studio ? null : tools}
    </div>
  );

  return studio ? (
    <div className="studio">
      <div className="studio-left">
        {stage}
        {controls}
      </div>
      {editor}
      <div className="studio-tools">{tools}</div>
    </div>
  ) : (
    <div className="playground">
      {stage}
      {controls}
    </div>
  );
}
