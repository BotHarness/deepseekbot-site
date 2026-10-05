import { Button } from '@astryxdesign/core/Button';
import {
  AVATAR_COLORS,
  AVATAR_HAIR_PARTS,
  AVATAR_PARTS,
  AVATAR_PRESETS,
  AVATAR_RANGES,
  AVATAR_SWATCHES,
  detailedRecipe,
  pixelAvatarSvg,
  type PixelAvatarRecipe,
} from '@botharness/pixel-avatar';
import { memo, useMemo, useState } from 'react';
import type { Copy } from '../content';

type Fields = Record<string, string | number>;

const PARTS: Record<string, readonly string[]> = { ...AVATAR_PARTS, ...AVATAR_HAIR_PARTS };
// the same tabs, in the same order, as the avatar editor in BotHarness
const CATEGORIES = [
  'presets',
  'hair',
  ...Object.keys(AVATAR_HAIR_PARTS),
  ...Object.keys(AVATAR_PARTS).filter((part) => part !== 'backdrop' && part !== 'hair'),
  'shape',
  'colors',
];
const DETAIL = new Set<string>([...Object.keys(AVATAR_HAIR_PARTS), ...Object.keys(AVATAR_RANGES)]);

/** Sets one part. Hair-detail and shape keys need the detailed form; a new hairstyle resets the split. */
function withPart(
  recipe: PixelAvatarRecipe,
  key: string,
  value: string | number,
): PixelAvatarRecipe {
  if (DETAIL.has(key)) return { ...detailedRecipe(recipe), [key]: value } as PixelAvatarRecipe;
  const next = { ...recipe, [key]: value } as PixelAvatarRecipe;
  if (key !== 'hair' || recipe.bangs === undefined) return next;
  const { bangs: _b, sideHair: _s, backHair: _h, ...plain } = next;
  return {
    ...detailedRecipe(plain as PixelAvatarRecipe),
    spacing: next.spacing ?? 0,
    height: next.height ?? 0,
    hairLength: next.hairLength ?? 0,
  };
}

function shuffled(recipe: PixelAvatarRecipe): PixelAvatarRecipe {
  const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)]!;
  const next: Fields = { ...(detailedRecipe(recipe) as unknown as Fields) };
  for (const [part, values] of Object.entries(PARTS)) next[part] = pick(values);
  for (const color of AVATAR_COLORS) next[color] = pick(AVATAR_SWATCHES[color]);
  for (const [key, [min, max]] of Object.entries(AVATAR_RANGES))
    next[key] = min + Math.floor(Math.random() * (max - min + 1));
  return next as unknown as PixelAvatarRecipe;
}

const Tile = memo(function Tile({
  recipe,
  selected,
  label,
  onSelect,
}: {
  recipe: PixelAvatarRecipe;
  selected: boolean;
  label: string;
  onSelect(): void;
}) {
  const markup = useMemo(() => pixelAvatarSvg(recipe), [recipe]);
  return (
    <button
      type="button"
      className="face-option"
      aria-pressed={selected}
      aria-label={label}
      title={label}
      onClick={onSelect}
    >
      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
    </button>
  );
});

interface Props {
  copy: Copy;
  recipe: PixelAvatarRecipe;
  onChange(recipe: PixelAvatarRecipe): void;
  onReset(): void;
  edited: boolean;
}

export function FaceEditor({ copy, recipe, onChange, onReset, edited }: Props) {
  const [category, setCategory] = useState('hair');
  const t = copy.playground.editor;
  const labels = copy.avatarLabels;
  const fields = detailedRecipe(recipe) as unknown as Fields;
  const set = (key: string, value: string | number) => onChange(withPart(recipe, key, value));
  const option = (part: string, value: string) => labels.options[`${part}.${value}`] ?? value;

  let panel;
  if (category === 'presets') {
    panel = (
      <div className="face-options">
        {AVATAR_PRESETS.map((preset, i) => (
          <Tile
            key={i}
            recipe={preset}
            selected={JSON.stringify(preset) === JSON.stringify(recipe)}
            label={`${labels.parts.presets} ${i + 1}`}
            onSelect={() => onChange(preset)}
          />
        ))}
      </div>
    );
  } else if (category === 'colors') {
    panel = (
      <div className="face-colors">
        {AVATAR_COLORS.map((key) => (
          <div key={key} className="face-color-row">
            <span>{labels.parts[key]}</span>
            <div className="face-swatches">
              {AVATAR_SWATCHES[key].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="face-swatch"
                  style={{ background: value }}
                  aria-pressed={String(fields[key]).toLowerCase() === value}
                  aria-label={`${labels.parts[key]} ${value}`}
                  onClick={() => set(key, value)}
                />
              ))}
              <input
                type="color"
                aria-label={labels.parts[key]}
                value={String(fields[key])}
                onChange={(event) => set(key, event.currentTarget.value)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (category === 'shape') {
    panel = (
      <div className="face-ranges">
        {Object.entries(AVATAR_RANGES).map(([key, [min, max]]) => (
          <label key={key}>
            <span>{labels.parts[key]}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={Number(fields[key] ?? 0)}
              onChange={(event) => set(key, Number(event.currentTarget.value))}
            />
          </label>
        ))}
      </div>
    );
  } else {
    panel = (
      <div className="face-options">
        {(PARTS[category] ?? []).map((value) => (
          <Tile
            key={value}
            recipe={withPart(recipe, category, value)}
            selected={fields[category] === value}
            label={option(category, value)}
            onSelect={() => set(category, value)}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="face-editor frame" aria-labelledby="face-editor-title">
      <div className="face-editor-head">
        <div>
          <h3 id="face-editor-title">{t.title}</h3>
          <p>{t.lead}</p>
        </div>
        <div className="face-editor-actions">
          <Button label={t.shuffle} onClick={() => onChange(shuffled(recipe))} />
          <Button label={t.reset} isDisabled={!edited} onClick={onReset} />
        </div>
      </div>
      <div className="face-tabs" role="group" aria-label={t.parts}>
        {CATEGORIES.map((key) => (
          <button
            key={key}
            type="button"
            className="face-tab"
            aria-pressed={category === key}
            onClick={() => setCategory(key)}
          >
            {labels.parts[key] ?? key}
          </button>
        ))}
      </div>
      {panel}
    </section>
  );
}
