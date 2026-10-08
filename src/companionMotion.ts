/** Website adaptation of BotHarness CompanionMotion (MIT), revision 636a5a6c.
 * Uses viewport coordinates throughout; changing support never replaces the character.
 * No DOM, avatar, dialogue, storage or analytics authority lives here.
 */
export type CompanionPhase = 'waiting' | 'enter' | 'rest' | 'drag' | 'fall' | 'land';
export interface CompanionBounds {
  width: number;
  height: number;
  size: number;
  top: number;
  bottom: number;
  ground: number;
}
export class SiteCompanionMotion {
  x = -112;
  y = 0;
  tilt = 0;
  squash = 0;
  phase: CompanionPhase = 'waiting';
  support: 'hero' | 'viewport' = 'hero';
  direction = 1;
  private bounds: CompanionBounds = { width: 0, height: 0, size: 96, top: 0, bottom: 0, ground: 0 };
  private vx = 0;
  private vy = 0;
  private sampledAt = 0;
  private landing = 0;
  private started = false;

  get floor() {
    return this.support === 'viewport'
      ? this.bounds.bottom
      : Math.max(this.bounds.top, this.bounds.ground - this.bounds.size + 8);
  }
  get maxX() {
    return Math.max(8, this.bounds.width - this.bounds.size - 8);
  }
  private clampX(x: number) {
    return Math.max(8, Math.min(this.maxX, x));
  }
  private clampY(y: number) {
    return Math.max(
      this.bounds.top,
      Math.min(Math.max(this.bounds.top, Math.min(this.bounds.bottom, this.floor)), y),
    );
  }

  /** A pending privacy question is reachable even when mobile Hero ground is below the fold. */
  revealAtViewport(bounds: CompanionBounds) {
    if (this.started) return;
    this.bounds = bounds;
    this.started = true;
    this.support = 'viewport';
    this.x = 32;
    this.settle();
  }

  /** Returns an observable transition, so the presentation can welcome or invite once. */
  measure(
    bounds: CompanionBounds,
    downward: boolean,
    reduced: boolean,
  ): 'entry' | 'drop' | undefined {
    this.bounds = bounds;
    if (!this.started && bounds.ground < bounds.top) {
      // Deep links / restored scroll positions start quietly at the bottom.
      this.started = true;
      this.support = 'viewport';
      this.settle();
      return;
    }
    if (!this.started && bounds.ground <= bounds.height + 24) {
      this.started = true;
      this.y = this.floor;
      this.x = reduced ? 32 : -bounds.size;
      this.phase = reduced ? 'rest' : 'enter';
      return 'entry';
    }
    if (
      this.started &&
      this.support === 'hero' &&
      downward &&
      bounds.ground < bounds.top + bounds.size + 20
    ) {
      this.support = 'viewport';
      // Retain the last displayed position even when a fast scroll skipped the ground.
      this.x = this.clampX(this.x);
      this.y = this.clampY(this.y);
      if (this.phase !== 'drag') {
        this.vx = this.direction * 80;
        this.vy = -220;
        this.phase = 'fall';
      }
      if (reduced && this.phase !== 'drag') this.settle();
      return 'drop';
    }
    if (this.phase !== 'waiting' && this.phase !== 'enter') this.x = this.clampX(this.x);
    if (this.phase === 'rest' || this.phase === 'enter') this.y = this.floor;
    else if (this.phase !== 'waiting') this.y = this.clampY(this.y);
    return;
  }

  grab(now: number, reduced: boolean) {
    this.sampledAt = now;
    this.vx = this.vy = 0;
    this.tilt = 0;
    this.squash = reduced ? 0 : -0.055;
    this.phase = 'drag';
  }
  drag(x: number, y: number, now: number, reduced: boolean) {
    const nx = this.clampX(x),
      ny = this.clampY(y);
    const seconds = Math.max(0.016, (now - this.sampledAt) / 1000);
    this.vx = Math.max(-700, Math.min(700, (nx - this.x) / seconds));
    this.vy = Math.max(-900, Math.min(900, (ny - this.y) / seconds));
    this.sampledAt = now;
    this.x = nx;
    this.y = ny;
    this.tilt = reduced ? 0 : Math.max(-18, Math.min(18, this.vx / 35));
  }
  release(now: number, reduced: boolean, cancelled = false) {
    if (cancelled || now - this.sampledAt > 120) this.vx = this.vy = 0;
    if (reduced) this.settle();
    else this.phase = 'fall';
  }
  settle() {
    this.x = this.clampX(this.x);
    this.y = Math.max(this.bounds.top, this.floor);
    this.vx = this.vy = this.tilt = this.squash = 0;
    this.phase = 'rest';
  }
  nudge(direction: number) {
    this.x = this.clampX(this.x + direction * 24);
  }
  advance(
    milliseconds: number,
    reduced: boolean,
    walking: boolean,
  ): 'welcome' | 'landed' | undefined {
    if (this.phase === 'drag' || this.phase === 'waiting') return;
    if (reduced) {
      const landing = this.phase === 'fall' || this.phase === 'land';
      this.settle();
      return landing ? 'landed' : undefined;
    }
    let remaining = Math.min(64, Math.max(0, milliseconds));
    while (remaining > 0) {
      const dt = Math.min(16, remaining) / 1000;
      remaining -= dt * 1000;
      if (this.phase === 'enter') {
        this.x += 95 * dt;
        if (this.x >= 32) {
          this.x = 32;
          this.phase = 'rest';
          return 'welcome';
        }
      } else if (this.phase === 'fall') {
        this.vy += 1900 * dt;
        this.vx *= Math.exp(-2.5 * dt);
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.x < 8 || this.x > this.maxX) {
          this.x = this.clampX(this.x);
          this.vx *= -0.25;
        }
        if (this.y < this.bounds.top) {
          this.y = this.bounds.top;
          this.vy = Math.max(0, this.vy);
        }
        if (this.y >= this.floor) {
          this.y = this.floor;
          const impact = Math.abs(this.vy);
          this.vy = impact > 100 ? -impact * 0.24 : 0;
          this.squash = Math.min(0.12, impact / 9000);
          if (!this.vy) {
            this.phase = 'land';
            this.landing = 220;
          }
        }
        this.tilt += (this.vx / 45 - this.tilt) * (1 - Math.exp(-9 * dt));
        this.squash *= Math.exp(-12 * dt);
      } else if (this.phase === 'land') {
        this.vx *= Math.exp(-16 * dt);
        this.x = this.clampX(this.x + this.vx * dt);
        this.tilt *= Math.exp(-18 * dt);
        this.squash *= Math.exp(-18 * dt);
        this.landing -= dt * 1000;
        if (this.landing <= 0) {
          this.settle();
          return 'landed';
        }
      } else if (walking) {
        this.x = this.clampX(this.x + this.direction * 18 * dt);
        if (this.x <= 8 || this.x >= this.maxX) this.direction *= -1;
      }
    }
    return;
  }
}
