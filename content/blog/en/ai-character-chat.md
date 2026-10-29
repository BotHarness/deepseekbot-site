---
{
  "title": "AI character chat with a memory you can inspect",
  "description": "Create an original AI character in Tobs, give it a distinct voice, and keep its memories in files you can read and edit. Start on your computer and continue from your phone.",
  "date": "2026-10-27",
  "tags": ["AI character chat", "Memory", "Guide"]
}
---

It doesn't take much for an AI character to sound convincing in the first five minutes. The real test comes later: does it know which details belong to the story and which belong to your real life? Can it tell a passing mood from a lasting preference—and when it gets something wrong, can you actually fix what it remembered?

In Tobs, every character is a Bot with its own identity, persona and file-based memory. Instead of hiding memory inside an opaque black box, Tobs stores notes as plain files on your computer—backed by Git—so you can open them, read what the character kept, and edit anything that drifted off course. If you enjoy shaping a character over time and are happy running DeepSeek Harness on your own machine, this setup puts you in the director's chair.

Your character can stay in a one-on-one chat or join a wider [team of Bots](/en/blog/team-of-bots/). The best way to start is with one character and one ordinary scene before building an entire world.

## Give the character a voice you can recognize

Let's start with an original character: Mina, a 30-year-old botanical garden caretaker who works the evening shift and sketches new leaves in a pocket notebook. She notices small physical details, finds grand Latin names for tiny plants quietly amusing, and takes a beat before answering questions. Specific habits like these give the model much more to work with than a generic instruction to "be friendly."

In Tobs, a character's standing persona lives in `SOUL.md`. Here is a clean template you can adapt:

```markdown
# Mina
You are a fictional 30-year-old botanical garden caretaker who sketches plants.

## Voice
Use short, observant replies. Let dry humour appear occasionally.
Ask one question at a time. Leave room for the other person to answer.

## Boundaries
The garden is a fictional setting, not a place the user has visited.
Do not invent a shared past. Ask when an important detail is uncertain.
Keep events in our story distinct from facts about the user's life.
```

Pick just a few habits that genuinely matter to you. Stuffing `SOUL.md` with catchphrases tends to make every reply sound like a rehearsed speech. And if you notice Mina narrating your character's actions or speaking on your behalf, add one clear line to her boundaries: *leave the user's choices and dialogue to the user.*

As explained in the [Soul and Core Memory guide](/en/docs/soul-and-core-memory/), Tobs pairs `SOUL.md` (who the character is) with `MEMORY.md` (a compact index of key facts and pointers to deeper notes).

## Separate tonight's mood from lasting rules

Suppose you and Mina are talking through a rainy evening in the greenhouse. Three things you say in the same conversation might deserve completely different treatment in memory:

| What you say | What a good note preserves |
| --- | --- |
| "I'm in the mood for a mystery tonight." | A vibe for tonight's scene—not a permanent rule that you only like mysteries. |
| "Please let me choose what my character does." | A lasting preference for how you want to roleplay together. |
| "In this story, the conservatory closes at nine." | A detail of the fictional setting, kept separate from real-world facts. |

Before letting the character turn a casual remark into a permanent rule, ask what it plans to write down. You can even suggest the file structure yourself: *"Save the roleplay preference in `preferences.md`, and put the conservatory detail in `story/garden.md` so they stay separate."* You can organize those files however you like.

Afterward, open **Memory files** in the Bot's sidebar to read what was actually saved. If a note overstates what you meant, ask the Bot to revise it or edit the markdown file directly on your computer (see the [memory-file guide](/en/docs/channel-sidebar/memory-files/) for how current files and Git history work together).

## Test recall in the next conversation, not just the promise

When a Bot says *"Got it, I'll remember,"* treat that as an invitation to check the file. The real test is returning to the greenhouse later without repeating your instructions. Does Mina still leave your character's actions to you? Does she keep the conservatory inside the fictional world? If you change the closing time from nine to ten, can she find and update the old note?

Knowing how files enter the prompt makes debugging much easier: `SOUL.md` and `MEMORY.md` load into a conversation as snapshots, so edits take effect when you start a new Session or when the current Session compacts. Other files in the memory folder are read on demand with tools when the topic comes up. Having everything in plain files means that whenever a detail is missed, you can immediately see whether it wasn't written down, was phrased poorly, or simply wasn't pulled into the turn.

For a real-world look at how this plays out on day one, check out our [companion preference-memory diary](/en/blog/ai-companion-preference-memory/), where we walk through actual file writes and readbacks from a live conversation.

## Pick up the thread from your phone, or bring in a second character

With the mobile Beta, you can connect your phone directly to Tobs running on your computer. Follow the [phone-pairing guide](/en/docs/mobile-pairing/) to reach your Bots and ongoing chats from the couch—your computer does the heavy lifting while your phone acts as a remote client.

Once one character feels dialed in, try inviting a second persona into an [AI group chat](/en/blog/ai-group-chat/). Give the newcomer a contrasting voice and set each Bot's attention policy to control when they chime in. Even in a shared room, each Bot keeps its own private memory repository, so their backstories stay cleanly separated.

And if your characters ever take on practical jobs—like researching lore, drafting chapters or reviewing continuity—our [AI agent teams guide](/en/blog/ai-agent-teams/) shows how to structure tasks and handoffs.

## A quick note on local files and model costs

Tobs is free, MIT-licensed software that stores your chat logs and memory files locally on your computer. Keep in mind that when a Bot generates a reply or uses tools to update memory, relevant context is sent to whichever model provider you've configured—and those API calls are billed by your provider.

If you're ready to build a character whose memory you can actually read, edit and own, start with the [installation guide](/en/docs/installation/), spin up your first Bot, and set a small scene. Agree on one detail worth keeping, then open the memory panel and see what it wrote down.
