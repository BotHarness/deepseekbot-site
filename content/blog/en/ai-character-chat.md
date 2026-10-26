---
{
  "title": "AI character chat with a memory you can inspect",
  "description": "Create an original AI character in Tobs, give it a distinct voice, and keep its memories in files you can read and correct. Start on your computer and continue from your phone.",
  "date": "2026-10-27",
  "tags": ["AI character chat", "Memory", "Guide"]
}
---

A character can sound convincing in the first conversation. The more interesting question comes later: does it understand what changed, which details belong to the story, and what you actually asked it to remember?

Tobs lets you create characters as Bots with their own identity, persona and file-based memory. You can open those files, correct a mistaken note and inspect their Git history. It suits people who want to shape a character over time and are willing to run DeepSeek Harness on their own computer.

That character can stay in a private chat or join a [team of Bots](/en/blog/team-of-bots/). Start with one character and one ordinary conversation before building a whole cast.

## Give the character a voice you can recognise

Try an original fictional character: Mina, a 30-year-old botanical garden caretaker who works the evening shift and sketches new leaves. She likes precise observations, is quietly amused by grand names for small plants, and takes time to answer a question. These details give you something to direct beyond “be friendly.”

In Tobs, the character's standing instructions live in `SOUL.md`. Here is a setup example you can adapt, rather than a transcript of a tested conversation:

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

Write a few conversational habits that matter to you. A long list of catchphrases can make every reply sound rehearsed. If Mina keeps narrating your actions for you, add a clear instruction to leave your choices to you.

The [Soul and Core Memory guide](/en/docs/soul-and-core-memory/) explains the two standing files. `SOUL.md` describes the character; `MEMORY.md` holds a compact set of important facts and pointers to more detailed notes.

## Decide what should survive the conversation

Imagine discussing a rainy evening in the greenhouse. Three remarks might need different treatment:

| What you say | What a useful note would preserve |
| --- | --- |
| “I'm in the mood for a mystery tonight.” | A choice for this conversation, not a permanent genre preference. |
| “Please let me choose what my character does.” | An ongoing preference about how to roleplay together. |
| “In this story, the conservatory closes at nine.” | A fictional-world detail, kept separate from real opening hours. |

Ask the Bot what it plans to save before letting an interpretation become a lasting rule. For example: “Record the roleplay preference in `preferences.md`, and put the conservatory detail in `story/garden.md`. Keep them separate.” Those filenames are your own convention.

Open **Memory files** in the Bot's sidebar and read the result. If the note overstates what you said, ask for a correction or edit the file on the computer running Tobs. The [memory-file guide](/en/docs/channel-sidebar/memory-files/) covers the reader and file actions; it also explains how current files differ from their Git history.

## Check the next conversation, not just the promise

An acknowledgement such as “I'll remember” is a reason to inspect the file, not proof of later recall. A useful next check is to return to the garden later without repeating the answer you want. That checks continuity in your conversation; changing the topic or reopening the app does not establish recall in a new Session.

Watch for specific mistakes. Does Mina respect your control of your character? Does she treat the conservatory as part of the fictional setting? If you change the story's closing time, can you find and correct the old note?

The standing files are snapshots: changes enter the system prompt at the next Session or the next compaction. Other memory files are read with tools when needed; saving a file does not automatically insert every detail into every reply. These mechanics give you places to look when a memory is missed, but they do not guarantee perfect recall.

Our [preference-memory diary](/en/blog/ai-companion-preference-memory/) shows a real file write and readback in an existing conversation. Its captures are from Day 0, so it does not establish how well that character remembers on later days.

## Continue from your phone, or invite another character

The mobile Beta connects to Tobs running on your computer. Follow the [phone-pairing guide](/en/docs/mobile-pairing/) to reach the same Bots and conversations. The computer must remain available; the phone is a remote client, not a separate place where the Bot keeps running independently.

When one character feels worth keeping, you can invite another into an [AI group chat](/en/blog/ai-group-chat/). Give the new member a distinct voice and decide when each Bot should respond. Sharing a conversation is different from combining every member's private memory into one notebook.

Characters can also have practical roles. If your cast is becoming a writing or research crew, the [AI agent teams guide](/en/blog/ai-agent-teams/) covers giving members a job and reviewing their work.

## Know what you are choosing

Tobs is MIT-licensed software; model calls may still cost money. A long character conversation can include additional requests for tools and memory work, so count those alongside replies when you compare costs.

Memory and chat history are stored on the computer running Tobs. Relevant context can go to the model provider you configure. Local files therefore do not, by themselves, mean offline inference or that conversation data never leaves the device.

If you want a character you can shape, inspect and maintain, follow the [installation guide](/en/docs/installation/), create one Bot and give it a small scene. Agree on one thing worth remembering, then open the file and check what was kept.
