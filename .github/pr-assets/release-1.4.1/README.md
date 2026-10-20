# Website 1.4.1 homepage captures

Real Playwright (Chromium) screenshots of `vite preview` serving a production `dist/`, captured 2026-10-20. Network requests other than localhost were blocked, so nothing was sent to analytics. The companion's consent and welcome bubbles were closed with their own buttons. Nothing was painted over or resized.

- `before-*`: site `origin/main` (`e855789`), built in a separate worktree.
- `after-*`: this branch.
- `*-features-zh-light-1440` / `*-features-en-dark-390`: the end of the Features rows. Before ends at Scheduled tasks; after adds the Mobile app (Beta) row.
- `after-mobile-*`: each step of the phone demo, zh, light and dark at 1440 × 1000: pair (before and after scanning), chats → Bot DM with a streamed reply, lock-screen approval (before and after Allow once), Browser viewer (Bot driving, then you driving). `after-mobile-3-keyboard-en-dark-390`: the approval decided with the keyboard alone at 390 px.
- `*-live-demo-*`: the hero Bot-mode demo, zh, light and dark. After shows the desktop layout from 1.4.0: full-height Control Rail, separate Channels / Messages / Channel subpanel panels, row status glyphs with corner unread counts, the Allow once / Always allow / Reject approval card, plus `activity`, `home` (Tob, Token usage, Bot activity) and `wallpaper` (see-through panels).
- `*-demo-*`: the five existing feature demos, zh, light and dark. The only change is the Folders approve button, which now reads 允许这次.
- No horizontal overflow at 390 px or 1440 px in either language.

The mobile app is Beta. Test builds go out through TestFlight and Google Play internal testing; there is no public store listing, and the page links to the community for an invite.
