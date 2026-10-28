import type { PixelSymbol } from '@botharness/pixel-avatar';
import {
  AlarmClock,
  ArrowUp,
  Bell,
  BellOff,
  BatteryFull,
  Check,
  ChevronRight,
  Ellipsis,
  Files,
  FolderLock,
  GitCommitVertical,
  Hash,
  House,
  Image,
  MessagesSquare,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  ScanLine,
  Settings,
  Signal,
  Wifi,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { track } from '../analytics';
import { HERO_COPY } from '../heroCopy';
import { PhonePair } from './FeatureDemos';
import { HeroPhoneChat } from './HeroPhoneChat';
import { HeroPhoneHome, HeroPhoneSource } from './HeroPhoneHome';
import { phoneChannel, phoneChannelKey, type PhoneHostId } from '../heroPhoneData';
import type { Copy } from '../content';
import type { DemoChannel, DemoIcon, DemoStep, PanelSection } from '../demoCopy';
import { DEEPSEEKBOT_RECIPE, recipeFor } from '../mascot';
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

/** Allow once, Always allow or Reject, like the desktop approval card. */
type Answer = 'allow' | 'always' | 'deny';

/** One status per row, as the desktop Channel list draws it. */
type RowStatus = 'working' | 'needs' | 'done' | undefined;

function StatusGlyph({ status, label }: { status: RowStatus; label?: string }) {
  if (!status) return null;
  if (status === 'done')
    return (
      <span className="app-status" data-status="done" title={label}>
        <Check size={12} strokeWidth={2.5} aria-hidden="true" />
      </span>
    );
  return <span className="app-status" data-status={status} title={label} aria-hidden="true" />;
}

/** Token usage bars for one range of the Home card; seeded, not measured. */
const usageBars = (count: number, seed: number) =>
  Array.from({ length: count }, (_, i) => 0.25 + (((i + 1) * 37 + seed * 53) % 70) / 100);
const RANGE_BARS = [6, 7, 4, 12];

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
  avatarSize = 32,
  outcomeLabels,
}: {
  step: DemoStep;
  t: Copy['demo'];
  answer?: Answer;
  waiting: boolean;
  onAnswer: (answer: Answer) => void;
  avatarSize?: number;
  outcomeLabels?: Record<Answer, string>;
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
          <Avatar name={step.bot} size={avatarSize} />
          <div>
            <span className="app-msg-name">{step.bot}</span>
            <p className="app-bubble">{step.text}</p>
          </div>
        </li>
      );
    case 'checks':
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={avatarSize} />
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
      if (answer && outcomeLabels)
        return (
          <li className="hero-phone-card-line" data-answer={answer} aria-live="polite">
            <span aria-hidden="true" />
            <p>
              {step.detail} · {outcomeLabels[answer]}
            </p>
          </li>
        );
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={avatarSize} />
          <div className="app-approval" data-answer={answer}>
            <p className="app-approval-kind">
              <span>{t.tool}</span>
              {answer ? null : (
                <span className="app-badge" data-tone="waiting">
                  {t.needsYou}
                </span>
              )}
            </p>
            <p className="app-approval-title">{step.text}</p>
            <code>{step.detail}</code>
            {answer ? (
              <p className="app-approval-result">
                {answer === 'allow'
                  ? `✓ ${t.allowed}`
                  : answer === 'always'
                    ? `✓ ${t.alwaysAllowed}`
                    : t.denied}
              </p>
            ) : (
              <div className="app-approval-actions">
                <button
                  type="button"
                  className="app-choice app-choice--primary"
                  data-pulse={waiting ? '' : undefined}
                  onClick={() => onAnswer('allow')}
                >
                  {t.allow}
                </button>
                <button type="button" className="app-choice" onClick={() => onAnswer('always')}>
                  {t.always}
                </button>
                <button
                  type="button"
                  className="app-choice app-choice--reject"
                  onClick={() => onAnswer('deny')}
                >
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
export function LiveDemo({ copy, linkedPhone = false }: { copy: Copy; linkedPhone?: boolean }) {
  const t = copy.demo;
  const lang = copy.htmlLang === 'en' ? 'en' : 'zh';
  const hero = HERO_COPY[lang];
  const [phoneHost, setPhoneHost] = useState<PhoneHostId>('studio');
  const channels = useMemo(
    () =>
      linkedPhone
        ? t.channels.map((channel, index) => phoneChannel(channel, index, phoneHost, hero))
        : t.channels,
    [t.channels, linkedPhone, phoneHost, hero],
  );
  const root = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLDivElement>(null);
  const phoneFeed = useRef<HTMLDivElement>(null);
  const answerWith = useRef<((answer: Answer) => void) | null>(null);
  const pairingWith = useRef<(() => void) | null>(null);
  const pendingReplies = useRef(new Set<number>());
  const startSynced = useRef(false);
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
  // the Control Rail's panels and views
  const [view, setView] = useState<'chat' | 'home'>('chat');
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(false);
  const [range, setRange] = useState(1);
  // sidebar sections the visitor folded, by section id; they stay folded across chats
  const [folded, setFolded] = useState<Set<string>>(() => new Set());
  const [phonePhase, setPhonePhase] = useState<'intro' | 'pair' | 'sync' | 'home' | 'activity'>(
    'intro',
  );
  const [isInteractive, setIsInteractive] = useState(false);
  const takeOver = () => {
    if (touched.current) return;
    touched.current = true;
    setIsInteractive(true);
  };

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
        if (instant || signal.aborted || ms === 0) return resolve();
        const id = setTimeout(resolve, linkedPhone && ms < 4000 ? Math.min(ms, 350) : ms);
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
    const alreadyPaired = linkedPhone && startSynced.current;
    setPhonePhase(alreadyPaired ? 'sync' : 'intro');

    void (async () => {
      let paired = alreadyPaired;
      await wait(500);
      for (let i = 0; i < channel.steps.length; i++) {
        const step = channel.steps[i]!;
        if (signal.aborted) return;
        if (step.kind === 'user') {
          // type it into the composer, then send
          setTyping(true);
          const per = linkedPhone ? 0 : Math.min(32, 1400 / step.text.length);
          for (let n = 1; n <= step.text.length && !signal.aborted; n++) {
            setDraft(step.text.slice(0, n));
            await wait(per);
          }
          await wait(350);
          if (signal.aborted) return;
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
          if (signal.aborted) return;
          setWorking(null);
          setShown(i + 1);
        } else if (step.kind === 'approval') {
          setShown(i + 1);
          setWaiting(true);
          const answer = await new Promise<Answer>((resolve) => {
            const finish = (value: Answer) => {
              window.clearTimeout(timer);
              signal.removeEventListener('abort', abort);
              resolve(value);
            };
            const abort = () => finish('deny');
            const timer =
              linkedPhone && !instant
                ? window.setTimeout(() => {
                    if (!touched.current) finish('allow');
                  }, 5500)
                : undefined;
            answerWith.current = finish;
            signal.addEventListener('abort', abort, { once: true });
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
          if (signal.aborted) return;
          if (linkedPhone && !paired && step.kind === 'bot') {
            setPhonePhase('pair');
            await new Promise<void>((resolve) => {
              const finish = () => {
                signal.removeEventListener('abort', finish);
                if (pairingWith.current === finish) pairingWith.current = null;
                resolve();
              };
              pairingWith.current = finish;
              signal.addEventListener('abort', finish, { once: true });
            });
            if (signal.aborted) return;
            paired = true;
            setPhonePhase('sync');
          }
        }
      }
      if (signal.aborted) return;
      setDone(true);
      // with nobody at the controls, move on to the next chat like a carousel
      await wait(4500);
      if (!signal.aborted && !touched.current && !instant) {
        if (linkedPhone) {
          setPhonePhase('home');
          await wait(4500);
          if (signal.aborted || touched.current) return;
          setPhonePhase('activity');
          await wait(8000);
          if (!signal.aborted && !touched.current) setRun((prev) => prev + 1);
        } else setActive((prev) => (prev + 1) % channels.length);
      }
    })();

    return () => {
      stop.abort();
      for (const timer of pendingReplies.current) window.clearTimeout(timer);
      pendingReplies.current.clear();
      setTyping(false);
      setWaiting(false);
    };
  }, [inView, channel, channels.length, run, linkedPhone]);

  // keep the newest message in view, inside the window only (never scroll the page)
  useEffect(() => {
    for (const el of [feed.current, phoneFeed.current])
      if (el)
        el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [shown, working, extra, answers, done, phonePhase]);

  const open = (index: number, synced = false, host: PhoneHostId = phoneHost) => {
    setPhoneHost(host);
    startSynced.current = synced;
    setShown(0);
    setAnswers({});
    setWaiting(false);
    answerWith.current = null;
    touched.current = true;
    track('demo:channel_open', {
      channel: linkedPhone ? phoneChannelKey(host, t.channels[index]!.id) : channels[index]!.id,
    });
    setView('chat');
    if (index === active) setRun((n) => n + 1);
    else setActive(index);
  };

  const answer = (value: Answer) => {
    const resolve = answerWith.current;
    if (!resolve) return;
    answerWith.current = null;
    touched.current = true;
    track('demo:approval_submit', {
      channel: channel.id,
      answer: value === 'deny' ? 'deny' : 'allow',
      scope: value === 'always' ? 'always' : 'once',
    });
    resolve(value);
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !done) return;
    touched.current = true;
    track('demo:message_send', { channel: channel.id });
    setDraft('');
    const bot = channel.bots[0]!;
    setExtra((prev) => [...prev, { kind: 'user', text }]);
    setWorking({ bot, tool: 'thinking' });
    const timer = window.setTimeout(
      () => {
        pendingReplies.current.delete(timer);
        setWorking(null);
        setExtra((prev) => [...prev, { kind: 'fallback', bot }]);
      },
      prefersReducedMotion() ? 0 : 1400,
    );
    pendingReplies.current.add(timer);
  };

  const steps = channel.steps.slice(0, shown);
  const latestApproval = steps.findLastIndex((step) => step.kind === 'approval');
  const approvalStep = steps[latestApproval];
  const sharedRequest =
    approvalStep?.kind === 'approval'
      ? {
          id: `${channel.id}:${run}:${latestApproval}`,
          host: phoneHost,
          bot: approvalStep.bot,
          command: approvalStep.detail,
          decision: answers[latestApproval],
          onDecide: answer,
        }
      : undefined;
  const renderStep = (step: DemoStep, index: number) => (
    <Message
      key={`${channel.id}-${run}-${index}`}
      step={step}
      t={t}
      answer={answers[index]}
      waiting={waiting && index === shown - 1}
      onAnswer={answer}
    />
  );
  const statusOf = (index: number): RowStatus => {
    if (index !== active) return seen.has(channels[index]!.id) ? 'done' : undefined;
    if (waiting) return 'needs';
    if (working || typing || !done) return inView ? 'working' : undefined;
    return 'done';
  };
  const unreadOf = (c: DemoChannel) =>
    c.steps.filter((step) => step.kind !== 'user' && step.kind !== 'event').length;
  const statusLabel = (status: RowStatus) =>
    status === 'working'
      ? t.tob.states.working
      : status === 'needs'
        ? t.needsYou
        : status === 'done'
          ? t.tob.states.idle
          : undefined;
  const bots = [...new Set(channels.flatMap((c) => c.bots))];
  const botState = (bot: string) => {
    if (waiting && channel.bots.includes(bot) && steps.at(-1)?.kind === 'approval') {
      const last = steps.at(-1);
      if (last && last.kind === 'approval' && last.bot === bot) return 'needs' as const;
    }
    if (working?.bot === bot) return 'working' as const;
    return 'idle' as const;
  };
  const needing = channels
    .map((c, index) => ({ c, index }))
    .filter(({ index }) => statusOf(index) === 'needs');
  const unseen = channels
    .map((c, index) => ({ c, index }))
    .filter(({ c, index }) => index !== active && !seen.has(c.id));
  const railButton = (
    id: string,
    label: string,
    Svg: LucideIcon,
    pressed: boolean,
    onClick: () => void,
    count?: number,
  ) => (
    <button
      type="button"
      className="app-rail-btn"
      data-rail={id}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={() => {
        takeOver();
        if (linkedPhone && phonePhase === 'pair') pairingWith.current?.();
        onClick();
      }}
    >
      <Svg size={18} strokeWidth={1.75} aria-hidden="true" />
      {count ? <span className="app-corner-count">{count}</span> : null}
    </button>
  );

  return (
    <div
      className={
        linkedPhone ? 'demo-stage demo-stage--hero hero-linked' : 'demo-stage demo-stage--hero'
      }
      ref={root}
      onFocusCapture={takeOver}
      onPointerDownCapture={takeOver}
      data-device={
        linkedPhone
          ? phonePhase === 'intro' || phonePhase === 'pair'
            ? 'desktop'
            : 'phone'
          : undefined
      }
      data-phase={linkedPhone ? phonePhase : undefined}
    >
      <div className="sky" aria-hidden="true">
        <span className="cloud cloud--a" />
        <span className="cloud cloud--b" />
        <span className="star-field" />
      </div>
      <div
        className={linkedPhone ? 'app hero-desktop' : 'app'}
        role="group"
        aria-label={t.windowLabel}
      >
        <div className="app-titlebar" aria-hidden="true">
          <span className="app-lights">
            <i />
            <i />
            <i />
          </span>
          <span>
            {linkedPhone ? (
              hero.interactive
            ) : (
              <>
                {t.app} · {t.botMode}
              </>
            )}
          </span>
        </div>
        <div
          className="app-body"
          data-panel={panelOpen ? undefined : 'closed'}
          data-wallpaper={wallpaper ? '' : undefined}
        >
          <nav className="app-rail" aria-label={t.rail}>
            <span className="app-rail-me" aria-hidden="true">
              <Avatar name="DeepSeekBot" size={26} />
            </span>
            {railButton('home', t.home, House, view === 'home', () =>
              setView((v) => (v === 'home' ? 'chat' : 'home')),
            )}
            {railButton(
              'activity',
              t.activity,
              Bell,
              activityOpen,
              () => setActivityOpen((v) => !v),
              needing.length + unseen.length,
            )}
            {railButton('channels', t.channelsPanel, Hash, channelsOpen, () =>
              setChannelsOpen((v) => !v),
            )}
            {railButton('messages', t.messages, MessagesSquare, view === 'chat', () =>
              setView('chat'),
            )}
            <span className="app-rail-gap" />
            {railButton('wallpaper', t.wallpaper, Image, wallpaper, () => setWallpaper((v) => !v))}
            <span className="app-rail-btn app-rail-btn--static" aria-hidden="true">
              <Settings size={18} strokeWidth={1.75} />
            </span>
          </nav>

          <section
            className="app-pane app-pane--channels"
            aria-label={t.channelsPanel}
            hidden={!channelsOpen}
          >
            <header className="app-pane-head" aria-hidden="true">
              <Hash className="app-icon" size={16} strokeWidth={1.75} />
              <span className="app-pane-title">{t.channelsPanel}</span>
              <Search className="app-icon" size={15} strokeWidth={1.75} />
              <Ellipsis className="app-icon" size={15} strokeWidth={1.75} />
              <Plus className="app-icon" size={15} strokeWidth={1.75} />
            </header>
            <ul className="app-channels">
              {channels.map((c, index) => {
                const status = statusOf(index);
                const unread = seen.has(c.id) ? 0 : unreadOf(c);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="app-channel"
                      aria-current={index === active && view === 'chat' ? 'true' : undefined}
                      data-status={status}
                      onClick={() => open(index)}
                    >
                      <span className="app-channel-avatar">
                        {c.kind === 'group' ? (
                          <GroupAvatar bots={c.bots} size={36} />
                        ) : (
                          <Avatar name={c.bots[0]!} size={36} />
                        )}
                        {unread ? (
                          <span className="app-corner-count" aria-hidden="true">
                            {unread}
                          </span>
                        ) : null}
                      </span>
                      <span className="app-channel-text">
                        <span className="app-channel-top">
                          <strong>{c.kind === 'group' ? `# ${c.title}` : c.title}</strong>
                          <time>{c.time}</time>
                        </span>
                        <span className="app-channel-line">
                          <span className="app-channel-preview">{c.preview}</span>
                          <StatusGlyph status={status} label={statusLabel(status)} />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className="app-pane app-chat"
            aria-label={view === 'home' ? t.home : channel.title}
            data-view={view}
          >
            <header className="app-pane-head app-chat-head">
              {view === 'home' ? (
                <>
                  <House className="app-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span className="app-pane-title">{t.home}</span>
                </>
              ) : (
                <>
                  <MessagesSquare
                    className="app-icon"
                    size={16}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="app-pane-title">{t.messages}</span>
                  <span className="app-pill">
                    {channel.kind === 'group' ? (
                      <GroupAvatar bots={channel.bots} size={22} />
                    ) : (
                      <Avatar name={channel.bots[0]!} size={22} />
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
                </>
              )}
            </header>
            {linkedPhone && phonePhase === 'pair' ? (
              <div className="hero-desktop-pair">
                <PhonePair
                  t={{
                    ...copy.featureDemos.mobile,
                    pair: { ...copy.featureDemos.mobile.pair, title: hero.pairTitle },
                  }}
                  autoPlay={!isInteractive}
                  onNext={() => pairingWith.current?.()}
                />
              </div>
            ) : view === 'home' ? (
              <div className="app-home">
                <p className="app-home-hello">
                  <PixelAvatar recipe={DEEPSEEKBOT_RECIPE} size={40} />
                  <strong>{t.tob.greeting}</strong>
                </p>
                <p className="app-home-lead">{t.tob.description}</p>
                <p className="app-composer app-home-input" aria-hidden="true">
                  <Paperclip className="app-composer-plus" size={16} strokeWidth={1.75} />
                  <span>{t.tob.input}</span>
                  <span className="app-send" data-off="">
                    <ArrowUp size={16} strokeWidth={2} />
                  </span>
                </p>
                <ul className="app-home-starters" aria-label={t.tob.name}>
                  {t.tob.starters.map((starter) => (
                    <li key={starter}>{starter}</li>
                  ))}
                </ul>
                <div className="app-home-cards">
                  <section className="app-home-card" aria-label={t.tob.usage}>
                    <p className="app-home-card-head">
                      <strong>{t.tob.usage}</strong>
                      <span className="app-segment" role="group" aria-label={t.tob.usage}>
                        {t.tob.ranges.map((label, index) => (
                          <button
                            key={label}
                            type="button"
                            aria-pressed={range === index}
                            onClick={() => setRange(index)}
                          >
                            {label}
                          </button>
                        ))}
                      </span>
                    </p>
                    <div
                      className="app-bars"
                      role="img"
                      aria-label={`${t.tob.usage} · ${t.tob.ranges[range]}`}
                    >
                      {usageBars(RANGE_BARS[range]!, range).map((h, index) => (
                        <i
                          key={`${range}-${index}`}
                          style={{ height: `${Math.round(h * 100)}%` }}
                        />
                      ))}
                    </div>
                  </section>
                  <section className="app-home-card" aria-label={t.tob.botActivity}>
                    <p className="app-home-card-head">
                      <strong>{t.tob.botActivity}</strong>
                    </p>
                    <ul className="app-home-bots">
                      {bots.map((bot) => {
                        const state = botState(bot);
                        const time =
                          (
                            channels.find((c) => c.kind === 'dm' && c.bots[0] === bot) ??
                            channels.find((c) => c.bots.includes(bot))
                          )?.time ?? '';
                        return (
                          <li key={bot} data-state={state}>
                            <Avatar name={bot} size={28} />
                            <span>
                              <strong>{bot}</strong>
                              <small>
                                {t.tob.states[state]} · {time}
                              </small>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              </div>
            ) : (
              <>
                <div className="app-feed" ref={feed}>
                  <ol className="app-msgs">
                    <li className="app-day">{t.today}</li>
                    {steps.map(renderStep)}
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
                        label={fill(t.working, {
                          bot: working.bot,
                          tool: copy.symbols[working.tool],
                        })}
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
                <form
                  className="app-composer"
                  onSubmit={send}
                  data-typing={typing ? '' : undefined}
                >
                  <Plus
                    className="app-composer-plus"
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
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
              </>
            )}
          </section>

          <div className="app-stack" hidden={!activityOpen && !panelOpen}>
            <section
              className="app-pane app-activity"
              aria-label={t.activity}
              hidden={!activityOpen}
            >
              <header className="app-pane-head">
                <Bell className="app-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
                <span className="app-pane-title">{t.activity}</span>
              </header>
              {needing.length + unseen.length === 0 ? (
                <p className="app-activity-empty">{t.nothingWaiting}</p>
              ) : (
                <ul className="app-activity-list">
                  {[
                    ...needing.map((row) => ({ ...row, tag: t.needsYou, tone: 'waiting' })),
                    ...unseen.map((row) => ({ ...row, tag: t.unread, tone: 'info' })),
                  ].map(({ c, index, tag, tone }) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => open(index)}>
                        <span className="app-badge" data-tone={tone}>
                          {tag}
                        </span>
                        <strong>{c.kind === 'group' ? `# ${c.title}` : c.title}</strong>
                        <small>{c.preview}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <aside className="app-pane app-panel" aria-label={t.sidebar} hidden={!panelOpen}>
              <header className="app-pane-head" aria-hidden="true">
                <Users className="app-icon" size={16} strokeWidth={1.75} />
                <span className="app-pane-title">{t.sidebar}</span>
              </header>
              <div className="app-panel-body">
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
              </div>
            </aside>
          </div>
        </div>
      </div>
      {linkedPhone ? (
        <div className="hero-phone-wrap">
          <div
            className="hero-linked-phone app"
            role="group"
            aria-label={`${hero.interactive} · ${hero.phone} · ${hero.synced}`}
          >
            <div className="hero-phone-status" aria-hidden="true">
              <span>9:41</span>
              <span className="hero-phone-island" />
              <span className="hero-phone-system-icons">
                <Signal size={12} />
                <Wifi size={12} />
                <BatteryFull size={16} />
              </span>
            </div>
            <div
              className="hero-phone-scene"
              key={phonePhase === 'intro' || phonePhase === 'pair' ? phonePhase : 'app'}
            >
              {phonePhase === 'intro' ? (
                <div className="hero-phone-intro">
                  <Avatar name="DeepSeekBot" size={88} />
                  <strong>Tobs</strong>
                </div>
              ) : phonePhase === 'pair' ? (
                <div className="hero-phone-intro">
                  <ScanLine size={112} strokeWidth={1.2} aria-hidden="true" />
                  <strong>{hero.scanTitle}</strong>
                </div>
              ) : (
                <HeroPhoneHome
                  lang={lang}
                  autoScreen={
                    phonePhase === 'home'
                      ? 'chats'
                      : phonePhase === 'activity'
                        ? 'activity'
                        : 'chat'
                  }
                  autoPlay={!isInteractive}
                  sharedRequest={sharedRequest}
                  onOpenChannel={(index, host) => open(index, true, host)}
                  renderAvatar={(name, size) => <Avatar name={name} size={size} />}
                  renderChat={(onBack) => (
                    <HeroPhoneChat
                      onBack={onBack}
                      source={<HeroPhoneSource host={phoneHost} />}
                      title={channel.title}
                      group={channel.bots.length > 1}
                      avatar={
                        channel.bots.length > 1 ? (
                          <GroupAvatar bots={channel.bots} size={28} />
                        ) : (
                          <Avatar name={channel.bots[0]!} size={28} />
                        )
                      }
                      feedRef={phoneFeed}
                      value={draft}
                      onChange={setDraft}
                      onSubmit={send}
                      ready={done}
                      labels={{
                        back: hero.back,
                        composer: fill(t.composer, {
                          name: `${channel.bots.length > 1 ? '#' : ''}${channel.title}`,
                        }),
                        send: t.send,
                      }}
                    >
                      {steps.map((step, index) => (
                        <Message
                          key={`${channel.id}-${run}-${index}`}
                          step={step}
                          t={t}
                          answer={answers[index]}
                          waiting={waiting && index === shown - 1}
                          onAnswer={answer}
                          avatarSize={22}
                          outcomeLabels={{
                            allow: hero.approved,
                            always: hero.alwaysApproved,
                            deny: hero.rejected,
                          }}
                        />
                      ))}
                      {extra.map((item, index) => (
                        <li
                          className={
                            item.kind === 'user' ? 'app-msg app-msg--user' : 'app-msg app-msg--bot'
                          }
                          key={`extra-${index}`}
                        >
                          {item.kind === 'user' ? (
                            <p className="app-bubble">{item.text}</p>
                          ) : (
                            <>
                              <Avatar name={item.bot} size={22} />
                              <div>
                                <span className="app-msg-name">{item.bot}</span>
                                <p className="app-bubble">{t.fallback}</p>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                      {working ? (
                        <Working
                          bot={working.bot}
                          tool={working.tool}
                          label={fill(t.working, {
                            bot: working.bot,
                            tool: copy.symbols[working.tool],
                          })}
                        />
                      ) : null}
                    </HeroPhoneChat>
                  )}
                />
              )}
            </div>
            <span className="hero-phone-home" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
