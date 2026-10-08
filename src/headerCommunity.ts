import { communityIconSvg, type CommunityBrand } from './communityIcons.ts';
import { COMMUNITY_LINKS, QQ_GROUP } from './communityLinks.ts';

export const HEADER_COMMUNITY_COPY = {
  zh: {
    nav: '社区入口',
    github: '打开 GitHub',
    discord: '加入 Discord',
    qq: '复制 QQ 群号',
    githubDetail: '查看源码、提 Issue 或参与贡献。将在新标签页打开。',
    discordDetail: '加入 DeepSeekBot Discord 社区。将在新标签页打开。',
    qqDetail: '点击复制 QQ 群号，也可以选中下方号码手动复制。',
    copied: '已复制 QQ 群号',
    failed: '复制失败，请选中或长按下方群号手动复制。',
    dismiss: 'Esc 关闭',
  },
  en: {
    nav: 'Community links',
    github: 'Open GitHub',
    discord: 'Join Discord',
    qq: 'Copy QQ group number',
    githubDetail: 'Explore the source, open an issue, or contribute. Opens in a new tab.',
    discordDetail: 'Join the DeepSeekBot Discord community. Opens in a new tab.',
    qqDetail: 'Click to copy the QQ group number, or select the number below to copy it manually.',
    copied: 'QQ group number copied',
    failed: 'Copy failed. Select or long-press the number below to copy it manually.',
    dismiss: 'Esc to close',
  },
} as const;

/** Trusted local strings and geometry: identical markup for React and generated pages. */
export function headerCommunityMarkup(lang: 'zh' | 'en'): string {
  const t = HEADER_COMMUNITY_COPY[lang];
  const item = (brand: CommunityBrand) => {
    const tip = `header-community-${brand}`;
    const attributes = `class="header-community-control" aria-label="${t[brand]}" aria-describedby="${tip}"`;
    const control =
      brand === 'qq'
        ? `<button type="button" ${attributes} data-header-qq>${communityIconSvg(brand)}</button>`
        : `<a ${attributes} href="${COMMUNITY_LINKS[brand]}" target="_blank" rel="noreferrer">${communityIconSvg(brand)}</a>`;
    return `<div class="header-community-item" data-community-item>
      ${control}
      <div class="header-community-tip" id="${tip}" role="tooltip" hidden>
        <p>${t[`${brand}Detail`]}</p>
        ${brand === 'qq' ? `<p data-qq-result role="status"></p><p class="header-qq-number">${QQ_GROUP}</p>` : ''}
        <small>${t.dismiss}</small>
      </div>
    </div>`;
  };
  return `<nav class="header-community" aria-label="${t.nav}" data-header-community data-lang="${lang}" data-placement="header">${(['github', 'discord', 'qq'] as const).map(item).join('')}</nav>`;
}
