import { useEffect, useMemo, useRef, useState } from 'react';
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

function session() {
  try {
    return sessionStorage;
  } catch {
    return undefined;
  }
}
export function BotCompanion({ lang, design }: { lang: Lang; design: AvatarDesign }) {
  const c = COMPANION_COPY[lang];
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
    update({ invited: true });
    setMessage(undefined);
  }
  const motion = useCompanionMotion({
    ...choices,
    reading,
    onEvent(event, support) {
      if (event === 'welcome' && !choicesRef.current.invited) setMessage('welcome');
      if (event === 'drop') setMessage('drop');
      if (event === 'drag') setMessage('drag');
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
  }, [message, lang, design.seed, copyState]);
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
  return (
    <div
      ref={motion.root}
      className="bot-companion"
      data-placement="companion"
      data-hidden={choices.hidden}
      aria-label={c.label}
    >
      <button
        ref={restore}
        type="button"
        className="companion-restore"
        hidden={!choices.hidden}
        onClick={() => {
          update({ hidden: false, invited: true });
          setMessage('appearance');
          requestAnimationFrame(() => motion.actor.current?.focus());
        }}
      >
        {c.restore}
      </button>
      <div hidden={choices.hidden}>
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
          hidden={!message}
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
            </div>
            <small>{c.guide}</small>
            <p aria-live="polite">{message ? c.messages[message] : ''}</p>
            {message !== 'community' && (
              <div className="companion-topics">
                <a href="#features" onClick={() => setMessage('bots')}>
                  {c.bots}
                </a>
                <a href="#avatar" onClick={() => setMessage('appearance')}>
                  {c.appearance}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    update({ invited: true });
                    setMessage('community');
                  }}
                >
                  {c.community}
                </button>
              </div>
            )}
            {message === 'community' && (
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
                  {copyState === 'busy' ? c.busy : c.qq}
                </button>
                <p className="companion-copy" role="status">
                  {copyState === 'copied' ? c.copied : copyState === 'failed' ? c.failed : ''}
                  <span>{QQ_GROUP}</span>
                </p>
              </div>
            )}
            <details className="companion-settings">
              <summary>{c.settings}</summary>
              <div className="companion-settings-actions">
                <button
                  type="button"
                  aria-pressed={!choices.walking}
                  onClick={() => update({ walking: !choices.walking })}
                >
                  {choices.walking ? c.pause : c.resume}
                </button>
                <button
                  type="button"
                  aria-pressed={choices.quiet || motion.reduced}
                  disabled={motion.reduced}
                  onClick={() => update({ quiet: !choices.quiet })}
                >
                  {choices.quiet && !motion.reduced ? c.animated : c.quiet}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    update({ hidden: true, invited: true });
                    setMessage(undefined);
                    setReading(false);
                    requestAnimationFrame(() => restore.current?.focus());
                  }}
                >
                  {c.hide}
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
