---
{
  "title": "Your first DeepSeek agent task: a checkable briefing from three sources",
  "description": "We gave DeepSeekBot three project introductions, then checked and shortened its briefing draft. Here is what happened and a prompt to adapt.",
  "date": "2026-10-11",
  "tags": [
    "Hands-on",
    "Research"
  ]
}
---

For our first real task with a DeepSeek agent, we picked something we do all the time: turning a few project write-ups into a short briefing. We had three READMEs in front of us and wanted to clarify what each project did, how they related to one another, and what still needed hands-on testing.

DeepSeekBot came back with a sourced draft containing three main observations and two open questions. Having a draft in hand made it much easier to verify the claims against the original docs and trim the wordier explanations. Here is how that first run went, along with a prompt template you can adapt for your own reading pile.

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">GETTING STARTED · 01</span><strong>Start with a conversation</strong></div>
<a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot English interface: Bots and Groups at left, a private DM in the center and Git memory at right; demo conversation" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Choose a Bot or Group</strong><span>Find the Bot you want to talk to in the left sidebar.</span></div><div><b>02</b><strong>Read the draft</strong><span>Use the conversation to ask follow-up questions or request changes.</span></div><div><b>03</b><strong>Follow the task</strong><span>Memory and task controls live in the right sidebar.</span></div></div>
<details class="evidence-detail"><summary>Zoom into the Git memory panel</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="Zoomed demo Git memory panel" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="Zoomed demo Git memory panel"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>The DeepSeekBot interface, shown with a sample conversation. Click the image to enlarge.</figcaption>
</figure>

## Start with a concrete question

Our test question grew out of an easy point of confusion: DeepSeekBot and DS Bot sound nearly identical, yet they are completely separate projects maintained by different authors. Before testing either one, we wanted to map out how they differed and how both plugged into DeepSeek Harness.

| Document | What we wanted to learn |
| --- | --- |
| [BotHarness’s DeepSeekBot](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) | How it keeps memory, organizes collaboration and delegates tasks |
| [FeiZhuLulu’s DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) | How the other similarly named project coordinates group work |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) | The underlying software these plugins run on |

We pulled the relevant passages from each README, added brief notes on what each excerpt covered, and handed the packet to the Bot. Because the Bot worked strictly from the material we supplied rather than searching the web on its own, it was easy for us to audit the output. If you're summarizing meeting notes, project updates, or design docs, scoping the input to material you already know well is a great way to start.

## Ask for a draft with sources attached

We asked for a concise Chinese briefing of roughly 700 characters, structured around three observations and two open questions, with citations for every key claim. Keeping the draft inside a private chat made it easy to iterate before sharing anything more widely.

Here is the prompt template we used:

```text
Prepare a one-page briefing from these three documents:
A: [original link and relevant passages]
B: [original link and relevant passages]
C: [original link and relevant passages]

Give three observations and two questions that still need checking.
Cite each important claim and separate facts from inferences.
Use only the material I supplied and return a draft to this conversation.
```

You can reuse this structure for competitor roundups, architecture comparisons, or weekly status updates. The two things that matter most are telling the Bot what decision you're trying to make and requiring it to keep citations attached to each point.

## The real value came during the review pass

The initial draft neatly grouped the material into project identity, team collaboration, and open questions around cost and data handling. Rather than treating the output as finished advice, we used its source tags to double-check a few nuances against the original READMEs.

First, package names matter: `deepseekbot` and `ds-bot` belong to different maintainers, and neither is an official DeepSeek product. Second, while the READMEs explain how each author designed group collaboration, documentation alone can't tell you which workflow will feel faster in daily use. Finally, keeping memory files on your local disk doesn't prevent relevant context from being sent over the wire when calling a cloud model.

Verifying those points turned the raw draft into a solid checklist of what we knew and what we still needed to test. You can [read the original Chinese reply here](/task-evidence/2026-10-11/briefing-original.txt).

Brevity was the main thing the model struggled with. Asking for roughly 700 characters gave us a 1,672-character draft. Even when we followed up using DeepSeek V4 Flash via OpenCode Go and asked for a strict 200-character cap, the reply came back at 264 characters (including Latin text, punctuation, and line breaks). If you want a tight executive summary, plan on doing a quick human edit at the end.

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">THE DRAFT · 02</span><strong>A second attempt at a shorter briefing</strong></div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="Native English model selector" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="English model selector showing DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>The model for this attempt</strong><span>This shorter version used DeepSeek V4 Flash through OpenCode Go.</span></div><div><b>02</b><strong>Still longer than requested</strong><span>We asked for at most 200 characters and received 264.</span></div></div>
<details class="evidence-detail"><summary>Read the original reply (Chinese)</summary><div class="evidence-zoom" role="region" aria-label="Original Chinese Go reply; scroll sideways on small screens" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Unaltered Chinese reply with S1-E2 and S3-E1 citations and unresolved questions"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div><p class="evidence-scroll-hint">This task was written in Chinese. On a small screen, scroll sideways to read the reply.</p><div class="evidence-notes"><div><b>03</b><strong>Follow the citations</strong><span>The source numbers lead back to the excerpts we supplied.</span></div><div><b>04</b><strong>Leave room for open questions</strong><span>Some questions need more than these documents can tell us.</span></div></div></details>
<details class="evidence-detail"><summary>View the full conversation screenshot</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="Full native English interface with the actual Chinese Go verification reply" loading="lazy" decoding="async"></a></details>
<figcaption>The shorter reply is shown in its original Chinese. <a href="/task-evidence/2026-10-11/briefing-go.txt">Read the full text</a>.</figcaption>
</figure>

## Edit toward your next decision

After trimming the repetition, we distilled the draft into this short takeaway (translated from our edited Chinese note):

> Check the maintainer and package name first: BotHarness's DeepSeekBot (`deepseekbot`) and FeiZhuLulu's DS Bot (`ds-bot`) are separate community projects, and neither is an official DeepSeek product. DeepSeekBot focuses on Git memory, groups, and task delegation, while DS Bot centers on group coordination. Since READMEs alone can't tell you real-world speed or cost, test them on a small task of your own—and remember that calling a remote model still sends relevant context over the network.

The biggest takeaway from this first run is to treat an agent's initial draft as a starting point for discussion. Let the Bot gather the threads and cite the passages, then step in to decide what holds up and what to ask next. Once you're comfortable with that loop, you can experiment with automated source gathering or scheduled briefings.

Ready to try it yourself? Start with the [installation guide](/en/docs/installation/), or see how the agent handled a coding task in [our walkthrough on adding unit tests to a function](/en/blog/agent-unit-test-handoff/).

<details class="evidence-detail"><summary>Run details and original records</summary>

We ran the [DeepSeekBot v1.2.0 source release](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea) on Windows with DSH 0.2.0-rc.1, without desktop or browser automation components, using the fixed document versions linked above.

The initial draft used `deepseek-official/deepseek-flash`, while the shorter follow-up used `opencode-go/deepseek-v4-flash` with the [Windows launcher fix](https://github.com/BotHarness/DeepSeekBot/pull/1410). Both runs returned replies in a private chat without scheduling tasks or writing to persistent memory.

Across the briefing task, the unit-test task, and troubleshooting, we made 22 DeepSeek API requests at an estimated cost of US$0.0197 (excluding OpenCode Go usage). Self-hosting also means maintaining your own runtime environment and model quota.

[Full run record](/task-evidence/2026-10-11/evidence.json) · [Image sources](/blog-figures/first-task/provenance.json)

</details>
