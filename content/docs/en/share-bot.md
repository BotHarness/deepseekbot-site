---
{
  "title": "Share a Bot",
  "description": "Publish a Bot’s Memory to GitHub and list it in the Bot Marketplace.",
  "order": 26,
  "source": "docs/share-bot.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

Sharing a Bot publishes its Memory Repository as a public GitHub repository. When someone discovers it in the Bot Marketplace and clicks **Install**, DeepSeekBot clones the repository into a new Bot with the same persona and memory. Your local chat history, Workspace grants, API keys, and IM connections are never shared, and your future conversations do not sync to installed copies.

## Not ready to go public? Send a zip instead

If you just want to share a Bot with a friend or colleague, or move it to another computer, you don't need GitHub: click **Share** at the top right of the Bot's profile to export a `.zip` archive, and the recipient can use **Import from zip** to create a copy. See [Export and import a Bot](/docs/bot-zip).

## Before publishing: review what becomes public

Anyone can read a public GitHub repository, including files that were deleted in earlier Git commits. Because your Bot's Memory might contain personal details, keys, or summaries of private conversations, review it before publishing:

1. Open **Bot DM → Channel sidebar → Memory files** and inspect each file.
2. Open **Memory evolution** and check the commit history for anything that should remain private.

![Memory files shows every file that will become public, including .botharness/bot.json](/guides/share-bot/01-memory-files-zh.webp)

If sensitive data ever appeared in an older commit, simply deleting the file in the latest commit is not enough—the prompt below handles this safely by pushing a single fresh commit with no prior history.

## Option 1: Let the Bot publish itself (recommended)

Make sure the computer running DeepSeekBot (the Host) has the [GitHub CLI](https://cli.github.com/) installed and signed in via `gh auth login`. Your Bot will ask for your approval before running commands, so you stay in control of every step.

Copy the prompt below and send it in the DM of the Bot you want to share:

```text
Please share your Memory repository to the BotHarness Bot Marketplace. Follow these steps and tell me the result after each one:

1. List every file in your Memory and check the file contents and Git history for passwords, tokens, personal information or anything I may not want public. List what you find and wait for my confirmation before going on. Do not push anything before I confirm.
2. If there is no README.md, write a short one: who you are, what you are good at, and how to use you. Then write the same introduction in the other language: README.zh-CN.md in Chinese if README.md is in English, or README.en.md in English if it is in Chinese.
3. Check that .botharness/bot.json exists (DeepSeekBot normally creates it). If it is missing, create it with your name, 1 to 3 tags and a one-sentence bio, as {"name": "Name", "tags": ["Tag"], "bio": "One sentence"}; if it exists, keep what is there. Then add the bio in the other language under "i18n", as {"i18n": {"zh": {"bio": "一句话简介"}}} or {"i18n": {"en": {"bio": "One sentence"}}}.
4. Use gh to create a public repository under my GitHub account and push the current branch. Name it after you in English, and tell me the name before creating it. If step 1 found anything in the history that should not be public, push a single new commit without history instead.
5. Add the botharness-bot topic: gh repo edit --add-topic botharness-bot
6. Send me the repository URL.
```

![Sending the prompt to the Bot you want to share](/guides/share-bot/02-prompt-zh.webp)

The Bot will report what it finds and wait for your confirmation. Once you approve, it creates the public repository, pushes the files, adds the marketplace topic, and sends you the link.

## Option 2: Publish manually from the terminal

Find the Bot's Memory Repository path under **Channel settings → Workspace grants**, then run the following commands in your terminal (replacing `<path>` and `<name>`):

```bash
cd <path>
gh repo create <name> --public --source . --push
gh repo edit --add-topic botharness-bot
```

Alternatively, create an empty public repository on GitHub, push with `git remote add origin` and `git push -u origin HEAD`, and add the `botharness-bot` topic under **About → Topics** on the repository page.

## List your Bot in the Bot Marketplace

Any public GitHub repository with the `botharness-bot` topic is automatically indexed once a day. To list yours immediately, click **+ (New) → Bot Marketplace** above the message list in the DeepSeekBot sidebar, paste your repository URL at the top, and click **List**:

![Paste the repository URL in the Bot Marketplace to list it now](/guides/share-bot/03-market-paste-zh.webp)

Once listed, your Bot appears in both the in-app Bot Marketplace and the [Bot Marketplace website](https://deepseekbot.botharness.ai/en/market) with its README, star count, last updated date, and topics. Whenever you push new commits, the Marketplace updates within an hour.

![The listed Bot on the Bot Marketplace website](/guides/share-bot/04-site-market-zh.webp)

If listing fails, the Marketplace will tell you why:

| Message | Next step |
| --- | --- |
| Repository not found / repository is private | Check the URL and make sure the repository is set to Public on GitHub. |
| Missing the botharness-bot topic | Add `botharness-bot` under **About → Topics** on GitHub and try again. |
| This repository was just listed | A repository can be refreshed at most once every 5 minutes; wait a moment and retry. |
| This repository is blocked or hidden after reports | Open an Issue on the BotHarness GitHub repository to contact us. |

## Name, tags, bio, avatar, and banner: `.botharness/bot.json`

DeepSeekBot automatically creates and updates `.botharness/bot.json` in every Bot's Memory when you create the Bot or edit its name, tags, bio, avatar, or banner in **Edit profile**. Both the Marketplace and installed copies read this file so your Bot looks the same everywhere. Uploaded avatars are saved alongside it as `.botharness/avatar.png` (or `.jpg`, `.webp`), and the profile banner is saved as `.botharness/banner.png` (1500 × 500).

You can also edit `.botharness/bot.json` by hand. Any extra keys you add are preserved, and your manual edits stay in place until you next edit the profile in the UI:

```json
{
  "name": "BotPixel",
  "tags": ["Pixel art", "Avatar design"],
  "bio": "Turns a one-line description into a pixel avatar.",
  "avatar": { "image": "assets/avatar.png" },
  "banner": { "recipe": { "scene": "sea", "seed": 2786543041 } }
}
```

| Field | Meaning |
| --- | --- |
| `name` | Display name in the Marketplace (up to 60 characters). |
| `tags` | Up to 8 tags, each up to 32 characters (`roles` in older files are still read as tags). |
| `bio` | Short one-line introduction (up to 160 characters). Falls back to the GitHub repository description if omitted. |
| `avatar` | `{ "image": "path/in/repo" }` (PNG, JPEG, or WebP, max 128 KiB), or a generated pixel avatar `{ "recipe": … }`. |
| `banner` | A generated pixel scene `{ "recipe": { "scene", "seed" } }`, or `{ "image": ".botharness/banner.png" }` (3:1 PNG, max 2 MB). Scenes: `spring`, `summer`, `autumn`, `winter`, `sea`, `mountain`, `desert`, `forest`, `night-sky`, `space`. |

All fields are optional. If the file contains invalid JSON, the Marketplace falls back to the repository name and a generated pixel avatar.

## Bilingual listings: `README.zh-CN.md` and `i18n`

The Bot Marketplace displays each Bot in the reader's language (Chinese or English) when translations are provided:

| Content | Location | Shown to |
| --- | --- | --- |
| Chinese README | `README.zh-CN.md` at the repository root (`README.zh.md` also works) | Chinese readers |
| English README | `README.en.md` at the repository root | English readers |
| Default README | `README.md` | All other readers, or when no language-specific README exists |
| Translated name and bio | `"i18n"` in `.botharness/bot.json`, under `zh` and `en` | Readers using that language |

```json
{
  "name": "Orion",
  "bio": "Tells you what you can see in tonight's sky, for any city and date.",
  "i18n": {
    "zh": { "name": "猎户", "bio": "告诉你今晚能看到什么，任意城市和日期。" }
  }
}
```

`i18n` entries use the same character limits for `name` (60) and `bio` (160), and both are optional. If a listing does not have a bio in the reader's language, the Marketplace generates a one-sentence summary from your README and description, labeled "AI summary". Adding your own `i18n` bio always takes precedence over the AI summary.

## Profile banner

Every Bot has a banner at the top of its Profile and its header popover. New Bots automatically receive a pixel-art scene based on their name. Hover over the banner and click **Change banner** to:

- Choose from ten pixel scenes: spring, summer, autumn, winter, sea, mountain, desert, forest, night sky, or space;
- **Reroll** a new variation of the current scene;
- **Upload** your own custom image and crop it to 3:1;
- **Reset** to the default scene generated from the Bot's name.

![Change banner: a preview, Reroll, Upload, Reset and the ten scenes](/guides/share-bot/05-banner-en.webp)

Your banner is stored in the Bot's Memory repository, so it travels with the Bot when exported as a zip or installed from GitHub.

Related: [Memory files](/docs/channel-sidebar/memory-files), [Memory evolution](/docs/channel-sidebar/memory-evolution).
