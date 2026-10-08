import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { AvatarDesign } from '../avatarDesign';
import type { Lang } from '../content';
import { companionAvatarSvg } from '../companionAvatar';
import {
  COMPANION_COPY,
  loadChoices,
  saveChoices,
  type CompanionChoices,
  type GuideMessage,
} from '../companionGuide';
import { useCompanionMotion } from '../useCompanionMotion';
import { COMMUNITY_LINKS, QQ_GROUP } from '../communityLinks';
import { copyText } from '../clipboard';
import { track } from '../analytics';
import { analyticsConsent, CONSENT_COPY } from '../analyticsConsent';

function session() {
  try {
    return sessionStorage;
  } catch {
    return undefined;
  }
}
export function BotCompanion({ lang, design }: { lang: Lang; design: AvatarDesign }) {
  const c = COMPANION_COPY[lang];
  const consent = useSyncExternalStore(analyticsConsent.subscribe, analyticsConsent.snapshot);
  const consentRef = useRef(consent);
  consentRef.current = consent;
  const pending = consent === 'pending';
  const privacy = CONSENT_COPY[lang];
  const [choices, setChoices] = useState(() => loadChoices(session()));
  const choicesRef = useRef(choices);
  const [message, setMessage] = useState<GuideMessage>();
  const [reading, setReading] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'busy' | 'copied' | 'failed'>('idle');
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  const restore = useRef<HTMLButtonElement>(null);
  const hovering = useRef(false);
  const svg = useMemo(() => companionAvatarSvg(design.recipe), [design.recipe]);
  function update(next: Partial<CompanionChoices>) {
    const value = { ...choicesRef.current, ...next };
    choicesRef.current = value;
    setChoices(value);
    saveChoices(session(), value);
  }
  function dismiss() {
    if (consentRef.current === 'pending') return;
    update({ invited: true });
    setMessage(undefined);
  }
  const motion = useCompanionMotion({
    ...choices,
    hidden: pending ? false : choices.hidden,
    consentPending: pending,
    reading: reading || pending,
    onEvent(event, support) {
      if (consentRef.current === 'pending' || consentRef.current === 'loading') return;
      if (event === 'welcome' && !choicesRef.current.invited) setMessage('welcome');
      if (event === 'drop') setMessage('drop');
      if (event === 'drag') setMessage('drag');
      if (event === 'interested' && !choicesRef.current.invited) {
        update({ invited: true });
        setMessage('community');
      }
      if (event === 'landed') {
        if (support === 'viewport' && !choicesRef.current.invited) {
          update({ invited: true });
          setMessage('community');
        } else if (!choicesRef.current.invited) setMessage('land');
        else setMessage((current) => (current === 'drop' || current === 'drag' ? 'land' : current));
      }
    },
  });
  // A newly opened/closed bubble also needs clamping, even when movement is paused.
  useEffect(() => {
    motion.wake();
  }, [message, lang, design.seed, copyState, consent]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(leaveTimer.current);
    };
  }, []);
  function enter() {
    clearTimeout(leaveTimer.current);
    setReading(true);
  }
  function leave() {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      if (!hovering.current && !motion.root.current?.contains(document.activeElement))
        setReading(false);
    }, 800);
  }
  async function copyQQ() {
    if (copyState === 'busy') return;
    update({ invited: true });
    setCopyState('busy');
    try {
      if (!(await copyText(QQ_GROUP))) {
        if (mounted.current) setCopyState('failed');
        return;
      }
      if (mounted.current) {
        setCopyState('copied');
        track('qq_group_copied', { placement: 'companion' });
      }
    } catch {
      if (mounted.current) setCopyState('failed');
    }
  }
  function chooseConsent(accept: boolean) {
    analyticsConsent.choose(accept);
    update({ hidden: false });
    setMessage('welcome');
  }

  return (
    <div
      ref={motion.root}
      className="bot-companion"
      data-placement="companion"
      data-hidden={!pending && choices.hidden}
      aria-label={c.label}
    >
      <button
        ref={restore}
        type="button"
        className="companion-restore"
        hidden={pending || !choices.hidden}
        onClick={() => {
          update({ hidden: false, invited: true });
          setMessage('appearance');
          requestAnimationFrame(() => motion.actor.current?.focus());
        }}
      >
        {c.restore}
      </button>
      <div hidden={!pending && choices.hidden}>
        <button
          ref={motion.actor}
          type="button"
          className="companion-actor"
          aria-label={`${design.seed} · ${c.talk}`}
          aria-describedby="companion-hint"
          onPointerDown={motion.pointerDown}
          onPointerMove={motion.pointerMove}
          onPointerUp={(e) => motion.pointerEnd(e)}
          onPointerCancel={(e) => motion.pointerEnd(e, true)}
          onLostPointerCapture={(e) => motion.pointerEnd(e, true)}
          onMouseEnter={() => {
            hovering.current = true;
            enter();
          }}
          onMouseLeave={() => {
            hovering.current = false;
            leave();
          }}
          onFocus={enter}
          onBlur={leave}
          onClick={(e) => {
            if (consentRef.current === 'pending') return;
            if (motion.clicked(e.detail)) {
              if (message) dismiss();
              else setMessage('welcome');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              dismiss();
              e.preventDefault();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              motion.nudge(e.key === 'ArrowLeft' ? -1 : 1);
              e.preventDefault();
            }
          }}
        >
          <span
            ref={motion.sprite}
            className="companion-sprite"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </button>
        <span className="sr-only" id="companion-hint">
          {c.hint}
        </span>
        <div
          ref={motion.bubble}
          className="companion-bubble"
          hidden={!pending && (!message || consent === 'loading')}
          onMouseEnter={() => {
            hovering.current = true;
            enter();
          }}
          onMouseLeave={() => {
            hovering.current = false;
            leave();
          }}
          onFocus={enter}
          onBlur={leave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              dismiss();
              motion.actor.current?.focus();
            }
          }}
        >
          <div className="companion-content">
            <div className="companion-heading">
              <strong title={design.seed}>{design.seed}</strong>
              {!pending && (
                <button
                  type="button"
                  aria-label={c.close}
                  onClick={() => {
                    dismiss();
                    motion.actor.current?.focus();
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <p aria-live="polite">{pending ? privacy.text : message ? c.messages[message] : ''}</p>
            {pending && (
              <>
                <a className="companion-privacy" href={privacy.privacy}>
                  {privacy.more} ↗
                </a>
                <div className="companion-consent">
                  <button type="button" onClick={() => chooseConsent(false)}>
                    {privacy.reject}
                  </button>
                  <button type="button" onClick={() => chooseConsent(true)}>
                    {privacy.accept}
                  </button>
                </div>
              </>
            )}

            {!pending && message === 'community' && (
              <div className="companion-community">
                <a
                  href={COMMUNITY_LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => update({ invited: true })}
                >
                  {c.discord} ↗
                </a>
                <button type="button" disabled={copyState === 'busy'} onClick={() => void copyQQ()}>
                  {copyState === 'copied' ? (
                    <>
                      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                        <path
                          d="M2 8h2v2h2v2h2v-2h2V8h2V6h2V4h-2v2h-2v2H8v2H6V8H4V6H2z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">{c.copied}</span>
                    </>
                  ) : copyState === 'busy' ? (
                    c.busy
                  ) : (
                    c.qq
                  )}
                </button>
                {copyState === 'failed' && (
                  <p className="companion-copy" role="status">
                    {c.failed}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
