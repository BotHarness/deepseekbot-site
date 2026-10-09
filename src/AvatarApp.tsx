import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useState } from 'react';
import { useAvatarDesign } from './avatarDesign';
import { BotCompanion } from './components/BotCompanion';
import { Playground } from './components/Playground';
import { SiteHeader } from './components/SiteHeader';
import { COPY, LINKS } from './content';
import { initialMode, pathLang, write, type Mode } from './site';
import { pixelTheme } from './theme';

/**
 * The Avatar Studio at /avatar: the stage, the part editor and the color and shape panel side by
 * side, with the companion walking along the bottom in the design being edited. The design is the
 * same one the home page shows, kept in this browser.
 */
export function AvatarApp() {
  const lang = pathLang();
  const copy = COPY[lang];
  const [mode, setMode] = useState<Mode>(initialMode);
  const design = useAvatarDesign();

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.title = copy.studio.pageTitle;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, copy.studio.pageTitle, mode]);

  return (
    <Theme theme={pixelTheme} mode={mode}>
      <SiteHeader
        copy={copy}
        lang={lang}
        mode={mode}
        page="avatar"
        onMode={(next) => {
          setMode(next);
          write('dsb-mode', next);
        }}
      />
      <main id="main" className="section studio-page">
        <p className="kicker">{copy.studio.kicker}</p>
        <h1 className="market-title">{copy.studio.title}</h1>
        <p className="section-lead">{copy.studio.lead}</p>
        <Playground copy={copy} lang={lang} design={design} studio />
      </main>
      <footer className="footer market-footer">
        <p>
          {copy.footer.built}{' '}
          <a href={LINKS.botpixel} target="_blank" rel="noreferrer">
            BotPixel
          </a>{' '}
          · <a href={lang === 'zh' ? '/privacy/' : '/en/privacy/'}>{copy.footer.privacy}</a>
        </p>
      </footer>
      {/* the same companion as on the home page, wearing the design as it is edited */}
      <BotCompanion lang={lang} design={design} />
    </Theme>
  );
}
