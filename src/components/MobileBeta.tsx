import { Smartphone } from 'lucide-react';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import { GOOGLE_PLAY_URL, TESTFLIGHT_URL } from '../mobileBeta';

export function MobileBeta({ lang, placement }: { lang: Lang; placement: 'hero' | 'install' }) {
  const t = HERO_COPY[lang];
  return (
    <div className="mobile-beta" data-placement={placement} role="group" aria-label={t.mobile}>
      <a
        className="beta-button beta-button--ios"
        href={TESTFLIGHT_URL}
        target="_blank"
        rel="noreferrer"
      >
        <Smartphone size={16} aria-hidden="true" />
        {t.ios}
      </a>
      <a
        className="beta-button beta-button--android"
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noreferrer"
      >
        <Smartphone size={16} aria-hidden="true" />
        {t.android}
      </a>
    </div>
  );
}
