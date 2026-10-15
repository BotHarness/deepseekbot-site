import { Button } from '@astryxdesign/core/Button';
import { useEffect, useState } from 'react';
import { track } from '../analytics';
import { copyText } from '../clipboard';
import { LINKS, QQ_GROUP, type Copy } from '../content';
import { CommunityIcon } from './CommunityIcon';
import { subscribeGitHubStars } from '../githubStars';

/** The Hero's calls to action: install on its own row, then GitHub, Discord and the QQ group. */
export function HeroLinks({ copy }: { copy: Copy }) {
  const [qq, setQq] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => subscribeGitHubStars(setStars), []);
  const t = copy.community;
  return (
    <div className="hero-actions" data-placement="hero">
      <Button
        className="hero-install"
        label={copy.hero.ctaInstall}
        variant="primary"
        size="lg"
        href="#install"
      />
      <div className="hero-community">
        <Button
          label={
            stars === null
              ? copy.hero.ctaGithub
              : `${copy.hero.ctaGithub} · ★ ${stars.toLocaleString(copy.htmlLang)}`
          }
          icon={<CommunityIcon brand="github" />}
          href={LINKS.github}
          target="_blank"
          rel="noreferrer"
        />
        <Button
          label={t.discord.cta}
          icon={<CommunityIcon brand="discord" />}
          href={LINKS.discord}
          target="_blank"
          rel="noreferrer"
        />
        <Button
          label={qq === 'copied' ? copy.hero.qqCopied : t.qq.title}
          icon={<CommunityIcon brand="qq" />}
          tooltip={`${t.qq.cta} ${QQ_GROUP}`}
          clickAction={async () => {
            const success = await copyText(QQ_GROUP);
            setQq(success ? 'copied' : 'failed');
            if (success) track('qq_group_copied', { placement: 'hero' });
          }}
        />
      </div>
      <p className="hero-community-status" role="status">
        {qq === 'failed' ? copy.hero.qqFailed : ''}
      </p>
    </div>
  );
}
