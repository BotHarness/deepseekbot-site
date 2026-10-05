import { useRef, useState } from 'react';
import type { Copy } from '../content';

export function PromoVideo({ copy }: { copy: Copy }) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const t = copy.video;

  const start = () => {
    setStarted(true);
    void video.current?.play();
  };

  return (
    <div className="pv frame" data-started={started}>
      <video
        ref={video}
        controls={started}
        playsInline
        preload="none"
        poster={t.poster}
        src={t.src}
        aria-label={t.label}
      />
      {started ? null : (
        <button type="button" className="pv-play" onClick={start} aria-label={t.play}>
          <span className="pv-play-icon" aria-hidden="true">
            <svg viewBox="0 0 10 12" width="40" height="48" shapeRendering="crispEdges">
              <path d="M0 0h2v1h2v1h2v1h2v1h2v4h-2v1h-2v1h-2v1h-2v1h-2z" fill="currentColor" />
            </svg>
          </span>
          <span className="pv-play-label">{t.play}</span>
        </button>
      )}
    </div>
  );
}
