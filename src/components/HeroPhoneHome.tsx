import {
  Bell,
  Check,
  ChevronDown,
  FlaskConical,
  Hash,
  Laptop,
  ListFilter,
  MessagesSquare,
  Settings,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import {
  PHONE_HOSTS as HOSTS,
  PHONE_REQUESTS as REQUESTS,
  type PhoneHostId,
} from '../heroPhoneData';
import { prefersReducedMotion } from './PixelAvatar';

export type PhoneScreen = 'chat' | 'chats' | 'activity' | 'settings';
type Decision = 'allow' | 'deny';
export type SharedPhoneRequest = {
  id: string;
  host: PhoneHostId;
  bot: string;
  command: string;
  decision?: Decision | 'always';
  onDecide: (decision: Decision) => void;
};
type PhoneRequest = Pick<SharedPhoneRequest, 'id' | 'host' | 'bot' | 'command'>;

export function HeroPhoneSource({ host }: { host: PhoneHostId }) {
  const source = HOSTS.find((item) => item.id === host)!;
  const Icon = host === 'studio' ? Laptop : FlaskConical;
  return (
    <span className="hero-phone-source" data-host={host}>
      <Icon size={11} aria-hidden="true" />
      {source.name}
    </span>
  );
}

/** Scripted multi-computer app shell. All decisions stay in this local demo instance. */
export function HeroPhoneHome({
  lang,
  autoScreen,
  autoPlay,
  onOpenChannel,
  renderAvatar,
  renderChat,
  sharedRequest,
}: {
  lang: Lang;
  autoScreen: PhoneScreen;
  autoPlay: boolean;
  onOpenChannel: (index: number, host: PhoneHostId) => void;
  renderAvatar: (name: string, size: number) => ReactNode;
  renderChat: (onBack: () => void) => ReactNode;
  sharedRequest?: SharedPhoneRequest;
}) {
  const t = HERO_COPY[lang];
  const [screen, setScreen] = useState(autoScreen);
  const [host, setHost] = useState<PhoneHostId | 'all'>('all');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const content = useRef<HTMLDivElement>(null);
  const focusContent = useRef(false);
  const handledHere = useRef(new Set<string>());
  const [focusRequest, setFocusRequest] = useState<string>();
  useEffect(() => {
    if (!focusRequest) return;
    if (screen !== 'activity') {
      setFocusRequest(undefined);
      return;
    }
    const result = content.current?.querySelector<HTMLElement>(
      `[data-request="${focusRequest}"] .hero-phone-request-result`,
    );
    if (result) {
      result.focus();
      setFocusRequest(undefined);
    }
  }, [focusRequest, decisions, sharedRequest?.decision, screen]);
  const decide = (id: string, decision: Decision) => {
    setFocusRequest(id);
    if (id === sharedRequest?.id) {
      handledHere.current.add(id);
      sharedRequest.onDecide(decision);
    } else setDecisions((previous) => ({ ...previous, [id]: decision }));
  };
  useEffect(() => setScreen(autoScreen), [autoScreen]);
  useEffect(() => {
    if (focusContent.current) {
      content.current?.querySelector<HTMLElement>('button, summary, h3')?.focus();
      focusContent.current = false;
    }
  }, [screen]);
  useEffect(() => {
    if (screen !== 'activity' || !autoPlay || prefersReducedMotion()) return;
    const timers = REQUESTS.map((request, index) =>
      window.setTimeout(
        () => {
          setDecisions((previous) => ({ ...previous, [request.id]: 'allow' }));
        },
        2800 + index * 2200,
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [screen, autoPlay]);
  const navigate = (next: PhoneScreen, focus = false) => {
    focusContent.current = focus;
    setScreen(next);
  };
  const requests: PhoneRequest[] = [...REQUESTS];
  if (sharedRequest && (!sharedRequest.decision || handledHere.current.has(sharedRequest.id)))
    requests.push(sharedRequest);
  const decisionOf = (request: PhoneRequest) =>
    request.id === sharedRequest?.id ? sharedRequest.decision : decisions[request.id];
  const visibleRequests = requests.filter((request) => host === 'all' || request.host === host);
  const pending = visibleRequests.filter((request) => !decisionOf(request)).length;
  const title = lang === 'zh' ? '发布小队' : 'Launch crew';
  const rows = [
    { title, bot: '', host: 'studio' as const, channel: 0, preview: t.chatPreview },
    { title: 'Mira', bot: 'Mira', host: 'studio' as const, channel: 1, preview: t.studioPreview },
    {
      title: 'Mira',
      bot: 'Mira',
      host: 'research' as const,
      channel: 1,
      preview: t.researchPreview,
    },
    { title: 'Nova', bot: 'Nova', host: 'research' as const, channel: 2, preview: t.checkPreview },
  ].filter((row) => host === 'all' || row.host === host);
  const pickers = useRef(new Map<string, HTMLDetailsElement>());
  const hostPicker = (compact: boolean) => (
    <details
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.currentTarget.open = false;
          event.currentTarget.querySelector('summary')?.focus();
        }
      }}
      className="hero-phone-host-picker"
      ref={(node) => {
        if (node) pickers.current.set(screen, node);
        else pickers.current.delete(screen);
      }}
    >
      <summary aria-label={t.chooseHost}>
        {compact ? (
          <ListFilter size={20} aria-hidden="true" />
        ) : (
          <>
            <MessagesSquare size={19} aria-hidden="true" />
            <strong>{host === 'all' ? t.all : HOSTS.find((item) => item.id === host)!.name}</strong>
            <ChevronDown size={15} aria-hidden="true" />
          </>
        )}
      </summary>
      <div className="hero-phone-host-options" role="group" aria-label={t.chooseHost}>
        {(['all', 'studio', 'research'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={host === value}
            onClick={() => {
              setHost(value);
              const picker = pickers.current.get(screen);
              if (picker) {
                picker.open = false;
                picker.querySelector('summary')?.focus();
              }
            }}
          >
            {value === 'all' ? t.all : <HeroPhoneSource host={value} />}
            {host === value ? <Check size={14} aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
    </details>
  );
  const tabs = [
    { id: 'chats', label: t.chats, Icon: MessagesSquare },
    { id: 'activity', label: t.activity, Icon: Bell },
    { id: 'settings', label: t.settings, Icon: Settings },
  ] as const;
  return (
    <div className="hero-phone-app" ref={content} data-screen={screen}>
      {screen === 'chat' ? (
        renderChat(() => navigate('chats', true))
      ) : (
        <>
          <div className="hero-phone-page" key={screen}>
            <header className="hero-phone-page-head">
              {screen === 'chats' ? (
                hostPicker(false)
              ) : (
                <h3 tabIndex={-1}>
                  {screen === 'activity' ? t.activity : t.settings}
                  {screen === 'activity' && host !== 'all' ? <HeroPhoneSource host={host} /> : null}
                </h3>
              )}
              {screen === 'activity' ? hostPicker(true) : null}
            </header>
            <div className="hero-phone-page-feed">
              {screen === 'chats' ? (
                <>
                  <p className="hero-phone-section-label">
                    {t.pinned} {rows.length}
                  </p>
                  <ul className="hero-phone-conversations">
                    {rows.map((row) => (
                      <li key={`${row.host}-${row.channel}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenChannel(row.channel, row.host);
                            navigate('chat', true);
                          }}
                        >
                          {row.bot ? (
                            renderAvatar(row.bot, 31)
                          ) : (
                            <span className="hero-phone-group-icon">
                              <Hash size={21} aria-hidden="true" />
                            </span>
                          )}
                          <span className="hero-phone-conversation-copy">
                            <span className="hero-phone-conversation-title">
                              <strong>{row.title}</strong>
                              <HeroPhoneSource host={row.host} />
                            </span>
                            <span className="hero-phone-row-preview">{row.preview}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : screen === 'activity' ? (
                <>
                  <div className="hero-phone-activity-sections">
                    <strong>{t.needsAction}</strong>
                    <span>{t.related}</span>
                    <span>{t.unread}</span>
                  </div>
                  <ul className="hero-phone-requests">
                    {visibleRequests.map((request) => {
                      const decision = decisionOf(request);
                      return (
                        <li key={request.id} data-request={request.id} data-decision={decision}>
                          <div className="hero-phone-request-source">
                            {renderAvatar(request.bot, 24)}
                            <strong>{request.bot}</strong>
                            <HeroPhoneSource host={request.host} />
                          </div>
                          {decision ? (
                            <p
                              className="hero-phone-request-result"
                              tabIndex={-1}
                              aria-live="polite"
                            >
                              {decision !== 'deny' ? (
                                <Check size={13} aria-hidden="true" />
                              ) : (
                                <X size={13} aria-hidden="true" />
                              )}
                              {decision === 'deny' ? t.rejected : t.approved}
                            </p>
                          ) : (
                            <div className="hero-phone-request-card">
                              <strong>{t.toolRequest}</strong>
                              <code>{request.command}</code>
                              <div>
                                <button type="button" onClick={() => decide(request.id, 'allow')}>
                                  {t.allowOnce}
                                </button>
                                <button type="button" onClick={() => decide(request.id, 'deny')}>
                                  {t.reject}
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {pending === 0 ? (
                    <p className="hero-phone-caught-up" role="status">
                      <Check size={20} aria-hidden="true" />
                      {t.allHandled}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="hero-phone-section-label">{t.connectedComputers}</p>
                  <ul className="hero-phone-computers">
                    {HOSTS.map((item) => (
                      <li key={item.id}>
                        <HeroPhoneSource host={item.id} />
                        <span className="hero-phone-connected">{t.connected}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <nav className="hero-phone-tabbar" aria-label={t.mobileNavigation}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={screen === tab.id}
                onClick={() => navigate(tab.id)}
              >
                <span>
                  <tab.Icon size={21} aria-hidden="true" />
                  {tab.id === 'activity' && pending > 0 ? <i>{pending}</i> : null}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
