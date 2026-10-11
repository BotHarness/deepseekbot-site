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
