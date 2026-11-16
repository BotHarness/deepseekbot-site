import { Button } from '@astryxdesign/core/Button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import { LINKS, QQ_GROUP, type Lang } from '../content';
import {
  SPONSOR_EMAIL,
  SPONSORS,
  SPONSORS_COPY,
  sponsorCardsMarkup,
  sponsorFooterMarkup,
} from '../sponsors';

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
        // the first callback can report a sliver of the section, so check the ratio too
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5))
          return;
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
      <BecomeSponsor lang={lang} />
    </section>
  );
}

/**
 * How to reach us about sponsoring. Each contact sits in a `data-sponsor-contact` wrapper so the
 * shared link listener reports which channel a would-be sponsor chose.
 */
function BecomeSponsor({ lang }: { lang: Lang }) {
  const t = SPONSORS_COPY[lang].become;
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (copyState !== 'copied') return;
    const timer = setTimeout(() => setCopyState('idle'), 1600);
    return () => clearTimeout(timer);
  }, [copyState]);
  const mailto = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(t.emailSubject)}`;
  return (
    <div className="sponsor-become frame">
      <h3>{t.title}</h3>
      <p>{t.body}</p>
      <div className="sponsor-contacts">
        <span data-sponsor-contact="email">
          <Button label={t.email} variant="primary" href={mailto} />
        </span>
        <span data-sponsor-contact="discord">
          <Button label={t.discord} href={LINKS.discord} target="_blank" rel="noreferrer" />
        </span>
        <Button
          label={copyState === 'copied' ? t.copied : `${t.qq} ${QQ_GROUP}`}
          clickAction={async () => {
            setCopyState('idle');
            const success = await copyText(QQ_GROUP);
            setCopyState(success ? 'copied' : 'failed');
            if (success) track('sponsor:contact_click', { channel: 'qq' });
          }}
        />
      </div>
      <p className="sponsor-email">{SPONSOR_EMAIL}</p>
      <p className="community-copy-status" role="status">
        {copyState === 'failed' ? t.copyFailed(QQ_GROUP) : ''}
      </p>
    </div>
  );
}

/** The sponsor line shared by every page footer. */
export function SponsorFooter({ lang }: { lang: Lang }) {
  const markup = useMemo(() => sponsorFooterMarkup(lang), [lang]);
  if (!markup) return null;
  return <div className="sponsor-footer-wrap" dangerouslySetInnerHTML={{ __html: markup }} />;
}
