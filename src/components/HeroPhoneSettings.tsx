import {
  AppWindow,
  ArrowDownToLine,
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleUserRound,
  Contrast,
  Cpu,
  Globe,
  HardDrive,
  Hash,
  Image,
  Info,
  MessageSquare,
  Smartphone,
  TextQuote,
} from 'lucide-react';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { Lang } from '../content';
import { HERO_COPY } from '../heroCopy';
import { VERSION } from '../installRelease';
import { PREVIEW_COPY, type ModelId } from '../previewCopy';
import { HeroPhoneModelPicker } from './HeroPhoneProfile';
import { previewModel } from './HeroPreviewPanels';
import { PreviewModelIcon } from './PreviewModelIcon';

export type PhoneSettingsPage = 'root' | 'account' | 'usage' | 'models' | 'model';
const DAILY_USAGE = [1.8, 8.6, 3.1, 11.4, 6.7, 14.2, 12];
const WEEK_TOTAL = DAILY_USAGE.reduce((total, day) => total + day, 0).toFixed(1);
const DAILY_PEAK = Math.max(...DAILY_USAGE);

function SettingsRow({
  icon,
  label,
  detail,
  onOpen,
  route,
}: {
  icon?: ReactNode;
  label: string;
  detail?: string;
  onOpen?: () => void;
  route?: PhoneSettingsPage;
}) {
  const content = (
    <>
      {icon ? (
        <span className="hero-settings-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="hero-settings-label">
        <span>{label}</span>
        {detail ? <small>{detail}</small> : null}
      </span>
      {onOpen ? (
        <ChevronRight size={15} className="hero-settings-chevron" aria-hidden="true" />
      ) : null}
    </>
  );
  return onOpen ? (
    <button
      className="hero-settings-row"
      type="button"
      data-settings-route={route}
      onClick={onOpen}
    >
      {content}
    </button>
  ) : (
    <div className="hero-settings-row">{content}</div>
  );
}

export function HeroPhoneSettings({
  lang,
  page,
  onPage,
  defaultModel,
  onModel,
}: {
  lang: Lang;
  page: PhoneSettingsPage;
  onPage: (page: PhoneSettingsPage) => void;
  defaultModel: ModelId;
  onModel: (model: ModelId) => void;
}) {
  const t = PREVIEW_COPY[lang];
  const p = t.mobileSettings;
  const model = previewModel(defaultModel);
  const heading = page === 'root' ? HERO_COPY[lang].settings : p[page];
  const feed = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<PhoneSettingsPage | undefined>(undefined);
  const goBack = () => {
    returnTo.current = page;
    onPage(page === 'model' ? 'models' : 'root');
  };
  useLayoutEffect(() => {
    const previous = returnTo.current;
    returnTo.current = undefined;
    const target = previous
      ? feed.current?.querySelector<HTMLButtonElement>(`[data-settings-route="${previous}"]`)
      : back.current;
    target?.focus();
  }, [page]);

  const usage = (
    <>
      <span className="hero-settings-usage-head">
        <strong>{p.usage}</strong>
        <span>{p.lastWeek}</span>
        {page === 'root' ? (
          <ChevronRight size={14} className="hero-settings-chevron" aria-hidden="true" />
        ) : null}
      </span>
      <span className="hero-settings-usage-total">
        <strong>{WEEK_TOTAL}K</strong> tokens
      </span>
      <span className="hero-settings-usage-chart" aria-hidden="true">
        {DAILY_USAGE.map((amount, index) => (
          <span key={p.days[index]}>
            <i style={{ height: (amount / DAILY_PEAK) * 30 }} />
            <small>{p.days[index]}</small>
          </span>
        ))}
      </span>
    </>
  );

  return (
    <section
      className="hero-phone-page hero-phone-settings"
      aria-label={heading}
      data-page={page}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && page !== 'root') {
          event.stopPropagation();
          goBack();
        }
      }}
    >
      {page !== 'root' ? (
        <header className="hero-phone-profile-head">
          <button
            ref={back}
            type="button"
            className="hero-phone-back"
            aria-label={t.back}
            onClick={goBack}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <strong>{heading}</strong>
        </header>
      ) : null}
      <div className="hero-phone-page-feed hero-settings-feed" key={page} ref={feed}>
        {page === 'root' ? (
          <>
            <h3>{heading}</h3>
            <div className="hero-settings-card">
              <SettingsRow
                icon={<b className="hero-settings-initial">H</b>}
                label="Human"
                detail={p.signedOut}
                route="account"
                onOpen={() => onPage('account')}
              />
            </div>
            <button
              type="button"
              className="hero-settings-card hero-settings-usage"
              data-settings-route="usage"
              onClick={() => onPage('usage')}
            >
              {usage}
            </button>
            <section>
              <h4>{p.models}</h4>
              <div className="hero-settings-card">
                <SettingsRow
                  icon={<Cpu />}
                  label={p.models}
                  detail={p.model}
                  route="models"
                  onOpen={() => onPage('models')}
                />
                <SettingsRow icon={<TextQuote />} label={p.prompts} detail={p.promptHint} />
              </div>
            </section>
            <div className="hero-settings-card">
              <SettingsRow icon={<Bell />} label={p.notifications} />
              <SettingsRow icon={<HardDrive />} label={p.storage} detail={p.storageHint} />
            </div>
            <section>
              <h4>{p.interface}</h4>
              <div className="hero-settings-card">
                <SettingsRow icon={<Globe />} label={p.language} detail={p.locale} />
                <SettingsRow icon={<Contrast />} label={p.appearance} detail={p.system} />
                <SettingsRow icon={<MessageSquare />} label={p.display} />
                <SettingsRow icon={<ArrowDownToLine />} label={p.sendJump} />
                <SettingsRow icon={<Cpu />} label={p.headerModel} />
                <SettingsRow icon={<AppWindow />} label={p.appIcon} />
                <SettingsRow icon={<Hash />} label={p.activityCount} />
                <SettingsRow icon={<Image />} label={p.background} />
                <SettingsRow icon={<Smartphone />} label={p.haptics} />
                <SettingsRow icon={<CircleCheck />} label={p.receipts} />
              </div>
            </section>
            <section>
              <h4>{p.about}</h4>
              <div className="hero-settings-card">
                <SettingsRow icon={<Info />} label={p.version} detail={VERSION} />
              </div>
            </section>
          </>
        ) : page === 'account' ? (
          <>
            <section>
              <h4>{p.chatIdentity}</h4>
              <div className="hero-settings-card">
                <SettingsRow icon={<CircleUserRound />} label={p.name} detail="Human" />
              </div>
            </section>
            <section>
              <h4>{p.tobsAccount}</h4>
              <div className="hero-settings-card">
                <SettingsRow label={p.signedOut} />
              </div>
            </section>
          </>
        ) : page === 'usage' ? (
          <>
            <div className="hero-settings-card hero-settings-usage">{usage}</div>
            <div className="hero-settings-card">
              {DAILY_USAGE.map((amount, index) => (
                <SettingsRow
                  key={p.days[index]}
                  label={p.days[index]!}
                  detail={`${amount.toFixed(1)}K tokens`}
                />
              ))}
            </div>
          </>
        ) : page === 'models' ? (
          <section>
            <h4>{p.model}</h4>
            <div className="hero-settings-card">
              <SettingsRow
                icon={<PreviewModelIcon brand={model.brand} />}
                label={p.model}
                detail={model.name}
                route="model"
                onOpen={() => onPage('model')}
              />
            </div>
            <p className="preview-hint">{p.modelHint}</p>
          </section>
        ) : (
          <HeroPhoneModelPicker
            t={t}
            selected={defaultModel}
            onSelect={(id) => {
              onModel(id);
              goBack();
            }}
          />
        )}
      </div>
    </section>
  );
}
