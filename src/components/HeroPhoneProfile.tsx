import {
  Bell,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  Folder,
  Image,
  Layers2,
  Search,
  Settings,
  TextQuote,
  User,
  Users,
} from 'lucide-react';
import { useState, type ReactNode, type Ref } from 'react';
import { PREVIEW_MODELS, type ModelId, type PreviewCopy } from '../previewCopy';
import { ModelSource, previewModel, type ModelPlan } from './HeroPreviewPanels';
import { PreviewModelIcon } from './PreviewModelIcon';

export type PhoneProfilePage = 'profile' | 'models' | 'main' | 'task';
export type PhoneProfileTab = keyof PreviewCopy['phoneProfile']['tabs'];
const TAB_ICONS = {
  work: TextQuote,
  memory: Brain,
  files: Folder,
  routines: Clock,
  settings: Settings,
  members: Users,
};
const BOT_TABS = ['work', 'memory', 'files', 'routines', 'settings'] as const;
const GROUP_TABS = ['members', 'files', 'work', 'settings'] as const;
const API_MODELS = PREVIEW_MODELS.filter((model) => model.source === 'api');

function PhoneModelPicker({
  t,
  selected,
  onSelect,
}: {
  t: PreviewCopy;
  selected: ModelId;
  onSelect: (id: ModelId) => void;
}) {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<'all' | 'deepseek' | 'openai'>('all');
  const query = search.trim().toLowerCase();
  const shown = API_MODELS.filter(
    (model) =>
      (brand === 'all' || model.brand === brand) &&
      `${model.name} ${model.provider}`.toLowerCase().includes(query),
  );
  return (
    <>
      <label className="preview-model-search hero-phone-model-search">
        <Search size={15} aria-hidden="true" />
        <input
          aria-label={t.search}
          placeholder={t.search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <div className="hero-phone-model-families" role="group" aria-label={t.catalog}>
        {(['all', 'deepseek', 'openai'] as const).map((family) => (
          <button
            type="button"
            key={family}
            aria-pressed={family === brand}
            onClick={() => setBrand(family)}
          >
            {family === 'all' ? (
              <Layers2 size={14} aria-hidden="true" />
            ) : (
              <PreviewModelIcon brand={family} />
            )}
            {family === 'all' ? t.all : family === 'deepseek' ? 'DeepSeek' : 'OpenAI'}
          </button>
        ))}
      </div>
      {shown.length === 0 ? <p className="preview-hint">{t.noModels}</p> : null}
      <div className="hero-phone-profile-rows">
        {shown.map((model) => (
          <button
            type="button"
            className="hero-phone-profile-row"
            key={model.id}
            aria-pressed={model.id === selected}
            onClick={() => onSelect(model.id)}
          >
            <PreviewModelIcon brand={model.brand} />
            <span className="hero-phone-settings-label">
              <strong>{model.name}</strong>
              <ModelSource model={model} t={t} />
            </span>
            {model.id === selected ? <Check size={16} aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
    </>
  );
}

export function HeroPhoneProfile({
  t,
  title,
  avatar,
  group,
  tab,
  onTab,
  page,
  plan,
  onPage,
  onSelect,
  onBack,
  backRef,
  members,
  content,
}: {
  t: PreviewCopy;
  title: string;
  avatar: ReactNode;
  group: boolean;
  tab: PhoneProfileTab;
  onTab: (tab: PhoneProfileTab) => void;
  page: PhoneProfilePage;
  plan: ModelPlan;
  onPage: (page: PhoneProfilePage) => void;
  onSelect: (plan: ModelPlan) => void;
  onBack: () => void;
  backRef: Ref<HTMLButtonElement>;
  members?: ReactNode;
  content?: ReactNode;
}) {
  const copy = t.phoneProfile;
  const main = previewModel(plan.main);
  const tabs = group ? GROUP_TABS : BOT_TABS;
  const pageTitle = page === 'profile' ? title : copy[page];
  return (
    <section className="app-pane preview-panel hero-phone-profile" aria-label={pageTitle}>
      <header className="hero-phone-profile-head">
        <button
          ref={backRef}
          className="hero-phone-back"
          type="button"
          aria-label={t.back}
          onClick={onBack}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        {page !== 'profile' ? <strong>{pageTitle}</strong> : null}
      </header>
      {page === 'profile' ? (
        <>
          <div className="hero-phone-profile-identity">
            <span aria-hidden="true">{avatar}</span>
            <strong>{title}</strong>
          </div>
          <div className="hero-phone-profile-tabs" role="group" aria-label={copy.sections}>
            {tabs.map((name) => {
              const Glyph = TAB_ICONS[name];
              return (
                <button
                  type="button"
                  key={name}
                  title={copy.tabs[name]}
                  aria-label={copy.tabs[name]}
                  aria-pressed={tab === name}
                  onClick={() => onTab(name)}
                >
                  <Glyph size={18} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <div className="hero-phone-profile-body">
            <h3>{copy.tabs[tab]}</h3>
            {tab === 'members' ? (
              members
            ) : tab === 'settings' ? (
              group ? (
                <p className="preview-hint">{t.teamScope}</p>
              ) : (
                <>
                  <h4>Bot</h4>
                  <div className="hero-phone-profile-rows">
                    <div className="hero-phone-profile-row">
                      <User size={16} aria-hidden="true" />
                      <span>{copy.name}</span>
                      <small>{title}</small>
                    </div>
                    <button
                      type="button"
                      className="hero-phone-profile-row"
                      data-profile-focus="models"
                      onClick={() => onPage('models')}
                    >
                      <Cpu size={16} aria-hidden="true" />
                      <span>{t.modelPicker}</span>
                      <small>{main.name}</small>
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                    <div className="hero-phone-profile-row">
                      <Image size={16} aria-hidden="true" />
                      <span>{copy.background}</span>
                      <small>{copy.defaults}</small>
                    </div>
                    <div className="hero-phone-profile-row">
                      <Bell size={16} aria-hidden="true" />
                      <span>{copy.notifications}</span>
                      <small>{copy.defaults}</small>
                    </div>
                  </div>
                </>
              )
            ) : (
              content
            )}
          </div>
        </>
      ) : (
        <div className="hero-phone-profile-body">
          {page === 'models' ? (
            <>
              <p className="preview-hint">{copy.modelHint}</p>
              <div className="hero-phone-profile-rows">
                {(['main', 'task'] as const).map((role) => {
                  const model = previewModel(plan[role]);
                  return (
                    <button
                      key={role}
                      type="button"
                      className="hero-phone-profile-row"
                      data-profile-focus={role}
                      onClick={() => onPage(role)}
                    >
                      <PreviewModelIcon brand={model.brand} />
                      <span className="hero-phone-settings-label">
                        <strong>{copy[role]}</strong>
                        <small>{model.name}</small>
                      </span>
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <PhoneModelPicker
              key={page}
              t={t}
              selected={plan[page]}
              onSelect={(id) => onSelect({ ...plan, [page]: id })}
            />
          )}
        </div>
      )}
    </section>
  );
}
