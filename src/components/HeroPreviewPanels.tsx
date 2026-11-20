import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  FileText,
  Layers2,
  ListTodo,
  Package,
  Paperclip,
  Search,
  Terminal,
} from 'lucide-react';
import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import type { DemoMemoryEntry } from '../demoMemory';
import { PREVIEW_MODELS, type ModelId, type PreviewCopy, type PreviewModel } from '../previewCopy';
import { PreviewModelIcon } from './PreviewModelIcon';

type Role = 'main' | 'task';
export type ModelPlan = Record<Role, ModelId>;
export const DEFAULT_PREVIEW_MODELS: ModelPlan = { main: 'deepseek', task: 'opencode' };
const PRESET: ModelPlan = { main: 'claude', task: 'codex' };

export function previewModel(id: ModelId) {
  return PREVIEW_MODELS.find((model) => model.id === id)!;
}

function source(model: PreviewModel, t: PreviewCopy) {
  return model.provider + ' · ' + (model.source === 'api' ? t.api : t.plans[model.id]);
}

export function ModelSource({ model, t }: { model: PreviewModel; t: PreviewCopy }) {
  return (
    <span className="preview-model-source">
      {'providerBrand' in model ? <PreviewModelIcon brand={model.providerBrand} /> : null}
      {source(model, t)}
    </span>
  );
}

export function PreviewModelDialog({
  t,
  plan,
  onSave,
  onCancel,
}: {
  t: PreviewCopy;
  plan: ModelPlan;
  onSave: (plan: ModelPlan) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(plan);
  const [preset, setPreset] = useState(false);
  const [role, setRole] = useState<Role | null>('main');
  const [search, setSearch] = useState('');
  const roleButtons = useRef<Partial<Record<Role, HTMLButtonElement>>>({});
  const [filter, setFilter] = useState<ModelId | 'all'>('all');
  const matches = PREVIEW_MODELS.filter(
    (model) =>
      (filter === 'all' || filter === model.id) &&
      (model.name + ' ' + source(model, t)).toLowerCase().includes(search.trim().toLowerCase()),
  );
  const modelOptions = (
    <div className="preview-model-menu">
      <div className="preview-filters" role="group" aria-label={t.catalog}>
        <button
          type="button"
          aria-label={t.all}
          title={t.all}
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          <Layers2 size={16} aria-hidden="true" />
        </button>
        {PREVIEW_MODELS.map((model) => (
          <button
            type="button"
            key={model.id}
            aria-label={source(model, t)}
            title={source(model, t)}
            aria-pressed={filter === model.id}
            onClick={() => setFilter(model.id)}
          >
            <PreviewModelIcon
              brand={'providerBrand' in model ? model.providerBrand : model.brand}
              subscription={model.source === 'subscription'}
            />
          </button>
        ))}
      </div>
      <div className="preview-model-results">
        <label className="preview-model-search">
          <Search size={14} aria-hidden="true" />
          <input
            value={search}
            placeholder={t.search}
            aria-label={t.search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        {matches.length === 0 ? <p className="preview-hint">{t.noModels}</p> : null}
        <ul className="preview-list">
          {matches.map((model) => (
            <li key={model.id}>
              <button
                type="button"
                className="preview-model-row"
                aria-pressed={role ? draft[role] === model.id : false}
                onClick={() => {
                  if (!role) return;
                  setDraft({ ...draft, [role]: model.id });
                  setRole(null);
                  setSearch('');
                  roleButtons.current[role]?.focus();
                }}
              >
                <PreviewModelIcon
                  brand={model.brand}
                  subscription={model.source === 'subscription'}
                />
                <span className="preview-model-label">
                  <strong>{model.name}</strong>
                  <ModelSource model={model} t={t} />
                </span>
                {role && draft[role] === model.id ? <Check size={16} aria-hidden="true" /> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="preview-model-fields">
        <div className="preview-segments" role="group" aria-label={t.modelPicker}>
          <button type="button" aria-pressed={!preset} onClick={() => setPreset(false)}>
            {t.specific}
          </button>
          <button type="button" aria-pressed={preset} onClick={() => setPreset(true)}>
            {t.presets}
          </button>
        </div>
        {preset ? (
          <button
            type="button"
            className="preview-model-row preview-model-field"
            aria-pressed={draft.main === PRESET.main && draft.task === PRESET.task}
            onClick={() => setDraft(PRESET)}
          >
            <Package size={15} aria-hidden="true" />
            <span className="preview-model-label">
              <strong>{t.preset}</strong>
              <small>
                {t.main} · Opus 5.5 / {t.task} · GPT-6.1 Sol
              </small>
            </span>
            {draft.main === PRESET.main && draft.task === PRESET.task ? (
              <Check size={16} aria-hidden="true" />
            ) : null}
          </button>
        ) : (
          (['main', 'task'] as const).map((key) => {
            const model = previewModel(draft[key]);
            return (
              <section key={key} className="preview-model-section">
                <strong>{t[key]}</strong>
                <button
                  type="button"
                  className="preview-model-row preview-model-field"
                  aria-label={t[key] + ' · ' + model.name}
                  aria-expanded={role === key}
                  ref={(button) => {
                    if (button) roleButtons.current[key] = button;
                    else delete roleButtons.current[key];
                  }}
                  onClick={() => {
                    setRole(role === key ? null : key);
                    setFilter('all');
                    setSearch('');
                  }}
                >
                  <PreviewModelIcon
                    brand={model.brand}
                    subscription={model.source === 'subscription'}
                  />
                  <span className="preview-model-label">
                    <strong>{model.name}</strong>
                    <ModelSource model={model} t={t} />
                  </span>
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                {role === key ? modelOptions : null}
              </section>
            );
          })
        )}
        <p className="preview-hint">{t.catalog}</p>
      </div>
      <footer className="preview-model-actions">
        <button type="button" className="app-btn" onClick={onCancel}>
          {t.cancel}
        </button>
        <button type="button" className="app-btn preview-save" onClick={() => onSave(draft)}>
          {t.save}
        </button>
      </footer>
    </>
  );
}

export function PreviewSessionDetail({
  t,
  isTeam,
  messages,
  composer,
}: {
  t: PreviewCopy;
  isTeam: boolean;
  messages: readonly string[];
  composer?: {
    draft: string;
    sendLabel: string;
    onChange: (value: string) => void;
    onSend: () => void;
  };
}) {
  const model = isTeam ? PREVIEW_MODELS[0] : PREVIEW_MODELS[2];
  const path = isTeam ? 'content/pricing.md' : 'research/README.md';
  const transcript = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const node = transcript.current;
    if (node && messages.length) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  return (
    <>
      <div className="preview-detail" ref={transcript}>
        <div className="preview-session-heading">
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
                <code>
                  {isTeam
                    ? 'check-links content/pricing.md\n2 passed, 1 stale: /plans/annual-2025'
                    : 'git diff --check\nNo whitespace errors'}
                </code>
              </pre>
            </details>
          </details>
          <p className="preview-result">{isTeam ? t.result : t.localResult}</p>
          <div role="log" aria-label={t.assignment}>
            {messages.map((message, index) => (
              <div key={index}>
                <p className="preview-instruction">{message}</p>
                <p className="preview-result">{t.sessionReply}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {composer ? (
        <form
          className="app-composer preview-session-composer"
          aria-label={t.sessionComposer}
          onSubmit={(event) => {
            event.preventDefault();
            composer.onSend();
            input.current?.focus();
          }}
        >
          <Paperclip className="app-composer-plus" size={16} aria-hidden="true" />
          <textarea
            ref={input}
            rows={1}
            maxLength={1000}
            value={composer.draft}
            aria-label={t.sessionComposer}
            onChange={(event) => composer.onChange(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key !== 'Enter' ||
                event.shiftKey ||
                event.nativeEvent.isComposing ||
                event.nativeEvent.keyCode === 229
              )
                return;
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
          />
          <button
            className="app-send"
            type="submit"
            aria-label={composer.sendLabel}
            disabled={!composer.draft.trim()}
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </form>
      ) : null}
    </>
  );
}

export function PreviewMemoryReader({
  t,
  entry,
  backRef,
  onBack,
  backLabel = t.backToChat,
}: {
  t: PreviewCopy;
  entry: DemoMemoryEntry;
  backRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  backLabel?: string;
}) {
  let oldLine = 0;
  let newLine = 0;
  const rows =
    entry.kind === 'commit'
      ? entry.lines.map((line) => {
          const sign = line[0];
          return {
            oldNumber: sign === '+' ? null : ++oldLine,
            newNumber: sign === '-' ? null : ++newLine,
            sign,
            text: line.slice(1),
          };
        })
      : [];
  return (
    <section
      className="preview-memory-reader"
      aria-label={entry.kind === 'file' ? entry.path : t.commitDiff}
    >
      <header className="app-pane-head preview-memory-header">
        <button
          className="app-icon-btn"
          type="button"
          ref={backRef}
          aria-label={backLabel}
          title={backLabel}
          onClick={onBack}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        {entry.kind === 'commit' ? <code className="preview-memory-sha">{entry.sha}</code> : null}
        <strong>{entry.kind === 'file' ? entry.path : entry.title}</strong>
      </header>
      <div className="preview-memory-content">
        {entry.kind === 'file' ? (
          <pre className="preview-memory-file">
            <code>{entry.text}</code>
          </pre>
        ) : (
          <>
            <p className="preview-memory-changes">{t.changedFiles} · 1</p>
            <details open className="preview-memory-diff">
              <summary>
                <ChevronDown size={16} aria-hidden="true" />
                <strong>{entry.path}</strong>
                <span className="preview-memory-diff-count">
                  <span className="mini-add">
                    +{entry.lines.filter((line) => line.startsWith('+')).length}
                  </span>{' '}
                  <span className="mini-del">
                    −{entry.lines.filter((line) => line.startsWith('-')).length}
                  </span>
                </span>
              </summary>
              <pre>
                <code>
                  <span className="preview-memory-hunk">{entry.hunk}</span>
                  {rows.map(({ oldNumber, newNumber, sign, text }, index) => (
                    <span
                      key={index}
                      className="preview-memory-line"
                      data-change={sign === '+' ? 'added' : sign === '-' ? 'removed' : undefined}
                    >
                      <span className="preview-memory-line-number" aria-hidden="true">
                        {oldNumber}
                      </span>
                      <span className="preview-memory-line-number" aria-hidden="true">
                        {newNumber}
                      </span>
                      <span>{sign}</span>
                      <span>{text}</span>
                    </span>
                  ))}
                </code>
              </pre>
            </details>
          </>
        )}
      </div>
    </section>
  );
}
