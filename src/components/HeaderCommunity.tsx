import { useEffect, useMemo, useRef } from 'react';
import { track } from '../analytics';
import { headerCommunityMarkup } from '../headerCommunity';
import { initHeaderCommunity } from '../headerCommunityEvents';
import type { Lang } from '../content';

export function HeaderCommunity({
  lang,
  placement = 'header',
}: {
  lang: Lang;
  placement?: 'header' | 'hero';
}) {
  const root = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => headerCommunityMarkup(lang, placement), [lang, placement]);
  useEffect(() => {
    if (root.current)
      return initHeaderCommunity(root.current, () => {
        track('qq_group_copied', { placement });
      });
  }, [lang, placement]);
  return (
    <div
      ref={root}
      className="header-community-wrap"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
