---
{
  "title": "分享 Bot",
  "description": "把 Bot 的 Memory 发布到 GitHub，并收录进 Bot 市场。",
  "order": 26,
  "source": "docs/share-bot.zh.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

分享 Bot，就是将它的记忆仓库（Memory Repository）发布为一个公开的 GitHub 仓库。其他人在 Bot 市场里找到它并点击 **安装** 时，会把该仓库克隆到本地，获得一个拥有同样记忆与设定的新 Bot。你本地的聊天记录、工作区授权、API 密钥和 IM 连接不会被分享，你后续的对话也不会同步给其他安装者。

## 不想公开？直接导出 zip

如果你只想把 Bot 发给认识的朋友或同事，或者迁移到自己的另一台电脑，无需发布到 GitHub：直接在 Bot 资料页右上角点击 **分享** 导出 zip 文件，对方通过 **从 zip 导入** 即可创建新 Bot。详见 [导出与导入 Bot](/zh/docs/bot-zip)。

## 发布前：检查将要公开的内容

公开的 GitHub 仓库任何人都能够访问，包括 Git 历史提交中曾出现过、后来被删除的文件。由于 Memory 中可能包含你告诉过 Bot 的个人信息、密钥或私人对话摘要，发布前请务必检查一遍：

1. 打开 **Bot 私聊 → Channel sidebar → 记忆文件**，逐一检查文件内容。
2. 打开 **记忆演化**，查看历史提交中是否出现过不宜公开的内容。

![记忆文件里能看到将要公开的全部文件，包括 .botharness/bot.json](/guides/share-bot/01-memory-files-zh.webp)

如果历史提交中曾出现过敏感内容，仅在当前工作区删除文件是不够的——你可以使用下方的推荐提示词，让 Bot 只推送一个不包含历史记录的全新提交。

## 方式一：让 Bot 自己发布（推荐）

前提：运行 DeepSeekBot 的电脑（Host）已安装 [GitHub CLI](https://cli.github.com/)，并已通过 `gh auth login` 登录。Bot 执行终端命令前会请求你的批准，每一步操作都清晰可见。

复制下面这段话，在要分享的 Bot 私聊中发送给它：

```text
请把你的 Memory 仓库分享到 BotHarness 的 Bot 市场，按下面的步骤做，每一步做完告诉我结果：

1. 列出 Memory 里的所有文件，并检查文件内容和 Git 历史里有没有密码、token、私人信息或我不想公开的内容。把发现的问题列给我，等我确认后再继续，确认前不要推送任何东西。
2. 如果还没有 README.md，写一份简短的介绍：你是谁、擅长什么、适合怎么用。然后用另一种语言再写一份：README.md 是中文就写英文的 README.en.md，是英文就写中文的 README.zh-CN.md。
3. 确认 .botharness/bot.json 存在（DeepSeekBot 通常已经自动生成）。没有就创建，写上你的名称、1 到 3 个标签和一句话简介，格式是 {"name": "名称", "tags": ["标签"], "bio": "一句话简介"}；已经有了就保留原有内容。然后在 "i18n" 里加上另一种语言的简介，格式是 {"i18n": {"en": {"bio": "One sentence"}}} 或 {"i18n": {"zh": {"bio": "一句话简介"}}}。
4. 用 gh 在我的 GitHub 账号下创建一个公开仓库并推送当前分支。仓库名用你的名称的英文或拼音，先告诉我你打算用的名字。如果第 1 步发现历史里有不该公开的内容，就只推送一个不带历史的新提交。
5. 给仓库加上 botharness-bot 话题：gh repo edit --add-topic botharness-bot
6. 把仓库地址发给我。
```

![把提示词发给要分享的 Bot](/guides/share-bot/02-prompt-zh.webp)

Bot 会先列出检查结果并等待你确认。确认后，它会创建公开仓库、推送代码、添加话题标签，并把仓库链接发给你。

## 方式二：手动用命令发布

在 **频道设置 → 工作区授权** 中找到该 Bot 的 Memory Repository 本地路径，然后在终端执行（将 `<路径>` 和 `<仓库名>` 替换为你自己的内容）：

```bash
cd <路径>
gh repo create <仓库名> --public --source . --push
gh repo edit --add-topic botharness-bot
```

你也可以在 GitHub 网页端新建一个空的公开仓库，使用 `git remote add origin` 和 `git push -u origin HEAD` 推送，然后在仓库首页右侧的 **About → Topics** 中添加 `botharness-bot` 话题。

## 收录到 Bot 市场

只要仓库是公开（Public）的且带有 `botharness-bot` 话题标签，系统每天会自动扫描并收录一次。如果你想让它立即出现在市场里，可以点击 DeepSeekBot 侧栏消息列表上方的 **＋（新建）→ Bot 市场**，在顶部粘贴仓库地址并点击 **收录**：

![在 Bot 市场粘贴仓库地址，立即收录](/guides/share-bot/03-market-paste-zh.webp)

收录成功后，它会同时出现在 DeepSeekBot 内置的 Bot 市场和 [官网 Bot 市场](https://deepseekbot.botharness.ai/market) 中，展示 README、Star 数、更新时间和话题标签。之后你每次向该仓库推送更新，市场会在一小时内自动同步到最新提交。

![收录后在官网 Bot 市场看到的样子](/guides/share-bot/04-site-market-zh.webp)

如果收录失败，Bot 市场会提示具体原因：

| 提示信息 | 解决方法 |
| --- | --- |
| 找不到这个仓库 / 这个仓库是私有的 | 确认仓库地址无误，并在 GitHub 设置中将仓库改为 Public。 |
| 缺少 botharness-bot 话题 | 在 GitHub 仓库首页右侧 **About → Topics** 中添加 `botharness-bot` 后重试。 |
| 这个仓库刚刚收录过 | 同一个仓库每 5 分钟最多抓取一次，请稍后再试。 |
| 这个仓库已被屏蔽或因举报隐藏 | 可在 GitHub 上给 BotHarness 提交 Issue 联系我们。 |

## 配置名称、标签、简介、头像和横幅：`.botharness/bot.json`

DeepSeekBot 会在每个 Bot 的 Memory 目录下自动生成并维护 `.botharness/bot.json`：创建 Bot 时自动写入，之后每次在 **编辑资料** 中修改名称、标签、简介或头像时都会实时同步。Bot 市场和安装该 Bot 的用户都会读取此文件，从而展示与你侧栏一致的资料。上传的头像图片会保存为 `.botharness/avatar.png`（或 `.jpg`、`.webp`），资料页横幅则统一保存为 `.botharness/banner.png`（1500 × 500）。

你也可以手动编辑该文件。你额外添加的字段会被保留；手动修改的字段也会一直保留，直到你下次在界面中修改资料：

```json
{
  "name": "BotPixel 像素画师",
  "tags": ["像素画", "头像设计"],
  "bio": "把一句话描述画成像素头像。",
  "avatar": { "image": "assets/avatar.png" },
  "banner": { "recipe": { "scene": "sea", "seed": 2786543041 } }
}
```

| 字段 | 说明 |
| --- | --- |
| `name` | 在市场中显示的名称，最多 60 个字符。 |
| `tags` | 标签，最多 8 个，每个不超过 32 个字符（旧版文件中的 `roles` 字段仍会作为标签读取）。 |
| `bio` | 一句话简介，最多 160 个字符；未填写时市场会回退显示 GitHub 仓库描述。 |
| `avatar` | 头像配置：`{ "image": "仓库内的图片路径" }`（支持 PNG、JPEG 或 WebP，最大 128 KiB），或像素头像配方 `{ "recipe": … }`。 |
| `banner` | 横幅配置：像素场景配方 `{ "recipe": { "scene", "seed" } }`，或自定义图片 `{ "image": ".botharness/banner.png" }`（3:1 的 PNG，最大 2 MB）。可选场景：`spring`、`summer`、`autumn`、`winter`、`sea`、`mountain`、`desert`、`forest`、`night-sky`、`space`。 |

所有字段均为可选。如果文件格式有误，市场会自动回退使用仓库名称和默认生成的像素头像。

## 双语展示：`README.zh-CN.md` 和 `i18n`

DeepSeekBot 内置市场和官网市场会根据读者的界面语言（中文或英文）优先展示对应语言的介绍：

| 内容 | 存放位置 | 展示对象 |
| --- | --- | --- |
| 中文 README | 仓库根目录的 `README.zh-CN.md`（或 `README.zh.md`） | 中文界面读者 |
| 英文 README | 仓库根目录的 `README.en.md` | 英文界面读者 |
| 默认 README | `README.md` | 其他语言读者，或未提供对应语言版本时回退显示 |
| 名称和简介的多语言版本 | `.botharness/bot.json` 中的 `"i18n"`，键名为 `zh` 和 `en` | 对应语言的读者 |

```json
{
  "name": "Orion",
  "bio": "Tells you what you can see in tonight's sky, for any city and date.",
  "i18n": {
    "zh": { "name": "猎户", "bio": "告诉你今晚能看到什么，任意城市和日期。" }
  }
}
```

`i18n` 中的 `name`（最多 60 字符）和 `bio`（最多 160 字符）规则与顶层一致，均可按需省略。你可以用最顺手的语言编写 `README.md` 和顶层 `bio`，再补充另一种语言版本。如果某种语言下没有提供作者编写的简介，市场会根据名称、仓库描述和 README 自动生成一句带“AI 摘要”标识的对应语言简介；只要你添加了 `i18n` 简介，就会优先展示你自己的文字。

## 资料横幅（Banner）

每个 Bot 的资料页顶部和私聊名称悬浮卡顶部都有一张横幅。新建的 Bot 会根据名字自动生成一张像素风景画；将鼠标移到横幅上并点击 **更换横幅**，你可以：

- 从十个主题场景中挑选：春、夏、秋、冬、海、山、沙漠、森林、星空、太空；
- **换一张**：在同一场景下重新随机生成画面；
- **上传图片**：上传自定义图片并裁剪为 3:1 比例；
- **恢复生成**：恢复为按 Bot 当前名称生成的默认场景。

![更换横幅：预览、换一张、上传图片、恢复生成和十个场景](/guides/share-bot/05-banner-zh.webp)

横幅会保存在 Bot 的记忆仓库中，无论是导出 zip 还是发布到 GitHub 市场，都会随 Bot 一起保留。

相关文档：[记忆文件](/zh/docs/channel-sidebar/memory-files)、[记忆演化](/zh/docs/channel-sidebar/memory-evolution)。
