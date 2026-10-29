import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useRef, useState } from 'react';
import { track } from './analytics';
import { MarketDetail, MarketList } from './components/Market';
import {
  DailyPicks,
  DigestPage,
  digestHref,
  PAST_PICKS_HREF,
  PastPicksPage,
  RankingRows,
  SectionPage,
  sectionHref,
} from './components/MarketDiscover';
import { SiteHeader } from './components/SiteHeader';
import { COPY } from './content';
import { SECTIONS, type MarketplaceEntry, type SectionName } from './marketApi';
import { initialMode, marketPath, pathLang, pluginsPath, write, type Mode } from './site';
import { pixelTheme } from './theme';

// Every view is a query on the same page, so a shared link opens it directly and the static
// site needs no per-Bot routes: ?bot=<GitHub node ID>, ?digest=<YYYY-MM-DD>, ?picks=past
// and ?section=<hot|new|rising>.
type View =
  | { kind: 'home' }
  | { kind: 'bot'; id: string }
  | { kind: 'digest'; day: string }
  | { kind: 'archive' }
  | { kind: 'section'; section: SectionName };

const viewOf = (search: string): View => {
  const params = new URLSearchParams(search);
  const bot = params.get('bot');
  if (bot) return { kind: 'bot', id: bot };
  const day = params.get('digest');
  if (day) return { kind: 'digest', day };
  if (params.get('picks') === 'past') return { kind: 'archive' };
  const section = params.get('section');
  if (SECTIONS.includes(section as SectionName))
    return { kind: 'section', section: section as SectionName };
  return { kind: 'home' };
};

// how many views deep this tab is, so going back restores where each one was scrolled to
const depthOf = (state: unknown) =>
  typeof state === 'object' && state !== null && 'depth' in state && typeof state.depth === 'number'
    ? state.depth
    : 0;

export function MarketApp() {
  const lang = pathLang();
  const copy = COPY[lang];
  const [mode, setMode] = useState<Mode>(initialMode);
  const [view, setView] = useState<View>(() => viewOf(location.search));
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
      setView(viewOf(location.search));
      const y = back ? (scrolls.current[next] ?? 0) : 0;
      requestAnimationFrame(() => scrollTo(0, y));
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const go = (next: View, href: string) => {
    scrolls.current[depth.current] = scrollY;
    depth.current += 1;
    history.pushState({ depth: depth.current }, '', href);
    setView(next);
    scrollTo(0, 0);
  };
  const openBot = (bot: MarketplaceEntry) => {
    preview.current = bot;
    go({ kind: 'bot', id: bot.id }, `?bot=${encodeURIComponent(bot.id)}`);
  };
  const openDigest = (day: string, entry: 'hero' | 'archive') => {
    track('marketplace:digest_open', { entry });
    go({ kind: 'digest', day }, digestHref(day));
  };
  const openArchive = () => {
    track('marketplace:digest_archive_open');
    go({ kind: 'archive' }, PAST_PICKS_HREF);
  };
  const back = () => {
    // a view opened on this page pops history; one opened from a shared link goes home
    if (depth.current > 0) history.back();
    else go({ kind: 'home' }, location.pathname);
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
                onSeeAll={(section) => go({ kind: 'section', section }, sectionHref(section))}
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
