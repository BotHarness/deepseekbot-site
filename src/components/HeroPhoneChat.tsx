import { ArrowUp, ChevronLeft, Hash, Mic, Plus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react';

/** Web presentation of the native chat chrome; the parent owns the shared conversation. */
export function HeroPhoneChat({
  title,
  group,
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
  group: boolean;
  avatar: ReactNode;
  feedRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  ready: boolean;
  labels: { chats: string; back: string; composer: string; send: string };
}) {
  const [chat, setChat] = useState(true);
  const navigated = useRef(false);
  const backButton = useRef<HTMLButtonElement>(null);
  const chatRow = useRef<HTMLButtonElement>(null);
  const navigate = (next: boolean) => {
    navigated.current = true;
    setChat(next);
  };
  useEffect(() => {
    if (chat) {
      const feed = feedRef.current;
      if (feed) feed.scrollTo({ top: feed.scrollHeight });
    }
    if (navigated.current) (chat ? backButton.current : chatRow.current)?.focus();
  }, [chat, feedRef]);
  return chat ? (
    <>
      <header className="hero-phone-head">
        <button
          type="button"
          className="hero-phone-back"
          ref={backButton}
          aria-label={labels.back}
          onClick={() => navigate(false)}
        >
          <ChevronLeft size={21} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <div className="hero-phone-title">
          {group ? <Hash size={19} aria-hidden="true" /> : avatar}
          <strong>{title}</strong>
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
  ) : (
    <div className="hero-phone-chats">
      <h3>{labels.chats}</h3>
      <button
        type="button"
        className="hero-phone-chat-row"
        ref={chatRow}
        onClick={() => navigate(true)}
      >
        {avatar}
        <strong>{title}</strong>
        <ChevronLeft size={16} className="hero-phone-row-chevron" aria-hidden="true" />
      </button>
    </div>
  );
}
