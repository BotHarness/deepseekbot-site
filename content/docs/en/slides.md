---
{
  "title": "Slides",
  "description": "Watch the BotHarness and DeepSeekBot intro deck as interactive slides.",
  "order": 12,
  "source": "apps/docs/src/content/docs/docs/slides.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

You can view the interactive BotHarness intro deck right in your browser:

- [Open the intro deck](https://botharness.ai/slides/s/botharness-intro) — start from the cover and press `F` for fullscreen presentation mode
- [Browse all decks](https://botharness.ai/slides/) — see every published presentation deck

## Preview and edit slides locally

If you are contributing to the presentations, decks live under `apps/presentations/slides/` and are built as React components on a fixed `1920×1080` canvas (`open-slide`). See `apps/presentations/AGENTS.md` for authoring guidelines.

```bash
pnpm slides:dev   # preview locally at http://localhost:5173/s/<id>
pnpm slides:build # rebuild the static slides bundle for the docs site
```

Running `pnpm docs:build` automatically rebuilds the embedded slide decks into `apps/docs/public/slides/` (which is generated at build time and not committed to Git).
