---
{
  "title": "Two AI coworkers edit one post: a real group-chat writing workflow",
  "description": "One Bot drafts, another challenges the copy, and a human reviews the result. A Day 0 writing task with real mentions, revisions and saved files.",
  "date": "2026-10-18",
  "tags": ["AI writing workflow", "Personal Agent"]
}
---

*The cover illustration is AI-generated from nine screenshots; the conversation images in the article are unaltered originals.*

When Lin Xiaoman read the draft titles, she didn't offer polite praise. She pointed out two concrete problems right away: some of the titles were over the character limit, and the claim about "the fourth revision" was completely made up. Zhou Yuheng owned the mistakes and rewrote the copy. Compared with two AI coworkers taking turns telling each other "great idea!", that specific pushback was the exact kind of collaboration we wanted to see.

The assignment itself was small: turn the first day of our *Personal Agent from Zero* diary into a Xiaohongshu post. Two Bots discussed the draft inside a shared Group and produced both a saved post and a follow-up tracking sheet, while we set the brief, guided the prompts and handled final editorial review.

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/grid.png"><img src="/blog-figures/ai-bot-group-writing-workflow/grid.png" width="3240" height="7200" style="max-width:540px;display:block;margin:auto" alt="Nine original Chinese native app screenshots in a direct three-by-three collage" decoding="async"></a>
<figcaption>Nine unaltered full-screen captures from the Chinese app. Click to enlarge, or browse the individual screenshots below.</figcaption>
</figure>

## Give the writer and the reviewer different jobs

We asked Zhou Yuheng to draft and save the copy, and told Lin Xiaoman to read it like a skeptical reader: what sounded like a stiff product pitch, which sentences dragged, and where did the draft need a concrete example? (Both characters and their photorealistic avatars are original AI-generated personas.)

Our ground rules were simple: this is Day 0, so don't pretend we've finished a hundred-day experiment; pitch three short titles; and skip hollow promises like "understands me completely" or "doubles your productivity." Even with those guardrails, the first pass blew past the title length limit and invented a four-round revision history. Xiaoman caught both, and Yuheng revised the third title to reflect the single round of edits that had actually taken place.

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/02.png"><img src="/blog-figures/ai-bot-group-writing-workflow/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Challenging the claims" loading="lazy" decoding="async"></a>
<figcaption>Pushing back on the first draft — click to view the full-screen capture.</figcaption>
</figure>

Splitting the work into two roles didn't magically prevent mistakes, but it gave the room a built-in second opinion: one Bot focused on moving the draft forward, while the other had a clear mandate to question shaky claims.

## Did the `@` handoffs actually improve the file?

In the chat log, you can watch Xiaoman `@`-mention Yuheng to ask for a specific rewrite, and Yuheng reply directly to her feedback. Those are native Bot mentions inside the Group.

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/04.png"><img src="/blog-figures/ai-bot-group-writing-workflow/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: A real Bot mention handoff" loading="lazy" decoding="async"></a>
<figcaption>Handing off specific edits with @-mentions — click to view the full-screen capture.</figcaption>
</figure>

The final saved draft—titled *"Three of us edited one post. Who gets the final say?"*—shows three clear improvements from their exchange:

- A winding, multi-clause sentence was tightened into the much punchier: *"Remembering it doesn't mean you'll pick up the thread next time."*
- *"Raising two Personal Agents"* was softened to *"two AI companions,"* dropping the product-marketing jargon.
- An inaccurate line claiming *"no scripts were involved"* was cut—since we did use scripts to feed in the prompts—and replaced with a straightforward description of the separate chats, draft handoff and group review.

You can read the [saved Chinese draft](/blog-figures/ai-bot-group-writing-workflow/workroom-day0.md) directly (the in-app file preview screenshot shows an earlier pass, while the linked file reflects the final saved text). Saving the markdown file completes the drafting handoff, leaving final human review before anything goes live on a social account.

## Trimming the follow-up sheet from five columns to three

After the post was saved, we asked Yuheng to set up a simple tracking sheet so we can check later whether the Bots' memory actually saves us time on future posts. Yuheng's first version had five columns. Xiaoman pushed back that five columns felt like bureaucratic busywork, so they trimmed it to three essentials: what the new task is, whether old instructions had to be repeated, and what still needed a rewrite.

<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/08.png"><img src="/blog-figures/ai-bot-group-writing-workflow/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Cutting the sheet to three fields" loading="lazy" decoding="async"></a>
<figcaption>Cutting the tracking table down to three columns — click to view the full-screen capture.</figcaption>
</figure>

The [follow-up sheet](/blog-figures/ai-bot-group-writing-workflow/followup-day0.md) is saved and ready, with the future results column intentionally left blank until we run the next task.

They also split the closing question in two: readers get an approachable prompt (*"What small thing do you wish you didn't have to explain every time?"*), while our internal test question—whether the Bots will need fewer reminders on the next assignment—stays in our working notes.

## What we took away from Day 0

By the end of the session, we had a tighter post, a leaner follow-up sheet, and a clear look at the kinds of mistakes a second Bot can catch: invented revision counts, blown length limits, and overstated claims. Running two Bots in a group does take a few extra turns and model calls, but giving one of them a dedicated editorial eye made the revision loop much sharper than a single pass.

If you want to try a two-Bot writing room yourself, start with the [installation guide](/en/docs/installation/), get one writer Bot working, and then invite a second Bot into a Group with a clear brief to challenge the copy. Start with a single paragraph and save the output to a local file you can inspect.

For a deeper look at how Bot teams and file-based memory work under the hood, check out our [personal AI agent memory guide](/en/blog/personal-ai-agent-memory/). This Day 0 draft gives us a clean baseline for our next test.

<details>
<summary>View all 10 original screenshots (Chinese)</summary>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/01.png"><img src="/blog-figures/ai-bot-group-writing-workflow/01.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Choosing titles" loading="lazy" decoding="async"></a>
<figcaption>Choosing titles — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/02.png"><img src="/blog-figures/ai-bot-group-writing-workflow/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Challenging the claims" loading="lazy" decoding="async"></a>
<figcaption>Challenging the claims — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/03.png"><img src="/blog-figures/ai-bot-group-writing-workflow/03.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: An early draft" loading="lazy" decoding="async"></a>
<figcaption>An early draft — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/04.png"><img src="/blog-figures/ai-bot-group-writing-workflow/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: A real Bot mention handoff" loading="lazy" decoding="async"></a>
<figcaption>A real Bot mention handoff — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/05.png"><img src="/blog-figures/ai-bot-group-writing-workflow/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: The earlier saved file" loading="lazy" decoding="async"></a>
<figcaption>The earlier saved file — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/06.png"><img src="/blog-figures/ai-bot-group-writing-workflow/06.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Planning a follow-up" loading="lazy" decoding="async"></a>
<figcaption>Planning a follow-up — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/07.png"><img src="/blog-figures/ai-bot-group-writing-workflow/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Too many fields" loading="lazy" decoding="async"></a>
<figcaption>Too many fields — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/08.png"><img src="/blog-figures/ai-bot-group-writing-workflow/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Cutting the sheet to three fields" loading="lazy" decoding="async"></a>
<figcaption>Cutting the sheet to three fields — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/09.png"><img src="/blog-figures/ai-bot-group-writing-workflow/09.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: A question for readers" loading="lazy" decoding="async"></a>
<figcaption>A question for readers — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-bot-group-writing-workflow/10.png"><img src="/blog-figures/ai-bot-group-writing-workflow/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Confirming the final delivery" loading="lazy" decoding="async"></a>
<figcaption>Confirming the final delivery — open the full-screen capture.</figcaption>
</figure>
</details>

<details>
<summary>Task and artifact notes</summary>

Original Chinese artifacts: [final post](/blog-figures/ai-bot-group-writing-workflow/workroom-day0.md) and [follow-up sheet](/blog-figures/ai-bot-group-writing-workflow/followup-day0.md).

Captured October 18, 2026 in the native Android emulator development client (light theme, Chinese UI) at commit [d2529fe](https://github.com/BotHarness/DeepSeekBot/tree/d2529feb520ace2d773db6ac0966dc265887bdc5). Prompts were sent via CLI under our approved outline, with live model replies and file writes. See the [public provenance and SHA256 records](/blog-figures/ai-bot-group-writing-workflow/provenance.json).

</details>
