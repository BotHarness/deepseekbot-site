---
{
  "title": "蔚蓝档案 AI 群聊：先写好 SOUL，再聊一个周末",
  "description": "从零开始的 Personal Agent 第一天：让优香、白子、星野聊散步、水族馆和便利店，看看角色设定与新记忆该怎样分开。",
  "date": "2026-10-18",
  "tags": ["角色群聊", "Personal Agent"]
}
---

*封面为 AI 基于九张截图制作；正文保留原始聊天截图。*

“周末出去走走，但不想早起，也不想赶景点。”老师把这句话丢进群里，白子提议骑车，星野想去水族馆，优香开始关心路费和有没有吃饭。这次我们想看的，就是这种有一点分歧、又能接住彼此的生活聊天。

这是《从零开始的 Personal Agent》的一次 Day 0 记录。三个角色由我们配置，话题和后续提示也由我们组织，回复来自实际模型调用；画面是 DeepSeekBot 安卓开发版的真实截图。它是一场跨校同人小剧场，不是《蔚蓝档案》的官方剧情或合作。

<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/grid.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/grid.png" width="3240" height="7200" style="max-width:540px;display:block;margin:auto" alt="白子提出骑车后缩短距离，老师纠正优香把自行车当汽车的误解，三人商量雨天公交、水族馆和群内虚构约定" decoding="async"></a>
<figcaption>九张原始全屏截图直拼，没有重绘对话。点击可放大；下方可逐张查看。</figcaption>
</figure>

## 先把角色写对，再让她们开口

最先要改的不是头像，而是角色容易被写成同一种“万能助理”：一开口就整理任务、列清单、总结下一步。生活群聊里，三个人都这样说话，再漂亮的头像也没有用。

我们先回到官方资料。优香是千禧年研讨会的会计，不能因为进了这个群就变成阿拜多斯会计；白子寡言，却喜欢慢跑、训练和公路自行车；星野平时松弛、爱午睡，关键时刻又会保护同伴。官方动画也给了水族馆这个生活题材。

写进 `SOUL.md` 时，我们把原作身份和这次演绎的要求分开：优香可以认真算车票，但不用每句话都训人；白子用行动表示关心，不用每句话都复读一个口癖；星野可以想休息，也会注意老师累不累。这些声线安排是我们的演绎，不是官方台词。

三份 SOUL 与角色资料的文件入口见文末记录。文件写好后，角色在当前对话中实际读取了它们；我们没有把这件事说成当前系统提示已经自动热更新。

## “一小段”到底是多远

白子说骑一小段，接着给出八公里。老师想轻松一点，她又把距离缩到两公里。比起所有人立刻同意一份完美行程，这个来回更像我们想拍的日常：角色有自己的习惯，也会因同伴的状态调整。

<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/02.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：骑多远呀" loading="lazy" decoding="async"></a>
<figcaption>骑多远呀，点击查看原始全屏截图。</figcaption>
</figure>

后来话题落到便利店、最后一份布丁、下雨坐公交，以及到了水族馆能不能坐着看鱼，不必把每个展区逛完。这里发生的是新对话中的选择，不能据此给角色补上“原作最喜欢某种食物”之类的设定。

## 角色写对了，也还是会说错

优香一度把白子的自行车理解成了汽车。这个错误没有靠修图消失：老师在群里指出来，优香承认弄错，大家再商量公交和热饮。我们把这轮真实纠正也留下了。

<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/07.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：雨天公交" loading="lazy" decoding="async"></a>
<figcaption>雨天公交，点击查看原始全屏截图。</figcaption>
</figure>

`SOUL.md` 能表达一个方向，不能保证每句生成都符合原作。具体到这次聊天，值得检查的是：身份有没有串、语气有没有变成梗的复读、出错后能不能接受纠正。

## 周末小剧场，应该留下什么记忆

我们把原作参考放在 `ROLE_CANON.md`，稳定的演绎规则放在 `SOUL.md`，这次群里的约定放进各自的生活记录。最后又补清楚：约的是群内小剧场，不是用户现实中的明日出行，也不是已经发生过的线下见面。

<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/10.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：小约定" loading="lazy" decoding="async"></a>
<figcaption>小约定，点击查看原始全屏截图。</figcaption>
</figure>

文件已经保存并读回，但这十张图仍然都在第一天、既有 Session 中。它们能说明我们聊了什么、记录了什么，还不能说明过几天重新聊天时，这些记忆一定能派上用场。[Soul 与核心记忆指南](/docs/soul-and-core-memory/)解释了文件与 Session 快照的关系。

下一次值得做的小测试是：新开一次互动，不再提醒“不早起、不要赶景点”，看看角色会不会找到正确的生活记录；如果想错了，就把错在读取、过期信息还是角色理解记下来。第 0 天先把这个起点留好。

## 想自己试一群角色

先从一个生活问题开始，比如周末去哪儿，不要同时给三个人安排十项工作。在 [DeepSeekBot 安装指南](/docs/installation/)完成基础设置后，给每个 PersonaBot 独立的名字、头像与 SOUL，再邀请进同一个 Group；这次的移动端画面来自开发源码，不代表安装指南的稳定发行版已经包含同一界面。

如果主要想了解记忆机制，可以看已有的[个人 AI 智能体与长期记忆](/blog/personal-ai-agent-memory/)。本文保留的只是这群角色第一次认真聊生活的样子。

<details>
<summary>查看全部 10 张原始截图</summary>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/01.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/01.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：约好出门" loading="lazy" decoding="async"></a>
<figcaption>约好出门，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/02.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：骑多远呀" loading="lazy" decoding="async"></a>
<figcaption>骑多远呀，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/03.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/03.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：水族馆吧" loading="lazy" decoding="async"></a>
<figcaption>水族馆吧，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/04.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：十点半见" loading="lazy" decoding="async"></a>
<figcaption>十点半见，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/05.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：吃点东西" loading="lazy" decoding="async"></a>
<figcaption>吃点东西，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/06.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/06.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：最后布丁" loading="lazy" decoding="async"></a>
<figcaption>最后布丁，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/07.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：雨天公交" loading="lazy" decoding="async"></a>
<figcaption>雨天公交，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/08.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：坐着看鱼" loading="lazy" decoding="async"></a>
<figcaption>坐着看鱼，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/09.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/09.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：慢慢等你" loading="lazy" decoding="async"></a>
<figcaption>慢慢等你，点击查看原始全屏截图。</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/blue-archive-ai-roleplay-soul/10.png"><img src="/blog-figures/blue-archive-ai-roleplay-soul/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="夏莱周末小群：小约定" loading="lazy" decoding="async"></a>
<figcaption>小约定，点击查看原始全屏截图。</figcaption>
</figure>
</details>

<details>
<summary>角色来源与本次记录</summary>

原作依据：[优香官方学生介绍](https://x.com/Blue_ArchiveJP/status/1353175798992179200)、[优香试玩游戏的官方漫画介绍](https://x.com/Blue_ArchiveJP/status/1409723315992752130)、[白子官方人物页](https://sh-anime.shochiku.co.jp/bluearchive-anime/character/sunaokami-shiroko/)、[星野官方人物页](https://sh-anime.shochiku.co.jp/bluearchive-anime/character/takanashi-hoshino/)、[官方动画第八话](https://sh-anime.shochiku.co.jp/bluearchive-anime/story/)。核对日期为 2026-10-18。头像为 AI 生成的同人插画，角色属于原权利人，本文不代表官方。

角色文件：[优香 SOUL](/blog-figures/blue-archive-ai-roleplay-soul/yuuka-soul.md)、[白子 SOUL](/blog-figures/blue-archive-ai-roleplay-soul/shiroko-soul.md)、[星野 SOUL](/blog-figures/blue-archive-ai-roleplay-soul/hoshino-soul.md)；原作资料分别为 [优香](/blog-figures/blue-archive-ai-roleplay-soul/yuuka-canon.md)、[白子](/blog-figures/blue-archive-ai-roleplay-soul/shiroko-canon.md)、[星野](/blog-figures/blue-archive-ai-roleplay-soul/hoshino-canon.md)。

2026-10-18，安卓模拟器原生 App，浅色主题、中文 UI；产品源码 [d2529fe](https://github.com/BotHarness/DeepSeekBot/tree/d2529feb520ace2d773db6ac0966dc265887bdc5)。使用 SDK 58 兼容的开发客户端，未在本轮重新构建 APK，也未验证 iOS。输入由操作 Agent 按我们批准的主题组织，通过生产 CLI 送入；回复与文件写入来自实际模型及工具，不冒充逐字手打或零干预。全部是 Day 0、既有 Session，不是跨天记忆成效或稳定商店版本证明。原图未重绘；选图按主题编排，非连续录屏。文件来源与逐项 SHA256 见[公开记录](/blog-figures/blue-archive-ai-roleplay-soul/provenance.json)。

</details>
