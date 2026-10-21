---
{ "title": "隐私说明", "description": "DeepSeekBot 官网、插件和手机应用收集哪些数据、为什么收集、怎么关闭。" }
---

我们收集匿名统计只有一个目的：**改善 DeepSeekBot，了解它被怎样使用、官网从哪里被访问**。我们不收集能识别你本人的信息，也不收集你的对话或 Memory 内容。做这件事的代码全部开源：[官网](https://github.com/BotHarness/deepseekbot-site)、[插件](https://github.com/BotHarness/BotHarness)，插件的设计记录在 [ADR-0132](https://github.com/BotHarness/BotHarness/blob/main/docs/adr/0132-anonymous-posthog-telemetry-and-campaign-short-links.md)。

官网和插件的统计数据存放在 [PostHog](https://posthog.com) 的美国区域，经由我们自己的域名 `t.botharness.ai` 转发。PostHog 只用 IP 地址推断国家或地区，然后丢弃，不会存储。

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

## 手机应用

iPhone 和 Android 上的 DeepSeekBot 应用是**你自己电脑**的遥控器。它只连接你配对的那台电脑：通过你的 [Tailscale](https://tailscale.com) 网络（`*.ts.net` 或 `100.x` 地址，始终 HTTPS），或者在你选择时通过 DeepSeekBot Connect（见下文）。你的 Bot、Memory 和对话都留在那台电脑上。

**保存在手机上的**

- 每台已配对电脑的配对凭证，只保存在 iOS 钥匙串或 Android Keystore 加密的安全存储里，只在手机解锁时可读，也无法恢复到其他设备上。
- 最近对话和未发送草稿的缓存，用来让应用打开更快，保存在应用自己的存储里。

要移除一台电脑和它的凭证，在应用里打开这台电脑，选择**取消配对**。也可以在电脑的设置里撤销这台手机。

**DeepSeekBot 账号和 DeepSeekBot Connect（可选）**

不登录账号也能配对。DeepSeekBot Connect 让手机不用 Tailscale 也能连上你的电脑；使用它时，你要在电脑和手机上登录 DeepSeekBot 账号，可以用 Google、Apple 或发到邮箱的验证码。

- 我们的登录服务商 [WorkOS](https://workos.com/legal/privacy) 保存账号：你的邮箱、Google 或 Apple 账号提供的名字，以及一个用户 ID。
- 我们的中继 `connect.botharness.ai` 保存你的用户 ID，以及你关联的电脑名称（最多 5 台）和它们的 DeepSeekBot Connect 地址（`<id>.deepseekbot.dev`）。
- 手机和电脑之间的通信通过 HTTPS 经 [Cloudflare Tunnel](https://www.cloudflare.com/privacypolicy/) 传输，只开放手机用的接口。我们的中继不会收到你的消息、照片或文件。

要删除账号，在应用里打开**配对电脑**，登录后选择**删除账号**。这会删除 WorkOS 上的账号，解除所有电脑的关联，并删除它们的隧道和地址。在某台电脑上退出登录只会解除这一台电脑的关联。

**只发给你的电脑的**

你输入的消息、附带的照片和文件、语音听写得到的文字，只发送到已配对的电脑，我们收不到。

**权限，只在你操作时使用**

- **相机**：扫描电脑上的配对码，或拍一张你要发送的照片。
- **照片**：选择你要发送的照片。
- **麦克风和语音识别**：只在你点按听写按钮后、停止之前使用。由手机系统自带的语音服务（Apple 或 Google）把语音转成文字，适用该服务商自己的隐私政策；文字发送前你可以看到并修改。不录音，也不会把音频发给你的电脑或我们。
- **通知**：可选。允许后，手机只把推送令牌交给已配对的电脑。Bot 需要你时，电脑经由 [Expo 推送服务](https://docs.expo.dev/push-notifications/faq/) 把一条简短通知（Bot 或频道名称和一小段预览）交给 Apple（APNs）或 Google（FCM），再送达你的手机。Expo 会保留推送令牌以便之后送达通知，但不会在送达所需之外保留通知内容。随时可以在应用或系统设置里关闭通知。

**统计**

目前 App Store 和 Google Play 上的版本**不发送**任何统计。如果以后的版本开启手机统计，新安装会默认开启。首次启动会显示一条说明，这条说明只是告知，统计不会等你关闭说明才开始。你随时可以用设置页最底部的开关关闭统计。开启后，手机向 PostHog 发送随机手机统计标识、应用版本和构建号、iOS 或 Android、应用语言，以及打开应用、配对、连接和首次聊天的粗略结果。从不发送名称、聊天、Memory、文件、配对链接、凭证、推送令牌或任何能识别你电脑的信息。这个标识不与官网访问或电脑关联，也不建立个人档案。事件经 `t.botharness.ai` 发往 PostHog 美国区域，关闭 GeoIP，丢弃 IP 地址。关闭统计会删除标识和未发送事件；再次开启会生成新标识。手机统计独立于电脑上插件的遥测。详见[手机统计说明](https://github.com/BotHarness/DeepSeekBot/blob/main/docs/mobile-statistics.md)。

我们不出售数据，不使用广告标识，也不跨应用或网站追踪你。

## 联系

有疑问可以在 [GitHub Issues](https://github.com/BotHarness/BotHarness/issues) 提出。
