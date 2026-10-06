---
{ "title": "隐私说明", "description": "DeepSeekBot 官网和插件收集哪些匿名统计、为什么收集、怎么关闭。" }
---

我们收集匿名统计只有一个目的：**改善 DeepSeekBot，了解它被怎样使用、官网从哪里被访问**。我们不收集能识别你本人的信息，也不收集你的对话或 Memory 内容。做这件事的代码全部开源：[官网](https://github.com/BotHarness/deepseekbot-site)、[插件](https://github.com/BotHarness/BotHarness)，设计记录在 [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md)。

统计数据存放在 [PostHog](https://posthog.com) 的美国区域，经由我们自己的域名 `t.botharness.ai` 转发。PostHog 只用 IP 地址推断国家或地区，然后丢弃，不会存储。

## 官网

第一次访问时右下角会询问你：

- **同意**：在本机保存一个随机的匿名 ID，这样你隔几天再来时，我们能知道你最初是从哪个帖子或视频来的。
- **拒绝**或不作选择：不在你的设备上保存任何标识（拒绝时只记住「已拒绝」这个选择），访问仍会以无 Cookie 的方式匿名计数（由服务器按天计算的不可逆哈希）。

我们记录的内容：访问了哪个页面、来源（`utm_*` 参数和 `?ref=`），以及少数核心按钮的点击，例如复制安装命令、点击 GitHub 或 Discord、播放宣传片、在 Bot 市场打开详情。我们不记录你输入的文字，不录制会话，不使用广告追踪。

想改变选择，可以清除本站的 Cookie 和本地存储，下次访问会重新询问。

## 插件

插件的遥测默认开启，第一次启动时会提示一次。它只由插件的 Host 发送，只带一个首次启动时随机生成的安装 ID，不与官网访客关联。

会发送：插件和 DSH 版本、操作系统和架构；创建、归档、删除 Bot，从市场安装 Bot，启用连接器（只记类型，例如「飞书」），编辑头像这类事件；每天一次的汇总数量（Bot 数、会话数、消息数）；以及插件错误的类型和去掉了个人路径的堆栈。

**从不发送**：Bot 名称、人格或 Memory 内容、对话文字、仓库地址、连接器凭据、文件路径、IP 地址。

关闭方法，任选其一：

- 在插件配置里设置 `telemetry: false`
- 设置环境变量 `DO_NOT_TRACK=1`
- 设置环境变量 `BOTHARNESS_TELEMETRY=0`

## 联系

有疑问可以在 [GitHub Issues](https://github.com/BotHarness/BotHarness/issues) 提出。
