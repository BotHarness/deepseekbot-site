import { Button } from '@astryxdesign/core/Button';
import { useEffect, useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import { LINKS, QQ_GROUP, type Copy } from '../content';
import { CommunityIcon } from './CommunityIcon';

export function Community({ copy }: { copy: Copy }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (copyState !== 'copied') return;
    const timer = setTimeout(() => setCopyState('idle'), 1600);
    return () => clearTimeout(timer);
  }, [copyState]);
  const t = copy.community;
  return (
    <ul className="community-grid">
      <li className="community-card frame">
        <span className="feature-icon">
          <CommunityIcon brand="discord" />
        </span>
        <h3>{t.discord.title}</h3>
        <p>{t.discord.body}</p>
        <Button
          label={t.discord.cta}
          variant="primary"
          href={LINKS.discord}
          target="_blank"
          rel="noreferrer"
        />
      </li>
      <li className="community-card frame">
        <span className="feature-icon">
          <CommunityIcon brand="github" />
        </span>
        <h3>{t.github.title}</h3>
        <p>{t.github.body}</p>
        <Button label={t.github.cta} href={LINKS.github} target="_blank" rel="noreferrer" />
      </li>
      <li className="community-card frame">
        <span className="feature-icon">
          <CommunityIcon brand="qq" />
        </span>
        <h3>{t.qq.title}</h3>
        <p>
          {t.qq.body} <strong className="qq-number">{QQ_GROUP}</strong>
        </p>
        <div className="community-copy">
          <Button
            label={copyState === 'copied' ? copy.install.copied : t.qq.cta}
            clickAction={async () => {
              setCopyState('idle');
              const success = await copyText(QQ_GROUP);
              setCopyState(success ? 'copied' : 'failed');
              if (success) track('qq_group_copied');
            }}
          />
          <p className="community-copy-status" role="status">
            {copyState === 'failed' ? t.qq.copyFailed : ''}
          </p>
        </div>
      </li>
    </ul>
  );
}
