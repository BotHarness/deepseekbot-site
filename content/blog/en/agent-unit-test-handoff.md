---
{
  "title": "A DeepSeekBot test-writing handoff: passing patch, blocked Windows execution",
  "description": "DeepSeekBot added eight tests to one small function. All nine passed in our manual run, while its own run failed. Here is what we learned.",
  "date": "2026-10-11",
  "tags": [
    "Hands-on",
    "Coding handoff"
  ]
}
---

Before handing an agent an entire repository, we chose one small function: turn a time string such as `1:30` into minutes. Its rules were simple enough for us to read the tests and judge the changes ourselves.

We wanted to see which missing cases DeepSeekBot would add, and whether it could run them. It kept the existing test, added eight and left the function unchanged. All nine passed when we ran them manually. The Bot’s own Windows sandbox run failed, so we still had to take over.

## Make the first task small and clear

Our demonstration project contained one `parseDuration` function. It accepts `H:MM` or `HH:MM` strings from `0:00` to `23:59` and returns the total minutes:

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

There was one test for an ordinary input. We put the [demonstration project](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture) on a separate branch, allowed the Bot access to its folder, and asked it to add tests without changing the function. Any implementation bug should be reported.

DeepSeekBot calls a delegated task an Assignment. Here is a short version of the instructions to adapt:

```text
Read duration.mjs and the existing tests. Change only duration.test.mjs.
Keep the original test and add normal inputs, minimum and maximum values,
out-of-range values and malformed inputs.
Report any function bugs without changing the implementation.
Run node --test duration.test.mjs and report the changes and result.
Do not install dependencies, browse, commit, push or change other files.
```

Mentioning a path in chat does not give the Bot access. Choose the folder in Workspace Grants first, then review any operations that ask for your approval.

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">BEFORE THE TASK · 01</span><strong>Choose which folder the Bot can access</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="English sidebar controls" tabindex="0"><svg viewBox="2250 1240 620 300" role="img" aria-label="English sidebar showing Sessions, Bot Inbox, Schedules and Workspace Grants"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>Find the folder controls</strong><span>Open Workspace Grants in the sidebar to manage folder access.</span></div><div><b>02</b><strong>Review each operation</strong><span>Access to a folder does not approve every operation the Bot might request.</span></div></div>
<details class="evidence-detail"><summary>View the full interface</summary><a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="Native English product README interface with Workspace Grants in the right sidebar; scripted demo conversation" loading="lazy" decoding="async"></a></details>
<figcaption>Find Workspace Grants in the right sidebar. The full interface shows a sample conversation. <a href="/en/docs/channel-sidebar/workspaces/">See the setup guide</a>.</figcaption>
</figure>

## What the new tests added

The Bot kept one test and added eight, leaving nine in total. We read the generated code without changing its tests or the function implementation.

| Input | Expected result |
| --- | --- |
| `0:45`, `12:05`, `2:15` | Correct integer minutes |
| `0:00`, `00:00`, `23:59` | 0 or 1439 |
| `0:60`, `24:00`, `99:00` | An out-of-range error (`RangeError`) |
| Numbers, null, objects, arrays | A type error (`TypeError`) |
| Missing digits, spaces, signs, decimals, full-width digits | A format error (`TypeError`) |

The cases were a useful reminder to look beyond a few ordinary numbers. Minimum and maximum values, along with inputs a user might get wrong, reveal more of the function’s rules. Two of the new tests make the boundaries explicit:

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">THE NEW TESTS · 02</span><strong>Check the smallest and largest values</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>One existing test, eight added</span></div><div><strong>duration.test.mjs</strong><span>Function implementation unchanged</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">Two tests from the generated file</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>Both lower-boundary formats</strong><span>Both 0:00 and 00:00 should return 0.</span></div><div><b>02</b><strong>An explicit upper-boundary result</strong><span>23:59 should return 1439; separate assertions check error types for invalid values.</span></div></div>
<figcaption>Two of the added tests. <a href="/task-evidence/2026-10-11/duration.test.mjs.txt">Full test file</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">See the changes</a></figcaption>
</figure>

## Running them was where the task got stuck

The Bot encountered directory permissions trouble in its Windows sandbox. After we addressed permissions on the temporary directories, the test runner still failed to create a child process:

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

To check whether the generated tests could run, we executed the same command manually in a regular terminal. All nine passed. That confirmed the manual run; it left the Bot’s execution problem unresolved.

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">RUNNING THE TESTS · 03</span><strong>Written successfully; the Bot’s run failed</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">BOT RUN · FAILED</span><strong>spawn EPERM</strong><p>The test command failed with exit code 1.</p></div><div><span class="evidence-status">OUR MANUAL RUN · PASSED</span><strong>9 / 9</strong><p>Nine passed, zero failed, exit code 0.</p></div></div>
<figcaption>The same tests failed in the Bot’s Windows sandbox and passed in a regular terminal. <a href="/task-evidence/2026-10-11/operator-test-output.txt">Read the manual run log</a>.</figcaption>
</figure>

There was another wrinkle: the Bot wrote an extra file to investigate permissions, despite the instruction to change only the test file. We retained its record and removed it. Cleanup also failed to restore all directory permissions to the backed-up state, so recovery stopped and the test service was shut down. The [detailed record](/task-evidence/2026-10-11/evidence.json) retains those problems.

## Three things we would check next time

This attempt separated writing code from finishing a task. We could review the new tests one by one, but the environment, extra writes and failure handling also mattered.

1. **Read the changes.** What else was touched? Did the original function change?
2. **Read the tests.** Why is each input worth testing, and does its expected result follow the function’s rules?
3. **Read the run log.** Who ran the command, where did it run, and did it actually pass?

Nine passes do not tell us whether an entire project is bug-free. A small function with clear rules is enough for a first attempt to show what the agent wrote, what it missed and where you need to step in.

For a document task instead, read [our three-source briefing experience](/en/blog/first-agent-briefing/). Start with [installation](/en/docs/installation/) if you have not set up the Bot, or see the [task guide](/en/docs/channel-sidebar/sessions/) for the controls.

<details class="evidence-detail"><summary>Run details and original files</summary>

We used the [DeepSeekBot v1.2.0 source release](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea), DSH 0.2.0-rc.1, an isolated Windows environment and `deepseek-official/deepseek-flash`. No desktop or browser operation components or production repository were used. The demonstration branch was `bot/add-duration-tests`, starting at local commit `6f89c3d`.

DSH scripts backed up and adjusted permissions on two temporary directories. During recovery, the memory directory’s permissions did not match the backup, so recovery stopped before restoring the demonstration directory. The test service remains stopped, and permissions were not expanded further.

The briefing, test-writing task and diagnostics together made 22 DeepSeek API requests at an estimated US$0.0197, rather than a separate price for this task.

[Original patch](/task-evidence/2026-10-11/duration-tests.patch) · [Full test code](/task-evidence/2026-10-11/duration.test.mjs.txt) · [Manual run log](/task-evidence/2026-10-11/operator-test-output.txt) · [Full run record](/task-evidence/2026-10-11/evidence.json) · [Image sources](/blog-figures/first-task/provenance.json)

</details>
