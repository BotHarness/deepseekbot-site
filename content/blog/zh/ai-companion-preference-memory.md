---
{
  "title": "AI 陪伴该记住什么？从一杯热可可聊起",
  "description": "《从零开始的 Personal Agent》Day 0：和林小满聊晚安热饮，把一句随口抱怨和长期偏好拆开记进文件，留下一条下次就能核对的小约定。",
  "date": "2026-10-18",
  "tags": ["AI 陪伴", "偏好记忆", "Personal Agent"]
}
---

*封面由 AI 基于九张实测截图生成；正文展示的均为原始聊天截图。*

深夜聊天时，一句“今晚太困了，不想聊工作”只是眼下的状态；而“晚上喝咖啡会睡不着，我一般喝热可可”才是一条经得起时间检验的长期偏好。如果一个 AI 伙伴把前者记成“这人永远讨厌聊工作”，却把后者随手丢在脑后，聊得越久反而越让人觉得别扭。

在《从零开始的 Personal Agent》的第一天（Day 0），我们跟虚构角色林小满聊了一次睡前热饮，专门把“今晚的临时状态”和“值得长久留存的小习惯”拆开写进她的记忆文件。林小满和她的写实头像都是我们用 AI 生成的原创虚构形象。比起空谈抽象的“陪伴感”，先看她能不能记准一杯热可可，要实在得多。

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/grid.png"><img src="/blog-figures/ai-companion-preference-memory/grid.png" width="3240" height="7200" style="max-width:540px;display:block;margin:auto" alt="林小满私聊的九张原始手机截图，3×3直接排列" decoding="async"></a>
<figcaption>九张原始全屏截图直拼，未重绘对话。点击可放大；文末可逐张查看。</figcaption>
</figure>

## 先分清随口抱怨与长期习惯，再落笔

聊天刚开场，我们先给林小满出了一道分类题：哪些话听听就好、顺手接住情绪即可，哪些话才值得郑重其事地写进记忆？她的回答很干脆——今晚累不累是当下的情绪，而“晚上不喝美式、喜欢喝不太甜的热可可”才是以后还能派上用场的习惯。

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/02.png"><img src="/blog-figures/ai-companion-preference-memory/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：先别乱记" loading="lazy" decoding="async"></a>
<figcaption>先区分临时情绪与长期偏好，点击查看原始全屏截图。</figcaption>
</figure>

很多时候，聊天体验越聊越僵，正是因为把一时的气话或抱怨当成了永久标签。在动笔写记忆文件之前，先在对话里把这两件事理清楚，留存下来的笔记才会干净可用。

## 打开记忆文件，看看她到底记下了什么

聊定之后，小满把整理好的规则写进了她的 [`SOUL.md`](/blog-figures/ai-companion-preference-memory/xiaoman-soul-day0.md) 和 [`MEMORY.md`](/blog-figures/ai-companion-preference-memory/xiaoman-memory-day0.md)，并当场读回给我们核对。

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/05.png"><img src="/blog-figures/ai-companion-preference-memory/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：记进文件" loading="lazy" decoding="async"></a>
<figcaption>把偏好写进本地文件并读回确认，点击查看原始全屏截图。</figcaption>
</figure>

打开她的 `MEMORY.md`，可以看到三条清清楚楚的记录：

- **确认过的习惯：** 晚上避免咖啡因；睡前喜欢喝不太甜的热可可，或者温热的麦茶。
- **不升格为长期设定的事：** 某天说“累了”“不想聊工作”，只当作当时的状态回应。
- **诚实边界：** 不编造现实中没发生过的见面或经历。

在底层机制上，`SOUL.md` 与 `MEMORY.md` 会在会话启动时作为快照载入系统提示，修改后会在新开会话（Session）或下一次上下文压缩时正式生效；而在当前对话里，小满已经通过工具把更新后的文件读了回来，确认内容无误。

## 下次聊起晚安热饮，用这三道题来考她

第一天的对话到这里就告一段落了。文件写好并读回，相当于完成了“记笔记”这一步；至于过几天开启一段全新的对话时，她能不能自然地用上这份笔记，我们留了一道很简单的检验题。

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/07.png"><img src="/blog-figures/ai-companion-preference-memory/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：下次怎么考" loading="lazy" decoding="async"></a>
<figcaption>约定下次对话的检验方式，点击查看原始全屏截图。</figcaption>
</figure>

等下次深夜再打开新会话聊起想喝点什么时，我们不主动提醒，只看三件事：

1. 她会不会避开美式咖啡？
2. 她能不能自然地提起少甜的热可可或温麦茶？
3. 她会不会莫名其妙编出一段“上次我们一起去咖啡馆”的虚假回忆？

把期待从笼统的“懂我”落回这三件小事上，不管下次她是稳稳接住还是不小心忘词，我们都能打开文件看个明明白白。

## 自己动手试试：从记住一件小事开始

如果你想自己配一个这样的角色，可以先照着[安装指南](/docs/installation/)把环境跑起来，创建一个 Bot，然后跟它聊一件你真正在意的生活小习惯——比如常喝的饮料、习惯的称呼，或者回复时不要太啰嗦。聊完让它写进记忆文件并读给你看，过几天新开一个会话，故意只抛半句话，看看它能不能接上。

想进一步了解 `SOUL.md`、`MEMORY.md` 和按需记忆文件是怎么配合的，可以接着读[长期记忆与 Bot 团队入门](/blog/personal-ai-agent-memory/)；如果你想看林小满换上审稿人的身份、和搭档一起在群里改文案，也可以去看看[群聊改稿的第一天记录](/blog/ai-bot-group-writing-workflow/)。

<details>
<summary>查看全部 10 张原始截图</summary>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/01.png"><img src="/blog-figures/ai-companion-preference-memory/01.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：第一晚开场" loading="lazy" decoding="async"></a>
<figcaption>第一晚开场，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/02.png"><img src="/blog-figures/ai-companion-preference-memory/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：先别乱记" loading="lazy" decoding="async"></a>
<figcaption>先别乱记，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/03.png"><img src="/blog-figures/ai-companion-preference-memory/03.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：热可可偏好" loading="lazy" decoding="async"></a>
<figcaption>热可可偏好，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/04.png"><img src="/blog-figures/ai-companion-preference-memory/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：语气约定" loading="lazy" decoding="async"></a>
<figcaption>语气约定，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/05.png"><img src="/blog-figures/ai-companion-preference-memory/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：记进文件" loading="lazy" decoding="async"></a>
<figcaption>记进文件，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/06.png"><img src="/blog-figures/ai-companion-preference-memory/06.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：读回记忆" loading="lazy" decoding="async"></a>
<figcaption>读回记忆，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/07.png"><img src="/blog-figures/ai-companion-preference-memory/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：下次怎么考" loading="lazy" decoding="async"></a>
<figcaption>下次怎么考，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/08.png"><img src="/blog-figures/ai-companion-preference-memory/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：边界写清" loading="lazy" decoding="async"></a>
<figcaption>边界写清，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/09.png"><img src="/blog-figures/ai-companion-preference-memory/09.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：不装熟" loading="lazy" decoding="async"></a>
<figcaption>不装熟，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/10.png"><img src="/blog-figures/ai-companion-preference-memory/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="林小满私聊：收尾留题" loading="lazy" decoding="async"></a>
<figcaption>收尾留题，点击查看原始全屏截图。</figcaption>
</figure>
</details>

<details>
<summary>本次任务与文件记录</summary>

原始文件：[`SOUL.md`](/blog-figures/ai-companion-preference-memory/xiaoman-soul-day0.md)、[`MEMORY.md`](/blog-figures/ai-companion-preference-memory/xiaoman-memory-day0.md)。

记录时间：2026-10-18，运行于安卓模拟器原生开发客户端（浅色主题、中文界面），基于产品源码 [d2529fe](https://github.com/BotHarness/DeepSeekBot/tree/d2529feb520ace2d773db6ac0966dc265887bdc5)。话题与输入通过 CLI 组织送入，模型回复与文件写入均为真实调用。原图未重绘，文件来源与 SHA256 校验值见[公开记录](/blog-figures/ai-companion-preference-memory/provenance.json)。

</details>
