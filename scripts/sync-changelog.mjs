// Copies the DeepSeekBot Release Ledger (CHANGELOG.md and CHANGELOG.zh.md) from a BotHarness
// checkout into content/changelog/{en,zh}.md. The ledger in BotHarness is the only source; the
// plugin ships the same files. Run after a release:
//   BOTHARNESS=../BotHarness pnpm changelog:sync
import { cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.env.BOTHARNESS;
if (!ROOT) throw new Error('Set BOTHARNESS to a BotHarness checkout');

mkdirSync('content/changelog', { recursive: true });
cpSync(join(ROOT, 'CHANGELOG.md'), 'content/changelog/en.md');
cpSync(join(ROOT, 'CHANGELOG.zh.md'), 'content/changelog/zh.md');
console.log('Synced the changelog into content/changelog');
