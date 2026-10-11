---
{
  "title": "让 DeepSeekBot 给一个函数补测试：补丁通过，Windows 执行受阻",
  "description": "让 DeepSeekBot 给一个小函数补测试：新增八项，手动运行九项全过，Bot 自己却没跑通。分享代码、过程和下一次会检查的事。",
  "date": "2026-10-11",
  "tags": [
    "实测",
    "编码交接"
  ]
}
---

给智能体一整个仓库之前，我们先挑了一个小函数：把 `1:30` 这样的时间字符串换算成分钟。它的规则简单，测试有没有写对，我们也能自己看明白。

这次想知道的是：DeepSeekBot 能补出哪些容易遗漏的例子，又能不能把测试跑起来？结果有两面。它保留原有测试，新增八项，函数没改；我们手动运行时九项全过。但 Bot 自己在 Windows 沙箱里运行失败，最后仍需要人工接手。

## 给它一个小而清楚的任务

演示项目只有一个 `parseDuration` 函数。它接受 `H:MM` 或 `HH:MM`，有效范围从 `0:00` 到 `23:59`，返回总分钟数：

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

原来只有一项普通输入测试。我们把这个[演示项目](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture)放在单独的分支里，允许 Bot 访问它所在的文件夹，再交任务：补充测试，保留已有内容，不改函数。遇到实现问题就报告。

用 DeepSeekBot 的任务功能（Assignment）交出去时，可以这样整理要求：

```text
请先读 duration.mjs 和已有测试，只修改 duration.test.mjs。
保留原来的测试，补充普通输入、最小值、最大值、越界和格式错误。
如果发现函数有 bug，请报告，不要改函数。
运行 node --test duration.test.mjs，告诉我改了什么和运行结果。
不要安装依赖、联网、提交、推送或修改其他文件。
```

聊天里提到一个路径，还不等于 Bot 能读取它。先在工作区授权里选好文件夹，后续操作如果需要确认，再逐项查看。

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">交任务之前 · 01</span><strong>先选好允许访问的文件夹</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关" tabindex="0"><svg viewBox="918 190 306 208" role="img" aria-label="工作区授权面板：Memory Repository、添加文件夹与新事项允许所有文件访问开关"><image href="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>添加演示文件夹</strong><span>在“添加文件夹”里选择这次要用的目录。</span></div><div><b>02</b><strong>看清每一次操作</strong><span>允许访问文件夹后，具体操作仍可能需要你确认。</span></div></div>
<details class="evidence-detail"><summary>查看完整界面</summary><a href="/guides/channel-sidebar/06-workspaces-zh.webp"><img src="/guides/channel-sidebar/06-workspaces-zh.webp" width="1230" height="820" alt="隔离教程环境中的真实工作区授权界面，不是本次编码任务截图" loading="lazy" decoding="async"></a></details>
<figcaption>教程中的工作区授权界面；不同版本的布局可能略有差异。<a href="/docs/channel-sidebar/workspaces/">查看操作指南</a>。</figcaption>
</figure>

## 新增的测试，补上了哪些遗漏

Bot 保留原有一项，新增八项，总计九项。我们读过生成的代码，没有再手改测试，也没有修改函数实现。

| 输入 | 期待的结果 |
| --- | --- |
| `0:45`、`12:05`、`2:15` | 正确的整数分钟数 |
| `0:00`、`00:00`、`23:59` | 0 或 1439 |
| `0:60`、`24:00`、`99:00` | 时间越界错误（`RangeError`） |
| 数字、null、对象、数组 | 类型错误（`TypeError`） |
| 缺位、空格、负号、小数、全角数字 | 格式错误（`TypeError`） |

这些例子也提醒了我们：补测试时，不能只换几个正常数字。看看最小值、最大值，以及用户可能输错的内容，更容易发现遗漏。下面两个新增测试，就把上下边界写得很清楚。

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">新增测试 · 02</span><strong>先看最小值和最大值</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>原有一项，新增八项</span></div><div><strong>duration.test.mjs</strong><span>函数实现未修改</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">新增测试节选</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>下边界包含两种格式</strong><span>0:00 与 00:00 都应返回 0。</span></div><div><b>02</b><strong>上边界有明确预期</strong><span>23:59 应返回 1439；越界输入另有错误类型断言。</span></div></div>
<figcaption>新增测试中的两个例子。<a href="/task-evidence/2026-10-11/duration.test.mjs.txt">完整代码</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">查看改动</a></figcaption>
</figure>

## 到运行这一步，出了问题

Bot 在 Windows 沙箱中运行测试时，遇到了目录权限问题。我们处理过临时目录的权限后，测试运行器创建子进程仍然失败：

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

为了确认生成的测试能否运行，我们在普通终端里手动执行同一条命令，九项全部通过。这个结果说明测试在那次手动运行中通过了，Bot 的执行问题仍然没有解决。

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">运行结果 · 03</span><strong>写出来了，但 Bot 没跑通</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">Bot 运行 · 失败</span><strong>spawn EPERM</strong><p>测试命令未能完成，退出码 1。</p></div><div><span class="evidence-status">我们手动运行 · 通过</span><strong>9 / 9</strong><p>九项通过、零失败，退出码 0。</p></div></div>
<figcaption>同一份测试，在 Bot 的 Windows 沙箱里失败，在普通终端里通过。<a href="/task-evidence/2026-10-11/operator-test-output.txt">查看手动运行日志</a>。</figcaption>
</figure>

过程中还有一个容易忽略的插曲：Bot 额外写了一个排查权限的文件，超出了“只修改测试文件”的要求。我们保留记录后删除了它。清理测试环境时，目录权限也没有完整恢复到备份状态，因此停止了修复，测试服务也已关闭。[详细记录](/task-evidence/2026-10-11/evidence.json)保留了这些问题。

## 下次交任务，我们会检查这三件事

这次经历让我们把“代码写出来了”和“任务完成了”分开看。新增测试可以逐项审阅，但运行环境、额外写入和失败处理也会影响最后的结果。

1. **先看改动。** 除了测试文件，还碰了什么？原函数有没有被改？
2. **再看测试。** 每个输入为什么值得测，期待的结果是否符合函数规则？
3. **最后看运行。** 谁在哪个环境里运行了命令，日志是否真的显示通过？

九项通过还回答不了整个项目有没有 bug。对第一次尝试来说，一个规则清楚的小函数已经能让你看到智能体写了什么、漏了什么，以及哪里需要自己接手。

想从整理资料开始，可以看看[三份资料做简报的经历](/blog/first-agent-briefing/)。还没安装的话，先读[安装指南](/docs/installation/)；具体任务操作见[任务指南](/docs/channel-sidebar/sessions/)。

<details class="evidence-detail"><summary>查看运行环境和原始文件</summary>

本次使用 DeepSeekBot v1.2.0 的[源码版本](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea)，DSH 0.2.0-rc.1，Windows 隔离环境，模型为 `deepseek-official/deepseek-flash`。没有启用桌面或浏览器操作组件，也没有使用生产仓库。演示分支为 `bot/add-duration-tests`，起点为本地提交 `6f89c3d`。

两处临时目录的权限处理使用了 DSH 脚本并事先备份。恢复时，记忆目录的权限校验与备份不符，流程停止，演示目录尚未恢复。测试服务保持关闭，未继续扩大权限。

简报、补测试和排查问题合计 22 次 DeepSeek API 请求，费用估算约 US$0.0197，不是这项任务的单独价格。

[原始补丁](/task-evidence/2026-10-11/duration-tests.patch) · [完整测试代码](/task-evidence/2026-10-11/duration.test.mjs.txt) · [手动运行日志](/task-evidence/2026-10-11/operator-test-output.txt) · [完整运行记录](/task-evidence/2026-10-11/evidence.json) · [截图来源](/blog-figures/first-task/provenance.json)

</details>
