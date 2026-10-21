# 手机 App 上手：从安装到配对

DeepSeekBot 手机 App 是你自己电脑上 DeepSeek Harness（DSH）的遥控器。Bot、聊天记录和审批都留在电脑上，手机负责查看、聊天和审批，在外面也能用。这篇教程从一台干净的电脑开始，大约 20 分钟完成手机配对。

整个流程都免费。DSH 和 DeepSeekBot 都开源，不需要注册账号。手机通过你自己的 [Tailscale](https://tailscale.com) 网络连到电脑，Tailscale 个人版免费，但需要注册一个 Tailscale 账号。

**先看一遍完整流程**：[1 分钟演示视频](https://youtube.com/shorts/MWGKtM5xwkQ)。

**版本范围**：按 DeepSeek Harness 桌面端 `0.2.1-rc.2`、DeepSeekBot 插件 `1.4.1` 和 TestFlight 上的 iOS 测试版核对（2026 年 10 月 21 日）。

## 准备

- 一台 Mac、Windows 或 Linux 电脑，用手机时保持开机。
- 一部 iPhone，装好 TestFlight 上的 DeepSeekBot 测试版；或一部 Android 手机，加入 Google Play 内部测试。
- 一个模型提供商（比如 DeepSeek）的 API Key，Bot 才能回复。
- 一个 Tailscale 账号，可以用 Google、Microsoft、GitHub、Apple 等账号注册。

步骤：

1. 在电脑上安装 DeepSeek Harness。
2. 安装 DeepSeekBot 插件，创建一个 Bot。
3. 电脑和手机登录同一个 Tailscale 账号。
4. 用 `tailscale serve` 把 DSH 发布到你的 tailnet。
5. 手机扫码配对。

## 1. 安装 DeepSeek Harness

[下载 DeepSeek Harness 桌面端](https://www.deepseek.com/harness/)，选择 **0.2.1-rc.2** 版本和你的系统，安装后打开。

开发者也可以用命令行安装（需要 Node 22 以上）：

```bash
npm i -g @deepseek-ai/dsh@0.2.1-rc.2
dsh web
```

## 2. 安装 DeepSeekBot 并创建 Bot

1. 在 DeepSeek Harness 左侧点 **插件**，再点 **添加插件**。
2. 在 **包名或地址** 里输入下面这一行，保持 **npm 官方源**，点 **安装**：

   ```text
   deepseekbot@1.4.1
   ```

3. 显示 **已安装** 后点 **立即启用**。如果提示重启，就重启 DSH。
4. 点左侧的 **Bot 模式**，跟随 Home 引导填入模型提供商的 API Key，再让内置助手托布帮你创建第一个 Bot。
5. 在电脑上给新 Bot 发一句话，收到回复就说明模型可用。

每一步的截图和常见问题见 [安装 DeepSeekBot](/docs/installation) 和 [API 与 Bot 模型](/docs/model-setup)。Bot 模式还需要 Git，缺少时点提示里的 **安装 Git** 即可。

## 3. 两台设备都登录 Tailscale

| 设备    | 下载                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| iPhone  | [App Store：Tailscale](https://apps.apple.com/app/tailscale/id1470499037)                                                                  |
| Android | [Google Play：Tailscale](https://play.google.com/store/apps/details?id=com.tailscale.ipn)                                                  |
| 电脑    | [tailscale.com/download](https://tailscale.com/download)（macOS、Windows、Linux）。macOS 推荐官网的独立版，它自带 `tailscale` 命令行工具。 |

电脑和手机用**同一个账号**登录，并保持 Tailscale 已连接。手机第一次打开时，系统会请求添加 VPN 配置，选择允许。

然后打开 [Tailscale 管理后台的 DNS 页](https://login.tailscale.com/admin/dns)，确认 **MagicDNS** 和 **HTTPS Certificates** 都已开启。手机只通过 HTTPS 连接。

## 4. 用 `tailscale serve` 发布 DSH

在电脑上进入 **Bot 模式**，点左下角的齿轮打开 **Bot 设置**，选择 **设备**。

如果 Tailscale 还没有发布 DSH，页面会显示一条黄色提示和一行命令：

![设备页显示 tailscale serve 命令](/guides/mobile-pairing/03-tailscale-missing-zh.webp)

在电脑上打开终端，**照着页面上的命令原样运行**，你的端口可能不同：

```bash
tailscale serve --bg 3080
```

- `--bg` 让它在后台运行，关掉终端或重启电脑后仍然有效。
- macOS 上如果提示找不到 `tailscale`，改用完整路径：`/Applications/Tailscale.app/Contents/MacOS/Tailscale serve --bg 3080`。
- 如果输出一个链接说 tailnet 没有开启 HTTPS，打开链接开启 HTTPS，再运行一次。

这条命令只把 DSH 发布给登录了你自己 tailnet 的设备，公网访问不到。关掉再重新打开 **设备** 页，黄色提示消失、只剩 **配对手机** 按钮时继续。

![Tailscale 就绪后的设备页](/guides/mobile-pairing/01-devices-zh.webp)

## 5. 手机扫码配对

在电脑上点 **配对手机**，弹出一个二维码。二维码只能用一次，10 分钟后失效，过期了点 **换一个二维码**。

![电脑上的配对二维码](/guides/mobile-pairing/02-pair-qr-zh.webp)

在手机上：

1. 确认 Tailscale 已连接。
2. 打开 DeepSeekBot App，首次打开会进入 **与电脑配对**。
3. 允许使用相机，对准电脑上的二维码。扫不了的话，在电脑上点 **复制配对链接**，把链接发到手机上，粘贴到 **或粘贴配对链接**。
4. 可以在 **在这台手机上的名称** 里给电脑起个名字，然后点 **配对**。

![手机上的与电脑配对页面](/guides/mobile-pairing/04-phone-pair-zh.webp)

配对后，手机会显示电脑上的 Bot 和群聊。打开一个 Bot 发条消息，回复就来自你的电脑。电脑的 **设备** 页会在 **已配对设备** 里列出这部手机。之后重启电脑或 DSH 都不用重新配对。

![配对后手机显示电脑上的 Bot](/guides/mobile-pairing/06-phone-paired-zh.webp)

## 遇到问题

**手机连不上电脑**：检查两台设备的 Tailscale 都已连接、登录的是同一个账号，电脑没有休眠，DSH 正在运行。在手机浏览器里打开 `https://<电脑名>.<tailnet>.ts.net`，能打开电脑返回的任何页面，就说明网络是通的。

**重启 DSH 后黄色提示又出现了**：端口变了。运行提示里的新命令，再点 **换一个二维码**。

**手机丢了**：在电脑上 **已配对设备** 里点它旁边的 **撤销**，这部手机会立刻断开。

更多问题见 [配对手机](/docs/mobile-pairing)。其他问题欢迎[到 GitHub 提 Issue](https://github.com/BotHarness/DeepSeekBot/issues)。
