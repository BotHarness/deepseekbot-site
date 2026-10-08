import { Button } from '@astryxdesign/core/Button';
import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useState } from 'react';
import { Community } from './components/Community';
import { Crew } from './components/Crew';
import { Install } from './components/Install';
import { PromoVideo } from './components/PromoVideo';
import { Playground } from './components/Playground';
import { SymbolIcon } from './components/SymbolIcon';
import { COPY, LINKS } from './content';
import { pixelTheme } from './theme';
import { SiteHeader } from './components/SiteHeader';
import { changelogPath, guidePath, initialMode, pathLang, write, type Mode } from './site';

export function App() {
  const lang = pathLang();
  const [mode, setMode] = useState<Mode>(initialMode);
  const copy = COPY[lang];

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.title = copy.pageTitle;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, copy.pageTitle, mode]);

  return (
    <Theme theme={pixelTheme} mode={mode}>
      <SiteHeader
        copy={copy}
        lang={lang}
        mode={mode}
        page="home"
        onMode={(next) => {
          setMode(next);
          write('dsb-mode', next);
        }}
      />

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
          <Crew copy={copy} lang={lang} />
          <div className="ground" aria-hidden="true" />
        </section>

        <section
          className="section section--alt section--center"
          id="video"
          aria-labelledby="video-title"
        >
          <p className="kicker">{copy.video.kicker}</p>
          <h2 id="video-title">{copy.video.title}</h2>
          <p className="section-lead">{copy.video.lead}</p>
          <PromoVideo copy={copy} />
        </section>

        <section className="section feature-section" id="features" aria-labelledby="features-title">
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
                {item.guide ? (
                  <a className="feature-guide" href={guidePath(lang, item.guide.slug)}>
                    {item.guide.label} →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          <aside className="dsh-note frame">
            <h3>{copy.dsh.title}</h3>
            <p>
              {copy.dsh.body}{' '}
              <a href={LINKS.issues} target="_blank" rel="noreferrer">
                {copy.dsh.issues}
              </a>
            </p>
          </aside>
        </section>

        <section className="section section--alt" id="avatar" aria-labelledby="avatar-title">
          <p className="kicker">{copy.playground.kicker}</p>
          <h2 id="avatar-title">{copy.playground.title}</h2>
          <p className="section-lead">{copy.playground.lead}</p>
          <p className="botpixel-cta">
            <span>{copy.playground.botpixel.ask}</span>
            <a
              className="has-tip"
              href={LINKS.botpixel}
              target="_blank"
              rel="noreferrer"
              aria-describedby="botpixel-tip"
            >
              {copy.playground.botpixel.link} →
              <span className="tip" role="tooltip" id="botpixel-tip">
                {copy.playground.botpixel.tip}
              </span>
            </a>
          </p>
          <Playground copy={copy} />
        </section>

        <section className="section" id="install" aria-labelledby="install-title">
          <p className="kicker">{copy.install.kicker}</p>
          <h2 id="install-title">{copy.install.title}</h2>
          <Install copy={copy} lang={lang} />
        </section>

        <section className="section section--alt" id="community" aria-labelledby="community-title">
          <p className="kicker">{copy.community.kicker}</p>
          <h2 id="community-title">{copy.community.title}</h2>
          <p className="section-lead">{copy.community.lead}</p>
          <Community copy={copy} />
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
          <a href={changelogPath(lang)}>{copy.nav.changelog}</a>
          <a href={LINKS.discord} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a href={lang === 'zh' ? '/privacy/' : '/en/privacy/'}>{copy.footer.privacy}</a>
        </div>
        <p>
          {copy.footer.built} {copy.footer.license} {copy.footer.community}
        </p>
      </footer>
    </Theme>
  );
}
