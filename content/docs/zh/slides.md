---
{
  "title": "介绍 Slides",
  "description": "以幻灯片形式观看 BotHarness 与 DeepSeekBot 介绍。",
  "order": 12,
  "source": "apps/docs/src/content/docs-zh/docs/slides.mdx",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

你可以在线浏览随文档站一起发布的介绍幻灯片（Slides）：

- [打开介绍幻灯片](https://botharness.ai/slides/s/botharness-intro) —— 从封面开始浏览，按 `F` 键可进入全屏演示模式
- [查看全部幻灯片](https://botharness.ai/slides/) —— 浏览所有已发布的演示文稿

## 本地预览与编辑幻灯片

如果你正在参与文档或演示文稿编写，所有幻灯片均位于仓库的 `apps/presentations/slides/` 目录下，基于固定 `1920×1080` 画布的 React 组件（open-slide）构建。详细排版与写作规范请参考 `apps/presentations/AGENTS.md`。

```bash
pnpm slides:dev   # 启动本地开发预览：http://localhost:5173/s/<id>
pnpm slides:build # 重新构建嵌入文档站的静态产物
```

运行 `pnpm docs:build` 时也会自动重新构建幻灯片静态产物（生成在 `apps/docs/public/slides/` 下，由构建流程自动管理，无需手动提交）。
