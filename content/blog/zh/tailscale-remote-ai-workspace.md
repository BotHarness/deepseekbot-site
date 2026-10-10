---
{
  "title": "Tailscale 远程工作区实战",
  "description": "2C4G VPS 不必承载全部开发环境。用真实 VPS 到 Mac 的实验，讲清 Codex SSH、T3 会话调度、人工审批与新设备配置的边界。",
  "date": "2026-10-11",
  "tags": ["Tailscale", "实战", "AI 工作区"]
}
---

如果你的 Bot 常驻在一台 2C4G VPS，而代码、开发工具和模型登录环境都在自己的电脑上，不一定要把整套开发环境搬上服务器。另一种办法是：**VPS 保持在线并提交任务，电脑在自己的工作区执行，结果再返回 VPS。**

我们用一台 2 vCPU、约 4 GiB 内存的 VPS 和一台 Mac 做了真实验证：VPS 创建会话，Mac 在已有项目目录里执行只读任务，人在网页批准命令，最后由 VPS 读回结果。这篇文章说明这条链路如何组成，以及哪些部分不能混为一谈。

先说边界：这是一次 CLI 实验，不是已经发布的 DeepSeekBot 远程执行功能。普通 SSH 路线可以独立使用；T3 会话路线依赖我们测试的独立 Nightly 服务与试验客户端。它们也不代表更快、更便宜或无限制的本机访问。

## 先选路线：SSH，还是远程会话？

Tailscale 提供的是设备之间的网络通路。通路上可以跑 SSH，也可以跑一个带自己鉴权的应用接口。两者解决不同的问题。

| 你要做什么 | 路线 | 谁负责执行与授权 |
| --- | --- | --- |
| 让本机 Codex 登录 VPS，检查服务或执行命令 | 普通 SSH，经 Tailscale 私网访问 VPS | VPS 的 SSH 用户、密钥和系统权限 |
| 从 VPS 在 Mac 上创建可查看、可审批的 T3 会话 | 私网 HTTPS，经 Tailscale Serve 访问 T3 MCP | Mac 的 T3 服务、独立应用授权和执行器 |
| 用手机查看、发送消息或审批 | 手机浏览器访问获准的 T3 服务 | 手机网络准入和浏览器的 T3 授权 |

**如果你只是想让 Codex SSH 到 VPS，不需要 T3。** 我们实际用的是普通 OpenSSH 公钥认证，流量走 Tailscale；没有启用 Tailscale SSH。后者是另一套可选的 SSH 服务与策略，不能因为命令里用了 Tailscale IP 就把两者当成一回事。

## 路线一：让本机 Codex SSH 到 VPS

这条路径中，Codex 在你的电脑上调用已有的终端工具。远程 shell 命令由 VPS 执行；Codex 本身不会因为 SSH 登录而自动搬到 VPS 上运行。

```text
本机 Codex
  → 本机 ssh 客户端
  → Tailscale 私网
  → VPS 的 sshd
  → 远程命令结果
```

准备工作如下：

1. 本机与 VPS 安装并登录 Tailscale，加入允许双方通信的 tailnet。若组织开启了设备审批，先完成审批。
2. VPS 启用普通 SSH 服务，使用专用普通用户；网络访问规则与主机防火墙允许该客户端访问 SSH 端口。
3. 在本机准备自己的 SSH 密钥，将公钥加入 VPS 对应用户的 `~/.ssh/authorized_keys`。不要把另一台电脑的私钥复制过来。
4. 首次连接时，通过可信途径核对 VPS 主机指纹，再保存到本机 `known_hosts`。不要为了省事关闭主机校验。
5. 先由人完成一次连接测试，再让 Codex 使用同一个 SSH 别名。

例如，在本机 `~/.ssh/config` 中填写：

```sshconfig
Host bot-vps
    HostName <VPS_TAILSCALE_IP_OR_NAME>
    User <VPS_USER>
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

把尖括号里的值替换为自己的设备地址和用户，先运行 `ssh bot-vps`。如果首次连接已核验、密钥不需要交互或已加载到 agent，再用下面的只读命令测试自动化路径：

```sh
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes bot-vps 'uname -s; pwd'
```

随后可以让 Codex：“通过 `ssh bot-vps` 查看系统与工作目录，先不要修改配置。”Codex 所在环境仍须允许网络与终端操作；如果它有审批要求，照常审批。SSH 用户能做什么，远程命令就可能做什么，因此不要默认给 Bot 一个 root 万能钥匙。

## 路线二：VPS 调度，Mac 执行

我们真正想验证的是反方向：不是本机操作 VPS，而是 VPS 把任务交给 Mac 的本地工作区。

```text
VPS 上的试验 CLI
  → Tailscale 私网 HTTPS
  → Mac 的 Tailscale Serve
  → 仅监听 loopback 的独立 T3 服务 /mcp
  → Mac 上的执行器与项目目录
  → 人工审批 → 任务结果 → VPS 读回
```

这条任务通道**没有通过 SSH 登录 Mac**。SSH 只用于我们从本机管理 VPS、在那里运行试验客户端。任务本身走的是应用接口。

Mac 上已经有一个正在使用的桌面 T3。为了不升级、不打断它，我们另起了独立服务，使用不同数据目录和端口。原桌面保持 `0.0.45`；实验服务使用 `v0.0.46-nightly.20261010.2935`，源码固定在 `98beed1a226c42b85c52ff5ee9d5dbb67d776a77`。版本差异影响外部授权和会话控制，不能拿开发分支的功能推断稳定安装版也支持。

对于一个已经启动、仅监听 loopback 的本地服务，Serve 的典型形式如下。这里是入口配置示例，不是 T3 的完整安装命令；先确认端口空闲，并检查现有 Serve 配置。

```sh
tailscale serve status
tailscale serve --bg --https=8443 http://127.0.0.1:43864
tailscale serve status
```

HTTPS 和 MagicDNS 等前提按 [Serve 官方说明](https://tailscale.com/docs/reference/tailscale-cli/serve)配置。已有服务使用其他端口时，相应替换。**Serve 是 tailnet 内的服务入口；不要用面向公网的 Funnel 替代它。** 也不要随手运行全局 reset，破坏同一设备上已有的服务。

网络可达以后，还有四件事：

- 给 VPS 客户端完成专门的应用授权。我们申请的范围只有 `orchestration:read` 和 `orchestration:operate`，没有使用桌面内部凭据或复制模型凭据。
- 在 Mac 上确认已有执行器能启动、PATH 正确、模型账号可用。网络接通不会解决模型额度不足。
- 注册 Mac 上的真实项目目录，并在任务启动前核对项目绑定；不能把 VPS 上的路径当成本机工作区。
- 保持 `approval-required`，由人在网页批准命令。让客户端能提交任务，不等于允许执行器任意读写电脑。

实验中的客户端是一个尚未作为产品交付的 CLI facade，并不是可直接照抄的 `deepseekbot remote` 命令。要复用这个会话方案，仍需实现或获得匹配版本的客户端、授权状态管理与防重复提交逻辑。

## 我们实际验证了什么？

真正读取项目前，我们先从 VPS 发起一个最小问候任务，要求执行器只回复“你好”，不调用工具。这一步确认了会话与模型回答的链路，但还不能证明工作区文件访问。

![VPS 发起的原始问候会话：任务要求不调用工具，Mac 上的 T3 执行器回复“你好”](/blog-images/tailscale-remote-ai-workspace/greeting.png)

*图 1：先确认任务能抵达执行器并得到回答，再验证真实目录。下面的过程截图均从原会话记录完成后补采，仅裁去私人设备信息和路径；没有重跑任务，也没有重建审批弹窗。*

2026 年 10 月 11 日，日本时间，我们从真正的 VPS 创建了一次会话，绑定 Mac 上已有的 BotHarness 项目。任务只允许确认工作目录和系统、读取根目录 `AGENTS.md`，并计算字节数与 SHA-256；不允许修改文件、安装依赖、跑测试或读取其他项目文件。

![原始只读任务的工具历史：pwd、等待输入、读取 AGENTS.md 前三行与 shasum 命令](/blog-images/tailscale-remote-ai-workspace/readonly-commands.png)

*图 2：展开原任务的执行历史，可以看到 `pwd` 和文件检查命令。列表中的 “Waiting for next input” 是历史事件，不是截图时仍待审批；它也不能替代审批弹窗本身的证据。*

网页首先出现了 `pwd` 的审批。人批准后，执行器完成任务，报告系统为 `Darwin 25.6.0 arm64`，工作目录匹配，文件为 **16,687 字节**，哈希与预先记录的本地证据一致。VPS 读回的最终状态为 `completed`，执行次数为 1，待审批数为 0；网页也显示了最终回答。

![原始工作区任务的最终回答：Darwin 系统、AGENTS.md 字节数和 SHA-256，底部仍为 Supervised 模式](/blog-images/tailscale-remote-ai-workspace/workspace-result.png)

*图 3：原会话里的文件读取结果与 Supervised 模式。完整本机路径已裁去，保留项目名称、系统、文件大小与哈希；VPS 的完成状态由独立接口读回确认，不从这张网页截图推断。*

我们还比较了执行前后的 Git 状态与已跟踪文件 diff，结果保持不变。这是有范围的检查，不是“整台电脑没有任何文件变化”的证明。完整脱敏记录见 [资格验证 Issue #1364](https://github.com/BotHarness/DeepSeekBot/issues/1364#issuecomment-6101294251)。

这个结果证明了一条完整链路：**远端提交 → 本机真实目录执行 → 人工审批 → 远端读取完成结果**。它没有证明生产 Bot 已接入、任意文件修改任务可靠、手机实机体验已通过，或原桌面会话自动同步。

## 四个容易踩的坑

### “Invalid OAuth state” 不一定是授权按钮点错

我们的试验客户端曾留下旧回调监听器。新登录流程写入了新的 pending state，却没能绑定已被占用的回调端口，导致状态与接收进程不匹配。修复点是先成功绑定监听，再保存 pending state，并在失败时清理定时器。

如果遇到同类问题，先检查回调进程、端口、登录状态和正在使用的链接是否属于同一次流程。不要把反复点击授权当作修复，也不要跳过 state 校验。

### 配对码过期，以及已有登录的浏览器

配对链接有期限，过期就为指定客户端重新生成，不复用旧码。我们测试的版本中，已经登录的浏览器访问裸 `/pair` 会返回应用；替换浏览器授权需要该版本的专用配对链接。

链接可能含有一次性凭据，只在目标设备上打开，不放进聊天、截图或文章。其他版本请核对对应实现，不把这一条当成永远不变的 URL 约定。

### 能看到会话，不代表能审批

最初浏览器只有只读授权，能看见命令，却不能点击 Approve。为浏览器单独增加已获准的读取与操作权限后，按钮才可用。VPS 客户端的授权和浏览器的授权是不同的；不能互相拿 token 顶替。

### 独立网页里的会话，不会出现在原桌面

独立服务有自己的状态目录。它是在同一台 Mac 上运行，但不是原桌面使用的同一个会话库。因此应打开对应服务的网页查看，而不是等待原桌面刷新。我们没有升级桌面，也没有做数据库迁移或同步。

## 新设备应该配置哪一层？

| 新设备角色 | 需要配置 | 不需要照搬 |
| --- | --- | --- |
| 新电脑上的 Codex，只想 SSH 到 VPS | Tailscale 网络准入、自己的 SSH 密钥、VPS 用户、公钥与主机指纹核验 | T3、模型凭据共享 |
| 新的任务执行电脑 | Tailscale、匹配版本的本地服务、执行器登录、自己的项目路径、独立应用授权 | Mac 的路径、私钥、服务数据库 |
| Android 手机，只做查看与审批 | Tailscale、可访问服务的浏览器、单独浏览器配对 | SSH 服务、Codex CLI |

手机路线是这个架构的下一步，不是本次实验的实机验收。执行电脑关机、睡眠或网络不可达时，VPS 不能凭空使用它的资源；长期使用前需要验证可用性、重连、任务中断、授权撤销与服务清理。

## 安全边界比“连上了”更重要

把权限分成四层检查：**设备与网络规则、SSH 或应用登录、可操作的项目范围、实际命令审批。** 加入 tailnet 并不会自动授予某个应用的权限；一次读取成功也不证明文件写入被允许。

长驻客户端还要在超时后区分“提交未成功”和“已执行但结果暂时没读到”，避免重试创建两个任务。密钥与客户端状态留在各自机器上；撤销权限时也要区分网络准入、SSH 公钥和应用授权。

## 从哪里开始最划算？

只想让 Codex 管理 VPS，就先完成普通 SSH 的只读测试。需要远程工作区、可视会话与人工审批，再评估独立应用接口，不要一开始就迁移原桌面环境。

如果已经在使用 DeepSeekBot，可以先阅读[能力说明](/docs/capabilities/)和[安装指南](/docs/installation/)，区分现有产品能力与这次实验。小 VPS 与本地电脑可以各司其职，但把这条链路接到生产 Bot 之前，仍需要独立的集成与可靠性验收。

## 参考

- [Tailscale：普通 SSH over Tailscale](https://tailscale.com/docs/reference/ssh-over-tailscale)
- [Tailscale SSH：独立 SSH 功能与访问策略](https://tailscale.com/kb/1193/tailscale-ssh)
- [Tailscale Serve：私网服务入口](https://tailscale.com/docs/reference/tailscale-cli/serve)
- [Tailscale：添加设备](https://tailscale.com/kb/1316/device-add)
- [T3 实验版本源码](https://github.com/pingdotgg/t3code/tree/98beed1a226c42b85c52ff5ee9d5dbb67d776a77)
- [真实 VPS 到 Mac 的完成记录](https://github.com/BotHarness/DeepSeekBot/issues/1364#issuecomment-6101294251)
