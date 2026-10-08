import { type Copy, type Lang } from '../content';
import { changelogPath, docsPath, homePath, marketPath, type Mode } from '../site';
import { navIconSvg, type NavIcon } from '../navIcons';
import { HeaderCommunity } from './HeaderCommunity';

export function SiteHeader({
  copy,
  lang,
  mode,
  page,
  onMode,
}: {
  copy: Copy;
  lang: Lang;
  mode: Mode;
  page: 'home' | 'market';
  onMode: (mode: Mode) => void;
}) {
  // on the home page the sections are anchors; elsewhere they lead back to them
  const home = page === 'home' ? '' : homePath(lang);
  return (
    <>
      <a className="skip" href="#main">
        {lang === 'zh' ? '跳到正文' : 'Skip to content'}
      </a>
      <header className="topbar">
        <a className="brand" href={page === 'home' ? '#top' : homePath(lang)}>
          <span className="brand-logo">
            <img src="/logo.png" width={32} height={32} alt="" />
          </span>
          <span>DeepSeekBot</span>
        </a>
        <nav className="topnav" aria-label="DeepSeekBot">
          <a href={`${home}#features`}>{copy.nav.features}</a>
          <a href={`${home}#install`}>{copy.nav.install}</a>
          <a href={marketPath(lang)} aria-current={page === 'market' ? 'page' : undefined}>
            <Icon name="market" />
            {copy.nav.market}
          </a>
          <a href={docsPath(lang)}>
            <Icon name="docs" />
            {copy.nav.docs}
          </a>
          <a className="nav-changelog" href={changelogPath(lang)}>
            <Icon name="changelog" />
            {copy.nav.changelog}
          </a>
        </nav>
        <div className="header-actions">
          <HeaderCommunity lang={lang} />
          <div className="toggles">
            <nav className="lang-switch" aria-label={copy.langLabel}>
              <a
                href={page === 'home' ? '/' : marketPath('zh') + location.search}
                hrefLang="zh-Hans"
                lang="zh-Hans"
                aria-current={lang === 'zh' ? 'page' : undefined}
              >
                中文
              </a>
              <a
                href={page === 'home' ? '/en/' : marketPath('en') + location.search}
                hrefLang="en"
                lang="en"
                aria-current={lang === 'en' ? 'page' : undefined}
              >
                EN
              </a>
            </nav>
            <div className="mode-switch" role="group" aria-label={copy.modeLabel}>
              {(['light', 'dark'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={value === 'light' ? copy.modeLight : copy.modeDark}
                  title={value === 'light' ? copy.modeLight : copy.modeDark}
                  aria-pressed={mode === value}
                  onClick={() => onMode(value)}
                >
                  <Icon name={value === 'light' ? 'sun' : 'moon'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Static markup from navIconSvg, no user input.
const Icon = ({ name }: { name: NavIcon }) => (
  <span className="nav-icon-wrap" dangerouslySetInnerHTML={{ __html: navIconSvg(name) }} />
);
