import {
  ArrowRight,
  Hash,
  Link2,
  LockKeyhole,
  MessageSquare,
  Plus,
  Send,
  Terminal,
} from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { LINKS, QQ_GROUP, type Copy, type Lang } from '../content';
import { HOMEPAGE_COPY } from '../homepageCopy';
import { HERO_CONVERSATIONS, PHONE_HOSTS, type PhoneHostId } from '../heroPhoneData';
import { recipeFor } from '../mascot';
import { PREVIEW_COPY } from '../previewCopy';
import { blogPath, changelogPath, docsPath, guidePath, marketPath, pluginsPath } from '../site';
import { FeatureDemo } from './FeatureDemos';
import { HeroPhoneSource } from './HeroPhoneHome';
import { PreviewSessionDetail, previewModel } from './HeroPreviewPanels';
import { PixelAvatar } from './PixelAvatar';
import { PreviewModelIcon } from './PreviewModelIcon';
import { SponsorFooter } from './Sponsors';

type HomeCopy = (typeof HOMEPAGE_COPY)[Lang];
const ENGINES = [
  { id: 'deepseek', name: 'DeepSeek Harness', hint: 'apiHint' },
  { id: 'codex', name: 'Codex', hint: 'codexHint' },
  { id: 'claude', name: 'Claude Code', hint: 'claudeHint' },
] as const;

function EngineDemo({ lang }: { lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  const preview = PREVIEW_COPY[lang];
  const [index, setIndex] = useState(0);
  const engine = ENGINES[index]!;
  const model = previewModel(engine.id);
  return (
    <div className="workflow-demo workflow-engine">
      <div className="workflow-options" role="group" aria-label={t.enginePicker}>
        {ENGINES.map((option, i) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <PreviewModelIcon brand={previewModel(option.id).brand} subscription={i !== 0} />
            {option.name}
          </button>
        ))}
      </div>
      <div className="workflow-model" aria-live="polite">
        <Terminal size={19} aria-hidden="true" />
        <div>
          <strong>{model.name}</strong>
          <span>{t[engine.hint]}</span>
        </div>
        <small>{index === 0 ? preview.api : preview.subscription}</small>
      </div>
    </div>
  );
}

function DemoAvatar({ name }: { name: string }) {
  return <PixelAvatar recipe={recipeFor(name)} size={25} />;
}

function ChatLine({ author, text }: { author: string; text: string }) {
  return (
    <li className="workflow-chat-line">
      <DemoAvatar name={author} />
      <div>
        <strong>{author}</strong>
        <p>{text}</p>
      </div>
    </li>
  );
}

function WorkflowComposer({ t, onSend }: { t: HomeCopy; onSend: (text: string) => void }) {
  const [input, setInput] = useState('');
  return (
    <form
      className="workflow-compose"
      onSubmit={(event) => {
        event.preventDefault();
        const message = input.trim();
        if (!message) return;
        onSend(message);
        setInput('');
      }}
    >
      <input
        aria-label={t.chatPlaceholder}
        value={input}
        maxLength={140}
        placeholder={t.sampleMessage}
        onChange={(event) => setInput(event.target.value)}
      />
      <button className="workflow-action" type="submit" disabled={!input.trim()}>
        <Send size={14} aria-hidden="true" />
        {t.send}
      </button>
    </form>
  );
}

function ConversationDemo({ t }: { t: HomeCopy }) {
  const [created, setCreated] = useState(false);
  const [mode, setMode] = useState<'dm' | 'group'>('dm');
  const [messages, setMessages] = useState({ dm: [] as string[], group: [] as string[] });
  const log = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    const node = log.current;
    if (node && messages[mode].length) node.scrollTop = node.scrollHeight;
  }, [mode, messages]);
  return (
    <div className="workflow-demo">
      <div className="workflow-options" role="group" aria-label={t.chat}>
        <button type="button" aria-pressed={mode === 'dm'} onClick={() => setMode('dm')}>
          <MessageSquare size={15} aria-hidden="true" />
          {t.dm}
        </button>
        <button type="button" aria-pressed={mode === 'group'} onClick={() => setMode('group')}>
          <Hash size={15} aria-hidden="true" />
          {t.group}
        </button>
      </div>
      {mode === 'dm' && !created ? (
        <div className="workflow-create">
          <DemoAvatar name="Mira" />
          <span>{t.newBot}</span>
          <button className="workflow-action" type="button" onClick={() => setCreated(true)}>
            <Plus size={15} aria-hidden="true" />
            {t.create}
          </button>
        </div>
      ) : (
        <>
          <ul
            ref={log}
            className="workflow-chat"
            role="log"
            aria-label={mode === 'dm' ? 'Mira' : t.sampleRoom}
          >
            {mode === 'dm' ? (
              <ChatLine author="Mira" text={t.greeting} />
            ) : (
              <>
                <ChatLine author="Mira" text={t.handoff} />
                <ChatLine author="Nova" text={t.groupResult} />
              </>
            )}
            {messages[mode].map((message, i) => (
              <li key={i}>
                <ul className="workflow-message-pair">
                  <ChatLine author="Mei" text={message} />
                  <ChatLine
                    author={mode === 'dm' ? 'Mira' : 'Nova'}
                    text={mode === 'dm' ? t.dmResult : t.groupResult}
                  />
                </ul>
              </li>
            ))}
          </ul>
          <WorkflowComposer
            key={mode}
            t={t}
            onSend={(message) =>
              setMessages((previous) => ({
                ...previous,
                [mode]: [...previous[mode].slice(-3), message],
              }))
            }
          />
        </>
      )}
    </div>
  );
}

export function HowTobsWorks({ copy, lang }: { copy: Copy; lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  return (
    <section
      className="section workflow-section"
      id="how-it-works"
      aria-labelledby="workflow-title"
    >
      <h2 id="workflow-title">{t.how}</h2>
      <p className="section-lead">{t.howLead}</p>
      <div className="workflow-bento">
        <article className="workflow-card workflow-card--engine">
          <h3>{t.engine}</h3>
          <p className="workflow-bento-description">
            {t.engineBody[0]} <br />
            {t.engineBody[1]}
          </p>
          <EngineDemo lang={lang} />
        </article>
        <article className="workflow-card workflow-card--chat">
          <h3>{t.chat}</h3>
          <p className="workflow-bento-description">
            {t.chatBody[0]} <br />
            {t.chatBody[1]}
          </p>
          <ConversationDemo t={t} />
        </article>
        <article className="workflow-card workflow-card--memory">
          <div>
            <h3>{t.memory}</h3>
            <p>{t.memoryBody}</p>
            <a className="workflow-link" href={guidePath(lang, 'channel-sidebar/memory-evolution')}>
              {t.memoryGuide} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <br />
            <a className="workflow-link" href={guidePath(lang, 'bot-zip')}>
              {t.cloneGuide} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <FeatureDemo
            copy={copy}
            demo="memory"
            memoryRestore={{ action: t.restore, done: t.restored }}
          />
        </article>
      </div>
      <details className="workflow-opinion">
        <summary>{t.opinion}</summary>
        <p>{t.opinionLead}</p>
        <ul>
          {t.opinionPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function NetworkDemo({ copy, lang }: { copy: Copy; lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  const [host, setHost] = useState<PhoneHostId | 'all'>('all');
  return (
    <div className="workflow-demo">
      <div className="workflow-options" role="group" aria-label={t.hostFilter}>
        <button type="button" aria-pressed={host === 'all'} onClick={() => setHost('all')}>
          {t.allHosts}
        </button>
        {PHONE_HOSTS.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={host === item.id}
            onClick={() => setHost(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <ul className="workflow-hosts" aria-live="polite">
        {HERO_CONVERSATIONS.filter((row) => host === 'all' || row.host === host).map((row) => (
          <li key={row.host + row.index}>
            <DemoAvatar name={copy.demo.channels[row.index]!.bots[0]!} />
            <strong>{copy.demo.channels[row.index]!.title}</strong>
            <HeroPhoneSource host={row.host} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const TEAM_MEMBERS = [
  { name: 'Mei', role: 'Owner', bots: ['Mira', 'Theo'] },
  { name: 'Lea', role: 'Admin', bots: ['Luna', 'Vera'] },
  { name: 'Jun', role: 'Member', bots: ['Kai', 'Juno'] },
] as const;

function TeamDemo({ t }: { t: HomeCopy }) {
  const [index, setIndex] = useState(0);
  const member = TEAM_MEMBERS[index]!;
  return (
    <div className="workflow-demo">
      <div className="workflow-options" role="group" aria-label={t.memberPicker}>
        {TEAM_MEMBERS.map(({ name, role }, i) => (
          <button key={name} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
            {name} · {role}
          </button>
        ))}
      </div>
      <ul
        className="workflow-team-channels"
        aria-label={t.channelsFor(member.name)}
        aria-live="polite"
      >
        {member.bots.map((bot) => (
          <li key={bot}>
            <DemoAvatar name={bot} />
            <strong>{bot}</strong>
            <small>
              <LockKeyhole size={14} aria-hidden="true" /> {t.privateBot}
            </small>
          </li>
        ))}
        <li>
          <Hash size={25} aria-hidden="true" />
          <div>
            <strong>{t.sampleRoom}</strong>
            <span>Nova · Bot</span>
          </div>
          <small>{t.publicChannel}</small>
        </li>
      </ul>
    </div>
  );
}

const IM_PLATFORMS = [
  { name: 'Slack', guide: 'slack-connection' },
  { name: 'Discord', guide: 'channel-sidebar/external-identities' },
  { name: 'Lark / 飞书', guide: 'lark-connection' },
  { name: 'QQ', guide: 'qq-connection' },
  { name: 'WeChat / 微信', guide: 'wechat-connection' },
] as const;

function ImDemo({ lang }: { lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  const [index, setIndex] = useState(0);
  const platform = IM_PLATFORMS[index]!;
  return (
    <div className="workflow-demo workflow-im">
      <div className="workflow-options" role="group" aria-label={t.imPicker}>
        {IM_PLATFORMS.map(({ name }, i) => (
          <button key={name} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
            {name}
          </button>
        ))}
      </div>
      <div className="workflow-model" aria-live="polite">
        <Link2 size={18} aria-hidden="true" />
        <div>
          <strong>
            {platform.name} · {t.imLinked}
          </strong>
          <span>{platform.guide === 'wechat-connection' ? t.wechat : t.imChannels}</span>
        </div>
      </div>
      <a className="workflow-link" href={guidePath(lang, platform.guide)}>
        {t.bindingGuide} <ArrowRight size={16} aria-hidden="true" />
      </a>
    </div>
  );
}

function SessionDemo({ copy, lang }: { copy: Copy; lang: Lang }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <div className="workflow-demo workflow-session app">
      <PreviewSessionDetail
        t={PREVIEW_COPY[lang]}
        isTeam={false}
        messages={messages}
        composer={{
          draft,
          sendLabel: copy.demo.send,
          onChange: setDraft,
          onSend: () => {
            const message = draft.trim();
            if (!message) return;
            setMessages((previous) => [...previous.slice(-6), message]);
            setDraft('');
          },
        }}
      />
    </div>
  );
}

export function HomepageFeatures({ copy, lang }: { copy: Copy; lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  const preview = PREVIEW_COPY[lang];
  return (
    <section className="section workflow-section" id="features" aria-labelledby="features-title">
      <h2 id="features-title">{t.features}</h2>
      <p className="section-lead">{t.featuresLead}</p>
      <div className="workflow-feature-grid">
        {copy.features.items
          .filter((item) => item.demo === 'identity' || item.demo === 'schedules')
          .map((item) => (
            <article className="workflow-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <FeatureDemo copy={copy} demo={item.demo!} />
            </article>
          ))}
        <article className="workflow-card" id="hosts">
          <h3>{t.network}</h3>
          <p>{t.networkBody}</p>
          <NetworkDemo copy={copy} lang={lang} />
          <a className="workflow-link" href={guidePath(lang, 'private-connect')}>
            {t.networkGuide} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </article>
        <article className="workflow-card" id="sessions">
          <h3>{preview.sessionsTitle}</h3>
          <p>{preview.sessionsBody}</p>
          <SessionDemo copy={copy} lang={lang} />
        </article>
        <article className="workflow-card workflow-card--people" id="team">
          <h3>{t.people}</h3>
          <div className="workflow-people-panels">
            <section aria-labelledby="workflow-team-title">
              <h4 id="workflow-team-title">{t.team}</h4>
              <p>{t.teamBody}</p>
              <TeamDemo t={t} />
            </section>
            <section id="integrations" aria-labelledby="workflow-im-title">
              <h4 id="workflow-im-title">{t.im}</h4>
              <p>{t.imBody}</p>
              <p>{t.roadmap}</p>
              <ImDemo lang={lang} />
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}

export function HomepageFooter({ copy, lang }: { copy: Copy; lang: Lang }) {
  const t = HOMEPAGE_COPY[lang];
  const prefix = lang === 'zh' ? '' : '/en';
  const groups = [
    {
      title: t.product,
      links: [
        [t.how, '#how-it-works'],
        [copy.nav.features, '#features'],
        [copy.nav.install, '#install'],
        [copy.nav.market, marketPath(lang)],
        ['BotPixel', LINKS.botpixel],
      ],
    },
    {
      title: t.resources,
      links: [
        [copy.nav.docs, docsPath(lang)],
        [copy.nav.blog, blogPath(lang)],
        [copy.compare.kicker, '#compare'],
        [copy.nav.changelog, changelogPath(lang)],
        [t.faq, '#faq'],
        [lang === 'zh' ? '插件' : 'Plugins', pluginsPath(lang)],
      ],
    },
    {
      title: t.community,
      links: [
        ['GitHub', LINKS.github],
        ['Discord', LINKS.discord],
        [`QQ · ${QQ_GROUP}`, '#community'],
        ['BotHarness', LINKS.docs],
        ['npm', LINKS.npm],
        [t.sponsorLink, '#sponsors'],
      ],
    },
    {
      title: t.legal,
      links: [
        [copy.footer.privacy, prefix + '/privacy/'],
        [copy.footer.terms, prefix + '/terms/'],
      ],
    },
  ];
  return (
    <footer className="footer workflow-footer">
      <div className="workflow-footer-inner">
        <div className="workflow-footer-brand">
          <a href="#top" aria-label={t.backTop}>
            <img src="/logo.png" alt="" width={42} height={42} />
            Tobs
          </a>
          <p>
            {copy.footer.built} {copy.footer.license}
          </p>
        </div>
        {groups.map(({ title, links }) => (
          <nav key={title} aria-label={title}>
            <h2>{title}</h2>
            <ul>
              {links.map(([label, href]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <SponsorFooter lang={lang} />
    </footer>
  );
}
