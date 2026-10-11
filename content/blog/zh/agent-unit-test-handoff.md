---
{
  "title": "让 DeepSeekBot 给一个函数补测试：补丁通过，Windows 执行受阻",
  "description": "一次真实编码交接：审阅 DeepSeekBot 生成的九项测试，区分人工运行通过与原生沙箱失败，理解验收和授权边界。",
  "date": "2026-10-11",
  "tags": ["实测", "编码交接"]
}
---

让智能体帮忙改代码，先选一项你能看懂结果的小任务：为一个函数补测试。测试是具体的输入和预期结果，例如 `1:30` 应换算为 90 分钟，`24:00` 应被拒绝。

这次 DeepSeekBot 的 Assignment 生成了九项测试，人工在普通终端运行时全部通过。但 Bot 在 Windows 原生沙箱中执行同一命令失败，错误是 `spawn EPERM`。**生成补丁已验证；Bot 自己完成“修改—运行—回报”的闭环没有验证成功。**这两个结果需要同时看。

## 先准备一个可丢弃的演示仓库

本次 fixture 只有一个 `parseDuration` 函数：接受 `H:MM` 或 `HH:MM` 格式的字符串，范围为 `0:00` 到 `23:59`，返回整数分钟。非字符串或格式错误抛出 `TypeError`，时间越界抛出 `RangeError`。

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

授予工作区以后，原始请求要求：

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

上面是原始要求的简洁整理，完整验收事实见[证据清单](/task-evidence/2026-10-11/evidence.json)。[工作区授权指南](/docs/channel-sidebar/workspaces/)解释目录授权；给出路径不等于授予访问，工作区授权也不等于批准每一次工具操作。

这里的 Assignment 是 DeepSeekBot 的任务委派机制。本次只有一个 Bot 和一个编码 Assignment，没有运行多 Bot 团队实验，也没有测试 DSH 较新版本的实验性 Agent Teams 或 Git Worktrees 插件。

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">授权导览 · 01</span><strong>先看工作区授权，再交接代码任务</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关" tabindex="0"><svg viewBox="918 190 306 208" role="img" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关"><image href="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>文件夹授权有明确范围</strong><span>“添加文件夹”是授权入口；聊天里写路径不等于授权。</span></div><div><b>02</b><strong>区分范围与单次操作</strong><span>工作区可访问，不等于每个工具操作都已批准。图中开关未开启。</span></div></div>
<details class="evidence-detail"><summary>展开完整界面参考 · 1230 × 820</summary><a href="/guides/channel-sidebar/06-workspaces-zh.webp"><img src="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820" alt="隔离教程环境中的真实工作区授权界面，不是本次编码任务截图" loading="lazy" decoding="async"></a></details>
<figcaption>复用原生教程截图：DSH 0.2.0-rc.1 / deepseekbot 0.1.0-alpha.1，中文、深色主题，仅说明入口位置；不是本次 v1.2.0 编码结果，也未为配图新增授权。 <a href="/docs/channel-sidebar/workspaces/">阅读授权指南</a></figcaption>
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

这些断言检查固定契约；九项通过不能证明整个项目没有 bug，也没有测到覆盖率、模糊测试或变异测试结果。

## 运行结果：分别记录 Bot 与人工

原生工具最初在 Windows 目录权限初始化阶段失败。经人工批准，对两处临时测试目录使用 DSH 自带脚本备份并补充当前用户 FullControl 后，原命令可以启动，但 Node 测试运行器创建子进程时仍失败：

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

工具返回本身没有报传输错误，不代表测试通过；退出码和测试输出才是这一步的结果。

DSH 的恢复流程随后尝试逆序回滚。memory 目录恢复校验发现 ACL 与备份不一致，流程停止；fixture 的恢复尚未执行。两处都是临时测试范围，测试 Host 已停止。本次没有继续加权限、修改所有者、改变继承或绕过沙箱。

任务期间 Bot 还额外写了一个权限探针文件，违反了“只修改测试文件”的要求。人工保留记录并清理该文件。这个偏差也影响验收，不能只看最终 diff 就宣称全程遵守范围。

人工在普通终端对生成的测试文件另行运行同一命令：

```text
tests 9
pass 9
fail 0
exit code 0
```

[下载完整人工运行日志](/task-evidence/2026-10-11/operator-test-output.txt)。这是已知演示代码的人工复核，执行环境与 Bot 原生沙箱不同；它没有修复 Bot 的失败，也不是 Bot 自己完成了测试。

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

这次适合拿来学习如何审阅补丁和区分阶段结果；如果你需要 Bot 无人值守完成编码交付，本次 Windows 结果还达不到这个要求。它也不能证明 DeepSeekBot 比 Grok Bot、Cue 或其他产品更快、更稳。

自托管仍需要安装与更新、宿主在线、Node/Git 环境和模型额度。三来源简报与本次任务及诊断共用 US$1 DeepSeek API 上限，22 次请求估算约 US$0.0197；不是单函数任务的固定价格或实际账单。下一步可以先完成[三来源简报](/blog/first-agent-briefing/)，或阅读[安装指南](/docs/installation/)和[任务 Session 指南](/docs/channel-sidebar/sessions/)。
