---
{
  "title": "让 DeepSeekBot 给一个函数补测试：补丁通过，Windows 执行受阻",
  "description": "让 DeepSeekBot 为一个函数新增八项测试，检查实际补丁和日志：人工终端九项通过，Windows 原生沙箱仍报 spawn EPERM。",
  "date": "2026-10-11",
  "tags": ["实测", "编码交接"]
}
---

评估智能体的编码交付，可以先让它给一个函数补测试。每项测试都有明确输入和预期，例如把 `1:30` 换算为 90 分钟，或拒绝 `24:00`，你能逐条检查它测了什么。

DeepSeekBot 保留原有一项测试，新增八项；人工在普通终端运行九项全过，函数实现未改。Bot 自己在 Windows 原生沙箱中运行同一命令却报 `spawn EPERM`。**补丁通过了人工审阅和运行，Bot 的自主执行仍失败。**验收时要把这两步分别记录。

## 先准备一个可丢弃的演示仓库

演示仓库（fixture）只有一个 `parseDuration` 函数：接受 `H:MM` 或 `HH:MM` 格式的字符串，范围为 `0:00` 到 `23:59`，返回整数分钟。非字符串或格式错误抛出 `TypeError`，时间越界抛出 `RangeError`。

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

仓库起点只有一项普通输入测试；隔离分支为 `bot/add-duration-tests`，起始 commit 为 `6f89c3d`。这个 commit 是本次演示仓库的本地起点，不是一个公开产品版本。可复现的初始文件在[fixture 源码](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture)，采用 MIT 许可。

没有交给它生产仓库、客户文件或账户凭据，也没有要求提交 commit、推送、创建 PR 或合并。

## 用一个 Assignment 交接，写清楚范围

本次使用 DeepSeekBot v1.2.0 发布标签的[源码 checkout](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)，DSH 0.2.0-rc.1、Windows 隔离 Profile，模型为 `deepseek-official/deepseek-flash`。没有启用可选 Computer/Browser，也不是 npm 安装包资格验证。

Assignment 是 DeepSeekBot 委派的独立任务，保留自己的 Session 与报告。本次只运行一个 Bot 的一项编码 Assignment。授予演示工作区后，请求明确限定了修改范围：

```text
使用一个 Assignment 执行。先读演示 fixture 的文件与现有测试。
只修改 duration.test.mjs，保留原测试，增加普通输入、0:00、23:59、
分钟/小时越界、非字符串和格式错误的测试。
发现实现 bug 只报告，不修改函数。
运行 node --test duration.test.mjs。
交回实际 diff、完整命令、退出码、输出和未核验部分。
不安装依赖、不联网、不推送、不提交、不改分支或其他文件。
只在当前私人 DM 回报。
```

上面是原始要求的简洁整理，验收记录见[证据清单](/task-evidence/2026-10-11/evidence.json)。Workspace Grants（工作区授权）决定目录访问范围：聊天里给出路径并未授予访问，目录授权也不等于批准每次工具操作。详见[授权指南](/docs/channel-sidebar/workspaces/)。

本次没有运行多 Bot 团队实验，也未测试 DSH 的实验性 Agent Teams 或 Git Worktrees 插件。

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">授权导览 · 01</span><strong>找到授权入口，核对访问范围</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关" tabindex="0"><svg viewBox="918 190 306 208" role="img" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关"><image href="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>文件夹授权有明确范围</strong><span>“添加文件夹”是授权入口；聊天里写路径不等于授权。</span></div><div><b>02</b><strong>区分范围与单次操作</strong><span>目录访问与单次工具操作的批准是两件事；图中的广泛文件访问开关未开启。</span></div></div>
<details class="evidence-detail"><summary>展开完整界面参考 · 1230 × 820</summary><a href="/guides/channel-sidebar/06-workspaces-zh.webp"><img src="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820" alt="隔离教程环境中的真实工作区授权界面，不是本次编码任务截图" loading="lazy" decoding="async"></a></details>
<figcaption>原生教程截图，中文、深色主题：DSH 0.2.0-rc.1 / deepseekbot 0.1.0-alpha.1。仅作授权界面导览，不是本次 v1.2.0 任务结果；没有为配图新增授权。 <a href="/docs/channel-sidebar/workspaces/">阅读授权指南</a></figcaption>
</figure>

## 补丁增加了什么

Bot 保留原测试，新增八项；总计九项测试：

| 覆盖范围 | 例子 | 预期 |
| --- | --- | --- |
| 普通输入与整数结果 | `0:45`、`12:05`、`2:15` | 正确分钟数，返回整数 |
| 上下边界 | `0:00`、`00:00`、`23:59` | 0 或 1439 |
| 分钟和小时越界 | `0:60`、`24:00`、`99:00` | `RangeError` |
| 非字符串 | 数字、null、对象、数组 | `TypeError` |
| 格式错误 | 缺位、空格、负号、小数、全角数字 | `TypeError` |

可以下载[实际补丁](/task-evidence/2026-10-11/duration-tests.patch)和[完整测试文件](/task-evidence/2026-10-11/duration.test.mjs.txt)。函数实现没有改动。人工核对了契约、断言和新增范围，未修改生成的测试代码。

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">补丁细读 · 02</span><strong>把边界值写成可检查的断言</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>原有一项，新增八项</span></div><div><strong>duration.test.mjs</strong><span>函数实现未修改</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">生成文件原文节选</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>下边界包含两种格式</strong><span>0:00 与 00:00 都应返回 0。</span></div><div><b>02</b><strong>上边界有明确预期</strong><span>23:59 应返回 1439；越界输入另有错误类型断言。</span></div></div>
<figcaption>这是原始生成代码的排版节选，不是 IDE 截图或新的运行结果。 <a href="/task-evidence/2026-10-11/duration.test.mjs.txt">完整测试文件</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">实际 diff</a></figcaption>
</figure>

这些断言针对固定函数契约。九项通过说明它们在人工终端中通过了检查，不能推出整个项目没有 bug；本次没有测量覆盖率，也没有做模糊测试或变异测试。

## 运行结果：分别记录 Bot 与人工

原生工具最初在 Windows 目录权限初始化阶段失败。经人工批准，对两处临时测试目录使用 DSH 自带脚本备份并补充当前用户 FullControl 后，原命令可以启动，但 Node 测试运行器创建子进程时仍失败：

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

检查工具结果时，要读命令的退出码和输出；工具成功返回结果，并不意味着其中的测试命令成功。

随后按 DSH 流程逆序恢复目录权限。memory 目录的 ACL 校验与备份不一致，流程因此停止，fixture 目录尚未恢复。两处都在临时测试范围内，测试 Host 已停止；没有继续扩大权限或绕过沙箱。

任务期间，Bot 还额外写了一个权限探针文件，违反“只修改测试文件”的要求。人工保留记录并清理了该文件。因此，审阅最终 diff 时还要检查过程中的额外写入，不能把干净补丁当作全程遵守范围的证明。

人工在普通终端对生成的测试文件另行运行同一命令：

```text
tests 9
pass 9
fail 0
exit code 0
```

[下载完整人工运行日志](/task-evidence/2026-10-11/operator-test-output.txt)。这次复核发生在普通终端中，确认生成的测试在那里通过；Bot 原生沙箱的失败仍未解决。

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">结果分开看 · 03</span><strong>同一命令，两个执行环境</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">Bot 原生沙箱 · 失败</span><strong>spawn EPERM</strong><p>退出码 1；未完成自主执行。</p></div><div><span class="evidence-status">人工普通终端 · 通过</span><strong>9 / 9</strong><p>九项通过、零失败，退出码 0。</p></div></div>
<figcaption>按实测记录整理的结果说明，不是终端截图。人工通过不能替代 Bot 执行；额外探针文件与 ACL 回滚校验失败仍影响验收。 <a href="/task-evidence/2026-10-11/operator-test-output.txt">人工完整日志</a> · <a href="/task-evidence/2026-10-11/evidence.json">实测清单</a></figcaption>
</figure>

## 你该如何验收下一次交接

把“完成”拆成几个能检查的结果：

1. **改了什么：** 看 diff，也检查有没有额外文件；函数和生产目录是否保持在约定范围。
2. **测了什么：** 对照契约阅读断言；普通、边界与错误输入各自检查什么。
3. **在哪里运行：** 要求命令、退出码、完整日志和执行环境；生成代码与成功运行是不同阶段。
4. **失败怎么办：** 保留首个错误和人工修正记录。操作系统拒绝不能靠不断加权限来证明任务成功。

准备在自己的代码里试用时，先给出一段有明确契约、可复核的小任务，再分别检查 diff、额外文件与实际运行日志。本次 Windows 结果还不能满足无人值守交付要求，也不足以比较 DeepSeekBot 与 Grok Bot、Cue 等产品的速度或可靠性。

自托管仍需要安装与更新、宿主在线、Node/Git 环境和模型额度。三来源简报与本次任务及诊断共用 US$1 DeepSeek API 上限，22 次请求估算约 US$0.0197；不是单函数任务的固定价格或实际账单。下一步可以先完成[三来源简报](/blog/first-agent-briefing/)，或阅读[安装指南](/docs/installation/)和[任务 Session 指南](/docs/channel-sidebar/sessions/)。
