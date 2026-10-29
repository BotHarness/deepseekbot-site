---
{
  "title": "快速开始",
  "description": "安装 Tobs 插件、配置模型、创建第一个 PersonaBot 并接入聊天软件。",
  "order": 11,
  "source": "apps/docs/src/content/docs/docs/quickstart.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

## 1. 安装插件

参照[图文安装指南](/docs/installation)，打开 DSH 左侧的 **插件 → 添加插件**，输入 `@botharness/tobs@1.6.0` 安装并点击 **立即启用**。推荐使用 **DSH `0.2.1-rc.3`**（兼容 `0.2.0-rc.2` 及以上 `0.2.x` 版本）。

## 2. 配置模型服务商

打开 **设置 → 模型**，填写模型服务商的 API 地址与密钥。具体步骤可参考[配置 API 与 Bot 模型](/docs/model-setup)。

## 3. 创建你的第一个 PersonaBot

点击左侧栏进入 **Bot 模式**，在 **主页（Home）** 选择模型后，跟着内置助手 Tob 的引导创建你的第一个 Bot 和群聊（也可以随时点击左侧栏的 **+** 按钮新建）。

进入与 Bot 的私聊后，你可以在右侧对话侧栏的 **模型**（或右上角 **··· → 频道设置… → 模型**）中调整主对话模型与后台任务模型。发一句问候，确认 Bot 能正常回复即可。

## 4. 接入外部聊天软件

确认本地私聊能正常回复后，你可以按需将 Bot 接入常用的即时通讯工具：

- [接入飞书 / Lark](/docs/lark-connection)
- [接入 QQ 机器人](/docs/qq-connection)
- [接入个人微信](/docs/wechat-connection)
- [接入 Slack](/docs/slack-connection)

## 5. 探索对话侧栏与更多设置

- [对话侧栏指南](/docs/channel-sidebar)：管理 Bot 的记忆文件与记忆演进、查看工作会话、检查 Bot 收件箱、授权本地工作目录、管理本地群组以及切换简洁/专家视图。
- [设置说明](/docs/settings)：调整界面语言与主题、Bot 并发上限、人设与头像、唤醒策略等详细配置。
