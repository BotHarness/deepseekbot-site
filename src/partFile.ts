import {
  DEFAULT_RECIPE,
  PART_SLOTS,
  canonicalCustomPart,
  customPartId,
  isPixelCustomPart,
  partToneColor,
  type PixelCustomPart,
} from '@botharness/pixel-avatar';

// The part file format of BotHarness (packages/core/src/bots/part-file.ts), in the browser: a
// PNG that previews the part at 8× in the default colors and carries the part in a
// `botharness-part` tEXt chunk, so the file opens anywhere and imports back losslessly into the
// site or DeepSeekBot. A whole library is a zip of those PNGs.

export const PART_FILE_KEYWORD = 'botharness-part';
export const MAX_PART_FILE_BYTES = 256 * 1024;
export const MAX_PART_LIBRARY_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_PART_LIBRARY_FILES = 500;
const MAX_PART_NAME = 60;
const SCALE = 8;
const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export interface PartFile {
  part: PixelCustomPart;
  name: string;
  author?: string;
}

export type PartFileError = 'not-png' | 'no-part-data' | 'invalid-part' | 'too-large';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

const concat = (parts: readonly Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
};
const latin1 = (text: string) => Uint8Array.from(text, (char) => char.charCodeAt(0));
const utf8 = new TextEncoder();

async function transform(data: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const output = new Blob([data as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(output).arrayBuffer());
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const body = concat([latin1(type), data]);
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out.set(body, 4);
  view.setUint32(8 + data.length, crc32(body));
  return out;
}

async function preview(part: PixelCustomPart): Promise<Uint8Array> {
  const { width, height } = PART_SLOTS[part.slot];
  const w = width * SCALE;
  const h = height * SCALE;
  const row = w * 4 + 1;
  const pixels = new Uint8Array(row * h);
  const paint = (cells: PixelCustomPart['front']) => {
    for (const [x, y, color, tone] of cells) {
      const base = color.startsWith('#') ? color : DEFAULT_RECIPE[color as 'hairColor'];
      const hex = partToneColor(base, tone);
      const rgb = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
      for (let dy = 0; dy < SCALE; dy++)
        for (let dx = 0; dx < SCALE; dx++) {
          const offset = (y * SCALE + dy) * row + 1 + (x * SCALE + dx) * 4;
          pixels.set([rgb[0]!, rgb[1]!, rgb[2]!, 255], offset);
        }
    }
  };
  paint(part.back);
  paint(part.front);
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, w);
  view.setUint32(4, h);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  // CompressionStream's "deflate" is the zlib stream PNG expects
  const idat = await transform(pixels, new CompressionStream('deflate'));
  return concat([chunk('IHDR', header), chunk('IDAT', idat)]);
}

export async function encodePartFile(file: PartFile): Promise<Uint8Array> {
  const part = canonicalCustomPart(file.part);
  const data = JSON.stringify({
    format: 1,
    part,
    name: file.name,
    ...(file.author ? { author: file.author } : {}),
  });
  return concat([
    Uint8Array.from(SIGNATURE),
    await preview(part),
    chunk('tEXt', concat([latin1(`${PART_FILE_KEYWORD}\0`), utf8.encode(data)])),
    chunk('IEND', new Uint8Array(0)),
  ]);
}

const isPng = (bytes: Uint8Array) =>
  bytes.length >= 8 && SIGNATURE.every((byte, i) => bytes[i] === byte);

export function decodePartFile(bytes: Uint8Array): PartFile | PartFileError {
  if (bytes.length > MAX_PART_FILE_BYTES) return 'too-large';
  if (!isPng(bytes)) return 'not-png';
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  let text: string | undefined;
  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return 'not-png';
    const body = bytes.subarray(offset + 4, offset + 8 + length);
    if (crc32(body) !== view.getUint32(offset + 8 + length)) return 'not-png';
    const type = String.fromCharCode(...body.subarray(0, 4));
    if (type === 'tEXt') {
      const data = body.subarray(4);
      const zero = data.indexOf(0);
      if (zero > 0 && String.fromCharCode(...data.subarray(0, zero)) === PART_FILE_KEYWORD)
        text = new TextDecoder().decode(data.subarray(zero + 1));
    }
    if (type === 'IEND') break;
    offset = end;
  }
  if (text === undefined) return 'no-part-data';
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return 'invalid-part';
  }
  if (typeof parsed !== 'object' || parsed === null) return 'invalid-part';
  const record = parsed as Record<string, unknown>;
  const { name, author } = record;
  if (
    record.format !== 1 ||
    !isPixelCustomPart(record.part) ||
    typeof name !== 'string' ||
    name.length > MAX_PART_NAME ||
    (author !== undefined && (typeof author !== 'string' || author.length > MAX_PART_NAME))
  )
    return 'invalid-part';
  return {
    part: canonicalCustomPart(record.part),
    name,
    ...(typeof author === 'string' && author ? { author } : {}),
  };
}

export function partFileName(file: PartFile): string {
  const stem = Array.from(
    file.name
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/gu, ''),
  )
    .slice(0, 40)
    .join('');
  return `${stem || 'part'}-${customPartId(file.part).slice(0, 8)}.png`;
}

/** A zip of part PNGs. They are compressed already, so entries are stored. */
export async function encodePartLibrary(files: readonly PartFile[]): Promise<Uint8Array> {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const data = await encodePartFile(file);
    const name = utf8.encode(partFileName(file));
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length);
    const l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true);
    l.setUint16(4, 20, true);
    l.setUint16(6, 0x0800, true); // UTF-8 names
    l.setUint32(14, crc, true);
    l.setUint32(18, data.length, true);
    l.setUint32(22, data.length, true);
    l.setUint16(26, name.length, true);
    local.set(name, 30);
    const central = new Uint8Array(46 + name.length);
    const c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true);
    c.setUint32(24, data.length, true);
    c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.set(name, 46);
    locals.push(local, data);
    centrals.push(central);
    offset += local.length + data.length;
  }
  const directory = concat(centrals);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, directory.length, true);
  e.setUint32(16, offset, true);
  return concat([...locals, directory, end]);
}

/** The PNG entries of a zip, stored or deflated, as BotHarness writes them. */
async function zipEntries(bytes: Uint8Array): Promise<{ path: string; data: Uint8Array }[]> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 0xffff); i--)
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  if (eocd < 0) throw new Error('not a zip');
  const count = view.getUint16(eocd + 10, true);
  if (count > MAX_PART_LIBRARY_FILES) throw new Error('too many entries');
  let cursor = view.getUint32(eocd + 16, true);
  const entries: { path: string; data: Uint8Array }[] = [];
  for (let n = 0; n < count; n++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error('bad directory');
    const method = view.getUint16(cursor + 10, true);
    const compressed = view.getUint32(cursor + 20, true);
    const size = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extra = view.getUint16(cursor + 30, true);
    const comment = view.getUint16(cursor + 32, true);
    const local = view.getUint32(cursor + 42, true);
    const path = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
    cursor += 46 + nameLength + extra + comment;
    if (!path.toLowerCase().endsWith('.png') || size > MAX_PART_FILE_BYTES) continue;
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const body = bytes.subarray(start, start + compressed);
    if (method === 0) entries.push({ path, data: body });
    else if (method === 8)
      entries.push({ path, data: await transform(body, new DecompressionStream('deflate-raw')) });
  }
  return entries;
}

/** One part PNG or a zip of them; files that aren't parts are refused, not fatal. */
export async function decodePartFiles(
  bytes: Uint8Array,
): Promise<{ files: PartFile[]; refused: number } | PartFileError> {
  if (bytes.length > MAX_PART_LIBRARY_FILE_BYTES) return 'too-large';
  if (isPng(bytes)) {
    const file = decodePartFile(bytes);
    return typeof file === 'string' ? file : { files: [file], refused: 0 };
  }
  let entries;
  try {
    entries = await zipEntries(bytes);
  } catch {
    return 'not-png';
  }
  const files: PartFile[] = [];
  let refused = 0;
  for (const entry of entries) {
    const file = decodePartFile(entry.data);
    if (typeof file === 'string') refused++;
    else files.push(file);
  }
  return { files, refused };
}
