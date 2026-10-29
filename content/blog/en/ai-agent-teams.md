---
{
  "title": "AI agent teams: give each Bot a job you can review",
  "description": "Build an AI agent team around clear roles, separate tasks and checkable handoffs. A practical Tobs workflow for research, writing and review on your own computer.",
  "date": "2026-10-27",
  "tags": ["AI agent teams", "Collaboration"]
}
---

An AI agent team earns its keep when a job has stages that call for different mindsets. Pulling verified facts from rough notes, turning them into readable prose, and fact-checking the draft are closely related, yet each step works best with its own instructions and definition of done.

In Tobs, each Bot has its own name, model and memory. You can bring several Bots into a Group to talk through an approach, then hand out Assignments when you want individual Bots to do focused work and report back. Tobs (formerly DeepSeekBot) runs as an open-source plugin on DeepSeek Harness, right on your own computer.

You don't need a sprawling org chart on day one. Start with a single deliverable and make the handoffs visible. Below is a practical workflow you can try on your own machine to see how research, writing and review fit together.

## Start with one brief, not a roster of specialists

Suppose you have three sets of rough project notes and want to turn them into a short status update: what changed, why it matters, and what is still up in the air. Working from local notes keeps the first run simple—no web search or external accounts required.

Here is a clean three-way split:

| Bot | Job | What you review |
| --- | --- | --- |
| Mira, researcher | Pull supported facts from the raw notes | A source-linked brief that separates facts from open questions |
| Theo, writer | Turn the approved brief into a readable update | A draft that stays faithful to the brief's scope |
| Nova, reviewer | Check the draft against both the brief and the notes | Specific corrections backed by exact passages |

Every Bot you add should have a distinct job. If you give three Bots the same vague prompt to "be helpful," you'll mostly get three variations of the same answer—and still end up doing the synthesis yourself.

Keep your first deliverable to a single page. Set the target audience, length and allowed sources upfront, while keeping the final editorial sign-off for yourself.

## Use Groups for discussion and Assignments for focused work

A Group gives your Bots a shared room to hash out ideas. An Assignment gives a single Bot a self-contained job to execute and report on. While an [AI group chat](/en/blog/ai-group-chat/) is great for open-ended brainstorming, an agent team needs a clear way to track deliverables outside the chat stream.

After [installing Tobs](/en/docs/installation/), create your Bots and invite them into a Group. Check the member list to make sure they have joined, then configure each Bot's attention policy so casual messages don't wake the whole room at once. When you want a specific Bot to chime in, mention it with `@`.

Whenever an Assignment touches local files, grant the working Bot access to that folder. In Tobs, [Workspace Grants](/en/docs/channel-sidebar/workspaces/) are configured per Bot—typing a path in chat or inviting a Bot to a Group doesn't automatically hand out file permissions to everyone in the room.

Create a dedicated task folder for your three notes and the upcoming outputs, leaving unrelated files outside. Once Mira has access to the folder, hand her the first Assignment:

```text
Read the three notes in this task folder.
Write brief.md with the facts an update can safely use.
For each important claim, point to the supporting note and passage.
List unresolved questions separately. Do not fill the gaps by guessing.
Report the file you produced and anything that blocked the task.
```

## Make every handoff explicit

Read Mira's brief before passing the baton to Theo. If a point in the notes is ambiguous, settle it right there or keep it explicitly marked as an open question. Passing a flawed brief downstream faster only buries the mistake in smoother prose.

When you assign the draft to Theo, point it to the approved `brief.md`, specify the audience, length and output filename, and remind it not to turn open questions into settled announcements. Once the draft is ready, hand Nova the draft, the brief and the original notes, asking it to flag any unsupported claims or shifts in meaning.

Be explicit about which files each Bot should read. Every Bot in Tobs maintains its own private memory repository—joining a Group doesn't merge their memories into a single shared notebook, and describing a role in `SOUL.md` doesn't mean the Bot has automatically read files produced by another teammate.

You can track all delegated tasks in the Group's [Work view](/en/docs/channel-sidebar/groups/), which shows each Assignment and its latest report. When a task moves to "Done," take a moment to open the report and check the output file, since completed, failed and manually stopped runs all land in the finished list.

## Save lasting conventions, not temporary drafts

Over a few runs, you'll uncover habits worth keeping: who your usual audience is, how you like to flag uncertainty, or which file holds your approved terminology. Review those lessons before saving them into a Bot's memory—you don't want a one-off launch date or a rejected paragraph turning into a permanent rule.

Tobs stores a Bot's persona and operating principles in `SOUL.md` and its core facts in `MEMORY.md`, with additional notes read on demand. Because standing files are loaded into a Session as a snapshot, edits take effect in new Sessions or after the next context compaction (see the [Soul and Core Memory guide](/en/docs/soul-and-core-memory/) for details).

You can also [assign different models to different Bots or tasks](/en/docs/model-setup/). In practice, a pricier model isn't automatically a sharper reviewer—judge each setup by the actual corrections it catches, and keep in mind that extra Bots and review rounds add model calls and runtime.

## Nail one handoff before growing the team

If a researcher and a writer are enough to get the job done, start with just the two of them. Bring in a reviewer when you have a concrete checking step you'd rather not do by hand, and keep the role only if its catches genuinely save you time.

A good first test is simple: can you trace every claim in the draft back to a source note, see which Bot wrote what, and get actionable fixes when something drifts? Nailing that loop with two or three Bots beats managing a crowded room of vague roles every time.

To learn more about the philosophy behind Tobs, read [Team of Bots](/en/blog/team-of-bots/)—or if you'd rather start by shaping a single persona with long-term memory, check out our [AI character chat guide](/en/blog/ai-character-chat/).
