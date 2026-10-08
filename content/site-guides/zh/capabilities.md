# 接入与可选能力

**先看版本：** 官网的安装入口提供 npm 正式版 **deepseekbot v1.1.0**（截至 2026-10-08）。它包含 Core、Client 和合格的 IM Provider，不包含可选 Computer / Browser 组件。这里的新版绑定流程与操作目标依据同日的[源码版本 `636a5a6c`](https://github.com/BotHarness/BotHarness/tree/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192)，不代表安装 v1.1.0 就能看到全部新版界面。

[安装正式版](/docs/installation) · [所有使用教程](/docs/overview) · [中英文发布记录](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/CHANGELOG.zh.md)

## 连接自己的 IM 身份

先在本地私聊确认 Bot 能使用模型回复，再连接应用。各平台接入的范围不同：

| 平台 | 当前接入范围 | 连接教程 |
| --- | --- | --- |
| 飞书 / Lark | 应用机器人；已加入的群中提及，按平台及会话策略收件并回到来源会话 | [飞书 / Lark](/docs/lark-connection) |
| Slack | 应用有权限访问的会话；频道提及回到原线程，私聊按私聊路径处理 | [Slack](/docs/slack-connection) |
| Discord | 绑定的 Bot 应用；接收范围受服务器、频道权限及消息内容权限影响，不承诺任意频道可读 | [身份绑定与会话管理](/docs/channel-sidebar/external-identities) · [Discord 接入验证](https://github.com/BotHarness/BotHarness/pull/1125) |
| 个人微信 | 扫码者与微信 Bot 的私聊；不包括微信群、其他联系人或企业微信 | [个人微信](/docs/wechat-connection) |

**QQ Bot 接入尚未交付。** 请关注[接入票 #1149](https://github.com/BotHarness/DeepSeekBot/issues/1149)，不要把底部 QQ 社区群当成已支持的 Bot IM 平台。

## 新版如何绑定应用

以下是当前源码流程，v1.1.0 的布局与接收策略可能不同；较早版本的 Profile 截图仅作为历史记录。查看已安装版本及发布记录，避免按新版说明寻找尚未发布的控件。

1. 到 **设置 → IM bots** 连接平台应用，凭据仅保存在本机。个人微信在这里扫码配对。
2. 打开目标 Bot 的私聊，展开侧栏 **外部身份**，点击 **绑定应用**。
3. 选择已连接应用。一个应用只属于一个 Bot；已绑定其他 Bot 的应用不可重复选择。连接未就绪时先处理连接状态。
4. 确认应用为 **Ready / 就绪**，从平台发送测试消息：飞书、Slack 在合适的测试群或频道提及应用，微信使用扫码者私聊，Discord 使用应用有权读取的测试会话。检查 Bot 收件箱与平台回复。
5. 新会话按 **自动接收** 或 **先询问** 策略处理。先询问时，允许后再发一条新消息；不回补先前消息。可按会话静音、设置规则或屏蔽。

无需把所有群先保存为发送目标，也无需逐群在旧 Profile 中手工授权。绑定仍受平台权限及应用连接状态约束；外部消息不会自动镜像到本地私聊。

[打开外部身份操作教程](/docs/channel-sidebar/external-identities)

## 选择电脑或浏览器目标

这些是**源码中的可选组件**。Computer Access 与 Browser Access 分开启用；默认每个 Session 的首次操作需要批准。日常浏览器还需要用户显式连接并授予相应页面或 Profile 的访问。

| 目标 | 能做什么 | 要求与范围 |
| --- | --- | --- |
| 本机 Computer | 观察与操作本机桌面 | `@botharness/computer`；本机目标目前限 **macOS**，需要系统授予对应权限，不需 Docker |
| 日常浏览器：只读分享 | 读取明确分享的一个文档 | `@botharness/browser` + 源码扩展；Chrome / Edge，只读，**不能点击、输入或导航**；真实验证使用 Chrome |
| 日常 Chrome：当前文档控制 | 观察、点击和输入当前授权文档 | Browser 组件 + 官方 Playwright 扩展；不提供任意导航或受管浏览器完整工具集；导航 / 重载结束当前授权 |
| 日常 Chrome：Profile 控制 | 列出与选择标签页、导航、观察、点击和输入 | Browser 组件 + BotHarness Profile 扩展；需明确授权更大的范围；不等于受管浏览器全部工具，验证使用 Chrome |
| 受管 Bot Browser | 在独立浏览器中导航及执行已支持的网页操作 | Browser 组件；可在本机或 Docker 中运行，使用独立浏览器资料，不默认访问你的日常浏览器 |
| Docker Bot Computer | 操作容器桌面，可实时观看 | Computer 组件 + Docker；与 macOS 本机桌面不同 |

[日常浏览器各模式的连接与权限](/docs/daily-browser) · [目标设置](/docs/settings)

## 安装可选组件

npm `deepseekbot@1.1.0` **不包含** `@botharness/browser` 和 `@botharness/computer`；仅在设置里开启权限无法补装组件。这两个组件当前是源码中的私有包，不能把名字当作公开 npm 安装命令。

从[源码 README 的开发启动步骤](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/README.md#从源码开始使用)开始：安装 Node ≥22 和 pnpm 12.4.2，获取仓库，安装依赖并构建，用开发启动器启动一个全新的隔离 Profile。启动器链接本地 Bundles，包括可选 Computer / Browser；再按 Bot 开启对应 Access、选择目标并按教程连接扩展。配置可用模型后，批准一次受限测试操作。容器目标才需要 Docker。

[本地源码实例与安装细节](https://github.com/BotHarness/BotHarness/blob/636a5a6cf4a366bb0b29e6a59155d46fb3cc2192/docs/client-bridge.md#7-本地开发环路dsh-020-rc1)
