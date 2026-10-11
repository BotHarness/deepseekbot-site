# 关键词补采样：2026-10-11

本轮完成 18 项一次性地区 SERP 请求：百度中国大陆简体中文 7 词、Bing 美国英语 4 词、Bing 中国大陆简体中文 7 词。授权费用上限 US$1，实际任务费用 **US$0.0304**。百度读取结果返回的 `cost` 是原任务费用展示，按官方“仅提交任务计费”说明计一次，不与读取再相加。

结论：继续巩固项目身份，下一批写两个可验收的小任务；外部稿按开发者 → 媒体与 V2EX → 知乎／公众号分层准备。`deepseek 波特` 不建专页。采样没有提供新的搜索量/KD，不用结果数量或新闻转载数推算需求。

## 来源和质量

| 来源                          | 地区与语言                                                                                | 实际获取                                            | 可以说明什么                           | 不能说明什么                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| Google / 已有共享研究         | 美国英语、新加坡简体中文，显式 location/language                                          | 复用当日 13 条 depth 10 SERP 与已有指标，不重复付费 | 当日查询意图及 provider 返回范围       | 十月热点搜索量；新加坡样本代表中国大陆             |
| Baidu / DataForSEO task queue | `2156` China、`zh-CN`、desktop/windows、depth 10、max crawl pages 1                       | 7/7 返回；排除助手推广卡用于内容判断                | provider 指定地区的页面/标题样本       | 所有中国用户的实时排序、自然点击或搜索量           |
| Bing / DataForSEO Live        | 美国 `2840/en` 4 词；中国 `2156/zh-CN` 7 词；desktop/windows、depth 10、max crawl pages 1 | 11/11 返回；其中 2 条 `deepseekbot` 隔离            | 其余 9 条有参数/时间记录的暂定市场样本 | 被隔离品牌词的可靠排名；未经质量审阅的自动排名结论 |
| Bing / 原生浏览器             | 请求 mkt/cc/setlang；浏览器出口 IP 地理服务判为日本东京                                   | 11 条当日人工快照                                   | 辅助辨认意图、核对项目身份             | 美国或大陆受控地区基线                             |
| Baidu / 原生浏览器            | 中文界面；浏览器出口日本                                                                  | 本轮先取得 2 条，后续遇浏览器连接/导航故障          | 部分人工内容核对                       | 后续失败查询没有结果、需求为零                     |
| VPS 出口检查                  | IP 地理服务判为新加坡                                                                     | 读取既有 SSH 路径；未改网络或服务                   | 解释普通 VPS 抓取的地域缺口            | 因从 VPS 发请求就自动是大陆搜索                    |
| Google Search Console         | 2026-09-10 至 2026-10-08，query/country/device，final                                     | 接入读取成功，0 rows                                | 当前窗口没有返回可用基线行             | 全站零流量、零需求，或刚上线页面表现               |

IP 地理服务是出口地域观察，不是绝对物理位置认证。DataForSEO 的地区由 provider 按请求市场采样，与我们本地/VPS 出口分开记录。现有 OpenSEO MCP 未暴露 Baidu/Bing 工具；本轮使用 VPS 既有 provider 配置做一次性请求，结果保存到共享报告。未增加运行连接器、调度或更改项目默认市场。

### 必须保留的异常

Bing 美国和中国的 `deepseekbot` 请求/返回关键词、location、language、check URL 都相符，但内容明显偏题，且与当日人工快照不一致。两条原始响应保存在私有工作记录，**不计入可靠品牌排名基线，也不收录其无关链接进公开 CSV**。不能将“HTTP/API 成功”当成内容有效，更不能据此报告项目掉排名。

其余 Bing 查询也与普通浏览器快照有差异；保存为 `provisional_market_sample`，后续相同 provider/参数复查才做可比判断。没有重新购买异常查询，也不把日本快照替代成中国/美国样本。结果未包含自有页面，只代表本次返回范围内未见，不能断言未收录。

百度 provider 的 `organic` 分类含助手推广、精选笔记和新闻入口等块。公开 CSV 排除识别到的助手推广，保留其余 provider 分类与原 rank_group/rank_absolute；不重新排成一个看似确定的自然排名。内容决策由人工审阅的实际页面类型决定。

## 七词的内容判断

| 候选词                | 本次及已有样本的可见意图                                                         | 内容动作                                                                                            |
| --------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `deepseekbot`         | 百度出现同名项目报道、其他 GitHub 产品；已有 Google/Bing 人工结果也含爬虫        | 官网/README 的 owner/repo/package 身份入口；保持已上线文案，观察后再决定修改                        |
| `deepseek bot`        | DeepSeek 本体、同名插件、旧聊天机器人与报道混合                                  | 安装身份辨认 + 现有直接对比；外部稿自然解释项目关系，不制造多个近似品牌页                           |
| `ds bot`              | 百度含同名报道、其他 DS 缩写/Bot；英文混有 Discord/DS 名称                       | 仅放竞品选型意图；精确辨认 FeiZhuLulu/DeepSeek-Bot 与 `ds-bot`，不把其他 owner 的仓库自动视为原项目 |
| `deepseek 波特`       | 百度主要落入哈利·波特、引用/幻觉相关内容；未形成 Bot 发音意图证据                | 留在观察池，当前不新建文章、不声明别名、不堆入标题                                                  |
| `deepseek 智能体团队` | 百度混入 DeepSeek 公司工具团队新闻；其他快照更偏 Harness/团队信息                | 用具体协作任务的长尾题目消歧：三来源简报、单函数测试交接。需求规模未知                              |
| `deepseek 智能体`     | DeepSeek/Harness 介绍、新闻和教程入口                                            | 以第一个可核查任务承接，复用安装/权限指南，不写空泛“智能体大全”                                     |
| `deepseek agent`      | 现有 Google/人工 Bing 偏框架与设置教程；本次 provider 返回 DeepSeek 本体等泛结果 | 英文先写实际 briefing / test-writing task；不声称 DeepSeekBot 等同官方 agent                        |

历史 Google 美国指标仍为：`deepseek agent` 390/KD21、`deepseek bot` 20/KD77、`ds bot` 20/KD1；最新趋势月为 2026-08，不是十月新品热度。其他候选、新加坡中文、百度/Bing 量与 KD 继续为 `unknown`。近似词的量不相加。

## 可审阅样本与测量范围

[CSV](serp-sample-2026-10-11.csv)保留 16 条未隔离查询中的 141 个 provider 分类行（已排除助手推广），包含市场、语言、设备、日期、质量状态和两种顺序。原始响应、内部任务 ID、服务连接值留在私有记录，不进入 GitHub。文件中部分页面 URL 本身带站点公开内容参数，不是本项目账号凭据。

这次是发布当日样本，没有“上线后增长”的结论。既定 2026-10-18 和 2026-11-08 复查分别看收录/曝光/可比排名、相关自然点击；安装点击只是意图，完成安装与完成任务无实际观测则为 `unknown`。外部平台的阅读、互动、referral 与 Google/Baidu/Bing 排名分开。

## 第一方方法来源

- [DataForSEO 地区支持](https://dataforseo.com/help-center/countries-and-locations-serp-api)：引擎分别支持自己的 location/language。
- [Bing Live Advanced](https://docs.dataforseo.com/v3/serp/bing/organic/live/advanced/)与[Bing 价格](https://dataforseo.com/pricing/serp/bing-organic-serp-api)。
- [Baidu task_post](https://docs.dataforseo.com/v3/serp/baidu/organic/task_post/)、[task_get](https://docs.dataforseo.com/v3/serp/baidu/organic/task_get/advanced/)与[Baidu 价格](https://dataforseo.com/pricing/serp/baidu-organic-serp-api)。
- [百度流量与关键词](https://ziyuan.baidu.com/keywords)：站点真实展现/点击需要站长平台权限，不能从公开 SERP 反推。

核验日期均为 2026-10-11。下一步最小测量动作是保留这份人工审阅样本与实际发布链接；未来自动 Baidu/Bing 连接器另立工程范围，优先加入 query/市场一致性、异常隔离与防重复计费，而非先启动周期抓取。
