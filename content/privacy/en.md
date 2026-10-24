---
{ "title": "Privacy", "description": "What the Tobs site, plugin and mobile app collect, why, and how to turn it off." }
---

We collect anonymous analytics for one reason: **to improve Tobs by learning how it is used and where site visitors come from**. Usage statistics do not include conversation or Memory content. Optional account, connection and notification processing is described separately below. The code doing this is open source: [site](https://github.com/BotHarness/deepseekbot-site), [plugin](https://github.com/BotHarness/BotHarness), and the plugin's design is recorded in [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md).

Statistics are stored in [PostHog](https://posthog.com)'s US region and forwarded through our own domain, `t.botharness.ai`. Site analytics use the IP address only to infer the country or region, then discard it. Plugin and mobile events disable this location enrichment and do not create person profiles.

## Site

On your first visit, a box in the corner asks you:

- **Accept**: a random anonymous ID is stored on this device, so when you come back days later we can still tell which post or video first brought you here.
- **Decline**, or no answer: no identifier is stored on your device (declining only remembers that choice). The visit is still counted anonymously without cookies, using a one-way hash computed by the server per day.

We record which page you visited, where you came from (`utm_*` parameters and `?ref=`), and clicks on a few key buttons, such as copying the install command, opening GitHub or Discord, playing the video, or opening a Bot in the Marketplace. Site search also records the search term, result count and selected result to improve the guides. We do not record sessions or use advertising trackers.

To change your choice, clear this site's cookies and local storage; you will be asked again on your next visit.

## Plugin

Plugin telemetry is on by default, and the plugin tells you so on first start. Only the plugin's Host sends it, carrying a random install ID generated on first start that is never linked to a site visitor.

It sends: plugin and DSH version, operating system and architecture; events such as creating, archiving or deleting a Bot, installing one from the Marketplace, enabling a connector (type only, for example "Lark"), and editing an avatar; a daily summary of counts (Bots, sessions, messages); and plugin errors with their type and a stack with personal paths removed.

Every event includes the plugin and DSH versions, operating system and architecture, Node.js major version, operating-system kernel release major version, logical CPU count band (`1–2`, `3–4`, `5–8`, `9–16`, or `17+`), and total RAM band. RAM uses upper bounds of 4, 8, 16 and 32 GiB, plus an open-ended band above 32 GiB (labelled `64plus`). Unavailable information is marked `unknown`. These fields help compare releases and device classes; exact RAM bytes, hostnames, usernames and hardware serial numbers are never sent.

**Excluded from event payloads**: Bot names, Persona or Memory content, conversation text, repository URLs, connector credentials, file paths, IP addresses. Network connections still expose the source IP to the receiving infrastructure; disabling location enrichment does not remove that transport information.

To turn it off, use any one of:

- the usage statistics switch in Tobs settings
- `telemetry: false` in the plugin config
- the environment variable `DO_NOT_TRACK=1`
- the environment variable `BOTHARNESS_TELEMETRY=0`

## Mobile app

The Tobs app for iPhone and Android, previously called DeepSeekBot, is a remote for **your own computer**. Available connection methods depend on the app and computer versions: a local network connection, [Tailscale](https://tailscale.com), or optional Tobs Connect. Bots, Memory and the main conversation history live on your computer; the phone also keeps local data described below.

### Data on your phone

- Pairing credentials, device keys and trusted computer keys are kept in the phone's system-protected storage. On iOS, pairing credentials are available only while the phone is unlocked and are bound to that device. The optional account session is also device-bound, but is available to the app after the first unlock following a restart.
- Recent conversations, unsent drafts and files needed for app operations may be cached in the app's own storage.

**Unpair** removes the connection stored on that phone. To revoke a phone's access on the computer, use **Revoke** in the computer's device settings. These actions do not delete your Bots or conversation history on the computer.

### Connections and optional Tobs account

You do not need a Tobs account to pair over a supported local network or Tailscale route. A local network connection uses an encrypted application channel. Tailscale connections use your own tailnet and an HTTPS computer address; Tailscale processes network and account information under its own policies.

Tobs Connect provides a route through [Cloudflare Tunnel](https://www.cloudflare.com/privacypolicy/) when you choose to link the computer to a Tobs account. You sign in through [WorkOS](https://workos.com/legal/privacy), using an available sign-in method such as Apple, Google or an email code.

- WorkOS processes your account email, user ID and, when supplied by your sign-in provider, your name, to authenticate you and manage the account.
- The Connect service at `connect.botharness.ai` keeps your user ID, linked computer IDs and names, association times and tunnel configuration. Computer addresses currently use `<id>.deepseekbot.dev`; these service addresses retain the earlier name. A pairing request also passes the phone name and pairing verification information through the service.
- Signing in alone does not authorize a new device. Pairing includes computer-key verification and approval on a trusted device. Connect application traffic is additionally encrypted between the phone and computer against the trusted computer key; the connection services do not hold the keys to decrypt that channel. A failed key or protocol check refuses the connection rather than retrying in plaintext.
- Network providers still process connection metadata, such as IP addresses, destination addresses, timing and traffic sizes. This channel protection does not cover the separate speech and notification services below.

### Delete your account

Open the phone's pairing screen, choose the Tobs account option, sign in if needed, then choose **Delete account** and confirm. The request deletes the WorkOS account, removes its linked computer records, tunnels and addresses, and clears the account session and its associated connections from that phone. If a service request or local cleanup fails, the app reports the failure or pending cleanup so you can retry; it does not report an unfinished deletion as complete.

The Connect service retains a minimal deletion record containing the user ID and deletion time to reject old account credentials. Deleting an account does not erase Bots, conversations or files on your computer, or revoke independently paired local network or Tailscale devices. Remove those devices in the computer's device settings when needed. Signing out on a computer unlinks that computer; it is different from deleting the account.

### Messages, files and model services

Messages, attachments and edited dictation text go to the paired computer. That computer may send content to the model providers, tools and messaging services you configure there. Their processing is separate from usage statistics and the optional account service. Review the providers you choose and their privacy policies before sending sensitive content.

### Permissions and notifications

- **Camera**: to scan a pairing code or take a photo you choose to send.
- **Photos**: to select a photo you choose to send.
- **Microphone and speech recognition**: used after you start dictation. The app receives the recognized text for you to review and edit. Recognition uses the device's speech service; depending on platform, language and service availability, audio may be processed by Apple or the recognition provider on Android. The app does not require offline recognition, does not save a dictation audio file, and does not upload that audio to your computer or the Tobs account service.
- **Notifications**: optional. The phone obtains an Expo push token and registers it with your computer. The computer sends notifications through [Expo's push service](https://docs.expo.dev/push-notifications/faq/) and Apple (APNs) or Google (FCM). Payloads can include computer, device, Bot or channel identifiers and names, notification type, badge count, and a short message or tool-request preview. A tool preview can contain a command, URL, path or other argument summary; private-input values are not included in these previews. The delivery providers process these payloads separately from the encrypted Connect channel. Turn notifications off in app or system settings if you do not want new notifications delivered.

### Statistics

In builds with statistics enabled, the mobile app records opens, pairing attempts and outcomes, connection outcomes with coarse duration bands, and activation milestones such as the first accepted message. Statistics are on by default in those builds, with a notice and a switch in app settings; collection does not wait for you to dismiss the notice. Turn off **Usage statistics** in the mobile app to stop collection and delete its queued events and random installation ID. This preference is separate from the Host setting, and the ID is not linked to website visits or Host identities.

Each event carries a random installation ID and a foreground-session UUID, app version and build, iOS or Android, app language and build environment, OS major.minor version, phone/tablet class, total RAM band (the same bands as the plugin), and device year class, an estimate of hardware capability. When available on iOS, it also includes a public model identifier such as `iPhone11,6`, shared by that hardware model; Android reports this field as `unknown`. Unavailable device information is marked `unknown`.

These statistics include only explicitly allowed fields; their exclusions do not describe the separate account and notification processing above. We do not send device names, advertising IDs, Android IDs, serial numbers, exact RAM bytes, pairing links, credentials, push tokens, Host addresses, conversation text or Memory. The app does not record sessions or automatically capture crashes. This collection does not include periodic CPU or memory-use samples, frame-rate measurements or startup timings.

Turning statistics on again creates a new random ID. Details: [mobile statistics](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/mobile-statistics.md).

We do not sell data, use advertising IDs, or track you across apps and websites.

## Contact

Questions are welcome in [GitHub Issues](https://github.com/BotHarness/BotHarness/issues).
