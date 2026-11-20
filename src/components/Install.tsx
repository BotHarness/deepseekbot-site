import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useState, type ReactNode } from 'react';
import { track } from '../analytics';
import { DESKTOP_PACKAGE, DSH_VERSION, INSTALL_STEPS, type Copy, type Lang } from '../content';
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

/** The step after the last one: once it is installed, go read how to use it. */
function NextStep({ copy, lang, way }: { copy: Copy; lang: Lang; way: Way }) {
  return (
    <li className="step-next" data-placement={`install_${way}`}>
      <span className="step-no" aria-hidden="true">
        →
      </span>
      <div>
        <p className="step-title">{copy.install.next.title}</p>
        <Button
          label={`${copy.install.next.button} →`}
          variant="primary"
          href={guidePath(lang, 'capabilities')}
        />
        <p>
          <a href={docsPath(lang)}>{copy.install.next.overview} →</a>
        </p>
      </div>
    </li>
  );
}

export function Install({ copy, lang }: { copy: Copy; lang: Lang }) {
  const [way, setWay] = useState<Way>('desktop');
  const t = copy.install;
  return (
    <div className="install workflow-install">
      <SegmentedControl
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
        <>
          <ol className="workflow-install-cards" data-placement="install_desktop">
            {HOMEPAGE_COPY[lang].installSteps.map((step, i) => (
              <li key={step.title} className="workflow-card">
                <span className="workflow-step-no" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {i === 0 ? (
                  <div>
                    <small>
                      {HOMEPAGE_COPY[lang].recommendedDsh} {DSH_VERSION}
                    </small>
                    <br />
                    <a className="workflow-link" href={t.desktop.downloadUrl}>
                      {HOMEPAGE_COPY[lang].download} →
                    </a>
                  </div>
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
                    {HOMEPAGE_COPY[lang].setupModels} →
                  </a>
                ) : null}
                {i === 3 ? (
                  <a className="workflow-link" href={docsPath(lang)}>
                    {HOMEPAGE_COPY[lang].getStarted} →
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="install-links">
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
                <Command
                  command={command}
                  copy={copy}
                  onCopy={() => track('install:command_copy', { tab: 'dev', step: i + 1 })}
                />
              </Step>
            ))}
          </ol>
          <p>{t.after}</p>
          <ol className="steps">
            <NextStep copy={copy} lang={lang} way="dev" />
          </ol>
        </>
      )}
      <p className="note">{t.note}</p>
    </div>
  );
}
