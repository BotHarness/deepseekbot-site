---
{
  "title": "DeepSeek 智能体的第一次任务：三份资料，一份可核查简报",
  "description": "用 DeepSeekBot 整理三份公开 README，检查真实输出的引用、遗漏和长度，再判断是否值得用于持续研究。",
  "date": "2026-10-11",
  "tags": ["实测", "研究任务"]
}
---

想试一个 DeepSeek 智能体，可以先给它一项容易验收的工作：把三份公开资料整理成私人简报，每条结论都能回到原文。你将拿到一个草稿，以及一份需要自己核对的清单。

这次 DeepSeekBot 确实交回了简报，三个核心观察和两个未解决问题都有来源标记。但要求约 700 字，原始回复长度达到 1,672 个字符；换用已配置的 Go 模型做短版核验，要求不超过 200 字，仍交回 264 个字符。引用可核查，篇幅需要编辑。这是一次资料整理任务，不是自动追踪新闻或五产品跑分。

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">界面导览 · 01</span><strong>先认清三个工作区域</strong></div>
<a href="/blog-figures/first-task/product-overview-zh.jpg"><img src="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800" alt="DeepSeekBot 中文界面全景：左侧 Bot 与群组，中间私聊，右侧 Git 记忆面板；演示对话" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>选择 Bot 或群组</strong><span>左侧切换对话；本次简报使用私人 DM。</span></div><div><b>02</b><strong>在私聊里审阅交付</strong><span>中间读草稿，追问来源与遗漏。</span></div><div><b>03</b><strong>分开查看记忆与任务</strong><span>右侧提供相关入口；本次没有写入记忆或创建调度。</span></div></div>
<details class="evidence-detail"><summary>放大右侧 Git 记忆面板</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="放大的演示 Git 记忆面板" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="放大的演示 Git 记忆面板"><image href="/blog-figures/first-task/product-overview-zh.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>2880 × 1800 原图，点击查看。复用产品 README 的真实界面截图，对话为虚构观测站演示，不是本次简报结果。图中的 Computer／Browser 入口也不代表 npm 1.2.0 默认包含这些组件。 <a href="/blog-figures/first-task/provenance.json">图片来源与版本</a></figcaption>
</figure>

## 先把任务限制在三份公开资料内

我们选了三份固定版本的 README：

| 来源 | 用来回答什么 | 固定原文 |
| --- | --- | --- |
| BotHarness 的 DeepSeekBot | 我们的插件身份、记忆和任务交接机制 | [S1 README](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) |
| FeiZhuLulu 的 DS Bot | 同名项目的包名、Chief 和群协作说明 | [S2 README](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) |
| DeepSeek Harness | 上游宿主身份及 developer preview 提示 | [S3 README](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) |

输入于 2026-10-11 获取。我们预先选取摘录，附上可以支持哪些结论、不能推出哪些结论的编辑说明。因此，这次测的是**基于准备好的输入整理资料**，没有验证 Bot 自己发现来源、抓取网页或辨别完整文档的能力。

DeepSeekBot 和 DS Bot 是不同维护者的独立项目，安装包分别是 `deepseekbot` 和 `ds-bot`；二者均非 DeepSeek 公司官方产品。上游 DSH 的官方身份不能自动传递给第三方插件。[项目身份说明](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md)

## 给它一个明确的交付要求

第一次请求要求中文一页简报、约 700 字、三个核心观察和两个未解决问题。事实引用 S1/S2/S3 与摘录编号，推断说明条件。最终结果只发回当前私人对话。

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

原始简报按三个主题组织：维护者与安装包、持续协作机制、成本与数据及版本边界。它把事实和推断分别标出，并保留了未知项。[下载完整原始回复](/task-evidence/2026-10-11/briefing-original.txt)

| 检查项 | 人工核对结果 | 编辑处理 |
| --- | --- | --- |
| 产品身份 | S1-E2、S2-E3 支持不同项目及非官方身份 | 保留维护者和包名，避免同名混淆 |
| 协作机制 | S1-E4 支持 Git Memory、Group 与 Assignments；S2-E2 支持 Chief/admin 描述 | 写成作者描述，不推断谁更高效 |
| 数据与版本 | S1-E2/E5 支持远程上下文外发及源码／npm 包差异 | 保留，不能缩成“数据完全不外发” |
| 未知能力 | 没有统一任务成功率、成本或权限实现实测 | 保留未知，不写成“不支持” |
| 篇幅 | 1,672 字符，明显长于要求 | 合并重复范围说明和版本提醒 |
| 表述范围 | “未运行产品”容易误读为没有运行 DeepSeekBot | 改为“未实测另两个项目的任务表现” |

长度按原始字符串计，包含英文、标点和换行；不是纯汉字数。对来源的核对覆盖这份选定输入包，没有把 README 作者自述变成源码审计。

我们另用 Go 模型做了一条短简报核验。界面里可以看到实际提交的结果，原生模型记录确认路由为 `opencode-go/deepseek-v4-flash`。下面这张图属于这次 **Go 核验**，并非上面 1,672 字符原稿的截图。

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">真实交付 · 02</span><strong>放大读：事实引用与未核验项</strong></div>
<div class="evidence-zoom " role="region" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Go 核验实际中文回复：来源标记 S1-E2、S3-E1 以及不能据此判断的事项"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<p class="evidence-scroll-hint">小屏可左右滑动，读清原文。</p>
<div class="evidence-notes"><div><b>01</b><strong>沿标记回到来源</strong><span>【S1-E2】与【S3-E1】指向选定摘录，不是网页自动抓取的证明。</span></div><div><b>02</b><strong>保留“不能据此判断”</strong><span>没有统一成功率与成本实测；未知项不能改成不支持。</span></div></div>
<div class="evidence-subheading">同一画面中的模型选择卡片</div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="模型选择卡片显示 DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<details class="evidence-detail"><summary>展开完整实拍 · 1280 × 900</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="同一条已提交 Go 简报回复的完整真实界面截图" loading="lazy" decoding="async"></a></details>
<figcaption>2026-10-11，Windows，英文界面、中文回复，浅色主题；1280 × 900 实际像素。仅重新拍摄已存在的回复，没有重跑任务。原生 Assistant 记录核验了路由；模型卡片仅作界面说明。 <a href="/task-evidence/2026-10-11/briefing-go.txt">短版原始回复</a>为 264 字符，仍超过 200 字要求。旧截图保存为 1280 × 720，1920 × 1080 是当时的浏览器视口。</figcaption>
</figure>

## 把草稿改成你真正需要的简报

例如，这份输入可以整理成下面的**人工编辑版**，它不是原始模型输出：

> BotHarness 的 DeepSeekBot（deepseekbot）与 FeiZhuLulu 的 DS Bot（ds-bot）是两个独立 DSH 插件，均非 DeepSeek 官方产品。前者 README 强调 Git Memory、Group 和授权后的任务委派；后者强调 Chief 与群管理员协调。资料说明了机制，尚不能判断实际效率和成本。选型时先核对维护者、安装包与版本，再用自己的小任务测试。记忆保存在本机，也不意味着远程模型不会收到相关上下文。

真正有用的验收是：来源是否支持结论、重要限制是否被省略、草稿能否指导下一步。每条都能对上以后，才值得讨论把它做成每周简报。**本次没有创建调度、更新 Git 记忆或发送外部消息，也没有验证持续运行与中断恢复。**

## 复现前，核对环境和成本

本次运行的是 DeepSeekBot **v1.2.0 发布标签的源码 checkout**（[271e056a](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)），DSH 0.2.0-rc.1，隔离的 Windows Profile；没有启用可选 Computer/Browser。它不是一次 npm 安装包资格验证。输入 README 则取自较新的固定提交，两种版本范围需要分开。

第一次使用 `deepseek-official/deepseek-flash`；Go 核验使用已有本机配置，并通过[Windows 启动修复 PR #1410](https://github.com/BotHarness/DeepSeekBot/pull/1410)启动隔离 CLI。该修复仍需合并后才能成为原 checkout 的可用行为。

自托管需要你负责安装、宿主在线与环境更新，模型调用使用你的服务商额度。任务和诊断共用的 DeepSeek API 预算上限为 US$1；22 次请求的估算费用约 US$0.0197，包含编码任务与诊断，不能作为“一份简报”的固定成本，也不是账户账单。Go 使用另一个已配置路由，没有在这里估算其账单。

准备开始时，先看[安装指南](/docs/installation/)；想继续验证代码交付，可以读[单函数测试实测](/blog/agent-unit-test-handoff/)。产品选型仍可参考[个人 AI Agent 对比](/blog/personal-ai-agents-comparison/)，这次任务没有产生新的竞争产品优劣结论。
