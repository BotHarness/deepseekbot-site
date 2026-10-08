import test from 'node:test';
import assert from 'node:assert/strict';
import { SiteCompanionMotion } from '../src/companionMotion.ts';
import {
  loadChoices,
  saveChoices,
  COMPANION_SESSION_KEY,
  nextGuideMessage,
} from '../src/companionGuide.ts';
import { companionAvatarSvg } from '../src/companionAvatar.ts';
import { pixelFigure, seededRecipe } from '@botharness/pixel-avatar';

const bounds = { width: 1440, height: 1000, size: 96, top: 76, bottom: 890, ground: 750 };
function advance(m, frames = 200, reduced = false, walking = false) {
  const events = [];
  for (let i = 0; i < frames; i++) {
    const event = m.advance(16, reduced, walking);
    if (event) events.push(event);
  }
  return events;
}
test('one character enters on the real Hero ground, then visibly falls to viewport support once', () => {
  const m = new SiteCompanionMotion();
  assert.equal(m.measure(bounds, false, false), 'entry');
  assert.ok(m.x < 0);
  assert.deepEqual(advance(m), ['welcome']);
  assert.equal(m.y, 662);
  assert.equal(m.measure({ ...bounds, ground: -200 }, true, false), 'drop');
  assert.equal(m.support, 'viewport');
  assert.equal(m.phase, 'fall');
  assert.ok(m.y < bounds.bottom);
  assert.deepEqual(advance(m), ['landed']);
  assert.equal(m.y, bounds.bottom);
  assert.equal(m.measure(bounds, false, false), undefined);
  assert.equal(m.measure({ ...bounds, ground: -200 }, true, false), undefined);
  assert.equal(m.support, 'viewport');
});
test('grabbing a fall retargets the existing model, cancellation and repeated throws recover', () => {
  const m = new SiteCompanionMotion();
  m.measure(bounds, false, false);
  advance(m);
  m.measure({ ...bounds, ground: 0 }, true, false);
  m.advance(1000, false, false);
  m.grab(100, false);
  m.drag(600, 250, 116, false);
  assert.equal(m.phase, 'drag');
  assert.ok(m.tilt > 0);
  m.release(120, false);
  assert.equal(m.phase, 'fall');
  advance(m);
  assert.equal(m.phase, 'rest');
  assert.equal(m.y, bounds.bottom);
  for (let i = 0; i < 12; i++) {
    m.grab(200, false);
    m.drag(-500, -500, 216, false);
    m.release(218, false, true);
    advance(m);
    assert.equal(m.phase, 'rest');
    assert.ok(m.x >= 8 && m.x <= m.maxX);
  }
});
test('resize clamps drag and falling state; large frame gaps do not teleport past boundaries', () => {
  const m = new SiteCompanionMotion();
  m.measure(bounds, false, false);
  advance(m);
  m.grab(0, false);
  m.drag(1300, 600, 16, false);
  m.measure({ ...bounds, width: 320, height: 600, size: 80, bottom: 506, ground: 0 }, true, false);
  assert.ok(m.x <= 232 && m.y <= 506);
  m.release(17, false);
  m.advance(30000, false, false);
  assert.ok(m.y <= 506);
  advance(m);
  assert.equal(m.phase, 'rest');
  assert.equal(m.y, 506);
});
test('reduced motion settles without bouncing; reading/pause freezes wandering', () => {
  const m = new SiteCompanionMotion();
  m.measure(bounds, false, true);
  assert.equal(m.phase, 'rest');
  const x = m.x;
  advance(m, 50, false, false);
  assert.equal(m.x, x);
  advance(m, 50, false, true);
  assert.ok(m.x > x);
  m.grab(0, true);
  m.drag(600, 200, 16, true);
  assert.equal(m.tilt, 0);
  m.release(17, true);
  assert.equal(m.phase, 'rest');
  assert.equal(m.y, 662);
  assert.equal(m.measure({ ...bounds, ground: 0 }, true, true), 'drop');
  assert.equal(m.phase, 'rest');
  assert.equal(m.y, 890);
});
test('tall mobile Hero waits for actual ground; restored deep links start quietly', () => {
  const m = new SiteCompanionMotion();
  assert.equal(m.measure({ ...bounds, ground: 1400 }, false, false), undefined);
  assert.equal(m.phase, 'waiting');
  assert.equal(m.measure({ ...bounds, ground: 920 }, true, false), 'entry');
  const restored = new SiteCompanionMotion();
  assert.equal(restored.measure({ ...bounds, ground: -300 }, false, false), undefined);
  assert.equal(restored.support, 'viewport');
  assert.equal(restored.phase, 'rest');
});
test('session choices preserve invitation suppression, hiding and movement across reload/locale', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key),
    setItem: (key, value) => values.set(key, value),
  };
  const choices = { invited: true, hidden: true, quiet: true, walking: false };
  saveChoices(storage, choices);
  assert.deepEqual(loadChoices(storage), choices);
  assert.ok(values.has(COMPANION_SESSION_KEY));
  storage.setItem(COMPANION_SESSION_KEY, 'broken');
  assert.equal(loadChoices(storage).invited, false);
  assert.doesNotThrow(() =>
    saveChoices(
      {
        setItem() {
          throw Error('blocked');
        },
      },
      choices,
    ),
  );
  assert.equal(
    loadChoices({
      getItem() {
        throw Error('blocked');
      },
    }).walking,
    true,
  );
});
test('companion paints exactly the editor recipe body/head, with transparent silhouette in every pose', () => {
  for (const pose of ['front', 'left', 'right']) {
    const recipe = { ...seededRecipe('Mira'), pose };
    const before = JSON.stringify(recipe);
    const figure = pixelFigure(recipe, { front: 0, left: -25, right: 25 }[pose]);
    const svg = companionAvatarSvg(recipe);
    assert.ok(svg.includes(figure.body + figure.head));
    assert.ok(!svg.includes(figure.tile));
    assert.ok(!svg.includes('id="'));
    assert.equal(JSON.stringify(recipe), before);
    const edited = { ...recipe, hairColor: '#123456', clothesColor: '#654321' };
    assert.notEqual(companionAvatarSvg(edited), svg);
  }
});
test('resizing Hero below the viewport follows actual ground instead of floating on a fake floor', () => {
  const m = new SiteCompanionMotion();
  m.measure(bounds, false, false);
  advance(m);
  m.measure(
    { ...bounds, width: 390, height: 844, size: 80, bottom: 750, ground: 1130 },
    false,
    false,
  );
  assert.equal(m.support, 'hero');
  assert.equal(m.y, 1058);
  m.measure(
    { ...bounds, width: 390, height: 844, size: 80, bottom: 750, ground: 730 },
    true,
    false,
  );
  assert.equal(m.y, 658);
  assert.equal(m.phase, 'rest');
});

test('mobile privacy encounter follows Hero entry and jump rather than pinning to the floor', () => {
  const m = new SiteCompanionMotion();
  const mobile = { width: 390, height: 844, size: 80, top: 142, bottom: 764, ground: 1400 };
  m.measure(mobile, false, false);
  assert.equal(m.phase, 'waiting');
  assert.equal(m.support, 'hero');
  assert.equal(m.measure({ ...mobile, ground: 740 }, true, false), 'entry');
  assert.deepEqual(advance(m), ['welcome']);
  assert.equal(m.y, 668);
  assert.equal(m.measure({ ...mobile, ground: -300 }, true, false), 'drop');
  assert.equal(m.phase, 'fall');
  assert.ok(m.y < mobile.bottom);
  assert.deepEqual(advance(m), ['landed']);
  assert.equal(m.y + mobile.size, mobile.height);
});
test('a fast scroll skipping the mobile ground still falls; a restored deep link stays quiet', () => {
  const m = new SiteCompanionMotion();
  m.measure({ ...bounds, ground: 1400 }, false, false);
  assert.equal(m.measure({ ...bounds, ground: -300 }, true, false), 'drop');
  assert.equal(m.phase, 'fall');
  assert.ok(m.y < bounds.bottom);
  assert.deepEqual(advance(m), ['landed']);
  const restored = new SiteCompanionMotion();
  restored.measure({ ...bounds, ground: -300 }, false, false);
  assert.equal(restored.phase, 'rest');
});
test('explicit conversation taps weave a community turn between avatar and Bot introductions', () => {
  let message;
  const turns = [];
  for (let i = 0; i < 5; i++) {
    message = nextGuideMessage(message);
    turns.push(message);
  }
  assert.deepEqual(turns, ['welcome', 'bots', 'appearance', 'community', 'welcome']);
  assert.equal(nextGuideMessage('drag'), 'welcome');
});

test('Hero scrolling preserves height above the moving ground during a drag-release fall', () => {
  const m = new SiteCompanionMotion();
  m.measure(bounds, false, false);
  advance(m);
  m.grab(0, false);
  m.drag(180, 430, 16, false);
  m.release(200, false);
  const heightAboveGround = bounds.ground - m.y;
  m.measure({ ...bounds, ground: 630 }, true, false);
  assert.equal(m.phase, 'fall');
  assert.equal(m.support, 'hero');
  assert.equal(630 - m.y, heightAboveGround);
  advance(m);
  assert.equal(m.y, 630 - bounds.size + 8);
});

test('jump starts at the native-scrolled Hero position and viewport support ignores later ground shifts', () => {
  const m = new SiteCompanionMotion();
  const initial = { ...bounds, ground: 280 };
  m.measure(initial, false, false);
  advance(m);
  const displayedY = m.y - 100;
  assert.equal(m.measure({ ...initial, ground: 180 }, true, false), 'drop');
  assert.equal(m.y, displayedY);
  assert.equal(m.support, 'viewport');
  m.advance(16, false, false);
  const fallingY = m.y;
  m.measure({ ...initial, ground: -800 }, true, false);
  assert.equal(m.y, fallingY);
  advance(m);
  assert.equal(m.y, bounds.bottom);
  assert.equal(m.measure(initial, false, false), undefined);
  assert.equal(m.support, 'viewport');
});
