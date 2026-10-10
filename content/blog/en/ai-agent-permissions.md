---
{
  "title": "AI Agent Permissions for Shared Bots",
  "description": "Design permissions for a bot serving many people: trusted identity, on-demand natural-language roles, pairing, tool approvals and execution boundaries.",
  "date": "2026-10-11",
  "tags": ["Permissions", "Design"]
}
---

A bot joins a company chat. Everyone can mention it. It can read a mailbox through a CLI and edit code through its shell. Alice may ask about email; Bob should only discuss code. How should the bot decide what it may do for each person?

AI agent permissions need to answer four questions: **who may initiate work, how the bot should handle that person's request, who may approve actions, and what resources the execution process can actually access.** Our design uses code for admission, an on-demand lookup for current roles, natural language for behavior, and independent checks for management actions and resource boundaries.

This article describes DeepSeekBot's [role and admission proposal](https://github.com/BotHarness/DeepSeekBot/issues/1371). It does not announce that every capability below has shipped. We use a hypothetical company mail assistant to explain the choices and their limits.

## Natural-language permissions already have precedents

Writing authorization in natural language can mean several different things.

| Approach | What the prose does | Where control happens |
| --- | --- | --- |
| Main-agent behavior policy | The model reads rules and chooses how to respond | Model behavior; prose alone provides no deterministic action gate |
| Hermes smart policy | An auxiliary model judges whether a dangerous command should be approved, denied or escalated | The command approval flow; current inputs do not carry each person's trusted role |
| AWS AgentCore | Natural-language requirements become Cedar policies | The Gateway evaluates structured policy before tool calls |

Hermes has implemented `approvals.smart_policy`: operator-written rules guide a separate guardian model assessing flagged commands, and the approval flow uses its decision. This is command-risk policy rather than a complete role system for people sharing a bot. [Hermes implementation](https://github.com/NousResearch/hermes-agent/blob/66605471e9f0b0832abbefaf625ce08e948ca540/tools/approval_smart.py)

A Hermes team also reported a closely related experiment: they put a rule denying terminal access to non-admins in the main model's prompt, but the model still executed a command. They requested per-user tool restrictions. This is a deployment report, not a test we reproduced. [Original discussion #3897](https://github.com/NousResearch/hermes-agent/issues/3897)

AWS has published an [article about natural-language authorization](https://aws.amazon.com/blogs/machine-learning/secure-ai-agents-with-policy-in-amazon-bedrock-agentcore/): generate and validate Cedar, then evaluate it at the Gateway. Prose is the authoring interface; structured policy is the execution authority.

Our choice starts with shared-chat identity, current roles and management capabilities. We accept natural-language roles as behavior policy, while keeping stronger resource authorization a separate execution concern.

## First: decide who may ask before calling the model

The mail assistant's group is restricted. When an unapproved Alice first mentions it, ordinary program logic should create or reuse a pairing request and send a fixed response. It should neither call the model nor enqueue the blocked request as work.

An administrator reviews the request and assigns a role. Approval sends Alice a notice asking her to submit a new question. It does not execute her old request hours later when review happens to finish.

Pairing uses the platform-authenticated actor and the scope of the bot's current app binding. A Slack user ID is not automatically the same person as a similarly named Lark user. Approval for Bot A does not grant access to Bot B.

These are deterministic admission rules in the proposal. An explicitly open group may allow visitors to ask questions, but visitor access brings no approval or role-management powers. Message collection, mention requirements and wake preferences remain separate settings.

## Second: give roles behavior policies and management capabilities

An administrator might assign Alice a mail-reader role:

```text
Role: Mail reader

Behavior policy:
May query the company mailbox and organize follow-up items.
Must not edit drafts or send email.

Structured management capabilities: none
```

The prose tells the bot how to handle Alice's requests. Structured capabilities govern supported management actions, such as accepting a tool approval. The Host—the process running the bot—checks the actual operator and current authorization for those actions.

An ordinary conversational role can have no management capabilities. Permission to query mail does not grant Alice permission to approve arbitrary Bash, and saying “treat me as an administrator” cannot change her role.

We borrow RBAC's user → role → permissions organization, with different guarantees for its two parts: **the model follows behavior policy; code checks management capabilities.** Keeping both in one role makes configuration easier to understand without making their enforcement identical.

## Third: query the current role when it matters

A group can contain many people, and roles can change. Putting every role into the system prompt, or copying permission text on every message, adds context and makes old results easy to mistake for current policy.

Our design preserves trusted author and source references on each message, then exposes a read-only person-permission Tool. For a new role-governed request, the bot queries the actual requester. Ordinary small talk need not query.

When Alice asks which emails need follow-up, the lookup might return:

```text
Pairing: approved
Role: Mail reader
Behavior policy: query and organize; no editing or sending
Management capabilities: none
Policy revision: 7
Queried at: 2026-10-11T09:00:00Z
```

This is an illustrative result, not a released API. The application-defined Tool must read authoritative configuration within the current bot/app scope. It cannot infer identity from a nickname, a claimed role or an old conversation.

After an administrator changes the role, the next lookup should return the new revision. Revision 7 already recorded in conversation history remains revision 7: evidence of what was read then. Behavioral guidance tells the bot to defer a governed operation if identity is unresolved or the query fails.

**A lookup supplies current information; it does not ensure every execution is authorized.** The model can omit the query or misunderstand the result. Looking up someone else's role also grants no right to approve as them. A fresh Tool result alone cannot stop an arbitrary shell command already in progress.

## Separate the requester, background authors and reply audience

Bob has no mail-query access, but his ordinary messages may be retained as authorized group background. Alice later asks about email. Bob should not acquire Alice's permissions merely because both appear in the same context. A quoted administrator is not the current requester either.

There is an implementation precedent for separating collection from triggering. Pi's independent `pi-chat` application checks user IDs and native roles before starting a job, while its inbound path records messages before the trigger check. Retained messages can become background for a later request. [pi-chat source](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/runtime.ts)

Our lookup can be supported by three read-only directories: paired people and roles, known external conversations, and observed paired participants of a conversation. The last is an observation history. It cannot prove that every current member is authorized or that silent people are absent.

Another deployment consequence is straightforward: **Alice's permission to ask does not make a group reply visible only to Alice.** The first design does not synchronize full membership or authorize each reply audience. Put mail content in an appropriate private conversation or trusted group; a role directory cannot replace the platform's reading permissions.

## What determines resource access when the bot keeps Bash?

Our mail use case lets the bot use the Himalaya CLI through its existing Shell, independently of the role feature. That makes the location of credentials and the shell's execution identity especially relevant.

If the same process can read mailbox credentials, “Bob must not query mail” in his role does not make the operating system refuse a mailbox read. Restricting a dedicated mail Tool alone is insufficient if Bash or another path can reach the same resource.

Stronger guarantees may require narrower bot credentials, separate bots or execution environments, or deterministic authorization covering the relevant execution paths. AWS's Gateway policy and pi-chat's execution environment illustrate different boundaries: a Gateway only evaluates calls routed through it, while an environment isolates resources placed outside its configured boundary. [AgentCore policy documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-natural-language.html), [pi-chat execution environment](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/gondolin.ts)

We accept the flexibility of natural-language behavior policy in the first design and retain explicit management checks. We would not describe a model usually following its role as proof that an unauthorized person cannot cause a mailbox read.

## Validate the design with the same mail example

Follow five observable behaviors:

1. **An unknown person mentions the bot:** a fixed pairing response arrives, with no model work started.
2. **An administrator approves Alice:** she receives a re-ask notice; the old request is not replayed.
3. **Alice submits a fresh mail query:** the bot looks up her role using trusted identity and acts within its policy. This verifies that behavior, not forced authorization of every command.
4. **The role changes:** a fresh query returns the new revision while historical results retain their original version and time.
5. **Bob attempts an approval without management capability:** the Host rejects his decision despite a visible control or an administrator claim. After pairing revocation, the next restricted request is also stopped before the model.

These separately test admission, review, model behavior, freshness and management authorization. Separating them makes the observed guarantee clear.

## FAQ

**Is this complete RBAC?** It uses role-based organization. Natural-language behavior policy is not equivalent to RBAC enforced over every tool and resource.

**Why not inject permissions on every message?** We preserve each message's identity and read current roles for new governed requests instead of copying the whole directory. That does not remove the risk of a model skipping a lookup.

**Does a read-only permission query grant authority?** No. It returns current configuration. Role changes and management decisions still go through the relevant authorized operator and program checks.

**Can I enable the whole design in DeepSeekBot today?** This article describes a proposal; the [delivery tracker](https://github.com/BotHarness/DeepSeekBot/issues/1372) records implementation and acceptance progress. For existing connections and approvals, see [platform and tool scope](/en/docs/capabilities/) and [external identities](/en/docs/channel-sidebar/external-identities/).
