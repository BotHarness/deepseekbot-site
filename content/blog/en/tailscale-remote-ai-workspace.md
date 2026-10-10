---
{
  "title": "Remote AI Workspaces with Tailscale",
  "description": "Keep an always-on bot on a small VPS and run tasks in a Mac workspace. A real trial explains Codex SSH, T3 sessions, human approvals and new-device setup.",
  "date": "2026-10-11",
  "tags": ["Tailscale", "Guide", "AI workspaces"]
}
---

If your bot lives on a small VPS while your code, development tools and model login live on your computer, you do not necessarily need to move the entire development environment to the server. **The VPS can stay online and submit tasks; your computer can execute them in its own workspace and return the results.**

We tested this with a 2-vCPU VPS with roughly 4 GiB of memory and a Mac. The VPS created a session, the Mac ran a read-only task in an existing project directory, a human approved commands in the web UI, and the VPS read back the result. This guide separates the parts of that chain that are easy to confuse.

The boundary matters: this was a CLI experiment, not a released DeepSeekBot remote-execution feature. Ordinary SSH works independently of T3. The session route used a separate T3 Nightly server and an experimental client. Neither route establishes a speed advantage, a cost saving or unrestricted access to your computer.

## Choose the route: SSH or remote sessions?

Tailscale supplies a network path between devices. You can run SSH over that path, or call an application with its own authentication. They solve different problems.

| Your goal | Route | Execution and authorization |
| --- | --- | --- |
| Let local Codex inspect a VPS or run remote commands | Ordinary SSH to the VPS over Tailscale | The VPS SSH user, keys and operating-system permissions |
| Create a visible, supervised T3 session on a Mac from a VPS | Private HTTPS through Tailscale Serve to T3 MCP | The Mac T3 service, application authorization and local executor |
| View sessions, send messages or approve from a phone | A phone browser connected to the permitted T3 service | Network access and separate browser authorization |

**If all you want is Codex SSH access to a VPS, you do not need T3.** Our actual connection used ordinary OpenSSH public-key authentication over Tailscale. Tailscale SSH was not enabled. It is a separate optional SSH feature with its own policies; using a Tailscale IP does not mean you are using it.

## Route one: let local Codex SSH to a VPS

Here, Codex calls the terminal tools on your computer. The remote shell commands execute on the VPS. SSH does not automatically move the Codex process onto the server.

```text
Local Codex
  → local ssh client
  → Tailscale private network
  → VPS sshd
  → remote command output
```

Set up these layers first:

1. Install and sign in to Tailscale on both devices, with a tailnet policy that permits their connection. Complete device approval if your organization requires it.
2. Enable ordinary SSH on the VPS and use a dedicated non-root account. Network rules and the host firewall must allow the client's connection to the SSH port.
3. Prepare a key on the client and add its public key to the VPS user's `~/.ssh/authorized_keys`. Do not copy another computer's private key.
4. Verify the VPS host-key fingerprint through a trusted channel on first connection, then save it in `known_hosts`. Do not disable host verification to simplify setup.
5. Complete a human connection test before asking Codex to use the same SSH alias.

For example, add this to your local `~/.ssh/config`:

```sshconfig
Host bot-vps
    HostName <VPS_TAILSCALE_IP_OR_NAME>
    User <VPS_USER>
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

Replace the angle-bracket placeholders and try `ssh bot-vps`. Once the host is verified and the key is usable without interaction, or loaded into an agent, test the automation path with a read-only command:

```sh
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes bot-vps 'uname -s; pwd'
```

You can then ask Codex to inspect the system and working directory through `ssh bot-vps`, without changing configuration. Its environment must still permit terminal and network access; any Codex approval requirements still apply. Remote commands inherit the SSH user's authority, so a root account should not be the default bot credential.

## Route two: the VPS submits, the Mac executes

Our main experiment went in the other direction: the VPS submitted work to the Mac's local workspace.

```text
Experimental CLI on the VPS
  → private HTTPS over Tailscale
  → Tailscale Serve on the Mac
  → isolated, loopback-only T3 service /mcp
  → local executor and project directory
  → human approval → result → VPS readback
```

This task channel **did not SSH into the Mac**. We used SSH from our computer to administer the VPS and run the client there. The task itself traveled through the application API.

The Mac already had an active desktop T3 installation. Rather than upgrade or interrupt it, we started a separate server with its own data directory and ports. The original desktop stayed on `0.0.45`. The experiment used `v0.0.46-nightly.20261010.2935`, pinned to `98beed1a226c42b85c52ff5ee9d5dbb67d776a77`. External authorization and session control are version-dependent; development-branch features are not evidence that a stable installation supports them.

For an already-running loopback service, a typical Serve entry looks like this. This configures an endpoint, not a complete T3 installation. First check that the ports are available and inspect existing Serve entries.

```sh
tailscale serve status
tailscale serve --bg --https=8443 http://127.0.0.1:43864
tailscale serve status
```

Follow the [official Serve documentation](https://tailscale.com/docs/reference/tailscale-cli/serve) for HTTPS, MagicDNS and other prerequisites, and substitute the ports your service uses. **Serve provides a tailnet endpoint; do not replace it with the public-facing Funnel.** Avoid a global reset that would remove other services on the same device.

Network reachability leaves four more jobs:

- Authorize the VPS client separately. We requested only `orchestration:read` and `orchestration:operate`, without extracting desktop credentials or copying model credentials.
- Check the local executor, its PATH and model account. A working network cannot repair an exhausted model credit balance.
- Register the real project directory on the Mac and verify the binding before submission. A path on the VPS is not the Mac workspace.
- Keep `approval-required` and let a human approve commands. Permission to submit a task is not unrestricted permission to read or write the computer.

The client was an experimental CLI facade, not a shipped `deepseekbot remote` command. Reusing this session architecture still requires a compatible client, authorization-state handling and protection against duplicate submissions.

## What did the trial prove?

Before reading a real project, we submitted a minimal greeting from the VPS: reply with “你好” (hello), without calling tools. That confirmed the session-and-model response path, but not access to workspace files.

![Original VPS greeting session: the task forbids tool calls and the T3 executor on the Mac replies with hello](/blog-images/tailscale-remote-ai-workspace/greeting.png)

*Figure 1: verify that a task reaches the executor and gets an answer before testing a real directory. These process screenshots were captured afterward from the original completed session records, cropped to remove private device information and paths. We did not rerun the tasks or recreate an approval dialog.*

On October 11, 2026, Japan time, the actual VPS created one session bound to an existing BotHarness project on the Mac. The task could confirm the working directory and OS, read only the root `AGENTS.md`, and return its byte count and SHA-256. It could not edit files, install dependencies, run tests or inspect other project files.

![Original read-only task history showing pwd, waiting for input, AGENTS.md inspection and the shasum command](/blog-images/tailscale-remote-ai-workspace/readonly-commands.png)

*Figure 2: the expanded task history shows `pwd` and file-inspection commands. “Waiting for next input” is a historical event, not an outstanding approval when the screenshot was taken. It is not a substitute for evidence of the approval dialog itself.*

The web UI first requested approval for `pwd`. After human approval, the executor completed the task: the directory matched, the OS was `Darwin 25.6.0 arm64`, and the file was **16,687 bytes**, with a hash matching the pre-recorded local evidence. VPS readback showed `completed`, one run and zero pending approvals. The web UI displayed the final answer too.

![Original workspace result showing Darwin, the AGENTS.md byte count and SHA-256, with Supervised mode still selected](/blog-images/tailscale-remote-ai-workspace/workspace-result.png)

*Figure 3: the original file-reading result and Supervised mode. The full local path is cropped out; the project name, OS, byte count and hash remain. VPS completion was confirmed by separate API readback, not inferred from this web screenshot.*

Before-and-after Git status and tracked-file diff snapshots were unchanged. That is a bounded check, not a full audit proving that nothing anywhere on the computer changed. The sanitized result is recorded in [qualification issue #1364](https://github.com/BotHarness/DeepSeekBot/issues/1364#issuecomment-6101294251).

It proves the complete chain: **remote submission → execution in a real local directory → human approval → remote result readback**. It does not prove production Bot integration, reliable arbitrary file-writing tasks, physical-phone usability or synchronization into the original desktop app.

## Four traps worth knowing

### “Invalid OAuth state” is not always a mistaken click

Our experimental client left an old callback listener alive. A new login wrote fresh pending state before discovering that it could not bind the occupied callback port. The receiver and state no longer matched. The fix was to bind the listener successfully before saving pending state, and clear its timer on failure.

Check the callback process, port and whether the link belongs to the current login attempt. Repeated approval clicks are not a repair, and disabling state validation is not a solution.

### Pairing expiry and an already-signed-in browser

Pairing links expire. Generate a fresh one for the intended client rather than reuse an expired code. In the tested version, a signed-in browser visiting bare `/pair` returned to the application; replacing its grant required that version's dedicated pairing link.

Such a link can contain a one-time credential. Open it only on the intended device, not in public chat, screenshots or an article. Check other versions rather than treating the URL convention as permanent.

### Viewing a session is not permission to approve

Our browser initially had a read-only grant. It could display the pending command, but Approve was disabled. After the human authorized a separate read-and-operate browser grant, the button became usable. Browser and VPS-client authorization are separate; their tokens are not interchangeable.

### A separate server is not the original desktop session store

The isolated service had its own state directory. It ran on the same Mac, but not against the desktop's session store. We had to open that service's web UI rather than wait for the desktop to refresh. We did not upgrade the desktop, migrate its database or synchronize the stores.

## What does a new device need?

| Device role | Configure | Do not copy over |
| --- | --- | --- |
| A new Codex client that only needs VPS SSH access | Tailscale access, its own SSH key, the VPS user and public key, verified host fingerprint | T3 or shared model credentials |
| Another task-execution computer | Tailscale, a compatible local service, executor login, its own project path and separate application authorization | The Mac's paths, private keys or service database |
| An Android phone for viewing and approval | Tailscale, browser access to the service and separate browser pairing | An SSH server or Codex CLI |

The phone route is a next step, not a passed physical-device test. An offline, sleeping or powered-off computer cannot provide its resources just because the VPS is online. Before long-term use, test availability, reconnection, interruption, authorization revocation and service cleanup.

## Keep the authorization layers separate

Check four layers: **device and network rules, SSH or application authentication, project scope, and command approval.** Tailnet membership is not application permission, and a successful read does not establish permission to write files.

A persistent client also needs to distinguish a failed submission from a task that ran but whose result has not yet been retrieved. Blind retries can create duplicate work. Keep keys and client state on their respective machines; revoking access may mean changing a network rule, removing an SSH public key or revoking an application grant.

## Where should you start?

For Codex administration of a VPS, begin with the ordinary SSH read-only test. For remote workspaces, visible sessions and human approval, evaluate a separate application interface without first migrating the active desktop environment.

If you already use DeepSeekBot, read the [capabilities guide](/en/docs/capabilities/) and [installation guide](/en/docs/installation/) to distinguish shipped capabilities from this experiment. A small VPS and a local computer can play different roles, but connecting this chain to a production Bot still requires its own integration and reliability qualification.

## References

- [Tailscale: ordinary SSH over Tailscale](https://tailscale.com/docs/reference/ssh-over-tailscale)
- [Tailscale SSH: separate SSH feature and access policies](https://tailscale.com/kb/1193/tailscale-ssh)
- [Tailscale Serve: a private service endpoint](https://tailscale.com/docs/reference/tailscale-cli/serve)
- [Tailscale: add devices](https://tailscale.com/kb/1316/device-add)
- [Pinned T3 experimental source](https://github.com/pingdotgg/t3code/tree/98beed1a226c42b85c52ff5ee9d5dbb67d776a77)
- [Completed VPS-to-Mac qualification](https://github.com/BotHarness/DeepSeekBot/issues/1364#issuecomment-6101294251)
