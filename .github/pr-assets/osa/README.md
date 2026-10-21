# Open Source Alternatives footer badge

Real screenshots of the locally built `dist/`, served by `pnpm preview` on loopback.

- Before source: `eec993fc7ad82fe6b5411054ee8b044eca6bf84a` (fresh `origin/main`).
- After source: `src/App.tsx` and `src/styles.css` in this PR; no other application source changes.
- Chromium (local Google Chrome), light appearance, device scale 1, reduced motion.
- Desktop (`d`): 1440 × 900 viewport. Mobile (`m`): 390 × 844 viewport.
- Chinese (`zh`): `/`. English (`en`): `/en/`.
- Each image is the bottom 440 pixels of its viewport after scrolling to the footer.
- The existing analytics consent was declined through its button. The existing draggable Bot was held at the top of the viewport, outside the footer crop, for both stages.
- The official external SVG decoded successfully in every after view, at 270 × 20; the enclosing link and alt text match the requested values. No horizontal overflow in the four viewports.
- T3 preview navigation worked, but two screenshot attempts returned `Preview automation snapshot timed out after 15000ms.` Capture used the Playwright fallback permitted by `AGENTS.md`.

Validation: `pnpm verify` passed all 69 tests, formatting, lint, typechecking, artwork checks, and production build. Existing warnings: one unused `posts` parameter in `scripts/blog.ts` and a bundle chunk over 500 kB. No test added for static markup.

Submission receipt does not mean directory approval. This PR does not merge or deploy the site.
