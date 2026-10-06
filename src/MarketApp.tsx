import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useRef, useState } from 'react';
import { MarketDetail, MarketList } from './components/Market';
import { SiteHeader } from './components/SiteHeader';
import { COPY } from './content';
import type { MarketplaceEntry } from './marketApi';
import { initialMode, pathLang, write, type Mode } from './site';
import { pixelTheme } from './theme';

// A Bot's detail is ?bot=<GitHub node ID> on the same page, so a shared link opens it
// directly and the static site needs no per-Bot routes.
const botParam = () => new URLSearchParams(location.search).get('bot');

export function MarketApp() {
  const lang = pathLang();
  const copy = COPY[lang];
  const [mode, setMode] = useState<Mode>(initialMode);
  const [botId, setBotId] = useState<string | null>(botParam);
  const preview = useRef<MarketplaceEntry | null>(null);
  const listScroll = useRef(0);
  // whether the detail was opened from the list on this page, so Back can pop history
  const openedHere = useRef(false);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, mode]);

  useEffect(() => {
    if (!botId) document.title = copy.market.pageTitle;
  }, [botId, copy.market.pageTitle]);

  useEffect(() => {
    const onPop = () => {
      openedHere.current = false;
      setBotId(botParam());
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const open = (bot: MarketplaceEntry) => {
    preview.current = bot;
    openedHere.current = true;
    listScroll.current = scrollY;
    history.pushState(null, '', `?bot=${encodeURIComponent(bot.id)}`);
    setBotId(bot.id);
    scrollTo(0, 0);
  };
  const back = () => {
    if (openedHere.current) history.back();
    else history.pushState(null, '', location.pathname);
    openedHere.current = false;
    setBotId(null);
    requestAnimationFrame(() => scrollTo(0, listScroll.current));
  };

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
        {botId ? null : (
          <>
            <p className="kicker">{copy.market.kicker}</p>
            <h1 className="market-title">{copy.market.title}</h1>
            <p className="section-lead">{copy.market.lead}</p>
          </>
        )}
        <MarketList copy={copy} lang={lang} hidden={botId !== null} onOpen={open} />
        {botId ? (
          <MarketDetail
            key={botId}
            copy={copy}
            lang={lang}
            id={botId}
            preview={preview.current?.id === botId ? preview.current : null}
            onBack={back}
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
