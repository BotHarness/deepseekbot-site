# Website 1.4.0 preview captures

Real Playwright screenshots of locally served production `dist/` output, captured 2026-10-18.
These show the website only; they are not DeepSeekBot runtime or final-package qualification.

- Before: site main `79ef361`; the new article URL returns HTTP 404.
- After: this PR's website sources; both article URLs return HTTP 200.
- Chinese: 1440 × 1000, light theme.
- English: 390 × 844, dark theme.
- Before/after use the same viewport, locale and theme. The homepage is scrolled to the Features introduction; the article is captured at its beginning.
- Analytics prompts were declined through the actual local browser controls before capture. No content was painted over, fabricated or resized.
- The paired pages have no horizontal overflow. Canonical/hreflang metadata, sitemap entries and generated local links were checked.
- The homepage installation identity and guide copies remain at stable 1.3.1. This PR is a preview, not a 1.4.0 install announcement.

Both blog covers were generated through the existing pixel-cover template. They are illustrations, not product screenshots.
