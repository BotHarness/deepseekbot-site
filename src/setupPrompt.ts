import type { Lang } from './content';
import { DESKTOP_PACKAGE, DSH_VERSION } from './installRelease.ts';

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
5. 实际确认桌面能打开、正确 Profile 中的 Tobs 精确版本已安装启用、Bot 模式可见，才报告安装完成。失败时明确说明停在哪一步及如何重试。模型配置、首次真实回复和手机配对是后续可选步骤，本轮不以它们作为安装完成条件。`;
  return `Help me install and enable Tobs in the official DeepSeek Harness (DSH) desktop app, then open Bot mode. Communicate in English.

Package: ${DESKTOP_PACKAGE}. The site's qualified recommended DSH version is ${DSH_VERSION}.
Official desktop download: https://www.deepseek.com/harness/
Tobs installation guide: https://tobs.app/en/docs/installation/

1. Check whether you can operate this computer. If not, give clear manual steps and do not claim to have executed them. Read-only, inspect the OS, CPU architecture, actual DSH desktop app location, version, running state and any custom DSH_HOME. Report what you found; a dsh command on PATH alone does not prove the desktop app is installed.
2. Reuse an existing compatible desktop app. If absent, ask whether I want to install it, select the latest matching official desktop installer from the current official page, and verify its actual version, source and compatibility. For an unsupported platform or an unqualified newer version, explain the limitation and stop to agree on a path. Do not substitute a community app, automatically downgrade, or overwrite an existing installation.
3. Target the desktop app's actual desktop Profile. Prefer its plugin manager to install and enable the exact package above. If CLI work is needed, locate the app's bundled runtime/cli/bin/dsh (dsh.cmd on Windows). First launch the app to initialize it; with my permission and after checking for active work, quit it normally and completely. Then use that verified bundled CLI to run plugin --profile desktop add ${DESKTOP_PACKAGE}, reopen the app and verify enablement. The ordinary npm dsh CLI cannot manage the Desktop Profile. Do not switch to a web Profile, create a replacement, or reset an existing Profile to claim success.
4. Preserve data, settings and credentials. Do not globally disable supply-chain protection or bypass OS signing/security prompts. Tell me the exact user action when administrator authentication, system confirmation or sign-in is needed and wait. Never ask me to paste passwords or API keys into chat.
5. Report completion only after verifying that the desktop app opens, the exact Tobs package is installed and enabled in the correct Profile, and Bot mode is visible. On failure, state the step and retry path. Model configuration, a first real reply and phone pairing are optional follow-ups, outside this installation completion criterion.`;
}
