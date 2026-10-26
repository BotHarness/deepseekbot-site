import { Tooltip } from '@astryxdesign/core/Tooltip';
import { useEffect, useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import { setupPrompt } from '../setupPrompt';
import { MobileBeta } from './MobileBeta';
import { HeaderCommunity } from './HeaderCommunity';

export function HeroLinks({ lang }: { lang: Lang }) {
  const t = HERO_COPY[lang];
  const prompt = setupPrompt(lang);
  const [notice, setNotice] = useState<{ kind: 'copied' | 'failed' } | null>(null);
  const [copying, setCopying] = useState(false);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), notice.kind === 'copied' ? 2500 : 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const feedback = notice?.kind === 'copied' ? t.copied : notice?.kind === 'failed' ? t.failed : '';
  return (
    <div className="hero-actions" data-placement="hero">
      <div className="hero-primary-actions">
        <Tooltip
          content={<span className="setup-copy-feedback">{feedback}</span>}
          isOpen={notice !== null}
          onOpenChange={(open) => {
            if (!open) setNotice(null);
          }}
          placement="above"
        >
          <button
            type="button"
            className="setup-button"
            disabled={copying}
            aria-busy={copying}
            onClick={async () => {
              setCopying(true);
              const success = await copyText(prompt);
              setCopying(false);
              setNotice({ kind: success ? 'copied' : 'failed' });
              if (success) track('setup_prompt_copied', { placement: 'hero' });
            }}
          >
            <span aria-hidden="true">✦</span> {t.setup}
          </button>
        </Tooltip>
        <span className="setup-copy-announcement" role="status">
          {feedback}
        </span>
      </div>
      <MobileBeta lang={lang} placement="hero" />
      <a className="hero-manual" href="#install">
        {t.manual}
      </a>
      <HeaderCommunity lang={lang} placement="hero" />
    </div>
  );
}
