import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { LINKS, type Copy, type Lang } from '../content';
import { changelogPath, docsPath, homePath, marketPath, type Mode } from '../site';
import { navIconSvg, type NavIcon } from '../navIcons';

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
          <a href={`${home}#avatar`}>{copy.nav.avatar}</a>
          <a href={`${home}#install`}>{copy.nav.install}</a>
          <a href={marketPath(lang)} aria-current={page === 'market' ? 'page' : undefined}>
            <Icon name="market" />
            {copy.nav.market}
          </a>
          <a href={docsPath(lang)}>
            <Icon name="docs" />
            {copy.nav.docs}
          </a>
          <a href={changelogPath(lang)}>
            <Icon name="changelog" />
            {copy.nav.changelog}
          </a>
          <a href={`${home}#community`}>{copy.nav.community}</a>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            {copy.nav.github}
          </a>
        </nav>
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
          <SegmentedControl
            label={copy.modeLabel}
            size="sm"
            value={mode}
            onChange={(value) => onMode(value === 'dark' ? 'dark' : 'light')}
          >
            <SegmentedControlItem value="light" label={copy.modeLight} />
            <SegmentedControlItem value="dark" label={copy.modeDark} />
          </SegmentedControl>
        </div>
      </header>
    </>
  );
}

// Static markup from navIconSvg, no user input.
const Icon = ({ name }: { name: NavIcon }) => (
  <span className="nav-icon-wrap" dangerouslySetInnerHTML={{ __html: navIconSvg(name) }} />
);
