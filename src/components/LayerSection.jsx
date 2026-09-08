import React from 'react';
import { Section, SectionHead, Reveal, useInView, Mark, ArrowLink } from './ui/Ledger';
import { BrandTile } from './ui/Glyphs';

/* =====================================================================
   The four pillars.

   The visual language: soft floating UI pieces and app icon tiles over a
   light ground, with dashed orbit rings where something circles a centre.
   Depth comes from the tiles' own gradients and long soft shadows rather
   than from heavy perspective, which is what keeps it looking like
   product rather than like a diagram.

   Motion is CSS, not React state: stepping a drift from a timer is how
   you get a visible stutter.

   One rule matters more than the rest here. These keyframes animate the
   independent `translate` / `scale` properties rather than `transform`,
   so they compose with an element's placement instead of replacing it.
   The catch is that Tailwind v4's `-translate-x-1/2` compiles to
   `translate: -50% -50%` and NOT to a transform — so those utilities and
   these animations fight over the same property, and the animation wins.
   Anything that floats therefore centres itself with an inline
   `transform`, never with a translate utility.

   Everything is sized to a budget: the section fits one screen, which
   leaves about 150px of drawable height per scene.
   ===================================================================== */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * A scene stage. Knows when it is being looked at, and prints the card's
 * spec line along the bottom the way a plate on equipment does.
 */
function Scene({ foot, children }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [left, right] = foot.split('·').map((s) => s.trim());

  return (
    <div
      ref={ref}
      className="relative h-[168px] overflow-hidden rounded-[12px] border border-[color:var(--color-border)]"
      style={{
        background:
          'radial-gradient(100% 78% at 50% 4%, color-mix(in srgb, var(--color-brand-accent) 8%, transparent) 0%, transparent 68%), var(--color-tertiary)',
      }}
    >
      <div className="absolute inset-x-0 bottom-[26px] top-0">{children(inView)}</div>

      <div className="absolute inset-x-0 bottom-0 flex h-[26px] items-center justify-between border-t border-[color:var(--color-border)] px-3.5">
        <span className="ui-label text-[9px] text-[color:var(--color-graphite)]">{left}</span>
        <span className="ui-label text-[9px] text-[color:var(--color-faint)]">{right}</span>
      </div>
    </div>
  );
}

/* ==================================== 01 confidential inference */
function ConfidentialScene() {
  return (
    <Scene foot="Zero retention · Uncensored">
      {(inView) => <ConfidentialSceneInner inView={inView} />}
    </Scene>
  );
}

function ConfidentialSceneInner({ inView }) {
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Main Settings Card Mockup */}
      <div 
        className="relative z-10 w-[200px] rounded-xl bg-[color:var(--color-card)] border border-[color:var(--color-border)] shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] overflow-hidden"
        style={{ animation: running ? 'float-soft 6s ease-in-out infinite' : 'none' }}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-[color:var(--color-border)] flex items-center gap-1.5 bg-[color:var(--color-tertiary)]">
          <svg className="w-3 h-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span className="text-[10px] font-semibold text-foreground">Privacy Controls</span>
        </div>
        
        {/* Toggle Row */}
        <div className="p-3 flex items-center justify-between bg-[color:var(--color-card)]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-foreground">Zero Retention</span>
            <span className="text-[9px] text-[color:var(--color-graphite)]">Prompts are never stored</span>
          </div>
          {/* Active Toggle */}
          <div className="w-[28px] h-[16px] bg-[#16a34a] rounded-full p-[2px] flex items-center justify-end shadow-inner relative">
            <div className="w-[12px] h-[12px] bg-white rounded-full shadow-sm absolute right-[2px]"></div>
          </div>
        </div>
      </div>
      
      {/* Floating securely encrypted elements to show data disappearing */}
      {running && (
        <>
          <div className="absolute top-[10%] right-[10%] px-2 py-1 bg-[color:var(--color-card)] backdrop-blur-md border border-[color:var(--color-border)] rounded-md shadow-sm flex items-center gap-1.5 opacity-0" style={{ animation: 'rise-through 4s ease-in-out infinite' }}>
             <svg className="w-2.5 h-2.5 text-[color:var(--color-graphite)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             <div className="w-6 h-1 bg-[color:var(--color-border)] rounded-full"></div>
          </div>
          <div className="absolute bottom-[20%] left-[8%] px-2 py-1 bg-[color:var(--color-card)] backdrop-blur-md border border-[color:var(--color-border)] rounded-md shadow-sm flex items-center gap-1.5 opacity-0" style={{ animation: 'rise-through 4.5s ease-in-out 1.5s infinite' }}>
             <svg className="w-2.5 h-2.5 text-[color:var(--color-graphite)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             <div className="w-10 h-1 bg-[color:var(--color-border)] rounded-full"></div>
          </div>
        </>
      )}
    </div>
  );
}

/* ====================================== 02 unified model access */
function AccessScene() {
  return <Scene foot="Multi-model · Token optimized">{(inView) => <AccessSceneInner inView={inView} />}</Scene>;
}

function AccessSceneInner({ inView }) {
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full gap-3">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Central Hub UI */}
      <div className="relative z-10 flex flex-col gap-3 items-center mt-2">
        {/* Fake dropdown selector */}
        <div 
          className="w-[180px] h-[36px] bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[10px] shadow-[0_6px_16px_rgba(0,0,0,0.06)] dark:shadow-xl flex items-center px-3 gap-2.5"
          style={{ animation: running ? 'float-soft 7s ease-in-out infinite' : 'none' }}
        >
          <div className="w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20">
            <Mark size={10} className="text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-[11px] font-semibold text-foreground flex-1">Select Model...</span>
          <svg className="w-3 h-3 text-[color:var(--color-graphite)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>

        {/* The models docked in a sleek bar */}
        <div 
          className="px-3 py-2 bg-[color:var(--color-card)]/90 backdrop-blur-xl border border-[color:var(--color-border)] rounded-[12px] shadow-[0_6px_20px_rgba(0,0,0,0.05)] flex items-center justify-center gap-2.5"
          style={{ animation: running ? 'float-soft 6s ease-in-out 0.5s infinite' : 'none' }}
        >
           <BrandTile code="OA" size={20} />
           <BrandTile code="AN" size={20} />
           <BrandTile code="GG" size={20} />
           <BrandTile code="MT" size={20} />
           <div className="w-5 h-5 rounded-full bg-[color:var(--color-tertiary)] border border-[color:var(--color-border)] flex items-center justify-center">
             <span className="text-[7.5px] font-bold text-[color:var(--color-graphite)]">+8</span>
           </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================== 03 unified memory */
function MemoryScene() {
  return <Scene foot="One memory · Shared context">{(inView) => <MemorySceneInner inView={inView} />}</Scene>;
}

function MemorySceneInner({ inView }) {
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 pt-1">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Memory Context Block */}
      <div 
        className="relative z-10 px-4 py-2.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5"
        style={{ animation: running ? 'float-soft 5s ease-in-out infinite' : 'none' }}
      >
        <div className="w-6 h-6 rounded-[8px] bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-center justify-center">
          <svg className="w-3 h-3 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-foreground leading-none">Shared Context</span>
          <div className="w-20 h-1 bg-[color:var(--color-tertiary)] rounded-full overflow-hidden">
             <div className="w-full h-full bg-orange-400 dark:bg-orange-500/80 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      {/* SVG Connection Tracks */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[140px] h-[26px] z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 140 26" fill="none">
           <path d="M 70 0 V 10 M 70 10 H 10 V 26 M 70 10 H 70 V 26 M 70 10 H 130 V 26" stroke="currentColor" className="text-[color:var(--color-border)]" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="3 3"/>
           {running && (
             <>
               <circle cx="10" cy="26" r="2" className="fill-orange-400 shadow-glow animate-[ping_2s_infinite]" />
               <circle cx="70" cy="26" r="2" className="fill-orange-400 shadow-glow animate-[ping_2s_infinite_0.3s]" />
               <circle cx="130" cy="26" r="2" className="fill-orange-400 shadow-glow animate-[ping_2s_infinite_0.6s]" />
             </>
           )}
        </svg>
      </div>

      {/* Models row receiving the context */}
      <div className="relative z-10 flex gap-9 mt-1">
        <div className="bg-[color:var(--color-card)] p-1 rounded-lg shadow-sm border border-[color:var(--color-border)]"><BrandTile code="OA" size={22} /></div>
        <div className="bg-[color:var(--color-card)] p-1 rounded-lg shadow-sm border border-[color:var(--color-border)]"><BrandTile code="AN" size={22} /></div>
        <div className="bg-[color:var(--color-card)] p-1 rounded-lg shadow-sm border border-[color:var(--color-border)]"><BrandTile code="GG" size={22} /></div>
      </div>
    </div>
  );
}

/* ==================================== 04 agent infrastructure */
function AgentScene() {
  return <Scene foot="x402 enabled · Agent ready">{(inView) => <AgentSceneInner inView={inView} />}</Scene>;
}

function AgentSceneInner({ inView }) {
  const running = inView && !prefersReducedMotion();

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center gap-8 w-full max-w-[240px] mx-auto">
        
        {/* Agents Stack */}
        <div className="flex flex-col gap-2.5 relative z-10 w-24">
          {['Research', 'Support', 'Ops'].map((agent, i) => (
             <div 
               key={agent}
               className="px-2.5 py-1.5 bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-[8px] shadow-sm flex items-center gap-1.5 relative group"
               style={{ animation: running ? `float-soft 4s ease-in-out ${i * 0.4}s infinite` : 'none' }}
             >
               <div className="w-[5px] h-[5px] bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
               <span className="text-[9px] font-semibold text-foreground">{agent} Agent</span>
               
               {/* Small connecting horizontal line from each block */}
               <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-5 h-[1.5px] bg-emerald-500/30"></div>
             </div>
          ))}
          {/* Vertical connecting spine */}
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[1.5px] h-[60px] bg-emerald-500/30"></div>
          {/* Main trunk to API */}
          <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[20px] h-[1.5px] bg-emerald-500/30"></div>
          
          {running && (
             <div className="absolute right-[-26px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399] animate-[ping_2s_infinite]"></div>
          )}
        </div>

        {/* The Universal API Endpoint */}
        <div 
           className="px-4 py-3 bg-[#0a0a0c] border border-gray-800 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col gap-1 relative overflow-hidden"
           style={{ animation: running ? 'float-soft 6s ease-in-out infinite' : 'none' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
          <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest relative z-10">Endpoint</span>
          <div className="flex items-center gap-1.5 relative z-10">
            <span className="text-emerald-400 font-bold text-[10px]">POST</span>
            <span className="text-white font-mono text-xs tracking-tight">/v1/chat</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const CARDS = [
  {
    heading: 'Private AI',
    line: 'Private and uncensored, from the start.',
    body: 'Ask freely without your prompts being stored or used for training.',
    href: '/private',
    span: 'lg:col-span-7',
    visual: <ConfidentialScene />,
  },
  {
    heading: 'Multi-Model & Token Optimization',
    line: 'More models. Fewer wasted tokens.',
    body: 'Access leading AI models from one place, with optimized token usage to reduce costs and keep every request efficient.',
    span: 'lg:col-span-5',
    visual: <AccessScene />,
  },
  {
    heading: 'Unified Memory',
    line: 'Say it once. Every model knows.',
    body: 'Your context stays consistent across models, so you never have to start over.',
    href: '/memory',
    span: 'lg:col-span-5',
    visual: <MemoryScene />,
  },
  {
    heading: 'Built for Agents',
    line: 'Connect once. Access any model.',
    body: 'Give agents direct access to leading AI models with x402, enabling seamless interactions across models without complex integrations.',
    span: 'lg:col-span-7',
    visual: <AgentScene />,
  },
];

export default function LayerSection() {
  return (
    <Section id="layer" index="01" label="The layer" compact>
      <SectionHead
        eyebrow="Why OpenLedger"
        title="Private by default. Uncensored by design."
        deck="Private access to leading AI models, shared memory, and agents without the usual switching or setup."
      />

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        {CARDS.map((card, i) => (
          <Reveal key={card.heading} delay={i * 70} className={`${card.span} flex`}>
            <article className="panel reg-marks flex w-full flex-col p-4 transition-colors duration-300 hover:border-[color:var(--rule-strong)] sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="display-sm text-[18px] text-foreground sm:text-[19px]">{card.heading}</h3>
                {card.href && (
                  <ArrowLink href={card.href} className="mt-[5px] shrink-0">
                    Explore
                  </ArrowLink>
                )}
              </div>
              <p className="mt-1.5 text-[13.5px] font-medium text-accent">{card.line}</p>
              {/* Two lines are reserved whether or not the copy needs them.
                  The narrow cards wrap where the wide ones do not, and
                  letting that vary drops one scene below its neighbour. No
                  max-width, for the same reason. */}
              <p className="mt-1.5 min-h-[39px] text-[12.5px] leading-[1.55] text-[color:var(--color-graphite)]">
                {card.body}
              </p>

              <div className="mt-2.5">{card.visual}</div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
