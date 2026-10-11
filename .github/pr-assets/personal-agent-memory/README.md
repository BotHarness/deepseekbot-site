# Personal agent memory article captures

Captured October 12, 2026 (Asia/Tokyo) using the T3 collaborative Playwright browser. Before is the live production URL; After is the production build served from `dist/`. No synthetic product execution, private chats or credentials appear.

| File            | Locale  | State                                                    | Theme |
| --------------- | ------- | -------------------------------------------------------- | ----- |
| `zh-before.png` | Chinese | New article URL before it exists; real homepage fallback | Light |
| `en-before.png` | English | New article URL before it exists; real homepage fallback | Light |
| `zh-after.png`  | Chinese | New article heading, cover and opening                   | Light |
| `en-after.png`  | English | New article heading, cover and opening                   | Light |
| `zh-memory.png` | Chinese | Memory explanation and proposed prompt                   | Light |
| `en-memory.png` | English | Memory explanation and proposed prompt                   | Light |

Both absent production routes return HTTP 200 with homepage content, not HTTP 404. Before records the actual absence; this patch does not change fallback routing. Legacy homepage spelling visible in Before is not newly authored copy.

Matched desktop captures use the same browser panel: configured capture size 1280×800, measured layout viewport 1402×877 CSS pixels; the preview saves 1280×800 PNGs. Resize requests timed out, so no mobile-viewport validation is claimed. Captures are native preview outputs, with no annotation or subsequent upscaling. Analytics consent is declined through the real UI and Light is selected using the actual theme control.

Article source/cover changes are reviewed alongside the two public 1200×630 covers under `public/blog-covers/`. The blog examples are hypothetical suggestions, not product task evidence. These screenshots verify rendering only; no physical-device, model execution, search ranking or conversion claim is made.

## Product screenshot follow-up

The matched locale/light/desktop Group Before captures use the article build at `bc6ca56bb111c3a4e1a2f747f476de4b8a7b3d8f`, before product figures were added. After and zoom captures use the updated `dist/` build. All follow-up PNGs use the same measured 1402×877 CSS viewport and native 1280×800 output. Conversation captures were checked again after image decoding to avoid recording an unloaded image.

| Files                                                      | View                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------- |
| `zh-group-before.png`, `en-group-before.png`               | Existing team section before figures                            |
| `zh-conversations-after.png`, `en-conversations-after.png` | Bot-mode roster, selected Bot DM and memory sidebar             |
| `zh-group-after.png`, `en-group-after.png`                 | Group conversation with distinct Bot identities and member list |
| `zh-group-zoom.png`, `en-group-zoom.png`                   | Expanded, readable Group replies                                |

The embedded product images are unmodified native README v2 UI captures reused from product source `25a9b0cde7616351acde8d1a2e9a5e1cb7d8cd32`. Their observatory conversations are fictional demonstration data, not this article's reading-notes execution or a fresh npm runtime qualification. The Group zoom uses an SVG viewBox over the original image, not synthesized content. Group sources, dimensions and SHA256 are recorded in `public/blog-figures/personal-agent-memory/provenance.json`; reused DM images retain `public/blog-figures/first-task/provenance.json`. Optional Browser/Computer controls visible in the overview do not establish default release availability.
