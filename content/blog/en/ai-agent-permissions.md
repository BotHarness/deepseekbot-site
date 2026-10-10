---
{
  "title": "Shared AI Bot Permissions: On-Demand Role Lookup",
  "description": "Design permissions for a bot serving many people: trusted identity, on-demand natural-language roles, pairing, tool approvals and execution boundaries.",
  "date": "2026-10-11",
  "tags": ["Permissions", "Design"]
}
---

An AI bot joins a company chat. Everyone can mention it. It can read company email through a CLI and modify code through its shell. That raises a question: **Alice may query project emails; Bob should only discuss code. If they make the same mail request, how does the bot know whom to help and whom to refuse?**

AI agent permissions in shared chats need to answer four questions:

1. **Who may initiate work?** Identify the actual requester and check whether they may talk to the bot.
2. **How should the bot handle this person's request?** Read the role's behavior policy.
3. **Who may approve actions?** Check the operator's management capabilities.
4. **What can the execution process access?** Examine its credentials and execution environment.

Our choice is to gate requests with code, let the bot query current roles on demand, express behavior policy in natural language, and handle management authorization and resource boundaries separately.

This article describes DeepSeekBot's [role and admission proposal](https://github.com/BotHarness/DeepSeekBot/issues/1371), rather than announcing the whole design as a released feature. A hypothetical team mail assistant illustrates the trade-offs.

## Existing approaches: what does natural language control?

Natural-language permissions have precedents, but their control points differ:

| Approach | What the prose does | Where control happens |
| --- | --- | --- |
| Main-agent behavior policy | The model reads rules and decides how to handle a request | Model behavior; prose alone provides no deterministic action gate |
| Hermes smart policy | An auxiliary model judges whether a dangerous command should be approved, denied or escalated | The command approval flow; current inputs do not carry each person's trusted role |
| AWS AgentCore | Natural-language requirements become Cedar policies | The Gateway evaluates structured policy before tool calls |

Hermes has implemented `approvals.smart_policy`: operator-written rules guide a separate guardian model assessing flagged commands, and the approval flow uses its decision. This addresses **command risk**, rather than a complete role system for people sharing a bot. [Hermes source](https://github.com/NousResearch/hermes-agent/blob/66605471e9f0b0832abbefaf625ce08e948ca540/tools/approval_smart.py)

A Hermes team also reported a related experiment: they put “non-admins cannot run terminal commands” in the main model's prompt, but the model still executed a command. They then requested per-user tool restrictions. This is operator feedback, not a test we independently reproduced. [Original discussion #3897](https://github.com/NousResearch/hermes-agent/issues/3897)

AWS has discussed [natural-language authorization](https://aws.amazon.com/blogs/machine-learning/secure-ai-agents-with-policy-in-amazon-bedrock-agentcore/): generate and validate Cedar, then evaluate it at the Gateway. Prose is the authoring interface; structured policy is the execution authority.

DeepSeekBot's proposal combines these concerns differently: code governs admission, the bot reads current roles, and natural language guides behavior. Stronger resource authorization requires boundaries covering the actual execution paths.

## Core design: four boundaries to handle separately

Each part answers a different question. Together, they should not be read as proof that every tool call is forcibly authorized:

```text
Chat message
  ↓ Admission
Trusted requester
  ↓ Bot queries current role
Model handles the request

Management action
  → Host checks capability
Shell access
  → Process credentials
    and environment
```

### 1. Deterministic admission and trusted identity

Requester identity comes from the platform-authenticated message author. It cannot be inferred from a display name, “I am the administrator,” or quoted chat text. Identity also carries the current bot and app-binding scope: a Slack user is not automatically the same person as a similarly named Lark user, and approval for Bot A does not grant access to Bot B.

The mail assistant's group is restricted. When an unpaired Alice first mentions it, program logic creates or reuses an application and sends a fixed response. **It does not invoke the LLM or enqueue the blocked request as work.**

An administrator reviews the application and assigns a role. Approval tells Alice to ask again; it does not execute her old request. Otherwise, a question from hours ago could suddenly run when review finishes. After pairing revocation, the next restricted request should be stopped before the model again.

An explicitly open group may allow visitors to ask questions, but visitor access brings no approval or role-management powers. Collecting messages, requiring mentions and deciding when to wake the bot remain separate settings.

### 2. On-demand role lookup with less repeated context

Putting the entire team's role directory in the system prompt adds context. Copying permissions on each request can also make historical configuration look current. Our design instead preserves trusted author and source references on every message and exposes a read-only person-permission Tool.

Small talk need not query a role, but author identity stays attached. For a new role-governed request, the bot queries the actual requester rather than borrowing someone else's permissions from background messages.

When Alice asks which emails need follow-up, the result might look like this:

```text
Pairing: approved
Role: Mail reader
Behavior policy: query and organize; no editing or sending
Management capabilities: none
Policy revision: 7
Queried at: 2026-10-11T09:00:00Z
```

This is an illustration, not a released Tool interface. The lookup must read authoritative configuration within the current bot/app scope, without asking the model to guess identity. After an administrator changes a role, the next lookup should return the new revision. Revision 7 in conversation history remains a record of what was read then; it does not update itself.

**A lookup supplies current information. It neither grants authority nor ensures every execution is authorized.** The model may skip the query or misunderstand it. Behavioral guidance tells it to defer a governed operation when identity is unresolved or the query fails. Looking up someone else's role gives no right to approve as them, and a fresh result alone cannot stop an arbitrary shell command already running.

### 3. Natural-language policies and structured management capabilities

An administrator might assign Alice this role:

```text
Role: Mail reader

Behavior policy:
May query the company mailbox and organize follow-up items.
Must not edit drafts or send email.

Structured management capabilities: none
```

Prose can express business rules such as “summarize project emails without disclosing salary figures.” The model interprets and follows those rules while handling the request.

Structured capabilities govern supported management actions, such as accepting a tool approval. The Host—the process running the bot—checks the actual operator and current authorization. A person without that capability cannot make a valid decision simply by seeing an approval control or claiming to be an administrator.

We borrow RBAC's user → role → permissions organization, with different guarantees for its two parts: **the model follows behavior policy; code checks management capabilities.** Alice's permission to query mail does not let her approve arbitrary Bash. Management checks are not a universal gate for every business write operation.

### 4. Behavior policies cannot restrict credentials a process already holds

Our mail use case lets the bot run the Himalaya CLI through its Shell, independently of the role feature. That makes the location of credentials and the shell's execution identity another question to answer.

If the same process can read mailbox credentials, “Bob must not query mail” in his role does not make the operating system refuse a mailbox read. Restricting a dedicated mail Tool is also insufficient if Bash or another path can reach the same resource.

Stronger guarantees may require narrower bot credentials, separate bots or execution environments, or deterministic authorization covering the relevant execution paths. An AWS Gateway only evaluates calls routed through it; an environment only isolates resources placed outside its configured boundary. Either approach depends on its actual coverage. [AgentCore policy documentation](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-natural-language.html), [pi-chat execution environment](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/gondolin.ts)

The first design accepts the flexibility of natural-language behavior policy and retains explicit management checks. A model usually following its role is not a guarantee that an unauthorized person cannot cause a mailbox read.

## In a group: who asks, who provides context, and who sees the reply?

Bob has no mail-query access, but his ordinary messages may be retained as group background. Alice later asks about email. Bob does not acquire her permissions by appearing in the same context. A quoted administrator is not the current requester either.

Pi's independent `pi-chat` application provides a precedent for separating collection from triggering: it checks user IDs and native roles before starting a job, while the inbound path records messages before checking the trigger. Retained messages can become background for a later request. [pi-chat source](https://github.com/earendil-works/pi-chat/blob/9adbd29b40ee27ff1decf0fc87cbe180b40924f5/src/runtime.ts)

The bot can query three read-only directories: paired people and roles, known external conversations, and observed paired participants of a conversation. The last is an observation history. It cannot prove that every current member is authorized or that silent people are absent.

The reply audience also matters: **Alice's permission to ask does not make a group reply visible only to Alice.** The first design does not synchronize full membership or authorize every reply audience. Put mail content in an appropriate private conversation or trusted group; a role directory cannot replace the platform's reading permissions.

## Validate the design with the same mail example

Follow five observable behaviors:

1. **An unknown person mentions the bot:** a fixed pairing response arrives, with no model work started.
2. **An administrator approves Alice:** she receives a re-ask notice; the old request is not replayed.
3. **Alice submits a fresh mail query:** the bot looks up her role using trusted identity and acts within its policy. This verifies that behavior, not forced authorization of every command.
4. **The role changes:** a fresh lookup returns the new revision while historical results retain their original version and time.
5. **Bob attempts an approval without management capability:** the Host rejects his decision. After pairing revocation, the next restricted request is also stopped before the model.

These separately test admission, review, model behavior, freshness and management authorization. Checking them separately makes each observed guarantee clear.

## FAQ

**Is this complete RBAC?** It uses role-based organization, but natural-language behavior policy is not RBAC enforced over every tool and resource.

**Why not inject permissions on every message?** We preserve each message's identity and read current configuration for new role-governed requests, reducing directory duplication. The model can still skip a lookup.

**Does a read-only permission query grant authority?** No. It returns current configuration. Role changes and management decisions still require an authorized operator using the relevant program checks.

**Can I enable the whole design today?** This article describes a proposal; the [delivery tracker](https://github.com/BotHarness/DeepSeekBot/issues/1372) records implementation and acceptance progress. For existing capabilities, see [platform and tool scope](/en/docs/capabilities/) and [external identities](/en/docs/channel-sidebar/external-identities/).
