// Copies the Tobs core colour tokens from a BotHarness checkout into src/tobs-core.css. The
// generated file in BotHarness (design/tokens/tobs-core.generated.css, built from the Tobs
// resolver) is the only source; brand, accent and status colours on this site read it.
//   BOTHARNESS=../BotHarness pnpm tokens:sync
import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.env.BOTHARNESS;
if (!ROOT) throw new Error('Set BOTHARNESS to a BotHarness checkout');

copyFileSync(join(ROOT, 'design/tokens/tobs-core.generated.css'), 'src/tobs-core.css');
console.log('Synced Tobs core colours into src/tobs-core.css');
