---
{
  "title": "Tobs: a Team of Bots you can make your own",
  "description": "Why Tobs is built around persistent Bots, with identities and file-based memory you can inspect, rather than a growing pile of disposable chats.",
  "date": "2026-10-27",
  "tags": ["Tobs", "Team of Bots"]
}
---

A useful AI conversation often ends with something you want to keep: a decision, a character's voice, an unfinished question, a way of working that finally felt right. Next time, you want to return to that relationship without explaining everything again.

Tobs means **Team of Bots**. The name also carries the ambition of Thousands of Bots, but the useful starting point is much smaller: one Bot you can get to know, and another when you have a reason to invite it.

Tobs, formerly DeepSeekBot, is an open-source application that runs as a plugin in DeepSeek Harness. Its Bots have their own identities and Git-backed memory. You can talk to them separately, bring them together, and keep their files on the computer running the app. The idea is to build a little crew that has continuity in your life and work.

## A name should mean something next week

Naming a chat “Research” is convenient. A persistent research Bot gives that name a longer life: a role you can refine, notes you can revisit, and a memory you can correct.

Consider this possible setup for a small personal writing project. Start with Mira, who helps you keep reading notes. Give her a clear preference: distinguish what a source says from what you think it means. As the project develops, you might add Theo to discuss structure and pacing. If you enjoy writing fictional scenes, another Bot could have a character and voice of its own.

These are suggested roles, not a report of a team that completed the project. The point is that each addition should bring a perspective you want to return to. A large roster is not useful merely because it is large.

The same Bot can participate in different conversations while keeping its identity. That does not make every conversation interchangeable, or mean the whole crew automatically shares every member's memory.

## Personality and memory are things you can open

In Tobs, `SOUL.md` describes a Bot's character, voice and working principles. `MEMORY.md` holds core facts and pointers to more detailed files. The [Soul and Core Memory guide](/en/docs/soul-and-core-memory/) explains when those files enter a conversation and how their limits work.

For Mira, a useful Soul might describe how she handles uncertainty. Her notes might hold the project question, source links and decisions you have actually made. Those are different kinds of information: a permanent working principle should not be confused with a tentative conclusion from Tuesday.

Because memory is made of ordinary files with Git history, you can read what changed rather than relying on a reply that says “I'll remember.” You can correct an assumption and inspect an earlier version. See [Memory files](/en/docs/channel-sidebar/memory-files/) and [Memory evolution](/en/docs/channel-sidebar/memory-evolution/).

That visibility matters even when the model makes a mistake. It gives you somewhere concrete to investigate. It does not guarantee that every saved detail will be recalled correctly, and not every file is automatically included in every model request.

## One crew, several ways to spend time together

Sometimes you want an individual conversation. Sometimes you want Mira and Theo in the same room, discussing an idea from different angles. Sometimes you have a piece of work with a clear result to review.

Those are related experiences, but they need different expectations:

| What you want | Where to begin |
| --- | --- |
| A conversation with several distinct Bots | [AI group chat](/en/blog/ai-group-chat/) |
| Bots with different jobs contributing to a deliverable | [AI agent teams](/en/blog/ai-agent-teams/) |
| A character whose voice and memories you can shape | [AI character chat](/en/blog/ai-character-chat/) |

You do not need to choose one identity for the whole product. A writing companion can be enjoyable to talk to and useful to work with. What matters is being clear about what you are asking it to do now.

## Tobs, Tob and BotHarness

The names refer to different things. **Tobs** is the application and your team of Bots. **Tob** is the built-in helper that assists with creating and managing that team. **BotHarness** is the framework behind Tobs and the name of the project maintaining it.

Tob can help with supported management tasks, but its helpful role does not remove the application's permission and approval checks. Tobs runs on DeepSeek Harness; it is an independent project, not an official DeepSeek product. The [project repository](https://github.com/BotHarness/DeepSeekBot) is the place to inspect the source and follow development.

## Make the crew fit your circumstances

Running your own setup gives you choices and responsibilities. You choose a model supported by your DSH configuration, keep the computer available, and manage its updates. The software is free under the MIT license; model usage and any hosting still have costs.

Memory stored on your computer does not mean every model runs there. Relevant conversation context goes to the model service you configure. The phone app is currently a Beta remote client: it connects to that computer rather than replacing it. Check the [phone guide](/en/docs/mobile-app/) for the current invitation and connection requirements.

Start with the [installation guide](/en/docs/installation/), create one Bot, and give it something small worth keeping. Read the memory it saves. Return to the conversation and see whether it uses that memory appropriately. When you find yourself wanting a different voice or a separate responsibility, that is a good reason to add the next member of your team.
