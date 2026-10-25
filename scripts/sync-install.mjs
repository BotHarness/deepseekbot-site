import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const upstream = process.env.BOTHARNESS;
if (!upstream) throw new Error('Set BOTHARNESS to a qualified product checkout');
const identity = JSON.parse(
  readFileSync(resolve(upstream, 'scripts/install-release.json'), 'utf8'),
);
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(identity.version)) {
  throw new Error('Install instructions require a published stable identity');
}
const packageName = identity.packageName ?? 'deepseekbot';
if (!['deepseekbot', '@botharness/tobs'].includes(packageName)) {
  throw new Error('Install instructions require a supported product package');
}
execFileSync(
  process.execPath,
  [resolve(upstream, 'scripts/sync-install-guidance.mjs'), '--check'],
  {
    stdio: 'inherit',
  },
);
execFileSync(process.execPath, ['scripts/sync-docs.mjs', '--only', 'installation'], {
  stdio: 'inherit',
});
mkdirSync('content', { recursive: true });
writeFileSync(
  'content/install-release.json',
  `${JSON.stringify({ version: identity.version, packageName }, null, 2)}\n`,
);
