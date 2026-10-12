const CANONICAL_HOST = 'deepseekbot.app';
const REDIRECT_HOSTS: ReadonlySet<string> = new Set([
  'www.deepseekbot.app',
  'deepseekbot.dev',
  'www.deepseekbot.dev',
  'deepseekbot.botharness.ai',
]);

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** The HTTPS canonical URL for a noncanonical product request, or `undefined`. */
function canonicalRedirect(url: URL): string | undefined {
  if (
    !REDIRECT_HOSTS.has(url.hostname) &&
    !(url.hostname === CANONICAL_HOST && url.protocol === 'http:')
  )
    return undefined;
  const next = new URL(url);
  next.protocol = 'https:';
  next.hostname = CANONICAL_HOST;
  next.port = '';
  return next.toString();
}

function releaseRedirect(url: URL): string | undefined {
  const match =
    /^\/r\/v((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:alpha|beta|rc)\.(?:0|[1-9]\d*))?)(\/install(?:\/en)?)?\/?$/.exec(
      url.pathname,
    );
  if (!match) return undefined;
  const [, version, destination] = match;
  const page =
    destination === '/install/en'
      ? '/en/docs/installation/'
      : destination
        ? '/docs/installation/'
        : '/';
  const content =
    destination === '/install/en' ? 'install_en' : destination ? 'install_zh' : 'website';
  const next = new URL(page, `https://${CANONICAL_HOST}`);
  next.searchParams.set('utm_source', 'github');
  next.searchParams.set('utm_medium', 'release');
  next.searchParams.set('utm_campaign', `deepseekbot_v${version}`);
  next.searchParams.set('utm_content', content);
  return next.toString();
}

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    const canonical = canonicalRedirect(url);
    if (canonical) return Response.redirect(canonical, 301);
    const target = releaseRedirect(url);
    if (target) {
      if (!['GET', 'HEAD'].includes(request.method)) {
        return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
      }
      return new Response(null, {
        status: 302,
        headers: {
          Location: target,
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
