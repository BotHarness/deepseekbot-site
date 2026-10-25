import { ArrowUp, ChevronLeft, Hash, Mic, Plus } from 'lucide-react';
import { useEffect, type FormEvent, type ReactNode, type RefObject } from 'react';

/** Web presentation of the native chat chrome; the parent owns the shared conversation. */
export function HeroPhoneChat({
  title,
  onBack,
  group,
  source,
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
  source: ReactNode;
  avatar: ReactNode;
  feedRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  ready: boolean;
  labels: { back: string; composer: string; send: string };
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
        <div className="hero-phone-title">
          {group ? <Hash size={19} aria-hidden="true" /> : avatar}
          <strong>{title}</strong>
          {source}
        </div>
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
