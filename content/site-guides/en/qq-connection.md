---
{
  "title": "Connect a QQ Bot: registration to group replies",
  "description": "Register an official QQ Bot app, connect and bind it in DeepSeekBot, configure mobile group permissions, and test group replies.",
  "order": 25,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/en/qq-connection.md"
}
---

Connecting an official QQ Bot takes five steps: **Tencent developer verification → create an official QQ Bot app → connect and bind it in DeepSeekBot → configure mobile QQ group permissions → `@`-mention the Bot in your group**. If you already have an official QQ Bot application, jump straight to step 4.

Click any screenshot to view it at full size.

## What you need

- A developer account on the [QQ Open Platform](https://bot.q.qq.com/open) and a test QQ group where you are the owner or an administrator.
- A running DeepSeekBot instance with a working model and a target PersonaBot. Make sure your Bot can reply in a local DM first (see [installation](/en/docs/installation/), [model setup](/en/docs/model-setup/), and the [2-core / 4 GB VPS guide](/en/docs/vps-qq-tutorial/)).
- **One active receiving Host per QQ App.** Only one running Host instance should connect to a given QQ App at a time; stop any previous instance before switching machines.

## 1. Register and verify your developer account

Open the [QQ Open Platform](https://bot.q.qq.com/open). Sign in if you already have an account, or register as an **individual (个人)** or **enterprise (企业)** developer, activate your email, and complete identity verification (enterprise accounts also complete business license and corporate bank checks).

<figure>
<a href="/guides/qq/03-subject-type.png"><img src="/guides/qq/03-subject-type.png" alt="Tencent Open Platform showing personal and enterprise developer options" loading="lazy" decoding="async"></a>
<figcaption>Choose personal or enterprise developer registration on the QQ Open Platform.</figcaption>
</figure>

The current [official documentation](https://bot.q.qq.com/wiki/) supports QQ group development for both personal and enterprise accounts (though certain advanced API scopes may differ). Make sure your account verification is approved in the console before moving on.

## 2. Create an official QQ Bot application

In the application management console, click **创建机器人 (Create robot)**, fill in a name, avatar, and description, and open the newly created application once its `AppID` is generated.

<figure>
<a href="/guides/qq/04-create-app.png"><img src="/guides/qq/04-create-app.png" alt="Create robot button in the Tencent application console" loading="lazy" decoding="async"></a>
<figcaption>Click "创建机器人 (Create robot)" from your application list.</figcaption>
</figure>

<figure>
<a href="/guides/qq/05-bot-details.png"><img src="/guides/qq/05-bot-details.png" alt="Robot details form with name, avatar, and description" loading="lazy" decoding="async"></a>
<figcaption>Fill in the robot's name, avatar, and description.</figcaption>
</figure>

Next, open **开发设置 (Development settings)** to find your **AppID** and **AppSecret**. Keep your AppSecret private—you will only enter it into your local DeepSeekBot settings in step 4. Note that your QQ number, AppID, Token, and AppSecret are distinct values.

## 3. Configure the QQ group sandbox

Open **开发 → 沙箱配置 (Development → Sandbox configuration)** in the console, select the QQ group scenario (**在QQ群配置**), and add your test group. Once saved, the group owner or administrator can open mobile QQ and go to **群设置 → 群机器人 → 添加测试机器人 (Group settings → Group robots → Add test robot)** to add the robot to the group.

<figure>
<a href="/guides/qq/06-sandbox.png"><img src="/guides/qq/06-sandbox.png" alt="Tencent sandbox settings showing separate channel and QQ group configuration" loading="lazy" decoding="async"></a>
<figcaption>Select the QQ group sandbox option ("在QQ群配置") rather than the channel-only option.</figcaption>
</figure>

Sandbox testing requires group owner or administrator privileges and a group within the platform's member-count limit. Later, if you publish the bot beyond the sandbox, follow the platform's review process; if you enable production **IP allowlisting**, add your Host's public outbound IP address (not `127.0.0.1` or a Tailscale IP).

## 4. Connect the QQ App in DeepSeekBot

Once your Bot can reply in a local DM, open **Settings → IM bots → QQ → Manual setup**, enter your **AppID** and **AppSecret**, and click **Connect (绑定并连接)**.

> Tip: The QR code option creates a brand-new bot; to connect an existing QQ Bot application from the console, always choose **Manual setup**.

<figure>
<a href="/guides/qq/09-manual-setup.png"><img src="/guides/qq/09-manual-setup.png" alt="QQ Manual setup dialog with AppID and AppSecret fields" loading="lazy" decoding="async"></a>
<figcaption>Go to Settings → IM bots → QQ → Manual setup, enter your AppID and AppSecret, and click Connect.</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/09-manual-setup.png">
<source src="/guides/qq/qq-manual-setup.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-manual-setup.en.vtt" srclang="en" label="English" default>
<track kind="subtitles" src="/guides/qq/qq-manual-setup.zh.vtt" srclang="zh" label="中文">
</video>

## 5. Bind the QQ App to your PersonaBot

Open the target Bot's DM, expand **External identities** in the right-hand sidebar, click **Bind app**, and select your connected QQ application.

If your new-conversation policy is set to **Ask first**, remember to approve the group conversation under **External identities** after sending your first `@`-mention (with the default **Automatic** policy, new group conversations are admitted automatically). See [External identities](/en/docs/channel-sidebar/external-identities/) for details.

<figure>
<a href="/guides/qq/07-app-bound.png"><img src="/guides/qq/07-app-bound.png" alt="DeepSeekBot showing the QQ application bound to the target Bot" loading="lazy" decoding="async"></a>
<figcaption>Bind the connected QQ application to your PersonaBot in the DM sidebar.</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/07-app-bound.png">
<source src="/guides/qq/qq-binding.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-binding.en.vtt" srclang="en" label="English" default>
<track kind="subtitles" src="/guides/qq/qq-binding.zh.vtt" srclang="zh" label="中文">
</video>

## 6. Configure mobile QQ group permissions

After adding the robot to your test group, the group owner or administrator can configure its message scope and proactive speaking permissions in mobile QQ.

### Open settings from the robot's profile

In mobile QQ, open the group, tap the robot's avatar to open its profile card, and tap the **gear icon** in the top-right corner (marked by the red arrow):

<figure>
<a href="/guides/qq/01-mobile-bot-profile-settings.png"><img src="/guides/qq/01-mobile-bot-profile-settings.png" alt="Mobile QQ robot profile card with a red arrow pointing to the settings gear" width="360" loading="lazy" decoding="async"></a>
<figcaption>Open the robot's profile card in the group and tap the top-right settings icon.</figcaption>
</figure>

### Choose message scope and proactive speech settings

On the permissions screen, you can configure two independent options:

- **机器人可获取的群聊消息范围 (Group message reception scope)**: Controls which messages QQ delivers to the robot. Basic `@`-mention replies work with the default setting; switch to **获取群内全部消息 (All group messages)** only if you also want the Bot to observe unmentioned group messages or generate periodic summaries.
- **机器人主动在群聊内发言 (Proactive speech in group)**: Allows the robot to post messages proactively without being immediately `@`-mentioned (for example, posting results when a background task finishes after 5 minutes). Turn the blue switch on if you need proactive messages.

<figure>
<a href="/guides/qq/02-mobile-group-permissions.jpg"><img src="/guides/qq/02-mobile-group-permissions.jpg" alt="Mobile QQ settings showing message reception scope and proactive speech toggle" width="360" loading="lazy" decoding="async"></a>
<figcaption>Configure message reception scope and proactive speech permissions in mobile QQ.</figcaption>
</figure>

## 7. Test `@`-mention replies in your QQ group

In your QQ group, type `@` and pick the robot from the mention menu (make sure to select an actual mention rather than typing its name as plain text). Send a message and confirm that the Bot replies right in the group.

<figure>
<a href="/guides/qq/08-group-before-after.png"><img src="/guides/qq/08-group-before-after.png" alt="QQ group @-mentions and matching replies from the Bot before and after Host restart" loading="lazy" decoding="async"></a>
<figcaption>Real-time group replies to @-mentions, retained across Host restarts.</figcaption>
</figure>

## What else you can do

Once basic `@`-mention replies are working, you can enable additional features as needed:

- **Sync to a local group:** After the first `@`-mention, click **Sync** next to the conversation under **External identities** and choose a local group containing your Bot. Future mentions will show up in the local group while the Bot's replies still go back to the original QQ group. You can also **Mute** or **Block** individual conversations at any time.
- **Multiple Bots in one QQ group:** Bind each PersonaBot to its own QQ Bot application, then sync both conversations into the same local group. Each Bot will reply in the QQ group using its own application identity.
- **Results for tasks taking over 5 minutes:** QQ's passive reply window is 5 minutes. When a longer task finishes after that window, the Bot can post the result back to the group using an authorized send target (within QQ's hourly proactive message quota).
- **Images, files, and voice messages:** Attach an image to your `@`-mention, or quote a file or voice message while `@`-mentioning the Bot, and the Bot can read, process, and reply with an image or file (reading images requires a vision-capable model).
- **Ordinary group messages:** By default, only `@`-mentions are admitted. If you enable **获取群内全部消息 (All group messages)** in mobile QQ and opt in under the conversation's **Rules**, the Bot can collect ordinary messages for context or periodic summaries.

Note: Direct 1:1 QQ private messages are not supported yet; use a local DM or another connected platform for DM slash commands.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Cannot create or add a robot | Check developer identity verification, sandbox group configuration, and whether your account is the group owner or an admin. |
| Sandbox robot missing on mobile | Confirm the group number is saved in the platform sandbox, the group meets size limits, and you are signed in as the group owner/admin. |
| Connect fails or disconnects | Double-check your AppID and AppSecret, outbound network access, and production IP allowlist settings. |
| Connected, but no `@` reply in group | Confirm local DMs work, the QQ App is bound to this Bot, the conversation isn't waiting for approval, you used the `@` mention picker, and no other Host is connected to the same App. |
| Proactive sending fails | Make sure **机器人主动在群聊内发言** is turned on in mobile QQ and check platform rate limits. |

Further reading: [Official QQ group-message API](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_messages.post.html) · [Group-message events reference](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/group_message_create.html)
