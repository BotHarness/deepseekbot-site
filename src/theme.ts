import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral';

/** Pixel font stack: Fusion Pixel (subset at build time), then the system's own. */
export const PIXEL_FONT = "'DSB Pixel', 'PingFang SC', 'Microsoft YaHei', monospace";

// Astryx tokens follow the site palette in styles.css; [light, dark] pairs follow the
// day/night toggle. Square corners and hard offset shadows make every control a sprite.
export const pixelTheme = defineTheme({
  name: 'deepseekbot-pixel',
  extends: neutralTheme,
  color: { accent: ['#3d5afe', '#8c9eff'], neutralStyle: 'warm' },
  typography: {
    heading: { family: 'DSB Pixel', fallbacks: "'PingFang SC', 'Microsoft YaHei', monospace" },
  },
  radius: { base: 0, multiplier: 0 },
  tokens: {
    '--color-background-body': ['#f6e7c1', '#141a33'],
    '--color-background-surface': ['#fff6dc', '#1f2747'],
    '--color-background-card': ['#fff6dc', '#1f2747'],
    '--color-border': ['#5b3a1e', '#0b0f22'],
    '--color-border-emphasized': ['#3b2414', '#05070f'],
  },
  components: {
    button: {
      base: {
        borderRadius: '0px',
        fontFamily: PIXEL_FONT,
        letterSpacing: '0.02em',
        boxShadow: '4px 4px 0 0 var(--px-shadow)',
        outline: '3px solid var(--px-ink)',
        outlineOffset: '-3px',
      },
      // solid paper instead of a translucent overlay, so it reads on sky, wood and code
      'variant:secondary': { backgroundColor: 'var(--bubble)', color: 'var(--ink)' },
    },
    'text-input': {
      base: { borderRadius: '0px' },
    },
    'segmented-control': {
      base: { borderRadius: '0px' },
    },
  },
});
