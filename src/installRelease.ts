import identity from '../content/install-release.json' with { type: 'json' };

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(identity.version)) {
  throw new Error('Install identity must be a published stable version');
}

export const VERSION = identity.version;
export const DSH_VERSION = '0.2.1-rc.3';
const packageName = 'packageName' in identity ? identity.packageName : 'deepseekbot';
if (packageName !== 'deepseekbot' && packageName !== '@botharness/tobs') {
  throw new Error('Install identity must name a supported product package');
}
export const DESKTOP_PACKAGE = `${packageName}@${VERSION}`;
