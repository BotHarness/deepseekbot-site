import { Button } from '@astryxdesign/core/Button';
import {
  AVATAR_ANIMAL_SPECIES,
  AVATAR_COLORS,
  AVATAR_EXTRA_PARTS,
  AVATAR_HAIR_PARTS,
  AVATAR_HEADPIECES,
  AVATAR_PARTS,
  AVATAR_PARTS_V2,
  AVATAR_PATTERNS,
  AVATAR_PIECE_COLORS,
  AVATAR_PIECE_COLORS_V4,
  AVATAR_PRESETS,
  AVATAR_RANGES,
  AVATAR_SPECIES,
  AVATAR_SPECIES_SWATCHES,
  AVATAR_STRANDS,
  AVATAR_SWATCHES,
  builtInHeadpiece,
  detailedRecipe,
  hiddenChoices,
  isAnimalSpecies,
  withBuiltInHeadpiece,
  withPieces,
  withSpecies,
  type PixelAvatarRecipe,
  type AvatarSpeciesV4,
} from '@botharness/pixel-avatar';
import { pixelTileSvg } from '../pixelTile';
import { memo, useMemo, useState } from 'react';
import type { Copy } from '../content';

type Fields = Record<string, string | number>;
type Recipe = PixelAvatarRecipe;

// The parts, tabs and edits mirror the pixel Avatar editor in BotHarness
// (packages/client/src/client/avatar-appearance-editor.tsx), without the Part Library.
const PIECE_COLORS = ['bangsColor', ...AVATAR_PIECE_COLORS, 'backHairColor', 'strandColor'];
const COLORS = [...AVATAR_COLORS, ...PIECE_COLORS];
const PARTS: Record<string, readonly string[]> = {
  species: [...AVATAR_SPECIES, ...AVATAR_ANIMAL_SPECIES],
  pattern: AVATAR_PATTERNS,
  ...AVATAR_PARTS_V2,
  ...AVATAR_HAIR_PARTS,
  rightSideHair: AVATAR_HAIR_PARTS.sideHair,
  beard: ['none', ...AVATAR_EXTRA_PARTS.beard],
  petals: AVATAR_EXTRA_PARTS.petals,
  flowerBase: AVATAR_EXTRA_PARTS.flowerBase,
  strand: ['none', ...AVATAR_STRANDS],
};
const CATEGORIES = [
  'presets',
  'species',
  'pattern',
  'hair',
  'bangs',
  'sideHair',
  'rightSideHair',
  'backHair',
  'strand',
  'petals',
  'flowerBase',
  ...Object.keys(AVATAR_PARTS).filter((part) => part !== 'backdrop' && part !== 'hair'),
  'beard',
  'headpiece',
  'shape',
  'colors',
];
const DETAIL = new Set<string>([...Object.keys(AVATAR_HAIR_PARTS), ...Object.keys(AVATAR_RANGES)]);
const EXTRAS = new Set<string>(Object.keys(AVATAR_EXTRA_PARTS));
const SPLIT = new Set<string>([
  'species',
  'sideHair',
  'rightSideHair',
  ...AVATAR_PIECE_COLORS,
  ...EXTRAS,
]);
const V4_KEYS = new Set<string>(['strand', 'pattern', ...AVATAR_PIECE_COLORS_V4]);
// accessories that became headpieces; a version 4 recipe offers them under Headpiece only
const MOVED = new Set<string>(AVATAR_HEADPIECES);
const V2_ONLY = (part: string, value: string | number) =>
  (part === 'outfit' || part === 'accessory') &&
  !(AVATAR_PARTS[part] as readonly (string | number)[]).includes(value);

const without = (recipe: Recipe, key: string) => {
  const { [key]: _removed, ...rest } = recipe as unknown as Fields;
  return rest as unknown as Recipe;
};

/**
 * Sets one part, upgrading the recipe only as far as the part needs: a species or split side hair
 * needs version 2, a strand, fur pattern or hair piece color version 4, and hair detail or shape
 * keys the detailed form. A new hairstyle resets the split.
 */
function withPart(recipe: Recipe, key: string, value: string | number): Recipe {
  if (key === 'species') return withSpecies(recipe, value as AvatarSpeciesV4);
  if (V4_KEYS.has(key)) {
    const rest = without(withPieces(recipe), key);
    return value === 'none' ? rest : ({ ...rest, [key]: value } as Recipe);
  }
  if (EXTRAS.has(key) && value === 'none') return without(recipe, key);
  if (SPLIT.has(key) || V2_ONLY(key, value))
    return { ...withSpecies(recipe, recipe.species ?? 'human'), [key]: value } as Recipe;
  if (DETAIL.has(key)) return { ...detailedRecipe(recipe), [key]: value } as Recipe;
  const next = { ...recipe, [key]: value } as Recipe;
  if (key !== 'hair' || recipe.bangs === undefined) return next;
  const { bangs: _b, sideHair: _s, backHair: _h, ...plain } = next;
  const split = detailedRecipe(plain as Recipe);
  return {
    ...split,
    ...(split.assetVersion === 2 ? { rightSideHair: split.sideHair } : {}),
    spacing: next.spacing ?? 0,
    height: next.height ?? 0,
    hairLength: next.hairLength ?? 0,
  } as Recipe;
}

function shuffled(recipe: Recipe): Recipe {
  const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)]!;
  const own = (key: string) => !SPLIT.has(key) && !V4_KEYS.has(key);
  const next: Fields = { ...(recipe as unknown as Fields) };
  for (const [part, values] of Object.entries(PARTS)) if (own(part)) next[part] = pick(values);
  for (const color of AVATAR_COLORS) next[color] = pick(AVATAR_SWATCHES[color]);
  for (const [key, [min, max]] of Object.entries(AVATAR_RANGES))
    next[key] = min + Math.floor(Math.random() * (max - min + 1));
  const species = pick(AVATAR_SPECIES);
  const random = withSpecies(next as unknown as Recipe, species) as unknown as Fields;
  for (const key of [...AVATAR_PIECE_COLORS, ...V4_KEYS, ...EXTRAS]) delete random[key];
  const beard = pick(['none', ...AVATAR_EXTRA_PARTS.beard]);
  return {
    ...random,
    sideHair: pick(AVATAR_HAIR_PARTS.sideHair),
    rightSideHair: pick(AVATAR_HAIR_PARTS.sideHair),
    skinColor: pick(AVATAR_SPECIES_SWATCHES[species]),
    ...(species === 'flower'
      ? {
          petals: pick(AVATAR_EXTRA_PARTS.petals),
          flowerBase: pick(AVATAR_EXTRA_PARTS.flowerBase),
        }
      : beard === 'none'
        ? {}
        : { beard }),
  } as unknown as Recipe;
}

/** Tabs for parts the recipe can show: petals and base only on a flower, fur only on an animal. */
const categoriesFor = (recipe: Recipe) => {
  const flower = recipe.species === 'flower';
  return CATEGORIES.filter((key) =>
    key === 'petals' || key === 'flowerBase'
      ? flower
      : key === 'beard' || key === 'strand'
        ? !flower
        : key === 'pattern'
          ? isAnimalSpecies(recipe.species)
          : true,
  );
};

function hiddenFor(recipe: Recipe, category: string): boolean {
  const hidden = hiddenChoices(recipe);
  return hidden.includes(category) || (category === 'hair' && hidden.includes('bangs'));
}

const Tile = memo(function Tile({
  recipe,
  selected,
  label,
  onSelect,
}: {
  recipe: Recipe;
  selected: boolean;
  label: string;
  onSelect(): void;
}) {
  const markup = useMemo(() => pixelTileSvg(recipe), [recipe]);
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
  recipe: Recipe;
  onChange(recipe: Recipe): void;
  onReset(): void;
  edited: boolean;
}

export function FaceEditor({ copy, recipe, onChange, onReset, edited }: Props) {
  const [chosen, setCategory] = useState('hair');
  const t = copy.playground.editor;
  const labels = copy.avatarLabels;
  const categories = categoriesFor(recipe);
  // a tab the new species doesn't have falls back to hair
  const category = categories.includes(chosen) ? chosen : 'hair';
  const fields = detailedRecipe(recipe) as unknown as Fields;
  const set = (key: string, value: string | number) => onChange(withPart(recipe, key, value));
  const option = (part: string, value: string) =>
    labels.options[`${part === 'rightSideHair' ? 'sideHair' : part}.${value}`] ?? value;
  const note = hiddenFor(recipe, category) ? (
    <p className="face-hidden-note">{labels.parts.hiddenNote}</p>
  ) : null;

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
    const skin = AVATAR_SPECIES_SWATCHES[recipe.species ?? 'human'];
    panel = (
      <div className="face-colors">
        {COLORS.map((key) => (
          <div key={key} className="face-color-row">
            <span>{labels.parts[key]}</span>
            <div className="face-swatches">
              {(key === 'skinColor'
                ? skin
                : (AVATAR_SWATCHES[key as keyof typeof AVATAR_SWATCHES] ??
                  AVATAR_SWATCHES.hairColor)
              ).map((value) => (
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
                value={String(fields[key] ?? fields.hairColor)}
                onChange={(event) => set(key, event.currentTarget.value)}
              />
              {fields[key] !== undefined && PIECE_COLORS.includes(key) ? (
                <button
                  type="button"
                  className="face-color-reset"
                  onClick={() => onChange(without(recipe, key))}
                >
                  {labels.parts.followHairColor}
                </button>
              ) : null}
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
  } else if (category === 'headpiece') {
    const worn = builtInHeadpiece(recipe);
    panel = (
      <div className="face-options">
        {note}
        <Tile
          recipe={withBuiltInHeadpiece(recipe, undefined)}
          selected={worn === undefined}
          label={labels.parts.none!}
          onSelect={() => onChange(withBuiltInHeadpiece(recipe, undefined))}
        />
        {AVATAR_HEADPIECES.map((value) => (
          <Tile
            key={value}
            recipe={withBuiltInHeadpiece(recipe, value)}
            selected={worn === value}
            label={option('headpiece', value)}
            onSelect={() => onChange(withBuiltInHeadpiece(recipe, value))}
          />
        ))}
      </div>
    );
  } else {
    const values = (PARTS[category] ?? []).filter(
      (value) =>
        !(
          category === 'accessory' &&
          recipe.assetVersion === 4 &&
          MOVED.has(value) &&
          fields[category] !== value
        ),
    );
    panel = (
      <div className="face-options">
        {note}
        {values.map((value) => (
          <Tile
            key={value}
            recipe={withPart(recipe, category, value)}
            selected={(fields[category] ?? 'none') === value}
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
        {categories.map((key) => (
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
