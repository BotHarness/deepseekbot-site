---
{
  "title": "安装 Tobs",
  "description": "在 DSH 中安装 Tobs 插件、开启 Bot 模式并创建你的第一个 Bot。",
  "order": 12,
  "source": "docs/installation.zh.md",
  "sourceRevision": "dd96ffeb7916af20d1fed2b59cd3b5a56314e488"
}
---

> **当前稳定版：1.6.0。** 下方文字与安装口令已更新至 1.6.0；部分配图保留自早期版本界面，操作时请以正文中的包名与说明为准。

本指南介绍如何在 DeepSeek Harness（DSH）中安装 **Tobs** 插件、开启 Bot 模式并创建你的第一个 PersonaBot。安装这一个插件包即可同时获得核心运行时、界面客户端以及配套的 IM 连接组件。

请安装正式版 npm 包 **`@botharness/tobs@1.6.0`**，推荐搭配 **DSH `0.2.1-rc.3`** 使用（同时兼容 `0.2.0-rc.2` 与 `0.2.1-rc.2`）。升级前建议先备份当前 Profile，以便需要回退旧版本时能够恢复数据。

新安装请统一使用 `@botharness/tobs` 包名与 `tobs` 命令。如果你此前已经安装了 `deepseekbot`，可以继续保留原有的 `deepseekbot` 包与命令，无需删除现有 Profile、配对设备或聊天记录，两者底层组件完全一致。

## 1. 打开插件中心

启动 DSH 并打开 Web 界面。如果尚未安装 DSH，请先参考 [DSH 官方入门文档](https://deepseek-harness.github.io/deepseek-harness/) 完成安装。你也可以参考[配置 API 与 Bot 模型](/docs/model-setup)先配好模型服务商；创建 Bot 后，可在私聊右侧栏的 **模型** 中为它指定具体模型。

点击界面左侧栏的 **插件（Plugins）**，再点击右上角的 **添加插件（Add plugin）**。

![DSH 侧边栏中的插件入口](/guides/install/01-dsh-entry-zh.webp)

## 2. 填写完整包名并安装

在 **包名或地址（Package name or address）** 输入框中粘贴以下完整包名与版本号：

```text
@botharness/tobs@1.6.0
```

安装来源保持默认的 **npm 官方源（npm official registry）**，点击 **安装（Install）** 并等待安装任务完成。

![在添加插件弹窗中填写 npm 包名与版本](/guides/install/02-install-source-zh.webp)

_注意：截图展示的是早期版本的界面示例，实际安装时请务必输入上方的 `@botharness/tobs@1.6.0`。_

### 为什么建议带上明确版本号

建议在安装时直接填写带完整版本号的 `@botharness/tobs@1.6.0`，而不要使用不带版本号的旧包名。由于包管理器的发布冷却期策略（例如 pnpm 默认的新版本年龄限制），刚发布不久的新版本在不指定版本号时可能会回退解析到旧版本，从而引发与当前 DSH 版本不兼容的提示。

如果你使用的是桌面版（Desktop）并希望通过命令行安装或重试，请先完全退出桌面端应用，再运行 `dsh plugin --profile desktop add @botharness/tobs@1.6.0`，完成后重新启动桌面端即可。整个过程无需删除原有 Profile 数据。

## 3. 启用插件

安装完成后，界面会显示 **已安装（Installed）** 以及插件包名和版本号。点击 **立即启用（Enable now）**。如果你已经关闭了安装弹窗，也可以回到插件列表手动打开 **启用 @botharness/tobs（Enable @botharness/tobs）** 开关。

![安装完成后显示版本号与立即启用按钮](/guides/install/03-installed-zh.webp)

启用后，左侧栏会出现 **Bot 模式（Bot mode）** 入口。如果 DSH 提示需要重启才能生效，按提示重启当前 DSH Profile 并刷新页面即可。

![插件已启用且左侧边栏出现 Bot 模式](/guides/install/04-enabled-zh.webp)

## 4. 通过主页引导创建第一个 Bot

点击左侧栏的 **Bot 模式**，在 **主页（Home）** 配置好模型后，向内置助手 Tob 发送创建请求，即可一步步创建出你的第一个 Bot 与群聊，并选择你喜欢的界面布局模式（默认选中 **简洁模式**）：

- **简洁模式**：最后在控制列选择 **Messages** 进入对话；
- **高级模式**：最后点击 **Home 标题** 关闭 Home，返回与 Tob 的私聊。

两种方式都会进入原来的 Tob 私聊。

新建的 Bot 不会自动发送预设欢迎语。你可以主动发一句问候，确认它能正常调用模型回复。模型 API 密钥由 DSH 统一管理，更多关于模型配置与个性化设置可参考[配置 API 与 Bot 模型](/docs/model-setup)和[设置说明](/docs/settings)。

## 5. 接入聊天软件（可选）

刚安装完成时默认没有绑定任何外部聊天软件。确认本地私聊能正常回复后，你可以查看[连接与可选工具](/docs/capabilities)，在 Bot 私聊右侧栏的 **外部身份（External identities）** 中绑定飞书 / Lark、QQ、个人微信、Slack 或 Discord 账号。

## Git 环境说明

由于每个 Bot 的长期记忆都是一个本地 Git 仓库，Bot 模式需要运行 DSH 的电脑上装有 **Git 2.28 或更高版本**。如果电脑上还没有安装 Git 或版本过低，Bot 模式顶部会给出提示，并暂时禁用新建和导入 Bot。

最省事的办法是直接点击提示条里的 **安装 Git（Install Git）** 按钮。它会自动下载一份约 65 MB 的便携版 Git 到 DSH 数据目录中，校验通过后立即启用——既不需要管理员权限，也不会影响你系统原有的环境。如果你之后自己安装了系统级 Git，下次启动 DSH 时会自动优先使用系统 Git。

你也可以自行安装系统 Git：

- **macOS**：在终端运行 `xcode-select --install` 按提示安装，或使用 Homebrew（`brew install git`）。
- **Windows**：下载并安装 [Git for Windows](https://git-scm.com/download/win)（保持默认选项即可）。
- **Linux**：使用系统包管理器安装 `git`（例如 `sudo apt install git`；Ubuntu 20.04 默认源版本较旧，建议使用 [git-core PPA](https://launchpad.net/~git-core/+archive/ubuntu/ppa) 升级）。

手动安装完成后，重启 DSH 并在 Bot 模式顶部点击 **重新检查（Check again）**。你可以在 **Bot 设置 → Git** 中随时查看当前使用的 Git 版本与来源。

此外，当你通过 `git@github.com:owner/repo.git` 这样的默认 SSH 地址导入 Bot，而本机又未配置对应的 SSH 密钥时，系统会自动尝试转换为对应的 HTTPS 地址完成同步，并在界面上告知你。

## 其他安装方式（命令行与离线包）

除了在图形界面安装，你也可以使用 DSH 命令行将插件安装到指定的 Profile：

```bash
dsh plugin --profile <your-profile> add @botharness/tobs@1.6.0
```

请将 `<your-profile>` 替换为你实际运行的 Profile 名称，安装后在插件页面开启启用开关即可。

如果你需要通过本地归档包安装，可以先执行 `npm pack @botharness/tobs@1.6.0` 将预编译包下载到当前目录（生成 `botharness-tobs-<version>.tgz`），然后在 Web 界面的 **包名或地址** 中填入该文件在 **DSH 所在机器上的绝对路径**，或在命令行运行：

```bash
dsh plugin --profile <your-profile> add ./botharness-tobs-<version>.tgz
```

## 常见问题排查

| 现象 | 排查建议 |
| --- | --- |
| 提示插件与当前 DSH 版本不兼容 | 请确认 DSH 版本为 `0.2.0-rc.2`、`0.2.1-rc.2` 或 `0.2.1-rc.3`，且安装的完整包名为 `@botharness/tobs@1.6.0`。 |
| 提示找不到包或版本 | 检查包名拼写与版本号是否完整，确认安装源选为 **npm 官方源** 后重试。 |
| 已安装但左侧没有 Bot 模式 | 在当前 Profile 的插件列表中开启 **启用 @botharness/tobs**；若提示需重启，重启 DSH 后刷新页面。 |
| 能进 Bot 模式但发消息无回复 | 检查是否已在 **设置 → 模型** 中配好可用的 API Key，并在 Bot 右侧栏的 **模型** 中选定了模型。 |
| IM 机器人列表为空 | 全新安装默认未连接外部账号，按对应平台的接入指南添加即可。 |

如果你希望从源码构建或参与开发，请参阅 [仓库 README](https://github.com/BotHarness/BotHarness#readme)。
