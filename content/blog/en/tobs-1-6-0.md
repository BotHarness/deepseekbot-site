---
{
  "title": "Tobs 1.6.0 Released: Simple Layout Mode, Direct Marketplace Sharing, and Assignment Timelines",
  "description": "Tobs 1.6.0 is now live on npm. Explore what is new: the focused Simple layout mode for desktop, direct community Bot sharing with privacy and safety reviews, transparent multi-turn Assignment timelines, and rich IM and mobile refinements.",
  "date": "2026-10-30",
  "tags": [
    "Release",
    "Tobs",
    "Marketplace",
    "Workspace"
  ]
}
---

**Tobs 1.6.0 is officially released on npm.**

Since introducing mobile companion beta testing in 1.5, we have received invaluable feedback from real-world daily workflows. How to help a team of specialized AI bots integrate more naturally into day-to-day desktop work, how to enable creators to safely share their tuned bots with the community, and how to bring clarity and control to complex background tasks have guided the development of 1.6.0.

The published desktop package is `@botharness/tobs@1.6.0`. Follow the [installation guide](/en/docs/installation/) to update, and check the [changelog](/en/changelog/#v1.6.0) for the comprehensive release ledger.

Here is a closer look at what is new in 1.6.0.

## Simple Layout Mode: Focused Conversations and an On-Demand Toolbox

Tobs' signature multi-column desktop workspace has always offered extensive flexibility—allowing messages, memory files, session trees, routines, browser sessions, and computer control to sit side by side on wide monitors. However, on laptop screens or during focused single-bot discussions, tiled multi-column layouts could feel visually dense.

1.6.0 introduces **Simple Layout Mode**, now active by default for new setups:

- **Control Rail Navigation**: A streamlined rail on the left lets you switch globally between Home, Activity, Messages, and Plugins with a single click. Clicking the active item collapses the secondary column, mirroring modern editor activity bars.
- **Dedicated Chat Canvas**: In the Messages view, your channel list stays on the left while conversation messages occupy a generous, uninterrupted column.
- **Collapsible Subpanel Drawer**: A button on the right side of the message header reveals a channel-specific subpanel drawer. Sessions, memory files (`SOUL.md` and `MEMORY.md`), memory evolution graphs, scheduled routines, browsers, and computer viewports are stacked in an orderly, vertically scrollable column. Each subpanel can be folded or resized, and dragging its divider adjusts overall drawer width. Importantly, folding a browser or computer viewport only hides its display; your bot continues executing background steps without interruption.

Existing users keep their current multi-column Advanced Layout Mode untouched. You can toggle between Simple and Advanced layouts at any time under **Bot Settings → Appearance**, and each mode independently remembers your configured panel positions and dimensions.

## Direct Bot Sharing: Community Distribution with Zero Compromise on Privacy

As more creators shape specialized bots with distinct personalities and skill sets, sharing them should be effortless. Previously, publishing a bot required setting up a dedicated GitHub repository and authoring metadata manifests.

1.6.0 introduces **direct marketplace publishing with built-in privacy and safety reviews**:

### 1. Direct Publishing with Connect
Log in with your Tobs Connect account, set an author handle once, and package and upload any local bot directly from within the app. Anyone can install published bots as fresh, self-contained bots with clean initial Git histories.

### 2. Tob as Your Privacy Review Assistant (Sharing Drafts)
Bots that work with you over time inevitably store personal preferences, internal guidelines, or private context in their memory files. When you click **Share to Marketplace** on a Bot Profile, Tob assists you through a dedicated sharing draft:
- It makes an isolated copy of the bot's files as a review draft;
- It walks through each file with you, highlighting content that appears personal, sensitive, or project-specific, asking whether to **keep, rewrite, or remove** each item;
- Only the vetted, sanitized draft is published to the marketplace or exported to your repository. Your live local memory directory and local Git commit history remain completely untouched.

### 3. Pre-Installation Safety and Prompt Injection Audits
When discovering and installing a community bot or importing one via Git, trust is paramount. Before installation, Tob automatically inspects the candidate bot's system instructions and embedded scripts:
- It flags potential prompt injection vectors;
- It checks for unauthorized scripts or instructions attempting to exfiltrate context to external domains;
- It presents an actionable review summary before you confirm, giving you full visibility before creating the bot.

Additionally, the Marketplace itself features a redesigned discovery homepage, complete with daily curated spotlights, poster cards for popular bots, and compact rows for new arrivals.

## Assignment Timelines: Full Transparency for Complex Delegations

In multi-agent setups, the Orchestrator frequently breaks down complex goals into delegated Assignments executed across multiple specialized Subagents. Previously, long-running assignments could feel opaque until the final summary arrived.

1.6.0 introduces a dedicated **Assignment Timeline**:

- **Turn-by-Turn Organization**: The timeline partitions execution by turn, capturing the Orchestrator's initial instruction and any subsequent additions along with step summaries.
- **MAIN Steps and Subagent Visibility**: Inside each turn, primary steps and spawned Subagents are clearly separated. You can expand any Subagent to inspect its execution status, the exact model and reasoning effort it utilized, and its tool call history.
- **Unified Permission Snapshots**: Whether recovering after a host restart or handing off across devices, execution automatically aligns with the permission mode captured when the assignment was initiated. This eliminates unexpected permission mismatches during long-running tasks.
- **Thinking Indicators and Safe Interruptions**: During lengthy preparation or multi-step reasoning, bots display clear thinking states. You can halt stuck turns at any point, cleanly ending the phase without bricking the channel.

## Interconnect and Mobile Polish

Beyond desktop productivity, 1.6.0 deepens connectivity across communication platforms and mobile operating systems:

- **Bot-to-Bot Collaboration with Mentions**: In Lark and Discord channels, other bots explicitly mentioning your bot will now awaken it and receive contextual replies. Multi-turn bot handoffs now trigger reliably, protected by a 32-hop collaboration guardrail against runaway loops.
- **Rich IM Messaging**: Upgraded IM providers bring private chat support to QQ along with mixed rich media and 429 backoff retries. Lark replies now render as native Markdown cards, properly formatting headings, lists, tables, and code snippets.
- **Android Material 3 Expressive**: The Android companion fully adopts Material 3 Expressive styling, featuring collapsible workspace drawers, expandable FAB menus, filled text fields with floating labels, and fluid predictive back gestures.
- **iOS Native Sheets and Forms**: The iOS companion standardizes modals on native sheets and forms, integrating SwiftUI spring curves, Liquid Glass visuals, and code-review style line-by-line Git diff views for memory file histories.
- **Unified Multi-Computer Overview**: The mobile All Environments view seamlessly aggregates bots across online computers, allowing you to monitor distributed workflows and approve sensitive tool actions on the go.

## Upgrading and Next Steps

Tobs 1.6.0 is ready today. Update using your preferred package manager:

```bash
# Update globally via pnpm
pnpm add -g @botharness/tobs@1.6.0
# Or using npm
npm install -g @botharness/tobs@1.6.0
```

We recommend pairing 1.6.0 with **DeepSeek Harness 0.2.1**. Before upgrading, export an environment backup under **Settings → Environment Backup**.

For full details, browse the [changelog](/en/changelog/#v1.6.0) and [documentation](/en/docs/). We welcome your thoughts and feedback in our community channels!
