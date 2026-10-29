---
{
  "title": "Computer export & migration",
  "description": "Move a Computer to another machine — one archive out, one archive in.",
  "order": 20,
  "source": "apps/docs/src/content/docs/docs/computer-export.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

The Computer keeps its entire desktop environment—saved logins, bookmarks, downloads, and files—on a single Docker named volume. **Export** packs that volume into a single archive file, and **Import** restores it on the same computer or a new machine.

## Where files live

- All persistent data lives on the named volume mounted at `/config` (the desktop user's home directory). Removing the container is safe because the volume itself holds your Computer's state.
- **Workspace convention**: Keep your and your Bot's working files in `~/workspace` (`/config/workspace`). This directory is created automatically on startup if missing, lives on the persistent volume, and travels with your Computer when you export and import. Browser state is stored separately under `~/.config/chromium`.
- **Export directory**: Located on the Host machine, defaulting to `~/Desktop/BotHarness Exports` (or `~/BotHarness Exports` if there is no Desktop folder). When a native directory picker is available, you can change this path in **Settings → BotHarness → Computer**. Exported archives are saved here, and the import list reads from this folder.

## Export

1. Open **Settings → BotHarness → Computer**. The export directory shows its default path out of the box; click **Choose…** if you want to pick a different folder.
2. Click **Export to…** (or **Export**), select the destination, and confirm. The Computer gracefully closes its browser, stops the container, packs the volume, and restarts automatically if it was running. The settings row shows the current stage and elapsed time in real time.
3. Once complete, you will see the path to the timestamped `.tar` archive. On desktop deployments with a fixed export folder, the folder also opens automatically in your system file manager.

## Import on another machine

1. Install a container runtime (Docker or Colima) and DeepSeek Harness with BotHarness on the target machine, and start the profile once so the Computer plugin loads.
2. Copy the `.tar` archive to the target machine (via USB drive, `scp`, or network share).
3. Open **Settings → BotHarness → Computer** on the target machine to see its export directory, and place your `.tar` archive inside that folder.
4. Click **Import…**, select the archive, and confirm. The Computer recreates the volume, unpacks the archive, and starts up with all of your logins, bookmarks, and `~/workspace` files restored.

## Browser download and upload

On remote or web-only deployments (where a native Host folder picker isn't available), you can transfer archives directly through your browser:

- **Download**: After an export finishes, click **Download** to stream the archive to your device via your browser's save dialog—even a ~1 GB file streams directly without buffering in memory.
- **Upload and import**: Click **Choose archive file…** to select a local `.tar` file, then click **Authorize and import** to stream the upload and run the import. Existing archives with the same name are only replaced once the upload finishes completely.

## Size and time expectations

- The archive is an uncompressed `.tar` of the volume. After normal use, the volume is typically **around 1 GB** (including browser profile, caches, and workspace files). You can check the generated file size or run `docker system df -v` to inspect the live volume.
- Exporting or importing a ~1 GB volume locally typically takes **under a minute** each way, depending on disk speed.

## Treat archives as sensitive data

Because a Computer archive contains browser cookies and saved login sessions, treat it with the same care as a full browser-profile backup when storing or transferring it. Computer archives belong to the Host profile and are never bundled into individual PersonaBot exports.

## Developer diagnostics

If the desktop viewer ever fails to connect or render, `GET /api/computer/diagnostics` returns a chronological log of container lifecycle and viewer events—including mounts, stream phase transitions, reloads, and retries—to help you troubleshoot quickly.

## See also

- [ADR-0052](/dev/adr/0052-computer-storage-and-export) — persistent named volume storage and explicit export.
- [ADR-0062](/dev/adr/0062-computer-volume-quiesce-and-workspace) — browser quiescing before export and the `~/workspace` convention.
