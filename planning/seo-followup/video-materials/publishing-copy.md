# YouTube／Bilibili 发布栏位备稿

内部草稿。标题不是关键词需求数据，缩略图文案不是任务结果。所有 `{{…}}` 槽未填齐且核对前，整套材料 **不可发布**。本包没有访问或操作频道账号；不承诺入口、外链或投稿表单当前可用。

## A，中文简报视频

**主标题：** 用 DeepSeekBot 整理三份公开资料：提示词、引用核对与人工修正

**短版标题：** AI 简报的第一步：把一句话和来源放在一起核对

**缩略图文案候选：** 三份资料，逐条核对 / 草稿 ≠ 核验

**简介：**

> 第一次尝试个人 AI 助手，可以从一份能检查的简报开始。这里展示三份公开资料的任务约定、实际原始回复，以及对引用和遗漏的人工核对。
>
> 项目关系：本视频由 DeepSeekBot 项目团队制作，使用 AI 协助整理脚本；不是独立第三方跑分。实际任务结果：{{APPROVED_BRIEFING_RESULT_AND_LIMITS}}。剪辑保留的检查范围：{{APPROVED_CHECK_SCOPE}}；{{EDITING_DISCLOSURE}}。
>
> 实际环境：{{VERIFIED_VERSION_MODEL_AND_SOURCE_SCOPE}}。自己运行仍需配置、宿主在线、更新与模型费用；可选组件单独说明，不当作默认安装能力。
>
> 配套中文文章与完整任务记录：{{LIVE_ZH_BRIEFING_ARTICLE_URL}}
> 安装／权限指南：{{VERIFIED_ZH_GUIDE_URLS}}
> 三份来源与使用内容：{{APPROVED_SOURCE_LINKS_AND_DATES}}
>
> 提示：结果是可审阅草稿，不应未经检查替你发给别人。

**置顶评论：**

> 想复现，请先看配套的实际提示词、原始输出和核对范围：{{LIVE_ZH_BRIEFING_ARTICLE_URL}}。如果发现某条主张引用不匹配，请指出对应句子与来源；不要贴自己的账号凭据或私有工作资料。这是项目团队内容，不代表独立测评。

## A，English briefing video

**Main title:** A First DeepSeekBot Task: Three Sources, One Briefing, and a Citation Check

**Short title:** Check the Source Before You Trust an AI Briefing

**Thumbnail options:** Three sources. Check each claim. / A draft isn't a verdict.

**Description:**

> A useful first task for a personal AI assistant is a draft you can inspect. This walkthrough covers the task boundary, the actual response, and a human check of citations and omissions.
>
> Affiliation: produced by the DeepSeekBot project team, with AI-assisted script preparation. This is not an independent benchmark. Actual outcome and limits: {{APPROVED_BRIEFING_RESULT_AND_LIMITS}}. Review scope: {{APPROVED_CHECK_SCOPE}}. {{EDITING_DISCLOSURE}}
>
> Environment: {{VERIFIED_VERSION_MODEL_AND_SOURCE_SCOPE}}. Running your own assistant involves setup, host availability, updates, and model costs. Optional components are identified separately from the installed release.
>
> English companion article and actual task record: {{LIVE_EN_BRIEFING_ARTICLE_URL}}
> Setup and permission guides: {{VERIFIED_EN_GUIDE_URLS}}
> Source links and retrieval dates: {{APPROVED_SOURCE_LINKS_AND_DATES}}
>
> Treat the output as a draft. Review it before sharing or acting on it.

**Pinned comment:**

> The reproducible prompt, original output, and review limits are here: {{LIVE_EN_BRIEFING_ARTICLE_URL}}. If a citation does not support a claim, please identify the sentence and source. Do not post private work material or credentials. This is content from the project team, not an independent review.

## B，中文代码视频

**主标题：** 让 DeepSeekBot 补单测：怎样检查 diff、测试日志和改动范围

**短版标题：** AI 说测试通过？先看 diff 和实际日志

**缩略图文案候选：** 说通过 ≠ 跑过测试 / 改了哪里？查 diff

**简介：**

> 不只问 AI “做完了吗”，也问它交出了什么。这个任务在隔离的公开演示仓库里，为一个函数补测试，再检查实际 diff、命令、退出码和人工修正。
>
> 项目关系：由 DeepSeekBot 项目团队制作，AI 辅助脚本整理，非独立第三方测评。实际结果与检查范围：{{APPROVED_CODING_RESULT_AND_LIMITS}}；{{EDITING_DISCLOSURE}}。不据此给 coding agent 排名，也不声称比 Grok Bot／独立的 Manus Cue 更强。
>
> 实际 DeepSeekBot／DSH／模型与版本来源：{{VERIFIED_VERSION_MODEL_AND_SOURCE_SCOPE}}。fixture、许可与版本：{{PUBLIC_FIXTURE_LICENSE_AND_PIN}}。任务没有授权主分支写入、外部推送或生产代码操作。
>
> 配套中文文章与实际记录：{{LIVE_ZH_CODING_ARTICLE_URL}}
> 公开 diff／测试证据：{{APPROVED_PUBLIC_CODING_EVIDENCE_URLS}}
> 安装／权限指南：{{VERIFIED_ZH_GUIDE_URLS}}
>
> 这不是不用维护的托管服务演示；配置、更新与模型费用也属于使用门槛。

**置顶评论：**

> 检查顺序：改动范围 → 测试逻辑 → 实际命令与日志 → 人工验收。复现入口：{{LIVE_ZH_CODING_ARTICLE_URL}}。请只用允许公开的隔离演示代码；不要分享客户仓库、令牌或私有日志。本次不是跨产品统一跑分。

## B，English coding video

**Main title:** Ask DeepSeekBot for Unit Tests—Then Inspect the Diff and Test Log

**Short title:** “Tests Passed” Needs Evidence

**Thumbnail options:** Show the diff. Show the log. / Passed—or just claimed?

**Description:**

> A coding handoff should contain changes you can inspect. In an isolated public fixture, this task asks for tests for one function, then reviews the actual diff, command, exit code, and any correction.
>
> Affiliation: produced by the DeepSeekBot project team, with AI-assisted script preparation; not an independent review. Actual result and review limits: {{APPROVED_CODING_RESULT_AND_LIMITS}}. {{EDITING_DISCLOSURE}} This does not establish a coding-agent ranking or superiority over Grok Bot or the standalone Manus Cue app.
>
> Actual DeepSeekBot, DSH, model, and release/source scope: {{VERIFIED_VERSION_MODEL_AND_SOURCE_SCOPE}}. Fixture, license, and commit: {{PUBLIC_FIXTURE_LICENSE_AND_PIN}}. The task does not authorize main-branch edits, external pushes, or production code access.
>
> English companion article and actual task record: {{LIVE_EN_CODING_ARTICLE_URL}}
> Approved public diff and test evidence: {{APPROVED_PUBLIC_CODING_EVIDENCE_URLS}}
> Setup and permission guides: {{VERIFIED_EN_GUIDE_URLS}}
>
> Include setup, updates, and model costs when deciding whether self-hosting suits you.

**Pinned comment:**

> Review the allowed files, test logic, actual command and logs, then decide whether to accept the change. Reproduction notes: {{LIVE_EN_CODING_ARTICLE_URL}}. Use an isolated public fixture, not a customer repository. Never post tokens or private logs. This run is not a standardized cross-product benchmark.

## 发布人填写的最后一页

实际作者／账号只在获授权的交接处记录，不将私有账号资料贴进公开 GitHub。发布前锁定：最终语言版本、素材使用权、实际版本与结果、可访问母文、平台当前表单与适用声明、真人审批。标题与简介用同一份事实锁稿，不在上传时追加“最好／最快／省钱多少”等无证据承诺。

发布后的平台 URL、时间、实际可测指标和来源交给 #79；没有发布就没有真实发布 URL。草稿链接、安装点击和观看计数都不能当作有效试用。
