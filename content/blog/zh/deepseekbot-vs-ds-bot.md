---
{
  "title": "DeepSeekBot（DSB）与 DS Bot（ds-bot）有什么区别：两个 DeepSeek Harness 插件怎么选",
  "description": "DeepSeekBot 和 DS Bot 是两个独立的 DeepSeek Harness 插件。对比安装包、Git 记忆、群组协作、任务委派、编码、IM 接入与维护成本，找到适合自己的 DeepSeek Bot。",
  "date": "2026-10-11",
  "tags": ["对比", "选型"]
}
---

**如果你看重可审阅的 Git Memory、独立任务委派和飞书等 IM 身份接入，可以优先考虑 DeepSeekBot；如果你更喜欢由 Chief 主 Bot 帮你组建团队、让群管理员协调成员接力回复，可以先试试 DS Bot。** 两者都能把 DeepSeek Harness（DSH）变成可持续协作的 Bot 团队，也都需要你自备模型额度和在线宿主。选型的关键，是看哪套工作机制更顺应你的日常习惯。

先分清名字：**DeepSeekBot 由 BotHarness 维护，npm 包名为 `deepseekbot`；DS Bot 由 FeiZhuLulu 维护，npm 包名为 `ds-bot`。** 搜索“DeepSeek Bot”时可能会看到其中任意一个，或是其他不相关的聊天机器人。DS Bot 并不是 DeepSeekBot 的简称，两款都是独立的社区开源项目，均非 DeepSeek 官方产品。

本文由 BotHarness 团队撰写，对比基线为 **2026-10-11** 发布的 npm **DeepSeekBot 1.2.0** 与 **DS Bot 0.1.0**。我们主要依据双方的发行说明和公开文档梳理工作机制，并未在同一环境下对两者做跑分对比。截至 2026-10-12，DS Bot 在 npm 上已更新到 0.1.3，仓库地址迁至 [Fei2411/DeepSeek-Bot](https://github.com/Fei2411/DeepSeek-Bot)；下文以 0.1.0 为准，后续改动可查阅其 [CHANGELOG](https://github.com/Fei2411/DeepSeek-Bot/blob/main/CHANGELOG.md)。下文有时会将 DeepSeekBot 简称为 DSB。

## 快速对比：共同底座与不同工作机制

窄屏上可左右滑动表格，或直接阅读下方的场景分析。

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

**多 Bot、长期记忆、定时任务和本地数据并不是某一方的独占能力。** DS Bot 0.1.0 同样具备这些基础特性，并内置了 token 用量视图。[DS Bot 0.1.0 发行说明](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/CHANGELOG.md) 双方的核心差异在于：记忆怎么检查、团队成员由谁调度、任务产出保存在哪里，以及如何连接外部应用。

## 日常工作：持续跟进一份竞品周报

假设你每周都要整理竞品发布、项目进展和待办事项：先让 Bot 收集来源、写出草稿，再由你审阅后决定是否对外发送。

### 记住什么，以及怎么修正

DeepSeekBot 的 Git Memory 适合习惯检查“这一周到底改了什么”的用户：文件、提交记录与 diff 构成了清晰的改动历史，还能通过 GitHub 共享记忆库。当然，可回溯并不代表模型写入的每条内容都准确无误，遇到错误偏好或过时信息时，依然需要你手动审阅修正。[Git Memory 指南](/docs/channel-sidebar/memory-evolution/)

DS Bot 同样保留记忆历史，只是它的审阅和共享机制基于 Markdown 与变更日志，而非 Git 工作树。它会同时维护个人与团队两级记忆：0.1.0 文档中提供了每轮对话后的记忆 review、条目来源与日期标注，以及记录变更前后内容的 `journal.jsonl`；Main Bots 和群管理员可以写入团队记忆。[DS Bot 记忆机制](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#memory)

选型时不妨问问自己：你是希望把记忆当成普通 Git 仓库来管理，还是更习惯在 Bot 面板里直接查看摘要、修订条目并与团队共用一份笔记？无论选哪种，都建议留意一下哪些成员拥有修改共享记忆的权限。

### 分工、提醒和对外发送

在 DeepSeekBot 中，你可以把研究、写作和复核分别交给不同的 PersonaBot，在 Group 里讨论协调，再通过 Assignment 保留各自独立的任务 Session 和结项报告。如果你平时主要在飞书、Slack、Discord 或微信里办公，独立 IM 身份接入会很顺手——不过仍需按平台配置权限与会话范围（例如接入个人微信并不等于默认支持任意群聊）。[接入说明](/docs/capabilities/)

DS Bot 则通过 Main Bot 与群管理员的角色分工来组织团队：定时任务可以把消息发到指定聊天，GitHub connector 可用于跟进 issue 和 PR。其 0.1.0 文档暂未提及与 DeepSeekBot 相同的四平台 IM 身份绑定，具体外部连接方式以各版本说明为准。

无论用哪款工具，周报这类任务都建议先让 Bot 在私聊中交付带来源的草稿。对外发送、修改共享记忆和开启定时任务前，最好先确认接收对象与授权范围，避免把未经核对的初稿直接发出去。

## 编码工作：定位 Bug、修改、测试与补丁

对于编码任务，我们可以用同一条标准来衡量：**明确工作目录和分支，产出可审阅的代码 diff、测试命令与真实运行结果，最后再由人决定是否提交 PR。** 聊天框里的一句“修好了”并不能替代这些交付物。

DeepSeekBot 的 Workspace 与 Assignment 机制适合把一次修复限定在明确的工作目录内，并留存独立的任务报告。需要注意的是，Git Memory 里的 diff 记录的是“Bot 记住了什么”，而代码仓库里的 diff 才是“代码改了什么”，两者应分开检查。

DS Bot 的 Bot 同样运行在 DSH Session 中并调用宿主工具，同时提供了对接仓库、issue 和 PR 的 GitHub connector，因此它完全可以参与日常开发工作，而非只能纯聊天。[DS Bot 架构与工具](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md)

### 浏览网页不等于自动操作电脑

- **DeepSeekBot 1.2.0** 正式 npm 包默认包含 Core、Client 与 IM Provider，不含 Browser/Computer GUI 自动化 Bundle。源码仓库中正在演进的桌面与浏览器组件，并不包含在这个版本的默认安装包里。[npm 1.2.0](https://www.npmjs.com/package/deepseekbot/v/1.2.0)
- **DS Bot 0.1.0** 的 Bot browser 仅在 DSH Desktop 中提供；Bot 可以读取结构化的页面文本，但文档明确说明不支持由 Bot 执行点击、输入、滚动或打开网址。虽然每个 Bot 的浏览器使用独立的存储分区，但这仅隔离浏览器会话，不等同于对系统文件或 Shell 的沙箱隔离。[Bot browser 边界](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/ds-bot/README.md#bot-browser)

如果你的核心需求是让 AI 自动操作电脑桌面或交互式操作浏览器，选型前请务必核对所装版本的具体能力与权限说明。

## 谁更适合哪款？

**优先考虑 DeepSeekBot**：你希望用 Git 审阅和分享 Bot 记忆、需要独立的 Assignment 任务记录，或者希望让 Bot 以独立身份接入现有的飞书/Slack/Discord/微信工作流。相应地，你需要自己维护宿主、模型配置与外部平台账号，并留意正式发布包与源码组件的区别。

**优先考虑 DS Bot**：你偏好由 Chief 带着搭建团队、由群管理员协调成员接力回复，并且需要个人/团队两级记忆和内置的 GitHub 工具入口。它的 0.1 版本尚处早期预览阶段，功能、工具与存储格式仍在快速迭代，文档中也注明了宿主版本兼容要求与单写入者限制。[版本与限制](https://github.com/FeiZhuLulu/DeepSeek-Bot/releases/tag/v0.1.0)

如果你手头的工具已经能顺畅跑通日常任务，大可不必急着迁移。想尝试切换前，不妨拿同一份测试资料让两者各自跑一遍周报整理和一次小代码修复，看看哪边的交互和产出更合你心意。

## 安装与迁移 FAQ

### 搜索 DeepSeek Bot 后，怎样避免装错？

认准仓库组织名与 npm 包名即可。本站介绍的是 **BotHarness/DeepSeekBot → `deepseekbot`**；另一款是 **FeiZhuLulu/DeepSeek-Bot → `ds-bot`**。两者是不同的独立项目，不是同一款插件的新旧版本。[安装 DeepSeekBot](/docs/installation/) · [DS Bot 安装说明](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/v0.1.0/README.md#install)

### 两款都开源，用起来完全免费吗？

两款软件本身均按各自的开源许可证免费提供，但运行它们所需的模型 API 调用、在线宿主和日常维护仍会产生开销。界面上的 token 统计仅供参考，不等同于模型服务商的最终账单；群聊中多名 Bot 轮流发言也会相应增加调用次数。

### 能直接共用 Bot、记忆和浏览器登录态吗？

两个项目的数据格式与目录结构彼此独立，无法直接替换插件来无缝继承旧数据。如果想换用另一款，建议先备份好原有的 DSH Profile，在全新的 Profile 中安装试用，并重新配置权限与凭据。

### 还有哪些个人 AI Agent 可以比较？

如果你还在对比托管式的云端产品（如 Grok Bot、Meta Muse、Manus Cue 或 ChatGPT Dots），可以继续阅读[日常工作与编码的个人 AI Agent 对比](/blog/personal-ai-agents-comparison/)。本文讨论的两款 DSH 插件都运行在你自己的宿主设备上，与开箱即用的云端托管桌面属于不同的使用取向。
