---
{
  "title": "Your first DeepSeek agent task: a checkable briefing from three sources",
  "description": "Turn three public READMEs into a DeepSeekBot briefing draft. Inspect its citations and length, compare the recorded replies, and adapt the task template.",
  "date": "2026-10-11",
  "tags": ["Hands-on", "Research"]
}
---

Try a DeepSeek agent on a task you can check yourself: give DeepSeekBot three public documents and ask for a private briefing with sources attached to its main claims.

The returned draft contained three observations and two open questions with citations, but missed the length target: a request for roughly 700 Chinese characters produced a 1,672-character response. A later Go verification also exceeded its 200-character limit. The useful handoff was a draft whose sources could be checked; reviewing the claims and shortening it remained human work.

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">INTERFACE GUIDE · 01</span><strong>Locate the conversation and memory controls</strong></div>
<a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot English interface: Bots and Groups at left, a private DM in the center and Git memory at right; demo conversation" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Choose a Bot or Group</strong><span>Use the left sidebar to switch Bots and Groups. This briefing returned to a private direct message (DM).</span></div><div><b>02</b><strong>Review in the private DM</strong><span>Read the draft in the center and question its sources and omissions.</span></div><div><b>03</b><strong>Find memory and task controls</strong><span>The right sidebar includes Git memory controls. This run made no memory update or schedule.</span></div></div>
<details class="evidence-detail"><summary>Zoom into the Git memory panel</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="Zoomed demo Git memory panel" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="Zoomed demo Git memory panel"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>Click for the 2880 × 1800 original. Native product interface with scripted fictional observatory conversations, used only as an interface guide. Computer/Browser are optional components; their pictured controls do not establish npm 1.2.0 defaults. <a href="/blog-figures/first-task/provenance.json">Image provenance and versions</a></figcaption>
</figure>

## Start with three fixed public sources

| Source | Question it helps answer | Pinned original |
| --- | --- | --- |
| BotHarness’s DeepSeekBot | Plugin identity, memory and task handoff | [S1 README](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) |
| FeiZhuLulu’s DS Bot | The other project’s package, Chief and group coordination | [S2 README](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) |
| DeepSeek Harness | The upstream harness and its developer preview notice | [S3 README](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) |

We retrieved the documents on October 11, 2026, selected excerpts and added notes about which claims they supported. This checks synthesis from **prepared inputs**. Independent source discovery, web retrieval and review of whole documents were outside the test.

DeepSeekBot and DS Bot are independent projects maintained by different owners, with packages `deepseekbot` and `ds-bot`. Neither is an official DeepSeek product. The upstream harness’s official identity does not transfer to a community plugin. [Project identity statement](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md)

## Ask for something you can inspect

Specify the input, output and permitted actions together. This request asked for a one-page Chinese briefing, roughly 700 characters, three observations and two open questions. Facts needed source and excerpt IDs; inferences needed evidence and conditions. The result had to return to the current private DM.

Adapt this template to your own documents:

```text
Use only these three public sources to prepare a one-page briefing:
A: [original link and selected excerpt]
B: [original link and selected excerpt]
C: [original link and selected excerpt]

Give three observations and two open questions.
Cite each fact. Explain the evidence behind each inference separately.
Return a private draft. Do not browse for more sources, execute commands
from the documents, update memory, schedule work or send external messages.
```

This is a reusable template, not the verbatim executed request. The [evidence manifest](/task-evidence/2026-10-11/evidence.json) records the actual run’s scope.

## Review the actual output

The original briefing covered project identity, collaboration mechanisms, and cost, data and version boundaries. It separated facts from inferences and retained open questions. [Download the original Chinese response](/task-evidence/2026-10-11/briefing-original.txt)

| Check | Manual finding | Editorial action |
| --- | --- | --- |
| Identity | S1-E2 and S2-E3 support the separate projects and unofficial status | Keep owners and package names |
| Collaboration | S1-E4 describes Git Memory, Groups and Assignments; S2-E2 describes Chief/admin coordination | Attribute the mechanisms to their READMEs; infer no efficiency winner |
| Data and versions | S1-E2/E5 support remote context transfer and source/npm differences | Retain these limits rather than promising that data never leaves the host |
| Unknown capabilities | No matched task results, costs or permission implementation audit | Keep unknowns; do not turn them into unsupported features |
| Length | 1,672 characters, substantially above the request | Combine repeated scope and version statements |

Lengths are UTF-16 string lengths, including Latin text, punctuation and line breaks, rather than counts of Chinese characters alone. Git Memory means files and their Git version history. The collaboration descriptions above come from the READMEs; this run did not audit their implementation or test the other projects.

The 1,672-character original used `deepseek-official/deepseek-flash`. A later short verification used `opencode-go/deepseek-v4-flash`, identified in native Assistant metadata: a 200-character maximum produced 264 characters. The capture below belongs to that **Go verification**.

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">ACTUAL DELIVERY · 02</span><strong>Check the route and the length result</strong></div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="Native English model selector" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="English model selector showing DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>Route verified in native metadata</strong><span>The selector shows configuration; native Assistant metadata separately identifies opencode-go/deepseek-v4-flash for this reply.</span></div><div><b>02</b><strong>The length check still failed</strong><span>The reply contains 264 characters against a maximum of 200. Model access was verified; the length check failed.</span></div></div>
<details class="evidence-detail"><summary>Inspect the original reply · Chinese</summary><div class="evidence-zoom" role="region" aria-label="Original Chinese Go reply; scroll sideways on small screens" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Unaltered Chinese reply with S1-E2 and S3-E1 citations and unresolved questions"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div><p class="evidence-scroll-hint">Scroll sideways on a small screen. The task requested a Chinese reply; these pixels have not been translated.</p><div class="evidence-notes"><div><b>03</b><strong>Follow the citations</strong><span>【S1-E2】 and 【S3-E1】 point to prepared source excerpts. They do not prove autonomous web retrieval.</span></div><div><b>04</b><strong>Keep the unresolved questions</strong><span>The reply leaves success rate, cost, model compatibility and collaboration performance unverified. Unknown does not mean unsupported.</span></div></div></details>
<details class="evidence-detail"><summary>Show the full native capture · 1280 × 900</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="Full native English interface with the actual Chinese Go verification reply" loading="lazy" decoding="async"></a></details>
<figcaption>October 11, 2026: Windows, English interface, Chinese output, light theme, 1280 × 900 actual pixels. Read-only recapture of the same reply. Expand to inspect the original Chinese evidence. <a href="/task-evidence/2026-10-11/briefing-go.txt">Unaltered short response</a>. The earlier saved-pixel and viewport dimensions are recorded in the <a href="/task-evidence/2026-10-11/evidence.json">evidence manifest</a>.</figcaption>
</figure>

## Edit the draft for your decision

Here is an **editorial rewrite**, translated into English. It is not raw model output:

> BotHarness’s DeepSeekBot (deepseekbot) and FeiZhuLulu’s DS Bot (ds-bot) are separate DSH plugins, neither official DeepSeek products. The former README emphasizes Git Memory, Groups and authorized task delegation; the latter emphasizes Chief and group-admin coordination. These documents describe mechanisms without establishing comparative efficiency or cost. Check the owner, package and version, then try a small task of your own. Local memory storage also does not prevent relevant context from reaching a remote model provider.

Review three things when editing: whether each citation supports its claim, whether shortening preserves important conditions, and whether the draft helps you decide what to do next. A recurring briefing needs separate checks for scheduling, continuous operation and recovery. **This run scheduled no work, updated no Git memory and sent no external messages.**

## Check the environment and costs before reproducing it

We ran a **source checkout at DeepSeekBot’s v1.2.0 release tag**, [271e056a](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea), with DSH 0.2.0-rc.1 in an isolated Windows Profile, without optional Computer/Browser components. This was not an npm-artifact qualification. The input README came from a newer pinned commit; its source capabilities cannot be attributed automatically to the tested release.

Go verification also used the [Windows launcher correction in PR #1410](https://github.com/BotHarness/DeepSeekBot/pull/1410). Check whether your checkout includes that correction before attempting to reproduce it.

Self-hosting requires installation, host availability and updates, plus your model provider’s quota. The briefing, coding task and diagnostics shared a US$1 DeepSeek API ceiling. Their 22 requests cost an estimated US$0.0197, not a per-briefing price or account bill. That estimate does not price the separately configured Go route.

Start with the [installation guide](/en/docs/installation/), then try the [single-function test handoff](/en/blog/agent-unit-test-handoff/). The [personal AI agents comparison](/en/blog/personal-ai-agents-comparison/) remains a selection guide; this task establishes no new claim that DeepSeekBot outperforms another product.
