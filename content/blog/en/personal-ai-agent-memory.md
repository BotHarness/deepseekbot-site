---
{
  "title": "A personal AI agent with memory and a Bot team",
  "description": "Keep project context in inspectable Git-backed memory, give personal Bots distinct roles, and extend DeepSeekBot with compatible DeepSeek Harness plugins.",
  "date": "2026-10-12",
  "tags": ["Personal agents", "Memory"]
}
---

When you come back to a project next week, you want your AI assistant to remember which question you were investigating, which sources you trusted, and what still needs checking. A personal AI agent with persistent memory keeps that context in plain files you can inspect and edit, rather than forcing you to reconstruct your train of thought from old chat transcripts.

DeepSeekBot is an MIT-licensed, open-source GrokBot alternative that installs as a plugin inside DeepSeek Harness (DSH). Its personal Bots—PersonaBots—each have their own identity and Git-backed memory. You can chat with a single Bot one-on-one, or bring several into a shared Group as your personal Bot team.

The easiest way to get started is to give one Bot a small, recurring job, and only add more Bots when a clear division of labor helps. Below, we walk through how to set up a project reading-notes workflow from scratch.

## Give one personal agent a job worth remembering

Suppose you are evaluating tools for an upcoming project. This week you read three technical overviews; next week you want to pick up right where you left off. A good research Bot should hold onto your core question, your constraints, and your sources—while keeping tentative observations separate from decisions you have already signed off on.

After [installing DeepSeekBot](/en/docs/installation/), switch to Bot mode and create a PersonaBot. Give it a name and a focused role: *"Help me maintain source-linked reading notes for this project."* You can paste in the reading material directly without connecting external accounts or granting broad filesystem permissions.

<figure class="evidence-figure" id="bot-conversations">
<div class="evidence-heading"><span class="evidence-kicker">BOT MODE · 01</span><strong>Keep a separate conversation with each Bot</strong></div>
<a href="/blog-figures/first-task/product-overview-en.jpg"><img src="/blog-figures/first-task/product-overview-en.jpg" width="2880" height="1800" alt="DeepSeekBot English Bot mode: separate conversations with Mira, Nova, Theo, Juniper and Kai in the left sidebar, with Mira's private conversation open; sample dialogue" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Choose a Bot</strong><span>Each name opens that Bot's own conversation.</span></div><div><b>02</b><strong>Talk privately</strong><span>The center shows the selected Bot's DM.</span></div><div><b>03</b><strong>Inspect its memory</strong><span>The right sidebar shows memory for this Bot.</span></div></div>
<figcaption>The Bot-mode interface with sample dialogue. Click the screenshot to enlarge.</figcaption>
</figure>

DeepSeekBot separates identity from memory: `SOUL.md` defines who the Bot is and how it approaches work, while `MEMORY.md` stores core facts and acts as an index to detailed notes in other files. Keep in mind that writing *"be careful"* in `SOUL.md` shapes the Bot's persona, but actual security boundaries come from your tool and workspace permission settings.

For a reading-notes setup, you can organize the Bot's memory repository around three files:

```text
SOUL.md             Research role and working preferences
MEMORY.md           Current question and approved constraints
reading-notes.md    Source links, dated observations and open questions
```

As a general rule, keep passwords, API keys, and unrelated personal data out of memory files.

## Make persistent memory something you can inspect

Persistent memory means saved notes survive across conversations. It does not mean every chat message automatically turns into an accurate fact, or that every file in the repository is stuffed into every model call.

Under the hood, `SOUL.md` and `MEMORY.md` are loaded into a Session as a size-bounded snapshot, while detailed files like `reading-notes.md` are read on demand. Because editing a file on disk doesn't rewrite the active snapshot mid-conversation, it pays to keep `MEMORY.md` concise, use it as a pointer to your detailed notes, and test what the Bot recalls by opening a fresh Session.

DeepSeekBot's Git Memory sidebar lets you browse files, commits, and diffs directly. After asking the Bot to save a project decision, glance at the diff: if it recorded a rough guess as a settled fact, you can edit the file directly rather than arguing with the Bot in chat. Git history makes every change transparent so you stay in control of what the Bot remembers.

Here is a starter prompt you can try with material you're comfortable sharing:

```text
Use only the three source passages I provide below.
Draft reading notes for my project, with a source for each important claim.
Separate observations, my confirmed constraints and unresolved questions.
Show the proposed memory update first; wait for my confirmation before saving it.
Do not post anything or connect external accounts.
```

Asking the model to wait for confirmation is a helpful workflow habit, alongside keeping tool and workspace permissions scoped to just what the task needs. Our [three-source briefing walkthrough](/en/blog/first-agent-briefing/) shows how keeping citations attached to claims makes human review much faster.

When you open a new chat next week, ask the Bot to restate your project question and cite the notes it used, then check whether any constraints have changed. For more on working with memory repositories, see [Memory files](/en/docs/channel-sidebar/memory-files/) and [Memory evolution](/en/docs/channel-sidebar/memory-evolution/).

## Grow into a personal Bot team when distinct roles help

Adding a second or third Bot makes sense when a task benefits from distinct perspectives. For the reading-notes workflow, a three-Bot team might split the work like this:

- **Researcher**: Extracts source-linked observations from the material you supply.
- **Reviewer**: Challenges unsupported claims and flags outdated assumptions.
- **Coordinator**: Synthesizes the reviewed notes into a clean draft for your sign-off.

Because each PersonaBot maintains its own identity and private memory, you can bring them together in a Group and `@` mention whichever Bot you want to hear from next. Make sure to share the prompt and approved excerpts in the Group chat so everyone is working from the same page.

<figure class="evidence-figure" id="bot-group">
<div class="evidence-heading"><span class="evidence-kicker">BOT GROUP · 02</span><strong>Bring several Bots into one conversation</strong></div>
<a href="/blog-figures/personal-agent-memory/group-en.jpg"><img src="/blog-figures/personal-agent-memory/group-en.jpg" width="2880" height="1800" alt="DeepSeekBot English Bot mode with Observatory Studio selected: Mira, Theo and Nova reply under distinct names and avatars, and the Group member list is visible on the right; sample dialogue" loading="lazy" decoding="async"></a>
<div class="evidence-notes"><div><b>01</b><strong>Open the Group</strong><span>The Group sits alongside individual Bot conversations.</span></div><div><b>02</b><strong>Follow each reply</strong><span>Mira, Theo and Nova keep their own names and avatars.</span></div><div><b>03</b><strong>See who's involved</strong><span>The member panel lists the Human and participating Bots.</span></div></div>
<details class="evidence-detail"><summary>Zoom into the Group replies</summary><div class="evidence-zoom" role="region" aria-label="Enlarged sample Group conversation" tabindex="0"><svg viewBox="560 170 1680 920" role="img" aria-label="Mira, Theo and Nova replying in the same Group"><image href="/blog-figures/personal-agent-memory/group-en.jpg" width="2880" height="1800"></image></svg></div></details>
<figcaption>Three Bots collaborating in a shared Group under their own names and avatars (sample UI dialogue).</figcaption>
</figure>

Note that Groups and Assignments serve different purposes: a Group lets multiple Bots converse in a shared room, whereas an Assignment delegates a standalone task to a single Bot in its own Session with a final report (and requires an explicit Workspace directory grant). Inviting a Bot into a Group does not grant it access to your local project folders.

When testing a Group for the first time, try having the reviewer critique a single paragraph and see if the feedback actually sharpens the draft. Adding more Bots naturally increases coordination turns and model API calls, so keep the team lean. You can read more about core vs. optional components in the [capability guide](/en/docs/capabilities/).

## Extend your team through DeepSeek Harness plugins

Because DeepSeekBot runs inside a DSH Profile, you can install it alongside other compatible DSH plugins. That open-source ecosystem lets you add connectors and tools as your workflow grows, rather than locking you into a fixed feature set.

If pasting reading excerpts into chat covers your needs, start there. When you do add a new plugin or connector, check its version, credentials, and host access scope, enable only the actions you need, and test it with a small read-only request first.

Note that the published npm package **DeepSeekBot 1.2.0** does not bundle the optional Computer or Browser GUI automation packages—and a reading-notes workflow doesn't need them anyway. Running self-hosted simply means you manage your own host environment and model API quota, and background tasks run while your host machine is online.

## Four quick checks before relying on your setup

Before making this workflow part of your weekly routine, run through four quick checks:

1. Can you easily locate the saved project question in the sidebar and fix an inaccurate note?
2. In a fresh Session, does the Bot cite the right saved notes without making up sources?
3. In a Group chat, do the Bots stick to their roles so you can tell who contributed what?
4. Are tool permissions and Workspace grants scoped tightly to the task, leaving external actions for your approval?

If the first two checks feel shaky, tune the single-Bot memory loop before adding more Bots to the room. And if you are still weighing different agent tools, check out our [personal AI agents comparison](/en/blog/personal-ai-agents-comparison/).

<details>
<summary>Product sources and release scope</summary>

Verified on October 12, 2026 against the [DeepSeekBot 1.2.0 package README](https://unpkg.com/deepseekbot@1.2.0/README.md), [package configuration](https://unpkg.com/deepseekbot@1.2.0/cordis.im.patch.yml), and [release-era memory guide](https://github.com/BotHarness/DeepSeekBot/blob/271e056aecd7f10bd71128a78d2ac9acbea898ea/docs/soul-and-core-memory.md), covering Bot identity, Git Memory, Groups, Workspace-scoped Assignments, and plugin compatibility. See also the [DeepSeekBot repository](https://github.com/BotHarness/DeepSeekBot) and [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

</details>
