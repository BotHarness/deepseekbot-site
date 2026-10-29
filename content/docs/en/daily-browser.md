---
{
  "title": "Share a browser tab",
  "description": "Share a tab or profile from your everyday browser so a PersonaBot can view or interact with it.",
  "order": 22,
  "source": "docs/daily-browser.md",
  "sourceRevision": "57745b1cc02225ed754a8b1cf5dbe7d77a176a11"
}
---

Daily Browser lets a PersonaBot work with pages already open in your everyday Chrome or Edge browser—reusing your active login session without making you sign in again inside an isolated browser.

Depending on how much access you want to grant, you can choose from three modes:

1. **Daily Browser (Read-only single tab)**: The safest, lightest option. The Bot can read the single tab you share, but cannot click, type, navigate, or see other tabs.
2. **Daily Chrome · Control (Control a single tab)**: Uses Microsoft's official Playwright extension so the Bot can read, type, and click inside one specific tab you select.
3. **Daily Chrome · Entire Profile (Control a Chrome Profile)**: Lets the Bot list and switch between ordinary tabs in that Chrome Profile, navigate or reload pages, and read, type, or click.

In every mode, you stay in control and can pause the Bot or revoke access at any time.

---

## Mode 1: Share a single tab read-only

Use this mode when you want a Bot to read, summarize, or analyze a logged-in page without modifying or interacting with it.

### 1. Install the read-only browser extension

Make sure your local DSH Web instance is open at `http://127.0.0.1:<port>` or `http://localhost:<port>` (the extension connects only to a DSH Host running on your own computer).

1. Locate the `extension` directory inside the installed Browser package (or `packages/browser/extension` in a source checkout).
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Turn on **Developer mode**, click **Load unpacked**, and select the `extension` directory.
4. Pin **BotHarness Daily Browser** to your browser toolbar for easy access.

### 2. Pair and share a tab

1. In **Bot settings**, set **Browser Target → Daily Browser** (this target setting is shared across Bots in your current DSH Profile).
2. Enable **Browser Access** for your Bot and expand the **Browser** section in its right Channel sidebar (Computer Access is not needed).
3. Click **Connect browser extension** to generate a single-use pairing code (valid for 5 minutes).
4. In your everyday browser, switch to the tab you want to share, click the extension icon, enter your local BotHarness address and pairing code, and click **Connect**.
5. Confirm the Bot name and current page title in the extension popup, then click **Share current tab read-only** (connecting alone does not share the page).
6. Ask your Bot to read the page in chat and approve its first browser action when prompted. The Bot reads visible text and control labels from the page, and never receives cookies or form input values.

While sharing is active, the Channel sidebar displays the shared page's title and URL, and the extension badge shows **READ**. You can continue browsing normally; navigating to a different URL or reloading the page automatically ends the read-only session.

### 3. Return the tab

Click **Return tab** in either the browser extension or the Channel sidebar at any time. Your tab stays open in the browser.

Sharing also ends automatically if you navigate away, reload, close the tab, turn off Browser Access, switch Browser Target, restart the browser, or reach the 30-minute session limit. To share a tab again later, simply generate a new pairing code and click Share.

> **Tip**: Internal browser pages (such as `chrome://`), extension pages, and built-in file viewers cannot be shared. Always open the extension on a standard `http://` or `https://` webpage.

---

## Mode 2: Control a single existing Chrome tab

If you want a Bot to fill out forms or click buttons on one specific tab without giving it access to the rest of your browser, use single-tab control mode.

1. Install Microsoft's official [Playwright extension](https://chromewebstore.google.com/detail/playwright-extension/mmlmfjhmonkocbjadbfplnigmagldckm) in your everyday Chrome profile.
2. In **Bot settings → Browser Target**, select **Daily Chrome · Control**, and enable **Browser Access** for the target Bot.
3. In the Bot's Channel sidebar under **Browser**, click **Connect existing page**, then pick the HTTP(S) tab you want to share on the Chrome connection page.
4. Check the selected page title and URL in DeepSeekBot. While it shows **Connected · control not granted**, the Bot cannot read or interact with the page yet—click **Allow control of this document** to confirm.
5. Ask the Bot in DM to read or interact with the page, and approve the first Browser operation when prompted. The Bot can read the page, type text, and click elements on that tab (typing and clicking bring the tab to the foreground, while reading leaves your active tab unchanged).
6. Click **Pause Bot** whenever you want to edit the page yourself, then click **Resume** when you're ready for the Bot to continue.
7. Click **Return tab** when finished to end the session while keeping your tab open.

Navigating to a new URL, reloading, or closing the tab automatically ends control. If you want the Bot to continue after a page navigation, reconnect and grant control again.

---

## Mode 3: Control an entire Chrome Profile

If you want a Bot to list open tabs, switch between tabs, and navigate across pages in your everyday Chrome profile, use entire-profile control mode.

1. Open `chrome://extensions` in Chrome, enable **Developer mode**, click **Load unpacked**, and select the `profile-extension` directory from your installed Browser package (or `packages/browser/profile-extension` in a source checkout). This extension can access ordinary HTTP(S) tabs in the profile while automatically excluding Incognito tabs.
2. In **Bot settings → Browser Target**, choose **Daily Chrome · Entire Profile**.
3. In the Channel sidebar, click **Pair Chrome Profile**. Enter your local Host address and the 5-minute single-use pairing code into the **BotHarness Chrome Profile Control** extension popup, check **Allow Profile-wide Browser control**, and complete pairing.
4. Enable **Browser Access** for your Bot. Once paired, the Bot can list and switch tabs (`browser_tabs`), navigate or reload the selected tab (`browser_open`), read page content (`browser_observe`), and type or click on elements. Pairing stays active across page navigations and reloads.
5. Click **Pause Bot** before making manual edits on a page so any in-progress action finishes cleanly, then click **Resume** when done.
6. To stop a single Bot from using the browser, turn off its **Browser Access**. To revoke access for all Bots at once, click **Forget Profile pairing**.

> **Troubleshooting**: If the extension disconnects after a browser or Host restart, click **Reconnect** inside the extension popup. Note that Chrome only allows one debugger attachment per tab—if DevTools is open on the same tab, close DevTools and ask the Bot to try again.
