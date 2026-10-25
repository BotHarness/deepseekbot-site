# Hero 与移动端内测入口：设计访谈

状态：两轮关键选择已确认，用户要求先落地查看效果；下方完整演示保留。Issue：[site #140](https://github.com/BotHarness/deepseekbot-site/issues/140)。

## 已明确的要求

- 保持 Tobs 的像素字体、像素角色、蓝／奶油色日间主题及夜间主题。
- 参考 Codync 的信息层级与图文构图，不复制其品牌、文案或产品承诺。
- 顶部提供 iOS TestFlight 入口，地址为 `https://testflight.apple.com/join/sA9EznXr`，点击沿用现有 PostHog 统计边界。
- Android 入口打开 popover，提供 Discord 和 QQ 两条申请路径：用户向开发者提供邮箱，开发者邀请加入内测；网站本身不新增邮箱收集表单。
- Hero 减少文字，操作按钮居左，展示现有真实产品画面。手机截图保留原始比例和完整机框；原生截图与 AI 宣传稿明确区分。
- 桌面安装入口研究「让 AI 帮我安装 / Ask your AI to set it up」：按当前网站语言复制完整的中文／英文指令，先识别是否已有 DSH 桌面版，再安装 Tobs Plugin。
- 使用同一基线、语言、主题和实际截图尺寸做 Before/After；不能把对比截图称为流量 A/B 实验。

## 实施前基线（历史记录）

- 网站基线：`087d5021788b561f0e099fcbcc4457167f9c992d`。
- 发布安装身份由 `content/install-release.json` 管理：`@botharness/tobs@1.5.2`；现有安装指南推荐 DSH `0.2.1-rc.3`。CLI 安装与桌面应用配置是不同的判断，不能从 npm CLI 已安装推断桌面应用已配置。
- 改版前 Hero 为居中文案、安装命令、说明及社区按钮，尚无直接移动端测试入口。
- 访谈前仅拍摄 Before：桌面实际1280×720、手机390×844，中文／英文、日间主题。源图片在 `.github/pr-assets/h140/`；当时未修改应用源代码。两轮确认后已恢复实施。
- 现有可复用的 iOS 原生截图来自独立 QA 场景；它们是历史 Simulator UI，不是当前商店包或本轮真机验收。

## 决策树

1. 首屏主张（Q1，已确定）
   - AI 团队 + 电脑／手机协同。
   - 加入基于 DeepSeek Harness 开源生态的背景说明。用户希望使用200k+ Stars量级；已通过官方 GitHub API 只读核对 `deepseek-ai/deepseek-harness` 为261289 Stars（2026-10-26），因此保守的200k+陈述有依据。必须明确该数字属于 DSH 上游，不属于 Tobs；链接到上游仓库。
2. 产品画面组合（Q2，已确定）
   - 桌面协作画面 + iPhone，支持 interaction demo。
   - 参考并复用现有 Hero 下方的 `LiveDemo` 以及能力区的 `FeatureDemos` 手机配对／聊天／审批演示。
   - 两端联动程度和下方区块保留方式见已完成的第二轮Q4/Q6。
3. AI 安装的完成边界（Q3，已确定）
   - DSH 桌面版 → 正确 Desktop Profile 中安装启用 Plugin → 打开 Bot 模式。
   - 模型配置、首条真实回复和手机配对不纳入本轮安装完成条件；可以作为后续引导。
   - 首版交付方式见已完成的第二轮Q5。
4. Hero演示行为（Q4，已确定）
   - 同一任务两端联动：桌面工作→手机批准→桌面完成。预设内容，不连接用户电脑或模型。
5. 安装首版交付（Q5，已确定）
   - 双语复制prompt + 已核对的分阶段桌面安装路径；本轮不制作或发布通用安装脚本。
6. 原桌面演示区块（Q6，已确定）
   - 用户要求先保留下方完整版，同时把演示复用到Hero查看效果；不删除原区块。

## 安装事实调查

独立研究子任务已只读核对官方 DSH 文档、发行版本和源码，没有安装软件、启动 Host、写入现有 Profile 或配置用户凭据。

研究证据保存在本轮任务的 `dsh-install-facts.md`。首要边界：普通 npm CLI 不能管理桌面拥有的 Desktop Profile；需要官方桌面插件管理界面，或在应用完全退出后使用定位到的桌面内置 CLI。官方下载页目前只公开macOS Apple Silicon和Windows x64，不能把未公开产物的平台自动包含在桌面安装承诺里。latest下载别名不等同于已经验证的版本；必须核实实际版本和兼容性。遇到系统安装、权限、初始化和关闭运行中应用步骤，助手要保留必要的用户参与；不能以关闭安全保护或改装到另一个Profile凑成成功。

来源：[官方下载](https://www.deepseek.com/harness/)、[固定上游Desktop文档](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/apps/desktop/README.md#bundled-command-runtime)、[上游仓库](https://github.com/deepseek-ai/deepseek-harness)。上述为文档／源码调查，没有跨平台实际安装验收。

## 文档边界

Bot、Memory、Plugin、Bundle、Profile 沿用现有产品和 DSH 定义，不为营销页面另造领域名词。当前没有需要修改 `CONTEXT.md` 的新领域概念。Hero 排版和 CTA 是可逆的界面选择，暂不创建 ADR；若后续选择长期维护跨平台安装脚本，再针对实际维护与兼容性取舍判断。

按 `grill-with-docs` 的访谈流程，回答将逐轮进入本记录；全部关键分支明确并由用户确认方案后，才恢复页面实施。

## 预览后的调整（2026-10-26）

- Hero 复用下方完整的精致桌面面板，保留导航、聊天列表与右侧资料；下方原演示继续保留。
- 去掉 Hero 的说明段落及辅助小字，只保留大标题、主要操作和上游生态出处。
- 顶部安装入口只写 iOS / Android，不追加 TestFlight / Beta。
- 手机宽度增加，外框保持 1320:2868 的 Max 屏幕比例，禁止非等比拉伸。
- 不再提供 Sync / Pair / App UI 三个开关。自动轮播顺序为桌面简单对话→配对→两端同步审批与完成，采用轻微淡入、滑动转场。用户开始操作后不再自动审批或循环切换；减少动态效果偏好禁用转场和循环。
- Hero 当前使用可交互的预设画面，不显示历史原生截图；界面标题标明交互演示。

- 最新导航调整：移除顶部 Avatar Studio；市场、Docs、Changelog、Blog 保留图标和文字，宽屏尽量单行，窄屏保留横向滚动。移动端按钮移到 Install 区标题下，iOS 白色、Android 绿 #3DDC84；统计 placement 同步改为 install。颜色参考 [Android 官方品牌指引](https://developer.android.com/distribute/marketing-tools/brand-guidelines)。

- 手机联动演示进一步对齐原生消息页：依据现有英文原生群聊截图及 `apps/mobile/src/ui/chat/{message-bubble,bubble-shape,speaker-row,header-chrome,composer-chrome.ios}.tsx` 和原生 palette，使用浮动返回圆钮／群标题胶囊、顶部自然淡出、蓝色人类气泡、浅灰 Bot 气泡、靠近气泡底边的头像及姓名、底部加号／输入框／实心麦克风。暗色使用相同的原生主题色。网页展示并非嵌入真实原生应用；麦克风和附件符号只展示界面，不请求设备权限。文字发送、返回列表／重进聊天及审批仍可交互，共用桌面演示状态。

- Sync 之后加入首页与 Activity 演示：底部 Chats／Activity／Settings 三项，首页展示两台电脑 Studio Mac／Research PC；同名 Bot 的标题行带颜色图标与环境名。依据 [移动端 PR #2838](https://github.com/BotHarness/DeepSeekBot/pull/2838) 的两张已授权公开 Android 截图（d4570028b312）对齐来源标识；它们不是本轮 iOS 验收。
- 未接管时自动顺序：同步聊天完成→全部聊天与多电脑→Activity→逐条演示允许两个来源的工具请求；用户点击或键盘进入后停止自动推进。手动可筛选电脑、切换底部三项、回聊天、允许／拒绝各条示例请求，操作不会连接真实电脑或执行命令。没有批量一键批准承诺。

- 当前聊天请求通过共享审批端口进入 Activity，处理结果回写同一份聊天答案；其他两个来源的预设请求以各自环境限定的请求 ID 保存。环境过滤也会显示当前范围；同名 Bot 的聊天、重播和点击统计保留环境身份。新增两项双语回归覆盖身份区分及原审批流程保留。

- 并排展示时，桌面窗口高度按手机当前宽度和1320:2868比例计算，比完整手机高32px；两者垂直居中，桌面上下各多16px。窄屏单设备展示保持原高度。
