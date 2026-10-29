---
{
  "title": "让 DeepSeekBot 给一个函数补测试：补丁通过，Windows 执行受阻",
  "description": "让 DeepSeekBot 给一个小函数补测试：新增八项测试，本地运行全部通过，但 Bot 自己在 Windows 沙箱里卡在了进程权限上。分享这次代码交接的真实过程与经验。",
  "date": "2026-10-11",
  "tags": [
    "实测",
    "编码交接"
  ]
}
---

在把一整个代码仓库交给智能体之前，我们决定先从一个小函数试起：把 `1:30` 这样的时间字符串换算成分钟数。它的规则足够简单，测试写得对不对，我们一眼就能看明白。

这次实测主要想看两件事：DeepSeekBot 能不能补齐容易遗漏的边界情况，以及它能不能自己把测试跑通？结果喜忧参半。它保留了原有测试，一口气补上了八项新测试，也没有乱动原函数；我们在终端里手动运行时，九项测试全部通过。不过，Bot 自己在 Windows 沙箱里跑测试时却因为权限问题卡住了，最后还是得由人来接手收尾。

## 先交一个规则清楚的小任务

演示项目里只有一个 `parseDuration` 函数。它接收 `H:MM` 或 `HH:MM` 格式的字符串，有效范围从 `0:00` 到 `23:59`，返回对应的总分钟数：

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

项目原本只有一项最普通的输入测试。我们把这个[演示项目](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture)放在单独的分支里，在工作区授权中允许 Bot 访问所在文件夹，然后给它派发了一项独立任务（Assignment）：补充测试用例、保留已有内容、不修改原函数，如果发现实现有问题就直接报告。

如果你也想用任务功能（Assignment）派发类似的工作，可以这样写要求：

```text
请先读 duration.mjs 和已有测试，只修改 duration.test.mjs。
保留原来的测试，补充普通输入、最小值、最大值、越界和格式错误。
如果发现函数有 bug，请报告，不要改函数。
运行 node --test duration.test.mjs，告诉我改了什么和运行结果。
不要安装依赖、联网、提交、推送或修改其他文件。
```

有一点很实用：在聊天里直接发文件路径，Bot 是读不到的。需要先在右侧的“工作区授权”里添加目标文件夹，遇到敏感操作时再逐项确认。

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">交任务之前 · 01</span><strong>先选好允许访问的文件夹</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关" tabindex="0"><svg viewBox="918 190 306 208" role="img" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关"><image href="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>添加演示文件夹</strong><span>在“添加文件夹”里选择这次要用的目录。</span></div><div><b>02</b><strong>看清每一次操作</strong><span>授权文件夹之后，涉及执行的动作仍可以按需确认。</span></div></div>
<details class="evidence-detail"><summary>查看完整界面</summary><a href="/guides/channel-sidebar/06-workspaces-zh.webp"><img src="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820" alt="工作区授权界面示意图" loading="lazy" decoding="async"></a></details>
<figcaption>工作区授权面板示意；具体操作可参考<a href="/docs/channel-sidebar/workspaces/">工作区授权指南</a>。</figcaption>
</figure>

## 新增的八项测试，补上了哪些盲区

Bot 在保留原有测试的基础上新增了八项测试，一共九项。我们仔细读了一遍生成的代码，没有做任何手动修改，原函数也确实分毫未动。

| 输入 | 期待的结果 |
| --- | --- |
| `0:45`、`12:05`、`2:15` | 正确的整数分钟数 |
| `0:00`、`00:00`、`23:59` | 边界值 0 或 1439 |
| `0:60`、`24:00`、`99:00` | 时间越界错误（`RangeError`） |
| 数字、null、对象、数组 | 类型错误（`TypeError`） |
| 缺位、空格、负号、小数、全角数字 | 格式错误（`TypeError`） |

这组用例设计得很扎实。平时手写测试很容易只测几个正常数字，而把上下边界和五花八门的错误输入列出来，才真正检验了函数的契约。下面这两段代码就把最小值和最大值测得很清楚：

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">新增测试 · 02</span><strong>把上下边界写清楚</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>原有一项，新增八项</span></div><div><strong>duration.test.mjs</strong><span>函数实现未修改</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">新增测试节选</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>兼顾两种零点写法</strong><span>0:00 与 00:00 都应返回 0。</span></div><div><b>02</b><strong>明确一天内的上限</strong><span>23:59 应返回 1439；越界输入则由专门的错误断言覆盖。</span></div></div>
<figcaption>新增测试中的边界用例。<a href="/task-evidence/2026-10-11/duration.test.mjs.txt">完整代码</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">查看改动</a></figcaption>
</figure>

## 代码写对了，但在运行这一步卡了壳

轮到 Bot 自己在 Windows 沙箱里跑测试时，问题来了。先是临时目录权限受限，而在我们调整了临时目录权限之后，`node --test` 创建子进程依然报错：

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

为了确认它写的测试到底能不能跑通，我们在普通终端里手动执行了同一条命令，结果九项测试全部通过。也就是说，测试代码本身没问题，只是卡在了 Bot 的 Windows 沙箱执行环境上。

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">运行结果 · 03</span><strong>测试写好了，但沙箱执行受阻</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">Bot 运行 · 失败</span><strong>spawn EPERM</strong><p>沙箱内未能拉起子进程，退出码 1。</p></div><div><span class="evidence-status">本地手动运行 · 通过</span><strong>9 / 9</strong><p>九项全部通过，退出码 0。</p></div></div>
<figcaption>同一份测试文件，在 Bot 的 Windows 沙箱里报错，在普通终端里顺利通过。<a href="/task-evidence/2026-10-11/operator-test-output.txt">查看手动运行日志</a>。</figcaption>
</figure>

过程中还有一个值得留意的细节：Bot 为了排查权限问题，自己在目录里额外写了一个诊断文件，越过了“只修改测试文件”的指令。我们在保留记录后删掉了这个文件。收尾恢复环境时，由于目录权限校验与备份不一致，我们停下了恢复脚本并关闭了测试环境，相关过程都留在了[详细记录](/task-evidence/2026-10-11/evidence.json)里。

## 下次交接代码任务，我们会重点看这三件事

这次实测让我们深刻体会到，“把代码写出来”和“把任务完整跑通”是两码事。交给智能体写代码时，养成固定的验收习惯能省下不少麻烦：

1. **先看改动范围。** 除了目标测试文件，它有没有顺手改动原函数，或者留下临时的排查脚本？
2. **再看测试质量。** 新增的用例是真的覆盖了边界与异常，还是只换了几个普通参数？
3. **最后看运行结果。** 测试究竟是在哪个环境里跑通的？如果沙箱卡住了，及早人工接手往往比让它反复重试更省心。

先从一个规则简单的小函数开始，就能很直观地摸清智能体的脾气：知道它擅长写什么、容易在哪里越界，以及什么时候该由你接过键盘。

如果你也想试试把日常工作交给 Bot，可以先看[用三份资料做简报的实测经历](/blog/first-agent-briefing/)。还没安装的话，不妨从[安装指南](/docs/installation/)和[任务指南](/docs/channel-sidebar/sessions/)开始上手。

<details class="evidence-detail"><summary>查看运行环境和原始文件</summary>

本次实测使用 DeepSeekBot v1.2.0 [源码版本](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)、DSH 0.2.0-rc.1 与 Windows 隔离环境，模型为 `deepseek-official/deepseek-flash`。演示分支为 `bot/add-duration-tests`（起点提交 `6f89c3d`）。

简报、补测试和权限排查合计调用 22 次 DeepSeek API，估算费用约 US$0.0197。

[原始补丁](/task-evidence/2026-10-11/duration-tests.patch) · [完整测试代码](/task-evidence/2026-10-11/duration.test.mjs.txt) · [手动运行日志](/task-evidence/2026-10-11/operator-test-output.txt) · [完整运行记录](/task-evidence/2026-10-11/evidence.json) · [截图来源](/blog-figures/first-task/provenance.json)

</details>
