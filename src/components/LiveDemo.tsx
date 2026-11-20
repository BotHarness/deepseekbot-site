import type { PixelSymbol } from '@botharness/pixel-avatar';
import {
  AlarmClock,
  ArrowUp,
  Bell,
  BellRing,
  BatteryFull,
  Brain,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  File,
  FolderKey,
  GitBranch,
  Hash,
  MessagesCircle,
  Monitor,
  PanelRight,
  Plus,
  RotateCcw,
  ScanLine,
  Server,
  Signal,
  TextQuote,
  Wifi,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { track } from '../analytics';
import { HERO_COPY } from '../heroCopy';
import { PREVIEW_COPY } from '../previewCopy';
import {
  DEFAULT_PREVIEW_MODELS,
  PreviewMemoryReader,
  PreviewModelDialog,
  PreviewSessionDetail,
  previewModel,
  type ModelPlan,
} from './HeroPreviewPanels';
import { PhonePair } from './FeatureDemos';
import { HeroPhoneChat } from './HeroPhoneChat';
import { HeroPhoneHome, HeroPhoneSource } from './HeroPhoneHome';
import { HeroPhoneProfile, type PhoneProfilePage, type PhoneProfileTab } from './HeroPhoneProfile';
import { HeroPhoneProfileContent, type PhoneProfileViews } from './HeroPhoneProfileContent';
import { MarketplaceIcon } from './MarketplaceIcon';
import { MemoryMarkdownIcon } from './MemoryMarkdownIcon';
import { PreviewModelIcon } from './PreviewModelIcon';
import {
  HERO_CONVERSATIONS,
  PHONE_HOSTS,
  phoneChannel,
  phoneChannelKey,
  type PhoneHostId,
} from '../heroPhoneData';
import { marketHref } from '../marketRoutes';
import { guidePath } from '../site';
import type { Copy } from '../content';
import { demoMemoryEntry, type DemoMemoryEntry } from '../demoMemory';
import type { DemoChannel, DemoIcon, DemoStep, PanelItem, PanelSection } from '../demoCopy';
import { recipeFor } from '../mascot';
import { PixelAvatar, prefersReducedMotion, type PixelAvatarHandle } from './PixelAvatar';

const TOOL_MS = 1100;
const MIN_SUBPANEL_HEIGHT = 120;
const MAX_SUBPANEL_HEIGHT = 640;
const MIN_SUBPANEL_WIDTH = 20;

const ICONS: Record<DemoIcon, LucideIcon> = {
  members: Users,
  sessions: TextQuote,
  files: Brain,
  'channel-files': File,
  history: GitBranch,
  schedules: AlarmClock,
  workspace: FolderKey,
  asleep: BellRing,
};

function Icon({ name }: { name: DemoIcon }) {
  const Svg = ICONS[name];
  return <Svg className="app-icon" size={16} aria-hidden="true" />;
}

/** A message the visitor typed after the script finished, and the Bot's canned answer. */
type Extra = { kind: 'user'; text: string; author?: string } | { kind: 'fallback'; bot: string };
type PreviewKind = 'models' | 'session' | 'members';
type PreviewSurface = 'desktop' | 'phone';
type SessionConversation = { draft: string; messages: string[] };
const EMPTY_SESSION_CONVERSATION: SessionConversation = { draft: '', messages: [] };
type PhoneProfileDetail =
  | { kind: 'session' }
  | { kind: 'routine'; item: PanelItem }
  | { kind: 'document'; entry: DemoMemoryEntry };
type PreviewPanel =
  | { kind: PreviewKind; surface: PreviewSurface }
  | { kind: 'profile'; surface: 'phone'; page: PhoneProfilePage }
  | { kind: 'profile-detail'; surface: 'phone'; detail: PhoneProfileDetail; opener: string }
  | { kind: 'memory'; surface: 'desktop'; entry: DemoMemoryEntry };
type SidePanel = 'notifications' | 'channels' | 'chats' | 'marketplace' | 'environment';
type HostScope = PhoneHostId | 'all';
const TEAM_MEMBER = { desktop: 'Mei', phone: 'Jun' } as const;

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

/** Static member stack for a channel without a custom icon. */
function GroupAvatar({ bots, size }: { bots: string[]; size: number }) {
  const faces = bots.slice(0, 3);
  const faceSize = Math.round(size * ([0.64, 0.6, 0.43][faces.length - 1] ?? 0.43));
  return (
    <span
      className="app-group-avatar"
      data-count={faces.length}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {faces.map((bot) => (
        <Avatar key={bot} name={bot} size={faceSize} />
      ))}
    </span>
  );
}

function WorkingAvatar({ bot, tool, size }: { bot: string; tool: PixelSymbol; size: number }) {
  const recipe = useMemo(() => recipeFor(bot), [bot]);
  const avatar = useRef<PixelAvatarHandle>(null);
  useEffect(() => {
    void avatar.current?.show(tool);
  }, [tool]);
  return <PixelAvatar ref={avatar} recipe={recipe} size={size} />;
}

const TOOL_ACTIVITY: Partial<Record<PixelSymbol, keyof Copy['demo']['activity']>> = {
  thinking: 'thinking',
  web: 'searching',
  fetch: 'searching',
  search: 'searching',
  read: 'coding',
  write: 'coding',
  edit: 'coding',
  bash: 'executing',
};

function HumanMessage({
  text,
  name,
  author,
  isPeer,
  avatarSize,
}: {
  text: string;
  name: string;
  author?: string;
  isPeer?: boolean;
  avatarSize: number;
}) {
  if (isPeer && author) {
    return (
      <li className="app-msg app-msg--bot">
        <Avatar name={author} size={avatarSize} />
        <div>
          <span className="app-msg-name">{author}</span>
          <p className="app-bubble">{text}</p>
        </div>
      </li>
    );
  }
  return (
    <li className="app-msg app-msg--user" data-member={author ? '' : undefined}>
      <span className="app-msg-name">{author ?? name}</span>
      <p className="app-bubble">{text}</p>
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
  author,
  isPeer,
  sessionLink,
}: {
  step: DemoStep;
  t: Copy['demo'];
  answer?: Answer;
  waiting: boolean;
  onAnswer: (answer: Answer) => void;
  avatarSize?: number;
  outcomeLabels?: Record<Answer, string>;
  author?: string;
  isPeer?: boolean;
  sessionLink?: ReactNode;
}) {
  switch (step.kind) {
    case 'user':
      return (
        <HumanMessage
          text={step.text}
          name={t.human}
          author={author}
          isPeer={isPeer}
          avatarSize={avatarSize}
        />
      );
    case 'bot':
      return (
        <li className="app-msg app-msg--bot">
          <Avatar name={step.bot} size={avatarSize} />
          <div>
            <span className="app-msg-name">{step.bot}</span>
            <p className="app-bubble">{step.text}</p>
            {sessionLink}
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
  const preview = PREVIEW_COPY[lang];
  const [modelPlans, setModelPlans] = useState<Record<string, ModelPlan>>({});
  const [botProfileTab, setBotProfileTab] = useState<PhoneProfileTab>('work');
  const [groupProfileTab, setGroupProfileTab] = useState<PhoneProfileTab>('members');
  const [profileViews, setProfileViews] = useState<PhoneProfileViews>({
    changes: false,
    media: false,
  });
  const [sessionConversations, setSessionConversations] = useState<
    Record<string, SessionConversation>
  >({});
  const [previewPanel, setPreviewPanel] = useState<PreviewPanel>();
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const previewClose = useRef<HTMLButtonElement>(null);
  const profileReturnFocus = useRef<string | undefined>(undefined);
  const subpanelToggle = useRef<HTMLButtonElement>(null);
  const chatScrollBeforeMemory = useRef<number | undefined>(undefined);
  const restorePreviewFocus = useRef(false);
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
  const [panelOpen, setPanelOpen] = useState(false);
  const [columnWidth, setColumnWidth] = useState(34);
  const [sessionWidth, setSessionWidth] = useState(40);
  const [panelHeights, setPanelHeights] = useState<Record<string, number>>({});
  const panelResizeStart = useRef<{ y: number; height: number }>(null);
  const subpanelId = useId();
  const sidePanelId = useId();
  const [sidePanel, setSidePanel] = useState<SidePanel>('channels');
  const [hostScope, setHostScope] = useState<HostScope>('all');
  const [addingRemote, setAddingRemote] = useState(false);
  const [expandedSubpanels, setExpandedSubpanels] = useState<Set<string>>(
    () => new Set(['sessions']),
  );
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
  const channelRows = useMemo(
    () =>
      linkedPhone
        ? HERO_CONVERSATIONS.map(({ host, index, preview }) => ({
            host,
            index,
            channel: {
              ...phoneChannel(t.channels[index]!, index, host, hero),
              preview: hero[preview],
            },
          }))
        : t.channels.map((channel, index) => ({ host: 'studio' as const, index, channel })),
    [hero, linkedPhone, t.channels],
  );
  const scopedRows = channelRows.filter((row) => hostScope === 'all' || row.host === hostScope);
  const isTeam = linkedPhone && phoneHost === 'studio' && active === 0;
  const isPreviewBot = linkedPhone && phoneHost === 'research' && active === 2;
  const memoryReader = previewPanel?.kind === 'memory' ? previewPanel.entry : undefined;
  const hasDesktopMembers = previewPanel?.kind === 'members' && previewPanel.surface === 'desktop';
  const hasDesktopSession = previewPanel?.kind === 'session' && previewPanel.surface === 'desktop';
  const maxColumnWidth = hasDesktopSession ? 40 : 60;
  const visibleColumnWidth = Math.min(columnWidth, maxColumnWidth);
  const maxSessionWidth = panelOpen ? Math.min(60, 75 - visibleColumnWidth) : 60;
  const visibleSessionWidth = Math.min(sessionWidth, maxSessionWidth);
  const sessionTitle = isTeam ? preview.session : preview.localSession;
  const sessionConversation = sessionConversations[channel.id] ?? EMPTY_SESSION_CONVERSATION;
  const modelPlan = modelPlans[channel.id] ?? DEFAULT_PREVIEW_MODELS;
  const model = previewModel(modelPlan.main);
  const panel = useMemo(() => {
    const sections = panelAt(channel, shown);
    const sessions = sections.find((section) => section.id === 'sessions');
    return sessions ? [sessions, ...sections.filter((section) => section !== sessions)] : sections;
  }, [channel, shown]);

  const hasPreference = panel.some(
    (section) => section.id === 'commits' && section.items.some((item) => item.id === 'c2'),
  );
  function memoryEntry(section: string, item: PanelItem) {
    return demoMemoryEntry(
      lang,
      phoneHost,
      section,
      item,
      hasPreference,
      copy.featureDemos.memory.commits,
    );
  }

  function resizeSubpanel(id: string, height: number) {
    setPanelHeights((previous) => ({
      ...previous,
      [id]: Math.round(Math.min(MAX_SUBPANEL_HEIGHT, Math.max(MIN_SUBPANEL_HEIGHT, height))),
    }));
  }

  function resizeSubpanelColumn(width: number) {
    setColumnWidth(Math.round(Math.min(maxColumnWidth, Math.max(MIN_SUBPANEL_WIDTH, width))));
  }

  function resizeSession(width: number) {
    setSessionWidth(Math.round(Math.min(maxSessionWidth, Math.max(MIN_SUBPANEL_WIDTH, width))));
  }

  function changeSessionDraft(draft: string) {
    setSessionConversations((current) => ({
      ...current,
      [channel.id]: { ...(current[channel.id] ?? EMPTY_SESSION_CONVERSATION), draft },
    }));
  }

  function sendSessionMessage() {
    setSessionConversations((current) => {
      const conversation = current[channel.id];
      const text = conversation?.draft.trim();
      if (!conversation || !text) return current;
      return {
        ...current,
        [channel.id]: { draft: '', messages: [...conversation.messages, text] },
      };
    });
  }

  function saveModelPlan(next: ModelPlan) {
    setModelPlans((current) => ({ ...current, [channel.id]: next }));
  }

  useLayoutEffect(() => {
    if (previewPanel) {
      const restore = profileReturnFocus.current;
      profileReturnFocus.current = undefined;
      const row = restore
        ? previewClose.current
            ?.closest('.hero-phone-profile')
            ?.querySelectorAll<HTMLButtonElement>('[data-profile-focus]')
        : undefined;
      const target = row
        ? [...row].find((button) => button.dataset.profileFocus === restore)
        : undefined;
      (target ?? previewClose.current)?.focus({ preventScroll: true });
    } else if (restorePreviewFocus.current) {
      restorePreviewFocus.current = false;
      const trigger = previewTrigger.current;
      (trigger?.getClientRects().length ? trigger : subpanelToggle.current)?.focus({
        preventScroll: true,
      });
    }
    if (!memoryReader && chatScrollBeforeMemory.current !== undefined && feed.current) {
      feed.current.scrollTop = chatScrollBeforeMemory.current;
      chatScrollBeforeMemory.current = undefined;
    }
  }, [memoryReader, previewPanel]);

  function showMemory(entry: DemoMemoryEntry, trigger: HTMLButtonElement) {
    if (!memoryReader) chatScrollBeforeMemory.current = feed.current?.scrollTop;
    previewTrigger.current = trigger;
    setPreviewPanel({ kind: 'memory', surface: 'desktop', entry });
  }

  function showPreview(kind: PreviewKind, surface: PreviewSurface, trigger: HTMLButtonElement) {
    if (previewPanel?.kind === kind && previewPanel.surface === surface) {
      closePreview();
      return;
    }
    previewTrigger.current = trigger;
    setPreviewPanel({ kind, surface });
  }

  function closePreview() {
    restorePreviewFocus.current = true;
    setPreviewPanel(undefined);
  }

  function openPhoneProfile(trigger: HTMLButtonElement) {
    previewTrigger.current = trigger;
    setPreviewPanel({ kind: 'profile', surface: 'phone', page: 'profile' });
  }

  function phoneProfilePage(page: PhoneProfilePage) {
    setPreviewPanel({ kind: 'profile', surface: 'phone', page });
  }

  function backFromPhoneProfile(page: PhoneProfilePage) {
    if (page === 'profile') {
      closePreview();
    } else {
      profileReturnFocus.current = page;
      phoneProfilePage(page === 'models' ? 'profile' : 'models');
    }
  }

  function openPhoneProfileDetail(section: string, item: PanelItem) {
    const entry = memoryEntry(section, item);
    const detail: PhoneProfileDetail | undefined = entry
      ? { kind: 'document', entry }
      : section === 'schedules'
        ? { kind: 'routine', item }
        : section === 'sessions' && item.id === 'linked-session'
          ? { kind: 'session' }
          : undefined;
    if (detail)
      setPreviewPanel({ kind: 'profile-detail', surface: 'phone', detail, opener: item.id });
  }

  function closePhoneProfileDetail(opener: string) {
    profileReturnFocus.current = opener;
    phoneProfilePage('profile');
  }

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
      if (el?.getClientRects().length)
        el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [shown, extra, answers, done, phonePhase]);

  const open = (
    index: number,
    synced = phonePhase !== 'intro' && phonePhase !== 'pair',
    host: PhoneHostId = index === 0 ? 'studio' : index === 2 ? 'research' : phoneHost,
  ) => {
    chatScrollBeforeMemory.current = undefined;
    setPreviewPanel(undefined);
    setPhoneHost(host);
    startSynced.current = synced;
    setShown(0);
    setWorking(null);
    setAnswers({});
    setWaiting(false);
    answerWith.current = null;
    touched.current = true;
    track('demo:channel_open', {
      channel: linkedPhone ? phoneChannelKey(host, t.channels[index]!.id) : channels[index]!.id,
    });
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

  const send = (event: FormEvent, surface: PreviewSurface) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !done) return;
    touched.current = true;
    track('demo:message_send', { channel: channel.id });
    setDraft('');
    const author = isTeam ? TEAM_MEMBER[surface] : undefined;
    setExtra((prev) => [...prev, { kind: 'user', text, author }]);
    if (isTeam) return;
    const bot = channel.bots[0]!;
    setWorking({ bot, tool: 'thinking' });
    const timer = window.setTimeout(
      () => {
        pendingReplies.current.delete(timer);
        if (pendingReplies.current.size === 0) setWorking(null);
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
  const sessionMessage = isPreviewBot
    ? channel.steps.findLastIndex((step) => step.kind === 'bot')
    : 2;
  const sessionAvailable =
    (isTeam || isPreviewBot) && sessionMessage >= 0 && shown > sessionMessage;
  // Studio and Research PC keep their original timelines. Attach each Session to its own message.
  const sessionLink = (surface: PreviewSurface) => (
    <button
      type="button"
      className="app-btn preview-session-link"
      aria-expanded={previewPanel?.surface === surface && previewPanel.kind === 'session'}
      onClick={(event) => showPreview('session', surface, event.currentTarget)}
    >
      <TextQuote size={14} aria-hidden="true" />
      {sessionTitle}
    </button>
  );
  const modelTrigger = (
    <button
      type="button"
      className="preview-model-trigger"
      aria-label={preview.modelPicker + ' · ' + model.name}
      aria-haspopup="dialog"
      aria-expanded={previewPanel?.surface === 'desktop' && previewPanel.kind === 'models'}
      title={`${model.name} · ${model.provider} · ${model.source === 'api' ? preview.api : preview.plans[model.id]}`}
      onClick={(event) => showPreview('models', 'desktop', event.currentTarget)}
    >
      <PreviewModelIcon brand={model.brand} subscription={model.source === 'subscription'} />
      <span className="preview-model-trigger-name">{model.name}</span>
      <ChevronDown size={12} aria-hidden="true" />
    </button>
  );
  const teamMembers = [
    { name: 'Mei', role: preview.owner },
    { name: 'Lea', role: preview.admin },
    { name: 'Jun', role: preview.member },
  ];
  const teamRoster = (
    <>
      {teamMembers.map(({ name, role }) => (
        <li className="app-panel-item" key={name}>
          <Avatar name={name} size={22} />
          <span className="app-panel-text">
            <span>{name}</span>
            <small>{role}</small>
          </span>
        </li>
      ))}
    </>
  );
  const profileMembers = (
    <>
      <p className="preview-hint">{preview.teamScope}</p>
      <ul className="preview-list">
        {teamRoster}
        {channel.bots.map((bot) => (
          <li className="app-panel-item" key={bot}>
            <Avatar name={bot} size={22} />
            {bot}
          </li>
        ))}
      </ul>
    </>
  );
  const renderPreview = (surface: PreviewSurface) => {
    if (previewPanel?.surface !== surface || previewPanel.kind === 'memory') return null;
    if (previewPanel.kind === 'profile-detail') {
      const { detail, opener } = previewPanel;
      const back = () => closePhoneProfileDetail(opener);
      if (detail.kind === 'document') {
        return (
          <div className="app-pane preview-panel">
            <PreviewMemoryReader
              t={preview}
              entry={detail.entry}
              backRef={previewClose}
              backLabel={preview.back}
              onBack={back}
            />
          </div>
        );
      }
      const title = detail.kind === 'session' ? sessionTitle : detail.item.title;
      return (
        <section className="app-pane preview-panel" data-kind={detail.kind} aria-label={title}>
          <header className="app-pane-head preview-panel-head">
            <button
              ref={previewClose}
              type="button"
              className="app-icon-btn"
              aria-label={preview.back}
              onClick={back}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <strong className="app-pane-title">{title}</strong>
          </header>
          {detail.kind === 'session' ? (
            <PreviewSessionDetail
              t={preview}
              isTeam={isTeam}
              messages={sessionConversation.messages}
            />
          ) : (
            <div className="hero-phone-routine-detail">
              <strong>{preview.phoneProfile.schedule}</strong>
              <p>{detail.item.badge}</p>
              <p className="preview-hint">{detail.item.meta}</p>
            </div>
          )}
        </section>
      );
    }
    if (previewPanel.kind === 'profile') {
      const { page } = previewPanel;
      const group = channel.kind === 'group';
      const tab = group ? groupProfileTab : botProfileTab;
      return (
        <HeroPhoneProfile
          t={preview}
          title={channel.title}
          avatar={
            group ? (
              <GroupAvatar bots={channel.bots} size={60} />
            ) : (
              <Avatar name={channel.bots[0]!} size={60} />
            )
          }
          group={group}
          tab={tab}
          onTab={group ? setGroupProfileTab : setBotProfileTab}
          page={page}
          plan={modelPlan}
          onPage={phoneProfilePage}
          onSelect={(next) => {
            saveModelPlan(next);
            backFromPhoneProfile(page);
          }}
          onBack={() => backFromPhoneProfile(page)}
          backRef={previewClose}
          members={group ? profileMembers : undefined}
          content={
            <HeroPhoneProfileContent
              t={preview}
              tab={tab}
              panel={panel}
              status={workingSummary ?? (waiting ? t.needsYou : t.states.idle)}
              session={sessionAvailable ? sessionTitle : undefined}
              views={profileViews}
              onViews={setProfileViews}
              onOpen={openPhoneProfileDetail}
            />
          }
        />
      );
    }
    const kind = previewPanel.kind;
    const title =
      kind === 'session' ? sessionTitle : kind === 'models' ? preview.modelPicker : preview.members;
    const Panel = surface === 'desktop' && kind === 'session' ? 'aside' : 'section';
    return (
      <Panel
        className="app-pane preview-panel"
        data-kind={kind}
        data-surface={surface}
        role={kind === 'models' ? 'dialog' : 'region'}
        aria-label={title}
        style={Panel === 'aside' ? { width: `${visibleSessionWidth}%` } : undefined}
      >
        <header className="app-pane-head preview-panel-head">
          {surface === 'phone' ? (
            <button
              ref={previewClose}
              type="button"
              className="app-icon-btn"
              aria-label={preview.back}
              onClick={closePreview}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          ) : null}
          <strong className="app-pane-title">{title}</strong>
          {surface === 'desktop' ? (
            <button
              ref={previewClose}
              type="button"
              className="app-icon-btn"
              aria-label={preview.close}
              onClick={closePreview}
            >
              <X size={17} aria-hidden="true" />
            </button>
          ) : null}
        </header>
        {kind === 'models' ? (
          <PreviewModelDialog
            t={preview}
            plan={modelPlan}
            allowSubscriptions={phoneHost === 'research'}
            onCancel={closePreview}
            onSave={(next) => {
              saveModelPlan(next);
              closePreview();
            }}
          />
        ) : kind === 'session' ? (
          <PreviewSessionDetail
            t={preview}
            isTeam={isTeam}
            messages={sessionConversation.messages}
            composer={
              surface === 'desktop'
                ? {
                    draft: sessionConversation.draft,
                    sendLabel: t.send,
                    onChange: changeSessionDraft,
                    onSend: sendSessionMessage,
                  }
                : undefined
            }
          />
        ) : (
          <div className="app-panel-body">{profileMembers}</div>
        )}
      </Panel>
    );
  };
  const renderSteps = (surface: PreviewSurface) =>
    steps.flatMap((step, index) => {
      const key = `${channel.id}-${run}-${index}`;
      const phone = surface === 'phone';
      const message = (
        <Message
          key={key}
          step={step}
          t={t}
          answer={answers[index]}
          waiting={waiting && index === shown - 1}
          onAnswer={answer}
          author={isTeam ? TEAM_MEMBER.desktop : undefined}
          isPeer={isTeam && phone}
          avatarSize={phone ? 22 : undefined}
          outcomeLabels={
            phone
              ? { allow: hero.approved, always: hero.alwaysApproved, deny: hero.rejected }
              : undefined
          }
          sessionLink={
            isPreviewBot && index === sessionMessage ? (
              <div className="preview-message-link">
                <small>{preview.newSession}</small>
                {sessionLink(surface)}
              </div>
            ) : undefined
          }
        />
      );
      return isTeam && index === sessionMessage
        ? [
            message,
            <li className="app-msg app-msg--bot" key={key + '-shared'}>
              <Avatar name="Jun" size={phone ? 22 : 32} />
              <div>
                <span className="app-msg-name">Jun</span>
                <p className="app-bubble">{preview.teamLink}</p>
                {sessionLink(surface)}
              </div>
            </li>,
          ]
        : [message];
    });
  const renderExtra = (surface: PreviewSurface) =>
    extra.map((item, index) => {
      const avatarSize = surface === 'phone' ? 22 : 32;
      return item.kind === 'user' ? (
        <HumanMessage
          key={index}
          text={item.text}
          name={t.human}
          author={item.author}
          isPeer={item.author !== TEAM_MEMBER[surface]}
          avatarSize={avatarSize}
        />
      ) : (
        <li className="app-msg app-msg--bot" key={index}>
          <Avatar name={item.bot} size={avatarSize} />
          <div>
            <span className="app-msg-name">{item.bot}</span>
            <p className="app-bubble">
              {t.fallback} {surface === 'desktop' ? <a href="#install">{t.fallbackCta}</a> : null}
            </p>
          </div>
        </li>
      );
    });
  const statusOf = (row: DemoChannel): RowStatus => {
    if (row.id !== channel.id) return seen.has(row.id) ? 'done' : undefined;
    if (waiting) return 'needs';
    if (working || typing || !done) return inView ? 'working' : undefined;
    return 'done';
  };
  const unreadOf = (c: DemoChannel) =>
    seen.has(c.id)
      ? 0
      : c.steps.filter((step) => step.kind !== 'user' && step.kind !== 'event').length;
  const statusLabel = (status: RowStatus) =>
    status === 'working'
      ? t.states.working
      : status === 'needs'
        ? t.needsYou
        : status === 'done'
          ? t.states.idle
          : undefined;
  const needing = scopedRows.filter((row) => statusOf(row.channel) === 'needs');
  const unseen = scopedRows.filter(
    (row) => row.channel.id !== channel.id && !seen.has(row.channel.id),
  );
  const sidePanels = [
    {
      id: 'notifications',
      label: preview.notifications,
      icon: Bell,
      count: needing.length + unseen.length,
    },
    { id: 'channels', label: t.channelsPanel, icon: Hash },
    { id: 'chats', label: preview.chats, icon: MessagesCircle },
    { id: 'marketplace', label: preview.marketplace, icon: MarketplaceIcon },
    { id: 'environment', label: preview.environment, icon: Server },
  ] as const;
  const sidePanelTitle = sidePanels.find((item) => item.id === sidePanel)!;
  const SideIcon = sidePanelTitle.icon;
  const showChannels = sidePanel === 'channels' || sidePanel === 'chats';
  const showHost = linkedPhone && hostScope === 'all';
  const visibleConversations =
    sidePanel === 'chats' ? scopedRows.filter((row) => row.channel.kind === 'dm') : scopedRows;
  const workingSummary = working
    ? [
        t.activity[TOOL_ACTIVITY[working.tool] ?? 'working'],
        working.tool === 'thinking' ? null : copy.symbols[working.tool],
      ]
        .filter(Boolean)
        .join(' · ')
    : undefined;
  const dmWorking = working && channel.kind === 'dm';
  const channelIdentity = (
    <>
      <span className="app-chat-avatar" aria-hidden="true">
        {channel.kind === 'group' ? (
          <GroupAvatar bots={channel.bots} size={20} />
        ) : (
          <Avatar name={channel.bots[0]!} size={20} />
        )}
      </span>
      <span
        className="app-chat-name"
        data-working={dmWorking ? '' : undefined}
        title={dmWorking ? workingSummary : channel.title}
        aria-hidden={dmWorking ? true : undefined}
      >
        {dmWorking ? workingSummary : channel.title}
      </span>
    </>
  );

  return (
    <div
      className={
        linkedPhone ? 'demo-stage demo-stage--hero hero-linked' : 'demo-stage demo-stage--hero'
      }
      ref={root}
      onFocusCapture={takeOver}
      onPointerDownCapture={takeOver}
      onKeyDown={(event) => {
        if (
          event.key === 'Escape' &&
          previewPanel &&
          previewClose.current?.closest('.app')?.contains(event.target as Node)
        ) {
          event.stopPropagation();
          if (previewPanel.kind === 'profile') backFromPhoneProfile(previewPanel.page);
          else if (previewPanel.kind === 'profile-detail')
            closePhoneProfileDetail(previewPanel.opener);
          else closePreview();
        }
      }}
      data-device={
        linkedPhone
          ? phonePhase === 'intro' || phonePhase === 'pair'
            ? 'desktop'
            : 'phone'
          : undefined
      }
      data-phase={linkedPhone ? phonePhase : undefined}
    >
      <span className="visually-hidden" role="status">
        {working ? `${working.bot} · ${workingSummary}` : ''}
      </span>
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
          inert={previewPanel?.kind === 'models' && previewPanel.surface === 'desktop'}
        >
          <nav className="app-rail" aria-label={t.rail}>
            <span className="app-rail-brand">
              <img src="/logo.png" width={18} height={18} alt="Tobs" />
            </span>
            {sidePanels.map(({ id, label, icon: Glyph, ...item }) => (
              <button
                key={id}
                type="button"
                className="app-rail-btn"
                data-rail={id}
                aria-pressed={sidePanel === id}
                aria-controls={sidePanelId}
                aria-label={label}
                title={label}
                onClick={() => {
                  takeOver();
                  if (linkedPhone && phonePhase === 'pair') pairingWith.current?.();
                  setSidePanel(id);
                }}
              >
                <Glyph size={18} aria-hidden="true" />
                {'count' in item && item.count ? (
                  <span className="app-corner-count" aria-hidden="true">
                    {item.count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <section
            className="app-pane app-side-panel"
            id={sidePanelId}
            aria-label={sidePanelTitle.label}
          >
            <header className="app-pane-head">
              <SideIcon className="app-icon" size={16} aria-hidden="true" />
              <span className="app-pane-title">{sidePanelTitle.label}</span>
              {linkedPhone && (showChannels || sidePanel === 'notifications') ? (
                <select
                  className="app-host-filter"
                  aria-label={hero.chooseHost}
                  value={hostScope}
                  onChange={(event) => setHostScope(event.target.value as HostScope)}
                >
                  <option value="all">{hero.all}</option>
                  {PHONE_HOSTS.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              ) : null}
              {sidePanel === 'environment' ? (
                <button
                  className="app-icon-btn"
                  type="button"
                  aria-expanded={addingRemote}
                  aria-label={preview.addRemote}
                  title={preview.addRemote}
                  onClick={() => setAddingRemote((value) => !value)}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              ) : null}
            </header>

            {showChannels ? (
              <ul className="app-channels">
                {visibleConversations.map(({ channel: c, index, host }) => {
                  const status = statusOf(c);
                  const unread = unreadOf(c);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="app-channel"
                        aria-current={c.id === channel.id ? 'true' : undefined}
                        data-status={status}
                        onClick={() => open(index, undefined, host)}
                      >
                        <span className="app-channel-avatar">
                          {c.kind === 'group' ? (
                            <GroupAvatar bots={c.bots} size={32} />
                          ) : (
                            <Avatar name={c.bots[0]!} size={32} />
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
                          {showHost ? <HeroPhoneSource host={host} /> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : sidePanel === 'notifications' ? (
              needing.length + unseen.length === 0 ? (
                <p className="app-activity-empty">{t.nothingWaiting}</p>
              ) : (
                <ul className="app-activity-list">
                  {[
                    ...needing.map((row) => ({ ...row, tag: t.needsYou, tone: 'waiting' })),
                    ...unseen.map((row) => ({ ...row, tag: t.unread, tone: 'info' })),
                  ].map(({ channel: c, index, host, tag, tone }) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => open(index, undefined, host)}>
                        <span className="app-badge" data-tone={tone}>
                          {tag}
                        </span>
                        <strong>{c.kind === 'group' ? `# ${c.title}` : c.title}</strong>
                        <small>{c.preview}</small>
                        {showHost ? <HeroPhoneSource host={host} /> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : sidePanel === 'marketplace' ? (
              <div className="app-side-content">
                {[
                  { name: 'Mira', description: preview.marketMira },
                  { name: 'Nova', description: preview.marketNova },
                ].map(({ name, description }) => (
                  <div className="app-market-row" key={name}>
                    <Avatar name={name} size={30} />
                    <span>
                      <strong>{name}</strong>
                      <small>{description}</small>
                    </span>
                  </div>
                ))}
                <a className="app-side-link" href={marketHref(lang, { kind: 'home' })}>
                  {preview.openMarketplace} →
                </a>
              </div>
            ) : (
              <div className="app-side-content">
                {addingRemote ? (
                  <div className="app-env-info">
                    <strong>{preview.addRemote}</strong>
                    <p>{preview.remoteHelp}</p>
                    <a href={guidePath(lang, 'private-connect')}>{preview.connectionGuide} →</a>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="app-env-row"
                  aria-pressed={hostScope === 'all'}
                  onClick={() => setHostScope('all')}
                >
                  <Monitor size={15} aria-hidden="true" />
                  <strong>{hero.all}</strong>
                </button>
                {PHONE_HOSTS.map(({ id, name }) => (
                  <div className="app-env-host" key={id}>
                    <button
                      type="button"
                      className="app-env-row"
                      aria-pressed={hostScope === id}
                      onClick={() => setHostScope(id)}
                    >
                      <HeroPhoneSource host={id} />
                      <small>{id === 'studio' ? preview.thisHost : preview.remoteHost}</small>
                    </button>
                    {id === 'research' ? (
                      <details className="app-env-connection">
                        <summary
                          aria-label={`${preview.editConnection} · ${name}`}
                          title={preview.editConnection}
                        >
                          <Ellipsis size={15} aria-hidden="true" />
                        </summary>
                        <div className="app-env-info">
                          <strong>{name}</strong>
                          <p>{hero.connected} · Tailscale</p>
                          <a href={guidePath(lang, 'private-connect')}>
                            {preview.connectionGuide} →
                          </a>
                        </div>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="app-pane app-chat" aria-label={`${t.messages} · ${channel.title}`}>
            <header className="app-pane-head app-chat-head">
              <span className="app-chat-heading">
                <MessagesCircle className="app-icon" size={16} aria-hidden="true" />
                <span className="app-pane-title">{t.messages}</span>
              </span>
              <span className="app-chat-breadcrumb">
                <ChevronRight className="app-icon" size={16} aria-hidden="true" />
                {isTeam ? (
                  <button
                    type="button"
                    className="app-chat-identity"
                    aria-label={`${channel.title} · ${preview.members}`}
                    aria-expanded={hasDesktopMembers}
                    onClick={(event) => showPreview('members', 'desktop', event.currentTarget)}
                  >
                    {channelIdentity}
                  </button>
                ) : (
                  <span className="app-chat-identity">{channelIdentity}</span>
                )}
                {working && channel.kind === 'group' ? (
                  <span
                    className="app-header-working"
                    title={`${working.bot} · ${workingSummary}`}
                    aria-hidden="true"
                  >
                    <WorkingAvatar key={working.bot} {...working} size={22} />
                    <span>{workingSummary}</span>
                  </span>
                ) : null}
              </span>
              {linkedPhone && channel.kind === 'dm' ? modelTrigger : null}
              <button
                type="button"
                className="app-icon-btn app-panel-toggle"
                ref={subpanelToggle}
                aria-expanded={panelOpen}
                aria-controls={subpanelId}
                aria-label={panelOpen ? t.hideSidebar : t.showSidebar}
                title={panelOpen ? t.hideSidebar : t.showSidebar}
                onClick={() => {
                  touched.current = true;
                  setPanelOpen((open) => !open);
                }}
              >
                <PanelRight size={16} aria-hidden="true" />
              </button>
            </header>
            <div className="app-message-split" data-session={hasDesktopSession ? '' : undefined}>
              <div className="app-message-content">
                {hasDesktopMembers ? renderPreview('desktop') : null}
                {memoryReader ? (
                  <PreviewMemoryReader
                    key={memoryReader.kind + memoryReader.id}
                    t={preview}
                    entry={memoryReader}
                    backRef={previewClose}
                    onBack={closePreview}
                  />
                ) : null}
                <div
                  className="app-message-timeline"
                  hidden={memoryReader !== undefined || hasDesktopMembers}
                >
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
                  ) : (
                    <>
                      <div className="app-feed" ref={feed}>
                        <ol className="app-msgs">
                          <li className="app-day">{t.today}</li>
                          {renderSteps('desktop')}
                          {renderExtra('desktop')}
                          {done && extra.length === 0 ? (
                            <li className="app-event app-event--replay">
                              <button
                                type="button"
                                className="app-btn"
                                onClick={() => open(active)}
                              >
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
                        onSubmit={(event) => send(event, 'desktop')}
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
                          placeholder={
                            isTeam
                              ? fill(preview.composer, { name: 'Mei' })
                              : fill(t.composer, { name: channel.title })
                          }
                          aria-label={
                            isTeam
                              ? fill(preview.composer, { name: 'Mei' })
                              : fill(t.composer, { name: channel.title })
                          }
                          maxLength={200}
                        />
                        <button
                          type="submit"
                          className="app-send"
                          disabled={!done || !draft.trim()}
                        >
                          <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
                          <span className="visually-hidden">{t.send}</span>
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
              {hasDesktopSession ? (
                <>
                  <div
                    className="app-session-resize"
                    role="separator"
                    tabIndex={0}
                    aria-label={sessionTitle}
                    aria-orientation="vertical"
                    aria-valuemin={MIN_SUBPANEL_WIDTH}
                    aria-valuemax={maxSessionWidth}
                    aria-valuenow={visibleSessionWidth}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                      event.preventDefault();
                      resizeSession(visibleSessionWidth + (event.key === 'ArrowLeft' ? 2 : -2));
                    }}
                    onPointerDown={(event) => {
                      if (event.button === 0)
                        event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => {
                      const divider = event.currentTarget;
                      if (!divider.hasPointerCapture(event.pointerId)) return;
                      const splitWidth = divider.parentElement!.getBoundingClientRect().width;
                      const rightEdge = divider.nextElementSibling!.getBoundingClientRect().right;
                      resizeSession(((rightEdge - event.clientX) * 100) / splitWidth);
                    }}
                  />
                  {renderPreview('desktop')}
                </>
              ) : null}
              <div
                className="app-column-resize"
                role="separator"
                tabIndex={0}
                aria-label={t.sidebar}
                aria-orientation="vertical"
                aria-valuemin={MIN_SUBPANEL_WIDTH}
                aria-valuemax={maxColumnWidth}
                aria-valuenow={visibleColumnWidth}
                hidden={!panelOpen}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                  event.preventDefault();
                  resizeSubpanelColumn(visibleColumnWidth + (event.key === 'ArrowLeft' ? 2 : -2));
                }}
                onPointerDown={(event) => {
                  if (event.button === 0) event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                  const box = event.currentTarget.parentElement!.getBoundingClientRect();
                  resizeSubpanelColumn(((box.right - event.clientX) * 100) / box.width);
                }}
              />
              <aside
                id={subpanelId}
                className="app-panel"
                aria-label={t.sidebar}
                style={{ width: `${visibleColumnWidth}%` }}
                hidden={!panelOpen}
              >
                {panel.map((section) => {
                  const open = expandedSubpanels.has(section.id);
                  const height = panelHeights[section.id] ?? 320;
                  const entryId = `${subpanelId}-${section.id}`;
                  const count =
                    section.items.length +
                    (section.id === 'members' && isTeam ? teamMembers.length - 1 : 0) +
                    (section.id === 'sessions' && sessionAvailable ? 1 : 0);
                  return (
                    <section
                      key={section.id}
                      className="app-panel-section"
                      data-subpanel-section={section.id}
                    >
                      <h4>
                        <button
                          type="button"
                          className="app-panel-head"
                          aria-expanded={open}
                          aria-controls={entryId}
                          onClick={() => {
                            touched.current = true;
                            setExpandedSubpanels((prev) => {
                              const next = new Set(prev);
                              if (open) next.delete(section.id);
                              else next.add(section.id);
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
                          {count ? <span className="app-count">{count}</span> : null}
                        </button>
                      </h4>
                      <div
                        id={entryId}
                        className="app-subpanel-body"
                        style={{ height }}
                        hidden={!open}
                      >
                        <ul>
                          {section.id === 'members' && isTeam ? teamRoster : null}
                          {section.id === 'sessions' && sessionAvailable ? (
                            <li className="app-panel-item">
                              <button
                                type="button"
                                className="app-btn preview-session-row"
                                aria-expanded={
                                  previewPanel?.surface === 'desktop' &&
                                  previewPanel.kind === 'session'
                                }
                                onClick={(event) =>
                                  showPreview('session', 'desktop', event.currentTarget)
                                }
                              >
                                <TextQuote size={14} aria-hidden="true" />
                                <span className="app-panel-text">
                                  <span>{sessionTitle}</span>
                                  <small>{preview.complete} · 3/3</small>
                                </span>
                              </button>
                            </li>
                          ) : null}
                          {section.items
                            .filter(
                              (item) => !(section.id === 'members' && item.id === 'h' && isTeam),
                            )
                            .map((item, index, items) => {
                              const entry = memoryEntry(section.id, item);
                              const text = (
                                <span className="app-panel-text">
                                  <span>{item.title}</span>
                                  {item.meta ? (
                                    <small>
                                      {[item.sha, item.meta].filter(Boolean).join(' · ')}
                                    </small>
                                  ) : null}
                                </span>
                              );
                              return (
                                <li
                                  key={`${item.id}-${item.badge ?? ''}`}
                                  className={
                                    entry ? 'app-panel-item preview-memory-item' : 'app-panel-item'
                                  }
                                  data-tone={item.tone}
                                >
                                  {entry ? (
                                    <button
                                      type="button"
                                      className="preview-memory-row"
                                      data-kind={entry.kind}
                                      aria-pressed={
                                        memoryReader?.kind === entry.kind &&
                                        memoryReader.id === entry.id
                                      }
                                      onClick={(event) => showMemory(entry, event.currentTarget)}
                                    >
                                      {entry.kind === 'file' ? (
                                        <MemoryMarkdownIcon />
                                      ) : (
                                        <svg
                                          className="preview-memory-graph"
                                          viewBox="0 0 12 46"
                                          width={12}
                                          height={46}
                                          aria-hidden="true"
                                        >
                                          <path
                                            d={`M6 ${index === 0 ? 12 : 0}V${index === items.length - 1 ? 12 : 46}`}
                                          />
                                          <circle
                                            cx={6}
                                            cy={12}
                                            r={index === 0 ? 4 : 3.5}
                                            data-head={index === 0 || undefined}
                                          />
                                        </svg>
                                      )}
                                      {text}
                                      {item.badge ? (
                                        <span className="app-badge">{item.badge}</span>
                                      ) : null}
                                    </button>
                                  ) : (
                                    <>
                                      {section.id === 'members' && item.id !== 'h' ? (
                                        <Avatar name={item.title} size={22} />
                                      ) : null}
                                      {text}
                                      {item.badge ? (
                                        <span className="app-badge">{item.badge}</span>
                                      ) : null}
                                    </>
                                  )}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                      {open ? (
                        <div
                          className="app-subpanel-resize"
                          role="separator"
                          tabIndex={0}
                          aria-label={section.title}
                          aria-orientation="horizontal"
                          aria-valuemin={MIN_SUBPANEL_HEIGHT}
                          aria-valuemax={MAX_SUBPANEL_HEIGHT}
                          aria-valuenow={height}
                          onKeyDown={(event) => {
                            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
                            event.preventDefault();
                            resizeSubpanel(
                              section.id,
                              height + (event.key === 'ArrowDown' ? 16 : -16),
                            );
                          }}
                          onPointerDown={(event) => {
                            if (event.button !== 0) return;
                            panelResizeStart.current = { y: event.clientY, height };
                            event.currentTarget.setPointerCapture(event.pointerId);
                          }}
                          onPointerMove={(event) => {
                            if (
                              !event.currentTarget.hasPointerCapture(event.pointerId) ||
                              !panelResizeStart.current
                            )
                              return;
                            const start = panelResizeStart.current;
                            resizeSubpanel(section.id, start.height + event.clientY - start.y);
                          }}
                          onLostPointerCapture={() => {
                            panelResizeStart.current = null;
                          }}
                        />
                      ) : null}
                    </section>
                  );
                })}
              </aside>
            </div>
          </section>
        </div>
        {previewPanel?.kind === 'models' && previewPanel.surface === 'desktop' ? (
          <div className="preview-model-overlay">{renderPreview('desktop')}</div>
        ) : null}
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
                  <img src="/logo.png" width={88} height={88} alt="" />
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
                    <>
                      <div
                        className="preview-phone-chat"
                        hidden={previewPanel?.surface === 'phone'}
                      >
                        <HeroPhoneChat
                          onBack={onBack}
                          onProfile={(event) => openPhoneProfile(event.currentTarget)}
                          model={
                            channel.kind === 'dm' ? (
                              <>
                                <PreviewModelIcon brand={model.brand} />
                                <span title={model.name}>{model.shortName}</span>
                              </>
                            ) : undefined
                          }
                          status={
                            working ? (
                              <>
                                {channel.kind === 'group' ? (
                                  <WorkingAvatar key={working.bot} {...working} size={13} />
                                ) : null}
                                <span>
                                  {t.activity[working.tool === 'thinking' ? 'thinking' : 'working']}
                                </span>
                              </>
                            ) : channel.kind === 'group' ? (
                              fill(preview.phoneProfile.memberCount, {
                                count: String(channel.bots.length + teamMembers.length),
                              })
                            ) : (
                              t.states.idle
                            )
                          }
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
                          onSubmit={(event) => send(event, 'phone')}
                          ready={done}
                          labels={{
                            back: hero.back,
                            profile: preview.phoneProfile.open,
                            composer: isTeam
                              ? fill(preview.composer, { name: 'Jun' })
                              : fill(t.composer, {
                                  name: `${channel.bots.length > 1 ? '#' : ''}${channel.title}`,
                                }),
                            send: t.send,
                          }}
                        >
                          {renderSteps('phone')}
                          {renderExtra('phone')}
                        </HeroPhoneChat>
                      </div>
                      {renderPreview('phone')}
                    </>
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
