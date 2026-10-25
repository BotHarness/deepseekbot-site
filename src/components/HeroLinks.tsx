import { useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import { setupPrompt } from '../setupPrompt';
import { MobileBeta } from './MobileBeta';

export function HeroLinks({ lang }: { lang: Lang }) {
  const t = HERO_COPY[lang];
  const prompt = setupPrompt(lang);
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  return (
    <div className="hero-actions" data-placement="hero">
      <div className="hero-primary-actions">
        <button
          type="button"
          className="setup-button"
          onClick={async () => {
            const success = await copyText(prompt);
            setState(success ? 'copied' : 'failed');
            if (success) track('setup_prompt_copied', { placement: 'hero' });
          }}
        >
          <span aria-hidden="true">✦</span> {state === 'copied' ? t.copied : t.setup}
        </button>
        <a href="#install">{t.manual}</a>
      </div>
      <MobileBeta lang={lang} placement="hero" />
      {state === 'failed' ? (
        <p className="setup-hint" role="status">
          {t.failed}
        </p>
      ) : null}
    </div>
  );
}
