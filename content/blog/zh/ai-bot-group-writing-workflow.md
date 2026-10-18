---
{
  "title": "两个 AI 同事改一篇稿：群聊协作的第一天",
  "description": "林小满挑问题，周予衡改稿并保存文件。一次真实的小红书文案任务，看看 AI 群聊里的分工、@ 交接和人工纠错到底留下了什么。",
  "date": "2026-10-18",
  "tags": ["AI 协作写作", "Personal Agent"]
}
---

*封面为 AI 基于九张截图制作；正文保留原始聊天截图。*

林小满看完标题，先指出两件事：有的标题超过了要求的字数，“改到第四轮”也没有事实依据。周予衡接着认错、改写。比起两位 AI 同事轮流说“这个想法很好”，这种具体的来回才是我们想看的协作。

这次任务很小：把《从零开始的 Personal Agent》第一天的经历，写成一篇小红书稿。两个 Bot 用自己的名字与头像在同一群聊里讨论，最后留下了文案文件和回访表。任务、提示和修改方向由我们组织，交稿后仍要人工审阅。

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/grid.png"><img src="/blog-figures/ai-bot-group-writing-workflow/grid.png" width="3240" height="7200" style="max-width:540px;display:block;margin:auto" alt="小满和阿衡的工作间的九张原始手机截图，3×3直接排列" decoding="async"></a>
<figcaption>九张原始全屏截图直拼，没有重绘对话。点击可放大；下方可逐张查看。</figcaption>
</figure>

## 给两个人不同的工作

我们让周予衡负责起草和保存，让林小满站在读者这边挑问题：有没有产品介绍腔，哪里绕口，哪里不够具体。两个人像头像都是 AI 生成的原创虚构人物，不是真实员工。

最初的约束也很清楚：现在只有 Day 0，不能写成已经验证一百天；先给三个短标题，不写“完全懂我”或“效率翻倍”。即便这样，生成结果还是出现了字数和轮次的问题。小满指出以后，阿衡把第三个标题改成了符合实际的一次改稿。

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/02.png"><img src="/blog-figures/ai-bot-group-writing-workflow/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：别光说好" loading="lazy" decoding="async"></a>
<figcaption>别光说好，点击查看原始全屏截图。</figcaption>
</figure>

角色分工没有自动消除错误。它让这次群聊里多了一个明确的检查角度：起草的人推进稿件，审阅的人有理由说哪里不成立。

## @ 交接之后，稿子真的变了吗

群里能看到小满 @ 阿衡，要求改某一句；也能看到阿衡回应同伴的具体意见。这些 @ 对应实际 Bot 身份，文章没有把名字贴到截图上来假装交接。

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/04.png"><img src="/blog-figures/ai-bot-group-writing-workflow/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：互相交接" loading="lazy" decoding="async"></a>
<figcaption>互相交接，点击查看原始全屏截图。</figcaption>
</figure>

最后保存的稿件用了《三个人改一篇稿，谁听谁的》这个标题，并留下三处可检查的变化：

- 一句绕了几次转折的话，改成“记住了，不等于下次就真能接住我”。
- “养两个 Personal Agent”换成“两个 AI 伙伴”，少一点产品介绍味。
- 删除“没写脚本”，因为输入与流程确实有操作脚本参与；改为这次实际做的分别聊天、交稿、再进群。

这些变化可以直接在[保存的中文文案](/blog-figures/ai-bot-group-writing-workflow/workroom-day0.md)里看。截图中的文件页是较早版本，后续改动以这份最终读回的文件为准。我们没有把“文件已写入”说成“已经发布”。

## 回访表也被嫌太长

我们又请阿衡准备一张表，留到以后检查 Memory 有没有帮上忙。第一版有五栏，小满认为太像做表格，最后只剩三件事：新的任务、有没有重复解释旧要求、哪里又改了一次。

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/08.png"><img src="/blog-figures/ai-bot-group-writing-workflow/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：再删两栏" loading="lazy" decoding="async"></a>
<figcaption>再删两栏，点击查看原始全屏截图。</figcaption>
</figure>

[这份回访表](/blog-figures/ai-bot-group-writing-workflow/followup-day0.md)已经保存，但以后的结果还没有。没有数据就写“没数”，不能为了把故事写完整，把“下次少改一轮”填成已经发生的收益。

文案结尾也分成了两个用途。给读者看的问题是“哪件小事你不想每次重讲？”，我们自己要验证的“换任务以后能否少解释一次”则留在备注，不混进发布稿。

## 这次交付的价值，到这里为止

我们拿到了一份改过的文案和一张更短的回访表，也看到了标题虚构轮次、字数没守住、措辞不实这些需要纠正的地方。它没有证明两个 Bot 一定比一个好，也没有证明它们下一次会自动记住写作风格。多一个成员也会增加沟通和模型调用。

如果你想试一组 AI 同事，可以先照[安装指南](/docs/installation/)准备一个可用的 Bot，再在 Group 中增加一个有明确审阅职责的同伴。只给一段稿、一个检查任务，把结果保存到可打开的文件里；不急着让它们接管发布账号。本文的移动端截图来自开发源码，不能据此推断稳定发行版已经包含相同界面。

关于个人 Bot 团队和记忆文件的基础机制，已有[长期记忆与 Bot 团队入门](/blog/personal-ai-agent-memory/)。这次我们先用一篇稿，留下以后能对照的起点。

<details>
<summary>查看全部 10 张原始截图</summary>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/01.png"><img src="/blog-figures/ai-bot-group-writing-workflow/01.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：先选标题" loading="lazy" decoding="async"></a>
<figcaption>先选标题，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/02.png"><img src="/blog-figures/ai-bot-group-writing-workflow/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：别光说好" loading="lazy" decoding="async"></a>
<figcaption>别光说好，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/03.png"><img src="/blog-figures/ai-bot-group-writing-workflow/03.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：第一版稿" loading="lazy" decoding="async"></a>
<figcaption>第一版稿，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/04.png"><img src="/blog-figures/ai-bot-group-writing-workflow/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：互相交接" loading="lazy" decoding="async"></a>
<figcaption>互相交接，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/05.png"><img src="/blog-figures/ai-bot-group-writing-workflow/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：写进文件" loading="lazy" decoding="async"></a>
<figcaption>写进文件，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/06.png"><img src="/blog-figures/ai-bot-group-writing-workflow/06.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：怎么回访" loading="lazy" decoding="async"></a>
<figcaption>怎么回访，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/07.png"><img src="/blog-figures/ai-bot-group-writing-workflow/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：表格太长" loading="lazy" decoding="async"></a>
<figcaption>表格太长，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/08.png"><img src="/blog-figures/ai-bot-group-writing-workflow/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：再删两栏" loading="lazy" decoding="async"></a>
<figcaption>再删两栏，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/09.png"><img src="/blog-figures/ai-bot-group-writing-workflow/09.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：读者提问" loading="lazy" decoding="async"></a>
<figcaption>读者提问，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/10.png"><img src="/blog-figures/ai-bot-group-writing-workflow/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="小满和阿衡的工作间：交稿确认" loading="lazy" decoding="async"></a>
<figcaption>交稿确认，点击查看原始全屏截图。</figcaption>
</figure>
</details>

<details>
<summary>本次任务与文件记录</summary>

原始产物：[最终文案](/blog-figures/ai-bot-group-writing-workflow/workroom-day0.md)、[回访表](/blog-figures/ai-bot-group-writing-workflow/followup-day0.md)。文件保留中文原文。这是编辑写作任务，没有在本轮检查外部 GitHub Issue 或维护代码仓库。

2026-10-18，安卓模拟器原生 App，浅色主题、中文 UI；产品源码 [d2529fe](https://github.com/BotHarness/DeepSeekBot/tree/d2529feb520ace2d773db6ac0966dc265887bdc5)。使用 SDK 58 兼容的开发客户端，未在本轮重新构建 APK，也未验证 iOS。输入由操作 Agent 按我们批准的主题组织，通过生产 CLI 送入；回复与文件写入来自实际模型及工具，不冒充逐字手打或零干预。全部是 Day 0、既有 Session，不是跨天记忆成效或稳定商店版本证明。原图未重绘；选图按主题编排，非连续录屏。文件来源与逐项 SHA256 见[公开记录](/blog-figures/ai-bot-group-writing-workflow/provenance.json)。

</details>
