import {
  Check,
  ChevronDown,
  CircleCheck,
  FileText,
  Layers,
  ListTodo,
  Plug,
  Search,
  Terminal,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { PREVIEW_MODELS, type ModelId, type PreviewCopy, type PreviewModel } from '../previewCopy';

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
      {model.source === 'subscription' ? <Plug size={12} aria-hidden="true" /> : null}
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
  const [filter, setFilter] = useState<'all' | 'api' | 'subscription'>('all');
  const modelOptions = (
    <div className="preview-model-menu">
      <label className="preview-model-search">
        <Search size={14} aria-hidden="true" />
        <input
          value={search}
          placeholder={t.search}
          aria-label={t.search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <div className="preview-filters" role="group" aria-label={t.catalog}>
        {(['all', 'api', 'subscription'] as const).map((key) => (
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
      <ul className="preview-list">
        {PREVIEW_MODELS.filter(
          (model) =>
            (filter === 'all' || filter === model.source) &&
            (model.name + ' ' + source(model, t))
              .toLowerCase()
              .includes(search.trim().toLowerCase()),
        ).map((model) => (
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
              {model.source === 'api' ? (
                <Layers size={15} aria-hidden="true" />
              ) : (
                <Plug size={15} aria-hidden="true" />
              )}
              <span>
                <strong>{model.name}</strong>
                <ModelSource model={model} t={t} />
              </span>
              {role && draft[role] === model.id ? <Check size={16} aria-hidden="true" /> : null}
            </button>
          </li>
        ))}
      </ul>
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
            <Layers size={15} aria-hidden="true" />
            <span>
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
          (['main', 'task'] as const).map((key) => (
            <section key={key} className="preview-model-section">
              <strong>{t[key]}</strong>
              <button
                type="button"
                className="preview-model-row preview-model-field"
                aria-label={t[key] + ' · ' + previewModel(draft[key]).name}
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
                <span>
                  <strong>{previewModel(draft[key]).name}</strong>
                  <ModelSource model={previewModel(draft[key])} t={t} />
                </span>
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {role === key ? modelOptions : null}
            </section>
          ))
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

export function PreviewSessionDetail({ t, isTeam }: { t: PreviewCopy; isTeam: boolean }) {
  const model = isTeam ? PREVIEW_MODELS[0] : PREVIEW_MODELS[2];
  const path = isTeam ? 'content/pricing.md' : 'research/README.md';

  return (
    <div className="preview-detail">
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
      </div>
    </div>
  );
}
