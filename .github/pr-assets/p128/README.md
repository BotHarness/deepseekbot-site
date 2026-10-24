# PR 128 — bilingual privacy disclosure evidence

Refs [BotHarness/DeepSeekBot#2733](https://github.com/BotHarness/DeepSeekBot/issues/2733).

- Before: website main `71a68829aec352270464eb421eb279c0b485f9dc`.
- After content: `dc7947bce1c30bb64b27e72d1d957f2692975b69`.
- Product implementation reviewed: `704849bac2a62d3c343d9935fa071a66dd4e5f16`.
- Existing iOS TestFlight build: `0.0.1 (12)`, source `372b217519fd1e41e298018b2ceba2e760696802`. The reviewed host, mobile host and telemetry paths have no changes between that source and product main above. This is not qualification of an unbuilt iOS 1.0 candidate or an unpublished npm release.

## Source-to-copy checks

All product paths below are at the pinned product revision above. Website paths are at the website base revision; this PR changes no collection implementation.

| Disclosure                                        | Implementation evidence                                                                                                                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account identity and device-bound session         | `apps/mobile/src/host/connect-account.ts`, `native-connect-account.ts`; WorkOS authorization, user ID/email, secure storage after first unlock                                                                                        |
| Pairing credentials and local cache               | `apps/mobile/src/host/saved-host.ts`, `hosts.ts`, `host-session.ts`; pairing credentials use unlocked-device storage; unpair removes local state and attempts remote revocation                                                       |
| Connect records and encrypted application traffic | `packages/connect-relay/src/relay.ts`, `apps/mobile/src/host/encrypted-carrier.ts`, `route.ts`; account/host/tunnel metadata is separate from the authenticated encrypted channel                                                     |
| Account deletion and retained security record     | `packages/connect-relay/src/relay.ts`, `worker.ts`, `migrations/0002_deleted_accounts.sql`; WorkOS deletion, host/tunnel unlink, retained user-ID/deletion-time record; `account-connections.ts` scopes phone cleanup to that account |
| Push contents                                     | `packages/core/src/push/source.ts`, `delivery.ts`, `expo-sender.ts`; notification previews can include message summaries and tool name/argument summaries; private-input values are omitted                                           |
| Speech                                            | `apps/mobile/src/host/speech.ts`; native recognizer, no on-device-only requirement or app audio-file persistence requested                                                                                                            |
| Conditional phone statistics                      | `apps/mobile/src/telemetry/native.ts`, `mobile-telemetry.ts`, `schema.ts`, `device-context.ts`; configured/qualified-build gate and independent opt-out; this page does not assert that every build collects statistics               |
| Site search                                       | `src/search.ts`; search terms, result count and selected result are already sent through the existing analytics path, so the older blanket exclusion of typed text was inaccurate                                                     |

Provider references checked: [WorkOS privacy](https://workos.com/legal/privacy), [Cloudflare privacy](https://www.cloudflare.com/privacypolicy/), [Expo notification FAQ](https://docs.expo.dev/push-notifications/faq/). The policy does not promise a retention period that this implementation cannot establish.

## Rendered comparisons

These are real browser captures of Vite's generated static pages, with the same light/day theme, language and viewport in each pair. Full-page image heights differ because the new disclosure is longer. Both base and after builds are from their recorded revisions; base pages were served under a separate local path for comparison, with the same unmodified website assets. No UI was redrawn or resized into a mockup.

| View                        | Before    | After     |
| --------------------------- | --------- | --------- |
| English, 960 × 900 viewport | `eb.jpg`  | `ea.jpg`  |
| Chinese, 960 × 900 viewport | `zb.jpg`  | `za.jpg`  |
| English, 390 × 844 viewport | `emb.jpg` | `ema.jpg` |
| Chinese, 390 × 844 viewport | `zmb.jpg` | `zma.jpg` |

## Validation and limits

- `pnpm verify`: 71 tests passed, zero failures; format, lint, types and production build completed. Existing lint/chunk/font warnings are not introduced by this content diff.
- Standards review: no findings. Spec review: no blockers; its optional unpair/revocation clarification was incorporated in both languages.
- This is source and rendered-page verification. No new phone installation, runtime encryption audit, account deletion operation or push delivery was performed by this website PR.
- App Privacy questionnaire answers/publication, iOS 1.0 build, App Review submission and store release remain outside this PR. Installation tutorial changes wait for the external 1.5.1 release.
- No separate HTML explainer: this PR only edits the two authored privacy pages; this source table, the focused PR outline and paired rendered captures provide the review context without implying a runtime behavior change.
