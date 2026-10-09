# QQ 群聊权限配置

本页说明**手机 QQ 中的群机器人权限**。DeepSeekBot 的 QQ 接入仍在分片交付；开启平台开关不代表已安装版本具备全部 QQ 功能。版本与交付状态见[接入与可选能力](/docs/capabilities)和[QQ 接入规格 #1149](https://github.com/BotHarness/DeepSeekBot/issues/1149)。

## 先准备好机器人

使用官方 QQ Bot 应用，把机器人加入需要使用的群，并在 DeepSeekBot 中连接、绑定到目标 Bot。绑定步骤见[外部身份](/docs/channel-sidebar/external-identities)。以下权限需要在 **手机 QQ** 中为该群里的机器人设置；找不到入口时，请让群主或有相应管理权限的管理员操作。

## 1. 从机器人资料页进入设置

在手机 QQ 打开目标群，打开群内机器人的资料页，点击**右上角齿轮**。下图的红色箭头标出入口。

<figure>
<img src="/guides/qq/01-mobile-bot-profile-settings.png" alt="手机 QQ 机器人资料页，红色箭头指向右上角的设置齿轮" width="360" loading="lazy" decoding="async">
<figcaption>图 1：先进入群内机器人的资料页，再打开右上角设置。</figcaption>
</figure>

## 2. 选择消息接收范围

设置页顶部的第一项是**机器人可获取的群聊消息范围**，点击后按需要选择接收范围。

图 2 当前显示**获取群内全部消息**。这允许 QQ 向该应用推送普通群消息；如果只需要在 @ 机器人时回复，不必为了主动发言而开启全部消息接收。DeepSeekBot 是否观察普通消息或自主参与，仍取决于已安装版本和本地会话策略。

## 3. 开启主动群发言

在同一页，打开第二项 **机器人主动在群聊内发言**。图 2 中该开关为蓝色，表示已经开启；说明文字为“机器人可主动发消息，如定时任务…”。

<figure>
<img src="/guides/qq/02-mobile-group-permissions.jpg" alt="手机 QQ 设置页，顶部显示获取群内全部消息，机器人主动在群聊内发言开关已开启" width="360" loading="lazy" decoding="async">
<figcaption>图 2：顶部两项分别控制群消息接收范围和机器人主动发言。</figcaption>
</figure>

**消息接收范围与主动发言是两项独立设置。** 不要仅凭其他页面的“接收机器人推送”已开启就判断配置完成，应核对这里的“机器人主动在群聊内发言”。

## 4. 核对设置与收发

- 每个机器人、每个群分别确认设置；两个 Bot 在同一个群时，要分别打开各自资料页。
- 在原群真正选择 @ 该机器人并发一条新消息，核对答复来自正确的机器人。
- 需要主动发送时，在 DeepSeekBot 中使用该 Bot 已获授权的目标做一次主动文字测试。平台开关不会替代本地发送授权；收到群内消息后再认定测试通过。
- 若开启全部消息接收后 @ 不再得到回复，检查正在使用的 DeepSeekBot / dsh-im 版本是否支持 QQ 全量消息事件。不要靠反复重发旧任务绕过失败或不确定的发送结果。

截图由本次 QQ 群聊验收提供，记录于 2026-10-09。不同手机 QQ 版本的文案和布局可能稍有变化；图中的 QA 机器人仅作示例，请操作你自己的机器人。

[QQ 官方群聊消息文档](https://bot.q.qq.com/wiki/develop/api-v2/autogen/api/v2_groups_group_openid_messages.post.html) · [群消息全量模式](https://bot.q.qq.com/wiki/develop/api-v2/autogen/event/group_message_create.html)
