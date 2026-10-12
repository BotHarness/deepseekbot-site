---
{
  "title": "DeepSeekBot（DSB）与 DS Bot（ds-bot）有什么区别：两个 DeepSeek Harness 插件怎么选",
  "description": "DeepSeekBot 和 DS Bot 是两个独立的 DeepSeek Harness 插件。对比安装包、Git 记忆、群组协作、任务委派、编码、IM 接入与维护成本，找到适合自己的 DeepSeek Bot。",
  "date": "2026-10-11",
  "tags": ["对比", "选型"]
}
---

**想要可审阅的 Git Memory、独立任务委派和飞书等 IM 身份，可以优先考察 DeepSeekBot；喜欢由 Chief 主 Bot 带你创建团队、让群管理员协调成员，可以先试 DS Bot。** 两者都把 DeepSeek Harness（DSH）变成可持续协作的 Bot 团队，都需要自己的模型额度和在线宿主。关键是工作机制是否符合你的习惯。

先认清名字：**DeepSeekBot 由 BotHarness 维护，npm 包是 `deepseekbot`；DS Bot 由 FeiZhuLulu 维护，npm 包是 `ds-bot`。** 搜索“DeepSeek Bot”可能看到其中任意一个，也可能看到其他聊天机器人。DS Bot 不是 DeepSeekBot 的简称，两款都是独立社区产品，不是 DeepSeek 公司官方产品。

本文由 BotHarness 团队撰写，核查日期为 **2026-10-11**，比较基线是正式 npm **DeepSeekBot 1.2.0** 与 **DS Bot 0.1.0**。依据发行元数据和发布文档比较机制，没有在同一环境运行两者，因此不提供成功率、速度或 token 节省的跑分结论。截至 2026-10-12，DS Bot 在 npm 上已更新到 0.1.3，仓库地址改为 [Fei2411/DeepSeek-Bot](https://github.com/Fei2411/DeepSeek-Bot)；下文对它的描述以 0.1.0 为准，新版本请看其 [CHANGELOG](https://github.com/Fei2411/DeepSeek-Bot/blob/main/CHANGELOG.md)。DeepSeekBot 简称 DSB。

## 快速比较：共同底座与不同工作机制

窄屏上可左右滚动表格，或继续阅读下方的场景分析。

<div class="table-wrap comparison-table" role="region" aria-label="DeepSeekBot 与 DS Bot 快速比较" tabindex="0">

| 比较项 | DeepSeekBot 1.2.0 | DS Bot 0.1.0 |
| --- | --- | --- |
| 身份与安装 | BotHarness/DeepSeekBot；`deepseekbot`；MIT | FeiZhuLulu/DeepSeek-Bot；`ds-bot`；Apache-2.0 |
| 运行环境与模型 | 安装到 DSH，自配模型；需要保持宿主运行 | 安装到 DSH，自配模型；发行文档以 DSH 0.2.1-alpha.1 为测试基线 |
| 记忆与审阅 | PersonaBot 的记忆是 Git 工作树，可浏览文件、分支、提交和 diff，也可推送到 GitHub | Bot 个人记忆与共享团队记忆采用 Markdown；提供来源、日期、编辑面板和变更 journal |
| 群协作与任务交付 | Group 中按身份协作、@ 成员；Assignments 保留独立 Session 与报告 | Chief/Main Bot 管理团队；群管理员默认答复并邀请成员接力，成员轮流处理上下文 |
| 应用接入与编码 | 飞书 / Lark、Slack、Discord、微信身份；授权 Workspace 中可使用宿主文件与终端 | 发布文档提供 GitHub connector，支持仓库、issue、PR 工具；Bot 使用 DSH 工具和模型 |
| 权限与浏览器边界 | Workspace 授权及审批设置；正式 npm 包不含 Computer/Browser Bundle | 按 Main Bot、群管理员和成员分配管理权；Desktop Bot browser 仅允许 Bot 读取页面，不能点击或输入 |
| 门槛与成本 | 自己安装 DSH、配置模型和接入账号；模型 API、宿主与维护成本自负 | 自己安装 DSH、配置模型；同样承担模型 API 和宿主成本，群聊多个成员会增加调用 |

</div>

**多 Bot、长期记忆、定时任务和本地数据都不是 DeepSeekBot 的独占能力。** DS Bot 0.1.0 已明确提供这些功能，还提供 token 用量视图。双方的差异应从记忆如何检查、谁调度成员、交付物放在哪里和外部应用如何连接来判断。[DS Bot 0.1.0 发行说明](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/CHANGELOG.md)

## 日常工作：持续跟进一份竞品周报

假设你每周要整理竞品发布、项目进展和待办。先让 Bot 收集来源、写出草稿，再由你审阅后决定是否发送。

### 记住什么，以及怎么修正

DeepSeekBot 的 Git Memory 适合需要检查“这一周改了什么”的人：文件、提交与 diff 提供可审阅的历史，GitHub 可以承接共享记忆。它不是模型永久正确的保证；错误偏好或过时事实仍需要你发现并修正。[Git Memory 指南](/docs/channel-sidebar/memory-evolution/)

DS Bot 同时维护个人与团队记忆。其 0.1.0 文档描述了每轮后的记忆 review、条目来源与日期，以及保存变更前后内容的 `journal.jsonl`；Main Bots 和群管理员可以写团队记忆。**不能把 DS Bot 写成“没有记忆历史”**：它采用的审阅和共享机制与 Git 工作树不同。[DS Bot 记忆机制](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#memory)

选型时分别问：你是否需要把记忆当普通 Git 仓库管理？还是更想在 Bot 面板里查看摘要、修订条目，并让团队共用一份笔记？同时检查哪些成员能改动共享信息。

### 分工、提醒和对外发送

DeepSeekBot 可以把研究、写作和复核分别交给 PersonaBots，在 Group 中协调，再以 Assignment 保留独立任务 Session 和报告。如果你主要在飞书、Slack、Discord 或微信收消息，独立 IM 身份是值得核查的接入方向；平台权限和会话范围仍需配置，个人微信并不等于已支持任意群聊。[接入说明](/docs/capabilities/)

DS Bot 则以 Main Bot 与群管理员的职责帮助组织团队；定时任务把消息发到指定聊天，GitHub connector 可用于跟进 issue 和 PR。其发布文档未核验与 DeepSeekBot 相同的四平台 IM 身份绑定，不据此断言所有外部接入都不可用。

无论用哪个工具，周报先交付带来源的私人草稿。外部发送、共享记忆修改和定时执行都应明确接收对象与授权，避免把草稿直接当成已经审阅的结论。

## 编码工作：定位 Bug、修改、测试与补丁

对编码任务采用同一条验收线：**明确工作目录和分支，产出可审阅 diff、测试命令与真实结果，再决定是否提交 PR。** 聊天里说“修好了”不能替代这些产物。

DeepSeekBot 的 Workspace 与 Assignment 机制便于把一次修复放进明确的工作范围，并保留任务报告。Git Memory 中的 diff 是记忆变化；代码仓库中的 diff 是实现变化，应分别检查。不要把记忆可审阅直接推导成代码质量更高。

DS Bot 的 Bot 运行在 DSH Session 中，使用宿主工具；GitHub connector 提供仓库、issue 和 PR 的工具入口。因此，DS Bot 不是只能聊天、不能参与开发的机器人。但接入 GitHub 不自动证明完整的克隆、构建、测试、提交闭环已经成功，本文没有做这项实测。[DS Bot 架构与工具](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md)

### 浏览网页不等于自动操作电脑

- **DeepSeekBot 1.2.0** 正式 npm 包默认包含 Core、Client 与 IM Provider，不含 Browser/Computer GUI 自动化 Bundle。当前源码的相关能力，以及默认打包变更，不能当成这版正式包的安装即得能力。[npm 1.2.0](https://www.npmjs.com/package/deepseekbot/v/1.2.0)
- **DS Bot 0.1.0** 的 Bot browser 只在 DSH Desktop 提供；Bot 可读取结构化页面文本，文档明确不支持 Bot 点击、输入、滚动或打开地址。各 Bot 的浏览器使用各自存储分区；这不等于系统文件和 Shell 已被全面隔离。[Bot browser 边界](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#bot-browser)

如果电脑/浏览器操作是你的核心任务，先核对具体安装版本、宿主和权限。不要根据产品名称或介绍截图推断完整 GUI 自动化。

## 谁更适合哪款？

**优先考察 DeepSeekBot**：你希望以 Git 审阅和分享 Bot 记忆，需要独立 Assignment 的任务记录，或希望 Bot 以自己的平台身份进入现有 IM 工作流。代价是维护宿主、模型配置与外部账号，并分清正式包和源码组件。

**优先考察 DS Bot**：你偏好 Chief 带着建立团队、由群管理员协调回复，想要个人/团队两级记忆和内置 GitHub 工具入口。其 0.1 仍是早期预览，发布文档说明功能、工具和保存格式可能变化，也记录了宿主兼容和单写入者限制。[版本与限制](https://github.com/FeiZhuLulu/DeepSeek-Bot/releases/tag/v0.1.0)

如果现有工具已经完成你的任务，可以先保持现状。换用前用相同资料和同一验收线比较一份周报、一次代码修复；只读取你愿意提供的测试数据，完成后再决定是否迁移。

## 安装与迁移 FAQ

### 搜索 DeepSeek Bot 后，怎样避免装错？

核对仓库组织与 npm 包名。本站对应 **BotHarness/DeepSeekBot → `deepseekbot`**；对方对应 **FeiZhuLulu/DeepSeek-Bot → `ds-bot`**。两者不是相互升级的不同版本。[安装 DeepSeekBot](/docs/installation/) · [DS Bot 安装说明](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/README.md#install)

### 都开源，是否完全免费？

两款软件的开源许可都允许按许可使用；模型调用、宿主、存储和维护仍可能花钱。token 统计不是费用账单，群聊中的成员参与也会影响调用量。本次没有测得哪款更省钱。

### 能直接共用 Bot、记忆和浏览器登录态吗？

本文没有核验跨项目直接导入或兼容的数据格式。先备份原有 Profile，在新的 DSH Profile 中试用，分别设置权限与凭据；不要直接替换插件并指望旧数据自动转换。

### 还有哪些个人 AI Agent 可以比较？

若你还在考虑托管的 Grok Bot、Meta Muse、Manus Cue 或 ChatGPT Dots，可以继续读[日常工作与编码的个人 AI Agent 对比](/blog/personal-ai-agents-comparison/)。这里的两款 DSH 插件都依赖自己的宿主，不能直接套用托管云电脑的持续在线体验。
