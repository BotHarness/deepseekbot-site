import { useEffect, useMemo, useRef } from 'react';
import { track } from '../analytics';
import type { Lang } from '../content';
import { SPONSORS, SPONSORS_COPY, sponsorCardsMarkup, sponsorFooterMarkup } from '../sponsors';

/** Homepage section between Community and the FAQ. */
export function Sponsors({ lang }: { lang: Lang }) {
  const t = SPONSORS_COPY[lang];
  const cards = useMemo(() => sponsorCardsMarkup(lang), [lang]);
  const section = useRef<HTMLElement>(null);
  // one impression per page load once half the section is on screen, so sponsors get views next to clicks
  useEffect(() => {
    const node = section.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        track('sponsor:section_view', { sponsors: SPONSORS.map((s) => s.id) });
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  if (!SPONSORS.length) return null;
  return (
    <section
      ref={section}
      className="section sponsors-section"
      id="sponsors"
      aria-labelledby="sponsors-title"
    >
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
