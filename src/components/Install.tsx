import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useState, type ReactNode } from 'react';
import { track } from '../analytics';
import { DESKTOP_PACKAGE, INSTALL_STEPS, type Copy, type Lang } from '../content';
import { HOMEPAGE_COPY } from '../homepageCopy';
import { docsPath, guidePath } from '../site';

export function Command({
  command,
  copy,
  shell = true,
  onCopy,
}: {
  command: string;
  copy: Copy;
  shell?: boolean;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="command">
      <code>
        {shell ? (
          <span className="prompt" aria-hidden="true">
            ${' '}
          </span>
        ) : null}
        {command}
      </code>
      <Button
        size="sm"
        label={copied ? copy.install.copied : copy.install.copy}
        clickAction={async () => {
          await navigator.clipboard.writeText(command);
          onCopy?.();
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      />
    </div>
  );
}

function InstallCard({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="workflow-card">
      <span className="workflow-step-no" aria-hidden="true">
        {n}
      </span>
      <h3>{title}</h3>
      {children}
    </li>
  );
}

type Way = 'desktop' | 'dev';

export function Install({ copy, lang }: { copy: Copy; lang: Lang }) {
  const [way, setWay] = useState<Way>('desktop');
  const t = copy.install;
  const home = HOMEPAGE_COPY[lang];
  const firstChat = home.installSteps[3];
  return (
    <div className="install workflow-install">
      <SegmentedControl
        className="workflow-install-switch"
        label={t.tabsLabel}
        value={way}
        onChange={(value) => {
          const next = value === 'dev' ? 'dev' : 'desktop';
          if (next !== way) track('install:tab_select', { tab: next });
          setWay(next);
        }}
      >
        <SegmentedControlItem value="desktop" label={t.desktopTab} />
        <SegmentedControlItem value="dev" label={t.devTab} />
      </SegmentedControl>

      {way === 'desktop' ? (
        <ol className="workflow-install-cards" data-placement="install_desktop">
          {home.installSteps.map((step, i) => (
            <InstallCard key={step.title} n={i + 1} title={step.title}>
              <p>{step.body}</p>
              {i === 0 ? (
                <a className="workflow-link" href={t.desktop.downloadUrl}>
                  {home.download} →
                </a>
              ) : null}
              {i === 1 ? (
                <Command
                  command={DESKTOP_PACKAGE}
                  copy={copy}
                  shell={false}
                  onCopy={() => track('install:command_copy', { tab: 'desktop', step: i + 1 })}
                />
              ) : null}
              {i === 2 ? (
                <a className="workflow-link" href={guidePath(lang, 'settings')}>
                  {home.setupModels} →
                </a>
              ) : null}
              {i === 3 ? (
                <a className="workflow-link" href={docsPath(lang)}>
                  {home.getStarted} →
                </a>
              ) : null}
            </InstallCard>
          ))}
        </ol>
      ) : (
        <ol className="workflow-install-cards" data-placement="install_dev">
          {INSTALL_STEPS.map((command, i) => (
            <InstallCard key={command} n={i + 1} title={t.steps[i] ?? ''}>
              {i === 0 ? <p>{t.lead}</p> : null}
              <Command
                command={command}
                copy={copy}
                onCopy={() => track('install:command_copy', { tab: 'dev', step: i + 1 })}
              />
            </InstallCard>
          ))}
          <InstallCard n={INSTALL_STEPS.length + 1} title={firstChat.title}>
            <p>{firstChat.body}</p>
            <div className="workflow-install-links">
              <a className="workflow-link" href={guidePath(lang, 'capabilities')}>
                {t.next.button} →
              </a>
              <a className="workflow-link" href={docsPath(lang)}>
                {t.next.overview} →
              </a>
            </div>
          </InstallCard>
        </ol>
      )}
    </div>
  );
}
