import React from 'react';
import { Section, SectionHead, Reveal } from './ui/Ledger';
import { PLANS, STACKED_PLANS, OUR_PRICE } from '../data/catalog';

/**
 * One argument, drawn once: the bar people already pay against the bar
 * they would pay. Plans sit underneath as three ruled columns.
 */
export default function PricingSection() {
  const stackTotal = STACKED_PLANS.reduce((sum, p) => sum + p.price, 0);
  const saving = stackTotal - OUR_PRICE;

  return (
    <Section id="pricing" index="05" label="Pricing" tint full>
      <SectionHead
        eyebrow="Pricing"
        title="You are already paying for this four times."
        deck="One app per model, each with its own memory and its own bill."
        meta={[{ label: 'You keep', value: `$${saving}` }]}
      />

      {/* --------------------------------------------------- the two bars */}
      <Reveal delay={70}>
        <div className="mt-10 space-y-6">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="ui-label text-[color:var(--color-faint)]">What the stack costs</span>
              <span className="display tabular text-[28px] leading-none text-foreground">${stackTotal}</span>
            </div>
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
              {STACKED_PLANS.map((p, i) => (
                <span
                  key={p.app}
                  className="h-full bg-[color:var(--color-graphite)]"
                  style={{ width: `${(p.price / stackTotal) * 100}%`, opacity: 0.55 - i * 0.08 }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {STACKED_PLANS.map((p, i) => (
                <Reveal as="li" row key={p.app} delay={140 + i * 55} className="text-[13px] text-[color:var(--color-graphite)]">
                  {p.app} <span className="tabular font-mono text-[color:var(--color-faint)]">${p.price}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="ui-label text-accent">What OpenLedger costs</span>
              <span className="display tabular text-[28px] leading-none text-accent">${OUR_PRICE}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--color-card)]">
              <div
                className="h-full rounded-full bg-brand-accent"
                style={{ width: `${(OUR_PRICE / stackTotal) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-[13px] text-[color:var(--color-graphite)]">
              The same models, one thread, one memory, and{' '}
              <span className="font-medium text-foreground">${saving} a month back.</span>
            </p>
          </div>
        </div>
      </Reveal>

      {/* ------------------------------------------------------- the plans */}
      <div className="mt-10 grid border-t border-[color:var(--color-border)] sm:grid-cols-3">
        {PLANS.map((plan, i) => (
          <Reveal
            key={plan.id}
            delay={i * 80}
            className="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-border)] py-5 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
          >
              <div>
                <div className="flex items-center gap-2">
                  <span className="ui-label text-foreground">{plan.name}</span>
                  {plan.primary && (
                    <span className="ui-label rounded-full bg-brand-accent px-2 py-[3px] text-[9px] text-white">
                      Most chosen
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="display text-[30px] text-foreground">{plan.price}</span>
                  <span className="text-[12px] text-[color:var(--color-faint)]">{plan.unit}</span>
                </div>
              </div>
            <p className="text-right text-[13px] text-[color:var(--color-graphite)] sm:mt-2 sm:text-left">
              {plan.line}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-7 flex flex-wrap items-center gap-3">
        <a href="#" className="btn btn-accent">
          Start free
        </a>
        <a href="#" className="btn btn-ghost">
          Compare plans
        </a>
        <span className="ui-label ml-auto hidden text-[color:var(--color-faint)] sm:inline">
          Billed monthly &middot; Cancel any time
        </span>
      </Reveal>
    </Section>
  );
}
