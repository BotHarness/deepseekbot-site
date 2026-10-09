import { useEffect, useMemo, useState } from 'react';
import { track } from '../analytics';
import type { Copy } from '../content';
import type { FeatureDemoCopy } from '../demoCopy';
import { recipeFor } from '../mascot';
import { PixelAvatar } from './PixelAvatar';

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
    ) : (
      <Schedules t={d.schedules} />
    );
  return (
    <figure className="feature-demo">
      <div className="app app--mini">{body}</div>
      <figcaption>{d[demo].label}</figcaption>
    </figure>
  );
}
