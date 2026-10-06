import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { TextInput } from '@astryxdesign/core/TextInput';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useEffect, useMemo, useState } from 'react';
import { track } from '../analytics';
import type { Copy, Lang } from '../content';
import { recipeFor } from '../mascot';
import {
  getBot,
  listBots,
  listTopics,
  MarketError,
  type MarketplaceDetail,
  type MarketplaceEntry,
  type Sort,
} from '../marketApi';
import { pixelTileSvg } from '../pixelTile';
import { Command } from './Install';

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

const dateFormat = (lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en', { dateStyle: 'medium' });

const botName = (bot: MarketplaceEntry) => bot.displayName ?? bot.name;

function BotFace({ bot, size }: { bot: MarketplaceEntry; size: number }) {
  const svg = useMemo(
    () =>
      pixelTileSvg(recipeFor(bot.fullName)).replace(
        'width="512" height="512"',
        `width="${size}" height="${size}"`,
      ),
    [bot.fullName, size],
  );
  return <span className="bot-face" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

type ListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; bots: MarketplaceEntry[]; nextCursor?: string; more?: 'loading' | 'error' };

export function MarketList({
  copy,
  lang,
  hidden,
  onOpen,
}: {
  copy: Copy;
  lang: Lang;
  hidden: boolean;
  onOpen: (bot: MarketplaceEntry) => void;
}) {
  const t = copy.market;
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('updated');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<{ topic: string; count: number }[]>([]);
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const dates = dateFormat(lang);

  // search as the visitor pauses typing, not on every key
  useEffect(() => {
    const timer = setTimeout(() => setQ(input.trim().slice(0, 100)), 300);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const abort = new AbortController();
    listTopics(abort.signal)
      .then((r) => setTopics(r.topics))
      .catch(() => {});
    return () => abort.abort();
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    setState({ status: 'loading' });
    listBots({ sort, q, topic }, abort.signal)
      .then((page) => setState({ status: 'ready', bots: page.bots, nextCursor: page.nextCursor }))
      .catch((error: unknown) => {
        if (!abort.signal.aborted) setState({ status: 'error' });
        return error;
      });
    return () => abort.abort();
  }, [sort, q, topic, attempt]);

  const loadMore = async () => {
    if (state.status !== 'ready' || !state.nextCursor) return;
    setState({ ...state, more: 'loading' });
    try {
      const page = await listBots({ sort, q, topic, cursor: state.nextCursor });
      setState({
        status: 'ready',
        bots: [...state.bots, ...page.bots],
        nextCursor: page.nextCursor,
      });
    } catch {
      setState({ ...state, more: 'error' });
    }
  };

  const filtered = q !== '' || topic !== '';

  return (
    <div className="market" hidden={hidden}>
      <div className="market-controls frame">
        <div className="market-search">
          <TextInput
            label={t.searchLabel}
            value={input}
            placeholder={t.searchPlaceholder}
            onChange={(value) => setInput(value)}
          />
        </div>
        <SegmentedControl
          label={t.sortLabel}
          value={sort}
          isDisabled={q !== ''}
          onChange={(value) => setSort(value === 'stars' ? 'stars' : 'updated')}
        >
          <SegmentedControlItem value="updated" label={t.sortUpdated} />
          <SegmentedControlItem value="stars" label={t.sortStars} />
        </SegmentedControl>
        {topics.length > 0 ? (
          <div className="market-topics" role="group" aria-label={t.topicsLabel}>
            <button
              type="button"
              className="topic-chip"
              aria-pressed={topic === ''}
              onClick={() => setTopic('')}
            >
              {t.topicsAll}
            </button>
            {topics.map(({ topic: name, count }) => (
              <button
                key={name}
                type="button"
                className="topic-chip"
                aria-pressed={topic === name}
                onClick={() => setTopic(topic === name ? '' : name)}
              >
                {name} <span className="topic-count">{count}</span>
              </button>
            ))}
          </div>
        ) : null}
        {q ? <p className="market-hint">{t.relevance}</p> : null}
      </div>

      {state.status === 'loading' ? (
        <p className="market-status" aria-live="polite">
          {t.loading}
        </p>
      ) : state.status === 'error' ? (
        <div className="market-status" role="alert">
          <p>{t.unavailable}</p>
          <Button label={t.retry} onClick={() => setAttempt((n) => n + 1)} />
        </div>
      ) : state.bots.length === 0 ? (
        <p className="market-status">{filtered ? t.emptySearch : t.empty}</p>
      ) : (
        <>
          <ul className="bot-grid">
            {state.bots.map((bot) => (
              <li key={bot.id}>
                <a
                  className="bot-card frame"
                  href={`?bot=${encodeURIComponent(bot.id)}`}
                  aria-label={fill(t.open, { name: botName(bot) })}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
                      return;
                    event.preventDefault();
                    track('market_bot_opened', { bot: bot.id });
                    onOpen(bot);
                  }}
                >
                  <BotFace bot={bot} size={64} />
                  <span className="bot-card-body">
                    <span className="bot-card-name">{botName(bot)}</span>
                    <span className="bot-card-repo">{bot.fullName}</span>
                    {bot.roles.length > 0 ? (
                      <span className="bot-roles">
                        {bot.roles.map((role) => (
                          <span key={role} className="tag">
                            {role}
                          </span>
                        ))}
                      </span>
                    ) : null}
                    {bot.description ? (
                      <span className="bot-card-desc">{bot.description}</span>
                    ) : null}
                    <span className="bot-card-meta">
                      <span>{fill(t.stars, { count: bot.stars })}</span>
                      <span>{fill(t.updated, { date: dates.format(new Date(bot.pushedAt)) })}</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {state.nextCursor ? (
            <div className="market-more">
              <Button
                label={
                  state.more === 'loading'
                    ? t.loadingMore
                    : state.more === 'error'
                      ? t.retry
                      : t.loadMore
                }
                isDisabled={state.more === 'loading'}
                onClick={() => void loadMore()}
              />
            </div>
          ) : null}
        </>
      )}

      <aside className="market-author frame">
        <h2>{t.author.title}</h2>
        <p>{t.author.body}</p>
        <p>
          <a href={lang === 'zh' ? '/docs/share-bot/' : '/en/docs/share-bot/'}>{t.author.docs} →</a>
        </p>
      </aside>
    </div>
  );
}

type DetailState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; detail: MarketplaceDetail };

export function MarketDetail({
  copy,
  lang,
  id,
  preview,
  onBack,
}: {
  copy: Copy;
  lang: Lang;
  id: string;
  preview: MarketplaceEntry | null;
  onBack: () => void;
}) {
  const t = copy.market;
  const [state, setState] = useState<DetailState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const dates = dateFormat(lang);

  useEffect(() => {
    const abort = new AbortController();
    setState({ status: 'loading' });
    getBot(id, abort.signal)
      .then((detail) => setState({ status: 'ready', detail }))
      .catch((error: unknown) => {
        if (abort.signal.aborted) return;
        setState({
          status:
            error instanceof MarketError && error.code === 'bot-not-found' ? 'missing' : 'error',
        });
      });
    return () => abort.abort();
  }, [id, attempt]);

  const bot = state.status === 'ready' ? state.detail.bot : preview;
  const readme = useMemo(() => {
    if (state.status !== 'ready' || !state.detail.readme) return null;
    const html = marked.parse(state.detail.readme, { async: false });
    return DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'form', 'input'] });
  }, [state]);

  useEffect(() => {
    if (bot) document.title = `${botName(bot)} · ${t.pageTitle}`;
  }, [bot, t.pageTitle]);

  return (
    <div className="market-detail">
      <a
        className="market-back"
        href="?"
        onClick={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        {t.back}
      </a>
      {state.status === 'missing' ? (
        <p className="market-status">{t.notFound}</p>
      ) : state.status === 'error' && !bot ? (
        <div className="market-status" role="alert">
          <p>{t.unavailable}</p>
          <Button label={t.retry} onClick={() => setAttempt((n) => n + 1)} />
        </div>
      ) : !bot ? (
        <p className="market-status" aria-live="polite">
          {t.loading}
        </p>
      ) : (
        <div className="detail-layout">
          <article className="detail-main">
            <header className="detail-head">
              <BotFace bot={bot} size={96} />
              <div>
                <h1>{botName(bot)}</h1>
                <p className="bot-card-repo">{bot.fullName}</p>
                {bot.roles.length > 0 ? (
                  <p className="bot-roles">
                    {bot.roles.map((role) => (
                      <span key={role} className="tag">
                        {role}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </header>
            {bot.description ? <p className="detail-desc">{bot.description}</p> : null}
            {bot.topics.length > 0 ? (
              <ul className="detail-topics">
                {bot.topics.map((name) => (
                  <li key={name} className="topic-chip">
                    {name}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="readme frame">
              {state.status === 'ready' ? (
                readme ? (
                  <div className="readme-body" dangerouslySetInnerHTML={{ __html: readme }} />
                ) : (
                  <p>{t.noReadme}</p>
                )
              ) : state.status === 'error' ? (
                <div role="alert">
                  <p>{t.unavailable}</p>
                  <Button label={t.retry} onClick={() => setAttempt((n) => n + 1)} />
                </div>
              ) : (
                <p aria-live="polite">{t.readmeLoading}</p>
              )}
            </div>
          </article>
          <aside className="detail-side">
            <div className="frame detail-card">
              <p className="bot-card-meta">
                <span>{fill(t.stars, { count: bot.stars })}</span>
                <span>{fill(t.updated, { date: dates.format(new Date(bot.pushedAt)) })}</span>
              </p>
              {bot.headCommit ? (
                <p className="detail-commit">
                  {fill(t.commit, {
                    sha: bot.headCommit.sha.slice(0, 7),
                    date: dates.format(new Date(bot.headCommit.committedAt)),
                  })}
                </p>
              ) : null}
              <Button label={t.github} href={bot.htmlUrl} target="_blank" rel="noreferrer" />
            </div>
            <div className="frame detail-card">
              <h2>{t.installTitle}</h2>
              <p className="detail-label">{t.gitUrl}</p>
              <Command
                command={bot.cloneUrl}
                copy={copy}
                shell={false}
                onCopy={() =>
                  track('market_install_clicked', { bot: bot.id, action: 'copy_git_url' })
                }
              />
              <ol className="detail-steps">
                {t.installSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="detail-risk">{t.risk}</p>
              <p>
                <a
                  href={lang === 'zh' ? '/#install' : '/en/#install'}
                  onClick={() =>
                    track('market_install_clicked', { bot: bot.id, action: 'get_app' })
                  }
                >
                  {t.getApp} →
                </a>
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
