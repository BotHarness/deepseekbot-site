import { useEffect, useState } from 'react';
import type { Copy, Lang } from '../content';
import { getSection, type MarketplaceEntry } from '../marketApi';
import { marketHref } from '../marketRoutes';
import { PREVIEW_COPY } from '../previewCopy';
import { BotFace, botBio, botName } from './MarketBot';

const MAX_BOTS = 6;

type MarketState = { status: 'loading' | 'error' } | { status: 'ready'; bots: MarketplaceEntry[] };

export function HeroMarketplace({ lang, copy }: { lang: Lang; copy: Copy }) {
  const t = copy.market;
  const [state, setState] = useState<MarketState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getSection('hot', lang).then(
      ({ entries }) => {
        if (active) {
          setState({ status: 'ready', bots: entries.slice(0, MAX_BOTS).map(({ bot }) => bot) });
        }
      },
      () => {
        if (active) setState({ status: 'error' });
      },
    );
    return () => {
      active = false;
    };
  }, [lang, attempt]);

  return (
    <div className="app-side-content">
      {state.status === 'ready' && state.bots.length ? (
        <ul className="app-market-list">
          {state.bots.map((bot) => {
            const name = botName(bot);
            const bio = botBio(bot);
            return (
              <li key={bot.id}>
                <a
                  className="app-market-row"
                  href={marketHref(lang, { kind: 'bot', id: bot.id })}
                  aria-label={t.open.replace('{name}', () => name)}
                >
                  <BotFace avatar={bot.avatar} seed={bot.fullName} size={30} />
                  <span className="app-market-copy">
                    <strong>{name}</strong>
                    {bio ? <small>{bio}</small> : null}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="app-activity-empty" role="status">
          {state.status === 'loading'
            ? t.loading
            : state.status === 'error'
              ? t.unavailable
              : t.discover.sectionEmpty}
        </p>
      )}
      {state.status === 'error' ? (
        <button
          type="button"
          className="app-btn app-market-retry"
          onClick={() => {
            setState({ status: 'loading' });
            setAttempt((value) => value + 1);
          }}
        >
          {t.retry}
        </button>
      ) : null}
      <a className="app-side-link" href={marketHref(lang, { kind: 'home' })}>
        {PREVIEW_COPY[lang].openMarketplace} →
      </a>
    </div>
  );
}
