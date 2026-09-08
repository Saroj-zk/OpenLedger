import React, { useEffect, useState } from 'react';
import { useInView } from './ui/Ledger';

/* =====================================================================
   Visuals for /private.

   The page was four blocks of prose making claims nobody could picture.
   These are the pictures: a settings panel showing the switches actually
   thrown, and a journey showing where a request goes and what is left of
   it at each hop.

   The journey is the important one. "Zero retention" is a phrase; a
   request crossing four stations, with the store beneath it staying
   empty the whole way, is an argument.
   ===================================================================== */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------- glyphs */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function PrivacyGlyph({ name, size = 17 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
      {name === 'device' && (
        <>
          <rect x="2.4" y="3.4" width="15.2" height="10.4" rx="2" {...stroke} />
          <path d="M6.6 16.8h6.8" {...stroke} />
        </>
      )}
      {name === 'shield' && (
        <>
          <path d="M10 2.4 16.4 5v4.6c0 3.9-2.6 6.8-6.4 8-3.8-1.2-6.4-4.1-6.4-8V5z" {...stroke} />
          <path d="m7.4 9.8 1.9 1.9 3.5-3.6" {...stroke} />
        </>
      )}
      {name === 'spark' && (
        <>
          <path d="M10 2.6c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6Z" {...stroke} />
        </>
      )}
      {name === 'nostore' && (
        <>
          <path d="M4.6 6.2h10.8l-.9 10a1.8 1.8 0 0 1-1.8 1.6H7.3a1.8 1.8 0 0 1-1.8-1.6z" {...stroke} />
          <path d="M7.8 6.2V4.4a1.2 1.2 0 0 1 1.2-1.2h2a1.2 1.2 0 0 1 1.2 1.2v1.8" {...stroke} />
          <path d="M2.8 3.2 17.2 17" {...stroke} />
        </>
      )}
      {name === 'notrain' && (
        <>
          <path d="M3.2 15.4V9M7.6 15.4V5.8M12 15.4v-4.2M16.4 15.4V7.4" {...stroke} />
          <path d="M2.8 3.4 17.2 16.8" {...stroke} />
        </>
      )}
      {name === 'noprofile' && (
        <>
          <circle cx="10" cy="7" r="3.1" {...stroke} />
          <path d="M4.4 16.6a5.6 5.6 0 0 1 11.2 0" {...stroke} />
          <path d="M2.8 3 17.2 17" {...stroke} />
        </>
      )}
      {name === 'ask' && (
        <>
          <path d="M17 12.2a2.2 2.2 0 0 1-2.2 2.2H7.2L3 17.6V5.2A2.2 2.2 0 0 1 5.2 3h9.6A2.2 2.2 0 0 1 17 5.2z" {...stroke} />
        </>
      )}
      {name === 'create' && (
        <>
          <path d="m13.4 3.4 3.2 3.2-9 9-4 .8.8-4z" {...stroke} />
          <path d="m11.6 5.2 3.2 3.2" {...stroke} />
        </>
      )}
      {name === 'choose' && (
        <>
          <path d="M10 2.6 17.4 6.5 10 10.4 2.6 6.5z" {...stroke} />
          <path d="M2.6 10.5 10 14.4l7.4-3.9" {...stroke} />
        </>
      )}
    </svg>
  );
}

/** The accent-tinted tile every glyph on this page sits in. */
export function GlyphTile({ name, active = false }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-all duration-500"
      style={{
        borderColor: active
          ? 'color-mix(in srgb, var(--color-brand-accent) 55%, transparent)'
          : 'color-mix(in srgb, var(--color-brand-accent) 30%, transparent)',
        background: active
          ? 'color-mix(in srgb, var(--color-brand-accent) 18%, transparent)'
          : 'color-mix(in srgb, var(--color-brand-accent) 9%, transparent)',
        color: 'var(--color-accent)',
        boxShadow: active ? '0 10px 22px -12px var(--color-brand-glow)' : 'none',
      }}
    >
      <PrivacyGlyph name={name} />
    </span>
  );
}

/* ------------------------------------------ the hero's settings panel */

const SWITCHES = [
  ['Zero retention', 'Prompts are never stored'],
  ['No training', 'Never used to train a model'],
  ['Local-only history', 'Kept on your device'],
];

export function PrivacyPanel() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const running = inView && !prefersReducedMotion();

  return (
    <div
      ref={ref}
      className="panel overflow-hidden"
      style={{ animation: running ? 'float-soft 7s ease-in-out infinite' : 'none' }}
    >
      <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-4 py-3">
        <span className="text-accent">
          <PrivacyGlyph name="shield" size={15} />
        </span>
        <span className="text-[13px] font-semibold text-foreground">Privacy</span>
        <span className="ui-label ml-auto text-[color:var(--color-faint)]">Default</span>
      </div>

      <div className="divide-y divide-[color:var(--color-border)]">
        {SWITCHES.map(([term, detail]) => (
          <div key={term} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="min-w-0">
              <span className="block text-[13.5px] font-medium text-foreground">{term}</span>
              <span className="block text-[11.5px] text-[color:var(--color-graphite)]">{detail}</span>
            </span>
            <span className="flex h-[19px] w-[33px] shrink-0 items-center rounded-full bg-[#16a34a] px-[2px]">
              <span className="ml-auto h-[15px] w-[15px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.3)]" />
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between border-t border-[color:var(--color-border)] px-4 py-3">
        <span className="ui-label text-[color:var(--color-faint)]">Prompts stored</span>
        <span className="display tabular text-[22px] leading-none text-accent">0</span>
      </div>
    </div>
  );
}

/* --------------------------------------------- the journey a request makes */

/* Labelled to match the four cards below the diagram on the page, so a
   reader is never wondering whether they are the same four things. */
const STATIONS = [
  ['device', 'Your Device', 'History stays here'],
  ['shield', 'Secure Proxy', 'Routes, never stores'],
  ['spark', 'Private Inference', 'No identity attached'],
  ['device', 'Straight Back to You', 'Nothing kept on the way'],
];

export function RequestJourney() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [at, setAt] = useState(0);
  const running = inView && !prefersReducedMotion();

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setAt((i) => (i + 1) % STATIONS.length), 1400);
    return () => clearInterval(tick);
  }, [running]);

  return (
    <div ref={ref} className="panel px-5 py-7 sm:px-7">
      <div className="ui-label mb-7 text-[color:var(--color-faint)]">One request, end to end</div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-0">
        {STATIONS.map(([glyph, label, note], i) => (
          <React.Fragment key={`${label}-${i}`}>
            <div className="flex flex-1 flex-col items-center gap-2.5 text-center">
              <GlyphTile name={glyph} active={running && at === i} />
              <span className="ui-label tabular text-[color:var(--color-faint)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-[13.5px] font-medium transition-colors duration-500"
                style={{ color: running && at === i ? 'var(--color-accent)' : 'var(--color-foreground)' }}
              >
                {label}
              </span>
              <span className="max-w-[18ch] text-[12px] leading-[1.5] text-[color:var(--color-graphite)]">{note}</span>
            </div>

            {i < STATIONS.length - 1 && (
              <span className="relative mt-[18px] hidden h-px flex-1 bg-[color:var(--rule-strong)] sm:block" aria-hidden="true">
                {running && (
                  <span
                    className="absolute top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-brand-accent"
                    style={{ animation: `travel-x 1.4s linear ${i * 1400}ms infinite` }}
                  />
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* the store the whole journey never writes to */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-3.5">
        <span className="flex items-center gap-2.5">
          <span className="text-[color:var(--color-faint)]">
            <PrivacyGlyph name="nostore" size={16} />
          </span>
          <span className="text-[13px] text-[color:var(--color-graphite)]">
            Written to our servers along the way
          </span>
        </span>
        <span className="ui-label text-accent">Nothing</span>
      </div>
    </div>
  );
}

/* ------------------------------------ the filter layer we do not add */
/* Both rows carry the same three stages, and the only difference is that
   ours has the middle one struck out. An earlier version dropped the chip
   from our row entirely, which drew a shorter chain rather than a removed
   filter — and struck it on THEIR row, which said the opposite of what was
   meant. Same stages, one crossed off, is the comparison. */

const STAGES = ['You', 'Platform filter', 'Model'];

function FilterRow({ title, accent = false, removesFilter = false }) {
  return (
    <div
      className="flex-1 rounded-[12px] border p-4"
      style={{
        borderColor: accent
          ? 'color-mix(in srgb, var(--color-brand-accent) 45%, transparent)'
          : 'var(--color-border)',
        background: accent
          ? 'color-mix(in srgb, var(--color-brand-accent) 5%, transparent)'
          : 'var(--color-card)',
      }}
    >
      <span className="ui-label" style={{ color: accent ? 'var(--color-accent)' : 'var(--color-faint)' }}>
        {title}
      </span>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {STAGES.map((stage, i) => {
          const gone = removesFilter && stage === 'Platform filter';
          return (
            <React.Fragment key={stage}>
              {i > 0 && (
                <span className="text-[11px] text-[color:var(--color-faint)]" aria-hidden="true">
                  &#8594;
                </span>
              )}
              <span
                className="rounded-full border px-2.5 py-1 text-[11.5px]"
                style={{
                  borderColor: gone ? 'var(--color-border)' : 'var(--rule-strong)',
                  background: gone ? 'transparent' : 'var(--color-tertiary)',
                  color: gone ? 'var(--color-faint)' : 'var(--color-graphite)',
                  textDecoration: gone ? 'line-through' : 'none',
                  textDecorationColor: gone ? 'var(--color-brand-accent)' : undefined,
                  textDecorationThickness: gone ? '1.5px' : undefined,
                }}
              >
                {stage}
              </span>
              {gone && <span className="ui-label text-[8.5px] text-accent">Not added</span>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function FilterCompare() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <FilterRow title="Most platforms" />
      <FilterRow title="OpenLedger" accent removesFilter />
    </div>
  );
}
