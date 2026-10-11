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

给智能体的第一项工作，我们选了整理资料。手边有三份项目介绍，想弄明白它们各自做什么、哪些信息还需要继续查。把它们整理成一页简报，是一个结果容易检查、也能用在日常工作里的起点。

DeepSeekBot 交回了带来源的草稿：三条观察、两个未解决问题。我们仍要回到原文核对，也要删掉过长的解释。下面分享这次尝试，以及我们会怎样把它用到下一份简报里。

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">认识界面 · 01</span><strong>从一段对话开始</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文界面全景：左侧 Bot 与群组，中间私聊，右侧 Git 记忆面板；演示对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选择 Bot 或群组</strong><span>在左侧找到要交谈的 Bot。</span></div><div><b>02</b><strong>在对话里看草稿</strong><span>读完回复后，可以继续追问或请它改写。</span></div><div><b>03</b><strong>继续处理任务</strong><span>右侧集中放着记忆和任务的入口。</span></div></div>
<details class="evidence-detail"><summary>放大右侧 Git 记忆面板</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="放大的演示 Git 记忆面板" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="放大的演示 Git 记忆面板"><image href="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>DeepSeekBot 的对话界面（示例对话）。点击图片可放大。</figcaption>
</figure>

## 先想清楚，这份简报要帮你回答什么

这次的题目来自一个容易混淆的地方：DeepSeekBot 和 DS Bot 名字相似，却是不同维护者的独立项目。我们想先认清项目，再了解它们与 DeepSeek Harness 的关系。

| 资料 | 我们想了解什么 |
| --- | --- |
| [BotHarness 的 DeepSeekBot](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) | 如何保留记忆、组织协作和交接任务 |
| [FeiZhuLulu 的 DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) | 另一个同名项目如何安排群内协作 |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) | 运行这些插件的基础软件是什么 |

我们先挑出相关段落，加上哪些说法有资料支持的说明，再一起交给 Bot。这次尝试从准备好的材料开始；它没有自行上网寻找来源。如果你要整理会议记录、项目进展或几篇技术文章，也可以先把问题和材料缩到自己熟悉的范围。

## 让它先交一份带来源的草稿

任务要求很简单：约 700 字，三条观察、两个未解决问题，重要说法都能找到出处。结果先回到私人对话，方便继续修改。

你可以把自己的资料放进这个模板：

```text
请根据下面三份资料，整理一页简报：
A：[原文与相关段落]
B：[原文与相关段落]
C：[原文与相关段落]

写出三条观察和两个还需要确认的问题。
每条重要结论注明来源，推测与事实分开写。
只使用我提供的材料，先把草稿发回这段对话。
```

这个模板可以改成竞品动态、技术方案或一周项目进展。关键是告诉它你想回答什么，并让来源跟着结论走。

## 草稿有了，最值得做的是回到原文

原始回复整理了项目身份、协作方式，以及成本和数据方面的问题。读完后，我们没有直接拿它做产品推荐，而是沿着来源检查了几个容易被简化的地方。

首先是项目身份：两款同名产品的安装包分别是 `deepseekbot` 和 `ds-bot`，都不是 DeepSeek 公司官方产品。其次，README 对协作机制的介绍，能说明作者怎样设计产品，却还回答不了实际用起来谁更省时。最后，记忆保存在本机，也不意味着调用远程模型时相关内容不会传出去。

这几项核对让草稿更有用：它帮我们把问题列出来，也把需要继续查的地方留下来。[完整原始回复在这里](/task-evidence/2026-10-11/briefing-original.txt)。

篇幅是这次最明显的问题。约 700 字的要求，得到了一份 1,672 字符的回复。后来换用 OpenCode Go 接入的 DeepSeek V4 Flash，试着压到 200 字符，仍回了 264 字符。这里的计数包含英文、标点和换行。要交一份短简报，仍需要自己删减。

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

## 把它改成能帮助你决定下一步的内容

我们把重复解释合并后，留下了下面这段。它是人工编辑版：

> 先核对维护者和安装包：BotHarness 的 DeepSeekBot（deepseekbot）与 FeiZhuLulu 的 DS Bot（ds-bot）是两个独立项目，均非 DeepSeek 官方产品。前者的介绍强调记忆、群组和任务委派，后者强调群内协调。资料还不足以判断实际效率和成本，下一步应拿自己的小任务试用。使用远程模型时，也要留意哪些内容会随请求发送出去。

做完这次尝试，我们更愿意把智能体的第一份回复当作讨论的起点：它把材料组织起来，我们再决定哪些结论值得保留、哪些问题要追问。想做每周简报，可以先试着完成这一轮，再考虑自动收集资料和定时发送；这两步还需要单独尝试。

如果你也想开始，先看[安装指南](/docs/installation/)。想把任务换成写代码，可以接着读[给一个函数补测试的经历](/blog/agent-unit-test-handoff/)。

<details class="evidence-detail"><summary>查看运行环境和原始记录</summary>

这次使用 DeepSeekBot v1.2.0 的[源码版本](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)，在 Windows 上搭配 DSH 0.2.0-rc.1 运行。未使用桌面或浏览器操作组件；输入资料来自上表的固定版本。

第一份回复使用 `deepseek-official/deepseek-flash`；短版使用 `opencode-go/deepseek-v4-flash`，并包含 [Windows 启动修复](https://github.com/BotHarness/DeepSeekBot/pull/1410)。两次都只交回私人回复，没有设置定时任务或更新记忆。上述字符数按原始字符串的 UTF-16 长度计算。

简报、补测试和排查问题合计 22 次 DeepSeek API 请求，费用估算约 US$0.0197；OpenCode Go 的费用不在这项估算里。自托管还需要自己维护运行环境和模型额度。

[完整运行记录](/task-evidence/2026-10-11/evidence.json) · [图片来源](/blog-figures/first-task/provenance.json)

</details>
