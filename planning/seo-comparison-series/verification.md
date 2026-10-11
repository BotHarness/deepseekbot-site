# 首篇总览的事实与交付核验

核验日期：2026-10-11。用户已确认 Q11 共同方案；首篇为资料对比，无统一产品实测、性能排名或已测得的搜索指标。

## SEO 记录

- 主关键词：`personal AI agents comparison`；英文市场优先，中文镜像。
- 首篇：`/en/blog/personal-ai-agents-comparison/` 与 `/blog/personal-ai-agents-comparison/`。
- 搜索量、KD、初始排名：unknown。普通网页检索不等于完成受控 SERP 或关键词测量。
- 复用博客、模板和自动入口，不添加 Compare 导航；既有 Grok、Telegram、权限文章不改。
- PR 是待审核的交付。本文尚未合并、部署或进入 SEO observing；部署后才按站点流程记录基线和七天观察日期，不自行创建定时任务。

## DeepSeekBot 正式包

实际读取 [npm registry 的 1.2.0 元数据](https://registry.npmjs.org/deepseekbot/1.2.0)及[发布包](https://registry.npmjs.org/deepseekbot/-/deepseekbot-1.2.0.tgz)内的 package.json、README.md 与插件装配入口。

- 1.2.0 是核验时的 latest，发布时间 2026-10-08T19:12:05.981Z。
- Core/Client 1.2.0、IM Provider 4.32.0-botharness.15；MIT、Node.js >=22、DSH >=0.2.0-rc.1 <0.3.0-0。
- 包含身份、Git 记忆、Assignment、定时任务和飞书/Slack/Discord/个人微信接入。
- 不包含 Computer/Browser Bundles；源码指南中的 macOS 电脑、浏览器目标不可写成默认安装能力。
- 站点 capabilities/安装等旧文档仍有 1.1.0 提示，本 PR 不扩大版本同步范围；正文链接这些指南时提示读者留意版本。

## 竞品事实来源

| 产品         | 核验来源与结论边界                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grok Bot     | [总览](https://docs.x.ai/grok-bot/overview)、[电脑与应用](https://docs.x.ai/grok-bot/computer-and-apps)、[技能与 routine](https://docs.x.ai/grok-bot/skills-routines-and-automations)、[审批与本地执行](https://docs.x.ai/grok-bot/approvals-security-and-privacy)：用户账号下共享云电脑；本地 Mac/Windows 命令需另外授权。资格按当前付费 Cursor/关联 SuperGrok 条件，不照抄发布周 beta 价格。                                                 |
| Meta Muse    | [公告](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)、[设计](https://introducing.muse.ai/)、[安全设计](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)：美国 rollout、专属 VM、记忆与跟进、Linux shell、产物和宿主检查。未来 confidential VM 计划不写成当前隐私保证。                                                                                                         |
| Manus Cue    | [Manus 2.0 公告](https://www.manus.im/blog/introducing-manus-2-0)、[帮助文档](https://help.manus.im/en/articles/17190150-what-is-new-in-manus-2-0)、[Agent API 概念](https://open.manus.im/docs/v2/agents-overview)：独立应用、身份、持续主任务、团队交接、定时和邀请。Manus 本体的 Studio/GameDev 等不自动归给 Cue；可比的仓库补丁流程未核验。                                                                                                |
| ChatGPT Dots | [产品入口](https://learn.chatgpt.com/docs/dots)、[任务与记忆](https://learn.chatgpt.com/docs/dots/tasks-and-memory)、[电脑与应用](https://learn.chatgpt.com/docs/dots/computers-and-apps)、[控制](https://learn.chatgpt.com/docs/dots/controls)、[10 月 9 日更新](https://learn.chatgpt.com/docs/whats-new/dots-october-9-2026)：云环境与本地连接区分、Work/Codex 交接、持续任务、权限及地区/套餐条件。不是普通 ChatGPT agent 或 Work 的改名。 |

视频来源和利益披露见 [video-evidence.md](./video-evidence.md)。共九条原始描述/章节，不声称取得完整字幕、看完全部视频或复现作者结果。

## 交付检查

- `pnpm verify`：36 项测试通过，format、lint、typecheck 与 build 通过。现有 lint 未使用参数提示与构建包体积提示仍在，未扩展修复范围。
- 构建页：双语单一 H1、title/description、自 canonical、三个 hreflang、对应封面、sitemap 两条路径、博客入口与站内链接目标核验。
- 真实 Playwright 截图：构建产物的双语桌面 1440×900、中文手机 390×844、英文深色编码段和博客入口；无横向溢出或破损图片。
- 实际生产 Before：新路径尚未生成，站点回退到首页，HTTP 200，而非 404。截图记录真实缺席状态，不伪造 404，也不扩大到修改路由回退。
- 封面 1200×630 通过现有管线生成。长英文标题曾导致标签与头像重叠，生成脚本增加按实际元素边界缩小标题字号的处理；旧封面未重新提交。
- 原始 npm 包、视频缓存、临时 QA 脚本和日志仅留本地；提交正文、封面、共同方案、来源记录与 PR 截图。
