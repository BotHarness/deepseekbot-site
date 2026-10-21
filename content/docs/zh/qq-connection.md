---
{
  "title": "QQ 机器人接入：申请、配置与群聊验收",
  "description": "从腾讯认证、创建官方 QQ 机器人，到 DeepSeekBot 接入、手机权限与真实群聊验收。",
  "order": 25,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/zh/qq-connection.md"
}
---

完成 **腾讯开发者认证 → 创建官方 QQ 机器人 → DeepSeekBot 连接和绑定 → 手机群权限 → 群里真实问答**。已有官方应用可以从第 4 步开始。

点击步骤图片可查看原尺寸。

## 开始前准备

- 可登录 [QQ 开放平台](https://bot.q.qq.com/open) 的管理员账号，以及有管理权限的专用测试群。
- 已运行的 DeepSeekBot、可用模型和目标 Bot。先在本地 DM 取得真实模型回复；参见[安装](/docs/installation/)、[模型设置](/docs/model-setup/)和 [2 核 4GB VPS 教程](/docs/vps-qq-tutorial/)。
- **一个 App 只交给一个运行中的 Host 接收。** 多分支同时测试请分配独立 QA App，切换前停止原接收器。

**版本范围：** 本页流程适用于 DeepSeekBot 1.4.1（npm `deepseekbot`）、DSH `0.2.1-rc.2` 和产品自带的 QQ Provider `4.32.0-botharness.21`。第 4、5、7 步的产品截图和录屏来自历史候选构建 `1.2.1-vps.20261012.sha031a14db`（提交 `031a14db43af5b3bf52e76b01c30e27828e6e9c9`、DSH `0.2.0-rc.1`、QQ Provider `4.32.0-botharness.19`）的真实群聊验收，按钮位置和文案可能略有不同，以你实际安装的版本为准，参见[接入与可选能力](/docs/capabilities/)。腾讯平台说明于 2026-10-12 核对。

## 1. 腾讯平台注册与主体认证

打开 [QQ 开放平台](https://bot.q.qq.com/open)。已有开发者账号直接登录；首次注册按实际身份选择**个人**或**企业**，完成邮箱激活和管理员实名绑定。企业还需按页面要求完成工商资料与对公账户验证。证件、手机号、邮箱验证码和授权二维码由账号持有人私下填写，输入前暂停录屏。

<figure>
<a href="/guides/qq/03-subject-type.png"><img src="/guides/qq/03-subject-type.png" alt="腾讯官方文档的主体选择页面，提供企业与个人两个入口" loading="lazy" decoding="async"></a>
<figcaption>腾讯官方文档示例。红框来自原图，不表示必须选择企业。</figcaption>
</figure>

当前[腾讯接入指南](https://bot.q.qq.com/wiki/)列出了个人和企业的 QQ 群开发场景，后续接口资格仍有差异。检查应用管理页的认证状态和待办提示；企业资质未完成时继续按平台要求处理。不要沿用“个人只能做频道机器人”的旧说法。

## 2. 创建官方 QQ 机器人

在应用管理页点击**创建机器人**，填写名称、头像、说明并提交。成功后生成 AppID，点击该应用进入管理页。这是 QQ 平台应用，稍后还需要绑定到 DeepSeekBot 里的 Bot。

<figure>
<a href="/guides/qq/04-create-app.png"><img src="/guides/qq/04-create-app.png" alt="腾讯应用管理页的创建机器人按钮" loading="lazy" decoding="async"></a>
<figcaption>腾讯官方示例：从应用列表创建机器人。</figcaption>
</figure>

<figure>
<a href="/guides/qq/05-bot-details.png"><img src="/guides/qq/05-bot-details.png" alt="腾讯机器人资料表单，包括名称、头像、说明和下一步按钮" loading="lazy" decoding="async"></a>
<figcaption>腾讯官方示例：填写机器人资料。这些图不是本次重新注册或创建应用的记录。</figcaption>
</figure>

在管理页的**开发设置 / 开发基础信息**查找 AppID 与 AppSecret，稍后只在 DeepSeekBot 原生表单输入。不要把 QQ 号、AppID、Token 和 AppSecret 混用；本页不展示凭据页，也不需要你把 Secret 发给他人。

## 3. 配置 QQ 群场景与测试环境

在**开发 → 沙箱配置**选择 QQ 群场景、保存专用测试群。由管理员在手机 QQ 的群设置中选择**群机器人 → 添加测试机器人**。找不到应用时核对当前管理员、所选 App 和连接环境。

<figure>
<a href="/guides/qq/06-sandbox.png"><img src="/guides/qq/06-sandbox.png" alt="腾讯沙箱配置页面，分别提供频道和 QQ 群测试环境" loading="lazy" decoding="async"></a>
<figcaption>腾讯官方示例：群场景配置不能用频道配置代替。</figcaption>
</figure>

[官方沙箱要求](https://bot.q.qq.com/wiki/)包括群主或管理员权限及群人数限制，按当前控制台检查。**平台环境必须与已安装 Provider 的连接环境一致。** 本次复用已有 QA App 的成功回复不证明任意新沙箱 App 都可直接使用；Provider 没有相应环境选择时先核对支持，不要自行拼 URL 或隐藏 RPC。

正式群使用还需完成平台配置、自测报告、审核与上线，核对使用范围或白名单。正式环境若启用 **IP 白名单**，应填 Host 访问腾讯接口时的公网出口 IP，不能填 loopback 或 Tailscale 私网地址。沙箱测试通过不等于正式上线；创建 App 也不等于任意群可添加。

## 4. 在 DeepSeekBot 连接 QQ App

先确认本地模型 DM 正常，再打开 **Settings → IM bots → QQ → Manual setup**。复用已有应用时填入该 App 的 **AppID** 和 **AppSecret**，点击 **Connect**。凭据输入前暂停录屏，完成后清空或关闭表单再采集。

当前验证版本的扫码入口用于创建 Bot；复用已有 App 走手动连接。找不到 QQ 或 Manual setup 时核对实际 qualified Provider 与版本，不要用其他平台的授权命令代替。

连接后核对真实应用身份与 connected 状态。**Provider 授权、绑定目标 Bot、原群收到回复是三个检查点。** 首次授权由账号持有人完成。开发者已有停止的原生 Profile 时，可以用 [QQ QA 客户端复用脚本](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/agents/qq-test-clients.md)分配 QA1/QA2/QA3，读取所选原生凭据并认领独占接收器；这是开发 helper，不是已发布的 `deepseekbot im-authorize qq` 命令。

<figure>
<a href="/guides/qq/09-manual-setup.png"><img src="/guides/qq/09-manual-setup.png" alt="实际 QQ 手动接入表单，AppID 与 AppSecret 均为空" loading="lazy" decoding="async"></a>
<figcaption>实际补录：设置 → IM机器人 → QQ → 手动接入。中文提交按钮为「绑定并连接」；它连接 Provider，之后仍需绑定 Bot。</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/09-manual-setup.png">
<source src="/guides/qq/qq-manual-setup.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-manual-setup.zh.vtt" srclang="zh" label="中文" default>
<track kind="subtitles" src="/guides/qq/qq-manual-setup.en.vtt" srclang="en" label="English">
</video>

[文字稿与章节](/guides/qq/manual-setup-transcript.md)：只录入口和空表单，凭据输入前停止。经严格 SSH 转发访问同一 VPS，不替代 HTTPS 验证。

## 5. 绑定到目标 Bot

打开目标 Bot 的 DM 侧栏 → **External identities（外部身份）** → QQ，选择已连接应用并确认绑定。按实际界面选择新会话接收方式；使用“先询问”时还要接受新群会话。参见[外部身份](/docs/channel-sidebar/external-identities/)。

<figure>
<a href="/guides/qq/07-app-bound.png"><img src="/guides/qq/07-app-bound.png" alt="DeepSeekBot 确认 QQ QA 应用已绑定到 VPS SEO Tutorial Bot" loading="lazy" decoding="async"></a>
<figcaption>本次实际原生截图：应用绑定成功；没有 Secret、二维码或机器地址。</figcaption>
</figure>

<video controls preload="metadata" playsinline poster="/guides/qq/07-app-bound.png">
<source src="/guides/qq/qq-binding.mp4" type="video/mp4">
<track kind="subtitles" src="/guides/qq/qq-binding.zh.vtt" srclang="zh" label="中文" default>
<track kind="subtitles" src="/guides/qq/qq-binding.en.vtt" srclang="en" label="English">
</video>

17 秒真实绑定实录，不含凭据输入或群聊发送。[字幕与等价文字稿](/guides/qq/binding-transcript.md)可独立阅读。

## 6. 手机 QQ 群机器人权限

以下**两张原有手机截图完整保留**。每个应用、每个群分别设置；必要时由群主或有权限的管理员操作。

### 从资料页进入设置

手机 QQ 打开目标群，进入机器人资料页，点击**右上角齿轮**。红色箭头标出入口。

<figure>
<a href="/guides/qq/01-mobile-bot-profile-settings.png"><img src="/guides/qq/01-mobile-bot-profile-settings.png" alt="手机 QQ 机器人资料页，红色箭头指向右上角设置齿轮" width="360" loading="lazy" decoding="async"></a>
<figcaption>原手机图 1：进入群内机器人资料页，再打开设置。</figcaption>
</figure>

### 接收范围与主动发言分别设置

第一项**机器人可获取的群聊消息范围**决定 QQ 向应用推送哪些消息。图中选择“获取群内全部消息”；基础 @ 回复不必开启全部消息接收，普通消息处理还取决于版本与本地会话策略。

第二项**机器人主动在群聊内发言**允许平台侧主动发送，图中为蓝色开启。需要主动发送时开启，并另外核对 DeepSeekBot 的本地发送授权。**基础 @ 回复验收不要求同时打开这两项。** 不要只凭其他页面的“接收机器人推送”判断主动发言已开启。

<figure>
<a href="/guides/qq/02-mobile-group-permissions.jpg"><img src="/guides/qq/02-mobile-group-permissions.jpg" alt="手机 QQ 设置页，显示获取群内全部消息及已开启的主动发言开关" width="360" loading="lazy" decoding="async"></a>
<figcaption>原手机图 2：顶部两项分别控制接收范围和主动发言。</figcaption>
</figure>

这两张图来自 2026-10-09 QQ 验收，手机版本可能改变文案与布局，请操作自己的应用。

## 7. 在原群验证真实回复与重启恢复

用 QQ 的 @ 选择器选中正确机器人，发送 `请只回复 TUTORIAL_QQ_A_OK`，等待**同一群内该机器人的匹配回复**。纯文本写机器人名字、Connect 成功或发送 API accepted 都不能替代这个检查。

<figure>
<a href="/guides/qq/08-group-before-after.png"><img src="/guides/qq/08-group-before-after.png" alt="QQ 原群两次 @ DeepSeekBot QQ QA 的 A、B marker 请求分别得到匹配回复，其中 B 在 Host 重启后发送" loading="lazy" decoding="async"></a>
<figcaption>本次原群实测：首次 A 问答和重启后新发的 B 问答均可见。测试者提供原图，仅裁剪和遮盖个人身份，消息内容未改写；请使用自己的新 marker。</figcaption>
</figure>

持久化部署只重启自己的 Host，确认 Bot 与绑定保留，再发送新 marker，例如 `请只回复 TUTORIAL_QQ_B_OK`，核对新回复。精确服务与 Owner 登录更新方式见 [VPS 教程](/docs/vps-qq-tutorial/)。不要重启其他人的服务。

排错时关联 Source Event、Bot Inbox 与发送结果；Provider receipt 是过程证据。本次验收覆盖文字 @ 问答，不宣称图片、普通群消息处理或任意主动推送都已验证。

## 接入后还能做什么

基础 @ 问答跑通后，可以按需打开下面这些能力。完整操作和当前限制见产品仓库的 [QQ 接入说明](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/qq-connection.md)。

- **同步到本地群聊：** 第一次被 @ 后，在应用的「编辑身份」会话列表里选择「同步」，把这个 QQ 群接到包含该 Bot 的本地群聊。之后的 @ 会出现在本地群聊里，回复仍发回原 QQ 群。「静音」只接收不唤醒，「屏蔽」停止接收。
- **一个 QQ 群里放两个 Bot：** 每个 Bot 绑定自己的 QQ 应用，再把两个会话同步到同一个本地群聊。每个 Bot 只用自己的应用回复。
- **超过 5 分钟的结果：** QQ 被动回复只有 5 分钟窗口。任务做完时已超时，结果会保留下来；Bot 可以通过已授权的原群发送目标主动补发，受每小时额度限制。
- **图片、文件和语音（开发候选）：** 在 @ 消息里带图片，或引用一条文件、语音消息再 @ Bot，Bot 可以读取、处理并回传图片或文件；看图需要支持图片的模型。这些能力仍在验证中，以实际版本为准。
- **普通群消息（开发候选）：** 默认只收 @ 消息。手机上开启「获取群内全部消息」并在会话中明确选择后，Bot 才会收集普通群消息，用于观察和定时汇总。

QQ 私聊目前不在接入范围内，私聊斜杠命令等功能请使用其他平台或本地私聊。

## 排错

| 现象 | 先检查什么 |
| --- | --- |
| 无法创建或加群 | 主体认证、审核/上线、使用范围、管理员与群场景资格。 |
| 找不到沙箱机器人 | 群管理员、人数条件、平台与 Provider 环境，再从手机群机器人列表添加。 |
| Connect 失败或断开 | AppID/Secret 是否匹配、Provider、服务器出网及正式环境 IP 白名单；只查看不含凭据的摘要。 |
| connected 但 @ 无回复 | 真实模型 DM、Bot 绑定、待接受新会话、真实 @、是否有第二个接收器。 |
| 开全量后 @ 失效 | 当前 Provider 是否支持全量消息事件，不靠反复重发结果不明的旧任务绕过错误。 |
| 主动发送失败 | 手机开关、平台发送限制、本地授权分别检查，先验证基础 @ 回复。 |
| 重启后 Web 未授权 | 私下使用新的 Owner 登录链接，不截图 token、不取消原生认证。 |

## 来源与素材说明

四张腾讯平台图来自[官方接入指南](https://bot.q.qq.com/wiki/)，属于官方公开示例，不是本次替账号持有人完成实名注册的录像。绑定图、实录与 QQ A/B 图来自本次真实候选构建验收。两张手机原图保持原样。新增素材的来源、SHA-256 和隐私处理见[素材清单](/guides/qq/manifest.json)。

延伸阅读：[官方群聊消息接口](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_messages.post.html)、[全量群消息事件](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/group_message_create.html)、[QQ 接入规格 #1149](https://github.com/BotHarness/DeepSeekBot/issues/1149)。
