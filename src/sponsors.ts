/**
 * Sponsors shown on the homepage and in every page footer. Trusted local strings only: the
 * same markup feeds React (homepage, marketplace, avatar studio) and the generated guide,
 * changelog, blog and plugin pages.
 */
type Lang = 'zh' | 'en';

export interface Sponsor {
  id: string;
  /** Full legal name for the homepage card, short name for the footer line. */
  name: Record<Lang, { full: string; short: string }>;
  /** White-on-transparent logo; CSS paints it with the theme colour through mask-image. */
  logo: { src: string; width: number; height: number; alt: string };
  /** The sponsor's own X account: display name, handle without @, and the person's role. */
  x: { name: string; handle: string; role: Record<Lang, string> };
}

export const SPONSORS: readonly Sponsor[] = [
  {
    id: 'wellmei',
    name: {
      zh: { full: '浙江杭州维美控股集团', short: '维美控股集团' },
      en: { full: 'Wellmei Holding Group', short: 'Wellmei' },
    },
    logo: { src: '/sponsors/wellmei-mask.png', width: 373, height: 144, alt: 'WELLMEI' },
    x: { name: 'eric_0721', handle: 'XXXX540515', role: { zh: '创始人', en: 'Founder' } },
  },
];

export const SPONSORS_COPY = {
  zh: {
    kicker: '赞助商',
    title: '感谢赞助商',
    lead: '赞助支持 Tobs 的开源开发，不影响产品路线。',
    tier: '月度赞助商',
    footer: '赞助商',
    xLabel: (s: Sponsor) => `${s.x.name}（@${s.x.handle}）的 X 主页，将在新标签页打开`,
  },
  en: {
    kicker: 'Sponsors',
    title: 'Thanks to our sponsors',
    lead: 'Sponsorship supports open-source work on Tobs. It does not steer the roadmap.',
    tier: 'Monthly sponsor',
    footer: 'Sponsored by',
    xLabel: (s: Sponsor) => `${s.x.name} (@${s.x.handle}) on X. Opens in a new tab.`,
  },
} as const;

const X_ICON =
  '<svg class="sponsor-x-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

const escape = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function logoMarkup(s: Sponsor) {
  const { src, width, height, alt } = s.logo;
  return `<span class="sponsor-logo" role="img" aria-label="${escape(alt)}" style="--logo:url('${src}');aspect-ratio:${width} / ${height}"></span>`;
}

function xMarkup(lang: Lang, s: Sponsor) {
  return `<a class="sponsor-x" href="https://x.com/${escape(s.x.handle)}" target="_blank" rel="noreferrer" aria-label="${escape(SPONSORS_COPY[lang].xLabel(s))}">${X_ICON}<span class="sponsor-x-name">${escape(s.x.name)}</span><span class="sponsor-x-handle">@${escape(s.x.handle)}</span></a>`;
}

/** Homepage cards: logo, full name, tier tag, the person's X account and role. */
export function sponsorCardsMarkup(lang: Lang): string {
  const t = SPONSORS_COPY[lang];
  return SPONSORS.map(
    (s) =>
      `<li class="sponsor-card frame">${logoMarkup(s)}<div class="sponsor-meta"><p class="sponsor-name"><span>${escape(s.name[lang].full)}</span><span class="sponsor-tier">${t.tier}</span></p><p class="sponsor-person">${xMarkup(lang, s)}<span>${escape(s.x.role[lang])}</span></p></div></li>`,
  ).join('');
}

/** One line above every page footer, in the footer's own muted colour. */
export function sponsorFooterMarkup(lang: Lang): string {
  if (!SPONSORS.length) return '';
  const items = SPONSORS.map(
    (s) =>
      `<span class="sponsor-footer-item">${logoMarkup(s)}<span>${escape(s.name[lang].short)}</span><span aria-hidden="true">·</span>${xMarkup(lang, s)}</span>`,
  ).join('');
  return `<p class="sponsor-footer"><span>${SPONSORS_COPY[lang].footer}</span>${items}</p>`;
}
