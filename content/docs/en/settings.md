---
{
  "title": "Settings guide",
  "description": "Find non-IM settings, understand each field and its application scope.",
  "order": 14,
  "source": "docs/settings.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

This guide covers all non-IM settings in **DeepSeekBot**: where to find them, what each option does, and when changes take effect. Make sure you have completed [Installation](/docs/installation) and [API and Bot models](/docs/model-setup) first. For Slack, Lark / Feishu, and other IM integrations, see their dedicated connection guides.

## Find the right settings page

| What you want to configure | Where to find it |
| --- | --- |
| DSH appearance, language, default permissions, input behavior | Bottom-left **Settings → General settings**. |
| API providers and model catalogs | **Settings → Models**; see [API and Bot models](/docs/model-setup). |
| Native Agent tools and working style | **Settings → Agent presets**. |
| Bot icon, motion, sorting, concurrency, your default display name | **Bot settings** next to Bot mode, or **Settings → Bot settings**. |
| A single Bot's name and avatar | Click the Bot's name/avatar in its DM header → **View details**. |
| A single Bot's models and wake policy | **Model** and **Wake policy** in its DM's Channel settings (header `···` menu). |
| Right sidebar layout and session views | Gear icon at the top of the Channel sidebar. |
| A single Bot's work folders and task permissions | **Workspace grants** in the DM's Channel settings. |
| An existing DSH Session's model and permissions | Open the session from **Sessions** in the right sidebar and check its native controls. |

## Complete environment backup and restore

If you want to move your entire DeepSeekBot environment to a new computer or create a full snapshot, you can export a verified environment backup.

Open **Bot settings → Complete environment backup and restore → Manage backups**:

1. **Preview export**: Shows the total number of Bot identities (including historical ones), managed file count, estimated size, and the number of underlying native DSH Sessions (which are not included in the archive).
2. **Download verified backup**: Packages your environment into a `.botharness-backup` file and displays the final compressed size when complete.

### What is included (and excluded)

- **Included**: The full BotHarness database, all Bot Memory repositories (including custom paths and retained repositories from deleted Bots), chat attachments and file bindings, model presets and per-Bot model plans, runtime metadata, and integrity checksums.
- **Excluded**: API keys and credentials, executable plugins, external Workspace folder contents, and native DSH Session transcripts. Local Git configs from the source machine are reset to safe defaults, and any Git hooks are quarantined on restore.

> **Privacy note**: Your backup archive contains private chat messages, memory files, account descriptors, permissions, and activity history. Store it securely. Note that a full environment backup is different from single-Bot `.bot.zip` or Git sharing, which clones a single Bot into a brand-new identity.

### Restore to a new directory

You can select a `.botharness-backup` file on the Manage backups page to inspect its manifest, database integrity, item count, size, and SHA-256 hash. To restore the backup, run the local restore command in your terminal, pointing to your backup file and a **new directory that does not exist yet**:

```text
botharness-profile restore --file "environment.botharness-backup" --new-home "new-environment"
```

If you are running from a source checkout, use `node scripts/profile-restore.mjs` with the same arguments. For safety, the restore command never overwrites an existing directory or replaces a running environment in place.

### Safely activating Bots after restore

Once the restore finishes, launch DSH pointing to the new home directory (in development checkouts, run `node scripts/dev-instance.mjs --home <new-home> --port <port>`).

To prevent two machines from running the same Bot simultaneously and causing duplicate replies or conflicts, a restored environment starts in **safe recovery mode (Disaster Restore)**:

- All Bots start paused; external account bindings, triggers, saved tool approvals, and schedules are suspended.
- Workspace folders need to be re-mapped on the new machine, Browser and Computer access are turned off, and old message queues are not replayed.
- Your chat history and Memory files are immediately readable.

**To re-activate a Bot:**

1. Go to **Settings → Models** to enter your API credentials on the new machine, and confirm the Bot's model configuration.
2. Return to **Manage backups**, refresh the readiness check, and click **Authorize this target model**.
3. Confirm that the old machine is no longer actively running the same Bot identity, then click **Activate this Bot**.
4. Send a new DM to resume chatting with your Bot under its preserved identity. To reconnect external IM accounts, re-authorize them through their respective connector settings.

## DSH general settings

These are native DSH settings. Dropdowns and toggles save immediately; text fields with a **Save** button apply when you click Save.

![Native DSH general settings](/guides/settings/settings-general-zh.webp)

| Field | Options / default | Purpose and scope |
| --- | --- | --- |
| Permissions | Read-only / workspace write / full access (default: workspace write) | Default permission level for new native sessions. Bot task permissions are configured separately under **Workspace grants**. |
| Language | Chinese / English | Changes the UI display language. |
| Appearance | Light / dark / system (default: system) | Changes the DSH interface theme. |
| Font size | Default 14 px; adjust with increase/decrease buttons | Changes the font size of conversation content. |
| Working steps | Concise / standard / detailed / fully expanded (default: detailed) | Controls how much tool-call detail is shown in chat; does not change tool permissions. |
| Performance and usage | Concise / detailed (default: detailed) | Controls the detail level for performance metrics and token usage. |
| Code working tools | On / off (default: on) | Shows execution traces, current-turn code diffs, and the Agent preset switcher in new conversations. |
| Keyboard shortcuts | **Edit shortcuts** | View and customize key bindings, resolve conflicts, or restore defaults. |
| Send behavior while busy | Default: Queue; optional: Steer | Controls what pressing Enter / Send does while an Agent is running (`Cmd/Ctrl + Enter` performs the alternative action). Independent of a Bot's wake policy. |
| Upload Session Log when using the official model API | On / off | Controls whether session logs are uploaded when using the official model API to help improve models and products. |
| Open configuration file | Button | Opens the underlying configuration file for the current Profile. For everyday adjustments, use the UI settings forms instead. |

## Agent presets and built-in plugins

**Agent presets** configure the native Agent's toolset and working style. Clicking **Set as default for new tasks** on a preset applies it to future native tasks. Agent presets are separate from [Bot model presets](/docs/model-setup).

![Native Agent presets select tools and working style](/guides/settings/settings-agent-presets-zh.webp)

| Preset | When to use it |
| --- | --- |
| Standard (default) | Everyday coding, file handling, and research tasks. |
| PTC | Tasks that batch tool calls and filter, deduplicate, count, or summarize large result sets. |
| Minimal | Terminal-only tasks, useful for baseline testing and comparisons. |
| Creation / Cordis | Authoring DSH plugins and combining tools/prompts to extend DSH. |
| Custom | Click **Let an Agent help me create a preset** to build a tailored workflow. |

The **Built-in plugins** page lets you search installed plugins, filter by Session or Global scope, and inspect plugin status and parameters for each Agent preset. To install or enable plugin packages, see [Installation](/docs/installation).

## Global Bot settings

![Bot appearance, sorting, developer mode, and task concurrency](/guides/settings/settings-bot-global-zh.webp)

| Field | Default / options | How it works |
| --- | --- | --- |
| Bot icon | DeepSeekBot mascot; simple, generated, or generic robot | Saves on click. Changes the Bot mode icon in the app navigation bar, without affecting individual Bot avatars. |
| Motion | System; reduced or full | Saves immediately and previews the active animation style below. |
| Bot list sorting | Recently updated; manual | Sets the default list order. Choose manual to drag rows into order; pinned areas and custom sections can also maintain their own sorting. |
| Developer mode | Off | Reveals workspace grant history and advanced diagnostic options; does not grant extra file permissions. |
| Auto-accept Group invitations | On | Automatically joins invited local BotHarness Groups without waking the Bot. When off, the invited Bot decides whether to join. |
| Assignment concurrency limit | Default 8 (integer 1–32) | Shared limit across all Bots for simultaneously running background tasks. Lowering this limit does not interrupt tasks already in progress. |
| DeepSeekBot version | Displays the running version | Click **Check for updates** to query npm, **Update now** to install a new release, and **Restart now** (on Web) to reload. See [Update DeepSeekBot](/docs/update-deepseekbot). |
| My default name | Empty (`Human`); up to 128 characters | Click **Save name** to set how you are addressed in chat, mentions, and Bot context. Click **Restore default** or save an empty value to reset to `Human`. |
| Anonymous usage statistics | On | Saves and takes effect immediately without a restart. See [Anonymous usage statistics](#anonymous-usage-statistics) below. |

The **External platform defaults** section at the bottom configures default intake and identity rules for connected IM platforms; see the [Lark / Feishu](/docs/lark-connection) and [Slack](/docs/slack-connection) guides for details.

## Appearance and wallpaper

Open **Bot settings → Appearance** (`⌘,` on macOS or `Ctrl+,` on Windows/Linux opens Bot settings directly while in Bot mode). Appearance settings are saved locally per device and client (Web and Desktop keep separate preferences) and do not alter your native DSH theme.

| Setting | Options | Effect |
| --- | --- | --- |
| Theme | Light, dark, or system | Sets the color scheme for Bot mode. |
| Palette and Primary | Classic Blue, Mist Purple, Forest Green, Warm Amber, or any custom primary color | Configured independently for light and dark modes. |
| Panel header / body | Background color, opacity, background blur | Applies to all panels in the current mode while keeping text and message bubbles legible. |
| Wallpaper library | Up to 24 images (max 20 MB each) or silent videos (max 100 MB each) | Click **Add wallpaper** or drag files in, then pick one or choose **None**. Use **Adjust crop** to position and zoom. Adding your first wallpaper automatically makes uncustomized panels semi-transparent. |
| Switch automatically | Off, every 1 / 5 / 15 / 30 minutes, or hourly; **Shuffle** | Rotates through your wallpaper library. Video wallpapers loop silently and pause when the window is in the background. |
| Appearance recovery | **Clear panel settings**, **Restore defaults…** | **Clear panel settings** resets per-panel overrides in the current mode. **Restore defaults…** prompts for confirmation before resetting both light and dark modes and emptying the wallpaper library (your Bots, data, and layout are untouched). |

To customize an individual panel, open its header menu → **Appearance settings**. Every property can either follow the global theme or use a custom override for that panel, and **Reset this panel** clears its overrides. You can also control appearance and wallpapers from the terminal; see the [CLI guide](https://github.com/BotHarness/BotHarness/blob/main/docs/bot-cli.md#device-local-deepseekbot-appearance).

## Context compaction

A Bot's main conversation (its Orchestrator Session) grows with every turn. Compaction replaces older conversation history with a concise summary so subsequent turns use fewer tokens and respond faster.

- **Compact now**: Type `/compact` in the Bot's DM composer, send `/compact` (or `/压缩`) in an IM DM, or run `deepseekbot bot-compact <bot-id>`. You will see the token count before and after compaction. If the Bot is currently busy, wait for the turn to finish or stop it first.
- **Compact idle conversations early**: Found in **Bot settings → Models & execution** (enabled by default). When a Bot has been idle for half of its model's prompt-cache lifetime (at least 15 minutes), the Host automatically compacts the session while the prompt cache is still warm—which is much cheaper than compacting after the cache expires. Idle compactions happen quietly in the background and are logged in the Bot's activity overview. For details and per-model overrides, see the [CLI guide](https://github.com/BotHarness/BotHarness/blob/main/docs/bot-cli.md#idle-compaction).

If a single turn still exceeds the model's context window, you will see a clear notice in chat so you can retry with a smaller request.

## Quick search and shortcuts

Press **Alt+K** (`Option+K` on macOS, or `Ctrl+K` / `⌘K` where supported by your browser) in Bot mode to quickly jump to any Bot, group, Channel, or individual setting row. Selecting a settings result opens the right page and highlights the matching setting.

Press `?` or `Ctrl/⌘ + /` to view all keyboard shortcuts, or customize them under **Bot settings → Keyboard shortcuts**.

## Create a Bot and edit its Profile

Click **Create your first PersonaBot** in Bot mode or use the **New** button at the top of the Bot list.

| Field | How to configure |
| --- | --- |
| Source | **Empty** initializes a fresh Memory Repository. **Git import** clones an accessible Git URL and uses its existing persona and memory files. |
| Name | Required display name. You can rename the Bot anytime using the edit button next to its name in the Profile. |
| Roles | Optional role tags. Press Enter or comma to add a tag, or click its close button to remove it. |
| About | Optional short bio shown on the Bot's Profile card. |
| Persona template | Starter templates (Blank, Colleague, Roleplay) to pre-fill the initial persona instructions. |
| Persona | Editable instructions that define the Bot's identity and communication style at creation. |

![Bot creation fields and persona templates](/guides/install/06-create-bot-zh.webp)

After creating a Bot, click its name or avatar in the chat header → **View details** to customize its profile:

- **Change avatar**: Upload a PNG, JPEG, or WebP image, crop it, and save. You can remove an uploaded avatar at any time.
- **Design avatar**: Customize an illustrated or line-art avatar using presets, facial features, shape sliders, and colors. Click Save to apply; if an uploaded image is also present, the uploaded image takes display priority.
- **Activity overview**: Pin your favorite metric cards to the Profile popover. **Token usage** toggles between **Daily total** and **By model**, with 7 / 30 / 90 days, All time, or custom date ranges in the **⋯** menu. Hover over any bar to see the breakdown of cached input, uncached input, and output tokens.
- **Persona and memory files**: Open **Memory files** in the right sidebar to read, preview, and edit `SOUL.md`, `MEMORY.md`, and other files in the Bot's memory repository.
- **Standing memory limits**: Located in **Bot DM → Memory files → Standing memory limits**, where you can configure the character limits for `SOUL.md` and `MEMORY.md` (applied on the next Session or next compaction); see [Bot Soul and Core Memory](/docs/soul-and-core-memory).
- **External identities and connectors**: Located in the Bot DM's Channel sidebar; see [External identities](/docs/channel-sidebar/external-identities) and [External connectors](/docs/channel-sidebar/external-connectors).

## Bot wake policy and local Groups

A Bot's **Wake policy** is managed in the Channel sidebar of its DM. Open **Bot DM → Channel sidebar → Wake policy**, click a source row, choose when the Bot should wake up, and click **Save** (or **Restore default** to reset). See [Wake policy](/docs/channel-sidebar/wake-policy) for all available sources and options.

In local Groups, you can override how each member Bot responds to ordinary group messages under **Group header → View details**, as well as manage invitations, join requests, and group members.

## Channel sidebar display settings

See the [Channel sidebar overview](/docs/channel-sidebar) for feature guides, and [Display and layout](/docs/channel-sidebar/display) for details on customizing tabs, order, and visibility.

Clicking the chat header's **··· → Channel settings…** opens the current chat's Model, Workspace Grants, Wake policy, External identities, External connectors, or Group management. The gear icons next to section titles in the right sidebar adjust your local browser display preferences without affecting Bot memory or permissions.

![Sidebar layout, memory terminology, and session view menus](/guides/settings/settings-sidebar-zh.webp)

| Option | Default and effect |
| --- | --- |
| `+ Views` (next to tabs) | Check which tabs to show and drag them to reorder. Bot DMs and Groups remember separate layouts. |
| Edit sidebar (narrow window) | Drag entries to reorder, toggle visibility, and click Done. |
| Memory evolution → Terminology | Defaults to friendly **Memory terms**; switch to **Git terms** to view the same history using standard Git labels. |
| Bot Inbox → Show | Defaults to sorting **By time**; can be switched to group **By source**. |
| Sessions → Scope | Defaults to **Current** sessions; switch to **All** to view the Bot's full session list. |
| Sessions → Layout | Defaults to grouping **By status** (Working / Idle); can be switched to group **By workspace**. |
| Sidebar width | Defaults to 320 px; drag the divider between 260–560 px. Your chosen tab, split heights, and expanded sections are remembered automatically. |

## Workspace grants and task permissions

Open **Workspace grants** from a Bot DM's **Channel settings** (header **··· → Channel settings…**). Every Bot has its own **Memory Repository** by default. Click **Add folder** to grant the Bot access to additional project folders on the machine running DSH.

![Workspace grants with no extra folder authorization](/guides/settings/settings-workspace-grants-zh.webp)

| Action / setting | Effect and scope |
| --- | --- |
| Add folder | Grants this Bot permission to work in a specific folder on the Host machine. Managed independently per Bot. |
| Revoke / remove directory | Revokes the Bot's access to that folder for future work (never deletes your actual files on disk). |
| Allow all file access for new work | Off by default, meaning new background Assignments are restricted to authorized workspaces and prompt for approval when needed. Turning this on (after confirmation) grants full filesystem access to newly created tasks. |
| Tool approval rules | When a tool requires approval, you can allow it once, remember the exact operation, or save a broader rule. You can inspect or revoke saved rules here at any time. |
| Developer-mode history / advanced options | When Developer mode is enabled, lets you view historical and revoked workspace grants. |

When getting started, we recommend granting a single project folder and keeping the default task permissions.

## Anonymous usage statistics

DeepSeekBot sends lightweight, anonymous usage telemetry from the DSH Host by default, and shows a one-time notice the first time you open Bot mode. Events are associated only with a random installation ID stored locally in `$DSH_HOME/botharness/telemetry.json`:

- `plugin_started`: Plugin version, DSH version, operating system, and CPU architecture.
- `bot_created`, `bot_archived`, `bot_deleted`, `marketplace_bot_installed`, and `avatar_edited`: Records only that the event occurred.
- `connector_enabled`: Records only the connector type (`feishu`, `lark`, `slack`, `discord`, `weixin`, or `other`).
- First-time intro and onboarding tutorial: Step views, completion/skip actions, high-level theme action category (`scheme`, `preset`, or `wallpaper`), whether Advanced task model mode was used, and community link clicks (`github`, `discord`, or `qq`). **Never includes** model names, wallpaper files, or any text you type.
- `daily_usage`: Sent at most once per day with total PersonaBot count, new session and message counts since the last summary, and the window duration in whole hours. No event is sent per message.
- `$exception`: When an unhandled error occurs in BotHarness code, records only the error type, function names, line numbers, and package-relative file paths (such as `@botharness/core/dist/index.mjs`). Error messages and personal file paths are never included.

**What is never sent**: Your name, Persona or Memory contents, chat messages, prompts, tool arguments, Git repository URLs, connector accounts, workspace paths, credentials, or IP addresses.

**How to opt out**: Open **Bot settings** and toggle off **Anonymous usage statistics**. This takes effect immediately without a restart, drops any queued events, and persists across restarts. Administrators can also disable telemetry globally by setting `telemetry: false` on the BotHarness core plugin or launching DSH with `DO_NOT_TRACK=1` or `BOTHARNESS_TELEMETRY=0`. For full details, see the [Privacy Policy](https://deepseekbot.botharness.ai/en/privacy) and the [telemetry source code](https://github.com/BotHarness/BotHarness/tree/main/packages/core/src/telemetry).

## Advanced parameters and optional capabilities

The public **`deepseekbot`** npm package includes Core, Client, Browser, Computer, and IM Providers out of the box. All external IM accounts start disconnected, and Browser and Computer access start turned off for each Bot until you explicitly enable them.

- **Core configuration**: See the [Core configuration reference](/dev/reference/config) for keys such as `enabled`, `agentPreset`, `activityDetailConsumers`, and `telemetry`.
- **Browser and Computer configuration**: See the [Browser configuration schema](https://github.com/BotHarness/BotHarness/blob/main/packages/browser/src/index.ts) and [Computer configuration schema](https://github.com/BotHarness/BotHarness/blob/main/packages/computer/src/index.ts), as well as the user guides for [Share a browser tab](/docs/daily-browser) and [Computer export and transfer](/docs/computer-export).
- For headless or declarative deployments, you can configure plugin fields in your Profile or Patch layers as documented in the [official DSH documentation](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish).
