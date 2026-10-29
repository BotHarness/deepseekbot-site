---
{
  "title": "分享浏览器标签页",
  "description": "将日常浏览器的标签页或 Profile 授权给 PersonaBot 查看或操作。",
  "order": 22,
  "source": "docs/daily-browser.zh.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

通过日常浏览器（Daily Browser）功能，你可以将自己正在使用的 Chrome 或 Edge 浏览器中的页面分享给 PersonaBot，直接复用当前页面的登录状态，而无需在隔离浏览器中重新登录。

根据你的使用需求，DeepSeekBot 提供三种不同粒度的日常浏览器连接模式：

1. **日常浏览器（只读分享单个标签页）**：最轻量、最安全，Bot 只能读取你指定的单个标签页内容，不能点击、输入或跳转。
2. **日常 Chrome · 控制（控制单个标签页）**：借助微软官方 Playwright 扩展，允许 Bot 在你指定的单个标签页中读取内容、输入文字和点击元素。
3. **日常 Chrome · 整个 Profile（控制整个浏览器配置）**：允许 Bot 查看并切换该 Chrome Profile 下的各个普通网页标签页，执行导航、读取、输入和点击。

无论使用哪种模式，你都可以随时暂停 Bot 或收回标签页权限。

---

## 模式一：只读分享单个标签页

这种模式适合让 Bot 帮你阅读、总结或分析已经登录的网页内容，Bot 无法对页面做任何修改或点击操作。

### 1. 安装只读浏览器扩展

请确保你在本机通过 `http://127.0.0.1:<端口>` 或 `http://localhost:<端口>` 访问本地 DSH Web 实例（扩展仅连接运行在你本机上的 DSH 服务）。

1. 找到已安装的 Browser 插件包内的 `extension` 目录（或源码仓库中的 `packages/browser/extension`）。
2. 在 Chrome 中打开 `chrome://extensions`，或在 Edge 中打开 `edge://extensions`。
3. 开启右上角的**开发者模式**，点击**加载已解压的扩展程序**，选择上述 `extension` 目录。
4. 建议将 **BotHarness Daily Browser** 固定到浏览器工具栏，方便随时点击分享。

### 2. 配对并分享标签页

1. 在 **Bot 设置** 中将 **Browser 操作目标（Browser Target）** 设为 **日常浏览器**（同一 DSH 环境下的 Bot 共用此目标设置）。
2. 为目标 Bot 开启 **Browser Access**，并在右侧 Channel sidebar 展开 **Browser** 分区（无需开启 Computer Access）。
3. 点击 **连接浏览器扩展** 生成一次性配对码（配对码有效期为 5 分钟）。
4. 在日常浏览器中切换到你想分享的网页，点击工具栏上的扩展图标，填入本地地址和配对码，点击 **Connect**。
5. 核对扩展弹窗中显示的 Bot 名称和当前网页标题，点击 **Share current tab read-only**（仅连接扩展不会自动分享页面内容）。
6. 在私聊中让 Bot 查看页面（首次调用 `browser_observe` 时按提示批准操作）。Bot 只会读取当前页面的可见文本和控件名称，不会读取你的 Cookie 或密码输入框内容。

分享期间，右侧栏会显示当前分享的网页标题和地址，浏览器扩展图标也会显示 **READ** 标记。你仍然可以正常浏览网页；如果你跳转到其他地址或刷新页面，本次只读借用会自动结束。

### 3. 归还标签页

点击浏览器扩展或右侧栏中的 **归还标签页** 即可随时结束分享，你的原标签页会保持打开状态。

此外，页面跳转、刷新、关闭标签页、关闭 Browser Access、切换 Browser Target、重启浏览器或单次借用满 30 分钟，都会自动结束分享。下次需要分享时，重新生成配对码并点击分享即可。

> **提示**：浏览器内部设置页（如 `chrome://`）、扩展页以及内置文档查看器不支持分享，请在普通 `http://` 或 `https://` 网页上打开扩展进行配对。

---

## 模式二：控制单个已有 Chrome 标签页

如果你希望 Bot 在你已经打开的某一个网页里帮你填写表单或点击按钮，但不想让它访问其他标签页，可以使用单页面控制模式。

1. 在你日常使用的 Chrome 中安装微软官方的 [Playwright 扩展](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm)。
2. 在 **Bot 设置 → Browser 操作目标** 中选择 **日常 Chrome · 控制**，并为目标 Bot 开启 **Browser Access**。
3. 在右侧栏的 Browser 分区点击 **连接现有页面**，然后在 Chrome 弹出的选择页中点选你要授权的那个 HTTP(S) 标签页。
4. 回到 DeepSeekBot 核对页面标题与 URL。此时状态为 **已连接，尚未允许操作**，确认无误后点击 **允许控制此页面**。
5. 在私聊中让 Bot 读取或操作该页面，并在首次执行时批准会话工具请求。在此模式下，Bot 可以在该页面上读取内容、输入文字以及点击页面元素（点击和输入时会将该标签页切到前台，仅读取时不会切换焦点）。
6. 如果你需要中途自己操作页面，点击 **暂停 Bot** 即可接管；操作完成后点击 **继续**，Bot 会在重新读取页面状态后继续工作。
7. 完成后点击 **归还标签页** 即可收回控制权，原标签页会保持打开。

如果该标签页发生地址跳转、刷新、关闭，或者连接断开，控制授权会自动结束；如需继续操作，重新连接并点击授权即可。

---

## 模式三：控制整个 Chrome Profile

如果你希望 Bot 能够在你的日常 Chrome 中自由查看标签页列表、切换标签页并在页面间导航操作，可以使用整个 Profile 控制模式。

1. 在 Chrome 中打开 `chrome://extensions`，开启**开发者模式**，点击**加载已解压的扩展程序**，选择已安装 Browser 包中的 `profile-extension` 目录（或源码仓库中的 `packages/browser/profile-extension`）。该扩展支持访问当前 Profile 下的普通 HTTP(S) 网页标签页，自动排除无痕窗口。
2. 在 **Bot 设置 → Browser 操作目标** 中选择 **日常 Chrome · 整个 Profile**。
3. 在右侧栏点击 **配对 Chrome Profile**，将本地地址和 5 分钟内有效的一次性配对码填入 **BotHarness Chrome Profile Control** 扩展弹窗中，勾选允许控制整个 Profile 后完成配对。
4. 为目标 Bot 开启 **Browser Access**。配对成功后，Bot 可以列出和切换当前 Chrome Profile 中的所有普通网页标签页（`browser_tabs`）、在选中标签页中导航或刷新（`browser_open`）、读取页面内容（`browser_observe`），以及在页面上输入文字和点击按钮。页面跳转或刷新后无需重新配对。
5. 当你需要手动操作网页时，可随时点击 **暂停 Bot**，待当前动作完成后即可自由编辑；点击 **继续** 后 Bot 会重新读取最新页面状态。
6. 若要停止单个 Bot 的访问，关闭该 Bot 的 **Browser Access** 即可；若要彻底解除绑定，点击 **解除 Profile 配对** 即可撤销所有 Bot 对该 Chrome Profile 的访问权限。

> **排查提示**：如果连接中断，可以在浏览器扩展弹窗中点击 **Reconnect** 恢复连接。如果在操作页面时遇到报错，请检查该标签页是否同时打开了 Chrome 开发者工具（DevTools）或其他调试器——关闭冲突的调试窗口后让 Bot 重新读取即可。
