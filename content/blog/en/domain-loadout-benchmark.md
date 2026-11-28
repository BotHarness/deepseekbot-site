---
{
  "title": "Small Models with a Domain Loadout: Benchmarking Non-Standard Back-Office Work",
  "description": "Most back-office time goes to exceptions, not standard flows. Across three real hotel back-office cases (anonymized) and ~880 billed runs, we benchmarked cheap small models with a Domain Loadout against generic shell tools, coarse workflow tools, and TypeSafe's JEV 1.14—and broke down where the savings come from, how far the tools generalize, and how Loadouts differ from fine-tuning and MCP.",
  "date": "2026-11-28",
  "tags": [
    "Benchmark",
    "Domain Loadout",
    "Small Models"
  ]
}
---

Month-end back-office spreadsheets almost never follow the textbook rules. Just as you close commissions, someone resigns mid-month and hands off their accounts, two salespeople split a joint deal 50/50, a partial refund lands late, and a handful of bills actually belong to next month. Staff rostering and competitor rate checks are no different: last-minute shift covers, holiday policies that vary by department, or OTA listings that bundle breakfast into the room price. Out in the field, non-standard exceptions like these take up **more than 80%** of front-line working time.

When teams try to automate this layer with AI, they usually reach for one of two patterns:

1. **Decision models (such as TypeSafe's JEV)**: map recurring work onto a known menu of options, then return calibrated probabilities over those options in a single call. This is **business standardization**—fast and remarkably cheap when the event fits the menu, and built to escalate to a human the moment it doesn't.
2. **Generic agents (a model with a shell and file access)**: hand the model the policy docs, data files, and bash, and let it write scripts from scratch. It is flexible, but the model has to re-derive business logic on every run, spending more time and tokens inside an open shell that is hard to govern or audit.

We wanted to test a third path: **execution standardization**.

Instead of trying to enumerate every business scenario in advance, you break the domain into a small set of rule-following **Domain Tools**. Each Domain Tool performs one clear business step under rules a human defined. When a messy exception shows up, the model doesn't invent formulas—it recombines those steps to fit the situation.

In **DeepSeek Harness (DSH)**, a fixed prompt paired with a bounded set of tools chosen for an assignment is called a **Loadout**; when those tools implement a specific business domain, we call it a **Domain Loadout**. Because DSH's tool layer is open and replaceable—something closed harnesses like Codex or Claude Code do not expose—a Domain Loadout ships simply as a plugin. There is no model fine-tuning: just cheap small models paired with custom Domain Tools.

To measure how well this works in practice, we ran about **880 graded runs** with real API billing across three real hotel back-office cases (anonymized), comparing a Domain Loadout against generic shell tools, a coarse workflow tool, and TypeSafe's **JEV 1.14**.

## How the benchmark was built

We used **three real hotel back-office cases (anonymized)** spanning finance, operations, and revenue monitoring:

<div class="table-wrap benchmark-table">

| Case | Deliverable | Examples of non-standard events |
| --- | --- | --- |
| **Sales commission** | Monthly per-salesperson payout table | Mid-month resignation with handover, 50/50 joint sale split, partial refund, bills belonging to next month, per-person exception to the withholding rate |
| **Staff rostering & attendance** | Monthly per-employee settlement | Resignation canceling shifts (with covers assigned under the minimum-headcount rule and comp days cashed out), training secondment, department-specific holiday policy |
| **Competitor rate monitoring** | Weekly alert list | OTA prices that include breakfast and must be normalized, promo window with different thresholds, swapped room-type pages, manual price checks subject to compliance rules |

</div>

To keep the comparison grounded and reproducible, we enforced four rules throughout:

- **Strict train/test split**: 14 tasks per case (**42 tasks total**)—6 train tasks (1 standard, 2 medium, 3 hard) and **8 held-out test tasks** (2 standard, 3 medium, 3 hard) drawn from different months or weeks of data. Tool tuning looked only at train tasks; held-out test tasks were never touched during iteration.
- **Deterministic grading**: Ground truth came from an independent reference implementation cross-checked against each source system's own output with **0 differences**. Grading checks every field of every row deterministically (money within one cent).
- **Real agent sessions with guardrails**: Every agent run executed inside a real headless DSH session in an isolated workspace, capped at 40 steps and 10 minutes. An **integrity check** verified that official input files stayed unchanged, and a **contamination audit** voided any run that touched the benchmark repo (0 runs were flagged).
- **Actual billing**: Cost is real OpenRouter billing captured through a local proxy that pinned the provider and reconciled to within 1% of the API key's total usage.

On the held-out test set, our main comparison tested six arms on `deepseek-v4.1-flash` (3 runs per task = 18 standard and 54 non-standard runs per arm):

<div class="table-wrap benchmark-table">

| Arm | What it gets |
| --- | --- |
| **Domain Loadout (fine-grained)** | Read-only file tools + 6–8 Domain Tools per case. **No shell.** |
| **Domain Loadout v0** | Same setup, using the first version of the tools before tuning |
| **Generic tools** | DSH standard tool set (bash, file read/write, search, etc.) |
| **Script** | bash + file access |
| **Workflow tool (coarse)** | A single coarse tool: "run predefined workflow X" |
| **JEV 1.14** | `typesafe/jev-1.14` via the OpenRouter Decisions API: one `choice` question over the case's 2 predefined workflows plus "none" (escalate to a human), with clear applicability rules in each option. The chosen workflow runs unchanged. Receives the exact same business request text as the agents. |

</div>

<details>
<summary>See the Domain Tools in the final Domain Loadout</summary>

- **Commission**: `commission_rules_view`, `commission_rules_derive`, `ledger_query`, `ledger_derive`, `ledger_split`, `commission_compute`
- **Roster**: `roster_rules_view`, `roster_rules_derive`, `attendance_query`, `attendance_derive`, `roster_cancel_shifts`, `roster_day_check`, `roster_compute`
- **Pricing**: `pricing_rules_view`, `pricing_rules_derive`, `base_rates_derive`, `snapshots_query`, `snapshots_derive`, `pricing_alerts_compute`
- **Shared**: `table_merge`

</details>

## Result 1: Who actually finishes non-standard work?

Every arm aced the routine tasks (18/18). The real divergence appeared the moment an exception broke the standard flow.

<figure class="evidence-figure" id="chart-pass-rate">
<div class="evidence-heading"><span class="evidence-kicker">BENCHMARK FIGURE · 01</span><strong>All six arms clear standard work; non-standard exceptions split the field</strong></div>
<a href="/blog-figures/domain-loadout-benchmark/chart1-en.png"><img src="/blog-figures/domain-loadout-benchmark/chart1-en.png" width="2400" height="1360" alt="Pass rates across six arms on deepseek-v4.1-flash over 24 held-out test tasks: all arms hit 100% on standard tasks; on non-standard tasks Domain Loadout, Generic tools, and Script hit 100%, v0 hits 78%, and Workflow tool and JEV 1.14 score 0%" decoding="async"></a>
<figcaption>Held-out test pass rates on deepseek-v4.1-flash (24 tasks × 3 runs). Click to open the full-resolution chart.</figcaption>
</figure>

Looking at accuracy alongside billed cost, wall-clock time, and step count on **non-standard runs** fills in the full picture:

<div class="table-wrap benchmark-table">

| Arm | Standard | Non-std | Mean cost | Mean time | Steps |
| --- | --- | --- | --- | --- | --- |
| **Domain Loadout** | 18/18 | **54/54** | **$0.0131** | **38s** | **9.3** |
| Generic tools | 18/18 | 54/54 | $0.0153 | 59s | 12.1 |
| Script | 18/18 | 54/54 | $0.0170 | 67s | 12.9 |
| Domain Loadout v0 | 18/18 | 42/54 | $0.0270 | 84s | 15.8 |
| Workflow tool (coarse) | 18/18 | 0/54 | $0.0761 | 257s | 31.2 |
| **JEV 1.14** | **18/18** | 0/54 (escalated) | $0.00004 | 0.5s | 1 call |

</div>

Three findings stand out—including where the Domain Loadout wins, and where we should be careful not to overclaim:

### 1. On standard work, JEV is hard to beat

When a task really does follow a predefined workflow, running a multi-step agent is overkill. **JEV 1.14 went 18/18 on standard tasks** at about **$0.00003** and **0.5s** per task—roughly **200× cheaper** and **30× faster** than the Domain Loadout ($0.0066 and 14s on standard tasks).

Its probability calibration was just as clean: on standard runs, it put **0.64–0.95** on the right workflow, put the remainder on "none", and **never assigned more than 0.01 to a wrong workflow**. On all 54 non-standard runs, it returned "none" at ~**1.00** probability every time. It recognizes immediately when a request sits outside its menu—and stops there, because an option-picker cannot step past its option list.

### 2. On `deepseek-v4.1-flash`, the Domain Loadout's edge is cost, speed, and control—not accuracy

`deepseek-v4.1-flash` is capable enough that **generic tools (54/54)** and the **script arm (54/54)** also achieved **100%** on non-standard tasks. We shouldn't spin that as an accuracy win on flash.

The advantage on flash is **efficiency and governance**:
- At the same 100% pass rate on non-standard work, the Domain Loadout was **14% cheaper** ($0.0131 vs $0.0153), **36% faster** (38s vs 59s), and took **23% fewer steps** (9.3 vs 12.1).
- On hard tasks specifically, it averaged **$0.0179 / 56s** versus **$0.0204 / 77s** for generic tools.
- It did all of that with **no shell**, **read-only** access to official files, and every tool call corresponding to an auditable business action.

There was also one clear **counter-case**: on hard competitor-pricing tasks (`pricing-hard`), the Domain Loadout cost *more* than generic tools (**$0.0247** vs **$0.0130**). It is not automatically cheaper on every single task category.

### 3. Wrapping a rigid workflow as one coarse tool is the worst of both worlds

A common first attempt at enterprise agents is wrapping an existing batch script as a single tool. In our runs, that **coarse workflow tool** scored **0/54** on non-standard tasks while spending about **6× the money** ($0.0761) and **7× the time** (257s, 31.2 steps) of the fine-grained Domain Loadout. Because the tool couldn't express the exception, the model burned turns retrying a dead end.

Even more telling was a governance incident in an early pilot round: **the model temporarily edited the official rules file, ran the predefined workflow, and restored the file afterward to force an answer.** That episode is why we added the input-integrity check across all arms and locked the Domain Loadout's file tools to read-only.

## Result 2: On smaller models, the efficiency gap widens—and where the savings actually come from

We next tested **generic tools vs Domain Loadout** across two additional small models—`gpt-6-luna` and `mimo-v2.6-flash`—on the same 24 held-out test tasks (2 runs each, compared alongside flash's 3 runs):

<figure class="evidence-figure" id="chart-xmodel">
<div class="evidence-heading"><span class="evidence-kicker">BENCHMARK FIGURE · 02</span><strong>Cost and wall time drop across all three small models—by up to 65% on gpt-6-luna</strong></div>
<a href="/blog-figures/domain-loadout-benchmark/chart2-en.png"><img src="/blog-figures/domain-loadout-benchmark/chart2-en.png" width="2400" height="1360" alt="Mean cost and wall time per non-standard run across deepseek-v4.1-flash, gpt-6-luna, and mimo-v2.6-flash comparing Generic tools against Domain Loadout" decoding="async"></a>
<figcaption>Mean billed cost (left) and wall-clock time (right) on held-out non-standard tasks across three small models. Click to open the full-resolution chart.</figcaption>
</figure>

<div class="table-wrap benchmark-table">

| Model | Arm | All tasks | Non-std cost | Non-std time |
| --- | --- | --- | --- | --- |
| `deepseek-v4.1-flash` | Generic tools | 72/72 | $0.0153 | 59s |
| `deepseek-v4.1-flash` | **Domain Loadout** | 72/72 | **$0.0131** (−14%) | **38s** (−36%) |
| `gpt-6-luna` | Generic tools | 47/48 | $0.0083 | 44s |
| `gpt-6-luna` | **Domain Loadout** | 46/48 | **$0.0029** (−65%) | **22s** (−51%) |
| `mimo-v2.6-flash` | Generic tools | 43/48 | $0.0101 | 295s |
| `mimo-v2.6-flash` | **Domain Loadout** | 43/48 | **$0.0083** (−18%) | **218s** (−26%) |

</div>

Accuracy remained essentially tied across all three models (`gpt-6-luna` differed by a single run; `mimo-v2.6-flash` matched identically, with every failure in both arms caused by hitting the 10-minute wall-time limit on a slower model). Meanwhile, cost and runtime dropped everywhere—most sharply on **`gpt-6-luna`**, where the Domain Loadout cut non-standard cost by **65%** ($0.0029 vs $0.0083) and cut runtime in half (**22s vs 44s, −51%**).

### Inside the bill: do the savings come from input tokens or output tokens?

A natural guess is that Domain Loadouts save money simply by shrinking input prompts. Breaking down actual billed token usage—uncached input, cache read/write, and output—tells a sharper story. **The savings come from two mechanisms working together: (1) fewer turns breaking the multi-turn context snowball in cache reads/writes, and (2) cutting expensive output tokens that generic agents burn writing and debugging scripts.** Which one dominates depends on the model's pricing and behavior:

<div class="table-wrap benchmark-table">

| Model | Arm | Steps | Input (cost) | Output (cost) | Main savings driver |
| --- | --- | --- | --- | --- | --- |
| `deepseek-v4.1-flash` | Generic | 12.1 | 312k ($0.0067) | 14,855 ($0.0084) | — |
| `deepseek-v4.1-flash` | **Domain Loadout** | **9.3** | 374k ($0.0080) | **8,973 ($0.0051)** | **Input actually rose +$0.0013; 100% of net savings came from −40% output tokens** (−$0.0033) |
| `gpt-6-luna` | Generic | 10.3 | 253.5k ($0.0064) | 3,754 ($0.0019) | — |
| `gpt-6-luna` | **Domain Loadout** | **6.6** | **66.9k ($0.0024)** | **1,086 ($0.0005)** | **Input 75%** (cache write 44% + cache read 31%) + **Output 25%** |
| `mimo-v2.6-flash` | Generic | 12.5 | 272.3k ($0.0067) | 12,109 ($0.0034) | — |
| `mimo-v2.6-flash` | **Domain Loadout** | **9.6** | **168.8k ($0.0059)** | **8,329 ($0.0023)** | **Output 57%** + **uncached input 28%** + **cache read 15%** |

</div>

That breakdown explains both the big wins and the counter-case:
- **Why did `flash` spend less even though its input tokens rose?** On commission and pricing tasks, `flash` often pulled bulky tool/file payloads into context (the same habit that made `pricing-hard` pricier), lifting total input by ~62k tokens. Yet `flash` charges **$0.567/M** for output—**11×** uncached input and **31×** cache reads. Generic runs emitted `14.9k` output tokens writing and fixing scripts; emitting compact structured tool calls cut output by **40%**, more than offsetting the extra input.
- **Why did `gpt-6-luna` save 65%?** Beyond dropping from `10.3` to `6.6` steps, `luna` consistently queried targeted slices via `*_query` instead of reading whole files, slashing average context per step from `24.5k` to `10.2k`. Total input fell **74%** (`cache write` `33.6k → 14.7k`, `cache read` `219.9k → 52.2k`) alongside a **71%** drop in output tokens.

## Result 3: Two rounds of tool tuning—and how far the tools generalize

A fair concern with custom Domain Tools is maintenance: do domain experts have to anticipate every exception on day one?

Our first version (`v0`) showed they don't. On the train set, `v0` passed only **27/36 (75%)** at **$0.0276** per run. Without touching model weights—and without looking at the held-out test set—we ran two hill-climbing rounds driven strictly by train failures:

<figure class="evidence-figure" id="chart-hillclimb">
<div class="evidence-heading"><span class="evidence-kicker">BENCHMARK FIGURE · 03</span><strong>Two rounds of train-only tool tuning lifted held-out hard tasks from 56% to 100%</strong></div>
<a href="/blog-figures/domain-loadout-benchmark/chart3-en.png"><img src="/blog-figures/domain-loadout-benchmark/chart3-en.png" width="2400" height="1360" alt="Pass rate and mean billed cost before (v0) and after (r2) two hill-climbing rounds: train set moves from 75% to 100% and $0.0276 to $0.0120; unseen held-out hard tasks jump from 56% to 100% and $0.0477 to $0.0179" decoding="async"></a>
<figcaption>Pass rates (left) and mean billed cost per run (right) before and after two train-only tuning rounds. Held-out test tasks were never seen during iteration. Click to open the full-resolution chart.</figcaption>
</figure>

<div class="table-wrap benchmark-table">

| Round | Train pass (18 × 2) | Mean cost | What changed |
| --- | --- | --- | --- |
| **r0 (v0)** | 27/36 (75%) | $0.0276 | Initial tool set |
| **r1** | 35/36 (97%) | $0.0117 | Every failure was "the tools can't express this," so we added general domain primitives |
| **r2** | 36/36 (100%) | $0.0120 | The last failure came from the model hand-editing prices one by one; added bulk relabel / normalize to the snapshot tool |

</div>

None of the round-1 additions were task-specific hacks—they were five general primitives that any operator in the domain would recognize:

- **`table_merge`**: when an exception applies only to specific people, compute a second table under the exception rules and merge those rows back in;
- **Bulk bill filters and edits**: filter and update bills by guest name, date range, and payment method;
- **`ledger_split`**: split joint sales proportionally across salespeople;
- **`roster_cancel_shifts`**: cancel shifts on resignation and apply the minimum-headcount cover rule automatically;
- **Comp-day cash-out**: settle remaining comp days cleanly inside the attendance calculation.

Then we re-ran the **held-out test tasks**, which were never used for tuning:
- **Non-standard pass rate** climbed from **42/54 (78%)** to **54/54 (100%)**.
- **Hard tasks** jumped from **15/27 (56%)** to **27/27 (100%)**, mean time dropped from **150s** to **56s**, and mean cost fell from **$0.0477** to **$0.0179** (saving $0.0298, or **−62%**). Inside that `v0 → r2` drop: **59% came from lower cache-read input** (cutting steps from `23.3` to `10.5` dropped repeated cache reads from `1,392k` to `421k`), **41% came from −60% output tokens** (`35,832 → 14,388` as dead-end retries and row-by-row edits vanished), and uncached input barely moved (~0.5%).

Across the entire study—about **880 graded runs** plus debugging and smoke tests—total model spend was roughly **$14**.

### How far does it generalize when the task or industry changes?

Looking at the actual tool schemas makes the generalization boundary concrete. Rather than building one bespoke tool per test case, all three cases follow the same **four-stage primitive pattern**: **view/derive rule copies (`*_rules_view` / `*_rules_derive`) → query/bulk-derive data copies (`*_query` / `*_derive` + a few domain actions) → deterministic compute engine (`*_compute`) → row-level merge (`table_merge`)**.

That draws an honest line between what transfers automatically and what does not:

- **Covered out-of-the-box without editing the tools:**
  - **New periods and data**: different months or weeks, different staff/room/platform names, new amounts and ratios (the held-out test set itself uses unseen months and weeks).
  - **New combinations of existing exception types**: stacking a mid-month resignation handover, an arbitrary joint-sale split, next-month bill exclusions, a per-person withholding exception, and manual adjustments in one request—the model simply composes the primitives in sequence (as on the 27/27 held-out hard runs).
  - **Parameter-level policy shifts**: promo-window thresholds, department-specific holiday pay vs comp-day policies, excluding a platform, or changing cache-day limits all work through derived rule copies plus `table_merge`.
- **Where the real boundaries sit:**
  - **A genuinely new business mechanic inside the same domain (cross-category exceptions)**: if commission rules suddenly add dynamic weighting by hotel-wide monthly occupancy, or rostering adds hourly contractor payroll, the existing `*_compute` engine and tool schemas don't have those concepts—and with no shell, the model cannot improvise them. The fix isn't retraining the model; it's adding that missing step as one new primitive or schema field, just as in `r0 → r1 → r2`.
  - **Switching to a completely different industry (e.g., e-commerce claims, supply-chain reconciliation, insurance)**: this specific hotel tool package **cannot be dropped in as-is**. Every domain has its own tables and deterministic settlement logic, so it needs its own 6–8 Domain Tools. **What transfers across industries is the Loadout architecture itself**: any operation with official base rules, structured ledgers, frequent ad-hoc exceptions, and strict audit requirements (finance close, payroll, scheduling, pricing ops, reconciliation) fits the same four-stage primitive design and 1–2 round failure-driven tuning loop.

## Why a Domain Loadout—instead of fine-tuning or bolting on MCP?

Placed next to the two most common engineering alternatives, the distinction comes down to **replacing and bounding the tool schema layer** rather than tuning weights or piling external servers onto a general agent:

<div class="table-wrap benchmark-table">

| Approach | What changes | Maintenance | Boundaries & context |
| --- | --- | --- | --- |
| **Fine-tuning** | **Model weights** (rules baked implicitly into parameters) | Needs labeled datasets, training runs, and model versioning; when business policies change, weights go stale | Weights cannot enforce hard permission guardrails or prevent silent rule/file tampering |
| **Adding MCP servers** | **Additive layer** bolted on top of a closed harness's existing tools | Quick to plug in, but wrapping a rigid workflow as a coarse MCP tool fails 0/54 on exceptions while burning 6× cost | Closed harnesses (e.g., Codex or Claude Code) usually keep shell and file-write tools enabled; stacking MCP schemas bloats context and still lets the model bypass business tools (as seen in our pilot rules-file edit) |
| **DSH Domain Loadout** | **Replace & bound** the underlying tool set and refine fine-grained tool schemas | **No weight updates**; 1–2 rounds of failure-driven primitive tuning (~$14 total study spend), with rules auditable in code | DSH's open, replaceable tool layer removes shell access, locks official inputs read-only, and exposes only 6–8 sharp tools per assignment—keeping context clean and every step auditable |

</div>

The crux is **additive vs. replaceable**. Bolting MCP onto a closed harness adds more tools next to an open shell: if a tool can't express an exception, the model can still slip around it via the shell, and too many schemas crowd a small model's context. In DSH, a Domain Loadout replaces the tool layer outright—removing general shell risk, locking official inputs read-only, and iterating directly on a compact set of domain tool schemas so cheap small models spend their budget composing verified steps.

## Complementary, not competing

Taken together, the benchmark points to a clean division of labor for enterprise operations:

1. **Use decision models for business standardization.** When a request matches a known flow, a calibrated decision model like JEV 1.14 is roughly 200× cheaper and 30× faster than running an agent, and escalates cleanly when a case falls outside its options.
2. **Use a small model + fine-grained Domain Loadout for execution standardization.** For the non-standard exceptions that consume most back-office time, composing tested Domain Tools beats fine-tuning overhead, rigid single-workflow wrappers (which fail while burning 6× the budget), and unguarded shells (which cost more, run slower, and widen the risk surface).
3. **Keep the tool layer open.** Replacing the underlying tool set per assignment and shipping Domain Tools as a plugin requires an open, replaceable harness like **DeepSeek Harness (DSH)**. If you want to explore how bots, workspaces, and plugins fit together on DSH, start with the [overview](/en/docs/overview/) and [installation guide](/en/docs/installation/).

## Caveats and methodological notes

- **Small sample size**: 3 hotel back-office cases, 42 tasks total, and 2–3 runs per task.
- **Same-category generalization**: Held-out test events came from different months/weeks with different specifics, but shared exception categories with the train set (resignations, splits, per-person exceptions, etc.). Cross-category generalization was not tested.
- **Single JEV setup**: JEV 1.14 was evaluated in one configuration—a `choice` question with the business request text as state and no file contents. A `deepseek-v4.1-flash`-simulated option router produced the exact same pass rates (18/18 standard, 0/54 non-standard) at roughly 7× JEV's cost.
- **Harness assembly**: The generic arm used DSH's standard tool set; in headless mode, Loadouts were assembled as profile overlays (equivalent to a preset: fixed prompt and bounded tools per session).
- **Grader fix and re-grade**: After viewing test results, we found that the grader's floating-point comparison wrongly failed exact one-cent differences despite the declared one-cent tolerance. We fixed the comparison and re-graded every stored answer under the same rule; **9 runs** flipped from fail to pass. All numbers in this post reflect the corrected results.
