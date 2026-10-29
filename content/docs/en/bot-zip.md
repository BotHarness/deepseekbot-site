---
{
  "title": "Export and import a Bot",
  "description": "Pack a Bot into a zip, choose its files and Git history, and import it as a new Bot.",
  "order": 26,
  "source": "docs/bot-zip.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

You can pack any Bot into a `.zip` file to share with a friend or colleague, or to move it to another computer. Importing the zip creates a new Bot with the same persona and memory. Unlike [sharing a Bot to the Bot Marketplace](/docs/share-bot), exporting a zip does not require GitHub or make anything public—the archive only leaves your computer when you send it to someone.

## What is in the zip

| Included | Never included |
| --- | --- |
| The Bot's Memory files, including uncommitted changes | Files ignored by `.gitignore`, symbolic links |
| `.botharness/bot.json` (name, tags, bio), avatar image, and `.botharness/banner.png` | Sessions, chat history, and the Bot Inbox |
| Optional: Git history (all branches, tags, and commits) | IM connections, Workspace grants, model settings, API keys, and credentials |
| | Git remotes, Git config, and recovery checkpoints |

## Export a Bot

1. Open the DM of the Bot you want to export and click the Bot's name at the top to open its profile.
2. Click **Share** at the top right of the profile (or right-click the Bot in the sidebar's message list and choose **Share**).

![Share at the top right of the Bot profile](/guides/bot-zip/02-export-section-en.webp)

3. In the export dialog, choose which files to include. Everything is selected by default; click the arrow next to any folder to expand it and uncheck files or folders you want to leave out, or use **Select all** and **Select none**. `.botharness/bot.json`, the avatar, and the banner are always included.
4. If you want the recipient to see how the Bot's memory evolved over time, check **Include Git history**.
5. Click **Export** to download a zip file named after your Bot.

![The export window: choose files and tick Include Git history](/guides/bot-zip/03-export-window-en.webp)

### Check before you share

A Bot's Memory may contain passwords, API keys, personal details you mentioned, or summaries of private conversations. Before sending a zip to anyone, review your files in **Bot DM → Channel sidebar → [Memory files](/docs/channel-sidebar/memory-files)** and uncheck anything you want to keep private.

Keep in mind that Git history preserves older content that was previously edited or deleted. For that reason, **Include Git history** is only available when all files are selected—as soon as you uncheck any file, the option is disabled so excluded files cannot be recovered from commit history. When in doubt, leave Git history unchecked.

## Import a Bot

1. Above the sidebar's message list, click **+ (New) → Create Bot → Import from zip**.

![The Create Bot submenu: Start empty, Import from GitHub, Import from zip](/guides/bot-zip/01-create-menu-en.webp)

2. Click **Choose zip file**, select the zip archive, and click **Import**.

![Import from zip: choose the file, then click Import](/guides/bot-zip/04-import-en.webp)

Importing creates a brand-new Bot and opens its DM:

- Its name, tags, bio, avatar, and banner are loaded from `.botharness/bot.json` inside the zip (`roles` from older exports are imported as tags; if `bot.json` is missing, the zip filename is used as the Bot's name).
- A zip without Git history initializes the new Bot's Memory with a single clean initial commit.
- A zip with Git history preserves all branches, tags, and commits and checks out the branch that was active when exported; any uncommitted changes remain uncommitted and can be inspected in [Memory evolution](/docs/channel-sidebar/memory-evolution).

![After importing with history, Memory evolution shows the original branches and commits](/guides/bot-zip/05-imported-history-en.webp)

The imported Bot is completely independent of the original—future conversations and memory updates on either side will not sync. You can configure models, Workspace grants, and IM connections on the new Bot as needed.

### Only import zips you trust

Because files in the zip become the new Bot's standing Memory, an untrusted archive could contain harmful instructions. Only import zips from sources you trust, and review **Memory files** after importing.

Unsafe or corrupted zip files are rejected automatically:

| Message | Cause and next step |
| --- | --- |
| This is not a valid zip file, or it is damaged. | The download was incomplete or corrupted. Download it again or ask the sender for a fresh export. |
| The zip has unsafe paths … | A file attempts to write outside the Bot directory (such as `../`) or uses a symbolic link. Ask for a clean export. |
| The zip is too large … | Exceeds 100 MB or 20,000 files. Ask the sender to uncheck large files or omit Git history. |
| The zip has no files. | The selected archive is empty. |

You can also import a regular folder compressed with your operating system's built-in zip tool: if all files sit inside a single top-level folder, that wrapper folder is unwrapped automatically, and macOS metadata files (`__MACOSX` and `.DS_Store`) are skipped.

Related: [Share a Bot to the Bot Marketplace](/docs/share-bot), [Memory files](/docs/channel-sidebar/memory-files), [Memory evolution](/docs/channel-sidebar/memory-evolution).
