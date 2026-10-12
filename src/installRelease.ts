import identity from '../content/install-release.json' with { type: 'json' };

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(identity.version)) {
  throw new Error('Install identity must be a published stable version');
}

export const VERSION = identity.version;
export const DESKTOP_PACKAGE = `deepseekbot@${VERSION}`;
