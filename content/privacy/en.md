---
{ "title": "Privacy", "description": "What the DeepSeekBot site, plugin and mobile app collect, why, and how to turn it off." }
---

We collect anonymous analytics for one reason: **to improve DeepSeekBot by learning how it is used and where site visitors come from**. We collect nothing that identifies you, and never your conversations or Memory. The code doing this is open source: [site](https://github.com/BotHarness/deepseekbot-site), [plugin](https://github.com/BotHarness/BotHarness), and the plugin's design is recorded in [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md).

Site and plugin data is stored in [PostHog](https://posthog.com)'s US region and forwarded through our own domain, `t.botharness.ai`. PostHog uses the IP address only to infer the country or region, then discards it; it is never stored.

## Site

On your first visit, a box in the corner asks you:

- **Accept**: a random anonymous ID is stored on this device, so when you come back days later we can still tell which post or video first brought you here.
- **Decline**, or no answer: no identifier is stored on your device (declining only remembers that choice). The visit is still counted anonymously without cookies, using a one-way hash computed by the server per day.

We record which page you visited, where you came from (`utm_*` parameters and `?ref=`), and clicks on a few key buttons, such as copying the install command, opening GitHub or Discord, playing the video, or opening a Bot in the Marketplace. We do not record what you type, do not record sessions, and use no advertising trackers.

To change your choice, clear this site's cookies and local storage; you will be asked again on your next visit.

## Plugin

Plugin telemetry is on by default, and the plugin tells you so on first start. Only the plugin's Host sends it, carrying a random install ID generated on first start that is never linked to a site visitor.

It sends: plugin and DSH version, operating system and architecture; events such as creating, archiving or deleting a Bot, installing one from the Marketplace, enabling a connector (type only, for example "Lark"), and editing an avatar; a daily summary of counts (Bots, sessions, messages); and plugin errors with their type and a stack with personal paths removed.

**Never sent**: Bot names, Persona or Memory content, conversation text, repository URLs, connector credentials, file paths, IP addresses.

To turn it off, use any one of:

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

Builds from the App Store and Google Play currently send **no** statistics. If a later version turns on phone statistics, they will be on by default for new installs. The first launch shows a notice about it; the notice is for information only, and collection does not wait for you to dismiss it. You can turn statistics off at any time with the switch at the bottom of Settings. With it on, the phone sends PostHog a random phone statistics ID, the app version and build, iOS or Android, the app language, and coarse results for opening the app, pairing, connecting and the first chat. It never sends names, messages, Memory, files, pairing links, credentials, push tokens or anything identifying your computer. The ID is not linked to website visits or computers and no person profiles are created. Events go through `t.botharness.ai` to PostHog's US region with GeoIP turned off and the IP address discarded. Turning statistics off deletes the ID and any unsent events; turning it on again creates a new ID. Statistics are separate from the plugin's telemetry on your computer. Details: [mobile statistics](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/mobile-statistics.md).

We do not sell data, use advertising IDs, or track you across apps and websites.

## Contact

Questions are welcome in [GitHub Issues](https://github.com/BotHarness/BotHarness/issues).
