import { Button } from '@astryxdesign/core/Button';
import { useEffect, useState, type ReactNode } from 'react';
import { track } from '../analytics';
import type { Copy, Lang } from '../content';
import {
  getDigest,
  getSection,
  listDigests,
  MarketError,
  SECTIONS,
  type Digest,
  type DigestPick,
  type DigestSummary,
  type MarketplaceEntry,
  type Section,
  type SectionName,
} from '../marketApi';
import { marketBase, marketHref } from '../marketRoutes';
import { BotBanner, BotCard, BotFace, botName, fill, plainClick } from './Market';

// The Daily Picks row shows the newest Digest large and the six before it, like the app.
const DAILY_PICKS_SHOWN = 7;

const utcDay = (day: string) => Date.parse(`${day}T00:00:00Z`);

const locale = (lang: Lang) => (lang === 'zh' ? 'zh-CN' : 'en');

const shortDate = (day: string, lang: Lang) =>
  Number.isNaN(utcDay(day))
    ? day
    : new Intl.DateTimeFormat(locale(lang), {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(utcDay(day));

const longDate = (day: string, lang: Lang) =>
  Number.isNaN(utcDay(day))
    ? day
    : new Intl.DateTimeFormat(locale(lang), {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'UTC',
      }).format(utcDay(day));

const month = (day: string, lang: Lang) =>
  Number.isNaN(utcDay(day))
    ? ''
    : new Intl.DateTimeFormat(locale(lang), { month: 'short', timeZone: 'UTC' }).format(
        utcDay(day),
      );

type Loaded<T> =
  | { status: 'loading' }
  | { status: 'error'; code: string }
  | { status: 'ready'; value: T };

function useLoaded<T>(load: (signal: AbortSignal) => Promise<T>, key: string, attempt = 0) {
  const [state, setState] = useState<Loaded<T>>({ status: 'loading' });
  useEffect(() => {
    const abort = new AbortController();
    setState({ status: 'loading' });
    load(abort.signal).then(
      (value) => {
        if (!abort.signal.aborted) setState({ status: 'ready', value });
      },
      (error: unknown) => {
        if (abort.signal.aborted) return;
        setState({ status: 'error', code: error instanceof MarketError ? error.code : 'network' });
      },
    );
    return () => abort.abort();
    // `load` is rebuilt each render; `key` names what it loads
  }, [key, attempt]);
  return state;
}

// Clicking a discovery link swaps the view in place; a modified click opens a new tab.
function PageLink({
  href,
  className,
  label,
  onOpen,
  children,
}: {
  href: string;
  className: string;
  label?: string;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      aria-label={label}
      onClick={(event) => {
        if (!plainClick(event)) return;
        event.preventDefault();
        onOpen();
      }}
    >
      {children}
    </a>
  );
}

const pickOf = (bot: MarketplaceEntry): DigestPick => ({
  id: bot.id,
  displayName: botName(bot),
  banner: bot.banner ?? null,
  avatar: bot.avatar ?? null,
});

// Up to four picks share the cover: one fills it, two split it, three give the first the
// tall left half, four make a grid. A Digest without picks shows the day on its own scene.
function DigestCover({
  day,
  title,
  picks,
  lang,
  avatar,
  caption = true,
}: {
  day: string;
  title: string;
  picks: DigestPick[];
  lang: Lang;
  avatar: number;
  caption?: boolean;
}) {
  const shown = picks.slice(0, 4);
  return (
    <span className="digest-cover">
      <span className="digest-cover-art" data-picks={shown.length}>
        {shown.length === 0 ? (
          <span className="digest-cover-tile">
            <BotBanner banner={null} seed={`digest:${day}`} className="digest-cover-banner" />
            <span className="digest-cover-date" aria-hidden="true">
              <span>{month(day, lang)}</span>
              <strong>{day.slice(8).replace(/^0/u, '')}</strong>
            </span>
          </span>
        ) : (
          shown.map((pick) => {
            const name = pick.displayName ?? pick.id;
            return (
              <span key={pick.id} className="digest-cover-tile">
                <BotBanner banner={pick.banner} seed={name} className="digest-cover-banner" />
                <BotFace avatar={pick.avatar} seed={name} size={avatar} />
              </span>
            );
          })
        )}
      </span>
      {caption ? (
        <span className="digest-cover-caption">
          <span className="digest-cover-day">{shortDate(day, lang)}</span>
          <span className="digest-cover-title">{title}</span>
        </span>
      ) : null}
    </span>
  );
}

function DigestCard({
  digest,
  copy,
  lang,
  variant,
  onOpen,
}: {
  digest: DigestSummary;
  copy: Copy;
  lang: Lang;
  variant: 'hero' | 'past' | 'grid';
  onOpen: () => void;
}) {
  return (
    <li className="digest-card-item" data-variant={variant}>
      <PageLink
        href={marketHref(lang, { kind: 'digest', day: digest.day })}
        className="digest-card frame"
        label={fill(copy.market.discover.read, { title: digest.title })}
        onOpen={onOpen}
      >
        <DigestCover
          day={digest.day}
          title={digest.title}
          picks={digest.picks}
          lang={lang}
          avatar={variant === 'hero' ? 40 : 32}
        />
      </PageLink>
    </li>
  );
}

function RowHead({ title, link }: { title: string; link: ReactNode }) {
  return (
    <div className="market-row-head">
      <h2 className="market-row-title">{title}</h2>
      {link}
    </div>
  );
}

export function DailyPicks({
  copy,
  lang,
  onDigest,
  onArchive,
}: {
  copy: Copy;
  lang: Lang;
  onDigest: (day: string) => void;
  onArchive: () => void;
}) {
  const t = copy.market.discover;
  const state = useLoaded(() => listDigests(lang), lang);
  // the row stays out of the way until there is a Digest to show
  if (state.status !== 'ready' || state.value.length === 0) return null;
  const digests = state.value.slice(0, DAILY_PICKS_SHOWN);
  return (
    <section className="market-row" aria-label={t.dailyPicks} data-market-row="daily-picks">
      <RowHead
        title={t.dailyPicks}
        link={
          <PageLink
            href={marketHref(lang, { kind: 'archive' })}
            className="market-see-all"
            onOpen={onArchive}
          >
            {t.seePast} →
          </PageLink>
        }
      />
      <ul className="market-carousel">
        {digests.map((digest, index) => (
          <DigestCard
            key={digest.day}
            digest={digest}
            copy={copy}
            lang={lang}
            variant={index === 0 ? 'hero' : 'past'}
            onOpen={() => onDigest(digest.day)}
          />
        ))}
        <li className="digest-card-item" data-variant="more">
          <PageLink
            href={marketHref(lang, { kind: 'archive' })}
            className="digest-more frame"
            onOpen={onArchive}
          >
            {t.seePast} →
          </PageLink>
        </li>
      </ul>
    </section>
  );
}

function Installs({ bot, copy }: { bot: MarketplaceEntry; copy: Copy }) {
  const count = bot.installs ?? 0;
  const label = fill(copy.market.discover.installsLabel, { count });
  return (
    <span className="ranking-installs" aria-label={label} title={label}>
      {fill(copy.market.discover.installs, { count })}
    </span>
  );
}

function PosterCard({
  bot,
  copy,
  lang,
  onOpen,
}: {
  bot: MarketplaceEntry;
  copy: Copy;
  lang: Lang;
  onOpen: () => void;
}) {
  return (
    <li className="poster-item">
      <PageLink
        href={marketHref(lang, { kind: 'bot', id: bot.id })}
        className="poster-card frame"
        label={fill(copy.market.open, { name: botName(bot) })}
        onOpen={onOpen}
      >
        <span className="poster-art">
          <BotBanner banner={bot.banner} seed={botName(bot)} className="poster-banner" />
          <span className="poster-caption">
            <BotFace avatar={bot.avatar} seed={bot.fullName} size={44} />
            <span className="poster-name">{botName(bot)}</span>
          </span>
        </span>
        <span className="poster-foot">
          <Installs bot={bot} copy={copy} />
        </span>
      </PageLink>
    </li>
  );
}

function CompactCard({
  bot,
  copy,
  lang,
  onOpen,
}: {
  bot: MarketplaceEntry;
  copy: Copy;
  lang: Lang;
  onOpen: () => void;
}) {
  const bio = bot.bio ?? bot.description;
  return (
    <li className="compact-item">
      <PageLink
        href={marketHref(lang, { kind: 'bot', id: bot.id })}
        className="compact-card frame"
        label={fill(copy.market.open, { name: botName(bot) })}
        onOpen={onOpen}
      >
        <BotFace avatar={bot.avatar} seed={bot.fullName} size={48} />
        <span className="compact-copy">
          <span className="compact-name">{botName(bot)}</span>
          <span className="bot-card-repo compact-repo">{bot.fullName}</span>
          {bio ? (
            <span
              className="compact-bio"
              title={bot.bioGenerated ? copy.market.generatedBio : undefined}
            >
              {bio}
            </span>
          ) : null}
          <Installs bot={bot} copy={copy} />
        </span>
      </PageLink>
    </li>
  );
}

// Hot as tall posters; New and Rising as compact cards that stack three deep on a phone.
export function RankingRows({
  copy,
  lang,
  onOpen,
  onSeeAll,
}: {
  copy: Copy;
  lang: Lang;
  onOpen: (bot: MarketplaceEntry, section: SectionName) => void;
  onSeeAll: (section: SectionName) => void;
}) {
  const t = copy.market.discover;
  const state = useLoaded(() => Promise.all(SECTIONS.map((name) => getSection(name, lang))), lang);
  if (state.status !== 'ready') return null;
  return (
    <>
      {state.value
        .filter((section) => section.entries.length > 0)
        .map((section) => {
          const title = t.sections[section.section];
          const Card = section.section === 'hot' ? PosterCard : CompactCard;
          return (
            <section
              key={section.section}
              className="market-row"
              aria-label={title}
              data-market-row={section.section}
            >
              <RowHead
                title={title}
                link={
                  <PageLink
                    href={marketHref(lang, { kind: 'section', section: section.section })}
                    className="market-see-all"
                    onOpen={() => onSeeAll(section.section)}
                  >
                    {t.seeAll} →
                  </PageLink>
                }
              />
              <ul
                className="market-carousel"
                data-cards={section.section === 'hot' ? 'poster' : 'compact'}
              >
                {section.entries.map(({ bot }) => (
                  <Card
                    key={bot.id}
                    bot={bot}
                    copy={copy}
                    lang={lang}
                    onOpen={() => onOpen(bot, section.section)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
    </>
  );
}

export function BackLink({
  label,
  lang,
  onBack,
}: {
  label: string;
  lang: Lang;
  onBack: () => void;
}) {
  return (
    <a
      className="market-back"
      href={marketBase(lang)}
      onClick={(event) => {
        event.preventDefault();
        onBack();
      }}
    >
      {label}
    </a>
  );
}

function Status({
  state,
  copy,
  missing,
  onRetry,
}: {
  state: Loaded<unknown>;
  copy: Copy;
  missing?: string;
  onRetry: () => void;
}) {
  if (state.status === 'loading')
    return (
      <p className="market-status" aria-live="polite">
        {copy.market.loading}
      </p>
    );
  if (state.status !== 'error') return null;
  if (missing && (state.code === 'digest-not-found' || state.code === 'invalid-day'))
    return <p className="market-status">{missing}</p>;
  return (
    <div className="market-status" role="alert">
      <p>{copy.market.unavailable}</p>
      <Button label={copy.market.retry} onClick={onRetry} />
    </div>
  );
}

export function DigestPage({
  copy,
  lang,
  day,
  onBack,
  onOpen,
  onArchive,
}: {
  copy: Copy;
  lang: Lang;
  day: string;
  onBack: () => void;
  onOpen: (bot: MarketplaceEntry) => void;
  onArchive: () => void;
}) {
  const t = copy.market.discover;
  const [attempt, setAttempt] = useState(0);
  const state = useLoaded<Digest>(
    (signal) => getDigest(day, lang, signal),
    `${day}:${lang}`,
    attempt,
  );
  const digest = state.status === 'ready' ? state.value : null;

  useEffect(() => {
    document.title = `${digest?.title ?? t.dailyPicks} · ${copy.market.pageTitle}`;
  }, [digest?.title, t.dailyPicks, copy.market.pageTitle]);

  return (
    <div className="market-subpage">
      <BackLink label={copy.market.back} lang={lang} onBack={onBack} />
      <Status
        state={state}
        copy={copy}
        missing={t.digestMissing}
        onRetry={() => setAttempt((n) => n + 1)}
      />
      {digest ? (
        <article className="digest-article" data-market-digest={digest.day}>
          <span className="digest-article-cover frame">
            <DigestCover
              day={digest.day}
              title={digest.title}
              picks={digest.sections.flatMap((section) =>
                section.bot ? [pickOf(section.bot)] : [],
              )}
              lang={lang}
              avatar={56}
              caption={false}
            />
          </span>
          <p className="kicker">
            {t.dailyPicks} · {longDate(digest.day, lang)}
          </p>
          <h1 className="market-title">{digest.title}</h1>
          <p className="section-lead digest-lede">{digest.lede}</p>
          {digest.sections.map((section) => (
            <section key={section.heading} className="digest-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.bot ? (
                <div className="digest-bot">
                  <BotCard
                    bot={section.bot}
                    copy={copy}
                    lang={lang}
                    onOpen={(bot) => {
                      track('marketplace:bot_open', { bot: bot.id, entry: 'digest' });
                      onOpen(bot);
                    }}
                  />
                </div>
              ) : (
                <p className="market-hint">{copy.market.notFound}</p>
              )}
            </section>
          ))}
          <p className="digest-end">
            <PageLink
              href={marketHref(lang, { kind: 'archive' })}
              className="market-see-all"
              onOpen={onArchive}
            >
              {t.seePast} →
            </PageLink>
          </p>
        </article>
      ) : null}
    </div>
  );
}

export function PastPicksPage({
  copy,
  lang,
  onBack,
  onDigest,
}: {
  copy: Copy;
  lang: Lang;
  onBack: () => void;
  onDigest: (day: string) => void;
}) {
  const t = copy.market.discover;
  const [attempt, setAttempt] = useState(0);
  const state = useLoaded(() => listDigests(lang), lang, attempt);

  useEffect(() => {
    document.title = `${t.pastPicks} · ${copy.market.pageTitle}`;
  }, [t.pastPicks, copy.market.pageTitle]);

  return (
    <div className="market-subpage" data-market-digest="archive">
      <BackLink label={copy.market.back} lang={lang} onBack={onBack} />
      <h1 className="market-title">{t.pastPicks}</h1>
      <Status state={state} copy={copy} onRetry={() => setAttempt((n) => n + 1)} />
      {state.status === 'ready' ? (
        state.value.length === 0 ? (
          <p className="market-status">{t.noPast}</p>
        ) : (
          <ul className="digest-grid">
            {state.value.map((digest) => (
              <DigestCard
                key={digest.day}
                digest={digest}
                copy={copy}
                lang={lang}
                variant="grid"
                onOpen={() => onDigest(digest.day)}
              />
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}

export function SectionPage({
  copy,
  lang,
  section,
  onBack,
  onOpen,
}: {
  copy: Copy;
  lang: Lang;
  section: SectionName;
  onBack: () => void;
  onOpen: (bot: MarketplaceEntry) => void;
}) {
  const t = copy.market.discover;
  const title = t.sections[section];
  const [attempt, setAttempt] = useState(0);
  const state = useLoaded<Section>(() => getSection(section, lang), `${section}:${lang}`, attempt);

  useEffect(() => {
    document.title = `${title} · ${copy.market.pageTitle}`;
  }, [title, copy.market.pageTitle]);

  return (
    <div className="market-subpage" data-market-ranking={section}>
      <BackLink label={copy.market.back} lang={lang} onBack={onBack} />
      <h1 className="market-title">{title}</h1>
      <Status state={state} copy={copy} onRetry={() => setAttempt((n) => n + 1)} />
      {state.status === 'ready' ? (
        state.value.entries.length === 0 ? (
          <p className="market-status">{t.sectionEmpty}</p>
        ) : (
          <ul className="bot-grid">
            {state.value.entries.map(({ bot }) => (
              <li key={bot.id}>
                <BotCard
                  bot={bot}
                  copy={copy}
                  lang={lang}
                  onOpen={(opened) => {
                    track('marketplace:bot_open', { bot: opened.id, entry: section });
                    onOpen(opened);
                  }}
                />
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );
}
