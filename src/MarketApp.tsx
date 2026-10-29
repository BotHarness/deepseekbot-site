import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useRef, useState } from 'react';
import { track } from './analytics';
import { MarketDetail, MarketList } from './components/Market';
import {
  DailyPicks,
  DigestPage,
  PastPicksPage,
  RankingRows,
  SectionPage,
} from './components/MarketDiscover';
import { SiteHeader } from './components/SiteHeader';
import { COPY } from './content';
import type { MarketplaceEntry } from './marketApi';
import { legacyMarketView, marketHref, parseMarketPath, type MarketView } from './marketRoutes';
import { initialMode, marketPath, pathLang, pluginsPath, write, type Mode } from './site';
import { pixelTheme } from './theme';

// Every view has its own path under /market (see marketRoutes.ts), which the Worker also
// pre-renders for search engines; the page swaps views in place and keeps history in step.
const viewHere = (): MarketView =>
  parseMarketPath(location.pathname)?.view ?? legacyMarketView(location.search) ?? { kind: 'home' };

// how many views deep this tab is, so going back restores where each one was scrolled to
const depthOf = (state: unknown) =>
  typeof state === 'object' && state !== null && 'depth' in state && typeof state.depth === 'number'
    ? state.depth
    : 0;

export function MarketApp() {
  const lang = pathLang();
  const copy = COPY[lang];
  const [mode, setMode] = useState<Mode>(initialMode);
  const [view, setView] = useState<MarketView>(viewHere);
  const preview = useRef<MarketplaceEntry | null>(null);
  const depth = useRef(depthOf(history.state));
  const scrolls = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, mode]);

  useEffect(() => {
    if (view.kind === 'home') document.title = copy.market.pageTitle;
  }, [view.kind, copy.market.pageTitle]);

  useEffect(() => {
    const onPop = () => {
      const next = depthOf(history.state);
      const back = next < depth.current;
      depth.current = next;
      setView(viewHere());
      const y = back ? (scrolls.current[next] ?? 0) : 0;
      requestAnimationFrame(() => scrollTo(0, y));
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  // an older ?bot= style link (the Worker redirects these; the dev server does not)
  useEffect(() => {
    if (location.search && parseMarketPath(location.pathname)?.view.kind === 'home') {
      const legacy = legacyMarketView(location.search);
      if (legacy) history.replaceState(history.state, '', marketHref(lang, legacy));
    }
  }, [lang]);

  const go = (next: MarketView) => {
    scrolls.current[depth.current] = scrollY;
    depth.current += 1;
    history.pushState({ depth: depth.current }, '', marketHref(lang, next));
    setView(next);
    scrollTo(0, 0);
  };
  const openBot = (bot: MarketplaceEntry) => {
    preview.current = bot;
    go({ kind: 'bot', id: bot.id });
  };
  const openDigest = (day: string, entry: 'hero' | 'archive') => {
    track('marketplace:digest_open', { entry });
    go({ kind: 'digest', day });
  };
  const openArchive = () => {
    track('marketplace:digest_archive_open');
    go({ kind: 'archive' });
  };
  const back = () => {
    // a view opened on this page pops history; one opened from a shared link goes home
    if (depth.current > 0) history.back();
    else go({ kind: 'home' });
  };

  const home = view.kind === 'home';

  return (
    <Theme theme={pixelTheme} mode={mode}>
      <SiteHeader
        copy={copy}
        lang={lang}
        mode={mode}
        page="market"
        onMode={(next) => {
          setMode(next);
          write('dsb-mode', next);
        }}
      />
      <main id="main" className="section market-page">
        {home ? (
          <>
            <p className="kicker">{copy.market.kicker}</p>
            <h1 className="market-title">{copy.market.title}</h1>
            <p className="section-lead">{copy.market.lead}</p>
            <nav className="market-shelves" aria-label={copy.market.shelvesLabel}>
              <a className="topic-chip" href={marketPath(lang)} aria-current="page">
                {copy.market.shelfBots}
              </a>
              <a className="topic-chip" href={pluginsPath(lang)}>
                {copy.market.shelfPlugins}
              </a>
            </nav>
          </>
        ) : null}
        {/* the list stays mounted under other views so its search, filters and pages survive */}
        <MarketList
          copy={copy}
          lang={lang}
          hidden={!home}
          onOpen={openBot}
          discover={
            <>
              <DailyPicks
                copy={copy}
                lang={lang}
                onDigest={(day) => openDigest(day, 'hero')}
                onArchive={openArchive}
              />
              <RankingRows
                copy={copy}
                lang={lang}
                onOpen={(bot, section) => {
                  track('marketplace:bot_open', { bot: bot.id, entry: section });
                  openBot(bot);
                }}
                onSeeAll={(section) => go({ kind: 'section', section })}
              />
            </>
          }
        />
        {view.kind === 'bot' ? (
          <MarketDetail
            key={view.id}
            copy={copy}
            lang={lang}
            id={view.id}
            preview={preview.current?.id === view.id ? preview.current : null}
            onBack={back}
          />
        ) : view.kind === 'digest' ? (
          <DigestPage
            key={view.day}
            copy={copy}
            lang={lang}
            day={view.day}
            onBack={back}
            onOpen={openBot}
            onArchive={openArchive}
          />
        ) : view.kind === 'archive' ? (
          <PastPicksPage
            copy={copy}
            lang={lang}
            onBack={back}
            onDigest={(day) => openDigest(day, 'archive')}
          />
        ) : view.kind === 'section' ? (
          <SectionPage
            key={view.section}
            copy={copy}
            lang={lang}
            section={view.section}
            onBack={back}
            onOpen={openBot}
          />
        ) : null}
      </main>
      <footer className="footer market-footer">
        <p>
          {copy.footer.built}{' '}
          <a href={lang === 'zh' ? '/privacy/' : '/en/privacy/'}>{copy.footer.privacy}</a>
        </p>
      </footer>
    </Theme>
  );
}
