---
{
  "title": "Open files on the Host",
  "description": "Open, preview, and edit Memory files, Workspace folders, and chat attachments in native desktop apps.",
  "order": 21,
  "source": "docs/file-open.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

In DeepSeekBot, you can open a Bot's Memory files, authorized Workspace folders, and chat attachments directly in native applications on your computer (the Host), reveal them in your system file manager, or download them to your current device.

## Open files and folders in desktop apps

The Memory file reader, file cards in chat, and the rows for your **Memory Repository** and authorized **Workspace** folders all feature an **Open** split button:

- **Open with your default app**: Click the main **Open** button to launch the file or folder on the Host computer using its default application.
- **Open once with another app**: Click the dropdown arrow next to **Open** to see other detected applications on your system (such as VS Code, Cursor, Sublime Text, Finder, or File Explorer). Picking an app from the list opens the item with that app once without changing your default.
- **Set a default app**: Choose **Set default for …** in the dropdown menu to remember your preferred application for that file extension (such as `.md`) or for folders. Choose **Restore system default** at any time to clear your custom preference.

> **How default app preferences work**:
> - Your default app choice is saved for your current browser and Host profile only—it never alters your operating system's global file associations.
> - Because operating systems do not define a single default app for folders, clicking **Open** on a folder for the first time will ask you to pick your preferred file manager or editor.
> - If a previously saved default app is uninstalled or no longer available on the Host, DeepSeekBot will let you know and ask you to pick a new one rather than silently opening a different program.

### Opening files from Memory Evolution

In the **Memory Evolution** sidebar section, every file row in a commit diff or uncommitted working diff includes an **Open current file** button:

- This button always opens the file that exists at that path **right now**, rather than a historical snapshot from an older commit.
- When a file has been renamed, the diff displays the old path (deleted) and the new path (added) as two separate rows—use the button on the **new path** row to open the file.
- If the file has been deleted and no longer exists on disk, the button clearly indicates that the file is gone rather than recreating it from history.

### Additional file actions

On Memory file rows and chat attachment cards (by clicking a file card, right-clicking a file or image, or clicking the `···` More button), you can also:

- **Reveal in file manager**: Highlight the file directly in macOS Finder or Windows File Explorer.
- **Open in editor**: Launch the file in a chosen desktop editor.
- **Copy Host path**: Copy the full local filesystem path on the machine running DSH.
- **Download to this device**: Download the file through your browser. Clicking an image in chat continues to open the built-in image preview.

> **Using DeepSeekBot remotely (via Tailscale or Cloudflare Tunnel)**:
> Actions that launch an editor or file manager always open the window on the **Host computer** running DSH, whereas **Download** transfers a copy of the file to the device where your browser is open. Editing a downloaded copy on a remote device does not write changes back to the Host.

---

## Editing chat attachments in place

When you send a file in a local chat, DeepSeekBot stores it in a managed attachment directory for your profile:

- **Edit and save directly**: If you open a chat attachment in an external desktop app from the file card menu and save changes, you are editing that attachment directly. Refresh the Channel after saving, and any subsequent preview, read, or download of that attachment will reflect your updated content and file size.
- **Original local files stay separate**: Uploading a file creates an independent managed copy inside DeepSeekBot. Editing the attachment in chat never alters the original file you uploaded from your desktop, and separate uploads remain independent even if their initial contents were identical.

---

## Files from external channels (such as Lark / Feishu)

File cards from connected external IM channels use an **on-demand download** flow:

- Viewing a message or Bot Inbox card checks availability and displays the filename without automatically downloading remote files in the background.
- Click the filename to download the file to your current device, with clear progress and retry options if a transfer is interrupted.
- When the Host supports native file opening, external file cards also offer the application menu so you can open them locally—note that editing a downloaded local copy does not overwrite the file on the external IM platform.

---

## Let a PersonaBot process or edit files

You can also ask a PersonaBot to process uploaded files (for example, unpacking a ZIP of CSV files and generating a summary report) or edit an attachment directly.

### Option 1: Process an attachment and reply with a new file

1. **Grant write access to a work folder**: In the Bot's Channel sidebar, expand **Workspace Grants**, add a working folder, expand its row, and turn on **Allow Bot to write in this folder** (this is off by default; enable it only for folders where you want the Bot to save and generate files).
2. **Send the file and instructions**: Upload your file in a local DM (or upload it in an authorized Lark group/topic and `@mention` the Bot) and describe what output you need.
3. **Receive the generated file**: The Bot saves an independent working copy into the authorized workspace folder (never overwriting existing files), processes it using native file tools or approved Shell commands, and replies with a new downloadable attachment (or replies with the file directly inside the original Lark topic).

### Option 2: Ask the Bot to inspect or edit an attachment in place

- **Inspect an attachment**: Simply ask the Bot in chat to read the attachment from a specific message.
- **Edit the original attachment in place**: If you want the Bot to modify the existing attachment on the message itself rather than creating a new file, explicitly ask it to edit the original (for example: *"Change `status=pending` to `status=approved` in this original `status.txt`"*).
- When the Bot requests permission to edit the original attachment, approve the tool prompt. Once the Bot finishes, refresh the Channel and open or download the original message's attachment to see the updated file.
