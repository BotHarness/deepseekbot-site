import { Popover } from '@astryxdesign/core/Popover';
import { ChevronDown, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import { LINKS, QQ_GROUP, type Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import { TESTFLIGHT_URL } from '../mobileBeta';
import { CommunityIcon } from './CommunityIcon';

export function MobileBeta({ lang, placement }: { lang: Lang; placement: 'hero' | 'install' }) {
  const t = HERO_COPY[lang];
  const [qq, setQq] = useState<'idle' | 'copied' | 'failed'>('idle');
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
      <Popover
        label={t.androidTitle}
        closeButtonLabel={t.close}
        placement="below"
        alignment="end"
        width={320}
        className="android-beta-popover"
        onOpenChange={(open) => {
          if (open) {
            setQq('idle');
            track('mobile_beta_menu_opened', { platform: 'android', placement });
          }
        }}
        content={
          <div className="android-beta-content" data-placement={`android_beta_${placement}`}>
            <h3>{t.androidTitle}</h3>
            <p>{t.androidBody}</p>
            <a className="beta-contact" href={LINKS.discord} target="_blank" rel="noreferrer">
              <CommunityIcon brand="discord" />
              {t.discord}
            </a>
            <button
              className="beta-contact"
              type="button"
              onClick={async () => {
                const success = await copyText(QQ_GROUP);
                setQq(success ? 'copied' : 'failed');
                if (success) track('qq_group_copied', { placement: `android_beta_${placement}` });
              }}
            >
              <CommunityIcon brand="qq" />
              {qq === 'copied' ? t.qqCopied : t.qq}
            </button>
            <p className="beta-group-number">{QQ_GROUP}</p>
            <small>{t.qqHint}</small>
            <p role="status">{qq === 'failed' ? t.qqFailed : qq === 'copied' ? t.qqCopied : ''}</p>
          </div>
        }
      >
        <button className="beta-button beta-button--android" type="button">
          {t.android}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </Popover>
    </div>
  );
}
