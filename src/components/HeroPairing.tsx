import {
  Check,
  ChevronLeft,
  Laptop,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Wifi,
  X,
} from 'lucide-react';
import type { Lang } from '../content';
import { HERO_PAIRING_COPY } from '../heroPairingCopy';
import { PairCode } from './FeatureDemos';

type PairMethod = 'lan' | 'tailscale';
export type PairStep = 'method' | 'prepare' | 'code' | 'scan' | 'verify' | 'approve' | 'paired';
export type PairState = { step: PairStep; method: PairMethod };
type PairProps = {
  lang: Lang;
  computer: string;
  state: PairState;
  onChange: (step: PairStep, method?: PairMethod) => void;
  onFinish: () => void;
};

const FINGERPRINT = '7C4A 19E2 3F86 B0D5';

export function HeroPairingDialog({ lang, computer, state, onChange, onFinish }: PairProps) {
  const t = HERO_PAIRING_COPY[lang];
  const { step, method } = state;
  const current = step === 'method' ? 0 : step === 'prepare' ? 1 : 2;
  const methodName = method === 'lan' ? t.lan : 'Tailscale';
  const showCode = step === 'code' || step === 'scan';
  const verified = step === 'verify' || step === 'approve';
  return (
    <div className="hero-pair-overlay">
      <section className="hero-pair-dialog app-pane" role="dialog" aria-label={t.title}>
        <header>
          {current > 0 && step !== 'paired' ? (
            <button
              type="button"
              className="app-icon-btn"
              aria-label={t.back}
              onClick={() => onChange(current === 1 ? 'method' : 'prepare')}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
          ) : null}
          <strong>{t.title}</strong>
          <button type="button" className="app-icon-btn" aria-label={t.close} onClick={onFinish}>
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="hero-pair-dialog-body">
          <ol className="hero-pair-steps" aria-label={t.progress}>
            {t.steps.map((name, index) => (
              <li
                key={name}
                aria-current={index === current ? 'step' : undefined}
                data-reached={index <= current ? '' : undefined}
              >
                <span aria-hidden="true">
                  {index < current || step === 'paired' ? <Check size={12} /> : index + 1}
                </span>
                {name}
              </li>
            ))}
          </ol>
          {step === 'method' ? (
            <>
              <h4 data-pair-focus tabIndex={-1}>
                {t.choose}
              </h4>
              <div className="hero-pair-choices">
                <button type="button" onClick={() => onChange('prepare', 'lan')}>
                  <Wifi size={18} aria-hidden="true" />
                  <span>
                    <strong>{t.lan}</strong>
                    <small>{t.lanHint}</small>
                  </span>
                </button>
                <button type="button" onClick={() => onChange('prepare', 'tailscale')}>
                  <ShieldCheck size={18} aria-hidden="true" />
                  <span>
                    <strong>Tailscale</strong>
                    <small>{t.tailscaleHint}</small>
                  </span>
                </button>
              </div>
            </>
          ) : step === 'prepare' ? (
            <>
              <h4 data-pair-focus tabIndex={-1}>
                {t.prepare}
              </h4>
              <div className="hero-pair-ready">
                <ShieldCheck size={18} aria-hidden="true" />
                <div>
                  <strong>
                    {methodName} · {t.ready}
                  </strong>
                  <p>{method === 'lan' ? t.lanReady : t.tailscaleReady}</p>
                </div>
              </div>
              <button
                type="button"
                className="app-btn hero-pair-primary"
                onClick={() => onChange('code')}
              >
                {t.next}
              </button>
            </>
          ) : showCode ? (
            <div className="hero-pair-code">
              <h4 data-pair-focus tabIndex={-1}>
                {t.code}
              </h4>
              <div className="hero-pair-qr" role="img" aria-label={t.qrLabel}>
                <PairCode />
              </div>
              <small>
                {computer} · {methodName}
              </small>
              {step === 'code' ? (
                <button
                  type="button"
                  className="app-btn hero-pair-primary"
                  onClick={() => onChange('scan')}
                >
                  {t.openScanner}
                </button>
              ) : null}
            </div>
          ) : verified ? (
            <>
              <h4 data-pair-focus tabIndex={-1}>
                {step === 'verify' ? t.verify : t.approve}
              </h4>
              <div className="hero-pair-ready">
                <Smartphone size={18} aria-hidden="true" />
                <div>
                  <strong>{t.phone}</strong>
                  <p>{t.verifyHint}</p>
                </div>
              </div>
              <code className="hero-pair-fingerprint">{FINGERPRINT}</code>
              {step === 'approve' ? (
                <button
                  type="button"
                  className="app-btn hero-pair-primary"
                  onClick={() => onChange('paired')}
                >
                  {t.approve}
                </button>
              ) : null}
            </>
          ) : (
            <>
              <h4 data-pair-focus tabIndex={-1}>
                {t.paired}
              </h4>
              <div className="hero-pair-ready">
                <Check size={18} aria-hidden="true" />
                {t.phone}
              </div>
              <button type="button" className="app-btn hero-pair-primary" onClick={onFinish}>
                {t.done}
              </button>
            </>
          )}
          <small className="hero-pair-note">{t.demo}</small>
        </div>
      </section>
    </div>
  );
}

export function HeroPairingPhone({ lang, computer, state, onChange, onFinish }: PairProps) {
  const t = HERO_PAIRING_COPY[lang];
  const { step } = state;
  const camera = step === 'code' || step === 'scan';
  const waitingForCode = step === 'method' || step === 'prepare';
  const title =
    step === 'verify'
      ? t.verify
      : step === 'approve'
        ? t.waiting
        : step === 'paired'
          ? t.paired
          : t.phoneTitle;
  return (
    <section className="hero-pair-phone" aria-label={t.phoneTitle}>
      <header className="hero-phone-profile-head">
        {step === 'scan' || step === 'verify' ? (
          <button
            type="button"
            className="hero-phone-back"
            aria-label={t.back}
            onClick={() => onChange('code')}
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
        ) : null}
        <strong>{t.phoneTitle}</strong>
      </header>
      <div className="hero-pair-phone-content">
        {camera ? (
          <>
            <p data-pair-focus tabIndex={-1}>
              {t.scanHint}
            </p>
            <div
              className="hero-pair-camera"
              data-scanning={step === 'scan' ? '' : undefined}
              aria-hidden="true"
            >
              <div className="hero-pair-qr">
                <PairCode />
              </div>
              <ScanLine size={174} strokeWidth={1} />
            </div>
            <button
              type="button"
              className="app-btn hero-pair-primary"
              onClick={() => onChange('verify')}
            >
              {t.scan}
            </button>
          </>
        ) : (
          <>
            {step === 'paired' ? (
              <Check size={37} aria-hidden="true" />
            ) : (
              <Laptop size={37} aria-hidden="true" />
            )}
            <h4 data-pair-focus tabIndex={-1}>
              {title}
            </h4>
            <p>{waitingForCode ? t.waitingForCode : computer}</p>
            {step === 'verify' || step === 'approve' ? (
              <>
                <p>{t.verifyHint}</p>
                <code className="hero-pair-fingerprint">{FINGERPRINT}</code>
              </>
            ) : null}
            {step === 'verify' ? (
              <button
                type="button"
                className="app-btn hero-pair-primary"
                onClick={() => onChange('approve')}
              >
                {t.match}
              </button>
            ) : step === 'paired' ? (
              <button type="button" className="app-btn hero-pair-primary" onClick={onFinish}>
                {t.done}
              </button>
            ) : null}
          </>
        )}
        <small className="hero-pair-note">{t.demo}</small>
      </div>
    </section>
  );
}
