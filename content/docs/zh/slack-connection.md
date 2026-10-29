---
{
  "title": "连接 Slack",
  "description": "通过 Socket Mode 连接 Slack 应用，将机器人绑定到 PersonaBot，并在 Slack 频道与私聊中协同交互。",
  "order": 24,
  "source": "docs/slack-connection.zh.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

通过 Slack 应用，你可以让 PersonaBot 进驻团队的 Slack 工作区。成员在频道里 `@` 机器人或在私聊中给它发送消息，Bot 都会自动调用大模型，并在原 Thread 话题或私聊中进行回复。

整个连接过程采用 Slack 官方推荐的 **Socket Mode（WebSocket）**，直接由本机向外发起连接，不需要配置公网 IP、域名或暴露 Webhook 端口。

## 核心设置概览

| 设置项 | 入口位置 | 作用说明 |
| --- | --- | --- |
| **IM 应用连接** | 设置 → IM 机器人 → Slack | 管理本机与 Slack 之间的连接凭据（Bot Token 与 App Token） |
| **外部身份** | Bot 私聊 → 右侧栏 → 外部身份 | 将 Slack 应用绑定给指定 Bot，管理进入该 Bot 的频道与私聊会话 |
| **外部连接器** | Bot 私聊 → 右侧栏 → 外部连接器 | 高级选项：将 Slack 频道实时同步到本地 Channel，实现跨端联动 |

## 1. 在 Slack 开放平台创建应用

1. 打开 [Slack API 平台应用列表](https://api.slack.com/apps)。
2. 点击 **Create New App**，在弹出的窗口中选择 **From an app manifest**。
3. 选择你的目标 Slack 工作区，将下面的 Manifest 模板粘贴到配置框中（也可直接在 DSH 界面的“设置 → IM 机器人 → Slack → 开始接入”中点击“复制 Manifest”）：

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

4. 核对权限与设置无误后，点击 **Create** 完成创建。

## 2. 配置 Socket Mode 并获取两种 Token

在连接 Slack 时，你需要获取两枚不同的 Token：

### 获取 App-Level Token（用于 Socket Mode 长连接）

1. 在应用后台打开 **Basic Information**，向下滚动到 **App-Level Tokens** 区域。
2. 点击 **Generate Token and Scopes**。
3. 为 Token 起一个名称（如 `socket-token`），点击 **Add Scope** 并勾选 **`connections:write`**。
4. 点击 **Generate** 生成以 `xapp-...` 开头的 App Token，并妥善复制保存。

### 获取 Bot User OAuth Token（用于发送与读取消息）

1. 在左侧菜单点击 **Install App**（或 **OAuth & Permissions**），点击 **Install to Workspace** 并授权安装到工作区。
2. 安装完成后，在 **OAuth & Permissions** 页面顶部即可复制以 `xoxb-...` 开头的 **Bot User OAuth Token**。

## 3. 在本机连接 Slack

1. 打开 DSH 界面左下角的 **设置 → IM 机器人 → Slack**。
2. 将刚才获取的 **Bot Token（`xoxb-...`）** 与 **App Token（`xapp-...`）** 分别填入对应输入框中。
3. 点击 **验证并连接**。连接成功后，状态会显示为 **运行正常**。凭据仅保存在你本机。

## 4. 将 Slack 应用绑定到 PersonaBot

1. 在 **Bot 模式** 中打开目标 Bot 的私聊窗口。
2. 展开右侧栏的 **外部身份（External identities）**，点击 **+ 绑定应用**。
3. 选择刚刚连接好的 Slack 应用。绑定成功后，状态会更新为 **已就绪**。
4. 打开 Slack，将机器人邀请到你的测试频道中（在频道中输入 `/invite @你的机器人名`）。

## 5. 测试与验证回复

1. **测试频道 `@` 回复**：在已拉入机器人的 Slack 频道中，输入 `@` 并选中机器人，发送测试消息（例如：“@助手 请回复 SLACK-OK”）。Bot 收到消息后，会在原消息下开启或跟进 Thread 进行回复。
2. **测试 1:1 私聊**：在 Slack 的 Apps 列表中找到你的机器人，直接发送一条私聊消息。在 Bot 私聊侧栏的 **Bot 收件箱** 中确认事件接收无误后，Bot 会在 Slack 私聊中回复。
3. **管理会话准入**：如果你的新会话准入策略为 **先问我**，首次发来消息的频道或私聊会出现在 **等待处理** 列表中，点击允许后才会开始回复。

## 6. 高级功能：普通消息监听与表情状态

- **监听群内未 `@` 的普通消息**：如果希望 Bot 协助总结整个频道的对话，可以在 Slack 应用权限中增加 `channels:history` 与 `message.channels` 事件，并在本地该频道会话的 **规则** 中开启“全部消息”接收与批量汇总（例如累计 5 条或 30 秒处理一次）。
- **接收文件与图片**：为应用添加 `files:read` 和 `files:write` 权限后，在 `@` 消息中上传的文件或图片即可被 Bot 读取并调用工具处理。
- **状态表情反馈**：若应用开通了 `reactions:write` 权限，Bot 收到消息并排队处理时会在原消息上打上 👀 表情，处理完成并发送回复后会切换为 ✅ 表情。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 连接失败或提示 Token 错误 | 检查两个 Token 是否填反：App Token 应以 `xapp-` 开头，Bot Token 应以 `xoxb-` 开头，且 App Token 必须包含 `connections:write` 权限。 |
| 频道里 `@` 机器人没有回复 | 检查机器人是否已经通过 `/invite @机器人` 拉入该频道、Event Subscriptions 中是否订阅了 `app_mention` 事件，以及本地私聊模型是否工作正常。 |
| 私聊消息收不到 | 确认在 OAuth Scopes 中添加了 `im:history` 和 `im:read`，并在 Event Subscriptions 中订阅了 `message.im`，权限修改后需点击“Reinstall to Workspace”重新安装生效。 |
| 无法接收普通群聊消息 | 确认已添加 `channels:history` 权限与 `message.channels` 事件，并在本地外部身份该会话的规则中启用了接收普通消息。 |
