# Live GitHub stars

Real screenshots from the T3 collaborative Playwright browser serving `dist/` with Vite preview.
Before is main at `99301e9`; after is this branch. Paired captures use the same language and
dark theme: desktop 1440 × 1000, mobile 390 × 1200. Avatar animation poses may differ.

Both GitHub buttons display **96**, read from the real GitHub API during capture. A fresh page
made one request shared by Hero and Header; English navigation and the generated changelog
reused the verified five-minute browser cache without additional requests.

`pnpm verify` passed **52 tests**, formatting, lint, typechecking and production build.
Six new tests cover shared requests, genuine zero, cache expiry, rate limits/network failure,
invalid payloads, blocked storage and malformed/expired/future-dated cache values.
