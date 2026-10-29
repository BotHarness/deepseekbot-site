---
{
  "title": "A DeepSeekBot test-writing handoff: passing patch, blocked Windows execution",
  "description": "DeepSeekBot added eight unit tests to a small function. All nine passed in our terminal, while its own Windows sandbox run hit a permissions wall. Here is what we learned.",
  "date": "2026-10-11",
  "tags": [
    "Hands-on",
    "Coding handoff"
  ]
}
---

Before handing an agent an entire repository, we started with a single function: convert a time string like `1:30` into total minutes. The rules are simple enough that we can read the generated tests and judge the work at a glance.

We wanted to see which edge cases DeepSeekBot would think of, and whether it could run the test suite on its own. The result was a split decision. It kept the original test, added eight well-structured new ones, and left the implementation untouched. When we ran the suite in a regular terminal, all nine passed. Inside the Bot’s own Windows sandbox, however, child-process permissions blocked the test runner—so a human still had to step in at the end.

## Start with a small, well-defined task

Our demo project contains a single `parseDuration` function. It accepts `H:MM` or `HH:MM` strings from `0:00` to `23:59` and returns the total minutes:

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

Initially, the project had just one happy-path test. We placed the [demo project](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture) on its own branch, granted the Bot access to the folder, and handed it an Assignment: expand the test suite, keep the existing test, leave the function itself alone, and report any bugs it found.

Here is the prompt we used for the Assignment:

```text
Read duration.mjs and the existing tests. Change only duration.test.mjs.
Keep the original test and add normal inputs, minimum and maximum values,
out-of-range values and malformed inputs.
Report any function bugs without changing the implementation.
Run node --test duration.test.mjs and report the changes and result.
Do not install dependencies, browse, commit, push or change other files.
```

One practical tip: simply mentioning a file path in chat does not grant the Bot access to it. You first select the folder in Workspace Grants, and then approve specific operations as needed.

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">BEFORE THE TASK · 01</span><strong>Choose which folder the Bot can access</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="English sidebar controls" tabindex="0"><svg viewBox="2250 1240 620 300" role="img" aria-label="English sidebar showing Sessions, Bot Inbox, Schedules and Workspace Grants"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>Grant folder access</strong><span>Open Workspace Grants in the sidebar to choose which directories the Bot can read and edit.</span></div><div><b>02</b><strong>Review operations</strong><span>Granting folder access still lets you review individual commands when needed.</span></div></div>
<details class="evidence-detail"><summary>View the full interface</summary><a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot interface showing Workspace Grants in the right sidebar" loading="lazy" decoding="async"></a></details>
<figcaption>Workspace Grants in the right sidebar. <a href="/en/docs/channel-sidebar/workspaces/">See the setup guide</a>.</figcaption>
</figure>

## What the new tests covered

The Bot kept the original test and added eight more, bringing the total to nine. We reviewed the generated code directly—no manual tweaks to the test file, and no changes to the function implementation.

| Input | Expected result |
| --- | --- |
| `0:45`, `12:05`, `2:15` | Correct integer minutes |
| `0:00`, `00:00`, `23:59` | Boundary values 0 or 1439 |
| `0:60`, `24:00`, `99:00` | Out-of-range error (`RangeError`) |
| Numbers, null, objects, arrays | Type error (`TypeError`) |
| Missing digits, spaces, signs, decimals, full-width digits | Format error (`TypeError`) |

It is a solid set of cases. When writing tests by hand, it is easy to stop after a few ordinary numbers. Testing the exact lower and upper boundaries alongside realistic bad inputs is what actually exercises the function’s contract. Here are two of the boundary tests the Bot wrote:

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">THE NEW TESTS · 02</span><strong>Checking the exact lower and upper bounds</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>One existing test, eight added</span></div><div><strong>duration.test.mjs</strong><span>Function implementation unchanged</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">Two tests from the generated file</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>Both lower-boundary formats</strong><span>Both 0:00 and 00:00 should return 0.</span></div><div><b>02</b><strong>An explicit upper-boundary result</strong><span>23:59 returns 1439, while separate assertions verify the error types for out-of-range inputs.</span></div></div>
<figcaption>Two of the added boundary tests. <a href="/task-evidence/2026-10-11/duration.test.mjs.txt">Full test file</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">See the diff</a></figcaption>
</figure>

## Where the task got stuck: running the suite

When the Bot tried to run the tests inside its Windows sandbox, it ran into directory permission errors. Even after we adjusted permissions on the temporary directories, Node’s test runner still failed to spawn a child process:

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

To see whether the tests themselves were sound, we ran the exact same command in a normal terminal window. All nine tests passed immediately. The code was ready; the sandbox environment was what stood in the way.

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">RUNNING THE TESTS · 03</span><strong>Valid tests, blocked sandbox execution</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">BOT RUN · FAILED</span><strong>spawn EPERM</strong><p>The sandbox could not spawn a child process (exit code 1).</p></div><div><span class="evidence-status">MANUAL RUN · PASSED</span><strong>9 / 9</strong><p>Nine passed, zero failed (exit code 0).</p></div></div>
<figcaption>The same test file failed inside the Bot’s Windows sandbox and passed in a regular terminal. <a href="/task-evidence/2026-10-11/operator-test-output.txt">Read the manual run log</a>.</figcaption>
</figure>

One other detail stood out during the run: while trying to diagnose the permission error, the Bot created an extra scratch file, stepping outside our instruction to edit only `duration.test.mjs`. We logged and removed that file, and documented the full cleanup sequence in the [run record](/task-evidence/2026-10-11/evidence.json).

## Three things to check on your next coding handoff

This experiment was a good reminder that writing good code and finishing a task end-to-end are two different things. When reviewing an agent’s coding work, a quick three-step check goes a long way:

1. **Check the diff.** Did the agent stick to the target file, or did it touch the implementation or leave behind diagnostic files?
2. **Read the assertions.** Do the new tests actually probe boundaries and failure modes, or do they just repeat happy-path inputs?
3. **Verify the test run.** Where did the command run, and what did the log actually say? When a sandbox blocks execution, stepping in manually is much faster than letting the agent loop on permission errors.

Starting with a small, self-contained function makes it easy to see what an agent writes well, where it wanders off script, and when you should take the wheel.

If you want to see how DeepSeekBot handles a document task instead, read [our three-source briefing walkthrough](/en/blog/first-agent-briefing/). New to the tool? Start with the [installation guide](/en/docs/installation/) and the [Sessions & Assignments guide](/en/docs/channel-sidebar/sessions/).

<details class="evidence-detail"><summary>Run details and original files</summary>

We used the [DeepSeekBot v1.2.0 source release](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea), DSH 0.2.0-rc.1, an isolated Windows environment and `deepseek-official/deepseek-flash` on branch `bot/add-duration-tests` (starting at commit `6f89c3d`).

Across the briefing, test-writing task and diagnostics, the run made 22 DeepSeek API requests at an estimated cost of US$0.0197.

[Original patch](/task-evidence/2026-10-11/duration-tests.patch) · [Full test code](/task-evidence/2026-10-11/duration.test.mjs.txt) · [Manual run log](/task-evidence/2026-10-11/operator-test-output.txt) · [Full run record](/task-evidence/2026-10-11/evidence.json) · [Image sources](/blog-figures/first-task/provenance.json)

</details>
