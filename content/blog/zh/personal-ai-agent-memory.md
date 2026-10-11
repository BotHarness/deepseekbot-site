---
{
  "title": "个人 AI 智能体：长期记忆与 Bot 团队",
  "description": "用可检查的 Git 文件记忆延续项目背景，让有独立身份的个人 Bot 分工协作，再通过兼容的 DeepSeek Harness 开源插件扩展能力。",
  "date": "2026-10-12",
  "tags": ["个人智能体", "长期记忆"]
}
---

下周再打开一个项目时，你希望 AI 助手知道：上次在研究什么、哪些来源可信、还有哪些问题没确认。有长期记忆的个人 AI 智能体，可以把这些背景保存在文件里，让你检查和修正，而不必每次从聊天记录里重新整理。

DeepSeekBot 是 MIT 开源的 GrokBot 平替，作为插件安装到 DeepSeek Harness（DSH）。你可以创建有各自身份和 Git 文件记忆的个人 Bot，分别私聊，也可以把几个 Bot 带进 Group，组成自己的个人 Bot 团队（personal bot team）。

先让一个 Bot 做好一件需要持续跟进的小事，有明确分工后再增加成员。下面用“整理项目阅读笔记”说明怎么开始。这是供你尝试的流程示例，不是已经执行成功的任务记录，也不代表一个团队能自主完成所有步骤。

## 给个人 Agent 一个值得记住的任务

假设你正在为自己的项目选工具。这周读了三篇介绍，下周想看看有没有变化。负责研究的 Bot 应当留下你的问题、约束和来源，把临时判断与已经确认的决定分开。

[安装 DeepSeekBot](/docs/installation/) 后，打开 Bot 模式，创建一个 PersonaBot。给它起个名字，再指定一个小范围职责：“帮我维护这个项目的阅读笔记，每个重要判断都要能找到来源。”你可以直接提供材料，不必先连接外部账号，也不用给它整个文件系统的访问权。

<figure class="evidence-figure" id="bot-conversations">
<div class="evidence-heading"><span class="evidence-kicker">BOT 模式 · 01</span><strong>和每个 Bot 保持独立对话</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文 Bot 模式：左侧分别列出 Mira、Nova、Theo、Juniper、Kai 的对话，中间打开 Mira 的私聊；示例对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选一个 Bot</strong><span>左侧每个名字对应独立的对话入口。</span></div><div><b>02</b><strong>单独聊这件事</strong><span>中间展示当前 Bot 的私聊。</span></div><div><b>03</b><strong>查看它的记忆</strong><span>右侧记忆面板属于这个 Bot。</span></div></div>
<figcaption>实际 Bot 模式界面，使用示例对话展示。点击截图可放大。</figcaption>
</figure>

DeepSeekBot 把身份与记忆分开：`SOUL.md` 描述 Bot 是谁、如何工作；`MEMORY.md` 保存关键事实和详细笔记的索引，细节放在其他文件中。在 Soul 里写“做事谨慎”能表达角色要求，但不能代替真正的权限限制。

这个例子可以在 Bot 的记忆里采用这样的组织方式：

```text
SOUL.md             研究角色与工作偏好
MEMORY.md           当前问题与已确认约束
reading-notes.md    来源链接、带日期的观察、待确认问题
```

这是建议的文件结构，本文没有替你创建这些文件。不要把密码、私钥或无关的个人信息写进笔记。

## 让长期记忆变得可检查

持久记忆（persistent memory）意味着保存的信息可以跨对话保留。它不意味着每条消息都被正确记住、每份旧材料都会进入下一次模型调用，也不保证 Bot 总能想起正确的事实。

Soul 与 Core Memory 以有长度限制的快照进入 Session，详细文件按需读取。修改文件不会自动改写当前 Session 的这份快照。把核心记忆写短，用它指向详细笔记，再在新的 Session 里验证回忆，不要假定整个记忆仓库始终都在上下文中。

DeepSeekBot 的 Git Memory 侧栏可以查看文件、提交和 diff。让 Bot 保存一项决定后，检查实际改动：如果它把推测记成了事实，就修正文件，不要只寄希望于下一条聊天消息。Git 历史让修改有迹可查，内容是否正确仍需要你判断。

可以用你有权分享的材料试试这个请求：

```text
只使用我下面提供的三段来源材料。
为我的项目起草阅读笔记，每个重要判断附上来源。
把观察、我已确认的约束、尚未解决的问题分开。
先展示准备写入记忆的内容，等我确认后再保存。
不要对外发布，不要连接外部账号。
```

“等我确认”是给模型的行为要求，不是可靠的审批闸门。实际工具权限和宿主访问范围也要收窄；如果 Bot 在确认前已经写入，应停下来检查。我们已有的[三来源简报实践](/blog/first-agent-briefing/)展示了为什么来源和产出仍然需要人工审阅。

下次对话时，让 Bot 复述项目问题，并指出依据的笔记。检查来源和约束有没有过时。文件留存与成功回忆是两项不同的验收。具体文件操作可以看[记忆文件](/docs/channel-sidebar/memory-files/)和[记忆演化](/docs/channel-sidebar/memory-evolution/)指南。

## 有了明确分工，再组建个人 Bot 团队

当你确实需要另一项职责时，增加第二个 Bot 才有意义。沿用阅读笔记这个例子，可以这样分工：

- 研究 Bot：从你提供的材料中整理带来源的观察。
- 审阅 Bot：质疑缺少依据的判断，指出可能过时的信息。
- 协调 Bot：把审阅后的笔记整理成供你确认的草稿。

每个 PersonaBot 保留自己的身份和记忆。把相关成员邀请到 Group，@ 需要回应的 Bot；明确分享问题和已经批准使用的材料，不要假定一个 Bot 自动知道另一个 Bot 保存的全部内容。

<figure class="evidence-figure" id="bot-group">
<div class="evidence-heading"><span class="evidence-kicker">BOT 群组 · 02</span><strong>把几个 Bot 带进同一个对话</strong></div>
<a href="/blog-figures/personal-agent-memory/group-zh.jpg"><img src="/blog-figures/personal-agent-memory/group-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文 Bot 模式打开天文台工作室 Group：Mira、Theo、Nova 分别以自己的名称和头像回复，右侧显示群组成员；示例对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>进入群组</strong><span>Group 和各 Bot 的私聊一起列在左侧。</span></div><div><b>02</b><strong>看清各自回复</strong><span>Mira、Theo、Nova 保留自己的名称与头像。</span></div><div><b>03</b><strong>查看参与成员</strong><span>右侧列出 Human 和参与的 Bot。</span></div></div>
<details class="evidence-detail"><summary>放大查看群组回复</summary><div class="evidence-zoom" role="region" aria-label="放大的示例群组对话" tabindex="0"><svg viewBox="560 170 1680 920" role="img" aria-label="Mira、Theo、Nova 在同一 Group 中分别回复"><image href="/blog-figures/personal-agent-memory/group-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>三个 Bot 在同一 Group 中回复，图中为示例对话，不是本文阅读笔记任务的执行结果。</figcaption>
</figure>

Group 与 Assignment 是两种不同的安排。Group 让有独立身份的 Bot 在共享对话中协作；Assignment 用单独的 Session 和报告承接独立委派任务，需要授予 Workspace。加入群组不等于获得任意目录的访问权。

第一次可以只让审阅 Bot 检查一个段落，再由你阅读它的回复。不要同时放开对外发布、凭据修改或更大的文件访问范围。增加成员会带来协调和模型调用开销，不保证答案更好，更不等于无限自治。[能力指南](/docs/capabilities/)区分了发布包与可选组件。

## 用 DeepSeek Harness 插件补上真正需要的能力

DeepSeekBot 运行在 DSH Profile 中，可以与兼容的其他 DSH 插件一起安装。这个开源插件生态让你按实际任务扩展个人 Agent 的能力，而不必把起始工具当成固定上限。

如果直接提供阅读材料已经够用，就从这里开始。需要连接器或其他工具时，先检查插件版本、所需凭据、暴露的操作和宿主访问范围，只启用当前任务需要的部分，再用一个小范围只读请求验证。部分插件可能尚不兼容；装在同一个 Profile 里不代表任意组合都能无缝工作。

本次核验的 npm 发布包 DeepSeekBot 1.2.0 **不包含**可选的 Computer、Browser Bundle，这个阅读笔记示例也不需要它们。自托管意味着你要维护宿主与配置，模型/API 调用另有费用；MIT 开源不代表这些服务免费，持续后台工作也依赖宿主保持可用。

## 在依赖这个团队之前，检查四件事

1. 能否找到已保存的项目问题，并修正一条错误记忆？
2. 换一次对话后，Bot 能否依据正确笔记回答，而不是编造来源？
3. Group 回复是否保留预期分工，你能否看清每个 Bot 的贡献？
4. 工具权限和 Workspace 授权是否只覆盖这件事，对外操作是否仍由你审批？

前两项没通过，就先修好单 Bot 的流程，不急着扩大团队。如果你还在选产品，可以阅读已有的[个人 AI 智能体比较](/blog/personal-ai-agents-comparison/)；本文解释的是记忆与协作的入门方式，不是产品性能测评。

<details>
<summary>产品来源与版本范围</summary>

2026 年 10 月 12 日核验了 [DeepSeekBot 1.2.0 发布包 README](https://unpkg.com/deepseekbot@1.2.0/README.md)、[发布包配置](https://unpkg.com/deepseekbot@1.2.0/cordis.im.patch.yml)和[发布时的记忆指南](https://github.com/BotHarness/DeepSeekBot/blob/271e056aecd7f10bd71128a78d2ac9acbea898ea/docs/soul-and-core-memory.md)，其中说明了独立身份、Git Memory、Group、需要 Workspace 授权的 Assignment 及插件兼容性限制。另见 [DeepSeekBot 仓库](https://github.com/BotHarness/DeepSeekBot)与 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。文中的提示词和笔记组织方式是建议示例，不是执行记录。

</details>
