import React from 'react';
import { MODELS } from '../data/catalog';

/**
 * The tape under the hero. It answers the first question the hero
 * raises, "ask anything of what?", by running the whole model list past
 * you. Duplicated once so the loop has no seam.
 */
export default function RoutingStrip() {
  const tape = [...MODELS, ...MODELS];

  return (
    <section aria-label="Models available now" className="relative bg-background">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="rule-line" />
      </div>

      <div className="marquee-host relative overflow-hidden py-4">
        <div className="marquee-track flex w-max items-center gap-9" style={{ '--marquee-duration': '72s' }}>
          {tape.map((m, i) => (
            <span
              key={`${m.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5"
              aria-hidden={i >= MODELS.length}
            >
              <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-[color:var(--color-faint)]">
                {m.code}
              </span>
              <span className="text-[13px] font-medium text-foreground">{m.name}</span>
              <span className="tabular font-mono text-[11px] text-[color:var(--color-faint)]">{m.detail}</span>
              <span className="text-[8px] text-brand-accent" aria-hidden="true">
                &#9670;
              </span>
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="rule-line" />
      </div>
    </section>
  );
}
