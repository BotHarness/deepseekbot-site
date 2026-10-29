---
{
  "title": "Quickstart",
  "description": "Install Tobs, configure a model, create your first PersonaBot, and connect a messaging app.",
  "order": 11,
  "source": "apps/docs/src/content/docs/docs/quickstart.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

## 1. Install the plugin

Follow the [illustrated installation guide](/docs/installation): in DSH, open **Plugins → Add plugin**, enter `@botharness/tobs@1.6.0`, install it, and click **Enable now**. We recommend **DSH `0.2.1-rc.3`** (compatible with `0.2.0-rc.2` and later `0.2.x` releases).

## 2. Configure a model provider

Open **Settings → Models** and add your provider's API endpoint and key. For a step-by-step walkthrough, see [API and Bot model setup](/docs/model-setup).

## 3. Create your first PersonaBot

Switch to **Bot mode** in the left sidebar, pick a model in **Home**, and follow Tob's onboarding flow to create your first Bot and group chat (or create one anytime using the **+** button).

Inside a Bot DM, you can open **Model** in the right-hand Channel sidebar (or **··· → Channel settings… → Model**) to choose the main conversation model and background task model. Send a quick "hello" to make sure your Bot replies properly.

## 4. Connect a messaging app

Once local DMs work, you can connect your Bot to external messaging platforms:

- [Connect to Lark / Feishu](/docs/lark-connection)
- [Connect a QQ Bot](/docs/qq-connection)
- [Connect personal WeChat](/docs/wechat-connection)
- [Connect to Slack](/docs/slack-connection)

## 5. Explore the Channel sidebar and settings

- [Channel sidebar](/docs/channel-sidebar): inspect and edit Memory files, track background Sessions, check the Bot Inbox, grant local workspace folders, manage groups, and switch between Simple and Advanced layouts.
- [Settings guide](/docs/settings): customize global preferences, Bot concurrency, persona and avatar, wake policies, and workspace permissions.
