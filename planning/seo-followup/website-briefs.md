# 官网博客：先交付任务证据，再扩展关键词

2026-10-11。准备稿；没有新增公开页面、修改已观察页面或承诺新文章 URL。延续 [SEO AX 规范](../seo-comparison-series/seo-ax-workflow.md)。本轮对接现有 [#76](https://github.com/BotHarness/deepseekbot-site/issues/76) 与 [#77](https://github.com/BotHarness/deepseekbot-site/issues/77)，不另建近似选题。

## 先做两篇，服务同一条试用路径

| 次序   | 中文题目建议                                                | English title                                                                       | 独立读者问题                                              | 关键词角色                                                        |
| ------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| 1，#76 | DeepSeek 智能体的第一次任务：把三份公开资料整理成可核查简报 | Your first DeepSeek agent task: a checkable briefing from three sources             | 装好以后怎样完成一个有用、能核对来源的小任务？            | `deepseek 智能体` / `deepseek agent` 的具体任务长尾；品牌作为实例 |
| 2，#77 | DeepSeek 智能体团队的编码交接：为一个函数补测试，再审阅补丁 | A coding handoff with DeepSeekBot: add tests to one function, then review the patch | 怎样知道 Bot 交付的代码确实可审阅，而不是只听到“完成了”？ | `deepseek 智能体团队` 的任务长尾；英文以自然任务查询为主          |

这些标题是编辑建议，不代表已验证精确长尾词的搜索量。先核对任务结果，再确定最终标题、slug 和描述。英文不必把生硬中文关键词逐字翻译进去。

品牌辨认、安装、同名比较已有承接页：[官网](https://deepseekbot.app/)、[安装](https://deepseekbot.app/docs/installation/)、[DS Bot 对比](https://deepseekbot.app/blog/deepseekbot-vs-ds-bot/)。不要再创建“DeepSeekBot 是什么”“DeepSeek Bot 介绍”的多篇近似文章。`deepseek 波特` 本次落入哈利·波特相关内容，继续观察，不作为官方别名或新落地页。

## #76：三来源简报母稿

建议摘要：用三份公开资料完成第一次 DeepSeekBot 研究任务，保留原文链接，检查遗漏与事实错误，再决定是否加入定时跟进。

English description: Start with three public sources, inspect the citations and omissions, and decide whether a recurring research task is worth setting up.

读者开头可用：

> 想试一个 DeepSeek 智能体，不必先把邮件、文件和整个工作区都交出去。选三份公开资料，让它整理一页简报，再逐条核对来源。这个任务能帮助你判断：它能否交付你真正需要的结果，以及哪些地方仍需要你改。

English opening:

> Give a new assistant a small job you can check. Start with three public sources and ask for a one-page briefing with links. Review the claims and omissions before deciding whether the task should become recurring work.

建议正文顺序：读者将拿到什么 → 产品/DSH/模型与版本 → 三个实际输入 → 原始提示词 → 原始结果及逐条核验 → 人工修改 → 什么时候值得定时化 → 安装/维护/API 成本及相关指南。

可供实际运行的提示词模板，**不是已执行任务**：

```text
只使用下面三份公开资料，整理一页简报。
资料 A：[真实 URL]
资料 B：[真实 URL]
资料 C：[真实 URL]

输出：三条重要变化，每条附来源；两项未解决问题；可能影响我工作的地方。
把资料事实与自己的推断分开。资料没有说的事不要补成事实。
先给私人草稿。本轮不发送消息、不修改共享记忆、不创建定时任务。
```

English task template:

```text
Use only the three public sources below to prepare a one-page briefing.
A: [actual URL]
B: [actual URL]
C: [actual URL]

Give three important changes with citations, two open questions, and possible implications.
Separate source facts from your own inferences. Keep unsupported claims out.
Return a private draft. Do not send messages, change shared memory, or schedule this task.
```

发布前必须补齐：实际三来源、版本/宿主/模型、原始输出、每条引用是否支持结论、错误/遗漏/人工改动、真正可读的 UI 原图与脱敏图。失败也保留；当前不能填“成功率”“耗时优势”或假装任务已经跑过。

## #77：单函数测试母稿

建议摘要：给一个演示仓库中的函数补测试，查看实际 diff 和测试日志，理解 DeepSeekBot 编码交付的环境、授权与审阅成本。

English description: Use a disposable repository to inspect a test-writing task, its patch and test logs, with clear workspace permissions and human review.

读者开头可用：

> 让 Bot 帮忙改代码，最值得先验证的不是它会不会说“完成”，而是你能否看清它改了什么、测试检查了什么。先在一个公开演示仓库里，为一个函数补测试，任务小，验收也具体。

English opening:

> A useful coding handoff gives you something to review: a patch, a test command, and its actual output. Start with one function in a disposable repository so you can inspect the work without handing over a production project.

提示词模板，**不是已执行任务**：

```text
在授权的演示工作区内，为指定函数补测试。先读现有测试与约定，给出计划。
只修改相关测试文件；若认为实现有 bug，先报告并等待进一步授权。
覆盖普通输入、一个边界和一个错误输入。运行现有测试命令。
交付实际 diff、执行命令、退出码、测试输出与仍未核验的部分。
不推送、不开 PR、不合并、不改主分支。
```

English task template:

```text
In the authorized demonstration workspace, add tests for the selected function.
Read the existing tests and conventions first, then propose a plan.
Change only relevant test files. Report implementation bugs before changing the function.
Cover a normal input, a boundary and an invalid input. Run the existing test command.
Return the actual diff, command, exit code, output and unverified behavior.
Do not push, open a PR, merge, or modify the main branch.
```

建议正文顺序：测试在检查什么 → 固定演示仓库 commit 与分支 → 版本/模型/工作区授权 → 真实提示词与执行 → diff → 测试日志 → 人工纠正 → 能力边界及后续任务。

发布前必须补齐：公开授权的 fixture、代码 pin、函数/测试运行器、实际修改、真实日志、退出码、失败与纠正、清晰原图。正式 npm 1.2.0 不含可选 Computer/Browser；不能把源码选项写成发行包默认能力，也不能凭本任务宣称优于 Grok Bot 或 Cue。

## 分发与观察

开发者阶段先用现有事实介绍与机制稿，收集安装/审阅问题。两篇任务母稿证据通过后，再更新相应外部任务稿；编辑不能提前填入结果。

新稿各自确认 Google 市场、页面、查询与实际发布日期后建立观察窗口。已有品牌页与对比页于 2026-10-11 上线，2026-10-18 / 2026-11-08 是既定复查点，本轮不修改这些目标。平台阅读、站点访问、安装链接点击分别记录；完成安装和完成首任务尚无可用测量时写 `unknown`。
