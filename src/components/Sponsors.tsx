import { useMemo } from 'react';
import type { Lang } from '../content';
import { SPONSORS, SPONSORS_COPY, sponsorCardsMarkup, sponsorFooterMarkup } from '../sponsors';

/** Homepage section between Community and the FAQ. */
export function Sponsors({ lang }: { lang: Lang }) {
  const t = SPONSORS_COPY[lang];
  const cards = useMemo(() => sponsorCardsMarkup(lang), [lang]);
  if (!SPONSORS.length) return null;
  return (
    <section className="section sponsors-section" id="sponsors" aria-labelledby="sponsors-title">
      <p className="kicker">{t.kicker}</p>
      <h2 id="sponsors-title">{t.title}</h2>
      <p className="section-lead">{t.lead}</p>
      <ul className="sponsor-list" dangerouslySetInnerHTML={{ __html: cards }} />
    </section>
  );
}

/** The sponsor line shared by every page footer. */
export function SponsorFooter({ lang }: { lang: Lang }) {
  const markup = useMemo(() => sponsorFooterMarkup(lang), [lang]);
  if (!markup) return null;
  return <div className="sponsor-footer-wrap" dangerouslySetInnerHTML={{ __html: markup }} />;
}
