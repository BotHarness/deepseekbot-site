---
{
  "title": "连接与可选工具",
  "description": "了解支持的外部聊天软件接入方式、日常浏览器协同与桌面控制能力。",
  "order": 11,
  "source": "https://github.com/BotHarness/deepseekbot-site/blob/main/content/site-guides/zh/capabilities.md"
}
---

插件安装完成后，包含核心运行时、界面客户端、浏览器组件（`@botharness/browser`）、桌面组件（`@botharness/computer`）以及配套的 IM 连接服务。你可以根据需要为每个 PersonaBot 绑定外部聊天软件，或按需开启浏览器与桌面操作权限。

[安装指南](/docs/installation) · [全部用户文档](/docs/overview) · [版本更新日志](/changelog)

## 接入外部聊天软件（IM）

在接入外部软件前，建议先在本地与 Bot 私聊发一条消息，确认模型能正常回复。目前支持接入 **QQ、飞书 / Lark、Slack、Discord 和个人微信**，各平台的支持范围如下：

| 平台 | 支持范围与特点 | 接入指南 |
| --- | --- | --- |
| QQ | 支持接入官方 QQ 机器人应用、绑定 PersonaBot、在 QQ 群内 `@` 机器人互动回复，并在重启后自动保持连接与绑定 | [QQ 机器人：从注册到群内回复](/docs/qq-connection) |
| 飞书 / Lark | 企业自建应用机器人；支持私聊与已加入群组中的 `@` 提及回复，也可按需开启群内普通消息接收、话题跟进与管理审批卡片 | [接入飞书 / Lark](/docs/lark-connection) |
| Slack | 支持应用可访问的频道与私聊；频道内 `@` 提及会在原串（Thread）中回复，私聊则直接在私聊窗口回复 | [接入 Slack](/docs/slack-connection) |
| Discord | 绑定 Discord Bot 应用；消息接收受限于服务器、频道与消息内容权限配置 | [身份与会话管理](/docs/channel-sidebar/external-identities) |
| 个人微信 | 扫码绑定后，支持你本人与该微信 Bot 之间的一对一私聊（含文字、文件、图片、语音、视频及引用）；不支持微信群、其他联系人或企业微信 | [接入个人微信](/docs/wechat-connection) |

### 绑定应用的基本流程

1. 打开左下角 **设置 → IM 机器人**，连接对应平台的应用（例如已有 QQ 机器人可选择 **QQ → 手动接入**，个人微信可直接扫码绑定）。所有凭据仅保存在你本机。
2. 进入目标 Bot 的私聊界面，展开右侧栏的 **外部身份（External identities）**，点击 **绑定应用（Bind app）**。
3. 选择刚刚连接好的应用。每个外部应用同一时间只能绑定给一个 Bot。
4. 确认状态显示为 **就绪（Ready）** 后，到对应平台发一条测试消息（在 QQ、飞书或 Slack 测试群里 `@` 机器人，或在微信里给扫码绑定的 Bot 发私聊），检查 Bot 收件箱记录与原平台上的回复。
5. 你可以在绑定项中设置 **新会话（New conversations）** 的准入方式：**自动（Automatic）** 会在收到首条合规消息时自动建立会话；**先询问（Ask first）** 则会先放入待确认列表，等你允许后再开始处理新发来的消息。你还可以针对单个会话单独设置免打扰、接收规则或屏蔽。

[查看外部身份与会话管理详情](/docs/channel-sidebar/external-identities)

## 选择桌面或浏览器执行目标

当前公开安装包已内置 `@botharness/computer` 与 `@botharness/browser` 组件。为了安全起见，每个 Bot 的 **使用电脑（Computer Access）** 与 **使用浏览器（Browser Access）** 默认均为关闭状态，需要你在 Bot 设置中按需单独开启；开启后，每次新会话首次执行操作时也会先请求你的批准。

| 执行目标 | 能力说明 | 环境要求与作用范围 |
| --- | --- | --- |
| 本机电脑（Local Computer） | 观察并操作当前电脑桌面 | 内置 `@botharness/computer`；支持 **macOS、Windows 和 Linux**，需授予系统录屏/辅助功能等对应权限，无需安装 Docker |
| 日常浏览器：只读标签页共享 | 读取你显式分享的单个网页内容 | `@botharness/browser` + 浏览器扩展；支持 Chrome / Edge，仅只读读取页面，**不执行点击、输入或跳转** |
| 日常 Chrome：当前文档控制 | 在已授权的当前页面中观察、点击和输入 | 浏览器组件 + Playwright 官方扩展；仅限当前页面操作，页面发生跳转或刷新后需重新授权 |
| 日常 Chrome：Profile 控制 | 查看/切换标签页、导航、观察、点击与输入 | 浏览器组件 + BotHarness Profile 扩展；需显式授予更宽泛的浏览器控制权限 |
| 托管 Bot 浏览器（Managed Bot Browser） | 在独立隔离的浏览器中打开网页并执行操作 | 浏览器组件；支持本机或 Docker 运行，使用独立的浏览器数据目录，默认不接触你的日常浏览器 |
| Docker Bot 电脑（Docker Bot Computer） | 在隔离的容器桌面中观察与操作 | 桌面组件 + Docker；运行在独立的容器桌面环境中，与宿主机桌面隔离 |

[日常浏览器连接方式与权限说明](/docs/daily-browser) · [执行目标设置指南](/docs/settings)

## 可选独立插件与源码扩展

除了主安装包内置的浏览器与桌面组件外：

- 如果你想使用 **日常浏览器协同** 模式，请参照[日常浏览器指南](/docs/daily-browser)加载对应的浏览器扩展并完成连接。
- 如果你想使用容器隔离目标（如 Docker Bot Computer），请确保本机已安装并启动 Docker。
- 像 [VRM 桌面伴侣（`@botharness/vrm-companion@0.2.0`）](/plugins/vrm-companion/) 这样的可选独立插件，可以通过 `dsh plugin --profile <your-profile> add @botharness/vrm-companion@0.2.0` 单独按需安装。
