import type { Lang } from './content';
import type { FeatureDemoCopy, PanelItem } from './demoCopy';
import type { PhoneHostId } from './heroPhoneData';

export type DemoMemoryEntry =
  | { kind: 'file'; id: string; path: string; text: string }
  | {
      kind: 'commit';
      id: string;
      title: string;
      sha: string;
      path: string;
      hunk: string;
      lines: string[];
    };

const MEMORY_TEXT = {
  zh: {
    soulTitle: '# Mira 的角色',
    soulStudio: '我是工作室的研究 Bot。汇总竞品动态，先写结论，再列出来源。',
    soulResearch: '我是研究电脑上的 Mira。总结资料时区分已核实事实和待查问题。',
    memoryTitle: '# 常驻记忆',
    researchRoutine: '- 简报附上资料来源和后续问题。',
    pricingTitle: '# 定价研究笔记',
    researchBefore: '- 汇总各套餐的公开报价。',
    researchAfter: '- 为每条公开报价附上来源和查阅日期。',
  },
  en: {
    soulTitle: '# Mira’s role',
    soulStudio:
      'I am the studio’s research Bot. Summarize competitor updates, lead with the findings, and list the sources.',
    soulResearch:
      'I am Mira on the research computer. Separate verified facts from open questions in each brief.',
    memoryTitle: '# Standing memory',
    researchRoutine: '- Include sources and follow-up questions in every brief.',
    pricingTitle: '# Pricing research notes',
    researchBefore: '- Summarize published plan prices.',
    researchAfter: '- Record the source and date checked for each published price.',
  },
} satisfies Record<Lang, Record<string, string>>;

const fileAfter = (lines: string[], includeAdds = true) =>
  lines
    .filter((line) => line.startsWith(' ') || (includeAdds && line.startsWith('+')))
    .map((line) => line.slice(1));

/** Projects the same fictional working tree and commits that the Hero script shows in its subpanels. */
export function demoMemoryEntry(
  lang: Lang,
  host: PhoneHostId,
  section: string,
  item: PanelItem,
  hasPreference: boolean,
  commits: FeatureDemoCopy['memory']['commits'],
): DemoMemoryEntry | undefined {
  if (section !== 'files' && section !== 'commits') return undefined;
  const text = MEMORY_TEXT[lang];
  const studio = host === 'studio';
  if (section === 'files') {
    const core = commits.find(({ sha }) => sha === '7d03b51')!.diff;
    const pricing = commits.find(({ sha }) => sha === 'a41c9e2')!.diff;
    const files: Record<string, string[]> = {
      soul: [text.soulTitle, '', studio ? text.soulStudio : text.soulResearch],
      memory: studio
        ? fileAfter(core, hasPreference)
        : [text.memoryTitle, '', text.researchRoutine],
      notes: studio ? fileAfter(pricing) : [text.pricingTitle, '', text.researchAfter],
    };
    const lines = files[item.id];
    return lines && { kind: 'file', id: item.id, path: item.title, text: lines.join('\n') };
  }
  if (!item.sha) return undefined;
  const commit = commits.find(({ sha }) => sha === item.sha);
  const lines = commit?.diff ?? [
    ' ' + text.pricingTitle,
    ' ',
    '-' + text.researchBefore,
    '+' + text.researchAfter,
  ];
  const oldLength = lines.filter((line) => !line.startsWith('+')).length;
  const newLength = lines.filter((line) => !line.startsWith('-')).length;
  return {
    kind: 'commit',
    id: item.id,
    title: item.title,
    sha: item.sha,
    path: commit?.file ?? 'research/pricing.md',
    hunk: `@@ -${oldLength ? 1 : 0},${oldLength} +${newLength ? 1 : 0},${newLength} @@`,
    lines,
  };
}
