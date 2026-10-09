import type { PixelSymbol } from '@botharness/pixel-avatar';
import {
  AlarmClock,
  ArrowUp,
  BellOff,
  ChevronRight,
  CirclePlus,
  Files,
  FolderLock,
  GitCommitVertical,
  MessagesSquare,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Puzzle,
  RotateCcw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { track } from '../analytics';
import type { Copy } from '../content';
import type { DemoChannel, DemoIcon, DemoStep, PanelSection } from '../demoCopy';
import { recipeFor } from '../mascot';
import { PixelAvatar, prefersReducedMotion, type PixelAvatarHandle } from './PixelAvatar';

const TOOL_MS = 1100;

const ICONS: Record<DemoIcon, LucideIcon> = {
  members: Users,
  sessions: MessagesSquare,
  files: Files,
  history: GitCommitVertical,
  schedules: AlarmClock,
  workspace: FolderLock,
  asleep: BellOff,
};

function Icon({ name }: { name: DemoIcon }) {
  const Svg = ICONS[name];
  return <Svg className="app-icon" size={16} strokeWidth={1.75} aria-hidden="true" />;
}

/** A message the visitor typed after the script finished, and the Bot's canned answer. */
type Extra = { kind: 'user'; text: string } | { kind: 'fallback'; bot: string };

type Answer = 'allow' | 'deny';

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

/** The sidebar as it looks after the first `shown` steps of the script. */
function panelAt(channel: DemoChannel, shown: number): PanelSection[] {
  const sections = channel.panel.map((section) => ({ ...section, items: [...section.items] }));
  for (const step of channel.steps.slice(0, shown)) {
    for (const patch of step.panel ?? []) {
      const section = sections.find((s) => s.id === patch.section);
      if (!section) continue;
      const at = section.items.findIndex((item) => item.id === patch.item.id);
      if (at === -1) section.items.unshift(patch.item);
      else section.items[at] = patch.item;
    }
  }
  return sections;
}

function Avatar({ name, size }: { name: string; size: number }) {
  const recipe = useMemo(() => recipeFor(name), [name]);
  return <PixelAvatar recipe={recipe} size={size} />;
}

/** A group's icon: its first three members, overlapping. */
function GroupAvatar({ bots, size }: { bots: string[]; size: number }) {
  return (
    <span className="app-group-avatar" style={{ width: size, height: size }} aria-hidden="true">
      {bots.slice(0, 3).map((bot) => (
        <Avatar key={bot} name={bot} size={Math.round(size * 0.6)} />
      ))}
    </span>
  );
}

/** The "working" row: the Bot's face turns into each tool it picks up. */
function Working({ bot, tool, label }: { bot: string; tool: PixelSymbol; label: string }) {
  const recipe = useMemo(() => recipeFor(bot), [bot]);
  const avatar = useRef<PixelAvatarHandle>(null);
  useEffect(() => {
    void avatar.current?.show(tool);
  }, [tool]);
  return (
    <li className="app-msg app-msg--bot app-working" aria-live="polite">
      <PixelAvatar ref={avatar} recipe={recipe} size={32} />
      <span className="app-working-label">
        {label}
        <span className="app-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
    </li>
  );
}

function Message({
  step,
  t,
  answer,
  waiting,
  onAnswer,
}: {
  step: DemoStep;
  t: Copy['demo'];
  answer?: Answer;
  waiting: boolean;
  onAnswer: (answer: Answer) => void;
}) {
  switch (step.kind) {
    case 'user':
      return (
        <li className="app-msg app-msg--user">
          <span className="app-msg-name">{t.human}</span>
          <p className="app-bubble">{step.text}</p>
        </li>
      );
    case 'bot':
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={32} />
          <div>
            <span className="app-msg-name">{step.bot}</span>
            <p className="app-bubble">{step.text}</p>
          </div>
        </li>
      );
    case 'checks':
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={32} />
          <div>
            <span className="app-msg-name">{step.bot}</span>
            <ul className="app-bubble app-checks">
              {step.rows.map((row) => (
                <li key={row.label}>
                  <span aria-hidden="true">✓ </span>
                  <strong>{row.label}</strong> → {row.detail}
                </li>
              ))}
            </ul>
          </div>
        </li>
      );
    case 'event':
      return (
        <li className="app-event">
          <Icon name={step.icon} />
          <span>
            {step.text}
            {step.strong ? <strong> {step.strong}</strong> : null}
          </span>
        </li>
      );
    case 'approval':
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={32} />
          <div className="app-approval" data-answer={answer}>
            <p className="app-approval-title">
              <ShieldCheck className="app-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
              {step.text}
            </p>
            <code>{step.detail}</code>
            {answer ? (
              <p className="app-approval-result">
                {answer === 'allow' ? `✓ ${t.allowed}` : t.denied}
              </p>
            ) : (
              <div className="app-approval-actions">
                <button
                  type="button"
                  className="app-btn app-btn--primary"
                  data-pulse={waiting ? '' : undefined}
                  onClick={() => onAnswer('allow')}
                >
                  {t.allow}
                </button>
                <button type="button" className="app-btn" onClick={() => onAnswer('deny')}>
                  {t.deny}
                </button>
                {waiting ? <span className="app-approval-hint">{t.waiting}</span> : null}
              </div>
            )}
          </div>
        </li>
      );
  }
}

/**
 * A simulated Bot mode window: a message list, the chat and the Channel sidebar. Each chat plays a
 * script once it scrolls into view; visitors switch chats, answer approvals and type messages.
 */
export function LiveDemo({ copy }: { copy: Copy }) {
  const t = copy.demo;
  const channels = t.channels;
  const root = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const answerWith = useRef<((answer: Answer) => void) | null>(null);
  // the visitor took over: stop moving on to the next chat by itself
  const touched = useRef(false);

  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [working, setWorking] = useState<{ bot: string; tool: PixelSymbol } | null>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [waiting, setWaiting] = useState(false);
  const [done, setDone] = useState(false);
  const [extra, setExtra] = useState<Extra[]>([]);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [panelOpen, setPanelOpen] = useState(true);
  // sidebar sections the visitor folded, by section id; they stay folded across chats
  const [folded, setFolded] = useState<Set<string>>(() => new Set());

  const channel = channels[active]!;
  const panel = useMemo(() => panelAt(channel, shown), [channel, shown]);

  // start playing when the window is mostly on screen, once
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver !== 'function') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // play the active chat's script
  useEffect(() => {
    if (!inView) return;
    const stop = new AbortController();
    const { signal } = stop;
    const instant = prefersReducedMotion();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        if (instant || signal.aborted) return resolve();
        const id = setTimeout(resolve, ms);
        signal.addEventListener('abort', () => {
          clearTimeout(id);
          resolve();
        });
      });

    setSeen((prev) => new Set(prev).add(channel.id));
    setShown(0);
    setAnswers({});
    setExtra([]);
    setDone(false);
    setWorking(null);
    setDraft('');

    void (async () => {
      await wait(500);
      for (let i = 0; i < channel.steps.length; i++) {
        const step = channel.steps[i]!;
        if (signal.aborted) return;
        if (step.kind === 'user') {
          // type it into the composer, then send
          setTyping(true);
          const per = Math.min(32, 1400 / step.text.length);
          for (let n = 1; n <= step.text.length && !signal.aborted; n++) {
            setDraft(step.text.slice(0, n));
            await wait(per);
          }
          await wait(350);
          setTyping(false);
          setDraft('');
          setShown(i + 1);
          await wait(700);
        } else if (step.kind === 'work') {
          for (const tool of step.tools) {
            if (signal.aborted) return;
            setWorking({ bot: step.bot, tool });
            await wait(TOOL_MS);
          }
          setWorking(null);
          setShown(i + 1);
        } else if (step.kind === 'approval') {
          setShown(i + 1);
          setWaiting(true);
          const answer = await new Promise<Answer>((resolve) => {
            answerWith.current = resolve;
            signal.addEventListener('abort', () => resolve('deny'));
          });
          answerWith.current = null;
          setWaiting(false);
          if (signal.aborted) return;
          setAnswers((prev) => ({ ...prev, [i]: answer }));
          if (answer === 'deny') break;
          await wait(600);
        } else {
          setShown(i + 1);
          await wait(step.kind === 'bot' ? 900 + step.text.length * 12 : 1100);
        }
      }
      if (signal.aborted) return;
      setDone(true);
      // with nobody at the controls, move on to the next chat like a carousel
      await wait(4500);
      if (!signal.aborted && !touched.current && !instant) {
        setActive((prev) => (prev + 1) % channels.length);
      }
    })();

    return () => {
      stop.abort();
      setTyping(false);
      setWaiting(false);
    };
  }, [inView, channel, channels.length, run]);

  // keep the newest message in view, inside the window only (never scroll the page)
  useEffect(() => {
    const el = feed.current;
    if (el)
      el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [shown, working, extra, answers, done]);

  const open = (index: number) => {
    touched.current = true;
    track('demo_channel_opened', { channel: channels[index]!.id });
    if (index === active) setRun((n) => n + 1);
    else setActive(index);
  };

  const answer = (value: Answer) => {
    touched.current = true;
    track('demo_approval_answered', { channel: channel.id, answer: value });
    answerWith.current?.(value);
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !done) return;
    touched.current = true;
    track('demo_message_sent', { channel: channel.id });
    setDraft('');
    const bot = channel.bots[0]!;
    setExtra((prev) => [...prev, { kind: 'user', text }]);
    setWorking({ bot, tool: 'thinking' });
    window.setTimeout(
      () => {
        setWorking(null);
        setExtra((prev) => [...prev, { kind: 'fallback', bot }]);
      },
      prefersReducedMotion() ? 0 : 1400,
    );
  };

  const steps = channel.steps.slice(0, shown);

  return (
    <div className="demo-stage demo-stage--hero" ref={root}>
      <div className="sky" aria-hidden="true">
        <span className="cloud cloud--a" />
        <span className="cloud cloud--b" />
        <span className="star-field" />
      </div>
      <div className="app" role="group" aria-label={t.windowLabel}>
        <div className="app-titlebar" aria-hidden="true">
          <span className="app-lights">
            <i />
            <i />
            <i />
          </span>
          <span>
            {t.app} · {t.botMode}
          </span>
        </div>
        <div className="app-body" data-panel={panelOpen ? undefined : 'closed'}>
          <nav className="app-side" aria-label={t.messages}>
            <p className="app-brand" aria-hidden="true">
              deepseek <span>HARNESS</span>
            </p>
            <span className="app-side-btn app-side-btn--new" aria-hidden="true">
              <CirclePlus className="app-icon" size={16} strokeWidth={1.75} />
              {t.newChat}
            </span>
            <span className="app-side-btn" aria-hidden="true">
              <Puzzle className="app-icon" size={16} strokeWidth={1.75} />
              {t.plugins}
            </span>
            <span className="app-side-btn app-side-btn--on" aria-hidden="true">
              <Avatar name="DeepSeekBot" size={22} />
              {t.botMode}
              <span className="app-count">{channels.length - seen.size || ''}</span>
            </span>
            <p className="app-side-head">
              <span>{t.messages}</span>
              <Plus className="app-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
            </p>
            <ul className="app-channels">
              {channels.map((c, index) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="app-channel"
                    aria-current={index === active ? 'true' : undefined}
                    onClick={() => open(index)}
                  >
                    {c.kind === 'group' ? (
                      <GroupAvatar bots={c.bots} size={36} />
                    ) : (
                      <Avatar name={c.bots[0]!} size={36} />
                    )}
                    <span className="app-channel-text">
                      <span className="app-channel-top">
                        <strong>{c.kind === 'group' ? `# ${c.title}` : c.title}</strong>
                        <time>{c.time}</time>
                      </span>
                      <span className="app-channel-preview">{c.preview}</span>
                    </span>
                    {seen.has(c.id) ? null : <span className="app-unread" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
            <p className="app-me" aria-hidden="true">
              <span className="app-me-badge">H</span>
              {t.human}
            </p>
          </nav>

          <section className="app-chat" aria-label={channel.title}>
            <header className="app-chat-head">
              <span className="app-pill">
                {channel.kind === 'group' ? (
                  <GroupAvatar bots={channel.bots} size={24} />
                ) : (
                  <Avatar name={channel.bots[0]!} size={24} />
                )}
                {channel.title}
              </span>
              <button
                type="button"
                className="app-icon-btn app-panel-toggle"
                aria-expanded={panelOpen}
                aria-label={panelOpen ? t.hideSidebar : t.showSidebar}
                title={panelOpen ? t.hideSidebar : t.showSidebar}
                onClick={() => {
                  touched.current = true;
                  setPanelOpen((open) => !open);
                }}
              >
                {panelOpen ? (
                  <PanelRightClose size={16} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <PanelRightOpen size={16} strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
            </header>
            <div className="app-feed" ref={feed}>
              <ol className="app-msgs">
                <li className="app-day">{t.today}</li>
                {steps.map((step, index) => (
                  <Message
                    key={`${channel.id}-${run}-${index}`}
                    step={step}
                    t={t}
                    answer={answers[index]}
                    waiting={waiting && index === shown - 1}
                    onAnswer={answer}
                  />
                ))}
                {extra.map((item, index) =>
                  item.kind === 'user' ? (
                    <li key={`x${index}`} className="app-msg app-msg--user">
                      <span className="app-msg-name">{t.human}</span>
                      <p className="app-bubble">{item.text}</p>
                    </li>
                  ) : (
                    <li key={`x${index}`} className="app-msg app-msg--bot">
                      <Avatar name={item.bot} size={32} />
                      <div>
                        <span className="app-msg-name">{item.bot}</span>
                        <p className="app-bubble">
                          {t.fallback} <a href="#install">{t.fallbackCta}</a>
                        </p>
                      </div>
                    </li>
                  ),
                )}
                {working ? (
                  <Working
                    bot={working.bot}
                    tool={working.tool}
                    label={fill(t.working, { bot: working.bot, tool: copy.symbols[working.tool] })}
                  />
                ) : null}
                {done && extra.length === 0 ? (
                  <li className="app-event app-event--replay">
                    <button type="button" className="app-btn" onClick={() => open(active)}>
                      <RotateCcw
                        className="app-icon"
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {t.replay}
                    </button>
                  </li>
                ) : null}
              </ol>
            </div>
            <form className="app-composer" onSubmit={send} data-typing={typing ? '' : undefined}>
              <Plus className="app-composer-plus" size={18} strokeWidth={1.75} aria-hidden="true" />
              <input
                value={draft}
                readOnly={!done}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={fill(t.composer, { name: channel.title })}
                aria-label={fill(t.composer, { name: channel.title })}
                maxLength={200}
              />
              <button type="submit" className="app-send" disabled={!done || !draft.trim()}>
                <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
                <span className="visually-hidden">{t.send}</span>
              </button>
            </form>
          </section>

          <aside className="app-panel" aria-label={t.sidebar} hidden={!panelOpen}>
            {panel.map((section) => {
              const open = !folded.has(section.id);
              return (
                <section key={section.id} className="app-panel-section">
                  <h4>
                    <button
                      type="button"
                      className="app-panel-head"
                      aria-expanded={open}
                      onClick={() => {
                        touched.current = true;
                        setFolded((prev) => {
                          const next = new Set(prev);
                          if (open) next.add(section.id);
                          else next.delete(section.id);
                          return next;
                        });
                      }}
                    >
                      <ChevronRight
                        className="app-chevron"
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <Icon name={section.icon} />
                      <span className="app-panel-title">{section.title}</span>
                      {section.items.length ? (
                        <span className="app-count">{section.items.length}</span>
                      ) : null}
                    </button>
                  </h4>
                  <ul hidden={!open}>
                    {section.items.map((item) => (
                      // keyed by its badge too, so a status change flashes the row
                      <li
                        key={`${item.id}-${item.badge ?? ''}`}
                        className="app-panel-item"
                        data-tone={item.tone}
                      >
                        {section.id === 'members' && item.id !== 'h' ? (
                          <Avatar name={item.title} size={22} />
                        ) : null}
                        <span className="app-panel-text">
                          <span>{item.title}</span>
                          {item.meta ? <small>{item.meta}</small> : null}
                        </span>
                        {item.badge ? <span className="app-badge">{item.badge}</span> : null}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </aside>
        </div>
      </div>
    </div>
  );
}
