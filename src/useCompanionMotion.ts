import { useEffect, useRef, useState } from 'react';
import { SiteCompanionMotion } from './companionMotion';

type MotionEvent = 'welcome' | 'drop' | 'landed' | 'drag';
interface Options {
  hidden: boolean;
  walking: boolean;
  quiet: boolean;
  reading: boolean;
  onEvent: (event: MotionEvent, support: 'hero' | 'viewport') => void;
}
/** Owns one model, one animation loop and its DOM measurements for the whole visit. */
export function useCompanionMotion(options: Options) {
  const root = useRef<HTMLDivElement>(null);
  const actor = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLSpanElement>(null);
  const model = useRef(new SiteCompanionMotion());
  const latest = useRef(options);
  latest.current = options;
  const wake = useRef<() => void>(() => {});
  const sync = useRef<() => void>(() => {});
  const [reduced, setReduced] = useState(false);
  const reducedRef = useRef(false);
  const pointer = useRef<{
    id: number;
    dx: number;
    dy: number;
    moved: boolean;
    startX: number;
    startY: number;
  } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const el = root.current,
      button = actor.current;
    if (!el || !button) return;
    const ground = document.querySelector('.ground');
    const header = document.querySelector('.topbar');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      previous = 0,
      dirty = true,
      downward = false,
      oldScroll = scrollY;
    let blocked = false,
      disposed = false;
    const viewport = window.visualViewport;
    let geometry = {
      pageTop: scrollY,
      width: innerWidth,
      height: innerHeight,
      size: 96,
      top: 0,
      bottom: innerHeight - 108,
      ground: innerHeight,
    };
    const reducedNow = () => reducedRef.current || latest.current.quiet;
    const canRun = () => !disposed && !document.hidden && !blocked && !latest.current.hidden;
    function paint() {
      const m = model.current;
      el!.dataset.phase = m.phase;
      el!.dataset.support = m.support;
      // Hero support belongs to the scrolling document. Cache the measured origin:
      // even if touch scrolling delays JS, the browser moves the actor and bubble
      // together with the ground rather than leaving a fixed overlay behind.
      const pageOffset = m.support === 'hero' ? geometry.pageTop : 0;
      el!.style.setProperty(
        '--hero-layer-height',
        `${geometry.pageTop + Math.max(geometry.height, geometry.ground + geometry.size + 24)}px`,
      );
      const inView = m.phase !== 'waiting' && m.y < geometry.height;
      el!.dataset.offscreen = String(!inView);
      el!.dataset.running = String(canRun() && inView && !reducedNow() && !latest.current.reading);
      button!.style.transform = `translate3d(${m.x}px,${m.y + pageOffset}px,0)`;
      if (sprite.current)
        sprite.current.style.transform = `rotate(${m.tilt}deg) scale(${1 + m.squash},${1 - m.squash})`;
      const panel = bubble.current;
      if (panel) {
        panel.style.setProperty(
          '--panel-limit',
          `${Math.max(80, geometry.height - geometry.top - 24)}px`,
        );
        const width = panel.offsetWidth,
          height = panel.offsetHeight;
        const left = Math.max(
          12,
          Math.min(geometry.width - width - 12, m.x + geometry.size / 2 - width / 2),
        );
        const above = m.y - height - 16 >= geometry.top;
        const top = Math.max(
          geometry.top,
          Math.min(
            geometry.height - height - 12,
            above ? m.y - height - 16 : m.y + geometry.size + 12,
          ),
        );
        panel.style.transform = `translate3d(${left}px,${top + pageOffset}px,0)`;
        panel.style.setProperty(
          '--tail',
          `${Math.max(16, Math.min(width - 24, m.x + geometry.size / 2 - left))}px`,
        );
        panel.dataset.side = above ? 'above' : 'below';
      }
    }
    function measure() {
      dirty = false;
      const size = button!.offsetWidth;
      const top =
        Math.max(viewport?.offsetTop ?? 0, header?.getBoundingClientRect().bottom ?? 0) + 10;
      const height = (viewport?.height ?? innerHeight) + (viewport?.offsetTop ?? 0);
      const safe = parseFloat(getComputedStyle(el!).paddingBottom) || 0;
      geometry = {
        pageTop: scrollY,
        width: viewport?.width ?? innerWidth,
        height,
        size,
        top,
        bottom: Math.max(top, height - size - safe),
        ground: ground?.getBoundingClientRect().top ?? -1,
      };
      const event = model.current.measure(geometry, downward, reducedNow());
      downward = false;
      if (event === 'entry' && reducedNow())
        latest.current.onEvent('welcome', model.current.support);
      if (event === 'drop') {
        latest.current.onEvent('drop', model.current.support);
        if (reducedNow() && model.current.phase !== 'drag')
          latest.current.onEvent('landed', model.current.support);
      }
    }
    function tick(now: number) {
      frame = 0;
      if (!canRun()) {
        previous = 0;
        paint();
        return;
      }
      if (dirty) measure();
      const event = model.current.advance(
        previous ? now - previous : 16,
        reducedNow(),
        latest.current.walking && !latest.current.reading,
      );
      previous = now;
      if (event) latest.current.onEvent(event, model.current.support);
      paint();
      const phase = model.current.phase;
      if (
        model.current.y < geometry.height &&
        !reducedNow() &&
        (phase === 'enter' ||
          phase === 'fall' ||
          phase === 'land' ||
          (phase === 'rest' && latest.current.walking && !latest.current.reading))
      )
        frame = requestAnimationFrame(tick);
      else previous = 0;
    }
    function request() {
      if (canRun() && !frame) frame = requestAnimationFrame(tick);
      else paint();
    }
    wake.current = () => {
      dirty = true;
      request();
    };
    sync.current = () => {
      if (dirty) measure();
      paint();
    };
    const scroll = () => {
      downward ||= scrollY > oldScroll;
      oldScroll = scrollY;
      dirty = true;
      request();
    };
    const resize = () => {
      if (pointer.current) {
        const id = pointer.current.id;
        pointer.current = null;
        suppressClick.current = true;
        model.current.release(performance.now(), reducedNow(), true);
        if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
      }
      dirty = true;
      request();
    };
    const visibility = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      dirty = true;
      request();
    };
    const preference = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
      request();
    };
    const overlays = () => {
      blocked = !!document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]');
      el.style.visibility = blocked ? 'hidden' : '';
      if (blocked && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
      dirty = true;
      request();
    };
    const sizes = new ResizeObserver(resize);
    if (ground) sizes.observe(ground);
    if (header) sizes.observe(header);
    sizes.observe(button);
    const mutations = new MutationObserver(overlays);
    // Observe modal/consent lifecycle without observing per-frame style/data updates.
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open', 'aria-modal'],
    });
    const panelSizes = new ResizeObserver(() => request());
    if (bubble.current) panelSizes.observe(bubble.current);
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', resize);
    viewport?.addEventListener('resize', resize);
    viewport?.addEventListener('scroll', resize);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', preference);
    preference();
    overlays();
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      wake.current = () => {};
      sync.current = () => {};
      sizes.disconnect();
      panelSizes.disconnect();
      mutations.disconnect();
      removeEventListener('scroll', scroll);
      removeEventListener('resize', resize);
      viewport?.removeEventListener('resize', resize);
      viewport?.removeEventListener('scroll', resize);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', preference);
    };
  }, []);

  useEffect(() => {
    wake.current();
  }, [options.hidden, options.walking, options.quiet, options.reading]);
  const reducedNow = () => reduced || latest.current.quiet;
  return {
    root,
    actor,
    bubble,
    sprite,
    reduced,
    wake: () => wake.current(),
    nudge: (direction: number) => {
      model.current.nudge(direction);
      wake.current();
    },
    pointerDown(event: React.PointerEvent<HTMLButtonElement>) {
      if (event.button !== 0 || pointer.current) return;
      // A pointer can arrive before the queued scroll frame updates the model.
      sync.current();
      event.currentTarget.setPointerCapture(event.pointerId);
      const m = model.current;
      pointer.current = {
        id: event.pointerId,
        dx: event.clientX - m.x,
        dy: event.clientY - m.y,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
      };
      suppressClick.current = false;
      m.grab(performance.now(), reducedNow());
      wake.current();
    },
    pointerMove(event: React.PointerEvent<HTMLButtonElement>) {
      const p = pointer.current;
      if (!p || p.id !== event.pointerId) return;
      if (!p.moved && Math.hypot(event.clientX - p.startX, event.clientY - p.startY) > 5) {
        p.moved = true;
        suppressClick.current = true;
        latest.current.onEvent('drag', model.current.support);
      }
      if (p.moved) {
        model.current.drag(
          event.clientX - p.dx,
          event.clientY - p.dy,
          performance.now(),
          reducedNow(),
        );
        wake.current();
      }
    },
    pointerEnd(event: React.PointerEvent<HTMLButtonElement>, cancelled = false) {
      if (pointer.current?.id !== event.pointerId) return;
      pointer.current = null;
      model.current.release(performance.now(), reducedNow(), cancelled);
      wake.current();
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
    },
    clicked(detail: number) {
      const wasDrag = detail !== 0 && suppressClick.current;
      suppressClick.current = false;
      return !wasDrag;
    },
  };
}
