import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Section, ProviderTile, Reveal, useInView } from './ui/Ledger';

/* =====================================================================
   Council Mode
   The flagship feature, so it gets the page's one real product surface.
   The point of a council is that it disagrees, so the layout groups the
   models by the side they took: two camps, side by side, then the answer
   that resolves them. Reading the split should not require reading four
   paragraphs.
   ===================================================================== */

const QUESTION = 'We ship in two weeks and the auth rewrite is late. Ship or delay?';

const CAMPS = [
  { id: 'delay', label: 'Delay it', accent: false },
  { id: 'ship', label: 'Ship something smaller', accent: true },
];

/* Ordered so each camp sits together under its own heading. */
const LANES = [
  {
    code: 'OA',
    model: 'o3',
    stance: 'Delay',
    camp: 'delay',
    ms: 4100,
    text: 'Two live auth paths is what causes the incident, not the missed date.',
  },
  {
    code: 'GG',
    model: 'Gemini 2.5 Pro',
    stance: 'Cost it',
    camp: 'delay',
    ms: 5200,
    text: 'Put numbers on both. One bad rollback costs more than the week you save.',
  },
  {
    code: 'AN',
    model: 'Claude Opus 4',
    stance: 'Ship',
    camp: 'ship',
    ms: 3300,
    text: 'Ship behind a flag. The old path keeps serving until the new one is clean.',
  },
  {
    code: 'DS',
    model: 'DeepSeek R1',
    stance: 'Cut scope',
    camp: 'ship',
    ms: 2600,
    text: 'The date slipped because scope grew. Cut it back to the session store.',
  },
];

const SYNTHESIS =
  'A flag makes both camps right: launch on the date, cut the rewrite to the session store, and keep the old path serving until the flag is clean.';

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
    <Section id="council" index="03" label="Council" dark grid>
      <div ref={ref}>
        {/* ------------------------------------------------------ header */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Reveal>
            <div className="ui-label mb-5 flex items-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Council Mode
            </div>
            <h2 className="display text-[clamp(2.6rem,6.4vw,5rem)] text-balance text-foreground">
              Ask four models.
              <br />
              Get one answer.
            </h2>
            <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[19px]">
              The flagship feature. One question, four models, and the answer that holds up once they disagree.
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
              <span className="ui-label text-foreground">Council run</span>
              <span className="ui-label hidden text-[color:var(--color-faint)] sm:inline">
                4 models &middot; 1 question
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

            {/* camp headings: the split, before you read a word of it */}
            <div className="hidden lg:grid lg:grid-cols-2">
              {CAMPS.map((camp, i) => {
                const votes = LANES.filter((l) => l.camp === camp.id).length;
                return (
                  <div
                    key={camp.id}
                    className={`flex items-center gap-2.5 border-b border-[color:var(--color-border)] px-7 py-3 ${
                      i === 0 ? 'border-r' : ''
                    }`}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full transition-colors duration-500"
                      style={{
                        background:
                          phase >= 3
                            ? camp.accent
                              ? 'var(--color-brand-accent)'
                              : 'var(--color-graphite)'
                            : 'var(--color-border)',
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="ui-label transition-colors duration-500"
                      style={{ color: phase >= 3 ? (camp.accent ? 'var(--color-accent)' : 'var(--color-foreground)') : 'var(--color-faint)' }}
                    >
                      {camp.label}
                    </span>
                    <span className="tabular ml-auto font-mono text-[12px] text-[color:var(--color-faint)]">
                      {votes} of 4
                    </span>
                  </div>
                );
              })}
            </div>

            {/* lanes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {LANES.map((lane, i) => (
                <Lane key={lane.model} lane={lane} index={i} active={phase >= 3} splitAfter={i === 1} />
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
                <span className="ui-label text-accent">The answer</span>
                <span className="ui-label text-[color:var(--color-faint)]">Both camps, resolved</span>
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
            Try Council Mode
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
  const accent = lane.camp === 'ship';

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
