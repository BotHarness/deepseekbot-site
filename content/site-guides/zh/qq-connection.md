---
{
  "title": "接入 QQ 机器人：从注册到群内回复",
  "description": "完成腾讯开放平台注册与官方 QQ 机器人创建，在 DeepSeekBot 中连接绑定、开启手机端群权限并实现群内互动回复。",
  "order": 25,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/zh/qq-connection.md"
}
---

接入官方 QQ 机器人只需五个步骤：**腾讯开发者实名认证 → 创建官方 QQ 机器人应用 → 在 DeepSeekBot 中连接并绑定 → 开启手机 QQ 群权限 → 在群内 `@` 机器人测试回复**。如果你已经创建好了官方 QQ 机器人应用，可以直接从第 4 步开始。

点击文中任意配图均可查看原图大图。

## 开始前准备

- 一个 [QQ 开放平台](https://bot.q.qq.com/open) 开发者账号，以及一个你拥有群主或管理员权限的测试 QQ 群。
- 已安装并运行的 DeepSeekBot、可用的模型以及目标 PersonaBot。建议先在本地私聊中确认 Bot 能正常回复（参考[安装指南](/docs/installation)、[模型配置](/docs/model-setup)与 [2 核 4 GB VPS 部署指南](/docs/vps-qq-tutorial)）。
- **同一个 QQ 机器人应用同一时间只能由一个运行中的 Host 实例接收消息。** 如果你在另一台机器或测试环境上连接过同一个应用，请先停用旧实例再切换。

## 1. 注册并完成开发者认证

打开 [QQ 开放平台](https://bot.q.qq.com/open)。已有开发者账号可直接登录；新用户请根据自身情况选择 **个人** 或 **企业** 主体注册，完成邮箱激活与管理员实名认证（企业主体还需完成营业执照与对公账户认证）。

<figure>
<a href="/guides/qq/03-subject-type.png"><img src="/guides/qq/03-subject-type.png" alt="腾讯官方展示个人与企业开发者主体选择" loading="lazy" decoding="async"></a>
<figcaption>在开放平台选择个人或企业主体完成注册与实名认证。</figcaption>
</figure>

根据目前的[官方指引](https://bot.q.qq.com/wiki/)，个人与企业开发者均支持开发 QQ 群机器人（后续部分高级接口权限可能因主体类型而异）。请在应用管理后台确认认证已通过后再继续。

## 2. 创建官方 QQ 机器人应用

进入应用管理后台，点击 **创建机器人**，填写机器人的名称、头像与简介。创建成功后进入应用详情页，系统会为其生成唯一的 `AppID`。

<figure>
<a href="/guides/qq/04-create-app.png"><img src="/guides/qq/04-create-app.png" alt="腾讯应用管理页面的创建机器人按钮" loading="lazy" decoding="async"></a>
<figcaption>在应用列表中点击“创建机器人”。</figcaption>
</figure>

<figure>
<a href="/guides/qq/05-bot-details.png"><img src="/guides/qq/05-bot-details.png" alt="填写腾讯机器人名称、头像与介绍表单" loading="lazy" decoding="async"></a>
<figcaption>填写机器人的名称、头像与简介信息。</figcaption>
</figure>

接着在 **开发设置** 中找到 **AppID** 和 **AppSecret**。稍后我们只需要把这两个值填入本机的 DeepSeekBot 设置中。请注意区分 QQ 号、AppID、Token 与 AppSecret，并妥善保管好 AppSecret，不要泄露给他人或发到公开截图中。

## 3. 配置 QQ 群场景与沙箱测试群

在开放平台后台打开 **开发 → 沙箱配置**，勾选 QQ 群场景并添加你的测试群。保存后，该群的群主或管理员即可打开手机 QQ，进入 **群设置 → 群机器人 → 添加测试机器人**，将刚刚创建的机器人拉入群内。

<figure>
<a href="/guides/qq/06-sandbox.png"><img src="/guides/qq/06-sandbox.png" alt="腾讯沙箱配置中独立的频道与 QQ 群配置" loading="lazy" decoding="async"></a>
<figcaption>在沙箱配置中选择“在 QQ 群配置”（注意不要误选为仅配置频道）。</figcaption>
</figure>

沙箱测试群通常对群主/管理员身份及群成员人数上限有一定要求，具体以开放平台后台提示为准。后续如果你需要将机器人发布到正式群，还需按平台要求提交自测报告、完成审核上架；如果开启了生产环境的 **IP 白名单**，请填写运行 DeepSeekBot 机器的公网出口 IP（而非 `127.0.0.1` 或 Tailscale 内网 IP）。

## 4. 在 DeepSeekBot 中连接 QQ 应用

确认 Bot 在本地私聊能正常回复后，点击左下角 **设置 → IM 机器人 → QQ → 手动接入**，填入刚才获取的 **AppID** 与 **AppSecret**，点击 **绑定并连接**。

> 提示：界面上的扫码入口用于快速新建机器人；如果你要接入自己在开放平台创建的现有机器人，请使用 **手动接入**。

<figure>
<a href="/guides/qq/09-manual-setup.png"><img src="/guides/qq/09-manual-setup.png" alt="QQ 手动接入界面，包含空白的 AppID 与 AppSecret 输入框" loading="lazy" decoding="async"></a>
<figcaption>路径：设置 → IM 机器人 → QQ → 手动接入，填入 AppID 与 AppSecret 后点击“绑定并连接”。</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/09-manual-setup.png">
<source src="/guides/qq/qq-manual-setup.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-manual-setup.zh.vtt" srclang="zh" label="中文" default>
<track kind="subtitles" src="/guides/qq/qq-manual-setup.en.vtt" srclang="en" label="English">
</video>

## 5. 将 QQ 应用绑定给你的 PersonaBot

连接成功后，打开目标 Bot 的私聊窗口，在右侧栏展开 **外部身份（External identities）** → **绑定应用（Bind app）**，选择刚才连接好的 QQ 应用并确认。

如果你的新会话准入策略设为 **先询问（Ask first）**，首次在群里 `@` 机器人后，记得在外部身份的会话列表里点击允许该群聊（默认 **自动** 模式则无需手动批准）。详情参见[外部身份与会话管理](/docs/channel-sidebar/external-identities)。

<figure>
<a href="/guides/qq/07-app-bound.png"><img src="/guides/qq/07-app-bound.png" alt="DeepSeekBot 显示 QQ 应用已成功绑定到目标 Bot" loading="lazy" decoding="async"></a>
<figcaption>在 Bot 私聊侧栏中将已连接的 QQ 应用绑定给该 Bot。</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/07-app-bound.png">
<source src="/guides/qq/qq-binding.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-binding.zh.vtt" srclang="zh" label="中文" default>
<track kind="subtitles" src="/guides/qq/qq-binding.en.vtt" srclang="en" label="English">
</video>

## 6. 在手机 QQ 中检查群机器人权限

把机器人拉进测试群后，群主或管理员可以在手机 QQ 上管理它在群内的接收与发言权限。

### 从机器人资料卡打开设置

在手机 QQ 中打开测试群，点击机器人的头像打开资料卡，再点击右上角的 **齿轮图标**（下图中红色箭头处）：

<figure>
<a href="/guides/qq/01-mobile-bot-profile-settings.png"><img src="/guides/qq/01-mobile-bot-profile-settings.png" alt="手机 QQ 机器人资料卡，红色箭头指向右上角设置齿轮" width="360" loading="lazy" decoding="async"></a>
<figcaption>在群内打开机器人的资料卡，点击右上角设置按钮。</figcaption>
</figure>

### 按需设置消息接收范围与主动发言

在权限设置页中，有两个常用开关：

- **机器人可获取的群聊消息范围**：控制 QQ 向机器人推送哪些消息。如果你只需要最基础的“`@` 机器人后回复”，保持默认即可；如果你希望机器人能看到未 `@` 的普通群消息（用于观察上下文或定时总结），可以切换为 **获取群内全部消息**。
- **机器人主动在群聊内发言**：控制机器人是否可以在没有被即时 `@` 的情况下向群内主动发送消息（例如耗时超过 5 分钟的任务完成后回传结果）。需要时可将该蓝色开关打开。

<figure>
<a href="/guides/qq/02-mobile-group-permissions.jpg"><img src="/guides/qq/02-mobile-group-permissions.jpg" alt="手机 QQ 群机器人权限页面，展示消息接收范围与主动发言开关" width="360" loading="lazy" decoding="async"></a>
<figcaption>手机 QQ 端可分别设置“消息接收范围”与“主动在群聊内发言”。</figcaption>
</figure>

## 7. 在群内 `@` 机器人测试回复

回到测试 QQ 群，输入 `@` 并从弹出的成员列表中选中你的机器人（注意要通过列表选中真正的 `@` 提及，而不是纯手打名字文字），发送一条测试消息，即可在同一个群里看到机器人的回复。

<figure>
<a href="/guides/qq/08-group-before-after.png"><img src="/guides/qq/08-group-before-after.png" alt="真实 QQ 群内 @ 机器人后的回复效果，包含服务重启前后的两次对话" loading="lazy" decoding="async"></a>
<figcaption>在 QQ 群内 @ 机器人后收到实时回复，重启 Host 服务后绑定与回复能力依然保持。</figcaption>
</figure>

## 更多进阶用法

基础的群内 `@` 回复跑通后，你还可以按需开启以下能力：

- **同步到本地群聊**：在首次 `@` 互动后，打开外部身份的会话列表，点击该 QQ 群右侧的 **同步（Sync）**，选择一个包含该 Bot 的本地群聊。之后群里的提及也会同步显示在本地群里，而 Bot 的回复依然会发回原 QQ 群。你也可以随时对该群设置 **免打扰（Mute）** 或 **屏蔽（Block）**。
- **同一个 QQ 群里放多个 Bot**：为每个 PersonaBot 分别绑定各自独立的 QQ 机器人应用，再把它们同步到同一个本地群聊中，每个 Bot 都会用自己的 QQ 机器人身份在群内发言。
- **超过 5 分钟的长任务结果回传**：QQ 官方对被动回复有 5 分钟的时效限制。当后台任务耗时超过 5 分钟才完成时，只要你开启了群内的主动发言权限并授权了发送目标，Bot 会在任务完成后把结果主动发回原群（受平台每小时主动消息配额限制）。
- **图片、文件与语音处理**：在 `@` 机器人的消息中附带图片，或引用群内的文件、语音消息并 `@` 机器人，Bot 即可读取内容、调用工具处理并在群里回传结果（识别图片需为 Bot 配置支持视觉输入的模型）。
- **接收群内普通消息**：默认情况下机器人只接收 `@` 它的消息。如果你在手机 QQ 上开启了 **获取群内全部消息**，并在该群会话的 **规则（Rules）** 中允许接收普通消息，Bot 就能静默收集群聊上下文或按批处理。

注：目前暂不支持 QQ 一对一私聊（C2C），如需使用私聊斜杠指令，可在本地私聊或飞书、微信、Slack 中使用。

## 常见问题排查

| 现象 | 排查方向 |
| --- | --- |
| 无法创建机器人或无法拉入群 | 检查开放平台实名认证状态、沙箱群配置，以及操作人是否为该群的群主或管理员。 |
| 手机添加测试机器人列表为空 | 确认开放平台沙箱配置中已保存该群号、群人数符合平台沙箱要求，且当前登录的是群主/管理员账号。 |
| 手动接入报错或频繁断开 | 核对 AppID 与 AppSecret 是否填反或有空格、服务器外网出口是否正常，以及是否开启了 IP 白名单但未放行当前机器公网 IP。 |
| 显示已连接但群内 `@` 无回复 | 检查本地私聊模型是否正常、QQ 应用是否已绑定到该 Bot、新会话是否在等待手动允许，以及是否有另一台机器占用了同一个 AppID。 |
| 主动发言失败 | 检查手机 QQ 群设置中是否已开启 **机器人主动在群聊内发言**，并留意平台的主动消息频率限制。 |

延伸阅读：[QQ 机器人官方群消息接口文档](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_messages.post.html) · [群消息事件文档](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/group_message_create.html)
