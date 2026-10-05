import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Theme } from '@astryxdesign/core/theme';
import { seededRecipe } from '@botharness/pixel-avatar';
import { useEffect, useMemo, useState } from 'react';
import { Crew } from './components/Crew';
import { Install } from './components/Install';
import { PixelAvatar } from './components/PixelAvatar';
import { Playground } from './components/Playground';
import { SymbolIcon } from './components/SymbolIcon';
import { COPY, LINKS, type Lang } from './content';
import { pixelTheme } from './theme';

type Mode = 'light' | 'dark';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // private windows may refuse storage; the choice just won't persist
  }
};

const initialLang = (): Lang => {
  // /en/ is the English entry (its own title, description and share card)
  if (location.pathname.startsWith('/en')) return 'en';
  const saved = read('dsb-lang');
  if (saved === 'zh' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};
const initialMode = (): Mode => {
  const saved = read('dsb-mode');
  if (saved === 'light' || saved === 'dark') return saved;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [mode, setMode] = useState<Mode>(initialMode);
  const copy = COPY[lang];
  const mascot = useMemo(() => seededRecipe('DeepSeekBot'), []);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.title = copy.pageTitle;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, copy.pageTitle, mode]);

  return (
    <Theme theme={pixelTheme} mode={mode}>
      <a className="skip" href="#main">
        {lang === 'zh' ? '跳到正文' : 'Skip to content'}
      </a>
      <header className="topbar">
        <a className="brand" href="#top">
          <PixelAvatar recipe={mascot} size={32} />
          <span>DeepSeekBot</span>
        </a>
        <nav className="topnav" aria-label="DeepSeekBot">
          <a href="#features">{copy.nav.features}</a>
          <a href="#avatar">{copy.nav.avatar}</a>
          <a href="#install">{copy.nav.install}</a>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            {copy.nav.github}
          </a>
        </nav>
        <div className="toggles">
          <SegmentedControl
            label={copy.langLabel}
            size="sm"
            value={lang}
            onChange={(value) => {
              const next = value === 'en' ? 'en' : 'zh';
              setLang(next);
              write('dsb-lang', next);
              // keep the address on the matching entry, so a copied link opens in this language
              history.replaceState(null, '', (next === 'en' ? '/en/' : '/') + location.hash);
            }}
          >
            <SegmentedControlItem value="zh" label="中文" />
            <SegmentedControlItem value="en" label="EN" />
          </SegmentedControl>
          <SegmentedControl
            label={copy.modeLabel}
            size="sm"
            value={mode}
            onChange={(value) => {
              const next = value === 'dark' ? 'dark' : 'light';
              setMode(next);
              write('dsb-mode', next);
            }}
          >
            <SegmentedControlItem value="light" label={copy.modeLight} />
            <SegmentedControlItem value="dark" label={copy.modeDark} />
          </SegmentedControl>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="sky" aria-hidden="true">
            <span className="cloud cloud--a" />
            <span className="cloud cloud--b" />
            <span className="cloud cloud--c" />
            <span className="star-field" />
          </div>
          <div className="hero-copy">
            <p className="badge">{copy.hero.badge}</p>
            <h1 className="wordmark">{copy.hero.title}</h1>
            <p className="tagline">{copy.hero.tagline}</p>
            <p className="lead">{copy.hero.lead}</p>
            <ul className="chips">
              {copy.hero.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
            <div className="cta">
              <Button label={copy.hero.ctaInstall} variant="primary" size="lg" href="#install" />
              <Button
                label={copy.hero.ctaGithub}
                size="lg"
                href={LINKS.github}
                target="_blank"
                rel="noreferrer"
              />
            </div>
          </div>
          <Crew copy={copy} />
          <div className="ground" aria-hidden="true" />
        </section>

        <section className="section" id="features" aria-labelledby="features-title">
          <p className="kicker">{copy.features.kicker}</p>
          <h2 id="features-title">{copy.features.title}</h2>
          <p className="section-lead">{copy.features.lead}</p>
          <ul className="feature-grid">
            {copy.features.items.map((item) => (
              <li key={item.title} className="feature frame">
                <span className="feature-icon">
                  <SymbolIcon symbol={item.icon} color="#3d5afe" size={40} />
                </span>
                <h3>
                  {item.title}
                  {item.tag ? <span className="tag">{item.tag}</span> : null}
                </h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section section--alt" id="avatar" aria-labelledby="avatar-title">
          <p className="kicker">{copy.playground.kicker}</p>
          <h2 id="avatar-title">{copy.playground.title}</h2>
          <p className="section-lead">{copy.playground.lead}</p>
          <Playground copy={copy} />
        </section>

        <section className="section" id="install" aria-labelledby="install-title">
          <p className="kicker">{copy.install.kicker}</p>
          <h2 id="install-title">{copy.install.title}</h2>
          <p className="section-lead">{copy.install.lead}</p>
          <Install copy={copy} />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKS.docs} target="_blank" rel="noreferrer">
            botharness.ai
          </a>
          <a href={LINKS.npm} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href={LINKS.botpixel} target="_blank" rel="noreferrer">
            BotPixel
          </a>
          <a href={LINKS.changelog} target="_blank" rel="noreferrer">
            Changelog
          </a>
        </div>
        <p>
          {copy.footer.built} {copy.footer.license} {copy.footer.community}
        </p>
      </footer>
    </Theme>
  );
}
