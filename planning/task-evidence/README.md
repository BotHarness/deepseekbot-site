# Task evidence and shared model setup

## Windows PowerShell

Run the Windows entry point from this directory:

```powershell
& '.\setup-shared-model.cmd' 'D:\code\project\BotHarness'
```

Or use its absolute path from another checkout:

```powershell
& 'D:\code\project\deepseekbot-site-compare\planning\task-evidence\setup-shared-model.cmd' 'D:\code\project\BotHarness'
```

The launcher selects Git for Windows Bash explicitly. Calling bare `bash` in
PowerShell may select WSL, where Git Bash paths such as `/d/code/...` do not exist.
`setup-shared-model.cmd --help` only prints usage and does not start setup.
`setup-shared-model.cmd --check` selects the same Git Bash executable and checks
the script's syntax without prompting for a key.

## Git Bash, macOS or Linux

```bash
bash planning/task-evidence/setup-shared-model.sh /path/to/BotHarness
```

On Windows Git Bash, `/d/code/project/BotHarness` is also valid. The product
checkout must contain `scripts/dev-model.mjs`, `scripts/dev-instance.mjs`,
installed dependencies, and Node 22 or newer.

The wizard collects the OpenCode Go key with hidden input and delegates storage
to the product's model helper at `~/.config/botharness/ax-model.json`. Other
worktrees launched through `scripts/dev-instance.mjs` under the same operating
system user reuse that configuration. Windows and WSL have separate user homes.
The wizard retains existing configuration and does not launch a Host or call a
model. A successful configuration check still needs a real DM reply to establish
model availability.
