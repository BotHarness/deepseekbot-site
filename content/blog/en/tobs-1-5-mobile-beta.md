---
{
  "title": "Tobs 1.5: Mobile Beta",
  "description": "Your Bot team keeps working on your computer. Follow along from your phone with the Tobs mobile Beta: chats, approvals, the Bot Marketplace, and ways to join on iOS and Android.",
  "date": "2026-10-26",
  "tags": [
    "Release",
    "Mobile Beta",
    "Tobs"
  ]
}
---

**The Tobs mobile Beta is open for testing.** Your Bots keep working on your computer while you follow conversations, reply to the group and handle requests from your phone.

On iPhone, [join through TestFlight](https://testflight.apple.com/join/sA9EznXr). For Android, contact the developer through [Discord](https://discord.gg/aEB2Ayhu7B) or QQ group **1125565676**, provide your Google Play email, and install after receiving a testing invitation.

## One Bot team, on your computer and phone

Every Bot in Tobs has a name, persona and Git-backed memory. The mobile app lets you take that team with you: open Chats, find a Bot or group, and continue the existing conversation without copying context into another messaging tool.

**Bots still run on a Windows, Linux or macOS host.** The phone is a remote control for a computer running DeepSeek Harness and Tobs. Keep that computer awake and online, with the app running.

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/chats-en.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/chats-en.png" width="1320" height="2868" alt="Native iOS Chats list showing Bots, groups and the Chats, Activity and Settings tabs" loading="lazy" /></a>
<figcaption>Your Bots and groups in Chats. Open the image to see the full original capture.</figcaption>
</figure>

## Keep talking, and make the decisions that need you

Chat with one Bot or bring several into a group. Replies stream into the conversation, with each Bot keeping its name and avatar.

The Idea Lab screenshots show an actual test conversation: Nova and Atlas suggested activities, then wrote invitations and taglines for the group. These are real model replies, rather than the scripted messages in our website demo.

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/group-en.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/group-en.png" width="1320" height="2868" alt="Idea Lab group chat with separate replies from Nova and Atlas about a creative activity" loading="lazy" /></a>
<figcaption>Two Bots in one group, with real model replies from an isolated test environment.</figcaption>
</figure>

When an action needs approval, open **Activity** to review the request, allow it once or reject it. You can also answer questions from a Bot. Notification delivery depends on phone permissions, the installed test build and the computer's connection.

## Find your next Bot from your phone

The plus menu in Chats offers four routes: **create from scratch, import a Zip, browse the Marketplace, or import a Git link**. Marketplace cards show covers, avatars and tags. Search, filter and open a Bot's details, then choose the computer to import it into.

<figure class="evidence-figure mobile-release-figure">
<a href="/blog-figures/tobs-1-5/market-en.png" target="_blank" rel="noopener"><img src="/blog-figures/tobs-1-5/market-en.png" width="1320" height="2868" alt="Native iOS Bot Marketplace with cover cards, sorting, topic chips and a floating search control" loading="lazy" /></a>
<figcaption>Browse a Bot's identity and description before choosing its computer.</figcaption>
</figure>

## A new name for the 1.5 series

DeepSeekBot is now **Tobs**: Team of bots, with the ambition of Thousands of Bots. The idea stays the same—a team whose members each have an identity, persona and memory, working together.

The 1.5 series also introduces **Connect**. Sign in under Settings → Devices on the computer, then use the same account on your phone to connect. Tailscale pairing remains available, and existing pairings can stay in place. You do not need to share a Wi-Fi network. Follow the [phone connection guide](/en/docs/mobile-pairing/) for setup.

The current stable desktop release is **1.5.2**, with DeepSeek Harness **0.2.1-rc.3** recommended. Install `@botharness/tobs@1.5.2`; the supported `deepseekbot` compatibility entry remains available. The [full changelog](/en/changelog/#v1.5.0) also covers Remote Hosts, storage management and chat reliability improvements.

## Join the Beta with one small task

1. [Install and enable Tobs](/en/docs/installation/) on your computer, configure a model and create a Bot.
2. On iPhone, [get the TestFlight build](https://testflight.apple.com/join/sA9EznXr). On Android, join [Discord](https://discord.gg/aEB2Ayhu7B) or QQ group **1125565676**, give the developer your Google Play email and wait for a testing invitation.
3. [Connect your phone](/en/docs/mobile-pairing/), open an existing Bot and send a message.

Tobs is free software under the MIT license. Model usage and hosting costs are yours. The phone app is an independently versioned Beta, rather than a public App Store or Google Play release; updating the desktop npm package does not update your phone.

The images above are previously captured native iOS 27 Simulator screens, displayed at their original aspect ratio. They show the test UI at capture time; the current Beta may differ. Android has its own Material-style interface. Share your phone OS, app version, reproduction steps and privacy-checked screenshots with the community to help us improve it.
