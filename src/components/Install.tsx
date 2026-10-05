import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useState, type ReactNode } from 'react';
import { DESKTOP_PACKAGE, INSTALL_STEPS, type Copy } from '../content';

export function Command({
  command,
  copy,
  shell = true,
}: {
  command: string;
  copy: Copy;
  shell?: boolean;
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
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      />
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
  return (
    <li>
      <span className="step-no" aria-hidden="true">
        {n}
      </span>
      <div>
        <p className="step-title">{title}</p>
        {children}
      </div>
    </li>
  );
}

type Way = 'desktop' | 'dev';

export function Install({ copy }: { copy: Copy }) {
  const [way, setWay] = useState<Way>('desktop');
  const t = copy.install;
  return (
    <div className="install frame">
      <SegmentedControl
        label={t.tabsLabel}
        value={way}
        onChange={(value) => setWay(value === 'dev' ? 'dev' : 'desktop')}
      >
        <SegmentedControlItem value="desktop" label={t.desktopTab} />
        <SegmentedControlItem value="dev" label={t.devTab} />
      </SegmentedControl>

      {way === 'desktop' ? (
        <>
          <p className="install-lead">{t.desktop.lead}</p>
          <ol className="steps">
            {t.desktop.steps.map((step, i) => (
              <Step key={step} n={i + 1} title={step}>
                {i === 1 ? <Command command={DESKTOP_PACKAGE} copy={copy} shell={false} /> : null}
              </Step>
            ))}
          </ol>
          <p className="install-links">
            <a href={t.desktop.downloadUrl} target="_blank" rel="noreferrer">
              {t.desktop.download}
            </a>
            <a href={t.desktop.docsUrl} target="_blank" rel="noreferrer">
              {t.desktop.docs}
            </a>
          </p>
        </>
      ) : (
        <>
          <p className="install-lead">{t.lead}</p>
          <ol className="steps">
            {INSTALL_STEPS.map((command, i) => (
              <Step key={command} n={i + 1} title={t.steps[i] ?? ''}>
                <Command command={command} copy={copy} />
              </Step>
            ))}
          </ol>
          <p>{t.after}</p>
        </>
      )}
      <p className="note">{t.note}</p>
    </div>
  );
}
