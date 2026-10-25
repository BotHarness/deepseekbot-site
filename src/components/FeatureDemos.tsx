import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { track } from '../analytics';
import type { Copy } from '../content';
import type { FeatureDemoCopy } from '../demoCopy';
import { DEEPSEEKBOT_RECIPE, recipeFor } from '../mascot';
import { PixelAvatar, prefersReducedMotion } from './PixelAvatar';

type Demos = FeatureDemoCopy;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

const used = (feature: keyof Demos, action: string) =>
  track('feature_demo_used', { feature, action });

function Avatar({ name, size }: { name: string; size: number }) {
  const recipe = useMemo(() => recipeFor(name), [name]);
  return <PixelAvatar recipe={recipe} size={size} />;
}

/** Persistent identity: each Bot's SOUL.md and MEMORY.md. */
function Identity({ t }: { t: Demos['identity'] }) {
  const [bot, setBot] = useState(0);
  const [file, setFile] = useState<'soul' | 'memory'>('soul');
  const current = t.bots[bot]!;
  return (
    <div className="mini">
      <div className="mini-tabs" role="tablist" aria-label={t.label}>
        {t.bots.map((b, index) => (
          <button
            key={b.name}
            type="button"
            role="tab"
            aria-selected={index === bot}
            className="mini-bot"
            onClick={() => {
              setBot(index);
              used('identity', 'bot');
            }}
          >
            <Avatar name={b.name} size={40} />
            <span>
              <strong>{b.name}</strong>
              <small>{b.role}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="mini-file">
        <div className="mini-file-tabs" role="tablist">
          {(['soul', 'memory'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={file === f}
              onClick={() => {
                setFile(f);
                used('identity', f);
              }}
            >
              {f === 'soul' ? 'SOUL.md' : 'MEMORY.md'}
            </button>
          ))}
        </div>
        <pre className="mini-code" key={`${bot}-${file}`}>
          {(file === 'soul' ? current.soul : current.memory).join('\n')}
        </pre>
      </div>
    </div>
  );
}

/** Git Memory: commits and the diff each one made. */
function Memory({ t }: { t: Demos['memory'] }) {
  const [at, setAt] = useState(0);
  const commit = t.commits[at]!;
  const added = commit.diff.filter((line) => line.startsWith('+')).length;
  const removed = commit.diff.filter((line) => line.startsWith('-')).length;
  return (
    <div className="mini mini--split">
      <ol className="mini-commits" aria-label={t.label}>
        {t.commits.map((c, index) => (
          <li key={c.sha}>
            <button
              type="button"
              aria-pressed={index === at}
              onClick={() => {
                setAt(index);
                used('memory', 'commit');
              }}
            >
              <span className="mini-commit-dot" aria-hidden="true" />
              <span>
                <strong>{c.message}</strong>
                <small>
                  {c.sha} · {c.time}
                  {index === 0 ? <span className="app-badge">{t.branch}</span> : null}
                </small>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mini-diff" key={commit.sha}>
        <p className="mini-diff-head">
          <span className="mini-diff-file">
            <small>{t.changed}</small>
            <strong>{commit.file}</strong>
          </span>
          <span className="mini-diff-count">
            <span className="mini-add">+{added}</span> <span className="mini-del">-{removed}</span>
          </span>
        </p>
        <pre className="mini-code">
          {commit.diff.map((line, index) => (
            <span
              key={index}
              className={
                line.startsWith('+')
                  ? 'mini-line mini-line--add'
                  : line.startsWith('-')
                    ? 'mini-line mini-line--del'
                    : 'mini-line'
              }
            >
              {line}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

type Policy = Demos['groups']['members'][number]['policy'];
const POLICIES: Policy[] = ['all', 'digest', 'mentions', 'muted'];

/** Groups: each member's notification policy decides who a message wakes. */
function Groups({ t }: { t: Demos['groups'] }) {
  const [policies, setPolicies] = useState<Record<string, Policy>>(() =>
    Object.fromEntries(t.members.map((m) => [m.name, m.policy])),
  );
  const [message, setMessage] = useState(0);
  const msg = t.messages[message]!;

  const result = (name: string) => {
    if (msg.mentions.includes(name)) return { text: t.results.mentioned, tone: 'ok' };
    const policy = policies[name]!;
    if (policy === 'all') return { text: t.results.woken, tone: 'ok' };
    if (policy === 'digest') return { text: t.results.digest, tone: 'info' };
    if (policy === 'mentions') return { text: t.results.skipped, tone: 'off' };
    return { text: t.results.muted, tone: 'off' };
  };

  return (
    <div className="mini">
      <div className="mini-post" role="radiogroup" aria-label={t.messagesLabel}>
        <span className="mini-label">{t.messagesLabel}</span>
        {t.messages.map((m, index) => (
          <button
            key={m.text}
            type="button"
            role="radio"
            aria-checked={index === message}
            className="mini-chip"
            onClick={() => {
              setMessage(index);
              used('groups', 'message');
            }}
          >
            {m.text}
          </button>
        ))}
      </div>
      <ul className="mini-members">
        {t.members.map((m) => {
          const r = result(m.name);
          return (
            <li key={m.name}>
              <Avatar name={m.name} size={36} />
              <strong>{m.name}</strong>
              <select
                aria-label={fill(t.policyLabel, { name: m.name })}
                value={policies[m.name]}
                onChange={(event) => {
                  setPolicies((prev) => ({ ...prev, [m.name]: event.target.value as Policy }));
                  used('groups', 'policy');
                }}
              >
                {POLICIES.map((p) => (
                  <option key={p} value={p}>
                    {t.policies[p]}
                  </option>
                ))}
              </select>
              <span
                className="mini-result"
                data-tone={r.tone}
                key={`${message}-${policies[m.name]}`}
              >
                {r.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Work across folders: one Bot, several jobs, and the one that needs you. */
function Folders({ t }: { t: Demos['folders'] }) {
  const initial = () =>
    t.jobs.map((job) => (job.ask ? 'waiting' : 'running') as keyof typeof t.status);
  const [status, setStatus] = useState(initial);
  const waiting = status.filter((s) => s === 'waiting').length;

  // running jobs finish after a while, so the list feels alive
  useEffect(() => {
    const id = window.setTimeout(() => {
      setStatus((prev) => {
        const next = [...prev];
        const at = next.findIndex((s, index) => s === 'running' && index !== 0);
        if (at !== -1) next[at] = 'done';
        else if (next[0] === 'running') next[0] = 'done';
        return next;
      });
    }, 2600);
    return () => window.clearTimeout(id);
  }, [status]);

  return (
    <div className="mini">
      <p className="mini-alert" data-clear={waiting ? undefined : ''}>
        <Avatar name={t.bot} size={28} />
        <strong>{t.bot}</strong>
        <span>{waiting ? t.alert : t.clear}</span>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            setStatus(initial());
            used('folders', 'reset');
          }}
        >
          ↻ {t.reset}
        </button>
      </p>
      <ul className="mini-jobs">
        {t.jobs.map((job, index) => (
          <li key={job.folder} data-status={status[index]}>
            <span className="mini-folder">{job.folder}</span>
            <strong>{job.title}</strong>
            {status[index] === 'waiting' ? (
              <span className="mini-ask">
                <code>
                  {t.bot} {job.ask}
                </code>
                <button
                  type="button"
                  className="app-btn app-btn--primary"
                  onClick={() => {
                    setStatus((prev) => prev.map((s, i) => (i === index ? 'running' : s)));
                    used('folders', 'approve');
                  }}
                >
                  {t.approve}
                </button>
              </span>
            ) : null}
            <span className="app-badge" data-tone={status[index]}>
              {t.status[status[index]!]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A pixel padlock; open when the Bot may edit the task. */
function Lock({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 10 12" width="12" height="14" shapeRendering="crispEdges" aria-hidden="true">
      <path
        d={open ? 'M2 0h4v1h1v2h-1v-2h-4v1h-1v4h-1v-5h1z' : 'M3 0h4v1h1v4h-1v-4h-4v4h-1v-4h1z'}
        fill="currentColor"
        transform={open ? 'translate(-1 0)' : undefined}
      />
      <path d="M1 5h8v7h-8zM4 7v3h2v-3z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Scheduled tasks: run now, lock against Bot edits, pause. */
function Schedules({ t }: { t: Demos['schedules'] }) {
  const [on, setOn] = useState(() => t.items.map(() => true));
  const [locked, setLocked] = useState(() => t.items.map((_, index) => index === 0));
  const [history, setHistory] = useState<{ name: string; time: string; manual?: boolean }[]>(
    t.initial,
  );
  const now = () => new Date().toTimeString().slice(0, 5);

  return (
    <div className="mini mini--split">
      <ul className="mini-schedules">
        {t.items.map((item, index) => (
          <li key={item.name} data-off={on[index] ? undefined : ''}>
            <span className="mini-schedule-text">
              <strong>{item.name}</strong>
              <span>
                <span className="app-badge" data-tone="info">
                  {item.when}
                </span>
                {locked[index] ? <span className="app-badge">{t.locked}</span> : null}
              </span>
              <small>{on[index] ? fill(t.next, { when: item.next }) : t.paused}</small>
            </span>
            <button
              type="button"
              className="mini-icon-btn"
              aria-label={`${t.runNow}: ${item.name}`}
              title={t.runNow}
              onClick={() => {
                setHistory((prev) =>
                  [{ name: item.name, time: now(), manual: true }, ...prev].slice(0, 5),
                );
                used('schedules', 'run');
              }}
            >
              ▶
            </button>
            <button
              type="button"
              className="mini-icon-btn"
              aria-pressed={locked[index]}
              aria-label={`${locked[index] ? t.unlock : t.lock}: ${item.name}`}
              title={locked[index] ? t.unlock : t.lock}
              onClick={() => {
                setLocked((prev) => prev.map((v, i) => (i === index ? !v : v)));
                used('schedules', 'lock');
              }}
            >
              <Lock open={!locked[index]} />
            </button>
            <button
              type="button"
              role="switch"
              className="mini-switch"
              aria-checked={on[index]}
              aria-label={`${t.enable}: ${item.name}`}
              onClick={() => {
                setOn((prev) => prev.map((v, i) => (i === index ? !v : v)));
                used('schedules', 'toggle');
              }}
            />
          </li>
        ))}
      </ul>
      <div className="mini-history">
        <p className="mini-label">{t.history}</p>
        <ol aria-live="polite">
          {history.map((h, index) => (
            <li key={history.length - index}>
              <time>{h.time}</time>
              <span>
                {fill(t.handled, { name: h.name })}
                {h.manual ? <small> · {t.manual}</small> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

type MobileStep = keyof Demos['mobile']['steps'];
const MOBILE_STEPS: MobileStep[] = ['pair', 'chat', 'approve', 'browser'];

/** A pairing code drawn like a QR code: three finder squares and seeded modules. */
function PairCode() {
  const size = 21;
  const cells = useMemo(() => {
    const out: [number, number][] = [];
    const finder = (x: number, y: number) =>
      (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
    const ring = (x: number, y: number, ox: number, oy: number) => {
      const dx = x - ox;
      const dy = y - oy;
      const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6;
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      return edge || core;
    };
    let seed = 1851;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        if (finder(x, y)) {
          const ox = x < 7 ? 0 : size - 7;
          const oy = y < 7 ? 0 : size - 7;
          if (ring(x, y, ox, oy)) out.push([x, y]);
        } else if (
          !(x <= 7 && y <= 7) &&
          !(x >= size - 8 && y <= 7) &&
          !(x <= 7 && y >= size - 8) &&
          seed % 100 < 48
        ) {
          out.push([x, y]);
        }
      }
    }
    return out;
  }, []);
  return (
    <svg viewBox={`-2 -2 ${size + 4} ${size + 4}`} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="-2" y="-2" width={size + 4} height={size + 4} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111" />
      ))}
    </svg>
  );
}

/** One Bot reply, streamed character by character; `**bold**` and `- ` lists render. */
function StreamedReply({ lines, run }: { lines: string[]; run: string }) {
  const parsed = useMemo(
    () =>
      lines.map((line) => {
        const item = line.startsWith('- ');
        const text = item ? line.slice(2) : line;
        const parts = text
          .split(/(\*\*[^*]+\*\*)/)
          .filter(Boolean)
          .map((part) =>
            part.startsWith('**')
              ? { text: part.slice(2, -2), bold: true }
              : { text: part, bold: false },
          );
        return { item, parts, length: parts.reduce((sum, p) => sum + p.text.length, 0) };
      }),
    [lines],
  );
  const total = parsed.reduce((sum, line) => sum + line.length, 0);
  // below zero the Bot is still thinking
  const [shown, setShown] = useState(-14);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(total);
      return;
    }
    setShown(-14);
    const id = window.setInterval(() => {
      setShown((n) => {
        if (n >= total) {
          window.clearInterval(id);
          return n;
        }
        return n + 2;
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [run, total]);

  if (shown < 0) {
    return (
      <span className="app-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    );
  }
  let left = shown;
  const blocks: { item: boolean; nodes: ReactNode[] }[] = [];
  parsed.forEach((line, index) => {
    if (left <= 0 && index > 0) return;
    const nodes: ReactNode[] = [];
    line.parts.forEach((part, at) => {
      if (left <= 0) return;
      const text = part.text.slice(0, left);
      left -= text.length;
      nodes.push(part.bold ? <strong key={at}>{text}</strong> : <span key={at}>{text}</span>);
    });
    blocks.push({ item: line.item, nodes });
  });
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i]!.item) {
      const items: ReactNode[] = [];
      while (i < blocks.length && blocks[i]!.item) {
        items.push(<li key={i}>{blocks[i]!.nodes}</li>);
        i++;
      }
      i--;
      out.push(<ul key={`list-${i}`}>{items}</ul>);
    } else {
      out.push(<p key={i}>{blocks[i]!.nodes}</p>);
    }
  }
  return <>{out}</>;
}

export function PhonePair({ t, onNext }: { t: Demos['mobile']; onNext: () => void }) {
  const [state, setState] = useState<'idle' | 'scanning' | 'paired'>('idle');
  useEffect(() => {
    if (state !== 'scanning') return;
    const id = window.setTimeout(() => setState('paired'), prefersReducedMotion() ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [state]);
  return (
    <div className="phone-page phone-pair">
      <h4 className="phone-title">{t.pair.title}</h4>
      <div className="phone-qr" data-state={state}>
        <PairCode />
        {state === 'scanning' ? <span className="phone-qr-scan" aria-hidden="true" /> : null}
        {state === 'paired' ? (
          <span className="phone-qr-done" aria-hidden="true">
            ✓
          </span>
        ) : null}
      </div>
      <div aria-live="polite">
        {state === 'paired' ? (
          <>
            <p className="phone-paired">
              <span className="app-badge" data-tone="ok">
                ✓ {t.pair.paired}
              </span>
            </p>
            <p className="phone-hint">{t.pair.pairedHint}</p>
          </>
        ) : (
          <>
            <p className="phone-hint">{t.pair.hint}</p>
            <p className="phone-hint phone-hint--soft">{t.pair.expires}</p>
          </>
        )}
      </div>
      <div className="phone-actions">
        {state === 'paired' ? (
          <>
            <button type="button" className="phone-btn phone-btn--primary" onClick={onNext}>
              {t.steps.chat} →
            </button>
            <button
              type="button"
              className="phone-btn"
              onClick={() => {
                setState('idle');
                used('mobile', 'pair_reset');
              }}
            >
              {t.pair.again}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="phone-btn phone-btn--primary"
            disabled={state === 'scanning'}
            onClick={() => {
              setState('scanning');
              used('mobile', 'pair');
            }}
          >
            {t.pair.scan}
          </button>
        )}
      </div>
    </div>
  );
}

function PhoneChat({ t, onApprove }: { t: Demos['mobile']; onApprove: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const row = open === null ? null : t.chat.rows[open]!;

  if (row) {
    const speaker = row.speaker ?? row.name;
    return (
      <div className="phone-page phone-thread">
        <div className="phone-thread-head">
          <button
            type="button"
            className="phone-back"
            aria-label={t.chat.back}
            onClick={() => setOpen(null)}
          >
            ‹
          </button>
          {row.members ? (
            <span className="phone-hash" aria-hidden="true">
              #
            </span>
          ) : (
            <Avatar name={row.name} size={24} />
          )}
          <strong>{row.name}</strong>
        </div>
        <ol className="phone-msgs" aria-live="polite">
          <li className="phone-msg phone-msg--me">
            <p className="app-bubble">{row.prompt}</p>
          </li>
          <li className="phone-msg">
            <Avatar name={speaker} size={24} />
            <div>
              {row.members ? <span className="app-msg-name">{speaker}</span> : null}
              <div className="app-bubble phone-md">
                <StreamedReply lines={row.reply ?? []} run={`${open}-${run}`} />
              </div>
            </div>
          </li>
        </ol>
        <div className="phone-composer" aria-hidden="true">
          <span>{t.chat.composer}</span>
          <span className="phone-send">↑</span>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-page phone-list">
      <h4 className="phone-title phone-title--large">{t.chat.title}</h4>
      <p className="phone-section">{t.chat.needsYou}</p>
      <ul className="phone-rows">
        {t.chat.rows.map((r, index) => (
          <li key={r.name}>
            <button
              type="button"
              data-status={r.status}
              onClick={() => {
                if (r.status === 'needs') {
                  onApprove();
                  used('mobile', 'open_request');
                  return;
                }
                setOpen(index);
                setRun((n) => n + 1);
                used('mobile', r.members ? 'open_group' : 'open_dm');
              }}
            >
              <span className="phone-row-avatar">
                {r.members ? (
                  <span className="phone-hash" aria-hidden="true">
                    #
                  </span>
                ) : (
                  <Avatar name={r.name} size={36} />
                )}
              </span>
              <span className="phone-row-text">
                <span className="phone-row-top">
                  <strong>{r.name}</strong>
                  <small>{r.time}</small>
                </span>
                <span className="phone-row-preview">
                  {r.preview}
                  {r.status === 'done' ? (
                    <span className="phone-row-glyph" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <nav className="phone-nav" aria-hidden="true">
        {t.chat.nav.map((label, index) => (
          <span key={label} data-on={index === 0 ? '' : undefined}>
            {label}
          </span>
        ))}
      </nav>
    </div>
  );
}

type Decision = keyof Demos['mobile']['approve']['results'];

function PhoneApprove({ t }: { t: Demos['mobile'] }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const a = t.approve;
  const decide = (value: Decision) => {
    setDecision(value);
    used('mobile', `approve_${value}`);
  };
  return (
    <div className="phone-page phone-lock">
      <p className="phone-lock-date">{a.date}</p>
      <p className="phone-lock-time" aria-hidden="true">
        9:41
      </p>
      <div className="phone-notice" data-answer={decision ?? undefined}>
        <p className="phone-notice-head">
          <PixelAvatar recipe={DEEPSEEKBOT_RECIPE} size={20} />
          <span>{a.app}</span>
          <small>{a.now}</small>
        </p>
        <strong>{a.title}</strong>
        <code>{a.body}</code>
      </div>
      <div aria-live="polite">
        {decision ? (
          <p className="phone-result" data-answer={decision}>
            {a.results[decision]}
          </p>
        ) : null}
      </div>
      {decision ? (
        <button type="button" className="phone-btn" onClick={() => setDecision(null)}>
          ↻ {a.again}
        </button>
      ) : (
        <>
          <div className="phone-notice-actions">
            <button type="button" onClick={() => decide('once')}>
              {a.allowOnce}
            </button>
            <button type="button" onClick={() => decide('always')}>
              {a.alwaysAllow}
            </button>
            <button type="button" data-tone="danger" onClick={() => decide('reject')}>
              {a.reject}
            </button>
          </div>
          <p className="phone-hint phone-hint--light">{a.inChat}</p>
        </>
      )}
    </div>
  );
}

function PhoneBrowser({ t }: { t: Demos['mobile'] }) {
  const b = t.browser;
  const [mine, setMine] = useState(false);
  const [mode, setMode] = useState<'tap' | 'trackpad'>('tap');
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="phone-page phone-browser" data-driver={mine ? 'you' : 'bot'}>
      <div className="phone-browser-head">
        <span className="phone-close" aria-hidden="true">
          ×
        </span>
        <span>
          <strong>{b.title}</strong>
          <small aria-live="polite">{mine ? b.youDriving : b.botDriving}</small>
        </span>
      </div>
      <div className="phone-view" aria-label={b.view} role="group">
        <div className="phone-site">
          <span className="phone-url">{b.url}</span>
          <strong>{b.heading}</strong>
          <ul>
            {b.plans.map((plan, index) => (
              <li key={plan.name}>
                <button
                  type="button"
                  disabled={!mine}
                  aria-pressed={picked === index}
                  onClick={() => {
                    setPicked(index);
                    used('mobile', `browser_${mode}`);
                  }}
                >
                  <span>{plan.name}</span>
                  <strong>{plan.price}</strong>
                  {picked === index && mine ? (
                    <small className="phone-tapped">
                      {mode === 'trackpad' ? '➤ ' : ''}
                      {b.tapped}
                    </small>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          {!mine ? <span className="phone-bot-cursor" aria-hidden="true" /> : null}
        </div>
      </div>
      <div className="phone-browser-bar">
        {mine ? (
          <div className="phone-segment" role="group">
            {(['tap', 'trackpad'] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m === 'tap' ? b.tap : b.trackpad}
              </button>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          className={mine ? 'phone-btn' : 'phone-btn phone-btn--primary'}
          onClick={() => {
            setMine((v) => !v);
            setPicked(null);
            used('mobile', mine ? 'hand_back' : 'take_over');
          }}
        >
          {mine ? b.resume : b.pause}
        </button>
      </div>
    </div>
  );
}

/** The phone app: pair, chat, decide an approval, take over the Browser. */
function Mobile({ t }: { t: Demos['mobile'] }) {
  const [step, setStep] = useState<MobileStep>('pair');
  const go = (next: MobileStep) => {
    setStep(next);
    used('mobile', `step_${next}`);
  };
  return (
    <div className="mobile-demo">
      <ol className="mobile-steps" aria-label={t.stepsLabel}>
        {MOBILE_STEPS.map((s, index) => (
          <li key={s}>
            <button type="button" aria-pressed={step === s} onClick={() => go(s)}>
              <span className="mobile-step-no">{index + 1}</span>
              <span>{t.steps[s]}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="phone" role="group" aria-label={t.phoneLabel}>
        <div className="phone-screen" data-screen={step}>
          <div className="phone-status" aria-hidden="true">
            <span>9:41</span>
            <span className="phone-island" />
            <span className="phone-signal">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="phone-body" key={step}>
            {step === 'pair' ? (
              <PhonePair t={t} onNext={() => go('chat')} />
            ) : step === 'chat' ? (
              <PhoneChat t={t} onApprove={() => go('approve')} />
            ) : step === 'approve' ? (
              <PhoneApprove t={t} />
            ) : (
              <PhoneBrowser t={t} />
            )}
          </div>
          <span className="phone-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function FeatureDemo({ copy, demo }: { copy: Copy; demo: keyof Demos }) {
  const d = copy.featureDemos;
  const body =
    demo === 'identity' ? (
      <Identity t={d.identity} />
    ) : demo === 'memory' ? (
      <Memory t={d.memory} />
    ) : demo === 'groups' ? (
      <Groups t={d.groups} />
    ) : demo === 'folders' ? (
      <Folders t={d.folders} />
    ) : demo === 'mobile' ? (
      <Mobile t={d.mobile} />
    ) : (
      <Schedules t={d.schedules} />
    );
  return (
    <figure className="feature-demo" data-demo={demo}>
      <div className={demo === 'mobile' ? 'app app--phone' : 'app app--mini'}>{body}</div>
      <figcaption>{d[demo].label}</figcaption>
    </figure>
  );
}
