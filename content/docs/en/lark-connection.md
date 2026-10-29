---
{
  "title": "Connect to Lark / Feishu",
  "description": "Connect a custom organization app bot, bind external identities, and manage group and private conversations.",
  "order": 23,
  "source": "docs/lark-connection.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

Connecting a custom Lark or Feishu enterprise app allows your PersonaBot to participate directly in your organization's workspace. Teammates can chat with the Bot in direct messages or `@`-mention it in group chats, and the Bot replies seamlessly within the original conversation.

Before starting, make sure you have installed the plugin according to the [installation guide](/docs/installation) and verified that your Bot replies properly in a local DM.

## Key concepts

| Setting | Location | Description |
| --- | --- | --- |
| **IM App Connection** | Settings → IM bots → Lark / Feishu | Manages the persistent WebSocket connection and credentials (App ID and App Secret) stored locally on your machine |
| **External Identities** | Bot DM → Channel sidebar → External identities | Binds a connected application to this specific Bot and configures admission rules, mutes, and permissions |
| **External Connectors** | Bot DM → Channel sidebar → External connectors | Advanced options: syncs an external conversation into a local Channel or configures backup proactive delivery targets |

Lark (international) and Feishu (mainland China) operate as independent platforms. Make sure to open the developer portal corresponding to your workspace region: visit open.feishu.cn for Feishu, or open.larksuite.com for Lark.

## 1. Create and configure your app in the developer console

1. Open the [Lark Developer Console](https://open.larksuite.com/app) or [Feishu Developer Console](https://open.feishu.cn/app).
2. Click **Create Custom App**, enter an intuitive name (such as "AI Assistant"), and upload an avatar.
3. In the application details, go to **Add Features** and enable the **Bot** feature.
4. Under **Credentials & Basic Info**, locate your **App ID** and **App Secret**.
5. Navigate to **Permissions & Scopes → Tenant token scopes** and add the following permissions:
   - `im:message.group_at_msg:readonly`: Receive messages in group chats where the bot is `@`-mentioned (required for group chats).
   - `im:message.p2p_msg:readonly`: Receive 1:1 private messages sent to the bot (required for direct messages).
   - `im:message:send_as_bot`: Send and reply to messages as the bot application.
   - `im:message:readonly`: Read message content and resource metadata for context parsing.
   - `im:message.group_msg` (optional): Read all ordinary messages in a group (request only if you want the Bot to observe unmentioned discussions).
   - `im:resource` (optional): Upload images or file attachments.
6. Open **Events & Callbacks → Event Configuration**, choose **Persistent connection (WebSocket)** mode, and subscribe to `im.message.receive_v1`.
   > Tip: If the developer console requires an active connection before saving the WebSocket configuration, complete Step 2 below first, then return to save the event.
7. Go to **Version Management & Release**, publish a new version, and obtain administrator approval if required by your organization.
8. Add the newly published robot application to your test group.

## 2. Connect the app in your local workspace

1. In DSH, open **Settings → IM bots → Feishu / Lark**.
2. Select **Manual setup** and choose **Lark (International)** or **Feishu**.
3. Enter the **App ID** and **App Secret** from your developer console, then click **Bind and connect**.
4. Once connected, the status will show **Normal / Ready**. Your credentials remain encrypted locally on your machine.

## 3. Bind the app to your PersonaBot

1. In **Bot mode**, open the target Bot's DM.
2. In the right-hand **Channel sidebar**, expand **External identities** and click **+ Bind app**.
3. Select your connected app from the dropdown list. Each application can be bound to one Bot at a time.
4. Choose an admission policy for **New conversations**:
   - **Automatic (default)**: The Bot automatically admits new DMs or groups upon receiving their first message.
   - **Ask first**: New conversations are placed in a **Waiting** list until you explicitly approve them.

In the conversation list under External identities, you can manage individual chats:
- **Mute**: Keep the conversation active without triggering model wakeups.
- **Rules**: Allow or disallow unmentioned ordinary messages in groups.
- **Block**: Reject messages from this conversation until unblocked.

## 4. Test and verify replies

1. In your Lark or Feishu test group, `@`-mention the robot or send it a private message (e.g., "Hello, please reply LARK-OK").
2. In the Bot DM's sidebar, check the **Bot Inbox** to verify the incoming event with its sender, group, and content.
3. The Bot will process the request and reply directly in the original Lark conversation.

## 5. Advanced: channel sync and mobile approvals

### Synchronize an external group to a local channel

If you want to monitor external group discussions in DSH, click **Sync** next to the group in the conversation list and assign it to a local channel. Messages sent in Lark will appear in your local channel, while Bot responses continue to be sent back to the Lark group.

### Mobile approval cards

By sending `/pair` to the bot in a Lark DM, you can pair your personal Lark account as an administrator under **IM Admin Pairing**. When the Bot runs tools that require confirmation (like file edits or command execution), it can send an interactive approval card directly to your private Lark chat, allowing you to approve or reject actions on the go.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Connection fails | Verify whether you selected the right platform (Lark vs Feishu) and ensure the App ID and Secret have no accidental trailing spaces. |
| App list is empty when binding | Confirm the app is connected in Settings → IM bots and not already bound to another Bot. |
| No reply to group `@`-mentions | Ensure the robot is added to the group, the app version is approved and released, `im:message:send_as_bot` is granted, and local DMs work. |
| DMs work, but groups do not | Verify that `im:message.group_at_msg:readonly` is granted and check whether the group conversation is muted or waiting for approval. |
| Error code 99991672 | Check that the `im:message:readonly` scope is granted and published under Tenant token scopes. |
