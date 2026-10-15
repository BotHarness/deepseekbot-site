# Marketplace card overflow evidence

Fixes #101. The flex item `.bot-card` used its automatic content minimum width,
so a long, non-wrapping display name could expand the card beyond its grid cell.
`min-width: 0` lets the existing name ellipsis and repository wrapping take effect.

## Capture setup

- Before: main at `99301e9`; after: the same checkout with the CSS fix.
- Real screenshots of `pnpm build` output served by Vite preview, using T3 Code's
  Playwright-backed collaborative browser.
- Both builds replay the same real public `/v1/bots?limit=24&sort=updated` and
  `/v1/topics` JSON responses because the public API rejects localhost CORS.
  Only the local built HTML receives the replay script; it is excluded from deployment.
- Each view scrolls the Application Security Reviewer card to 200 CSS pixels from
  the viewport top after fonts load.
- `zh-dark`: 1280 × 800, Chinese, dark theme.
- `en-light`: 1280 × 800, English, light theme.
- `en-mobile-light`: 375 × 812, English, light theme.

## Validation

- `pnpm verify`: 52 tests passed after integrating main at `18bc770` (46 before integration), formatting, lint, typecheck and build succeeded.
  Existing unused-parameter and bundle-size warnings remain.
- Before: Application Security Reviewer measured 392.84px in a 341.34px desktop
  cell and 392.84px in a 328.71px mobile cell. Shortening just the display name
  restored the card width; setting only the card's minimum width to zero also
  restored the width and activated name truncation.
- After: card and cell widths match (341.34px desktop, 328.71px mobile).
- All 16 real catalog cards pass the geometry check in the three captured views.
- `check-layout.js` replaces display/repository names with long unbroken text,
  verifies card containment and name truncation, then restores the original text.
  Run it in the rendered marketplace page's browser console or browser evaluator.
- Stress check: both languages × both themes × 320, 375, 768, 1280 and 1920px
  viewports = 20 combinations / 320 card checks passed.
- Full names remain in the card's accessible label and its detail view.

No generated HTML or replay data is committed.
