# English narration: a first task you can inspect

Internal recording draft, not a completed demonstration. Shot keys match the capture checklist. A 3–5 minute main edit and a 45–60 second short are editorial targets, not task-speed claims. Every `{{…}}` slot must come from approved real evidence before recording or publication.

## Video A: turn three sources into a briefing you can check

### B01 — Opening

“You have three pages to read, but what you need is a short briefing you can discuss. Instead of asking which AI is fastest, let's define a useful task and inspect what comes back.

This video is produced by the DeepSeekBot project team. It is not an independent product benchmark.”

### B02 — Start with a small permission boundary

“For a first attempt, you do not need to connect your inbox or hand over every work account. Choose three sources you can use publicly, and keep their links, titles, and the content used for this run.

We will show the actual version, model, environment, and permissions. The installation guide covers setup separately. Running your own assistant still means handling configuration, an available host, updates, and model costs.”

### B03 — Define the handoff

“The task is to use only these three sources, identify three relevant changes, and attach a source to each one. Keep facts separate from interpretation. If a source does not establish something, say it is unverified. Return a one-page draft; do not send it for me.

The screen must show the prompt actually submitted. If that differs from this task outline, we disclose the difference rather than replacing it with a polished prompt in the edit.”

### B04 — Preserve the original result

“We retain the original submit-to-response record. If this edit skips waiting, we label the cut. The length of the video is not the time the task took.

First we inspect the original response. Human edits come afterward, so a corrected sentence cannot be mistaken for the assistant's first answer.”

### B05 / B06 — Evidence-locked result

The human editor selects and rewrites only the branch supported by E1:

- **A reviewable draft exists:** “This line says {{ACTUAL_CLAIM}}. The relevant source is {{SOURCE_TITLE}}, and the passage is {{SOURCE_PASSAGE}}. Our check found {{CLAIM_CHECK_RESULT}}. The draft also had {{ERROR_OR_OMISSION}}; the reviewer changed it to {{REVIEWER_CORRECTION}}.” If no error was found, name the checks and their limits rather than claiming complete accuracy.
- **The task failed or returned an incomplete draft:** “This attempt stopped at {{OBSERVED_FAILURE}}. It did not produce a complete briefing. This is the actual record, not a reconstructed success screen. We can establish {{CONFIRMED_SCOPE}}; the next step requires {{NEXT_AUTHORIZED_STEP}}.”

Do not insert an accuracy percentage, time saving, success rate, or untested support claim.

### B07 — Closing

“For a first research task, a draft you can inspect is a better starting point than connecting all your accounts. Give clear sources, define the output, and check each claim.

The companion article will include the actual prompt, review notes, and setup links. The same review-first approach also applies to code: the useful part is a handoff you can verify, not just a message saying done.”

### Short A — One claim, one source check

“Want a briefing from three pages? Start with three public sources, not a pile of account permissions. Ask DeepSeekBot for a draft with sourced facts and clearly labelled interpretation.

Now compare {{ACTUAL_CLAIM}} with {{SOURCE_PASSAGE}}. {{ACTUAL_CHECK_AND_CORRECTION}}.

This is a project-team recording. The full inputs, review limits, and setup costs belong in the companion article. The clip is edited, not a speed benchmark.”

E1 applies to the short too. If source text is unreadable on a phone, use a focused close-up of one passage rather than a tiny three-page collage.

## Video B: ask for unit tests, then inspect the code handoff

### C01 — Opening

“An AI assistant may help with more than chat. For a code task, two useful questions are: what changed, and did the tests actually run?

We will ask DeepSeekBot to add tests for one function in a public demonstration repository. This is a project-team walkthrough, not a competitor ranking.”

### C02 — Keep the workspace disposable

“Show the version, fixture, and isolated branch first. This is not a customer or production repository. The task does not authorize changes to the main branch or a push.

A unit test checks a function against a specific expected result. It does not establish that the entire application is correct. Available tools must be tied to this actual DeepSeekBot and DSH configuration; source-only features and optional components are not automatically part of a published installation.”

### C03 — Ask for evidence, not a verdict

“The actual prompt names the function, permitted test files, and cases to check. Ask for the diff, command, exit code, and original test output, not just ‘tests passed.’

The DSH foundation gives us a concrete tool-and-execution workflow to examine here. This one run does not establish that its coding harness is better than Grok Bot or the standalone Manus Cue app.”

### C04 — Review the diff first

“A diff shows what changed. Check that the edit stayed within the agreed files, then ask whether the tests check behavior or merely copy the current output as the expected answer. Do not quietly change the function under test just to make the result green.”

### C05 / C06 — Evidence-locked result

- **Actual logs are available:** “The command was {{ACTUAL_TEST_COMMAND}}, with exit code {{ACTUAL_EXIT_CODE}}. The output reports {{ACTUAL_TEST_RESULT}}. Human review found {{REVIEW_FINDING}}, followed by {{ACTUAL_CORRECTION_OR_NO_CORRECTION}}. That establishes {{BOUNDED_CONCLUSION}} for this run, not success on every code task.”
- **Tests were not run or the task failed:** “The handoff contains {{ACTUAL_DELIVERY}}, but no verified passing result yet. The gap is {{OBSERVED_FAILURE_OR_GAP}}. A test file, a runnable test, a passing test, and an acceptable change are different checkpoints.”

Counts require the actual diff or logs. Do not prefill test counts, duration, or coverage. Attribute corrections to the assistant or the human reviewer accurately.

### C07 — Closing

“A useful coding assistant leaves changes you can inspect. It cannot accept its own work on your behalf. The companion article will link the fixture version, actual prompt, diff, command, and review record.

Research and coding are different tasks, but the starting point can be the same: a small task, limited permissions, and a reviewable result. Include the setup and maintenance cost in the decision.”

### Short B — ‘Passed’ needs a log

“An AI says the tests passed. What evidence should you ask for? Give DeepSeekBot one function in an isolated demo repository, and allow test changes only.

Inspect the diff, then the command {{ACTUAL_TEST_COMMAND}} and its actual output. {{ACTUAL_RESULT_AND_REVIEW_SCOPE}}.

This is a project-team clip, not a coding-agent leaderboard. Check the version, permissions, and full record before trying it yourself. Do not start in a production repository.”
