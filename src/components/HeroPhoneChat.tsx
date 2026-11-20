import { ArrowUp, ChevronLeft, Ellipsis, Hash, Mic, Plus } from 'lucide-react';
import { useEffect, type FormEvent, type MouseEvent, type ReactNode, type RefObject } from 'react';

/** Web presentation of the native chat chrome; the parent owns the shared conversation. */
export function HeroPhoneChat({
  title,
  onBack,
  group,
  model,
  status,
  onProfile,
  avatar,
  feedRef,
  children,
  value,
  onChange,
  onSubmit,
  ready,
  labels,
}: {
  title: string;
  onBack: () => void;
  group: boolean;
  model?: ReactNode;
  status?: ReactNode;
  onProfile: (event: MouseEvent<HTMLButtonElement>) => void;
  avatar: ReactNode;
  feedRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  ready: boolean;
  labels: { back: string; profile: string; composer: string; send: string };
}) {
  useEffect(() => {
    const feed = feedRef.current;
    if (feed) feed.scrollTo({ top: feed.scrollHeight });
  }, [feedRef]);
  return (
    <>
      <header className="hero-phone-head">
        <button type="button" className="hero-phone-back" aria-label={labels.back} onClick={onBack}>
          <ChevronLeft size={21} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hero-phone-title"
          title={labels.profile}
          onClick={onProfile}
        >
          {group ? (
            <span className="hero-phone-header-channel" aria-hidden="true">
              <Hash size={16} />
            </span>
          ) : (
            avatar
          )}
          <span className="hero-phone-title-copy">
            <strong>{title}</strong>
            <span className="hero-phone-chat-status">
              {model ? (
                <span className="hero-phone-header-model">
                  {model}
                  <span aria-hidden="true">·</span>
                </span>
              ) : null}
              <span className="hero-phone-header-state">{status}</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          className="hero-phone-back"
          aria-label={labels.profile}
          onClick={onProfile}
        >
          <Ellipsis size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="hero-phone-feed" ref={feedRef}>
        <ol className="app-msgs">{children}</ol>
      </div>
      <form className="hero-phone-composer" onSubmit={onSubmit}>
        <span className="hero-phone-attach" aria-hidden="true">
          <Plus size={25} strokeWidth={1.8} />
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={!ready}
          placeholder={labels.composer}
          aria-label={labels.composer}
          maxLength={200}
        />
        {value.trim() ? (
          <button
            type="submit"
            className="hero-phone-send"
            disabled={!ready}
            aria-label={labels.send}
          >
            <ArrowUp size={19} strokeWidth={2.5} aria-hidden="true" />
          </button>
        ) : (
          <span className="hero-phone-mic" aria-hidden="true">
            <Mic size={21} strokeWidth={2.3} />
          </span>
        )}
      </form>
    </>
  );
}
