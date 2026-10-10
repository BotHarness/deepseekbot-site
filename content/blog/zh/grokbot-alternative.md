---
{
  "title": "GrokBot 的开源平替：DeepSeekBot 对比与迁移指南",
  "description": "想给 GrokBot 找开源平替？先看四条硬指标：身份、记忆、协作、自托管，再逐项对照 DeepSeekBot 的 Git 记忆与 MIT 许可，附四步迁移路径。",
  "date": "2026-10-10",
  "tags": ["对比", "指南"]
}
---

搜 "grokbot alternative" 的人通常已经用过 Grok Bot：一群常驻的 AI 同事，各有名字和分工，跑在服务方的云端电脑上，随时在线。它确实好用，但有个前提——那不是你的机器，也不是你能审计的代码。这篇文章只回答一个问题：要一个开源、自托管的平替，该按什么标准挑；DeepSeekBot 哪几条对得上，哪条对不上。

## 先说结论

- Grok Bot 是托管服务；DeepSeekBot 是装在自己机器上的开源软件（MIT 许可）。
- 四条硬指标里最容易被忽略的是**记忆归谁**：DeepSeekBot 的记忆就是一个普通 Git 工作树，能 diff、能分支、能推走。
- 迁移只有四步，不用重写任何东西；但如果你的目标是"今天就搬到 Telegram"，DeepSeekBot 还没接，先别动。

## 为什么会找 GrokBot 平替

- **数据位置**：Bot 的文件、对话与累积的上下文都在服务方那一侧。
- **不可审计**：看不到源码，也没法把整套东西搬到自己的服务器上。
- **模型绑定**：用哪家的模型由服务方决定，你换不了。
- **计费与套餐**：团队与企业能力按套餐提供，边界由服务方划。

（Grok Bot 的具体能力与价格以 x.ai 官方页面为准，这里只做结构性对比。）

## 挑平替的四条硬指标

1. **身份与人格**：Bot 是不是长期存在的"同事"——有自己的名字、性格和判断方式？
2. **记忆的形态**：记忆存在哪、由谁保管、你能不能自己打开看？
3. **多人协作**：多个 Bot 能不能保留各自身份一起干活，能不能只叫醒该醒的那个？
4. **自托管与模型自由**：能不能跑在自己的机器上，接自己想用的模型？

## DeepSeekBot 逐条对照

- **身份**：每个 PersonaBot 有自己的名字和头像。[SOUL.md 与核心记忆](/docs/soul-and-core-memory/) 里，SOUL.md 保存人格、表达方式与工作原则，MEMORY.md 保存核心记忆，跨对话和文件夹延续。
- **记忆**：记忆是一个普通 Git 工作树。在侧栏浏览[记忆文件](/docs/channel-sidebar/memory-files/)、分支、commit 与 diff，也能推到自己的 GitHub，在多台机器之间共享同一份记忆。
- **协作**：把不同的 Bot 带进 [Group](/docs/channel-sidebar/groups/)，消息保留各自身份，@ 谁就叫醒谁；每个成员可以选择每条提醒、摘要、仅提及或静默。
- **自托管与模型自由**：DeepSeekBot 是一个 npm 包，装进 DeepSeek Harness（DSH）桌面端；你在 DSH 里接入的任何模型 provider，Bot 都能用。MIT 许可，源码在 GitHub。
- **另外两条**：跨文件夹工作（授权文件夹后，同一个 Bot 在多个文件夹里各有独立会话和进展）；定时任务（按计划执行，可随时暂停，也能锁定以防 Bot 修改——应用运行时执行）。

## 一张对比表

| | Grok Bot | DeepSeekBot |
| --- | --- | --- |
| 运行位置 | 服务方的云端电脑（托管） | 你自己的机器（自托管） |
| 源码 | 闭源 | MIT 开源，GitHub 可查 |
| 记忆 | 由服务方管理，上下文持续累积 | 普通 Git 工作树，可读、可分支、可推送 |
| 模型 | 服务方提供 | DSH 里接入的任何 provider |
| 协作 | 团队 Bot、在 X 上 @bot | Group 内多 Bot，各自身份与提醒级别 |
| 接入面 | X、官方桌面与移动客户端、Google Workspace 集成 | 微信 / QQ / Lark / Slack / Discord |
| 计费 | 套餐制（含团队与企业） | 软件开源免费，模型与机器成本自付 |

## 四步迁移路径

1. 还没装 DeepSeek Harness？先下载 DSH 桌面端。
2. 打开 DSH，点左侧「插件」→「添加插件」，输入 `deepseekbot`，安装后点「立即启用」。
3. 侧栏出现「Bot 模式」，创建你的第一个 PersonaBot，写下它的 SOUL.md 和 MEMORY.md。
4. 接 IM：飞书 / Lark、Slack、Discord 或个人微信（微信仅接收扫码者私聊）。接入流程在最新源码里：设置连接应用 → 在私聊侧栏「外部身份」绑定 → 发消息测试。

细节见[文档总览](/docs/overview/)与[安装](/docs/installation/)。

## 什么时候别换

- 你的 Bot 必须住在 X 上（@bot），或者你依赖官方移动端与 Google Workspace 集成——这些是 Grok Bot 的原生能力，DeepSeekBot 没有对应物。
- 你要的就是 Telegram——DeepSeekBot 还没接。
- 你不想自己维护一台常开的机器：自托管意味着机器、更新和模型账单都归你。

## 常见问题

**DeepSeekBot 免费吗？** 软件开源、MIT 许可，不收费；模型 API 与机器成本由你自己承担。

**能接自己的模型吗？** 能。DSH 里接入的任何 provider，Bot 都能用。

**记忆存在哪？** 存在你的机器上，就是一个 Git 仓库，随时能 diff 和回滚。

**多人一起用行吗？** 行。Group 里每个 Bot 保留自己的身份，成员各自设提醒级别。

想试就从 DSH 的「插件 → 添加插件」开始，输入 `deepseekbot`，装好后从[文档总览](/docs/overview/)往下走。
