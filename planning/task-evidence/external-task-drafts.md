# Task-evidence channel adaptations — Oct 11, 2026

Prepared copy, not published. Complements the [three-layer distribution package](../seo-followup/README.md). Project affiliation and AI assistance remain disclosed. The two new blog URLs are proposed in this branch and must not be presented as live links before publication. Platform rules and submission routes must be checked again before sending; no external account operation is authorized here.

## 1. Developer post — Chinese

**Title:** DeepSeekBot 写测试实测：人工运行九项通过，Bot 沙箱失败

我是 BotHarness 的开发者，正在维护开源 DeepSeekBot。这次分享一个真实失败边界：让 Bot 在可丢弃的演示仓库中，为 parseDuration 函数补测试。

要求很窄：保留原测试，只改测试文件，检查普通输入、0:00/23:59、越界、非字符串与格式错误，再运行 node --test。一个 Assignment 生成了八项新增测试，总计九项；函数实现没改。人工在普通终端运行九项全过，但 Bot 在 Windows 原生沙箱里创建测试子进程失败，报 spawn EPERM。所以我能确认补丁有用，不能说它已经无人值守完成了编码交付。

还有一个容易被漂亮 diff 掩盖的问题：Bot 额外写了权限探针文件，违反了“只改测试文件”的要求。我们保留记录、清理探针，并停止失败的权限修复流程，没有绕过沙箱。完整记录会把执行环境、人工复核和未完成项一起呈现。

DeepSeekBot 是安装到 DSH 的独立社区插件，不是 DeepSeek 官方产品，也不是 FeiZhuLulu 的 ds-bot。此次使用 v1.2.0 发布标签源码与 DSH 0.2.0-rc.1，没有可选 Computer/Browser；不是 npm 包实测认证。适合从小任务开始评估，宿主在线、更新与模型额度仍需自己负责。

如果你也用过 Agent 写测试，最希望交付里强制包含什么：完整测试日志、执行环境、变更清单，还是额外文件检查？欢迎针对这个具体 fixture 讨论。

Repository: https://github.com/BotHarness/DeepSeekBot

AI assisted the draft; the patch and run results above come from recorded execution and manual review. Add the published bilingual task article link only after Human review and deployment.

## 1. Developer post — English

**Title:** DeepSeekBot added eight tests; its Windows sandbox run failed

I maintain DeepSeekBot at BotHarness. We tried a small coding handoff in a disposable repository: add tests for one duration parser without changing its implementation, then run node --test.

One Assignment kept the existing test and added eight, covering normal input, boundaries, overflow, non-strings and malformed formats. All nine passed when I ran them in an ordinary terminal. The Bot's confined Windows run failed with spawn EPERM while creating a child process. That establishes a useful patch, not unattended completion of the editing/testing workflow.

The Bot also created an extra ACL probe despite the test-file-only scope. We retained that evidence, removed the exact probe and stopped the failed repair workflow without bypassing the sandbox. A final clean diff alone would hide the deviation.

This was source at the v1.2.0 release tag, DSH 0.2.0-rc.1, without optional Computer/Browser components; it was not npm-artifact qualification. DeepSeekBot is an independent DSH plugin, separate from FeiZhuLulu's ds-bot and not an official DeepSeek product. Host availability, updates and model quota remain the user's responsibility.

What evidence would you require from an agent-generated test patch before accepting it? I'm particularly interested in the command, full log, execution context and checks for extra files.

Repository: https://github.com/BotHarness/DeepSeekBot

Disclosure: project maintainer; AI-assisted writing, recorded task outcomes and human verification. Supply the public task article only after it is reviewed and deployed. Adapt the post to a community that permits this subject and affiliation rather than duplicating it across accounts.

## 2. Chinese technology editor pitch

**Subject:** 选题建议：开源 AI 助手的第一次任务，怎样判断它真的完成了？

编辑您好，我是 BotHarness 的项目开发者。想提供一个围绕 AI 助手任务验收的实操选题，材料是 DeepSeekBot 的三来源简报与单函数测试交接记录。

可供核对的材料包括三个固定 README 来源、原始简报、来源核对表、生成的测试补丁和完整人工运行日志。简报能交回有来源标记的草稿，但超过篇幅要求；编码补丁在人工终端九项全过，Bot 的 Windows 原生执行仍失败，并出现一个额外文件的范围偏差。报道可以围绕“生成产物、成功执行与人工验收为何必须分开”展开。

我们愿意提供已脱敏的真实界面原图、复现 fixture 与维护者署名。DeepSeekBot 与同名 DS Bot 的维护者和包名会明确区分，不把社区插件写成 DeepSeek 官方产品，也不宣称本次证明优于 Grok Bot 或 Cue。现有稿件由 AI 辅助，运行记录与事实经人工核对。

建议读者收获：装好以后先做一个可检查的小任务，知道该索取哪些证据、何时停止，而不是把“完成”两个字当验收。文章与附件需经双方确认后发送；这封邮件尚未发送。

技术派是否接收当前投稿、是否提供编辑入口尚未独立核验；它在既有研究中是技术社区，不自动当作媒体报道渠道。V2EX 使用上面的开发者经验稿，遵守选定节点规则和项目自荐要求，不能假装第三方测评。

## 3. Zhihu answer draft

**Question angle:** 如何判断 AI 智能体真的完成了工作？

先给它一项你能自己复核的小任务，再把交付拆成三层：产物、执行、验收。

拿我们维护的 DeepSeekBot 做例子。第一项任务是整理三份公开 README：它给出了带来源标记的简报，但要求约 700 字，回复达到 1,672 个字符。内容可用，仍需核对来源与压缩。输入已经由我们挑选并附编辑说明，所以不能据此说它擅长自动找资料。

第二项是给一个函数补测试。Bot 保留一项测试并新增八项，人工终端九项全部通过；Bot 自己在 Windows 沙箱中运行却报 spawn EPERM，还额外写了一个不在任务范围内的探针文件。于是结论只能是“补丁经人工复核可用”，不能变成“自动完成编码任务”。

我会检查四件事：来源是否支持结论、diff 是否符合范围、日志里有没有实际退出码、结果在哪个环境运行。错误和人工补救也属于交付记录。一个任务的通过，不足以证明通用成功率或产品排名。

我是项目开发者，这不是独立第三方测评；文字由 AI 辅助整理。DeepSeekBot 是独立社区 DSH 插件，不是 DeepSeek 官方产品，部署、更新、宿主在线与模型费用需要自行承担。公开复现链接在文章审核上线后补充，不提前填入未发布网址。

## 3. WeChat article opening and structure

**Title:** AI 说“完成了”，我为什么还要看日志？

**Opening:** 最近我们给一个开源 AI 助手做了两项很小的任务。它整理出了带来源的简报，也写出了能通过的测试，但两项都还有需要人补上的地方：一项太长，另一项在自己的执行环境里没有跑通。把这些细节展开，比一句“效率提升”更能说明它适合做什么。

正文沿用两篇官网母稿的事实，用读者的检查顺序组织：

1. 先看产物：三来源简报怎样逐条核对，不把作者机制说明当实测。
2. 再看执行：单函数补丁与九项人工通过；原生执行失败单列。
3. 最后看范围：额外探针、停止修复、人工变更记录，不省略失败。
4. 开始自己的第一项任务：公开输入或可丢弃演示仓库，说明环境和维护/API 成本。

页尾注明维护者身份、AI 辅助写作、来源、实测日期与版本；图注标明 Go 短简报核验，不能移作原始长简报的证据。不使用“100% 成功”“完整数据主权”“比 Grok 更强”标题。不添加关注诱导、虚构用户故事或安装转化数字。
