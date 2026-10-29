---
{
  "title": "DeepSeek 智能体的第一次任务：三份资料，一份可核查简报",
  "description": "我们把三份项目介绍交给 DeepSeekBot，拿到带来源的简报草稿，再核对与删减。分享这次尝试和可复用的任务模板。",
  "date": "2026-10-11",
  "tags": [
    "实测",
    "研究任务"
  ]
}
---

给智能体派第一项任务时，我们选了最常见的场景：整理资料。手头正好有三份项目介绍，我们想快速理清它们各自在做什么、彼此是什么关系，以及还有哪些问题需要进一步核实。把这些内容浓缩成一页简报，既容易检验结果，也很贴近日常工作。

DeepSeekBot 很快交回了一份带来源标注的草稿，包含三条核心观察和两个待确认问题。不过拿到草稿只是第一步，我们随后还是回到了原文逐一核对，并动手删掉了略显啰嗦的解释。下面分享这次实测的全过程，以及一套可以直接复用的提示词模板。

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">认识界面 · 01</span><strong>从一段对话开始</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文界面全景：左侧 Bot 与群组，中间私聊，右侧 Git 记忆面板；演示对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选择 Bot 或群组</strong><span>在左侧找到要交谈的 Bot。</span></div><div><b>02</b><strong>在对话里看草稿</strong><span>读完回复后，可以继续追问或请它改写。</span></div><div><b>03</b><strong>继续处理任务</strong><span>右侧集中放着记忆和任务的入口。</span></div></div>
<details class="evidence-detail"><summary>放大右侧 Git 记忆面板</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="放大的演示 Git 记忆面板" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="放大的演示 Git 记忆面板"><image href="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>DeepSeekBot 的对话界面（示例对话）。点击图片可放大。</figcaption>
</figure>

## 先想清楚：这份简报要帮你回答什么

这次的题目源于一个很容易让人犯迷糊的细节：DeepSeekBot 和 DS Bot 名字非常像，其实是不同开发者维护的两个独立项目。在决定试哪个之前，我们想先分清两者的定位，并弄明白它们和底座 DeepSeek Harness 之间的关系。

| 资料 | 我们想了解什么 |
| --- | --- |
| [BotHarness 的 DeepSeekBot](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) | 如何保留记忆、组织协作和交接任务 |
| [FeiZhuLulu 的 DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) | 另一个同名项目如何安排群内协作 |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) | 运行这些插件的基础软件是什么 |

我们提前挑出了三份 README 里的关键段落，附上简单的背景说明，一并交给了 Bot。也就是说，这次任务完全基于我们手头准备好的材料，没有让 Bot 自己去网上大海捞针。平时如果你要整理会议纪要、项目周报或几篇技术文章，也很推荐先像这样收窄材料和问题范围。

## 让它先交一份带来源的草稿

我们对简报的要求很明确：大约 700 字，列出三条观察和两个待确认问题，并且每条重要结论都要标明出处。草稿先直接发在私聊窗口里，方便我们随时追问和修改。

你可以直接把自己的资料套进下面这个模板里：

```text
请根据下面三份资料，整理一页简报：
A：[原文与相关段落]
B：[原文与相关段落]
C：[原文与相关段落]

写出三条观察和两个还需要确认的问题。
每条重要结论注明来源，推测与事实分开写。
只使用我提供的材料，先把草稿发回这段对话。
```

不管是看竞品动态、比对技术方案，还是汇总一周项目进展，这个模板都能直接拿来改用。窍门只有两条：明确告诉它你想搞懂什么，以及要求它让引用来源紧跟结论。

## 草稿有了，最值得做的是回到原文

Bot 给出的第一版回复，把项目身份、协作方式以及成本与数据问题梳理得颇有条理。不过我们没有直接拿它当最终结论，而是顺着它标出的来源编号，回过头核对了几个容易被一笔带过的细节：

首先是项目身份：两款名字相近的产品，安装包分别是 `deepseekbot` 和 `ds-bot`，且都不是 DeepSeek 官方出品。其次，README 里写的协作机制只能说明作者的设计思路，至于实际用起来谁更顺手、谁更省时间，光看文档是得不出结论的。最后，虽然记忆文件保存在本地，但只要调用云端大模型，相关上下文依然会随请求发送出去。

正是这一步核对，让这份草稿真正派上了用场——它帮我们快速搭好了骨架，也标出了哪些地方还得靠实测来验证。[点击查看完整的原始回复](/task-evidence/2026-10-11/briefing-original.txt)。

整个过程中最明显的毛病是字数超标。我们要求写 700 字左右，结果第一版足足回了 1,672 个字符。后来我们换用通过 OpenCode Go 接入的 DeepSeek V4 Flash，要求它严控在 200 字符以内，最终还是收到了 264 个字符（含英文、标点和换行）。看来想拿出一份干净利落的短简报，最后还是少不了人工动手删减。

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">简报草稿 · 02</span><strong>顺着引用，回到原文</strong></div>
<div class="evidence-zoom " role="region" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<p class="evidence-scroll-hint">小屏可左右滑动，读清原文。</p>
<div class="evidence-notes"><div><b>01</b><strong>看看这句话从哪来</strong><span>回复里的来源编号，让我们能回到原文核对。</span></div><div><b>02</b><strong>留下还没答案的问题</strong><span>资料没回答的事，留作后续问题。</span></div></div>
<div class="evidence-subheading">这次短版尝试使用的模型</div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<details class="evidence-detail"><summary>查看完整对话截图</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="同一条已提交 Go 简报回复的完整真实界面截图" loading="lazy" decoding="async"></a></details>
<figcaption>后来尝试缩成 200 字符时，回复仍有 264 字符。<a href="/task-evidence/2026-10-11/briefing-go.txt">查看这次短版回复</a>。</figcaption>
</figure>

## 把它改成能帮你决定下一步的摘要

合并掉重复的解释后，我们最终保留了下面这段人工润色后的版本：

> 先核对维护者和安装包：BotHarness 的 DeepSeekBot（deepseekbot）与 FeiZhuLulu 的 DS Bot（ds-bot）是两个独立项目，均非 DeepSeek 官方产品。前者的介绍侧重记忆、群组和任务委派，后者侧重群内协调。现有资料还不足以判断实际效率与成本，下一步应拿自己的小任务亲手试用。使用远程模型时，也要留意哪些内容会随请求发送出去。

跑完这次任务后，我们最大的体会是：最好把智能体的第一版回复当成讨论的起点，而不是终稿。它负责把零散的材料快速归拢成初稿，我们则负责拍板哪些结论留得住、哪些问题还要接着查。如果你打算用它做每周简报，不妨先跑熟这套“生成—核对—删减”的闭环，再去折腾自动收集资料和定时发送。

如果你想亲手试试，可以先看[安装指南](/docs/installation/)；要是更关心怎么让它帮忙写代码，欢迎接着读[给一个函数补测试的经历](/blog/agent-unit-test-handoff/)。

<details class="evidence-detail"><summary>查看运行环境和原始记录</summary>

这次测试使用 DeepSeekBot v1.2.0 的[源码版本](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)，在 Windows 上搭配 DSH 0.2.0-rc.1 运行，未启用桌面或浏览器操作组件；输入资料来自上表链接的固定版本。

第一份回复使用 `deepseek-official/deepseek-flash`；短版尝试使用 `opencode-go/deepseek-v4-flash`，并包含 [Windows 启动修复](https://github.com/BotHarness/DeepSeekBot/pull/1410)。两次均只在私聊中返回草稿，未设置定时任务或更新记忆。

简报、补测试和问题排查合计调用了 22 次 DeepSeek API，估算费用约 US$0.0197（不含 OpenCode Go 部分）。自托管运行时，还需自行维护运行环境与模型额度。

[完整运行记录](/task-evidence/2026-10-11/evidence.json) · [图片来源](/blog-figures/first-task/provenance.json)

</details>
