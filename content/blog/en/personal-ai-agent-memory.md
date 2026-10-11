---
{
  "title": "A personal AI agent with memory and a Bot team",
  "description": "Keep project context in inspectable Git-backed memory, give personal Bots distinct roles, and extend DeepSeekBot with compatible DeepSeek Harness plugins.",
  "date": "2026-10-12",
  "tags": ["Personal agents", "Memory"]
}
---

When you return to a project next week, you want your AI assistant to know which question you were investigating, which sources you trusted and what still needs checking. A personal AI agent with memory can keep that context in persistent files, so you can inspect and correct it rather than reconstruct the project from a chat transcript.

DeepSeekBot is an MIT-licensed, open-source GrokBot alternative installed as a plugin in DeepSeek Harness (DSH). Its personal Bots, called PersonaBots, have their own identities and Git-backed memory. You can work with one in a private conversation or bring several into a Group as your personal Bot team.

Start with one Bot and a small recurring job. Add another role when you can explain what it should contribute. Here is a proposed workflow for keeping project reading notes; it is an example to try, not a task result or a claim that an autonomous team has completed it.

## Give one personal agent a job worth remembering

Imagine you are choosing a tool for a side project. This week you read three introductions; next week you want to check what changed. A useful research Bot should retain the question, your constraints and the sources, while keeping tentative conclusions separate from decisions you approved.

After [installing DeepSeekBot](/en/docs/installation/), open Bot mode and create a PersonaBot. Give it a name and a narrow role: “Help me keep source-linked reading notes for this project.” You can supply the material yourself, without connecting an account or granting broad access to your files.

<figure class="evidence-figure" id="bot-conversations">
<div class="evidence-heading"><span class="evidence-kicker">BOT MODE · 01</span><strong>Keep a separate conversation with each Bot</strong></div>
<a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot English Bot mode: separate conversations with Mira, Nova, Theo, Juniper and Kai in the left sidebar, with Mira's private conversation open; sample dialogue" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Choose a Bot</strong><span>Each name opens that Bot's own conversation.</span></div><div><b>02</b><strong>Talk privately</strong><span>The center shows the selected Bot's DM.</span></div><div><b>03</b><strong>Inspect its memory</strong><span>The right sidebar shows memory for this Bot.</span></div></div>
<figcaption>The actual Bot-mode interface with sample dialogue. Click the screenshot to enlarge.</figcaption>
</figure>

DeepSeekBot distinguishes identity from memory. `SOUL.md` describes who the Bot is and how it should work. `MEMORY.md` holds key facts and an index to detailed notes in other files. Putting “be careful” in its Soul helps describe the role, but does not enforce a security boundary.

For this example, ask for a structure like this inside the Bot's memory:

```text
SOUL.md             Research role and working preferences
MEMORY.md           Current question and approved constraints
reading-notes.md    Source links, dated observations and open questions
```

These filenames are a suggested organization, not files this tutorial has created for you. Keep passwords, private keys and unrelated personal information out of the notes.

## Make persistent memory something you can check

Persistent memory means saved information survives a conversation. It does not mean every message becomes a correct memory, every old detail reaches the next model call, or the Bot always recalls the right fact.

Soul and Core Memory enter a Session as a snapshot with size limits; detailed files are read when needed. Editing a file does not automatically rewrite that active snapshot. Keep the core short and point it at the detailed notes, then test recall in a new Session rather than assuming the entire memory repository is always in context.

DeepSeekBot's Git Memory sidebar lets you inspect files, commits and diffs. For the reading-notes example, review the actual change after asking the Bot to retain a decision. If it saved an inference as a fact, correct the file instead of hoping another message will undo it. A Git history makes changes inspectable; it does not validate the contents for you.

Try this request with material you are allowed to share:

```text
Use only the three source passages I provide below.
Draft reading notes for my project, with a source for each important claim.
Separate observations, my confirmed constraints and unresolved questions.
Show the proposed memory update first; wait for my confirmation before saving it.
Do not post anything or connect external accounts.
```

That last instruction is a request to the model, not a guaranteed approval gate. Keep actual tools and host permissions narrow as well. Check whether the Bot wrote anything before approval, and stop if it did. Our [three-source briefing walkthrough](/en/blog/first-agent-briefing/) shows why sources and output still need human review.

At the next conversation, ask the Bot to restate the project question and cite its saved notes. Check that the sources and constraints are still current. Retention and successful recall are separate things to test. For file details, see [Memory files](/en/docs/channel-sidebar/memory-files/) and [Memory evolution](/en/docs/channel-sidebar/memory-evolution/).

## Grow into a personal Bot team when roles help

A second Bot is useful when you need another clearly defined job. For the same reading-notes project, you might use:

- A researcher to collect source-linked observations from supplied material.
- A reviewer to challenge unsupported claims and flag stale information.
- A coordinator to turn the reviewed notes into a draft for you to approve.

Each PersonaBot keeps its own identity and memory. Invite the relevant Bots into a Group and @ the one you want to respond. Share the question and the approved material explicitly; do not assume that one Bot knows everything another Bot has saved.

<figure class="evidence-figure" id="bot-group">
<div class="evidence-heading"><span class="evidence-kicker">BOT GROUP · 02</span><strong>Bring several Bots into one conversation</strong></div>
<a href="/blog-figures/personal-agent-memory/group-en.jpg"><img src="/blog-figures/personal-agent-memory/group-en.jpg" width="2880" height="1800" alt="DeepSeekBot English Bot mode with Observatory Studio selected: Mira, Theo and Nova reply under distinct names and avatars, and the Group member list is visible on the right; sample dialogue" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Open the Group</strong><span>The Group sits alongside individual Bot conversations.</span></div><div><b>02</b><strong>Follow each reply</strong><span>Mira, Theo and Nova keep their own names and avatars.</span></div><div><b>03</b><strong>See who's involved</strong><span>The member panel lists the Human and participating Bots.</span></div></div>
<details class="evidence-detail"><summary>Zoom into the Group replies</summary><div class="evidence-zoom" role="region" aria-label="Enlarged sample Group conversation" tabindex="0"><svg viewBox="560 170 1680 920" role="img" aria-label="Mira, Theo and Nova replying in the same Group"><image href="/blog-figures/personal-agent-memory/group-en.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>Three Bots replying in a shared Group, shown with sample dialogue. This is a UI example, not the reading-notes task result.</figcaption>
</figure>

A Group conversation and an Assignment are different arrangements. Groups let independently identified Bots collaborate in a shared conversation. Assignments delegate independent work with a separate Session and report, and require a Workspace grant. A Group invitation is not permission to work in any directory.

For a first trial, ask the reviewer to check one paragraph, then read its reply yourself. Keep publishing, credential changes and broader file access outside the trial. More Bots add coordination and model calls; they do not guarantee better answers or unlimited autonomy. The [capability guide](/en/docs/capabilities/) separates the released package from optional components.

## Extend the team through DeepSeek Harness

DeepSeekBot runs inside a DSH Profile and can be installed alongside compatible DSH plugins. That open-source plugin ecosystem gives you a way to add capabilities as your actual workflow needs them, rather than treating the Bot's starting tools as a fixed ceiling.

If supplied reading material is enough, begin there. Before adding a connector or another tool, check its version, required credentials, exposed actions and host access. Enable only what the job needs, then try a small read-only request. Some DSH plugins may not yet be compatible; sharing a Profile does not prove every combination works.

The checked npm release, DeepSeekBot 1.2.0, does **not** include the optional Computer or Browser Bundles. This reading-notes example does not require them. Self-hosting also means maintaining the host and configuration; model/API usage has its own cost. MIT licensing does not make those services free, and background work depends on the host remaining available.

## What to check before you rely on the team

1. Can you find the saved project question and correct a mistaken memory?
2. In a later conversation, can the Bot use the right notes without inventing a source?
3. Do Group replies keep the intended roles, and can you see what each Bot contributed?
4. Are tool access and Workspace grants limited to this job, with external actions left for your approval?

If the first two checks fail, fix the one-Bot workflow before expanding the team. If you are still choosing between products, use the existing [personal AI agents comparison](/en/blog/personal-ai-agents-comparison/) rather than treating this setup guide as a benchmark.

<details>
<summary>Product sources and release scope</summary>

Checked on October 12, 2026 against the [DeepSeekBot 1.2.0 package README](https://unpkg.com/deepseekbot@1.2.0/README.md), [package configuration](https://unpkg.com/deepseekbot@1.2.0/cordis.im.patch.yml) and [release-era memory guide](https://github.com/BotHarness/DeepSeekBot/blob/271e056aecd7f10bd71128a78d2ac9acbea898ea/docs/soul-and-core-memory.md). They document identity, Git Memory, Groups, Workspace-granted Assignments and the compatibility caveat. See also the [DeepSeekBot repository](https://github.com/BotHarness/DeepSeekBot) and [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The prompts and reading-notes organization above are proposed examples, not recorded execution evidence.

</details>
