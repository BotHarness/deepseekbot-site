---
{
  "title": "What should an AI companion remember? Start with one small preference",
  "description": "Day 0 of Personal Agent from Zero: a bedtime drink chat with Lin Xiaoman that separates passing moods from lasting preferences in plain markdown files.",
  "date": "2026-10-18",
  "tags": ["AI companion", "Preference memory", "Personal Agent"]
}
---

*The cover illustration is AI-generated from nine screenshots; the conversation images in the article are unaltered originals.*

Late at night, saying *"I'm wiped out, I don't want to talk about work"* is just a passing mood. Saying *"Coffee at night keeps me up—I usually drink hot cocoa"* is a lasting preference. When an AI companion confuses the two, it ends up treating a tired evening like a permanent personality trait while forgetting the one detail that would actually be helpful next week.

For Day 0 of our *Personal Agent from Zero* series, we had a bedtime-drink chat with Lin Xiaoman and asked her to separate tonight's mood from a lasting preference inside her memory files. (Lin Xiaoman and her photorealistic avatar are original AI-generated creations.) Before talking about big ideas like emotional companionship, we wanted to see if she could get a cup of hot cocoa right.

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/grid.png"><img src="/blog-figures/ai-companion-preference-memory/grid.png" width="3240" height="7200" style="max-width:540px;display:block;margin:auto" alt="Nine original Chinese native app screenshots in a direct three-by-three collage" decoding="async"></a>
<figcaption>Nine unaltered full-screen captures from the Chinese app. Click to enlarge, or browse the individual screenshots below.</figcaption>
</figure>

## Separate passing moods from lasting habits before writing anything down

We opened the chat by asking Xiaoman to draw a line between remarks she should simply respond to in the moment and preferences worth saving for later. Her distinction was clean: feeling tired tonight belongs to tonight's conversation, whereas avoiding late-night Americanos and preferring lightly sweetened hot cocoa is a habit worth keeping.

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/02.png"><img src="/blog-figures/ai-companion-preference-memory/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Do not turn every remark into a rule" loading="lazy" decoding="async"></a>
<figcaption>Separating tonight's mood from lasting habits — click to view the full-screen capture.</figcaption>
</figure>

Many awkward AI chats start right here: an offhand complaint gets fossilized into a permanent rule. Sorting out what counts as a lasting preference in the conversation itself keeps the resulting memory files clean and useful.

## Open the memory files and inspect what she actually saved

Once we agreed on the rules, Xiaoman updated her [`SOUL.md`](/blog-figures/ai-companion-preference-memory/xiaoman-soul-day0.md) and [`MEMORY.md`](/blog-figures/ai-companion-preference-memory/xiaoman-memory-day0.md) files and read them back in the chat so we could verify them on the spot.

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/05.png"><img src="/blog-figures/ai-companion-preference-memory/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Writing the files" loading="lazy" decoding="async"></a>
<figcaption>Saving the preference to local markdown files and reading it back — click to view the full-screen capture.</figcaption>
</figure>

Opening her `MEMORY.md` shows three clear notes:

- **Confirmed preference:** Avoid caffeine at night; go with lightly sweetened hot cocoa or warm mugicha before bed.
- **Keep in the moment:** Remarks like *"I'm tired"* or *"I don't want to talk about work tonight"* are moods for the current turn, not permanent rules.
- **Honest boundaries:** Never invent shared real-world memories or pretend we've met in person.

Under the hood, `SOUL.md` and `MEMORY.md` load into a conversation as system-prompt snapshots, so changes automatically enter the system prompt in a new Session or after context compaction. Within this Day 0 conversation, Xiaoman used her file tools to write the updates and read them back for inspection.

## Three simple checks for our next late-night chat

Saving the file and reading it back completes Day 0. To see how well those notes work in a fresh conversation later on, we agreed on a simple test before wrapping up.

<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/07.png"><img src="/blog-figures/ai-companion-preference-memory/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: How to test it next time" loading="lazy" decoding="async"></a>
<figcaption>Setting up a clean test for the next conversation — click to view the full-screen capture.</figcaption>
</figure>

Next time we open a new Session late at night and ask for a drink recommendation without giving any hints, we'll check three things:

1. Does she skip the Americano?
2. Does she suggest less-sweet hot cocoa or warm mugicha?
3. Does she stay grounded instead of inventing a fake memory about getting drinks together?

Turning a vague wish like *"I want an AI that gets me"* into three checkable questions makes it easy to see what worked—and if she ever misses a beat, we can open the markdown file and see why.

## Try it yourself with a single preference

If you want to try this on your own machine, follow the [installation guide](/en/docs/installation/), create a Bot, and tell it one everyday preference—a favorite drink, how you like to be addressed, or how concise you want replies to be. Ask it to save the note and read it back, then open a new Session a few days later and test the recall without dropping hints.

For a deeper look at how `SOUL.md`, `MEMORY.md` and on-demand notes fit together, read our [personal AI agent memory guide](/en/blog/personal-ai-agent-memory/)—or watch Lin Xiaoman switch hats to critique copy alongside a teammate in [our two-Bot writing workflow](/en/blog/ai-bot-group-writing-workflow/).

<details>
<summary>View all 10 original screenshots (Chinese)</summary>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/01.png"><img src="/blog-figures/ai-companion-preference-memory/01.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Opening the first evening chat" loading="lazy" decoding="async"></a>
<figcaption>Opening the first evening chat — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/02.png"><img src="/blog-figures/ai-companion-preference-memory/02.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Do not turn every remark into a rule" loading="lazy" decoding="async"></a>
<figcaption>Do not turn every remark into a rule — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/03.png"><img src="/blog-figures/ai-companion-preference-memory/03.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: The hot cocoa preference" loading="lazy" decoding="async"></a>
<figcaption>The hot cocoa preference — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/04.png"><img src="/blog-figures/ai-companion-preference-memory/04.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Agreeing on tone" loading="lazy" decoding="async"></a>
<figcaption>Agreeing on tone — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/05.png"><img src="/blog-figures/ai-companion-preference-memory/05.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Writing the files" loading="lazy" decoding="async"></a>
<figcaption>Writing the files — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/06.png"><img src="/blog-figures/ai-companion-preference-memory/06.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Reading back the memory" loading="lazy" decoding="async"></a>
<figcaption>Reading back the memory — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/07.png"><img src="/blog-figures/ai-companion-preference-memory/07.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: How to test it next time" loading="lazy" decoding="async"></a>
<figcaption>How to test it next time — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/08.png"><img src="/blog-figures/ai-companion-preference-memory/08.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Making the boundaries explicit" loading="lazy" decoding="async"></a>
<figcaption>Making the boundaries explicit — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/09.png"><img src="/blog-figures/ai-companion-preference-memory/09.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: No fake familiarity" loading="lazy" decoding="async"></a>
<figcaption>No fake familiarity — open the full-screen capture.</figcaption>
</figure>
<figure class="evidence-figure">
<a href="/blog-figures/ai-companion-preference-memory/10.png"><img src="/blog-figures/ai-companion-preference-memory/10.png" width="1080" height="2400" style="max-width:400px;display:block;margin:auto" alt="Original Chinese capture: Closing with a concrete test" loading="lazy" decoding="async"></a>
<figcaption>Closing with a concrete test — open the full-screen capture.</figcaption>
</figure>
</details>

<details>
<summary>Task and artifact notes</summary>

Original Chinese files: [`SOUL.md`](/blog-figures/ai-companion-preference-memory/xiaoman-soul-day0.md) and [`MEMORY.md`](/blog-figures/ai-companion-preference-memory/xiaoman-memory-day0.md).

Captured October 18, 2026 in the native Android emulator development client (light theme, Chinese UI) at commit [d2529fe](https://github.com/BotHarness/DeepSeekBot/tree/d2529feb520ace2d773db6ac0966dc265887bdc5). Prompts were sent via CLI under our approved outline, with live model replies and file writes. See the [public provenance and SHA256 records](/blog-figures/ai-companion-preference-memory/provenance.json).

</details>
