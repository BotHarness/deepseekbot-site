// The site is static assets; this Worker only sends the product's other hostnames to the
// canonical one, keeping the path and query, so old links and shared cards keep working.
// Everything else (the canonical host and Workers preview URLs) is served from the assets.

export const CANONICAL_HOST = 'deepseekbot.app';
export const REDIRECT_HOSTS: ReadonlySet<string> = new Set([
  'www.deepseekbot.app',
  'deepseekbot.dev',
  'www.deepseekbot.dev',
  'deepseekbot.botharness.ai',
]);

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** The canonical URL for a request on another product hostname, or `undefined`. */
export function canonicalRedirect(url: URL): string | undefined {
  if (!REDIRECT_HOSTS.has(url.hostname)) return undefined;
  const next = new URL(url);
  next.protocol = 'https:';
  next.hostname = CANONICAL_HOST;
  next.port = '';
  return next.toString();
}

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const target = canonicalRedirect(new URL(request.url));
    return target ? Response.redirect(target, 301) : env.ASSETS.fetch(request);
  },
};
