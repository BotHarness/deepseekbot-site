import { useEffect, useMemo, useRef } from 'react';
import { track } from '../analytics';
import { headerCommunityMarkup } from '../headerCommunity';
import { initHeaderCommunity } from '../headerCommunityEvents';
import type { Lang } from '../content';

export function HeaderCommunity({ lang }: { lang: Lang }) {
  const root = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => headerCommunityMarkup(lang), [lang]);
  useEffect(() => {
    if (root.current)
      return initHeaderCommunity(root.current, () => {
        track('qq_group_copied', { placement: 'header' });
      });
  }, [lang]);
  return (
    <div
      ref={root}
      className="header-community-wrap"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
