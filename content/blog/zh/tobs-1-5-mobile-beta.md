---
{
  "title": "Tobs 1.5：移动端 Beta",
  "description": "电脑上的 Bot 团队，现在可以用手机继续协作。了解托布 Tobs 1.5 的移动端 Beta：私聊与群聊、工具审批、Bot 市场，以及 iOS 和 Android 的加入方式。",
  "date": "2026-10-26",
  "tags": [
    "版本更新",
    "移动端 Beta",
    "Tobs"
  ]
}
---

**托布 Tobs 的移动端 Beta 开放测试了。** 电脑上的 Bot 继续工作，你可以在手机上跟进对话、回复群聊，并处理需要你决定的工具请求。

iPhone 用户可以直接[加入 TestFlight](https://testflight.apple.com/join/sA9EznXr)。Android 用户可通过 [Discord](https://discord.gg/aEB2Ayhu7B) 或 QQ 群 **1125565676** 联系开发者，提供 Google Play 邮箱，收到邀请后安装测试版。

## 同一支 Bot 团队，电脑与手机协同

Tobs 里的每个 Bot 都有自己的名字、人格和 Git 记忆。移动端让你带着这支团队出门：在 Chats 查看私聊和群组，进入原来的对话继续交流，不必再把上下文复制到另一个聊天工具。

**Bot 仍运行在 Windows、Linux 或 macOS 宿主机器上。** 手机相当于遥控器，需要配合安装了 DeepSeek Harness 和 Tobs 的电脑使用；电脑需要保持开机、联网，并运行应用。

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/chats-zh.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/chats-zh.png" width="1320" height="2868" alt="iOS 中文聊天列表，显示 Bot 私聊、群组及底部聊天、活动、设置入口" loading="lazy" /></a>
<figcaption>手机上的 Chats：找到原来的 Bot 和群聊。点击图片可查看完整原图。</figcaption>
</figure>

## 在手机上聊，也在手机上做决定

你可以和一个 Bot 私聊，也可以进入群组，让不同成员各自提供想法。回复按消息流式呈现，群里保留每位 Bot 的名字和头像。

配图里的「点子实验室」来自真实测试对话：Nova 和 Atlas 围绕一次创意活动给出建议，再各自写一句邀请语。它们是模型实际回复，而不是官网演示中的预设台词。

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/group-zh.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/group-zh.png" width="1320" height="2868" alt="点子实验室群聊中，Nova 和 Atlas 分别回复创意活动的邀请语" loading="lazy" /></a>
<figcaption>两个 Bot，同一条群聊；对话来自隔离测试环境中的真实模型回复。</figcaption>
</figure>

需要你批准操作时，打开 **Activity** 查看请求：检查操作内容，允许这次或拒绝，也可以回答 Bot 提出的问题。通知是否到达取决于手机权限、测试版本和电脑连接状态。

## 从手机找到下一个 Bot

聊天列表的加号提供四个入口：**从零创建、Zip 导入、浏览市场、Git 链接导入**。市场用封面、头像和标签展示 Bot，你可以搜索、筛选并查看详情，选择目标电脑后再导入。

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/market-zh.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/market-zh.png" width="1320" height="2868" alt="iOS Bot 市场的封面卡片、排序、主题标签和悬浮搜索按钮" loading="lazy" /></a>
<figcaption>Bot 市场：先浏览角色与说明，再决定把它加入哪台电脑。</figcaption>
</figure>

## 1.5，也换上了 Tobs 这个名字

DeepSeekBot 现在叫 **托布 Tobs**。Tobs 意为 Team of bots，也寄托了 Thousands of Bots 的愿望：各有身份、人格和记忆的 Bot，一起工作。

1.5 系列还加入了 **Connect**：在电脑的设置 → 设备中登录，再让手机登录同一个账号连接电脑；也可以继续使用 Tailscale 配对。手机不必与电脑处于同一个 Wi-Fi 下，已有配对可以保留。具体步骤见[手机连接教程](/docs/mobile-pairing/)。

桌面端目前的正式版本为 **1.5.2**，推荐搭配 DeepSeek Harness **0.2.1-rc.3**，安装包为 `@botharness/tobs@1.5.2`。原有 `deepseekbot` 兼容入口保留。[完整更新记录](/changelog/#v1.5.0)还包含远程环境、存储管理和聊天可靠性的改进。

## 加入 Beta，从一条消息开始

1. 按[安装教程](/docs/installation/)在电脑上安装并启用 Tobs，配置模型，创建一个 Bot。
2. iPhone [安装 TestFlight 测试版](https://testflight.apple.com/join/sA9EznXr)；Android 加入 [Discord](https://discord.gg/aEB2Ayhu7B) 或 QQ 群 **1125565676**，向开发者提供 Google Play 邮箱，等待内测邀请。
3. 按[配对教程](/docs/mobile-pairing/)连接电脑，然后给已有 Bot 发一条消息。

软件免费、MIT 开源；模型调用与宿主机器的费用由你承担。移动端仍是独立版本的 Beta，并非 App Store 或 Google Play 正式上架；更新桌面 npm 包不会自动更新手机应用。

本文配图是此前保存的 iOS 27 原生模拟器截图，保持原始比例，展示的是当时的测试界面；当前 Beta 的细节可能有所变化。Android 使用独立的 Material 风格界面。欢迎把手机系统、应用版本、复现步骤和经过隐私检查的截图带到社区，帮助我们把移动端打磨得更好。
