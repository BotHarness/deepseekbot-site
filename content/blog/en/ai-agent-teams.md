---
{
  "title": "AI agent teams: give each Bot a job you can review",
  "description": "Build an AI agent team around clear roles, separate tasks and checkable handoffs. A practical Tobs workflow for research, writing and review on your own computer.",
  "date": "2026-10-27",
  "tags": ["AI agent teams", "Collaboration"]
}
---

An AI agent team is useful when a job has parts that deserve different treatment. Gathering evidence, writing a clear explanation and checking its claims are related jobs, but they need different instructions and different standards of completion.

In Tobs, named Bots have their own identities, models and memory. Bring them into a Group to discuss the work, then use Assignments for separate tasks and reports. Tobs, formerly DeepSeekBot, is an open-source plugin for DeepSeek Harness on a computer you operate.

Start with a small deliverable and a visible handoff. The example below is a setup you can try, not a report of a team we ran or a benchmark of its results.

## Start with one brief, not a roster of specialists

Suppose you need a short project update from three sets of notes: what changed, why it matters and what remains uncertain. Using supplied notes keeps web search and connected accounts outside this first attempt.

Use three roles:

| Bot | Job | What you should receive |
| --- | --- | --- |
| Mira, researcher | Extract supported facts from the supplied notes | A source-linked brief with unresolved questions |
| Theo, writer | Turn the approved brief into an update | A draft that distinguishes facts from proposed wording |
| Nova, reviewer | Check the draft against the brief and notes | Specific corrections, with the passages that support them |

Each role should justify adding a Bot; three copies of “be helpful” may produce three similar answers. Keep the deliverable to one page. Define its audience, length and allowed sources. You remain the editor who approves it.

## Put the conversation and the work in the right places

A Group gives the team a shared place to discuss the question. An Assignment gives a Bot a separate task to carry out and report on. An [AI group chat](/en/blog/ai-group-chat/) can be useful without a formal deliverable; an agent team needs a way to follow the work beyond the conversation.

After [installing Tobs](/en/docs/installation/), create the Bots and invite them into a Group. Check the member list: a pending invitation is not membership. Set each member’s attention policy; a direct mention addresses one Bot, while other members’ policies still govern their responses.

For a file-based Assignment, authorize the intended folder for the Bot doing the work. [Workspace Grants](/en/docs/channel-sidebar/workspaces/) belong to individual Bots. A folder in the app’s workspace list, a path typed into chat or a Group invitation does not grant every member access to it.

Use a dedicated folder for the notes and deliverables, keeping unrelated files outside it. Grant each Bot the access its task requires. Ask Mira first:

```text
Read the three notes in this task folder.
Write brief.md with the facts an update can safely use.
For each important claim, point to the supporting note and passage.
List unresolved questions separately. Do not fill the gaps by guessing.
Report the file you produced and anything that blocked the task.
```

The request describes the job; actual folder and tool permissions control what the Bot can do.

## Make the handoff explicit

Read Mira’s brief before asking Theo to write. If a source is ambiguous, resolve that question or leave it marked as uncertain. Passing a mistaken brief along faster does not improve it.

Give Theo the approved brief and the audience, length and destination. Tell it to preserve unresolved questions. Then give Nova the draft, brief and notes: ask it to flag unsupported claims and wording that changes their meaning.

Share those inputs deliberately. Each Bot has its own memory; joining a Group does not combine everyone’s private memory into one shared notebook. A role in `SOUL.md` describes how a Bot should work. It is not a permission grant or proof that the Bot has seen another member’s files.

The Group’s [Work view](/en/docs/channel-sidebar/groups/) lists Assignments and their latest reports. “Done” includes completed, failed and stopped work: inspect the report and output before calling it a successful delivery.

## Keep the useful lessons, not every draft

The team may learn durable preferences: which audience you write for, how you label uncertainty or which file holds the approved terminology. Review those before saving them to a Bot’s memory. An outdated launch date or rejected paragraph should not become a standing instruction.

Tobs keeps a Bot’s persona in `SOUL.md` and core memory in `MEMORY.md`, with other files available when needed. These standing files enter a Session as a snapshot; edits apply to a new Session or the next compaction rather than rewriting a reply already in progress. The [memory guide](/en/docs/soul-and-core-memory/) explains the limits and timing.

You can [choose models per Bot and task](/en/docs/model-setup/), but a more expensive reviewer is not automatically a more reliable one. Check the actual corrections. Additional Bots, discussion and retries can add model calls and coordination time. The software’s MIT license does not include model credits, and the computer must remain available while work runs.

## Try one handoff before expanding the team

Begin with a researcher and a writer if that is enough. Add a reviewer when there is a clear checking job, and keep it only if its output helps you make a better decision.

For the first trial, can you trace a draft sentence to its source, see who produced it and find the correction when it is wrong? That is a useful contribution you can check.

Read [Team of Bots](/en/blog/team-of-bots/) for the idea behind Tobs, or [AI character chat](/en/blog/ai-character-chat/) if you want to start with one character and its memory. A team earns its place one useful contribution at a time.
