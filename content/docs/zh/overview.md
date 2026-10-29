---
{
  "title": "概览",
  "description": "了解 BotHarness 是什么、解决什么问题，以及它的核心组成。",
  "order": 10,
  "source": "apps/docs/src/content/docs/docs/overview.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

BotHarness 是构建在 **DeepSeek Harness（DSH）之上的插件层**，它为大模型 Agent 赋予了跨会话持续存在的身份：**PersonaBot**。

传统的 Agent 工具大多以单次会话（Session）为单位工作——会话之间最多共享一层“云端记忆”，并没有一个真正拥有独立人设、能够跨多条对话持续跟进工作的 Bot 实体。BotHarness 补齐的正是这一层：

- **PersonaBot**：作为一等公民存在的数字伙伴，拥有独立人设、跨会话记忆、运行状态、频道绑定，并能同时处理多个 Session 的工作
- **文件优先的记忆体系**：基于本地 Markdown 文件（支持 Frontmatter、目录树按需注入、工具读写与 Git 版本管理）
- **自然的分工与委派**：在对话中 `@PersonaBot` 即可交代任务，Bot 会在后台自动推进并向你汇报结果，遇到敏感操作时按权限分级请求审批
- **无需修改 DSH 核心**：以标准 SDK + 插件包形式交付，IM 连接等扩展能力由 `dsh-im` 等底座组件提供

## 两个核心名称

| 名称 | 定位 |
| --- | --- |
| **BotHarness** | 平台层：定义 PersonaBot 实体、记忆体系、状态管理与工作流编排机制 |
| **Tobs（原 DeepSeekBot）** | 首款开箱即用的应用插件：把 PersonaBot 带入 DSH 侧栏（创建 Bot、`@` 委派任务、持续协作），并支持接入飞书 / Lark、QQ、微信、Slack 等外部消息渠道 |

## 从哪里开始

- [基本概念](/docs/concepts)：了解 BOT 模式、频道、分组、收件箱、桥接、会话与 Builder
- [快速开始](/docs/quickstart)：安装公开插件、配置模型并创建你的第一个 Bot
- [对话侧栏](/docs/channel-sidebar)：记忆文件与演进、工作会话、Bot 收件箱、工作目录授权、群组管理与界面显示设置
- [连接与可选工具](/docs/capabilities)：查看支持的 IM 渠道、日常浏览器协同与桌面控制能力
- [更新日志](/changelog)：查看每个版本的新功能与改进
