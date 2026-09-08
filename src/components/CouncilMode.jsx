import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Section, ProviderTile, Reveal, useInView } from './ui/Ledger';

/* =====================================================================
   Council Mode
   The flagship feature, so it gets the page's one real product surface.
   ===================================================================== */

const QUESTION = 'Pick the best sushi restaurant in Tokyo for dinner under $100.';

const LANES = [
  {
    code: 'OA',
    model: 'GPT',
    stance: 'Sushi Tokyo Ten',
    camp: 'other',
    ms: 4100,
    text: 'Great value for an omakase experience, with a central location and a menu that fits the budget.',
  },
  {
    code: 'AN',
    model: 'Claude',
    stance: 'Manten Sushi',
    camp: 'winner',
    ms: 3300,
    text: 'A strong pick for quality and value, especially if you want a proper omakase without premium pricing.',
  },
  {
    code: 'GG',
    model: 'Gemini',
    stance: 'Sushi No Midori',
    camp: 'other',
    ms: 5200,
    text: 'More casual and affordable, with a wide selection and consistently popular reviews.',
  },
  {
    code: 'DS',
    model: 'DeepSeek',
    stance: 'Manten Sushi',
    camp: 'winner',
    ms: 2600,
    text: 'Best overall balance of quality, experience, and price within the $100 budget.',
  },
];

const SYNTHESIS =
  'The strongest overall pick for an authentic omakase experience under $100, with a good balance of quality, value, and accessibility.';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Reveals `text` character by character once `start` flips true. */
function useTypewriter(text, { start, speed = 14, delay = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    if (prefersReducedMotion()) {
      setCount(text.length);
      return;
    }
    let i = 0;
    let tick;
    const kick = setTimeout(() => {
      tick = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(tick);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(kick);
      clearInterval(tick);
    };
  }, [start, text, speed, delay]);

  return { shown: text.slice(0, count), done: count >= text.length };
}

/** Counts up while the run is in flight, then holds at the total. */
function useRunClock(active, settled, total) {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (!active) {
      setMs(0);
      return;
    }
    if (settled || prefersReducedMotion()) {
      setMs(total);
      return;
    }
    const started = Date.now();
    const tick = setInterval(() => setMs(Math.min(total, Date.now() - started)), 80);
    return () => clearInterval(tick);
  }, [active, settled, total]);

  return (ms / 1000).toFixed(1);
}

export default function CouncilMode() {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);

  // 1 question typed, 2 routed, 3 answering, 4 resolved.
  useEffect(() => {
    if (!inView) return;
    setPhase(1);
    const t = [
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 1900),
      setTimeout(() => setPhase(4), 4600),
    ];
    return () => t.forEach(clearTimeout);
  }, [inView, run]);

  const question = useTypewriter(QUESTION, { start: phase >= 1, speed: 20 });
  const synthesis = useTypewriter(SYNTHESIS, { start: phase >= 4, speed: 10, delay: 250 });
  const clock = useRunClock(phase >= 1, phase >= 4, 6200);

  return (
    <Section id="council" index="04" label="Consensus" dark grid>
      <div ref={ref}>
        {/* ------------------------------------------------------ header */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Reveal>
            <div className="ui-label mb-5 flex items-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Consensus Mode
            </div>
            <h2 className="display text-[clamp(2.6rem,6.4vw,5rem)] text-balance text-foreground">
              Ask four models.
              <br />
              Get one answer.
            </h2>
            <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[19px]">
              The flagship feature. One question, four models, and the optimal answer synthesized from their consensus.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <dl className="flex gap-8 lg:flex-col lg:gap-5 lg:border-l lg:border-[color:var(--color-border)] lg:pl-8">
              <div>
                <dt className="ui-label text-[color:var(--color-faint)]">Models per run</dt>
                <dd className="tabular display mt-1 text-[34px] leading-none text-foreground">4</dd>
              </div>
              <div>
                <dt className="ui-label text-[color:var(--color-faint)]">Median run</dt>
                <dd className="tabular display mt-1 text-[34px] leading-none text-foreground">6.2s</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* ----------------------------------------------------- console */}
        <Reveal delay={120}>
          <div className="panel reg-marks mt-12 overflow-hidden shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
            {/* run bar */}
            <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-5 py-3 sm:px-7">
              <span
                className="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-brand-accent"
                style={{ animation: phase > 0 && phase < 4 ? 'pulse-dot 1.1s ease-in-out infinite' : 'none' }}
                aria-hidden="true"
              />
              <span className="ui-label text-foreground">Consensus run</span>
              <span className="ui-label hidden text-[color:var(--color-faint)] sm:inline">
                4 models &middot; 3 picks &middot; 1 answer
              </span>
              <span className="tabular ml-auto font-mono text-[12px] text-[color:var(--color-graphite)]">{clock}s</span>
            </div>

            {/* question */}
            <div className="flex flex-col gap-2 px-5 py-6 sm:flex-row sm:items-baseline sm:gap-6 sm:px-7">
              <span className="ui-label shrink-0 pt-1 text-[color:var(--color-faint)]">You</span>
              <p className="min-h-[1.6em] text-[19px] leading-[1.4] text-foreground sm:text-[23px]">
                {question.shown}
                {!question.done && <span className="caret ml-0.5" />}
              </p>
            </div>

            {/* routing bus */}
            <div className="relative h-px bg-[color:var(--color-border)]" aria-hidden="true">
              <span
                className="absolute inset-0 origin-left bg-brand-accent"
                style={{
                  opacity: 0.85,
                  transform: phase >= 2 ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform .9s cubic-bezier(.16,1,.3,1)',
                }}
              />
            </div>

            {/* lanes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4 lg:pt-0">
              {LANES.map((lane, i) => (
                <Lane key={lane.model} lane={lane} index={i} active={phase >= 3} splitAfter={false} />
              ))}
            </div>

            {/* the answer */}
            <div
              className="border-t transition-colors duration-700"
              style={{
                borderColor: phase >= 4 ? 'color-mix(in srgb, var(--color-brand-accent) 40%, transparent)' : 'var(--color-border)',
                background: phase >= 4 ? 'color-mix(in srgb, var(--color-brand-accent) 9%, transparent)' : 'transparent',
              }}
            >
              <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-7">
                <span className="ui-label text-accent">Final Pick: Manten Sushi</span>
                <span className="ui-label text-[color:var(--color-faint)]">4 Models Compared</span>
              </div>
              <p className="min-h-[3.2em] max-w-[70ch] px-5 pb-6 pt-3 text-[18px] leading-[1.55] text-foreground sm:px-7 sm:pb-7 sm:text-[21px]">
                {synthesis.shown}
                {phase >= 4 && !synthesis.done && <span className="caret ml-0.5" />}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160} className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
            Try Consensus Mode
          </a>
          <button
            onClick={() => {
              setPhase(0);
              setRun((r) => r + 1);
            }}
            className="btn btn-ghost"
          >
            <RotateCcw size={15} />
            Replay
          </button>
          <span className="ui-label ml-auto hidden text-[color:var(--color-faint)] lg:inline">
            Included on Pro and Team
          </span>
        </Reveal>
      </div>
    </Section>
  );
}

function Lane({ lane, index, active, splitAfter }) {
  const { shown, done } = useTypewriter(lane.text, { start: active, speed: 11, delay: index * 180 });
  const accent = lane.camp === 'winner';

  return (
    <article
      className={`border-b border-[color:var(--color-border)] px-5 py-6 transition-opacity duration-500 sm:px-7 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
        splitAfter ? 'lg:border-r-[color:var(--rule-strong)]' : ''
      }`}
      style={{ opacity: active ? 1 : 0.4 }}
    >
      <header className="flex items-center gap-2.5">
        <ProviderTile code={lane.code} size={28} active={done && accent} />
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-foreground">{lane.model}</span>
        <span className="tabular font-mono text-[10px] text-[color:var(--color-faint)]">
          {done ? `${(lane.ms / 1000).toFixed(1)}s` : '···'}
        </span>
      </header>

      <div
        className="ui-label mt-4 inline-flex rounded-full border px-2.5 py-1 transition-colors duration-500"
        style={{
          borderColor: !done
            ? 'var(--color-border)'
            : accent
              ? 'color-mix(in srgb, var(--color-brand-accent) 45%, transparent)'
              : 'var(--rule-strong)',
          color: !done ? 'var(--color-faint)' : accent ? 'var(--color-accent)' : 'var(--color-foreground)',
        }}
      >
        {lane.stance}
      </div>

      <p className="mt-3 min-h-[4.8em] text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">
        {shown}
        {active && !done && <span className="caret ml-0.5 !h-[0.85em] !w-[5px]" />}
      </p>
    </article>
  );
}
