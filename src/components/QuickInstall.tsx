import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useState } from 'react';
import { track } from '../analytics';
import { DESKTOP_PACKAGE, INSTALL_STEPS, type Copy } from '../content';
import { Command } from './Install';

type Way = 'desktop' | 'dev';

/**
 * One line to copy in the Hero for people who already run DSH (the npm package or the CLI step),
 * after a link to DeepSeek's DSH page for those who don't.
 */
export function QuickInstall({ copy }: { copy: Copy }) {
  const [way, setWay] = useState<Way>('desktop');
  const t = copy.hero.quick;
  return (
    <div className="quick-install" data-placement="hero_quick_install">
      <p className="quick-install-get">
        {t.noDsh}{' '}
        <a href={copy.install.desktop.downloadUrl} target="_blank" rel="noreferrer">
          {t.getDsh} ↗
        </a>
      </p>
      <SegmentedControl
        label={t.label}
        size="sm"
        value={way}
        onChange={(value) => {
          const next = value === 'dev' ? 'dev' : 'desktop';
          if (next !== way) track('install_tab_switched', { tab: next, placement: 'hero' });
          setWay(next);
        }}
      >
        <SegmentedControlItem value="desktop" label={copy.install.desktopTab} />
        <SegmentedControlItem value="dev" label={t.cliTab} />
      </SegmentedControl>
      <Command
        command={way === 'desktop' ? DESKTOP_PACKAGE : INSTALL_STEPS[1]}
        copy={copy}
        shell={way === 'dev'}
        onCopy={() => track('install_command_copied', { tab: way, placement: 'hero' })}
      />
      <p className="quick-install-hint">{way === 'desktop' ? t.desktopHint : t.cliHint}</p>
    </div>
  );
}
