import React, { useEffect, useState } from 'react';
import { Section, SectionHead, Reveal, ArrowLink, useInView } from './ui/Ledger';
import { BrandTile, BRAND } from './ui/Glyphs';

/* =====================================================================
   The four pillars.
   Each card carries a running scene rather than a screenshot. The scenes
   step outside the page palette on purpose: they are illustrations of
   the product, so provider colours, depth and gloss belong here even
   though the ledger tables stay monochrome. They run only while on
   screen, and hold a finished frame under reduced motion.
   ===================================================================== */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Steps 0,1,2… through `count` every `ms`, but only while `active`. */
function useCycle(count, ms, active) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    const tick = setInterval(() => setIndex((i) => (i + 1) % count), ms);
    return () => clearInterval(tick);
  }, [count, ms, active]);

  return index;
}

/** A scene stage: knows when it is being looked at, and holds depth. */
function Scene({ children, tint = 'rgba(120,140,180,0.10)' }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <div
      ref={ref}
      className="scene relative h-[232px] overflow-hidden rounded-[14px] border border-[color:var(--color-border)]"
      style={{
        background: `radial-gradient(120% 90% at 50% 8%, ${tint} 0%, transparent 62%), var(--color-tertiary)`,
      }}
    >
      {children(inView)}
    </div>
  );
}

/* ================================================ 01 private scene */
/* A shield holding, while request cards rise into it and vanish. */

function PrivateScene() {
  return <Scene tint="rgba(45,212,191,0.16)">{(inView) => <PrivateSceneInner inView={inView} />}</Scene>;
}

function PrivateSceneInner({ inView }) {
  const running = inView && !prefersReducedMotion();
  const pulse = useCycle(3, 1600, inView);

  return (
    <div className="relative flex h-full items-center justify-center">
      {/* state pill, the way an app would show it */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] py-1.5 pl-3 pr-1.5 shadow-[0_6px_16px_-8px_rgba(0,0,0,.35)]">
        <span className="text-[11px] font-semibold text-foreground">Zero retention</span>
        <span className="flex h-[18px] w-[30px] items-center rounded-full bg-[#16a34a] px-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,.25)]">
          <span className="ml-auto h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.3)]" />
        </span>
      </div>

      {/* prompts rising into the shield and dissolving */}
      {running &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-8 h-8 w-[132px] rounded-[7px] border border-white/50 bg-white/80 shadow-[0_8px_20px_-10px_rgba(0,0,0,.4)] backdrop-blur-sm"
            style={{ animation: `card-rise 4.8s ease-out ${i * 1.6}s infinite` }}
            aria-hidden="true"
          >
            <span className="absolute left-2.5 top-2.5 h-[4px] w-[58px] rounded-full bg-slate-300" />
            <span className="absolute left-2.5 top-[18px] h-[4px] w-[86px] rounded-full bg-slate-200" />
          </span>
        ))}

      {/* the shield */}
      <div
        className="relative z-10"
        style={{ animation: running ? 'float-y 6s ease-in-out infinite' : 'none' }}
      >
        <svg width="128" height="146" viewBox="0 0 128 146" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="ol-shield" x1="18" y1="6" x2="112" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7DE2D1" />
              <stop offset="0.45" stopColor="#3AAFA9" />
              <stop offset="1" stopColor="#17544F" />
            </linearGradient>
            <linearGradient id="ol-shield-gloss" x1="30" y1="10" x2="70" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="ol-shield-shadow" x="-40%" y="-20%" width="180%" height="160%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#0f766e" floodOpacity="0.35" />
            </filter>
          </defs>

          <path
            d="M64 4 118 24v46c0 34-22 58-54 72C32 128 10 104 10 70V24z"
            fill="url(#ol-shield)"
            filter="url(#ol-shield-shadow)"
          />
          <path d="M64 4 118 24v46c0 34-22 58-54 72z" fill="#000" fillOpacity="0.12" />
          <path d="M64 12 110 29v40c0 29-19 50-46 62V12z" fill="#fff" fillOpacity="0.06" />
          <path d="M64 6 112 24c-14 26-42 44-76 48V24z" fill="url(#ol-shield-gloss)" />

          {/* padlock */}
          <rect x="50" y="66" width="28" height="24" rx="5" fill="#fff" fillOpacity="0.95" />
          <path d="M56 66v-6a8 8 0 0 1 16 0v6" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="64" cy="76" r="3.4" fill="#17544F" />
          <rect x="62.6" y="77" width="2.8" height="6" rx="1.4" fill="#17544F" />
        </svg>
      </div>

      <div className="absolute inset-x-4 bottom-3.5 z-20 flex items-center justify-between">
        <span className="ui-label text-[color:var(--color-graphite)]">
          {['Prompt dropped', 'Nothing logged', 'Nothing trained on'][pulse]}
        </span>
        <span className="ui-label tabular text-[color:var(--color-faint)]">0 bytes kept</span>
      </div>
    </div>
  );
}

/* ============================================ 02 multi model scene */
/* Providers orbit the layer. The one at the centre is answering. */

const ORBIT = [
  { code: 'OA', name: 'GPT-4o' },
  { code: 'AN', name: 'Claude Opus 4' },
  { code: 'GG', name: 'Gemini 2.5 Pro' },
  { code: 'XA', name: 'Grok 4' },
  { code: 'DS', name: 'DeepSeek R1' },
  { code: 'MT', name: 'Llama 3.3' },
];

function MultiModelScene() {
  return <Scene tint="rgba(226,130,63,0.14)">{(inView) => <MultiModelSceneInner inView={inView} />}</Scene>;
}

function MultiModelSceneInner({ inView }) {
  const active = useCycle(ORBIT.length, 2200, inView);
  const spinning = inView && !prefersReducedMotion();

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative h-[178px] w-[178px]">
        <span
          className="absolute inset-2 rounded-full border border-dashed border-[color:var(--rule-strong)]"
          style={{ animation: spinning ? 'ring-glow 4s ease-in-out infinite' : 'none' }}
          aria-hidden="true"
        />

        <div className="absolute inset-0" style={{ animation: spinning ? 'orbit-spin 28s linear infinite' : 'none' }}>
          {ORBIT.map((p, i) => {
            const angle = (360 / ORBIT.length) * i;
            return (
              <span
                key={p.code}
                className="absolute left-1/2 top-1/2 -ml-[16px] -mt-[16px]"
                style={{ transform: `rotate(${angle}deg) translate(78px)` }}
              >
                <span className="block" style={{ transform: `rotate(${-angle}deg)` }}>
                  <span
                    className="block"
                    style={{ animation: spinning ? 'orbit-spin-rev 28s linear infinite' : 'none' }}
                  >
                    <BrandTile code={p.code} size={32} lifted={i === active} />
                  </span>
                </span>
              </span>
            );
          })}
        </div>

        {/* the layer itself, holding whoever is answering */}
        <div
          className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(120% 120% at 32% 22%, #ffffff 0%, #efe9e3 55%, #d9d0c6 100%)',
            boxShadow:
              '0 16px 32px -14px rgba(0,0,0,.45), 0 2px 4px rgba(0,0,0,.1), inset 0 2px 3px rgba(255,255,255,.9), inset 0 -6px 12px rgba(0,0,0,.06)',
          }}
        >
          <BrandTile code={ORBIT[active].code} size={40} lifted />
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-3.5 flex items-center justify-between">
        <span className="ui-label truncate text-[color:var(--color-graphite)]">{ORBIT[active].name}</span>
        <span className="ui-label tabular text-[color:var(--color-faint)]">thread kept &middot; {14 + active}</span>
      </div>
    </div>
  );
}

/* ========================================= 03 unified memory scene */
/* A deck of memory cards, tilted in space, feeding whichever model is
   answering. The beam fires each time the model changes. */

const MEMORY = ['Writes in British English', 'Ships on Thursdays', 'brand-book.pdf', 'Prefers tables to prose'];
const MEM_TARGETS = [{ code: 'AN' }, { code: 'OA' }, { code: 'GG' }];

function MemoryScene() {
  return <Scene tint="rgba(124,58,237,0.14)">{(inView) => <MemorySceneInner inView={inView} />}</Scene>;
}

function MemorySceneInner({ inView }) {
  const active = useCycle(MEM_TARGETS.length, 2400, inView);
  const reading = useCycle(MEMORY.length, 600, inView);
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative flex h-full flex-col items-center justify-center pb-9 pt-4">
      {/* the deck */}
      <div className="scene-3d relative h-[104px] w-[214px]" style={{ transform: 'rotateX(16deg)' }}>
        {MEMORY.map((fact, i) => {
          const on = running && i === reading;
          return (
            <span
              key={fact}
              className="absolute left-1/2 flex h-[30px] w-[206px] -translate-x-1/2 items-center rounded-[8px] px-3 text-[11.5px] transition-all duration-300"
              style={{
                top: i * 24,
                zIndex: 10 - i,
                background: on ? 'linear-gradient(180deg,#ffffff,#f6f1ff)' : 'linear-gradient(180deg,#ffffff,#f4f2f0)',
                border: `1px solid ${on ? 'rgba(124,58,237,.45)' : 'rgba(16,13,10,.10)'}`,
                boxShadow: on
                  ? '0 12px 24px -12px rgba(124,58,237,.55), inset 0 1px 0 #fff'
                  : '0 6px 14px -10px rgba(0,0,0,.4), inset 0 1px 0 #fff',
                color: on ? '#4c1d95' : '#6b6660',
                transform: on ? 'translate(-50%, -3px)' : 'translate(-50%, 0)',
              }}
            >
              {fact}
            </span>
          );
        })}
      </div>

      {/* beam into the active model */}
      <div className="relative mt-3 h-6 w-full" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[color:var(--color-border)]" />
        {running && (
          <span
            key={active}
            className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#a78bfa] to-transparent"
            style={{ animation: 'beam-down .8s ease-out' }}
          />
        )}
      </div>

      <div className="flex items-center gap-5">
        {MEM_TARGETS.map((t, i) => (
          <span key={t.code} style={{ opacity: i === active ? 1 : 0.45, transition: 'opacity .5s' }}>
            <BrandTile code={t.code} size={34} lifted={i === active} />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-4 bottom-3.5 flex items-center justify-between">
        <span className="ui-label text-[color:var(--color-graphite)]">One memory, {MEM_TARGETS.length} models</span>
        <span className="ui-label tabular text-[color:var(--color-faint)]">nothing re-explained</span>
      </div>
    </div>
  );
}

/* ================================================= 04 agents scene */
/* auto resolves to a different target each pass, and the wire lights. */

const TARGETS = [
  { code: 'OA', label: 'o3', note: 'reasoning' },
  { code: 'AN', label: 'Sonnet 4', note: 'code' },
  { code: 'TL', label: 'tools', note: 'search, files' },
];

function AgentScene() {
  return <Scene tint="rgba(8,102,255,0.12)">{(inView) => <AgentSceneInner inView={inView} />}</Scene>;
}

function AgentSceneInner({ inView }) {
  const active = useCycle(TARGETS.length, 2000, inView);
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative flex h-full flex-col items-center justify-center pb-9">
      {/* the call */}
      <div
        className="relative z-10 rounded-[10px] px-3.5 py-2.5 font-mono text-[11.5px]"
        style={{
          background: 'linear-gradient(180deg,#ffffff,#f3f4f6)',
          border: '1px solid rgba(16,13,10,.12)',
          boxShadow: '0 14px 28px -16px rgba(0,0,0,.5), inset 0 1px 0 #fff',
          transform: 'perspective(700px) rotateX(9deg)',
        }}
      >
        <span className="font-semibold text-[#0866FF]">POST</span>
        <span className="text-[#111827]"> /v1/chat </span>
        <span className="text-[#9a948c]">{'{ model: "auto" }'}</span>
      </div>

      {/* wiring */}
      <div className="relative mt-4 w-[240px] pt-5" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-[color:var(--rule-strong)]" />
        <span className="absolute left-[16.6%] right-[16.6%] top-5 h-px bg-[color:var(--rule-strong)]" />

        <div className="grid grid-cols-3 gap-3">
          {TARGETS.map((t, i) => {
            const on = i === active;
            return (
              <div key={t.label} className="relative flex flex-col items-center pt-5">
                <span
                  className="absolute left-1/2 top-0 h-5 w-[2px] -translate-x-1/2 rounded-full transition-all duration-500"
                  style={{
                    background: on ? BRAND[t.code].base : 'var(--rule-strong)',
                    boxShadow: on ? `0 0 8px ${BRAND[t.code].base}` : 'none',
                  }}
                />
                <BrandTile code={t.code} size={30} lifted={on} />
                <span
                  className="ui-label mt-2 text-[9px] transition-colors duration-500"
                  style={{ color: on ? 'var(--color-foreground)' : 'var(--color-faint)' }}
                >
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-3.5 flex items-center justify-between">
        <span className="ui-label text-[color:var(--color-graphite)]">
          Routed to <span style={{ color: running ? BRAND[TARGETS[active].code].base : undefined }}>{TARGETS[active].label}</span>
        </span>
        <span className="ui-label tabular text-[color:var(--color-faint)]">{TARGETS[active].note}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const CARDS = [
  {
    heading: 'Private & Unfiltered',
    line: 'Private by default. Uncensored by design.',
    body: 'Your prompts leave without your name attached and are gone the moment they are answered. No logs, no profile, and no filter of our own placed over the model you chose.',
    link: 'How privacy works',
    href: '#privacy',
    span: 'lg:col-span-7',
    visual: <PrivateScene />,
  },
  {
    heading: 'Multi-Model Access',
    line: 'Every frontier model, one conversation.',
    body: 'Change model in the middle of a sentence and the thread stays exactly where it was. One account, one subscription, nothing to copy between apps.',
    link: 'See every model',
    href: '/models',
    span: 'lg:col-span-5',
    visual: <MultiModelScene />,
  },
  {
    heading: 'Unified Memory',
    line: 'One memory. Every model.',
    body: 'Your files, preferences and past chats live in your account rather than inside one company’s app, so whichever model answers already knows them. Export the lot whenever you want.',
    link: null,
    span: 'lg:col-span-5',
    visual: <MemoryScene />,
  },
  {
    heading: 'Built for Agents',
    line: 'One endpoint your agents can call.',
    body: 'Your agents get the same routing, memory and privacy behind a single API. Pin a model, or send auto and let the router choose the right one for each request.',
    link: 'Read the API',
    href: '#api',
    span: 'lg:col-span-7',
    visual: <AgentScene />,
  },
];

export default function LayerSection() {
  return (
    <Section id="layer" index="01" label="The layer">
      <SectionHead
        eyebrow="Why OpenLedger"
        title="Intelligence, on your terms."
        deck="Not another model. A private, uncensored layer in front of the ones you already use."
        meta={[
          { label: 'Providers', value: '7' },
          { label: 'Prompts stored', value: '0' },
        ]}
      />

      <div className="mt-14 grid grid-cols-1 gap-3.5 lg:grid-cols-12">
        {CARDS.map((card, i) => (
          <Reveal key={card.heading} delay={i * 70} className={`${card.span} flex`}>
            <article className="panel reg-marks flex w-full flex-col p-5 transition-colors duration-300 hover:border-[color:var(--rule-strong)] sm:p-7">
              <h3 className="display-sm text-[24px] text-foreground sm:text-[27px]">{card.heading}</h3>
              <p className="mt-2 text-[16px] font-medium text-accent">{card.line}</p>
              <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.6] text-[color:var(--color-graphite)]">
                {card.body}
              </p>

              <div className="mt-6">{card.visual}</div>

              {card.link && (
                <div className="mt-6 flex items-center justify-end border-t border-[color:var(--color-border)] pt-4">
                  <ArrowLink href={card.href}>{card.link}</ArrowLink>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
