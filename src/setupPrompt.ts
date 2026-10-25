import type { Lang } from './content';
import { DESKTOP_PACKAGE, DSH_VERSION } from './installRelease.ts';
import { COMMUNITY_LINKS, QQ_GROUP } from './communityLinks.ts';
import { TESTFLIGHT_URL } from './mobileBeta.ts';

/** Public instructions only: never copied to analytics, and not an unattended install script. */
export function setupPrompt(lang: Lang): string {
  if (lang === 'zh')
    return `请用中文协助我在官方 DeepSeek Harness（DSH）桌面版中安装并启用托布 Tobs，完成后打开 Bot 模式。

安装包：${DESKTOP_PACKAGE}。官网已验证的推荐 DSH 版本：${DSH_VERSION}。
官方桌面下载：https://www.deepseek.com/harness/
Tobs 安装指南：https://tobs.app/docs/installation/

1. 先确认你是否具备本机操作能力。没有时请给我清楚的手动步骤，不要声称已执行。只读检查操作系统、CPU 架构、已有 DSH 桌面版的真实安装位置、版本、运行状态及自定义 DSH_HOME。告诉我发现了什么；不要仅凭 PATH 上的 dsh 命令认定桌面版已安装。
2. 已有兼容桌面版时复用。没有时，先询问我是否安装，再从当前官方页面选择匹配系统和架构的最新官方桌面安装器，并核验实际版本、来源与兼容性。未公开支持的平台或未验证兼容的新版本，说明限制并停下来协商，不要用社区包冒充官方桌面版，不自动降级或覆盖现有安装。
3. 使用该桌面版实际拥有的 desktop Profile。优先用桌面插件管理界面安装上面的精确包名并启用。需要 CLI 时，定位桌面应用自带的 runtime/cli/bin/dsh（Windows 为 dsh.cmd）；先正常打开桌面完成初始化，经我同意并确认没有进行中的任务后完全退出，再用这个已确认的桌面内置 CLI 执行 plugin --profile desktop add ${DESKTOP_PACKAGE}，之后重新打开桌面核对启用状态。普通 npm 版 dsh 不能管理 Desktop Profile；不要改装到 web Profile 来凑成功，也不要另建或重置现有 Profile。
4. 保留原有数据、配置和凭据；不全局关闭供应链保护、不绕过系统签名或安全提示。管理员认证、系统确认和登录等需要我参与时，给出具体操作并等待。不要让我把密码或 API Key 发到聊天里。
5. 实际确认桌面能打开、正确 Profile 中的 Tobs 精确版本已安装启用、Bot 模式可见，才报告安装完成。失败时明确说明停在哪一步及如何重试。模型配置、首次真实回复和手机配对是后续可选步骤，本轮不以它们作为安装完成条件。
6. 桌面安装核验后，最后主动询问我：“是否还想在手机上使用托布 Tobs？如果需要，你用的是 iPhone 还是 Android？”如果不需要，在桌面安装完成处结束，不替我安装手机应用或开启远程连接。
7. 我选择继续后，按手机系统给出操作：iPhone 打开 ${TESTFLIGHT_URL}，按邀请页提示安装 TestFlight 和 Tobs 测试版；Android 通过 Discord（${COMMUNITY_LINKS.discord}）或 QQ 群 ${QQ_GROUP} 联系开发者，直接向开发者提供 Google Play 邮箱，等待被加入内测后按收到的邀请安装。不要声称自己已经发送邀请，也不要在 AI 聊天里收集邮箱、登录验证码或配对凭据。
8. 安装手机应用后，先阅读当前配对指南 https://tobs.app/docs/mobile-pairing/ 并核对实际界面，再询问我选择连接方式。可使用同账号 Connect：电脑 Bot 设置 → Devices/设备 → Connect 登录，手机登录同一 Tobs 账号、选择正确电脑并确认配对；或使用 Tailscale：两端连接同一 tailnet，按电脑设备页实际给出的 HTTPS 发布步骤准备连接，再在电脑生成配对二维码，让我在手机扫描或直接粘贴一次性配对链接。开启连接、修改网络发布或授予手机访问电脑权限前，解释目标与影响并等我明确同意；手机登录和相机/VPN 等系统权限由我在设备上完成，配对码和链接不发到聊天里。保留已有配对和 Tailscale Serve 映射，不覆盖或移除其他电脑。
9. 提醒我保持电脑开机、DSH 与 Tobs 运行。实际核对手机显示正确电脑且连接成功，已有 Bot/会话可见，才报告手机配对完成；若未配置模型或尚无 Bot，明确剩余步骤，不把安装成功或扫码成功当成聊天验证通过。需要连接多台电脑时，逐台确认授权并重复配对，再在“全部”或环境选择器中切换。`;
  return `Help me install and enable Tobs in the official DeepSeek Harness (DSH) desktop app, then open Bot mode. Communicate in English.

Package: ${DESKTOP_PACKAGE}. The site's qualified recommended DSH version is ${DSH_VERSION}.
Official desktop download: https://www.deepseek.com/harness/
Tobs installation guide: https://tobs.app/en/docs/installation/

1. Check whether you can operate this computer. If not, give clear manual steps and do not claim to have executed them. Read-only, inspect the OS, CPU architecture, actual DSH desktop app location, version, running state and any custom DSH_HOME. Report what you found; a dsh command on PATH alone does not prove the desktop app is installed.
2. Reuse an existing compatible desktop app. If absent, ask whether I want to install it, select the latest matching official desktop installer from the current official page, and verify its actual version, source and compatibility. For an unsupported platform or an unqualified newer version, explain the limitation and stop to agree on a path. Do not substitute a community app, automatically downgrade, or overwrite an existing installation.
3. Target the desktop app's actual desktop Profile. Prefer its plugin manager to install and enable the exact package above. If CLI work is needed, locate the app's bundled runtime/cli/bin/dsh (dsh.cmd on Windows). First launch the app to initialize it; with my permission and after checking for active work, quit it normally and completely. Then use that verified bundled CLI to run plugin --profile desktop add ${DESKTOP_PACKAGE}, reopen the app and verify enablement. The ordinary npm dsh CLI cannot manage the Desktop Profile. Do not switch to a web Profile, create a replacement, or reset an existing Profile to claim success.
4. Preserve data, settings and credentials. Do not globally disable supply-chain protection or bypass OS signing/security prompts. Tell me the exact user action when administrator authentication, system confirmation or sign-in is needed and wait. Never ask me to paste passwords or API keys into chat.
5. Report completion only after verifying that the desktop app opens, the exact Tobs package is installed and enabled in the correct Profile, and Bot mode is visible. On failure, state the step and retry path. Model configuration, a first real reply and phone pairing are optional follow-ups, outside this installation completion criterion.
6. After the desktop checks, finish by asking: “Would you also like to use Tobs on your phone? If so, is it an iPhone or Android?” If I decline, stop after desktop setup; do not install phone apps or enable a remote connection for me.
7. If I opt in, give platform-specific steps: on iPhone, open ${TESTFLIGHT_URL} and follow the invitation to install TestFlight and the Tobs beta. On Android, contact the developer through Discord (${COMMUNITY_LINKS.discord}) or QQ group ${QQ_GROUP}, give the developer my Google Play email directly, wait to be added to the internal test, then install from the invitation received. Do not claim to have sent an invitation or collect email addresses, sign-in codes or pairing credentials in the AI chat.
8. After the phone app is installed, read the current pairing guide at https://tobs.app/en/docs/mobile-pairing/ and check the actual UI before asking which connection method I prefer. For same-account Connect, open Bot settings → Devices → Connect on the computer and sign in; sign in to the same Tobs account on the phone, choose the correct computer and confirm pairing. Alternatively, connect both devices to the same Tailscale tailnet, follow the computer's actual Devices instructions to prepare its HTTPS address, then show a pairing QR code on the computer for me to scan or paste the one-time link directly on the phone. Before enabling a connection, changing network publishing or granting phone access to a computer, explain the target and effect and wait for my explicit permission. I complete phone sign-in and camera/VPN system permissions on the device; pairing codes and links stay out of chat. Preserve existing pairings and Tailscale Serve mappings; do not overwrite or remove other computers.
9. Remind me to keep the computer awake with DSH and Tobs running. Report phone pairing complete only after checking that the phone shows the correct computer as connected and its existing Bots/chats are visible. If models or Bots are not configured, state the remaining steps; installing or scanning alone does not prove chat works. For multiple computers, confirm authorization and pair each one separately, then switch using All or the environment picker.`;
}
