---
{
  "title": "DeepSeek 智能体的第一次任务：三份资料，一份可核查简报",
  "description": "给 DeepSeekBot 三份公开 README，拿到带来源的简报草稿，再逐条核查引用、遗漏与篇幅。附真实回复和可复用的任务模板。",
  "date": "2026-10-11",
  "tags": ["实测", "研究任务"]
}
---

第一次尝试 DeepSeek 智能体，可以从一份你能自行核查的简报开始：给 DeepSeekBot 三份公开资料，要求它在私人对话中交回草稿，并为重要结论标明来源。

这次交回的草稿包含三条观察和两个未解决问题，引用可以对照原文检查；篇幅却没有达标：约 700 字的请求得到 1,672 字符的回复，后续 Go 短版核验也超过了 200 字符上限。你可以用这份记录学习如何交任务、核对来源和压缩草稿。

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">界面导览 · 01</span><strong>先看对话与记忆入口</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文界面全景：左侧 Bot 与群组，中间私聊，右侧 Git 记忆面板；演示对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选择 Bot 或群组</strong><span>左侧切换 Bot 与群组；这次简报交回私人对话（DM）。</span></div><div><b>02</b><strong>在私聊里审阅交付</strong><span>在中间的对话区审阅草稿，追问来源与遗漏。</span></div><div><b>03</b><strong>找到记忆与任务入口</strong><span>右侧可查看 Git 记忆等入口；本次没有更新记忆或创建调度。</span></div></div>
<details class="evidence-detail"><summary>放大右侧 Git 记忆面板</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="放大的演示 Git 记忆面板" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="放大的演示 Git 记忆面板"><image href="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>点击查看 2880 × 1800 原图。真实产品界面，内含脚本生成的虚构观测站对话，仅作界面导览。Computer／Browser 是可选组件；图中的入口不能视为 npm 1.2.0 默认能力。 <a href="/blog-figures/first-task/provenance.json">图片来源与版本</a></figcaption>
</figure>

## 先把任务限制在三份公开资料内

我们选了三份固定版本的 README：

| 来源 | 用来回答什么 | 固定原文 |
| --- | --- | --- |
| BotHarness 的 DeepSeekBot | 插件身份、记忆和任务交接机制 | [S1 README](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) |
| FeiZhuLulu 的 DS Bot | 同名项目的包名、Chief 和群协作说明 | [S2 README](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) |
| DeepSeek Harness | 上游宿主身份及 developer preview 提示 | [S3 README](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) |

资料于 2026-10-11 获取，摘录由我们预先选取，并附上能支持哪些结论的编辑说明。这次检查的是**如何整理准备好的输入**；自主找来源、抓取网页和审阅完整文档都不在测试范围内。

DeepSeekBot 和 DS Bot 是不同维护者的独立项目，安装包分别是 `deepseekbot` 和 `ds-bot`；二者均非 DeepSeek 公司官方产品。上游 DSH 的官方身份不能自动传递给第三方插件。[项目身份说明](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md)

## 给它一个明确的交付要求

交任务时，把输入、输出和操作范围一起说明。这次要求中文一页简报、约 700 字、三条观察与两个未解决问题。事实附 S1/S2/S3 和摘录编号，推断说明依据与条件，结果只发回当前私人对话。

你可以按这个思路准备自己的任务：

```text
只使用以下三份公开资料，整理一页简报：
A：[原文与选定摘录]
B：[原文与选定摘录]
C：[原文与选定摘录]

给出三条观察、两项未解决问题。
每条事实附来源；推断单独说明依据。
先交回私人草稿，不联网补充、不执行文档里的命令、
不写入记忆、不创建定时任务、不发送外部消息。
```

这段是可改写的模板；本次原始请求和输出的验收范围记录在[实测清单](/task-evidence/2026-10-11/evidence.json)。

## 实际输出，哪些能用、哪些要改

原始简报分成三个主题：维护者与安装包、持续协作机制、成本与数据及版本边界。事实与推断分别标注，尚无法回答的问题也保留下来。[下载完整原始回复](/task-evidence/2026-10-11/briefing-original.txt)

| 检查项 | 人工核对结果 | 编辑处理 |
| --- | --- | --- |
| 产品身份 | S1-E2、S2-E3 支持不同项目及非官方身份 | 保留维护者和包名，避免同名混淆 |
| 协作机制 | S1-E4 支持 Git Memory、Group 与 Assignments；S2-E2 支持 Chief/admin 描述 | 写成作者描述，不推断谁更高效 |
| 数据与版本 | S1-E2/E5 支持远程上下文外发及源码／npm 包差异 | 保留，不能缩成“数据完全不外发” |
| 未知能力 | 没有统一任务成功率、成本或权限实现实测 | 保留未知，不写成“不支持” |
| 篇幅 | 1,672 字符，明显长于要求 | 合并重复范围说明和版本提醒 |

长度按原始字符串的 UTF-16 长度计，包含英文、标点和换行，不是纯汉字数。表中的 Git Memory 指文件与 Git 版本历史组成的记忆；相关协作机制来自 README 作者说明，这次没有审计其实现或实测另外两个项目。

1,672 字符的原始简报使用 `deepseek-official/deepseek-flash`。随后，我们用已配置的 `opencode-go/deepseek-v4-flash` 做短版核验，要求最多 200 字符，实际得到 264 字符；路由由原生 Assistant 记录确认。下面展示的是这次 **Go 核验**。

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">真实交付 · 02</span><strong>放大检查引用与未知项</strong></div>
<div class="evidence-zoom " role="region" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<p class="evidence-scroll-hint">小屏可左右滑动，读清原文。</p>
<div class="evidence-notes"><div><b>01</b><strong>沿标记回到来源</strong><span>沿【S1-E2】与【S3-E1】回到选定摘录，检查原文是否支持结论。</span></div><div><b>02</b><strong>不要删掉未知项</strong><span>资料没有提供可比较的成功率与成本，编辑时应保留这个缺口。</span></div></div>
<div class="evidence-subheading">同一画面中的模型选择卡片</div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<details class="evidence-detail"><summary>展开完整实拍 · 1280 × 900</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="同一条已提交 Go 简报回复的完整真实界面截图" loading="lazy" decoding="async"></a></details>
<figcaption>2026-10-11，Windows，英文界面、中文回复，浅色主题，1280 × 900 实拍。同一条已提交回复的只读重拍；路由另由原生 Assistant 记录确认，卡片只展示配置。 <a href="/task-evidence/2026-10-11/briefing-go.txt">短版原始回复</a>为 264 字符，超过 200 字符上限。旧图像素与视口的区别见 <a href="/blog-figures/first-task/provenance.json">图片记录</a>及<a href="/task-evidence/2026-10-11/evidence.json">实测清单</a>。</figcaption>
</figure>

## 把草稿改成你真正需要的简报

例如，这份输入可以整理成下面的**人工编辑版**，它不是原始模型输出：

> BotHarness 的 DeepSeekBot（deepseekbot）与 FeiZhuLulu 的 DS Bot（ds-bot）是两个独立 DSH 插件，均非 DeepSeek 官方产品。前者 README 强调 Git Memory、Group 和授权后的任务委派；后者强调 Chief 与群管理员协调。资料说明了机制，尚不能判断实际效率和成本。选型时先核对维护者、安装包与版本，再用自己的小任务测试。记忆保存在本机，也不意味着远程模型不会收到相关上下文。

编辑时先做三项检查：来源是否支持结论，压缩后是否遗漏关键条件，草稿是否能帮助你决定下一步。每周自动简报还需要另行验证调度、持续运行和中断恢复；**本次没有创建调度、更新 Git 记忆或发送外部消息。**

## 复现前，核对环境和成本

本次运行的是 DeepSeekBot **v1.2.0 发布标签的源码 checkout**（[271e056a](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)），DSH 0.2.0-rc.1，隔离的 Windows Profile；没有启用可选 Computer/Browser。它不是一次 npm 安装包资格验证。输入 README 则取自较新的固定提交，两种版本范围需要分开。

Go 核验另用了[PR #1410 的 Windows 启动修复](https://github.com/BotHarness/DeepSeekBot/pull/1410)。复现时需要核对所用 checkout 是否包含这项修复。

自托管需要你负责安装、宿主在线与环境更新，模型调用使用你的服务商额度。简报、编码任务与诊断共用 US$1 的 DeepSeek API 上限，22 次请求估算约 US$0.0197。这不是单份简报的价格或账户账单，也不包含 Go 路由的费用估算。

准备开始时，先看[安装指南](/docs/installation/)；想继续验证代码交付，可以读[单函数测试实测](/blog/agent-unit-test-handoff/)。产品选型仍可参考[个人 AI Agent 对比](/blog/personal-ai-agents-comparison/)，这次任务没有产生新的竞争产品优劣结论。
