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
  AVATAR_RANGES,
  AVATAR_SPECIES,
  AVATAR_SPECIES_SWATCHES,
  AVATAR_STRANDS,
  AVATAR_SWATCHES,
  builtInHeadpiece,
  customPartId,
  detailedRecipe,
  hairPieceStart,
  headpieceStart,
  hiddenChoices,
  isAnimalSpecies,
  isHairPartSlot,
  isReplacePartSlot,
  replacePartStart,
  withBuiltInHeadpiece,
  withCustomPart,
  withPieces,
  withSpecies,
  wornPart,
  type AvatarSpeciesV4,
  type PartSlot,
  type PixelAvatarRecipe,
  type PixelCustomPart,
  type ReplacePartSlot,
} from '@botharness/pixel-avatar';
import { pixelTileSvg } from '../pixelTile';
import { PRESETS } from '../presets';
import { addPart, addParts, loadParts, removePart, type PartEntry } from '../partLibrary';
import {
  MAX_PART_LIBRARY_FILE_BYTES,
  decodePartFiles,
  encodePartFile,
  encodePartLibrary,
  partFileName,
  type PartFile,
} from '../partFile';
import { memo, useMemo, useRef, useState } from 'react';
import type { Copy } from '../content';
import { PartEditor } from './PartEditor';
import { track } from '../analytics';

type Fields = Record<string, string | number>;
type Recipe = PixelAvatarRecipe;

// The parts, tabs and edits mirror the pixel Avatar editor in BotHarness
// (packages/client/src/client/avatar-appearance-editor.tsx). The Part Library lives in this
// browser (src/partLibrary.ts) and has no file import or export.
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
/** The tabs that can wear a drawn part, and the slot it goes in. */
const PART_CATEGORY: Partial<Record<string, PartSlot>> = {
  headpiece: 'headpiece',
  pattern: 'pattern',
  bangs: 'bangs',
  sideHair: 'leftSideHair',
  rightSideHair: 'rightSideHair',
  backHair: 'backHair',
  outfit: 'outfit',
  accessory: 'accessory',
  beard: 'beard',
  glasses: 'glasses',
  nose: 'nose',
  cheeks: 'cheeks',
  petals: 'petals',
  flowerBase: 'flowerBase',
};

interface Drawing {
  slot: PartSlot;
  /** the recipe the drawn part is worn on */
  base: Recipe;
  /** the recipe to go back to when drawing stops */
  restore: Recipe;
  /** shown faintly behind the canvas, when it differs from `base` */
  backdrop?: Recipe;
  initial?: PixelCustomPart;
  parent?: string;
  note?: string;
}
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

// A flower draws petals, a face and a base: no hair, headwear, eye color or hair piece colors.
// hiddenChoices() covers the rest.
const FLOWER_HIDDEN = new Set(['headpiece', 'strand', 'beard']);
const FLOWER_COLORS = new Set(['eyeColor', 'bangsColor', 'backHairColor', 'strandColor']);
/** The hair piece each piece color paints, and the part slot a drawn piece would take. */
const PIECE_OF: Record<string, [field: string, slot: PartSlot]> = {
  bangsColor: ['bangs', 'bangs'],
  leftSideHairColor: ['sideHair', 'leftSideHair'],
  rightSideHairColor: ['rightSideHair', 'rightSideHair'],
  backHairColor: ['backHair', 'backHair'],
  strandColor: ['strand', 'headpiece'],
};

/**
 * Whether a color row changes anything: a flower has no eyes or hair pieces and only a pot takes the
 * outfit color, and a hair piece color needs that piece to be there, built in or drawn.
 */
function colorShown(recipe: Recipe, fields: Fields, key: string): boolean {
  if (recipe.species === 'flower')
    return !FLOWER_COLORS.has(key) && (key !== 'shirtColor' || fields.flowerBase === 'pot');
  const piece = PIECE_OF[key];
  if (!piece) return true;
  const [field, slot] = piece;
  const value = fields[field] ?? (field === 'rightSideHair' ? fields.sideHair : undefined);
  if (field === 'strand') return value !== undefined && value !== 'none';
  // BotPixel 0.10 draws bun and odango back hair in the hair color, ignoring backHairColor
  if (field === 'backHair' && (value === 'bun' || value === 'odango'))
    return wornPart(recipe, slot) !== undefined;
  return (value !== undefined && value !== 'none') || wornPart(recipe, slot) !== undefined;
}

/**
 * Parts the species itself never draws. Headwear also hides hair, but only until it comes off, so
 * those tabs stay with a note; this asks with the headwear removed.
 */
function speciesHidden(recipe: Recipe): Set<string> {
  const bare = { ...withBuiltInHeadpiece(recipe, undefined), accessory: 'none' } as Recipe;
  const hidden = new Set(hiddenChoices(bare));
  if (hidden.has('bangs')) hidden.add('hair');
  if (recipe.species === 'flower') for (const key of FLOWER_HIDDEN) hidden.add(key);
  return hidden;
}

/**
 * Tabs for parts the recipe can show: petals and base only on a flower, fur only on an animal, and
 * nothing the species hides, so every tile in a tab looks different.
 */
const categoriesFor = (recipe: Recipe) => {
  const flower = recipe.species === 'flower';
  const hidden = speciesHidden(recipe);
  return CATEGORIES.filter((key) =>
    hidden.has(key)
      ? false
      : key === 'petals' || key === 'flowerBase'
        ? flower
        : key === 'pattern'
          ? isAnimalSpecies(recipe.species)
          : true,
  );
};

function saveFile(fileName: string, bytes: Uint8Array, type: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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
  const [chosen, setCategory] = useState('presets');
  const [parts, setParts] = useState<PartEntry[]>(loadParts);
  const [started, setDrawing] = useState<Drawing>();
  const [libraryNote, setLibraryNote] = useState<string>();
  const picker = useRef<HTMLInputElement>(null);
  // the recipe the editor last showed; any other change (a rename, reset or preset) ends drawing
  const drawn = useRef<Recipe>(undefined);
  const drawing = started && drawn.current === recipe ? started : undefined;
  const partText = copy.avatarLabels.draw;
  const t = copy.playground.editor;
  const labels = copy.avatarLabels;
  const categories = categoriesFor(recipe);
  // a tab the new species doesn't have falls back to the presets
  const category = categories.includes(chosen) ? chosen : 'presets';
  const fields = detailedRecipe(recipe) as unknown as Fields;
  const set = (key: string, value: string | number) => onChange(withPart(recipe, key, value));
  const option = (part: string, value: string) =>
    labels.options[`${part === 'rightSideHair' ? 'sideHair' : part}.${value}`] ?? value;
  const note = hiddenFor(recipe, category) ? (
    <p className="face-hidden-note">{labels.parts.hiddenNote}</p>
  ) : null;
  const pieceSlot = PART_CATEGORY[category];
  const pieceWorn = pieceSlot !== undefined && wornPart(recipe, pieceSlot) !== undefined;
  /** A built-in choice, taking off any drawn part in that slot. */
  const builtIn = (key: string, value: string): Recipe => {
    const next = withPart(recipe, key, value);
    const slot = PART_CATEGORY[key];
    return slot && wornPart(next, slot) ? withCustomPart(next, slot, undefined) : next;
  };
  const show = (next: Recipe) => {
    drawn.current = next;
    onChange(next);
  };
  const begin = (next: Drawing, start: 'new' | 'edit' | 'piece') => {
    track('avatar_part_draw_started', { slot: next.slot, start });
    drawn.current = recipe;
    setDrawing(next);
  };

  const partEditor = () =>
    drawing ? (
      <PartEditor
        key={`${drawing.slot}:${drawing.parent ?? 'new'}`}
        slot={drawing.slot}
        note={drawing.note}
        backdrop={drawing.backdrop}
        recipe={drawing.base}
        initial={drawing.initial}
        labels={labels}
        onChange={(part) => show(withCustomPart(drawing.base, drawing.slot, part))}
        onSave={(part, name) => {
          const saved = addPart(parts, part, name, drawing.parent);
          if (!saved) return false;
          track('avatar_part_saved', { slot: drawing.slot, derived: drawing.parent !== undefined });
          setParts(saved.entries);
          setDrawing(undefined);
          onChange(withCustomPart(drawing.base, drawing.slot, saved.entry.part));
          return true;
        }}
        onCancel={() => {
          track('avatar_part_draw_cancelled', { slot: drawing.slot });
          setDrawing(undefined);
          onChange(drawing.restore);
        }}
      />
    ) : null;

  const fileOf = (entry: PartEntry): PartFile => ({
    part: entry.part,
    name: entry.name,
    ...(entry.author ? { author: entry.author } : {}),
  });
  /** One part as a part PNG, or the whole library as a zip of them, importable into DeepSeekBot. */
  const exportParts = async (part?: PixelCustomPart) => {
    try {
      if (part) {
        const id = customPartId(part);
        const saved = parts.find((entry) => entry.id === id);
        const file = saved ? fileOf(saved) : { part, name: '' };
        saveFile(partFileName(file), await encodePartFile(file), 'image/png');
        track('avatar_part_exported', { scope: 'part', slot: part.slot, count: 1 });
      } else {
        saveFile('part-library.zip', await encodePartLibrary(parts.map(fileOf)), 'application/zip');
        track('avatar_part_exported', { scope: 'library', count: parts.length });
      }
    } catch {
      setLibraryNote(partText.exportFailed);
    }
  };
  const importFiles = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PART_LIBRARY_FILE_BYTES) {
      track('avatar_part_import_failed', { reason: 'too-large' });
      setLibraryNote(partText.importTooLarge);
      return;
    }
    let result;
    try {
      result = await decodePartFiles(new Uint8Array(await file.arrayBuffer()));
    } catch {
      result = 'not-png' as const;
    }
    if (typeof result === 'string') {
      track('avatar_part_import_failed', { reason: result });
      setLibraryNote(
        result === 'too-large'
          ? partText.importTooLarge
          : result === 'invalid-part'
            ? partText.invalidPart
            : partText.notPartFile,
      );
      return;
    }
    const saved = addParts(parts, result.files);
    if (!saved) {
      track('avatar_part_import_failed', { reason: 'storage' });
      setLibraryNote(partText.saveFailed);
      return;
    }
    track('avatar_part_imported', {
      count: result.files.length,
      added: saved.added,
      refused: result.refused,
      zip: !file.name.toLowerCase().endsWith('.png'),
    });
    setParts(saved.entries);
    setLibraryNote(
      (result.refused ? partText.importedRefused! : partText.imported!)
        .replace('{count}', String(result.files.length))
        .replace('{refused}', String(result.refused)),
    );
  };

  const partActions = (slot: PartSlot) => {
    const worn = wornPart(recipe, slot);
    const wornId = worn && customPartId(worn);
    const hair = isHairPartSlot(slot) || isReplacePartSlot(slot);
    const own = parts.filter((entry) => entry.part.slot === slot);
    const head = slot === 'headpiece' ? builtInHeadpiece(recipe) : undefined;
    const draw = () =>
      begin(
        head && !worn
          ? {
              slot,
              base: recipe,
              restore: recipe,
              backdrop: withCustomPart(recipe, slot, undefined),
              initial: headpieceStart(recipe),
              note: partText.flattenPartNote,
            }
          : hair
            ? {
                slot,
                base: withCustomPart(recipe, slot, undefined),
                restore: recipe,
                backdrop: withCustomPart(recipe, slot, { slot, front: [], back: [] }),
                initial: isHairPartSlot(slot)
                  ? hairPieceStart(recipe, slot)
                  : replacePartStart(recipe, slot as ReplacePartSlot),
                ...(wornId
                  ? { parent: wornId }
                  : {
                      note: isHairPartSlot(slot) ? partText.flattenNote : partText.flattenPartNote,
                    }),
              }
            : { slot, base: recipe, restore: recipe },
        hair || head ? 'piece' : 'new',
      );
    const action = (label: string | undefined, onClick: () => void) => (
      <button type="button" className="face-color-reset" onClick={onClick}>
        {label}
      </button>
    );
    return (
      <>
        <div className="part-library-actions">
          {action(hair ? partText.drawPiece : partText.draw, draw)}
          {worn && !hair
            ? action(partText.edit, () =>
                begin(
                  { slot, base: recipe, restore: recipe, initial: worn, parent: wornId },
                  'edit',
                ),
              )
            : null}
          {worn && hair
            ? action(partText.removePiece, () => onChange(withCustomPart(recipe, slot, undefined)))
            : null}
          {worn ? action(partText.exportPart, () => void exportParts(worn)) : null}
          {wornId && own.some((entry) => entry.id === wornId)
            ? action(partText.remove, () => {
                track('avatar_part_deleted', { slot });
                setParts(removePart(parts, wornId));
              })
            : null}
        </div>
        <div className="part-library-actions">
          {action(partText.import, () => picker.current?.click())}
          <input
            ref={picker}
            type="file"
            accept=".png,.zip,image/png,application/zip"
            hidden
            onChange={(event) => {
              const input = event.currentTarget;
              void importFiles(input.files?.[0]).finally(() => {
                input.value = '';
              });
            }}
          />
          {parts.length > 0 ? action(partText.exportLibrary, () => void exportParts()) : null}
          {libraryNote ? (
            <span className="face-hidden-note" role="status">
              {libraryNote}
            </span>
          ) : null}
        </div>
        {hair ? null : (
          <Tile
            recipe={withCustomPart(recipe, slot, undefined)}
            selected={!worn && head === undefined}
            label={labels.parts.none!}
            onSelect={() => onChange(withCustomPart(recipe, slot, undefined))}
          />
        )}
        {own.map((entry) => (
          <Tile
            key={entry.id}
            recipe={withCustomPart(recipe, slot, entry.part)}
            selected={wornId === entry.id}
            label={entry.name || partText.untitled!}
            onSelect={() => {
              track('avatar_part_worn', { slot });
              onChange(withCustomPart(recipe, slot, entry.part));
            }}
          />
        ))}
        {!hair && own.length === 0 ? (
          <p className="face-hidden-note">{partText.libraryEmpty}</p>
        ) : null}
      </>
    );
  };

  const skin = AVATAR_SPECIES_SWATCHES[recipe.species ?? 'human'];
  const colorsPanel = (
    <div className="face-colors">
      {COLORS.filter((key) => colorShown(recipe, fields, key)).map((key) => (
        <div key={key} className="face-color-row">
          <span>{labels.parts[key]}</span>
          <div className="face-swatches">
            {(key === 'skinColor'
              ? skin
              : (AVATAR_SWATCHES[key as keyof typeof AVATAR_SWATCHES] ?? AVATAR_SWATCHES.hairColor)
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
  const shapePanel = (
    <div className="face-ranges">
      {Object.entries(AVATAR_RANGES)
        // a slider shows only where it moves something (hair length needs longer hair, say)
        .filter(
          ([key, [min, max]]) =>
            Number(fields[key] ?? 0) !== 0 ||
            pixelTileSvg(withPart(recipe, key, min)) !== pixelTileSvg(withPart(recipe, key, max)),
        )
        .map(([key, [min, max]]) => (
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

  let panel;
  if (drawing && drawing.slot === pieceSlot) {
    panel = (
      <div className="face-drawing">
        {note}
        {partEditor()}
        <p className="face-hidden-note">{partText.stored}</p>
      </div>
    );
  } else if (category === 'presets') {
    panel = (
      <div className="face-options">
        {PRESETS.map((preset, i) => (
          <Tile
            key={i}
            recipe={preset}
            selected={JSON.stringify(preset) === JSON.stringify(recipe)}
            label={`${labels.parts.presets} ${i + 1}`}
            onSelect={() => {
              track('avatar_preset_selected', { index: i, species: preset.species ?? 'human' });
              onChange(preset);
            }}
          />
        ))}
      </div>
    );
  } else if (category === 'headpiece') {
    const worn = builtInHeadpiece(recipe);
    // an animal has its own ears, so ear headpieces draw nothing on it: offer only ones that show
    const bare = pixelTileSvg(withBuiltInHeadpiece(recipe, undefined));
    const shown = AVATAR_HEADPIECES.filter(
      (value) => value === worn || pixelTileSvg(withBuiltInHeadpiece(recipe, value)) !== bare,
    );
    panel = (
      <div className="face-options">
        {note}
        {partActions('headpiece')}
        {shown.map((value) => (
          <Tile
            key={value}
            recipe={withBuiltInHeadpiece(recipe, value)}
            selected={worn === value}
            label={option('headpiece', value)}
            onSelect={() => {
              track('avatar_headpiece_selected', { headpiece: value });
              onChange(withBuiltInHeadpiece(recipe, value));
            }}
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
        {pieceSlot ? partActions(pieceSlot) : null}
        {values.map((value) => (
          <Tile
            key={value}
            recipe={builtIn(category, value)}
            selected={(fields[category] ?? 'none') === value && !pieceWorn}
            label={option(category, value)}
            onSelect={() => {
              if (category === 'species') track('avatar_species_selected', { species: value });
              onChange(builtIn(category, value));
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="studio-parts frame" aria-labelledby="face-editor-title">
        <div className="face-editor-head">
          <h2 id="face-editor-title">{t.parts}</h2>
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
              onClick={() => {
                if (key !== category)
                  track('avatar_tab_selected', { tab: key, species: recipe.species ?? 'human' });
                setCategory(key);
              }}
            >
              {labels.parts[key] ?? key}
            </button>
          ))}
        </div>
        {panel}
      </section>
      <aside className="studio-side frame" aria-labelledby="face-colors-title">
        <h2 id="face-colors-title">{labels.parts.colors}</h2>
        {colorsPanel}
        <h2>{labels.parts.shape}</h2>
        {shapePanel}
      </aside>
    </>
  );
}
