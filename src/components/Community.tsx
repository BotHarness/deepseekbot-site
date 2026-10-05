import { Button } from '@astryxdesign/core/Button';
import { useState } from 'react';
import { LINKS, QQ_GROUP, type Copy } from '../content';
import { SymbolIcon } from './SymbolIcon';

export function Community({ copy }: { copy: Copy }) {
  const [copied, setCopied] = useState(false);
  const t = copy.community;
  return (
    <ul className="community-grid">
      <li className="community-card frame">
        <span className="feature-icon">
          <SymbolIcon symbol="subagent" color="#5865f2" size={40} />
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
          <SymbolIcon symbol="ask" color="#3d5afe" size={40} />
        </span>
        <h3>{t.qq.title}</h3>
        <p>
          {t.qq.body} <strong className="qq-number">{QQ_GROUP}</strong>
        </p>
        <Button
          label={copied ? copy.install.copied : copy.install.copy}
          clickAction={async () => {
            await navigator.clipboard.writeText(QQ_GROUP);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        />
      </li>
    </ul>
  );
}
