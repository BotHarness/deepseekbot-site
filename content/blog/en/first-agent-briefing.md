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

For our first task with a DeepSeek agent, we chose something familiar: organizing a few project introductions into a short briefing. We had three documents and wanted to understand what each project did, how they related, and which questions needed more research.

DeepSeekBot returned a draft with three observations, two open questions and source references. We still needed to check the references and shorten the prose. Here is what happened, and how we would approach the next briefing.

<figure class="evidence-figure" id="product-overview">
<div class="evidence-heading"><span class="evidence-kicker">GETTING STARTED · 01</span><strong>Start with a conversation</strong></div>
<a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot English interface: Bots and Groups at left, a private DM in the center and Git memory at right; demo conversation" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Choose a Bot or Group</strong><span>Find the Bot you want to talk to in the left sidebar.</span></div><div><b>02</b><strong>Read the draft</strong><span>Use the conversation to ask follow-up questions or request changes.</span></div><div><b>03</b><strong>Follow the task</strong><span>Memory and task controls live in the right sidebar.</span></div></div>
<details class="evidence-detail"><summary>Zoom into the Git memory panel</summary><div class="evidence-zoom evidence-zoom-panel" role="region" aria-label="Zoomed demo Git memory panel" tabindex="0"><svg viewBox="2240 105 640 1100" role="img" aria-label="Zoomed demo Git memory panel"><image href="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>The DeepSeekBot interface, shown with a sample conversation. Click the image to enlarge.</figcaption>
</figure>

## Give the briefing a question to answer

The question came from two easily confused names: DeepSeekBot and DS Bot. They are independent projects by different maintainers. We wanted to understand them and their relationship to DeepSeek Harness before choosing what to try.

| Document | What we wanted to learn |
| --- | --- |
| [BotHarness’s DeepSeekBot](https://github.com/BotHarness/DeepSeekBot/blob/fe84f5fd952ca7bf2d7232b8beda590eb38971ec/README.md) | How it keeps memory, organizes collaboration and delegates tasks |
| [FeiZhuLulu’s DS Bot](https://github.com/FeiZhuLulu/DeepSeek-Bot/blob/f87575d76e0d9d807cec17fd6964c9be6d9dca17/README.md) | How the other similarly named project coordinates group work |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/README.md) | The underlying software these plugins run on |

We selected relevant passages and added notes about which claims the documents supported, then supplied them together. The Bot worked from those prepared materials; it did not search the web for sources. Meeting notes, project updates or a few technical articles offer a similar starting point: choose a question and material you already know well enough to check.

## Ask for a draft with its sources attached

Our request was for a Chinese briefing of roughly 700 characters, with three observations, two open questions and a source for each important claim. It would return to our private conversation so we could keep working on it.

Here is a template to adapt:

```text
Prepare a one-page briefing from these three documents:
A: [original link and relevant passages]
B: [original link and relevant passages]
C: [original link and relevant passages]

Give three observations and two questions that still need checking.
Cite each important claim and separate facts from inferences.
Use only the material I supplied and return a draft to this conversation.
```

You can use the same approach for a project update or a technical decision. Tell the Bot what you want to understand, and ask it to keep the sources close to the claims.

## The useful work came after the draft arrived

The original reply organized the material around project identity, collaboration, and questions about cost and data. We followed its references before making recommendations.

The package names mattered: `deepseekbot` and `ds-bot` belong to different projects, and neither is an official DeepSeek product. The READMEs described how collaboration was designed, but could not tell us which tool would save more time in practice. Local memory storage also did not mean that relevant content would stay on the machine when sent to a remote model.

Checking these points gave us a useful list of findings and things to investigate next. You can [read the original Chinese reply](/task-evidence/2026-10-11/briefing-original.txt).

Length was the clearest problem. Our roughly 700-character request produced 1,672 characters. Later, we tried a shorter version with DeepSeek V4 Flash through OpenCode Go: a maximum of 200 characters produced 264. Those counts include Latin text, punctuation and line breaks. A short briefing still needed a human editing pass.

<figure class="evidence-figure" id="briefing-result">
<div class="evidence-heading"><span class="evidence-kicker">THE DRAFT · 02</span><strong>A second attempt at a shorter briefing</strong></div>
<div class="evidence-zoom evidence-zoom-model" role="region" aria-label="Native English model selector" tabindex="0"><svg viewBox="304 707 390 69" role="img" aria-label="English model selector showing DeepSeek V4 Flash · opencode-go"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div>
<div class="evidence-notes"><div><b>01</b><strong>The model for this attempt</strong><span>This shorter version used DeepSeek V4 Flash through OpenCode Go.</span></div><div><b>02</b><strong>Still longer than requested</strong><span>We asked for at most 200 characters and received 264.</span></div></div>
<details class="evidence-detail"><summary>Read the original reply (Chinese)</summary><div class="evidence-zoom" role="region" aria-label="Original Chinese Go reply; scroll sideways on small screens" tabindex="0"><svg viewBox="326 54 570 272" role="img" aria-label="Unaltered Chinese reply with S1-E2 and S3-E1 citations and unresolved questions"><image href="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900"></image></svg></div><p class="evidence-scroll-hint">This task was written in Chinese. On a small screen, scroll sideways to read the reply.</p><div class="evidence-notes"><div><b>03</b><strong>Follow the citations</strong><span>The source numbers lead back to the excerpts we supplied.</span></div><div><b>04</b><strong>Leave room for open questions</strong><span>Some questions need more than these documents can tell us.</span></div></div></details>
<details class="evidence-detail"><summary>View the full conversation screenshot</summary><a href="/blog-figures/first-task/go-briefing-native.png"><img src="/blog-figures/first-task/go-briefing-native.png" width="1280" height="900" alt="Full native English interface with the actual Chinese Go verification reply" loading="lazy" decoding="async"></a></details>
<figcaption>The shorter reply is shown in its original Chinese. <a href="/task-evidence/2026-10-11/briefing-go.txt">Read the full text</a>.</figcaption>
</figure>

## Edit toward the next decision

After combining repeated explanations, we kept this summary. It is our edited version, translated into English:

> Check the maintainer and package first: BotHarness’s DeepSeekBot (deepseekbot) and FeiZhuLulu’s DS Bot (ds-bot) are independent projects, neither official DeepSeek products. The former describes memory, groups and task delegation; the latter emphasizes group coordination. These documents do not establish practical efficiency or cost, so try a small task of your own next. When using a remote model, consider what content will be sent with its requests.

We would treat the first reply as a starting point for discussion. The Bot organizes the material; we decide what to keep and what to ask next. If you want a weekly briefing, try this editing loop first. Collecting new sources and sending scheduled updates need separate trials.

Start with the [installation guide](/en/docs/installation/), or try a coding task next with [our experience adding tests to one function](/en/blog/agent-unit-test-handoff/).

<details class="evidence-detail"><summary>Run details and original records</summary>

We used the [DeepSeekBot v1.2.0 source release](https://github.com/BotHarness/DeepSeekBot/commit/271e056aecd7f10bd71128a78d2ac9acbea898ea) with DSH 0.2.0-rc.1 on Windows, without desktop or browser operation components. Input documents came from the fixed versions linked above.

The first reply used `deepseek-official/deepseek-flash`; the shorter attempt used `opencode-go/deepseek-v4-flash` with the [Windows launcher fix](https://github.com/BotHarness/DeepSeekBot/pull/1410). Both returned private replies, without scheduling work or updating memory. Character counts use the original strings’ UTF-16 lengths.

The briefing, test-writing task and diagnostics together made 22 DeepSeek API requests, at an estimated US$0.0197. This estimate does not include OpenCode Go. Self-hosting also requires maintaining the environment and your model quota.

[Full run record](/task-evidence/2026-10-11/evidence.json) · [Image sources](/blog-figures/first-task/provenance.json)

</details>
