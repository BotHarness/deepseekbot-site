import {
  canonicalCustomPart,
  customPartId,
  isPixelCustomPart,
  type PixelCustomPart,
} from '@botharness/pixel-avatar';
import { read } from './site';

/**
 * The site's Part Library: parts drawn in the Playground, kept in this browser's localStorage.
 * Like the app's library, a part's identity is its content (`customPartId`), so saving the same
 * drawing twice keeps one entry, and editing a part saves a new one with the old as its parent.
 */
export interface PartEntry {
  id: string;
  name: string;
  part: PixelCustomPart;
  parent?: string;
  /** who drew it, kept from an imported part file so exporting it again credits them */
  author?: string;
  savedAt: number;
}

const KEY = 'dsb-part-library';
const MAX_ENTRIES = 200;

function isEntry(value: unknown): value is PartEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === 'string' &&
    typeof entry.savedAt === 'number' &&
    (entry.parent === undefined || typeof entry.parent === 'string') &&
    (entry.author === undefined || typeof entry.author === 'string') &&
    isPixelCustomPart(entry.part)
  );
}

/** Saved parts, newest first. Unreadable entries are dropped and ids recomputed from content. */
export function loadParts(): PartEntry[] {
  let saved: unknown;
  try {
    saved = JSON.parse(read(KEY) ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(saved)) return [];
  const seen = new Set<string>();
  const entries: PartEntry[] = [];
  for (const value of saved) {
    if (!isEntry(value)) continue;
    const part = canonicalCustomPart(value.part);
    const id = customPartId(part);
    if (seen.has(id)) continue;
    seen.add(id);
    entries.push({ ...value, id, part });
  }
  return entries;
}

function store(entries: readonly PartEntry[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    return true;
  } catch {
    return false;
  }
}

/** Saves a part (or moves an identical one to the top). Returns the new list, or `undefined` if storage refused. */
export function addPart(
  entries: readonly PartEntry[],
  drawn: PixelCustomPart,
  name: string,
  parent?: string,
): { entries: PartEntry[]; entry: PartEntry } | undefined {
  const part = canonicalCustomPart(drawn);
  const id = customPartId(part);
  const entry: PartEntry = {
    id,
    name: name.slice(0, 60),
    part,
    ...(parent && parent !== id ? { parent } : {}),
    savedAt: Date.now(),
  };
  const next = [entry, ...entries.filter((item) => item.id !== id)];
  return store(next) ? { entries: next, entry } : undefined;
}

/** Adds imported parts, newest first; a part already saved keeps its entry. */
export function addParts(
  entries: readonly PartEntry[],
  files: readonly { part: PixelCustomPart; name: string; author?: string }[],
): { entries: PartEntry[]; added: number } | undefined {
  const known = new Set(entries.map((entry) => entry.id));
  const now = Date.now();
  const added: PartEntry[] = [];
  for (const file of files) {
    const part = canonicalCustomPart(file.part);
    const id = customPartId(part);
    if (known.has(id)) continue;
    known.add(id);
    added.push({
      id,
      name: file.name.slice(0, 60),
      part,
      ...(file.author ? { author: file.author } : {}),
      savedAt: now,
    });
  }
  const next = [...added, ...entries];
  return store(next) ? { entries: next, added: added.length } : undefined;
}

export function removePart(entries: readonly PartEntry[], id: string): PartEntry[] {
  const next = entries.filter((item) => item.id !== id);
  store(next);
  return next;
}
