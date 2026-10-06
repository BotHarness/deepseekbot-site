---
{ "title": "Privacy", "description": "What anonymous analytics the DeepSeekBot site and plugin collect, why, and how to turn them off." }
---

We collect anonymous analytics for one reason: **to improve DeepSeekBot by learning how it is used and where site visitors come from**. We collect nothing that identifies you, and never your conversations or Memory. The code doing this is open source: [site](https://github.com/BotHarness/deepseekbot-site), [plugin](https://github.com/BotHarness/BotHarness), and the design is recorded in [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md).

Data is stored in [PostHog](https://posthog.com)'s US region and forwarded through our own domain, `t.botharness.ai`. PostHog uses the IP address only to infer the country or region, then discards it; it is never stored.

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

## Contact

Questions are welcome in [GitHub Issues](https://github.com/BotHarness/BotHarness/issues).
