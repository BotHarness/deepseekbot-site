---
{ "title": "Privacy", "description": "What the DeepSeekBot site, plugin and mobile app collect, why, and how to turn it off." }
---

We collect anonymous analytics for one reason: **to improve DeepSeekBot by learning how it is used and where site visitors come from**. We collect nothing that identifies you, and never your conversations or Memory. The code doing this is open source: [site](https://github.com/BotHarness/deepseekbot-site), [plugin](https://github.com/BotHarness/BotHarness), and the plugin's design is recorded in [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md).

Data is stored in [PostHog](https://posthog.com)'s US region and forwarded through our own domain, `t.botharness.ai`. Site analytics use the IP address only to infer the country or region, then discard it. Plugin and mobile events disable this location enrichment and do not create person profiles.

## Site

On your first visit, a box in the corner asks you:

- **Accept**: a random anonymous ID is stored on this device, so when you come back days later we can still tell which post or video first brought you here.
- **Decline**, or no answer: no identifier is stored on your device (declining only remembers that choice). The visit is still counted anonymously without cookies, using a one-way hash computed by the server per day.

We record which page you visited, where you came from (`utm_*` parameters and `?ref=`), and clicks on a few key buttons, such as copying the install command, opening GitHub or Discord, playing the video, or opening a Bot in the Marketplace. We do not record what you type, do not record sessions, and use no advertising trackers.

To change your choice, clear this site's cookies and local storage; you will be asked again on your next visit.

## Plugin

Plugin telemetry is on by default, and the plugin tells you so on first start. Only the plugin's Host sends it, carrying a random install ID generated on first start that is never linked to a site visitor.

It sends: plugin and DSH version, operating system and architecture; events such as creating, archiving or deleting a Bot, installing one from the Marketplace, enabling a connector (type only, for example "Lark"), and editing an avatar; a daily summary of counts (Bots, sessions, messages); and plugin errors with their type and a stack with personal paths removed.

Every event includes the plugin and DSH versions, operating system and architecture, Node.js major version, operating-system kernel release major version, logical CPU count band (`1–2`, `3–4`, `5–8`, `9–16`, or `17+`), and total RAM band. RAM uses upper bounds of 4, 8, 16 and 32 GiB, plus an open-ended band above 32 GiB (labelled `64plus`). Unavailable information is marked `unknown`. These fields help compare releases and device classes; exact RAM bytes, hostnames, usernames and hardware serial numbers are never sent.

**Excluded from event payloads**: Bot names, Persona or Memory content, conversation text, repository URLs, connector credentials, file paths, IP addresses. Network connections still expose the source IP to the receiving infrastructure; disabling location enrichment does not remove that transport information.

To turn it off, use any one of:

- the usage statistics switch in DeepSeekBot settings
- `telemetry: false` in the plugin config
- the environment variable `DO_NOT_TRACK=1`
- the environment variable `BOTHARNESS_TELEMETRY=0`

## Mobile app

The DeepSeekBot app for iPhone and Android is a remote for **your own computer**. It has no DeepSeekBot account and no DeepSeekBot server in between: it talks only to the computer you pair it with, over your [Tailscale](https://tailscale.com) network (`*.ts.net` or `100.x` addresses, always HTTPS). Your Bots, Memory and conversations stay on that computer.

**Stored on the phone**

- The pairing credential for each paired computer, kept only in the iOS Keychain or Android Keystore-backed secure storage, readable only while the phone is unlocked, and it cannot be restored onto another device.
- A cache of recent conversations and unsent drafts, so the app opens quickly. It lives in the app's own storage.

To remove a computer and its credential, open it in the app and choose **Unpair**. You can also revoke the phone from the computer's settings.

**Sent only to your computer**

Messages you type, photos and files you attach, and text from voice dictation go only to the paired computer. We never receive them.

**Permissions, used only when you act**

- **Camera**: to scan the pairing code on your computer, or to take a photo you choose to send.
- **Photos**: to pick a photo you choose to send.
- **Microphone and speech recognition**: only after you tap the dictation button, until you stop. Your phone's built-in speech service (Apple or Google) turns speech into text, under that provider's own privacy policy; you see and can edit the text before sending. No audio is recorded or sent to your computer or to us.
- **Notifications**: optional. If you allow them, the phone gives its push token to your paired computer only. When a Bot needs you, your computer sends a short notification (Bot or channel name and a short preview) through [Expo's push service](https://docs.expo.dev/push-notifications/faq/) to Apple (APNs) or Google (FCM), which deliver it to your phone. Expo keeps the push token so it can deliver later notifications, but does not keep notification content longer than needed to deliver it. Turn notifications off in the app or in system settings at any time.

**Statistics**

In builds with statistics enabled, the mobile app records opens, pairing attempts and outcomes, connection outcomes with coarse duration bands, and activation milestones such as the first accepted message. Statistics are on by default in those builds, with a notice and a switch in app settings. Turn off **Usage statistics** in the mobile app to stop collection and delete its queued events and random installation ID. This preference is separate from the Host setting.

Each event carries a random installation ID and a foreground-session UUID, app version and build, iOS or Android, app language and build environment, OS major.minor version, phone/tablet class, total RAM band (the same bands as the plugin), and device year class, an estimate of hardware capability. When available on iOS, it also includes a public model identifier such as `iPhone11,6`, shared by that hardware model; Android reports this field as `unknown`. Unavailable device information is marked `unknown`.

Only explicitly allowed fields are sent. We do not send device names, advertising IDs, Android IDs, serial numbers, exact RAM bytes, pairing links, credentials, Host addresses, conversation text or Memory. The app does not record sessions or automatically capture crashes. This collection does not include periodic CPU or memory-use samples, frame-rate measurements or startup timings.

Turning statistics on again creates a new random ID. Details: [mobile statistics](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/mobile-statistics.md).

We do not sell data, use advertising IDs, or track you across apps and websites.

## Contact

Questions are welcome in [GitHub Issues](https://github.com/BotHarness/BotHarness/issues).
