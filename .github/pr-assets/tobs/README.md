# Tobs website migration evidence

Captured 2026-10-24 with Playwright and Microsoft Edge, light theme and reduced motion.

- Before: live `https://deepseekbot.app/` and `/en/`, production version observed as `e4289644-883d-47a4-9e2d-6ec6460a78b1`. This is the live baseline, not a claim that its source equals the merge base.
- After: built feature branch at `http://127.0.0.1:4178/` and `/en/`; source commit `92618fa`. Desktop captures are 1440 × 1000. `mobile.png` is 390 × 844; document width did not exceed viewport width.
- Website merge base: `bfc2e47b0a512c6be93fdeda3f23d05843c44ea7`.
- Matched locales and viewports show the application name and meaning changing while the published `deepseekbot@1.4.1` installation remains usable. Later metadata-only and Marketplace copy corrections do not alter these homepage views.
- Website verification: `pnpm verify` passed, including 71 tests, typechecking and production build. Browser captures are local previews; production DNS, TLS, redirects and Search Console cutover remain deployment checks.
- Isolated workerd checks confirmed all six aliases preserve path/query on GET/HEAD, canonical pages serve, missing pages return 404 and device subdomains do not redirect. Static assets were supplied from the production build to the Worker binding during this local check.

No production deployment was performed. Screenshots contain only the public website and its local preview.
