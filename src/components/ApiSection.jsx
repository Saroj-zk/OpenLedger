import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Section, Reveal } from './ui/Ledger';

const SAMPLES = [
  {
    id: 'python',
    label: 'Python',
    code: `from openledger import OpenLedger

client = OpenLedger()

reply = client.chat(
    model="auto",        # or name one from the list
    memory="workspace",  # carry your saved context in
    messages=[{"role": "user", "content": "Summarise this contract"}],
)

print(reply.text, reply.routed_to)`,
  },
  {
    id: 'curl',
    label: 'cURL',
    code: `curl https://api.openledger.xyz/v1/chat/completions \\
  -H "Authorization: Bearer $OPENLEDGER_KEY" \\
  -d '{
    "model": "auto",
    "private": true,
    "messages": [
      { "role": "user", "content": "Summarise this contract" }
    ]
  }'`,
  },
  {
    id: 'openai',
    label: 'OpenAI SDK',
    code: `from openai import OpenAI

# Change two lines. Keep the rest of your code.
client = OpenAI(
    base_url="https://api.openledger.xyz/v1",
    api_key=os.environ["OPENLEDGER_KEY"],
)

client.chat.completions.create(
    model="claude-opus-4",
    messages=[{"role": "user", "content": "Summarise this contract"}],
)`,
  },
];

const ENDPOINTS = [
  { verb: 'POST', path: '/v1/chat/completions', note: 'OpenAI compatible' },
  { verb: 'POST', path: '/v1/council', note: 'Four models, one answer' },
  { verb: 'GET', path: '/v1/models', note: 'The live model list' },
  { verb: 'POST', path: '/v1/memory', note: 'Read and write context' },
];

/* --------------------------------------------------------- highlighting */

function findCommentIndex(line) {
  let inString = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') inString = !inString;
    if (!inString && (c === '#' || (c === '/' && line[i + 1] === '/'))) return i;
  }
  return -1;
}

function CodeLine({ line }) {
  const cut = findCommentIndex(line);
  const code = cut === -1 ? line : line.slice(0, cut);
  const comment = cut === -1 ? null : line.slice(cut);
  const parts = code.split(/("(?:[^"\\]|\\.)*")/g);

  if (line === '') return <span className="block whitespace-pre">&nbsp;</span>;

  return (
    <span className="block whitespace-pre">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-accent">
            {part}
          </span>
        ) : (
          <span key={i} className="text-[#d8d1c9]">
            {part}
          </span>
        ),
      )}
      {comment && <span className="text-[color:var(--color-faint)]">{comment}</span>}
    </span>
  );
}

/* ----------------------------------------------------------------------- */

export default function ApiSection() {
  const [tab, setTab] = useState('python');
  const [copied, setCopied] = useState(false);
  const sample = SAMPLES.find((s) => s.id === tab);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section id="api" index="07" label="API" dark full>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal>
          <div className="ui-label mb-5 flex items-center gap-2 text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
            API
          </div>
          {/* The lead line: what the section is worth, before the headline
              says what it is. Set in the accent the way a card's line is,
              so it reads as part of the eyebrow zone rather than as a
              second deck competing with the one below the headline. */}
          <p className="mb-5 max-w-[46ch] text-pretty text-[15.5px] font-medium leading-[1.5] text-accent">
            Access every model with one subscription, built for seamless use across humans and x402-ready agents.
          </p>

          <h2 className="display text-[clamp(2rem,4.4vw,3.2rem)] text-balance text-foreground">
            One endpoint. Every model behind it.
          </h2>
          <p className="mt-4 max-w-[44ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
            Build once. Name a model per request, or send auto and let the router choose.
          </p>

          <ul className="mt-7 border-t border-[color:var(--color-border)]">
            {ENDPOINTS.map((e, i) => (
              <Reveal
                as="li"
                row
                delay={i * 60}
                key={e.path}
                className="flex items-center gap-3 border-b border-[color:var(--color-border)] py-2"
              >
                <span className="ui-label w-10 shrink-0 text-accent">{e.verb}</span>
                <code className="flex-1 truncate font-mono text-[12.5px] text-foreground">{e.path}</code>
                <span className="hidden text-[12px] text-[color:var(--color-faint)] sm:inline">{e.note}</span>
              </Reveal>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#" className="btn btn-accent">
              Get an API key
            </a>
            <a href="#" className="btn btn-ghost">
              Read the docs
            </a>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="panel reg-marks overflow-hidden">
            <div className="flex items-center gap-1 border-b border-[color:var(--color-border)] px-2.5 py-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  aria-pressed={tab === s.id}
                  className={`ui-label rounded-full px-3 py-1.5 transition-colors ${
                    tab === s.id
                      ? 'bg-[color:var(--color-tertiary)] text-foreground'
                      : 'text-[color:var(--color-faint)] hover:text-[color:var(--color-graphite)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={copy}
                className="ui-label ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[color:var(--color-faint)] transition-colors hover:text-foreground"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="no-scrollbar min-h-[272px] overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.75] sm:px-6">
              <code>
                {sample.code.split('\n').map((line, i) => (
                  <CodeLine key={i} line={line} />
                ))}
              </code>
            </pre>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
