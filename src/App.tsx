import { Theme } from '@astryxdesign/core/theme';
import { useEffect, useState } from 'react';
import { BotCompanion } from './components/BotCompanion';
import { useAvatarDesign } from './avatarDesign';
import { Community } from './components/Community';
import { Crew } from './components/Crew';
import { Faq } from './components/Faq';
import { HeroLinks } from './components/HeroLinks';
import { HeroThemeToggle } from './components/HeroThemeToggle';
import { LiveDemo } from './components/LiveDemo';
import { Install } from './components/Install';
import { MobileBeta } from './components/MobileBeta';
import { PromoVideo } from './components/PromoVideo';
import { Playground } from './components/Playground';
import { Sponsors } from './components/Sponsors';
import { HomepageFeatures, HomepageFooter, HowTobsWorks } from './components/HomepageSections';
import { COPY, LINKS } from './content';
import { HERO_COPY } from './heroCopy';
import { PREVIEW_COPY } from './previewCopy';
import { pixelTheme } from './theme';
import { SiteHeader } from './components/SiteHeader';
import { blogPath, initialMode, pathLang, write, type Mode } from './site';
import { HOMEPAGE_COPY } from './homepageCopy';

export function App() {
  const lang = pathLang();
  const [mode, setMode] = useState<Mode>(initialMode);
  const copy = COPY[lang];
  const hero = HERO_COPY[lang];
  const preview = PREVIEW_COPY[lang];
  const home = HOMEPAGE_COPY[lang];
  const design = useAvatarDesign();
  const changeMode = (next: Mode) => {
    setMode(next);
    write('dsb-mode', next);
  };

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.title = copy.pageTitle;
    document.documentElement.dataset.theme = mode;
  }, [copy.htmlLang, copy.pageTitle, mode]);

  return (
    <Theme theme={pixelTheme} mode={mode}>
      <SiteHeader copy={copy} lang={lang} mode={mode} page="home" onMode={changeMode} />

      <main id="main">
        <section className="hero" id="top">
          <div className="sky" aria-hidden="true">
            <span className="cloud cloud--a" />
            <span className="cloud cloud--b" />
            <span className="cloud cloud--c" />
            <span className="star-field" />
          </div>
          <HeroThemeToggle lang={lang} mode={mode} onMode={changeMode} />
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 className="wordmark hero-title">{copy.hero.title}</h1>
              <p className="hero-subtitle">{copy.hero.tagline}</p>
              <p className="hero-summary">{hero.summary}</p>
              <ul className="chips hero-chips">
                {copy.hero.chips.map((chip, index) => (
                  <li key={chip}>
                    {index === 1 ? (
                      <a href={LINKS.dsh} target="_blank" rel="noreferrer">
                        {chip} · {hero.stars}
                      </a>
                    ) : (
                      chip
                    )}
                  </li>
                ))}
              </ul>
              <HeroLinks lang={lang} />
            </div>
            <figure className="hero-product">
              <LiveDemo copy={copy} linkedPhone />
              <figcaption className="hero-caption">{preview.caption}</figcaption>
            </figure>
          </div>
          <Crew copy={copy} lang={lang} />
          <div className="ground" aria-hidden="true" />
        </section>

        <HowTobsWorks copy={copy} lang={lang} />

        <section className="section workflow-section" id="install" aria-labelledby="install-title">
          <h2 id="install-title">{home.install}</h2>
          <Install copy={copy} lang={lang} />
          <MobileBeta lang={lang} placement="install" />
        </section>

        <HomepageFeatures copy={copy} lang={lang} />

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
          <Playground copy={copy} lang={lang} design={design} />
        </section>

        <section className="section" id="reviews" aria-labelledby="reviews-title">
          <p className="kicker">{copy.reviews.kicker}</p>
          <h2 id="reviews-title">{copy.reviews.title}</h2>
          <p className="section-lead">{copy.reviews.lead}</p>
          <ul className="review-list">
            {copy.reviews.quotes.map((quote) => (
              <li key={quote} className="review-card frame">
                <blockquote>“{quote}”</blockquote>
              </li>
            ))}
          </ul>
        </section>

        <section className="section section--alt" id="community" aria-labelledby="community-title">
          <p className="kicker">{copy.community.kicker}</p>
          <h2 id="community-title">{copy.community.title}</h2>
          <p className="section-lead">{copy.community.lead}</p>
          <Community copy={copy} />
        </section>

        <Sponsors lang={lang} />

        <section
          className="section section--alt compare-section"
          id="compare"
          aria-labelledby="compare-title"
        >
          <p className="kicker">{copy.compare.kicker}</p>
          <h2 id="compare-title">{copy.compare.title}</h2>
          <ul className="compare-links">
            {copy.compare.items.map((item) => (
              <li key={item.href}>
                <a className="compare-card frame" href={item.href}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="compare-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="compare-note">{copy.compare.note}</p>
          <a className="workflow-link" href={blogPath(lang)}>
            {home.blog} →
          </a>
        </section>

        <Faq copy={copy} />
      </main>

      <BotCompanion lang={lang} design={design} />

      <HomepageFooter copy={copy} lang={lang} />
    </Theme>
  );
}
