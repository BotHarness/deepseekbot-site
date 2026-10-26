---
{
  "title": "AI group chat: bring a cast of Bots into one conversation",
  "description": "Create an AI group chat in Tobs, give each Bot a distinct part, control who responds, and keep shared conversation separate from individual memory.",
  "date": "2026-10-27",
  "tags": ["AI group chat", "Guide"]
}
---

An AI group chat gives you several voices to talk with in one place. You might want a cast for a story, a few perspectives on a decision, or a room where your personal Bots can respond to one another. The useful question is what each participant contributes, and when it should speak.

Tobs, formerly DeepSeekBot, lets you bring named Bots into a Group. Each keeps its identity and memory while taking part in a shared conversation. You can talk to a Bot privately, invite it into a room, and choose how closely it follows that room.

Start with two or three Bots and one small conversation. More participants add model calls and more text to follow; a larger cast does not automatically make a better scene.

## Give the room a reason to exist

For a first attempt, try an original scene: three people arrive at a coastal lighthouse just before it closes. You play the visitor. The other participants might be:

| Bot | Part in the scene | A useful constraint |
| --- | --- | --- |
| Mira | The lighthouse keeper | Cautious about the weather; knows the building |
| Sol | A travelling illustrator | Notices shapes, light and small details |
| Jun | A local mechanic | Looks for practical explanations |

This is a suggested setup, not a transcript of a completed model run. The point is to give each Bot something specific to notice. Three copies of “be friendly and creative” leave the model less to work with.

Put the durable voice and background in each Bot's Soul. Keep the immediate situation in the group message: the time of day, who has arrived and what has happened so far. If you change the scene, say so in the room rather than expecting the other Bots to infer a private conversation.

For a single character's voice and continuity, see the [AI character chat guide](/en/blog/ai-character-chat/).

## Create the group and check its members

Follow the current [installation guide](/en/docs/installation/) and configure a model so one Bot can reply in a DM first. Then create a local Group and invite the Bots you want to include.

Check the actual member list after sending invitations. Depending on the Bot's settings, joining may be immediate or may require acceptance. An invitation waiting for a response does not mean that Bot is already participating.

Give the room a clear name, such as “Lighthouse scene”. The [group management guide](/en/docs/channel-sidebar/groups/) describes the current controls for creating a room, inviting members and opening each member's DM.

## Choose who responds

A busy room can become hard to read when every Bot answers every message. Tobs has an attention setting for each Bot in each Group:

| Setting | When it is useful |
| --- | --- |
| Every message | A small, active conversation where that Bot should follow along closely |
| Direct @ only | You want to call on the Bot deliberately |
| Digest ordinary messages | The Bot should catch up after a batch or a waiting interval |
| Silent inbox | Ordinary messages should arrive without waking it for each one |

For the lighthouse exercise, start with **Direct @ only** for all three Bots. Call on Mira, then Sol, then Jun. Once the scene has a rhythm, decide whether any participant should react to ordinary messages too.

Mentioning Mira does not itself silence everyone else: another Bot's attention settings may still wake it. Check each member's policy when you want controlled turns.

Here is an opening request you can adapt:

```text
We are writing a short scene at a lighthouse near closing time.
I play the visitor; leave my words and actions for me to write.
Keep each response to a short paragraph.
Mira, start by describing what you notice when I arrive.
```

Use the mention picker to select Mira in the actual message. These directions guide the model; they do not guarantee perfect turn-taking or character consistency. If a Bot starts speaking for your visitor, correct the scene before adding more messages.

## Share the scene without assuming shared memory

The group conversation gives its members a place to exchange information. Each Bot still has its own memory. Joining a room does not establish that every member has read all the private notes or DM history of the others.

Share an agreed fact in the Group if everyone needs it. If it should last beyond the scene, decide which Bot should record it, then inspect what it saved. A useful note might say “The lighthouse scene ends before the storm arrives”; an invented permanent preference about you would be a different claim.

Tobs stores memory in Git-backed files you can inspect and revise. Its [Soul and Core Memory guide](/en/docs/soul-and-core-memory/) explains how standing files enter a new Session, while other files are read as needed. Saved information and successful recall are separate things to check.

## Keep the setup and costs visible

Tobs runs as a plugin in DeepSeek Harness on a computer you operate. You choose supported model routes through DSH; the software is MIT licensed, while model services may charge for usage. A message that wakes several Bots can lead to several model calls.

Memory and conversation storage on your computer do not make every model call local. Relevant context goes to the model service you configure. Choose what you share accordingly.

The phone app is a Beta remote client for that computer. It can make it easier to keep talking away from the desk, but the computer must remain available. Follow the current [phone pairing guide](/en/docs/mobile-pairing/) for supported connection options.

## Try one scene before expanding the cast

Begin with a short exchange, read each reply, and adjust a role or attention policy when the conversation needs it. Keep the cast small until you can tell the voices apart and understand why each Bot is responding.

If the room's purpose becomes producing a brief, reviewing a document or dividing a project, the [AI agent teams guide](/en/blog/ai-agent-teams/) covers that work. For the wider product idea, read [why Tobs means Team of Bots](/en/blog/team-of-bots/).
