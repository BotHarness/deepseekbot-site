import { AlarmClock, ChevronRight, GitCommitVertical, TextQuote } from 'lucide-react';
import type { PanelItem, PanelSection } from '../demoCopy';
import type { PreviewCopy } from '../previewCopy';
import type { PhoneProfileTab } from './HeroPhoneProfile';
import { MemoryMarkdownIcon } from './MemoryMarkdownIcon';

export type PhoneProfileViews = { changes: boolean; media: boolean };

export function HeroPhoneProfileContent({
  t,
  tab,
  panel,
  session,
  status,
  views,
  onViews,
  onOpen,
}: {
  t: PreviewCopy;
  tab: PhoneProfileTab;
  panel: readonly PanelSection[];
  session?: string;
  status: string;
  views: PhoneProfileViews;
  onViews: (views: PhoneProfileViews) => void;
  onOpen: (section: string, item: PanelItem) => void;
}) {
  if (tab === 'members' || tab === 'settings') return null;
  const copy = t.phoneProfile;
  const section = {
    work: 'sessions',
    memory: views.changes ? 'commits' : 'files',
    files: 'channel-files',
    routines: 'schedules',
  }[tab];
  const items = panel.find((entry) => entry.id === section)?.items ?? [];
  const rows: PanelItem[] =
    tab === 'work' && session
      ? [{ id: 'linked-session', title: session, meta: t.complete + ' · 3/3' }, ...items]
      : items;
  const media = tab === 'files' && views.media;
  const Glyph =
    tab === 'work'
      ? TextQuote
      : tab === 'routines'
        ? AlarmClock
        : section === 'commits'
          ? GitCommitVertical
          : undefined;
  const segment =
    tab === 'memory'
      ? {
          labels: [copy.tabs.files, copy.changes],
          secondary: views.changes,
          change: (value: boolean) => onViews({ ...views, changes: value }),
        }
      : tab === 'files'
        ? {
            labels: [copy.tabs.files, copy.media],
            secondary: views.media,
            change: (value: boolean) => onViews({ ...views, media: value }),
          }
        : undefined;

  return (
    <>
      {tab === 'work' ? (
        <p className="hero-phone-profile-status">
          <span>{copy.activity}</span>
          <strong>{status}</strong>
        </p>
      ) : null}
      {segment ? (
        <div className="preview-segments" role="group" aria-label={copy.tabs[tab]}>
          {segment.labels.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={segment.secondary === (index === 1)}
              onClick={() => segment.change(index === 1)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {media || rows.length === 0 ? (
        <p className="preview-hint">{media ? copy.noMedia : copy.empty[tab]}</p>
      ) : (
        <div className="hero-phone-profile-rows">
          {rows.map((item) => {
            const actionable = tab !== 'work' || item.id === 'linked-session';
            const content = (
              <>
                {Glyph ? <Glyph size={16} aria-hidden="true" /> : <MemoryMarkdownIcon />}
                <span className="hero-phone-settings-label">
                  <strong>{item.title}</strong>
                  {item.meta || item.sha ? (
                    <small>{[item.sha, item.meta].filter(Boolean).join(' · ')}</small>
                  ) : null}
                </span>
                {item.badge ? <small>{item.badge}</small> : null}
              </>
            );
            return actionable ? (
              <button
                className="hero-phone-profile-row"
                type="button"
                data-profile-focus={item.id}
                key={item.id}
                onClick={() => onOpen(section, item)}
              >
                {content}
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <div className="hero-phone-profile-row" key={item.id}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
