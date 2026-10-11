---
{
  "title": "A DeepSeekBot test-writing handoff: passing patch, blocked Windows execution",
  "description": "Inspect eight tests added by DeepSeekBot: nine pass in an operator terminal, while the native Windows sandbox fails with spawn EPERM. Includes patch and logs.",
  "date": "2026-10-11",
  "tags": ["Hands-on", "Coding handoff"]
}
---

Evaluate a coding agent with tests for one function. Each test pairs an input with an expected result—converting `1:30` to 90 minutes, for example, or rejecting `24:00`—so you can inspect what the patch checks.

DeepSeekBot kept one existing test and added eight, leaving the function unchanged. All nine passed in an operator’s ordinary terminal; the Bot’s own Windows sandbox run failed with `spawn EPERM`. **The patch passed review and operator execution, while native Bot execution failed.** Record those stages separately when accepting a handoff.

## Use a disposable demonstration repository

The fixture contains one function, `parseDuration`. It accepts `H:MM` or `HH:MM` strings from `0:00` through `23:59` and returns integer minutes. Non-string or malformed input throws `TypeError`; out-of-range time throws `RangeError`.

```js
parseDuration('1:30');  // 90
parseDuration('0:00');  // 0
parseDuration('23:59'); // 1439
parseDuration('24:00'); // RangeError
```

The starting repository had one normal-input test. Its isolated branch was `bot/add-duration-tests`, with local baseline commit `6f89c3d`. This is a demonstration-repository pin, not a public product release. The reproducible [initial fixture](https://github.com/BotHarness/deepseekbot-site/tree/blog/first-task-evidence/planning/task-evidence/fixture) uses the MIT license.

No production repository, customer files or account credentials were supplied. The task did not request a commit, push, PR or merge.

## Give one Assignment a bounded job

The runtime was a [source checkout at DeepSeekBot’s v1.2.0 release tag](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea), DSH 0.2.0-rc.1, an isolated Windows Profile, and `deepseek-official/deepseek-flash`. Optional Computer/Browser components were absent. This was not an npm-artifact qualification.

An Assignment is a delegated task with its own Session and report. This run used one Bot and one coding Assignment. After authorizing the demonstration workspace, we specified what it could change:

```text
Use one Assignment. Read the fixture and existing tests first.
Change only duration.test.mjs. Preserve the original test and add normal inputs,
0:00, 23:59, minute/hour overflow, non-string and malformed-input cases.
Report implementation bugs without changing the function.
Run node --test duration.test.mjs.
Return the actual diff, full command, exit code, output and unverified behavior.
Do not install dependencies, browse, push, commit, change branches or other files.
Report only in the current private DM.
```

This is a concise English rendering of the original Chinese request. The [evidence manifest](/task-evidence/2026-10-11/evidence.json) records its outcome. Workspace Grants set directory access scope: a path in chat grants no access, and a directory Grant does not approve every tool operation. See the [Grants guide](/en/docs/channel-sidebar/workspaces/).

This was not a multi-Bot team experiment. DSH’s experimental Agent Teams and Git Worktrees plugins were outside the test.

<figure class="evidence-figure" id="workspace-guide">
<div class="evidence-heading"><span class="evidence-kicker">PERMISSION GUIDE · 01</span><strong>Find Workspace Grants in the right sidebar</strong></div>
<div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="English sidebar controls" tabindex="0"><svg viewBox="2250 1240 620 300" role="img" aria-label="English sidebar showing Sessions, Bot Inbox, Schedules and Workspace Grants"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>Open Workspace Grants</strong><span>Use this entry to inspect or request directory access. Naming a path in chat does not grant it.</span></div><div><b>02</b><strong>Check scope and operations</strong><span>A directory Grant and approval for an individual tool operation are separate. This crop shows the entry, not its expanded settings.</span></div></div>
<details class="evidence-detail"><summary>Show the full English interface · 2880 × 1800</summary><a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="Native English product README interface with Workspace Grants in the right sidebar; scripted demo conversation" loading="lazy" decoding="async"></a></details>
<figcaption>Native English product interface, reused from the README. The full view contains a scripted observatory demo, not this task’s result. This crop shows the sidebar entry only; no Grant was added for the illustration. <a href="/blog-figures/first-task/provenance.json">Source and version scope</a> · <a href="/en/docs/channel-sidebar/workspaces/">Read the Grants guide</a>.</figcaption>
</figure>

## Inspect the generated patch

The Bot kept the original test and added eight, for nine in total:

| Coverage | Examples | Expected result |
| --- | --- | --- |
| Normal inputs and integer output | `0:45`, `12:05`, `2:15` | Correct integer minutes |
| Boundaries | `0:00`, `00:00`, `23:59` | 0 or 1439 |
| Minute and hour overflow | `0:60`, `24:00`, `99:00` | `RangeError` |
| Non-string input | Numbers, null, objects, arrays | `TypeError` |
| Malformed input | Missing digits, spaces, signs, decimals, full-width digits | `TypeError` |

Download the [actual patch](/task-evidence/2026-10-11/duration-tests.patch) and [complete generated test file](/task-evidence/2026-10-11/duration.test.mjs.txt). The implementation remained unchanged. The operator checked the contract, assertions and added scope without editing the generated test code.

<figure class="evidence-figure" id="patch-detail">
<div class="evidence-heading"><span class="evidence-kicker">PATCH DETAIL · 02</span><strong>Turn boundaries into inspectable assertions</strong></div>
<div class="evidence-stats"><div><strong>1 → 9</strong><span>One existing test, eight added</span></div><div><strong>duration.test.mjs</strong><span>Function implementation unchanged</span></div></div>
<div class="evidence-terminal"><div class="evidence-terminal-title">Verbatim excerpt from the generated file</div><pre><code>test('converts the lower boundary 0:00 to 0 minutes', () =&gt; {&#10;  assert.equal(parseDuration('0:00'), 0);&#10;  assert.equal(parseDuration('00:00'), 0);&#10;});&#10;&#10;test('converts the upper boundary 23:59 to 1439 minutes', () =&gt; {&#10;  assert.equal(parseDuration('23:59'), 1439);&#10;});</code></pre></div>
<div class="evidence-notes"><div><b>01</b><strong>Both lower-boundary formats</strong><span>Both 0:00 and 00:00 should return 0.</span></div><div><b>02</b><strong>An explicit upper-boundary result</strong><span>23:59 should return 1439; separate assertions check error types for invalid values.</span></div></div>
<figcaption>This typeset excerpt preserves the generated code; it is not an IDE screenshot or a new execution result. <a href="/task-evidence/2026-10-11/duration.test.mjs.txt">Complete test file</a> · <a href="/task-evidence/2026-10-11/duration-tests.patch">Actual diff</a></figcaption>
</figure>

These assertions check a fixed function contract. Nine passes establish that they passed in the operator terminal, not that the project is bug-free. Coverage, fuzz testing and mutation testing were not measured.

## Keep Bot execution and operator execution separate

The original native tool failed while provisioning Windows directory permissions. With Human approval, DSH’s supplied script backed up and granted current-user FullControl on two temporary test directories. The same confined command then started, but Node’s test runner still failed to create its child process:

```text
node --test duration.test.mjs
Error: spawn EPERM
EXITCODE=1
```

Inspect the command’s exit code and output. A tool can return its result successfully even when the command it ran failed.

DSH’s recovery workflow then attempted to restore directory permissions in reverse order. The memory-directory ACL check differed from the backup, so recovery stopped before restoring the fixture. Both directories are temporary test scope, and the task Host is stopped. Permissions were not expanded further and the sandbox was not bypassed.

The Bot also wrote an extra ACL probe, violating the test-file-only request. The operator retained its evidence privately and removed that file. Review extra writes as well as the final diff; a clean patch alone would hide this deviation.

The operator separately ran the generated tests in an ordinary terminal:

```text
tests 9
pass 9
fail 0
exit code 0
```

[Download the full operator log](/task-evidence/2026-10-11/operator-test-output.txt). This confirms that the generated tests passed in an ordinary terminal. The Bot’s confined execution failure remained unresolved.

<figure class="evidence-figure" id="execution-results">
<div class="evidence-heading"><span class="evidence-kicker">READ EACH RESULT · 03</span><strong>One command, two execution contexts</strong></div>
<div class="evidence-command"><code>node --test duration.test.mjs</code></div>
<div class="evidence-outcomes"><div><span class="evidence-status">NATIVE BOT SANDBOX · FAILED</span><strong>spawn EPERM</strong><p>Exit code 1; autonomous execution did not complete.</p></div><div><span class="evidence-status">OPERATOR TERMINAL · PASSED</span><strong>9 / 9</strong><p>Nine passed, zero failed, exit code 0.</p></div></div>
<figcaption>Editorial presentation of the recorded results, not a terminal screenshot. Operator success does not replace Bot execution; the extra probe file and failed ACL rollback verification still affect acceptance. <a href="/task-evidence/2026-10-11/operator-test-output.txt">Full operator log</a> · <a href="/task-evidence/2026-10-11/evidence.json">Evidence manifest</a></figcaption>
</figure>

## What to require from your next handoff

1. **Changes:** read the diff and look for extra files; check implementation and directory scope.
2. **Assertions:** compare each test with the contract; inspect normal, boundary and invalid inputs.
3. **Execution:** require the command, exit code, full output and environment; code generation and execution are separate stages.
4. **Recovery:** retain the first failure and any manual corrections. Repeated permission expansion does not establish success.

For your own first task, choose code with a clear contract and review its diff, extra files and actual execution log. This Windows run did not meet an unattended-delivery requirement. It establishes no speed or reliability advantage over Grok Bot, Cue or another product.

Self-hosting still requires installation and updates, an available host, Node/Git and model quota. The briefing, coding task and diagnostics shared a US$1 DeepSeek API ceiling; their 22 requests cost an estimated US$0.0197. That is neither a fixed task price nor the account bill. Try the [three-source briefing](/en/blog/first-agent-briefing/) next, or consult [installation](/en/docs/installation/) and the [Assignment Session guide](/en/docs/channel-sidebar/sessions/).
