import { Button } from '@astryxdesign/core/Button';
import { useState } from 'react';
import { INSTALL_STEPS, type Copy } from '../content';

function Command({ command, copy }: { command: string; copy: Copy }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="command">
      <code>
        <span className="prompt" aria-hidden="true">
          ${' '}
        </span>
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

export function Install({ copy }: { copy: Copy }) {
  return (
    <div className="install frame">
      <ol className="steps">
        {INSTALL_STEPS.map((command, i) => (
          <li key={command}>
            <span className="step-no" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <p className="step-title">{copy.install.steps[i]}</p>
              <Command command={command} copy={copy} />
            </div>
          </li>
        ))}
      </ol>
      <p>{copy.install.after}</p>
      <p className="note">{copy.install.note}</p>
    </div>
  );
}
