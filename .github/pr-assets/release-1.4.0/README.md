# Website 1.4.0 release captures

Real Playwright screenshots captured 2026-10-19. These show the website, not DeepSeekBot runtime or final-package qualification.

- `before-home-*`, `before-install-*` and `before-changelog-*`: actual production at `https://deepseekbot.app`, before this deployment. Existing Cloudflare Worker version: `9bd4794f-97ca-4ee4-9b6e-43807508de7b`.
- `before-article-*`: retained 2026-10-18 screenshots of the genuine missing article HTTP404 response from a local production build of site main `79ef361`. Direct production navigation also failed before deployment, but Chromium did not render its HTTP error body; the local404 is explicitly the captured comparison.
- `after-*`: this PR's production `dist/`, served locally. Both article URLs, installation guides and changelogs returned HTTP200.
- Chinese: 1440 × 1000, light. English: 390 × 844, dark. Before/after match viewport, locale and theme.
- Homepage introduction is scrolled to Features. `after-features-*` shows the feature-card grid; article/install/changelog shots begin at the page top.
- Analytics and welcome bubbles were dismissed using their actual local browser controls. Nothing was painted over, fabricated or resized.
- Both languages have no horizontal overflow on the checked pages. Canonical/hreflang metadata, sitemap entries and local links were checked.
- Installation identity is exact stable1.4.0; the canonical changelog includes both its feature summary and mobile/Cloud/rollback paragraph. Mobile app and Cloud remain development/UAT scope.

Both blog covers use the existing pixel-cover template. They are illustrations, not product screenshots.
