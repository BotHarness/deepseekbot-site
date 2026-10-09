// Anonymous product analytics through our own PostHog proxy (BotHarness ADR-0132). Visitors who
// accept get a persistent anonymous ID so a campaign visit that converts days later still counts;
// visitors who decline, or never answer, are counted without anything stored on their device.
import type { PostHog } from 'posthog-js';
import { pathLang } from './site';
import { analyticsConsent, CONSENT_COPY } from './analyticsConsent';

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://t.botharness.ai';

/**
 * Product Hunt and other directories link with `?ref=<name>`, which PostHog does not read. Move it
 * into `utm_source` before PostHog starts so it lands in the same first-touch properties as
 * campaign links.
 */
export function normalizeRef(url: URL): URL | null {
  const ref = url.searchParams.get('ref');
  if (!ref) return null;
  const next = new URL(url);
  next.searchParams.delete('ref');
  if (!next.searchParams.has('utm_source')) next.searchParams.set('utm_source', ref);
  return next;
}

/** Which page family this is, so events can be split without parsing paths. */
export function pageKind(pathname: string) {
  const path = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (path === '/') return 'home';
  const first = path.split('/')[1] ?? '';
  return ['market', 'avatar', 'docs', 'privacy', 'changelog'].includes(first) ? first : 'other';
}

const siteProperties = () => ({
  source: 'site',
  lang: pathLang(),
  page: pageKind(location.pathname),
});

/**
 * Where on the page a click happened: an explicit `data-placement` (for controls that need telling
 * apart within one section), else header, footer, or the enclosing section's id.
 */
function placement(element: Element) {
  const named = element.closest<HTMLElement>('[data-placement]')?.dataset.placement;
  if (named) return named;
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  return element.closest('section[id]')?.id ?? 'main';
}

/**
 * Outbound GitHub, Discord and DeepSeek Harness download links, the language switch, the in-page
 * install buttons, and the header links to the marketplace, docs and changelog appear on every page, including the static docs, so they are tracked by one
 * delegated listener instead of in each component.
 */
export function linkEvent(anchor: HTMLAnchorElement): [string, Record<string, unknown>] | null {
  const at = placement(anchor);
  if (anchor.closest('.lang-switch')) {
    const to = anchor.hreflang.startsWith('zh') ? 'zh' : 'en';
    return to === pathLang() ? null : ['language_switched', { to, placement: at }];
  }
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return null;
  }
  if (url.origin === location.origin) {
    if (url.pathname === location.pathname && url.hash === '#install')
      return ['install_cta_clicked', { placement: at }];
    const kind = pageKind(url.pathname);
    // moving around within the marketplace or the docs is not a way in
    if (kind === pageKind(location.pathname)) return null;
    if (kind === 'market' || kind === 'avatar' || kind === 'docs' || kind === 'changelog')
      return [`${kind}_clicked`, { target: url.pathname, placement: at }];
    return null;
  }
  if (url.hostname === 'github.com')
    return ['github_clicked', { target: url.pathname, placement: at }];
  if (url.hostname === 'discord.gg' || url.hostname.endsWith('discord.com'))
    return ['discord_clicked', { placement: at }];
  if (url.hostname === 'www.deepseek.com' && url.pathname.includes('/harness'))
    return ['dsh_download_clicked', { placement: at }];
  return null;
}

function trackLinks() {
  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const hit = linkEvent(anchor);
      if (hit) track(...hit);
    },
    { capture: true },
  );
}

function consentBar(posthog: PostHog, register: () => void) {
  const status = posthog.get_explicit_consent_status();
  analyticsConsent.configure(
    status === 'pending' ? 'pending' : status === 'granted' ? 'accepted' : 'declined',
    (accept) => {
      if (!accept) {
        posthog.opt_out_capturing();
        return;
      }
      // Retain the existing opt-in identity and first-touch attribution behavior.
      posthog.opt_in_capturing({ captureProperties: siteProperties() });
      register();
      const utm = Object.fromEntries(
        [...new URLSearchParams(location.search)].filter(([key]) => key.startsWith('utm_')),
      );
      const initial = Object.fromEntries(Object.entries(utm).map(([k, v]) => [`$initial_${k}`, v]));
      posthog.capture('$pageview', utm, { $set_once: initial });
    },
  );
  // The React homepage asks through its Bot; generated pages retain their consent region.
  if (status !== 'pending' || pageKind(location.pathname) === 'home') return;
  const t = CONSENT_COPY[pathLang()];
  const bar = document.createElement('div');
  bar.className = 'consent-bar frame';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', t.more);
  const text = document.createElement('p');
  text.textContent = `${t.text} `;
  const link = document.createElement('a');
  link.href = t.privacy;
  link.textContent = t.more;
  text.append(link);
  const actions = document.createElement('div');
  actions.className = 'consent-actions';
  const button = (label: string, choose: () => void) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => {
      choose();
      bar.remove();
    });
    return b;
  };
  actions.append(
    button(t.reject, () => analyticsConsent.choose(false)),
    button(t.accept, () => analyticsConsent.choose(true)),
  );
  bar.append(text, actions);
  document.body.append(bar);
}

let client: PostHog | undefined;
const queued: [string, Record<string, unknown> | undefined][] = [];

export async function initAnalytics() {
  const normalized = normalizeRef(new URL(location.href));
  if (normalized) history.replaceState(history.state, '', normalized);
  // builds without a project key (local dev, forks) send nothing
  if (!KEY) return;
  analyticsConsent.loading();
  trackLinks();
  // loaded after the page so analytics never delays it
  let posthog: PostHog;
  try {
    posthog = (await import('posthog-js')).default;
  } catch {
    analyticsConsent.configure('unavailable');
    return;
  }
  posthog.init(KEY, {
    api_host: HOST,
    ui_host: 'https://us.posthog.com',
    cookieless_mode: 'on_reject',
    // until the visitor answers, count them the cookieless way
    opt_out_capturing_by_default: true,
    autocapture: false,
    capture_pageview: 'history_change',
    capture_pageleave: false,
    disable_session_recording: true,
    disable_surveys: true,
    advanced_disable_feature_flags: true,
    // a consenting visitor's first-touch UTM lives on their (anonymous) person
    person_profiles: 'always',
  });
  const register = () => posthog.register(siteProperties());
  register();
  client = posthog;
  for (const [event, properties] of queued.splice(0)) posthog.capture(event, properties);
  consentBar(posthog, register);
}

/** Named site events (ADR-0132); a no-op when PostHog is not configured. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!KEY) return;
  if (client) client.capture(event, properties);
  else queued.push([event, properties]);
}
