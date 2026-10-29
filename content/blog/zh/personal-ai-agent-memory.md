---
{
  "title": "个人 AI 智能体：长期记忆与 Bot 团队",
  "description": "用可检查的 Git 文件记忆延续项目背景，让有独立身份的个人 Bot 分工协作，再通过兼容的 DeepSeek Harness 开源插件扩展能力。",
  "date": "2026-10-12",
  "tags": ["个人智能体", "长期记忆"]
}
---

下周再打开一个项目时，你肯定希望 AI 助手还记得：上次在研究什么问题、哪些信息来源靠谱、还有哪些疑点没确认。拥有长期记忆的个人 AI 智能体，可以把这些背景沉淀在本地文件里，方便你随时翻看和修正，不用每次都去翻冗长的聊天记录。

DeepSeekBot 是一款 MIT 开源的 GrokBot 平替，以插件形式安装在 DeepSeek Harness（DSH）中。你可以创建拥有独立身份和 Git 文件记忆的个人 Bot（PersonaBot），既能一对一私聊，也能把几个不同分工的 Bot 拉进同一个 Group，组建你自己的个人 Bot 团队（personal bot team）。

最稳妥的起步方式，是先让一个 Bot 把一件需要持续跟进的小事做好，等跑顺了、确实需要角色分工时再增加新成员。下面我们以“维护项目阅读笔记”为例，看看这套工作流怎么搭起来。

## 给个人 Agent 一个值得记住的任务

假设你正在为一个新项目挑选工具。这周你读了三篇技术介绍，下周想继续跟进有没有新变化。一个称职的研究 Bot 应当帮你留存核心问题、已知约束和参考来源，并且把“初步推测”与“你已拍板的决定”明确区分开。

[安装 DeepSeekBot](/docs/installation/) 后，打开 Bot 模式并创建一个 PersonaBot。给它起个名字，定一个聚焦的职责：“帮我维护这个项目的阅读笔记，每条重要判断都要标明来源。”刚开始直接把资料贴给它就行，不必急着挂载外部账号，也不用开放整个文件系统的访问权限。

<figure class="evidence-figure" id="bot-conversations">
<div class="evidence-heading"><span class="evidence-kicker">BOT 模式 · 01</span><strong>和每个 Bot 保持独立对话</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文 Bot 模式：左侧分别列出 Mira、Nova、Theo、Juniper、Kai 的对话，中间打开 Mira 的私聊；示例对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选一个 Bot</strong><span>左侧每个名字对应独立的对话入口。</span></div><div><b>02</b><strong>单独聊这件事</strong><span>中间展示当前 Bot 的私聊。</span></div><div><b>03</b><strong>查看它的记忆</strong><span>右侧记忆面板属于这个 Bot。</span></div></div>
<figcaption>实际 Bot 模式界面，使用示例对话展示。点击截图可放大。</figcaption>
</figure>

DeepSeekBot 把“身份”与“记忆”拆得很清楚：`SOUL.md` 定义 Bot 是谁、按什么原则干活；`MEMORY.md` 保存关键事实和指向详细笔记的索引，具体细节则放在独立文件里。需要注意的是，在 `SOUL.md` 里写一句“做事谨慎”可以帮助塑造语气和习惯，但不能代替真正的工具与目录权限设置。

以阅读笔记为例，你可以让 Bot 按下面这三层结构来打理记忆：

```text
SOUL.md             研究角色与工作偏好
MEMORY.md           当前问题与已确认约束
reading-notes.md    来源链接、带日期的观察、待确认问题
```

记笔记时，切记不要把密码、私钥或与项目无关的敏感信息写进记忆文件里。

## 让长期记忆变得可检查、可修正

所谓持久记忆（persistent memory），是指保存下来的信息能够跨越单次对话留存下来。但这并不意味着聊天里的每句话都会被自动提炼成准确记忆，也不代表整个记忆仓库里的所有旧文件都会在每次调用时一股脑塞进模型上下文。

在运行机制上，`SOUL.md` 与 `MEMORY.md` 会在会话开始时作为有长度限制的快照加载进 Session，而其他详细笔记则由 Bot 按需读取；中途直接修改文件，并不会自动刷新当前活跃会话里的快照。因此，最佳实践是把 `MEMORY.md` 写得简明扼要，用它给详细笔记做索引，并在开启新会话时抽查一下 Bot 能否准确调取旧笔记。

借助 DeepSeekBot 右侧的 Git Memory 面板，你可以随时查看记忆文件、提交历史和每次修改的 diff。让 Bot 记录一项决定后，不妨顺手看一眼实际 diff：如果发现它把未经证实的推测当成事实存了下来，直接动手改掉文件即可，不必在聊天框里反复跟它车轱辘话纠正。Git 历史让每一次改动都有迹可循，而内容的最终把关人依然是你。

你可以拿手头方便分享的资料试试下面这段提示词：

```text
只使用我下面提供的三段来源材料。
为我的项目起草阅读笔记，每个重要判断附上来源。
把观察、我已确认的约束、尚未解决的问题分开。
先展示准备写入记忆的内容，等我确认后再保存。
不要对外发布，不要连接外部账号。
```

提示词里的“等我确认后再保存”是对模型的流程引导，同时别忘了在设置里把实际的宿主机与工具权限控制在最小范围。我们在[三来源简报实践](/blog/first-agent-briefing/)中也分享过，为什么让来源紧跟结论、并在最后做一次人工复核能省下不少返工时间。

到了下周开启新对话时，可以先让 Bot 复述一遍当前跟进的核心问题，并说明它引用了哪份笔记，顺带检查一下上周记录的约束条件有没有过时。具体的文件查看与回滚操作，可以参考[记忆文件](/docs/channel-sidebar/memory-files/)和[记忆演化](/docs/channel-sidebar/memory-evolution/)指南。

## 有了明确分工，再组建个人 Bot 团队

当你发现一件事拆成不同视角会更清楚时，引入第二个、第三个 Bot 才真正水到渠成。沿用阅读笔记的例子，一个三人小团队可以这样配合：

- **研究 Bot**：从你提供的材料中提炼带出处的观察。
- **审阅 Bot**：专门挑刺，指出缺乏依据的推论或可能过时的信息。
- **协调 Bot**：把审阅通过的笔记汇总成结构清晰的终稿，交给你拍板。

每个 PersonaBot 都保有自己独立的身份和记忆库。把它们拉进同一个 Group 后，想让谁发言就 `@` 谁；同时把背景问题和参考材料明确发在群里，因为不同 Bot 的私有记忆默认并不互通。

<figure class="evidence-figure" id="bot-group">
<div class="evidence-heading"><span class="evidence-kicker">BOT 群组 · 02</span><strong>把几个 Bot 带进同一个对话</strong></div>
<a href="/blog-figures/personal-agent-memory/group-zh.jpg"><img src="/blog-figures/personal-agent-memory/group-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文 Bot 模式打开天文台工作室 Group：Mira、Theo、Nova 分别以自己的名称和头像回复，右侧显示群组成员；示例对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>进入群组</strong><span>Group 和各 Bot 的私聊一起列在左侧。</span></div><div><b>02</b><strong>看清各自回复</strong><span>Mira、Theo、Nova 保留自己的名称与头像。</span></div><div><b>03</b><strong>查看参与成员</strong><span>右侧列出 Human 和参与的 Bot。</span></div></div>
<details class="evidence-detail"><summary>放大查看群组回复</summary><div class="evidence-zoom" role="region" aria-label="放大的示例群组对话" tabindex="0"><svg viewBox="560 170 1680 920" role="img" aria-label="Mira、Theo、Nova 在同一 Group 中分别回复"><image href="/blog-figures/personal-agent-memory/group-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>三个 Bot 在同一 Group 中按各自身份协作回复（界面示例）。</figcaption>
</figure>

在 DeepSeekBot 中，Group 与 Assignment 对应两种不同的协作方式：Group 适合让多个 Bot 在同一个聊天室里讨论接力；Assignment 则用于把一项明确的任务委派给单个 Bot，在已授权的 Workspace 目录里开启独立 Session 并交付结项报告。把 Bot 拉进群聊，并不会自动赋予它访问你本地代码目录的权限。

第一次试跑群组协作时，不妨先让审阅 Bot 检查一小段笔记，看看它的反馈是否在点子上。群里成员变多，自然会增加协调轮次与模型 API 调用量，按需组建、精简分工往往比一股脑拉一大群 Bot 更高效。关于正式发布包与可选扩展组件的区别，可参阅[能力指南](/docs/capabilities/)。

## 用 DeepSeek Harness 插件按需扩展能力

DeepSeekBot 运行在 DSH Profile 中，可以和其他兼容的 DSH 插件并存。借助这个开源插件生态，你可以根据手头的实际任务为 Agent 添置新工具，而不必受限于初始安装时的默认能力。

如果平时手动粘贴阅读材料已经够用，保持最简配置即可。当确实需要接入外部连接器或新工具时，建议先看清插件版本、所需凭据和宿主机访问范围，只开启当前任务用得上的权限，并先拿一个小范围的只读请求做测试。

顺带一提，npm 上的 DeepSeekBot 1.2.0 默认安装包**不包含**可选的 Computer 和 Browser 自动化组件，像本文这样的阅读笔记工作流也完全不需要用到它们。自托管运行意味着由你自己打理宿主机环境与模型 API 额度，后台任务也依赖宿主机保持在线。

## 日常使用前的四项自检清单

把这套工作流投入日常项目前，可以用下面四个小问题快速检验一下：

1. 你能否在右侧面板里轻松找到已保存的项目问题，并顺手修正一条写错的记忆？
2. 开启新对话后，Bot 能否准确引用已保存的笔记，而不是自己编造出处？
3. Group 里的回复是否保持了预期的角色分工，能否一眼看清每个 Bot 的贡献？
4. 工具权限和 Workspace 授权是否刚好覆盖当前任务，对外发送等关键动作是否仍由你亲自把关？

如果前两项还没跑顺，建议先把单 Bot 的记忆读写调教好，再往多 Bot 群组扩展。如果你还在多款同类工具之间做选型对比，欢迎延伸阅读[个人 AI 智能体横向对比](/blog/personal-ai-agents-comparison/)。

<details>
<summary>产品来源与版本范围</summary>

本文基于 2026 年 10 月 12 日核验的 [DeepSeekBot 1.2.0 发布包 README](https://unpkg.com/deepseekbot@1.2.0/README.md)、[发布包配置](https://unpkg.com/deepseekbot@1.2.0/cordis.im.patch.yml)和[发布时的记忆指南](https://github.com/BotHarness/DeepSeekBot/blob/271e056aecd7f10bd71128a78d2ac9acbea898ea/docs/soul-and-core-memory.md)，涵盖独立身份、Git Memory、Group、需要 Workspace 授权的 Assignment 及插件兼容性说明。另见 [DeepSeekBot 仓库](https://github.com/BotHarness/DeepSeekBot)与 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。

</details>
