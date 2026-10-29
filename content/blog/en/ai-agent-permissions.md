---
{
  "title": "Shared AI Bot Permissions: On-Demand Role Lookup",
  "description": "When a shared AI bot joins a team chat, how should it know who can read project email and who can only discuss code? A look at DeepSeekBot's role and permission design.",
  "date": "2026-10-11",
  "tags": ["Permissions", "Design"]
}
---

An AI bot joins a company group chat where anyone can mention it. It can read team email through a CLI tool and edit code through its shell. That immediately raises a practical question: **Alice is allowed to check project emails, while Bob is only supposed to discuss code. If both of them ask the bot to check the inbox, how does it know whom to help and whom to turn down?**

Permissions for a shared AI agent come down to four distinct questions:

1. **Who is allowed to talk to the bot?** Identify the real sender and check whether they are admitted to use the bot.
2. **How should the bot handle this person's request?** Follow the behavior policy attached to their role.
3. **Who can approve sensitive actions?** Verify whether the person clicking "Approve" actually holds management privileges.
4. **What resources can the underlying process touch?** Look at the credentials and environment boundaries of the runtime itself.

Our approach separates these four layers: **gate incoming requests deterministically in code, let the bot look up a requester's role on demand and follow natural-language behavior policies, and enforce management approvals and runtime resource boundaries separately.**

This post walks through the trade-offs behind DeepSeekBot's [role and admission design proposal](https://github.com/BotHarness/DeepSeekBot/issues/1371), using a shared team mail assistant as a concrete example.

## How existing tools use natural-language policies

Writing permission rules in plain English isn't new, but existing projects place the actual control point in very different places:

| Approach | What the prose does | Where control actually happens |
| --- | --- | --- |
| Main-agent behavior policy | The model reads rules and decides how to respond | Model behavior; prose alone does not block tool calls at the runtime level |
| Hermes smart policy | An auxiliary model judges whether a risky command should be approved, denied or escalated | The command approval flow; focused on command risk rather than per-user roles in a group |
| AWS AgentCore | Natural-language rules are compiled into structured Cedar policies | The Gateway evaluates deterministic policy before tool calls execute |

Hermes's `approvals.smart_policy` ([source](https://github.com/NousResearch/hermes-agent/blob/66605471e9f0b0832abbefaf625ce08e948ca540/tools/approval_smart.py)), for example, lets operators write rules in plain text so a separate guardian model can evaluate flagged commands. That works well for **assessing command risk**, but it isn't designed to manage per-user roles in a shared group chat. In fact, a Hermes user [shared a telling experience (#3897)](https://github.com/NousResearch/hermes-agent/issues/3897): their team put "non-admins cannot run terminal commands" into the main model's prompt, saw the model run a command anyway, and asked for per-user tool restrictions.

AWS AgentCore takes a compiler approach ([blog post](https://aws.amazon.com/blogs/machine-learning/secure-ai-agents-with-policy-in-amazon-bedrock-agentcore/)): natural language is translated into validated Cedar policies, which the Gateway enforces before a tool call runs. Plain English is the authoring UI, while structured policy is the runtime authority.

For DeepSeekBot, we wanted a design that fits self-hosted personal and small-team setups: use deterministic code for admission and management approvals, while giving the bot an on-demand role lookup tool so teams can express nuanced business rules in natural language.

## Core design: four boundaries, each doing one job

Keeping these four layers distinct makes it clear what each one guarantees—and what it doesn't:

```text
Chat message
  ↓ Admission gate (code)
Trusted requester
  ↓ Bot queries current role on demand
Model handles request under role policy

Management action
  → Host checks operator capability
Shell & resource access
  → Governed by process credentials and sandbox
```

### 1. Deterministic admission and trusted identity

A requester's identity must come from the chat platform's authenticated sender ID—never from a display name, a message claiming "I'm the admin," or quoted text. Identity is also scoped to the specific bot and app binding: a Slack user is not automatically matched to a Lark user with the same name, and being approved for Bot A does not grant access to Bot B.

Suppose our mail assistant lives in a restricted group. When Alice mentions the bot before being paired, deterministic code intercepts the message and replies with a standard pairing prompt. **It does not call the LLM, and it does not queue her blocked request for later.**

Once an administrator approves Alice and assigns her a role, the system notifies her to ask again rather than replaying her old message automatically—nobody wants a question from three hours ago suddenly executing the moment an admin clicks approve. Conversely, if her pairing is revoked, her very next restricted request is stopped at the door before reaching the model.

### 2. On-demand role lookup instead of bloated prompts

Stuffing an entire team's role directory into the system prompt wastes context tokens; stamping a static copy of a user's permissions onto every message in chat history can make old permissions look current after an admin changes them.

Instead, we attach the authenticated author identity to every message and give the bot a read-only tool to look up a person's current role on demand. Casual banter doesn't need a role check. When a request touches role-governed work, the bot queries the actual requester's latest role rather than borrowing someone else's permissions from earlier messages in the thread.

When Alice asks which emails need follow-up today, the lookup returns a fresh snapshot:

```text
Pairing: approved
Role: Mail reader
Behavior policy: query and organize; no editing or sending
Management capabilities: none
Policy revision: 7
Queried at: 2026-10-11T09:00:00Z
```

If an administrator updates Alice's role five minutes later, the next lookup returns Revision 8, while Revision 7 in the conversation log remains a timestamped record of what was true at the time.

Just as importantly, **a role lookup informs the model—it does not act as a kernel-level lock.** Behavioral instructions tell the bot to hold off on governed actions if an identity cannot be resolved or a lookup fails, while hard security boundaries are handled at the management and process layers below.

### 3. Natural-language behavior policies vs. structured management capabilities

An administrator might assign Alice a role like this:

```text
Role: Mail reader

Behavior policy:
May query the company mailbox and organize follow-up items.
Must not edit drafts or send email.

Structured management capabilities: none
```

Splitting the role into two parts plays to the strengths of both worlds. Business rules are often subtle—for instance, "summarize project emails, but never include salary figures." Writing that in natural language is effortless, and the model can apply it while reading and summarizing text.

Management actions, on the other hand—such as approving a sensitive tool call—are defined as structured capabilities and checked in code by the Host process. If Bob doesn't have approval capability, clicking an approval button or claiming to be an admin in chat simply won't pass the Host check. In short: **the model follows natural-language behavior policies; deterministic code enforces management capabilities.**

### 4. Natural-language rules don't take away credentials a process already holds

In our mail scenario, the bot reads email by running the Himalaya CLI in its shell. That highlights an essential security boundary: **if the bot's OS process holds credentials to the mailbox, writing "Bob must not read email" in a natural-language role will not make the operating system block a mailbox read.**

Nor is it enough to block a dedicated mail tool if the bot can still run arbitrary Bash commands against the same credentials. When you need hard isolation between users, the right tools are narrower credentials, separate bot instances or sandboxes per trust level, or a deterministic gateway covering every execution path (see [AWS AgentCore's policy docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-natural-language.html) and [pi-chat's execution environment](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/gondolin.ts)).

Being upfront about the difference between model-followed guidance and OS-enforced isolation makes it much easier to deploy shared bots safely.

## Group dynamics: who asks, who is context, and who sees the reply?

In a busy group chat, Bob (who has no mail access) might post a few messages about a project before Alice mentions the bot to check related emails.

Here, message collection and job triggering are separate steps—a pattern also used in Pi's [`pi-chat` runtime](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/runtime.ts). Bob's messages can sit in the group history as helpful context, but Bob doesn't gain Alice's permissions just by being in the thread, and quoting an admin's earlier message doesn't make someone the requester.

One last group-chat reality to keep in mind: **Alice having permission to ask a question does not make the bot's reply invisible to everyone else in the room.** Because anyone in the channel can read the bot's response, sensitive inbox queries belong in a direct message or aprivate group where everyone is cleared to see the output.

## Five scenarios to test the design

Using our mail assistant example, we can verify the whole flow through five concrete behaviors:

1. **An unpaired user mentions the bot:** they get a fixed pairing reply immediately, without waking the LLM.
2. **An admin approves Alice:** she gets a prompt to ask her question again, rather than having hours-old messages replayed automatically.
3. **Alice asks to check project mail:** the bot looks up her role via her authenticated ID and summarizes the inbox without sending or editing mail.
4. **An admin updates her role:** the next lookup returns the new revision number, while earlier lookups in the log keep their original revision and timestamp.
5. **Bob tries to approve a tool call without management rights:** the Host process rejects the action—and if a user's pairing is revoked, their next restricted request is blocked at admission.

## FAQ

**Is this full RBAC?** It borrows the familiar `user → role → permissions` structure from RBAC for organization, while using natural language for day-to-day behavior guidance rather than claiming deterministic enforcement over every underlying tool and file.

**Why not inject the full role table into every prompt?** Looking up roles on demand keeps context lean and ensures the bot always reads the latest role revision when a governed request arrives.

**Does the read-only role lookup tool grant permissions?** No. It simply reports the requester's current configuration to the model. Changing roles and approving actions still require an authorized operator passing Host-level checks.

**Is this available today?** This post covers the design proposal; you can follow implementation progress in the [delivery tracker (#1372)](https://github.com/BotHarness/DeepSeekBot/issues/1372). For what's already live today, check out [platform and tool capabilities](/en/docs/capabilities/) and [external identities](/en/docs/channel-sidebar/external-identities/).
