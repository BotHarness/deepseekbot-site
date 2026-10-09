import type { Lang } from './content';

export type Mode = 'light' | 'dark';

export const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
export const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // private windows may refuse storage; the choice just won't persist
  }
};

// Like botharness.ai, the language is the path: Chinese at / (and /zh, which redirects
// there), English under /en/. Each entry has its own title, description and share card.
export const pathLang = (): Lang =>
  location.pathname === '/en' || location.pathname.startsWith('/en/') ? 'en' : 'zh';
export const initialMode = (): Mode => {
  const saved = read('dsb-mode');
  if (saved === 'light' || saved === 'dark') return saved;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const homePath = (lang: Lang) => (lang === 'zh' ? '/' : '/en/');
export const marketPath = (lang: Lang) => (lang === 'zh' ? '/market' : '/en/market');
export const avatarPath = (lang: Lang) => (lang === 'zh' ? '/avatar' : '/en/avatar');
export const guidePath = (lang: Lang, slug: string) =>
  `${lang === 'zh' ? '' : '/en'}/docs/${slug}/`;
export const docsPath = (lang: Lang) => guidePath(lang, 'overview');
export const changelogPath = (lang: Lang) => (lang === 'zh' ? '/changelog/' : '/en/changelog/');
export const blogPath = (lang: Lang) => (lang === 'zh' ? '/blog/' : '/en/blog/');
export const blogPostPath = (lang: Lang, slug: string) => `${blogPath(lang)}${slug}/`;
