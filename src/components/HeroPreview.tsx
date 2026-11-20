import {
  ArrowUp,
  ArrowUpRight,
  BatteryFull,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  FileText,
  Hash,
  Laptop,
  ListTodo,
  MessagesSquare,
  Plug,
  Signal,
  Terminal,
  Users,
  Wifi,
  X,
} from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '../analytics';
import { recipeFor } from '../mascot';
import { PREVIEW_MODELS, type ModelId, type PreviewCopy, type PreviewModel } from '../previewCopy';
import { PixelAvatar } from './PixelAvatar';

type Conversation = 'team' | 'nova';
type Panel = 'members' | 'models' | 'sessions' | 'session';
type Role = 'main' | 'task';
type ModelPlan = Record<Role, ModelId>;
type TeamPost = { who: string; text: string };

const PRESET: ModelPlan = { main: 'claude', task: 'codex' };

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return <PixelAvatar recipe={recipeFor(name)} size={size} />;
}

function ModelSource({ model, t }: { model: PreviewModel; t: PreviewCopy }) {
  return (
    <span className="preview-model-source">
      {model.source === 'subscription' ? <Plug size={12} aria-hidden="true" /> : null}
      {model.provider} · {model.source === 'api' ? t.api : t.plans[model.id]}
    </span>
  );
}

function ModelPicker({
  t,
  plan,
  onSelect,
}: {
  t: PreviewCopy;
  plan: ModelPlan;
  onSelect: (next: ModelPlan) => void;
}) {
  const [role, setRole] = useState<Role>('main');
  const [filter, setFilter] = useState<'all' | 'api' | 'subscription' | 'presets'>('all');

  return (
    <div className="preview-picker">
      <div className="preview-segments" role="group" aria-label={t.modelPicker}>
        {(['main', 'task'] as const).map((key) => (
          <button type="button" key={key} aria-pressed={role === key} onClick={() => setRole(key)}>
            {t[key]}
          </button>
        ))}
      </div>
      <div className="preview-filters" role="group" aria-label={t.catalog}>
        {(['all', 'api', 'subscription', 'presets'] as const).map((key) => (
          <button
            type="button"
            key={key}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {t[key]}
          </button>
        ))}
      </div>
      {filter === 'presets' ? (
        <button
          type="button"
          className="preview-model-row"
          aria-pressed={plan.main === PRESET.main && plan.task === PRESET.task}
          onClick={() => onSelect(PRESET)}
        >
          <span>
            <strong>{t.preset}</strong>
            <small>
              {t.main} · Opus 5.5 / {t.task} · GPT-6.1 Sol
            </small>
          </span>
        </button>
      ) : (
        <ul className="preview-list">
          {PREVIEW_MODELS.filter((model) => filter === 'all' || model.source === filter).map(
            (model) => (
              <li key={model.id}>
                <button
                  type="button"
                  className="preview-model-row"
                  aria-pressed={plan[role] === model.id}
                  onClick={() => onSelect({ ...plan, [role]: model.id })}
                >
                  <span>
                    <strong>{model.name}</strong>
                    <ModelSource model={model} t={t} />
                  </span>
                  {plan[role] === model.id ? <Check size={16} aria-hidden="true" /> : null}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
      <p className="preview-hint">{t.catalog}</p>
    </div>
  );
}

function SessionDetail({ t, isTeam }: { t: PreviewCopy; isTeam: boolean }) {
  const model = isTeam ? PREVIEW_MODELS[0] : PREVIEW_MODELS[2];
  const path = isTeam ? 'content/pricing.md' : 'docs/help-center.md';
  const stale = isTeam ? '/plans/annual-2025' : '/docs/migration-2025';

  return (
    <div className="preview-detail">
      <div className="preview-session-heading">
        <h3>{isTeam ? t.session : t.localSession}</h3>
        <span className="preview-complete">
          <CircleCheck size={14} aria-hidden="true" />
          {t.complete}
        </span>
      </div>
      <p className="preview-source">
        <ModelSource model={model} t={t} /> · {model.name}
      </p>
      <p className="preview-goal">
        <strong>{t.goal}</strong>
        {isTeam ? t.goalText : t.localGoalText}
      </p>
      <details className="preview-progress">
        <summary>
          <ListTodo size={16} aria-hidden="true" />
          {t.progress}
          <span>3/3</span>
        </summary>
        <ul className="preview-list">
          {(isTeam ? t.todos : t.localTodos).map((todo) => (
            <li key={todo}>
              <Check size={14} aria-hidden="true" /> {todo}
            </li>
          ))}
        </ul>
      </details>
      <div className="preview-transcript">
        <h4>{t.assignment}</h4>
        <p className="preview-instruction">{isTeam ? t.instruction : t.localInstruction}</p>
        <details className="preview-work">
          <summary>
            <Terminal size={16} aria-hidden="true" />
            {t.work}
          </summary>
          <details>
            <summary>
              <FileText size={14} aria-hidden="true" />
              {t.stepRead}
            </summary>
            <code>{path}</code>
          </details>
          <details>
            <summary>
              <Terminal size={14} aria-hidden="true" />
              {t.stepCheck}
            </summary>
            <pre aria-label={t.output}>
              <code>{`check-links ${path}\n2 passed, 1 stale: ${stale}`}</code>
            </pre>
          </details>
        </details>
        <p className="preview-result">{isTeam ? t.result : t.localResult}</p>
      </div>
    </div>
  );
}

function Message({ who, children }: { who: string; children: ReactNode }) {
  return (
    <li className="preview-message">
      <Avatar name={who} />
      <div>
        <strong>{who}</strong>
        <div className="preview-bubble">{children}</div>
      </div>
    </li>
  );
}

function Conversations({
  t,
  conversation,
  onOpen,
}: {
  t: PreviewCopy;
  conversation: Conversation;
  onOpen: (channel: Conversation) => void;
}) {
  return (
    <nav className="preview-channels" aria-label={t.chats}>
      <span className="preview-channel-host">{t.teamHost}</span>
      <button
        type="button"
        aria-current={conversation === 'team' ? 'true' : undefined}
        onClick={() => onOpen('team')}
      >
        <Hash size={16} aria-hidden="true" />
        <span>
          <strong>{t.channel}</strong>
          <small>{t.shared}</small>
        </span>
      </button>
      <span className="preview-channel-host">{t.localHost}</span>
      <button
        type="button"
        aria-current={conversation === 'nova' ? 'true' : undefined}
        onClick={() => onOpen('nova')}
      >
        <Avatar name="Nova" size={23} />
        <span>
          <strong>Nova</strong>
          <small>{t.direct}</small>
        </span>
      </button>
    </nav>
  );
}

function PreviewWorkspace({
  phone = false,
  t,
  plan,
  onSelect,
  posts,
  onPost,
}: {
  phone?: boolean;
  t: PreviewCopy;
  plan: ModelPlan;
  onSelect: (next: ModelPlan) => void;
  posts: TeamPost[];
  onPost: (post: TeamPost) => void;
}) {
  const [conversation, setConversation] = useState<Conversation>('team');
  const [panel, setPanel] = useState<Panel | null>(null);
  const [showChats, setShowChats] = useState(false);
  const [fromList, setFromList] = useState(false);
  const [draft, setDraft] = useState('');
  const feed = useRef<HTMLDivElement>(null);
  const who = phone ? 'Jun' : 'Mei';
  const composer = t.composer.replace('{name}', who);
  const backTo = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const sessionRow = useRef<HTMLButtonElement>(null);
  const chatHeading = useRef<HTMLHeadingElement>(null);
  const chatsHeading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef<'chat' | 'chats' | 'trigger' | 'session-row' | null>(null);
  const isTeam = conversation === 'team';
  const selected = PREVIEW_MODELS.find((model) => model.id === plan.main)!;

  useLayoutEffect(() => {
    if (moveFocus.current === 'session-row') {
      sessionRow.current?.focus({ preventScroll: true });
    } else if (panel) {
      closeButton.current?.focus({ preventScroll: true });
    } else if (moveFocus.current === 'chat') {
      chatHeading.current?.focus({ preventScroll: true });
    } else if (moveFocus.current === 'chats') {
      chatsHeading.current?.focus({ preventScroll: true });
    } else if (moveFocus.current === 'trigger') {
      backTo.current?.focus({ preventScroll: true });
    }
    moveFocus.current = null;
  }, [conversation, panel, showChats]);

  useLayoutEffect(() => {
    if (isTeam && posts.length && feed.current) feed.current.scrollTop = feed.current.scrollHeight;
  }, [isTeam, posts]);

  function openConversation(next: Conversation) {
    if (next === conversation && !panel && !showChats) return;
    track('demo:channel_open', { channel: next === 'team' ? 'preview-team' : 'preview-nova' });
    moveFocus.current = 'chat';
    setPanel(null);
    setShowChats(false);
    setConversation(next);
  }

  function openPanel(next: Panel, trigger: HTMLButtonElement) {
    backTo.current = trigger;
    setFromList(false);
    setPanel(next);
  }

  function closePanel() {
    if (panel === 'session' && fromList) {
      moveFocus.current = 'session-row';
      setFromList(false);
      setPanel('sessions');
      return;
    }
    moveFocus.current = 'trigger';
    setPanel(null);
  }

  function sessionLink() {
    return (
      <button
        type="button"
        className="preview-session-link"
        aria-expanded={panel === 'session'}
        onClick={(event) => openPanel('session', event.currentTarget)}
      >
        <ListTodo size={16} aria-hidden="true" />
        <span>{isTeam ? t.session : t.localSession}</span>
        <ArrowUpRight size={14} aria-hidden="true" />
      </button>
    );
  }

  const conversations = (
    <Conversations t={t} conversation={conversation} onOpen={openConversation} />
  );

  const panelTitle =
    panel &&
    {
      members: t.members,
      models: t.modelPicker,
      sessions: t.sessions,
      session: t.sessions,
    }[panel];

  return (
    <div
      className="preview-workspace"
      data-panel={panel ?? undefined}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && panel) {
          event.stopPropagation();
          closePanel();
        }
      }}
    >
      {!phone ? conversations : null}
      {phone && showChats ? (
        <div className="preview-chat-list">
          <h3 tabIndex={-1} ref={chatsHeading}>
            {t.chats}
          </h3>
          {conversations}
        </div>
      ) : null}
      <section className="preview-chat" hidden={phone && (showChats || panel !== null)}>
        <header className="preview-chat-head">
          {phone ? (
            <button
              type="button"
              className="preview-icon"
              aria-label={t.chats}
              onClick={() => {
                moveFocus.current = 'chats';
                setShowChats(true);
              }}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          ) : null}
          {isTeam ? <Hash size={21} aria-hidden="true" /> : <Avatar name="Nova" />}
          <div className="preview-chat-title">
            <h3 tabIndex={-1} ref={chatHeading}>
              {isTeam ? t.channel : 'Nova'}
            </h3>
            <small>{isTeam ? t.teamScope : t.localScope}</small>
          </div>
          {isTeam ? (
            <button
              type="button"
              className="preview-control"
              aria-expanded={panel === 'members'}
              onClick={(event) => openPanel('members', event.currentTarget)}
            >
              <Users size={16} aria-hidden="true" /> {t.members}
            </button>
          ) : (
            <button
              type="button"
              className="preview-control"
              aria-label={t.sessions}
              aria-expanded={panel === 'sessions' || (panel === 'session' && fromList)}
              onClick={(event) => openPanel('sessions', event.currentTarget)}
            >
              <ListTodo size={16} aria-hidden="true" /> <span>1</span>
            </button>
          )}
        </header>
        {!isTeam ? (
          <div className="preview-model-bar">
            <button
              type="button"
              className="preview-control preview-model-trigger"
              aria-label={t.modelPicker + ' · ' + selected.name}
              aria-expanded={panel === 'models'}
              onClick={(event) => openPanel('models', event.currentTarget)}
            >
              <span>
                <strong>{selected.name}</strong>
                <ModelSource model={selected} t={t} />
              </span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
        <div className="preview-feed" ref={feed}>
          <p className="preview-date">{t.time}</p>
          <ol className="preview-list preview-messages" aria-live="polite">
            {isTeam ? (
              <>
                <Message who="Mei">{t.teamPrompt}</Message>
                <Message who="Nova">{t.teamReply}</Message>
                <Message who="Jun">
                  {t.teamLink}
                  {sessionLink()}
                </Message>
                {posts.map((post, index) => (
                  <Message key={index} who={post.who}>
                    {post.text}
                  </Message>
                ))}
              </>
            ) : (
              <>
                <Message who="Mei">{t.novaPrompt}</Message>
                <Message who="Nova">
                  {t.novaReply}
                  <small className="preview-new-session">{t.newSession}</small>
                  {sessionLink()}
                </Message>
              </>
            )}
          </ol>
          {isTeam ? (
            <button
              type="button"
              className="preview-direct"
              onClick={() => openConversation('nova')}
            >
              <MessagesSquare size={15} aria-hidden="true" />
              {t.openNova}
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {isTeam ? (
          <form
            className="app-composer preview-composer"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim();
              if (text) {
                onPost({ who, text });
                setDraft('');
              }
            }}
          >
            <Avatar name={who} size={22} />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={composer}
              aria-label={composer}
              maxLength={200}
            />
            <button type="submit" className="app-send" aria-label={t.send} disabled={!draft.trim()}>
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </form>
        ) : null}
      </section>
      {panel ? (
        <aside className="preview-panel" aria-label={panelTitle || undefined}>
          <header className="preview-panel-head">
            <button
              type="button"
              className="preview-icon"
              aria-label={phone || fromList ? t.back : t.close}
              ref={closeButton}
              onClick={closePanel}
            >
              {phone || fromList ? (
                <ChevronLeft size={20} aria-hidden="true" />
              ) : (
                <X size={18} aria-hidden="true" />
              )}
            </button>
            <strong>{panelTitle}</strong>
          </header>
          <div className="preview-panel-scroll" key={panel}>
            {panel === 'members' ? (
              <div className="preview-members">
                <h3>{t.teamHost}</h3>
                <p>{t.teamScope}</p>
                <ul className="preview-list">
                  {(
                    [
                      ['Mei', t.owner],
                      ['Lea', t.admin],
                      ['Jun', t.member],
                      ['Nova', t.bot],
                    ] as const
                  ).map(([name, role]) => (
                    <li key={name}>
                      <Avatar name={name} size={34} />
                      <span>
                        <strong>{name}</strong>
                        <small>{role}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : panel === 'models' ? (
              <ModelPicker t={t} plan={plan} onSelect={onSelect} />
            ) : panel === 'sessions' ? (
              <div className="preview-detail">
                <button
                  type="button"
                  className="preview-model-row"
                  ref={sessionRow}
                  onClick={() => {
                    setFromList(true);
                    setPanel('session');
                  }}
                >
                  <span>
                    <strong>{t.localSession}</strong>
                    <small>{t.complete} · 3/3</small>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <SessionDetail t={t} isTeam={isTeam} />
            )}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export function HeroPreview({ t }: { t: PreviewCopy }) {
  const [plan, setPlan] = useState<ModelPlan>({ main: 'deepseek', task: 'opencode' });
  const [posts, setPosts] = useState<TeamPost[]>([]);
  const workspace = {
    t,
    plan,
    onSelect: setPlan,
    posts,
    onPost: (post: TeamPost) => setPosts((previous) => [...previous, post]),
  };
  return (
    <div className="demo-stage demo-stage--hero hero-linked release-preview">
      <div className="app hero-desktop" role="group" aria-label={t.desktop}>
        <div className="app-titlebar">
          <span className="app-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Tobs · {t.badge}</span>
          <Laptop size={15} aria-hidden="true" />
        </div>
        <PreviewWorkspace {...workspace} />
      </div>
      <div className="hero-phone-wrap">
        <div className="app hero-linked-phone" role="group" aria-label={t.phone}>
          <div className="hero-phone-status" aria-hidden="true">
            <span>9:41</span>
            <span className="hero-phone-island" />
            <span className="hero-phone-system-icons">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryFull size={16} />
            </span>
          </div>
          <PreviewWorkspace phone {...workspace} />
          <span className="hero-phone-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
