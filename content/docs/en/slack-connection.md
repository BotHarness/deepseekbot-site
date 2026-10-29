---
{
  "title": "Connect to Slack",
  "description": "Connect a Slack App via Socket Mode, bind it to a PersonaBot, and collaborate in channels and direct messages.",
  "order": 24,
  "source": "docs/slack-connection.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

Connecting a Slack app allows your PersonaBot to join your team's Slack workspace. Teammates can chat with the Bot directly in DMs or `@`-mention it in channels, and the Bot replies naturally within the original Slack thread or conversation.

The connection runs over Slack's official **Socket Mode (WebSocket)**, connecting outbound from your computer with no public IP, reverse proxy, or webhook endpoints required.

## Key concepts

| Setting | Location | Description |
| --- | --- | --- |
| **IM App Connection** | Settings → IM bots → Slack | Manages your workspace connection credentials (Bot Token and App Token) stored locally on your machine |
| **External Identities** | Bot DM → Channel sidebar → External identities | Binds a Slack app to this Bot and controls conversation admission, mutes, and rules |
| **External Connectors** | Bot DM → Channel sidebar → External connectors | Advanced options: synchronizes Slack channels into local channels for team visibility |

## 1. Create a Slack app from a manifest

1. Open your [Slack App Management page](https://api.slack.com/apps).
2. Click **Create New App** and select **From an app manifest**.
3. Choose your target workspace, paste the following YAML manifest into the configuration editor (or copy it from DSH under **Settings → IM bots → Slack → Start connection**):

```yaml
display_information:
  name: PersonaBot Assistant
  description: AI Assistant powered by BotHarness
features:
  bot_user:
    display_name: Assistant
    always_online: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - chat:write
      - channels:read
      - users:read
      - im:history
      - im:read
settings:
  event_subscriptions:
    bot_events:
      - app_mention
      - message.im
  socket_mode_enabled: true
```

4. Review the scopes and features, then click **Create** to initialize the app.

## 2. Configure Socket Mode and retrieve tokens

You will need two distinct tokens from the Slack developer dashboard:

### Generate the App-Level Token (for Socket Mode)

1. In the app console, go to **Basic Information** and scroll to **App-Level Tokens**.
2. Click **Generate Token and Scopes**.
3. Give it a name (e.g., `socket-token`), click **Add Scope**, and check **`connections:write`**.
4. Click **Generate** and copy the resulting `xapp-...` token.

### Install the app and copy the Bot User OAuth Token

1. Go to **Install App** in the left menu, click **Install to Workspace**, and grant permissions.
2. Under **OAuth & Permissions**, copy the **Bot User OAuth Token** starting with `xoxb-...`.

## 3. Connect Slack in your local workspace

1. In DSH, open **Settings → IM bots → Slack**.
2. Paste your **Bot Token (`xoxb-...`)** and **App Token (`xapp-...`)** into their respective fields.
3. Click **Verify and connect**. Once established, the status will show **Normal / Ready**. Credentials remain strictly local.

## 4. Bind the Slack app to your PersonaBot

1. In **Bot mode**, open the target Bot's DM.
2. In the right-hand **Channel sidebar**, expand **External identities** and click **+ Bind app**.
3. Choose your connected Slack app from the list. The identity status will update to **Ready**.
4. In Slack, invite your robot to a public channel by typing `/invite @YourBotName`.

## 5. Test and verify replies

1. **Channel `@`-mention**: In the channel where you invited the bot, type `@` and select the bot from the mention menu, then send a message (e.g., "@Assistant please reply SLACK-OK"). The Bot will process the request and reply inside the thread.
2. **Direct messages**: Open the bot's direct message tab in Slack and send a greeting. Once received in the Bot Inbox, the Bot will reply in the DM.
3. **Admission management**: If your admission policy is set to **Ask first**, newly seen channels and DMs will appear in your **Waiting** list under External identities until you approve them.

## 6. Advanced: unmentioned messages and reaction indicators

- **Listen to all channel messages**: To have the Bot follow channel conversations without requiring `@`-mentions, add `channels:history` and `message.channels` in your Slack app settings, then enable "All messages" under the channel's **Rules** in DSH (with optional batching, e.g., every 5 messages or 30 seconds).
- **File and image attachments**: With `files:read` and `files:write` granted, files attached to `@`-mentions are delivered to the Bot for tool-assisted processing.
- **Reaction status feedback**: If `reactions:write` is granted to the Bot, it will automatically add a 👀 reaction when a message enters its Inbox and swap it for a ✅ reaction once the reply has been delivered to Slack.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Connection fails | Ensure you didn't swap the two tokens: the App Token starts with `xapp-` (with `connections:write`) and the Bot Token starts with `xoxb-`. |
| No reply to channel `@`-mentions | Make sure the bot was invited to the channel with `/invite @bot`, that `app_mention` is subscribed under Event Subscriptions, and that local DMs work. |
| Direct messages receive no reply | Check that `im:history` and `im:read` are granted under Bot Scopes and `message.im` is subscribed under Bot Events. Remember to click **Reinstall to Workspace** after modifying scopes. |
| Cannot receive ordinary messages | Verify that `channels:history` and `message.channels` are added and that "All messages" is opted-in within the channel's conversation rules. |
