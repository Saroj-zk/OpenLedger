import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Section, SectionHead, Reveal, Mark } from './ui/Ledger';
import { BrandTile } from './ui/Glyphs';
import { PLANS, STACKED_PLANS, OUR_PRICE, TOKEN_SAVING, MODELS } from '../data/catalog';

/* =====================================================================
   Pricing
   Two arguments. The pile of subscriptions against the one card that
   replaces it, and then the part that keeps saving after the switch:
   the router only spends what a request actually needs.
   ===================================================================== */

const SHOWN_TILES = ['OA', 'AN', 'GG', 'XA', 'DS', 'MT'];
const TILT = [-2.4, 1.8, 1.5, -2];

export default function PricingSection() {
  const stackTotal = STACKED_PLANS.reduce((sum, p) => sum + p.price, 0);
  const saving = stackTotal - OUR_PRICE;

  return (
    <Section id="pricing" index="06" label="Pricing" tint>
      <SectionHead
        eyebrow="Pricing"
        title="You are already paying for this four times."
        deck="One app per model, each with its own memory and its own bill."
        meta={[{ label: 'You keep', value: `$${saving}` }]}
      />

      {/* ------------------------------------------- the pile vs the one */}
      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.85fr)]">
        {/* what people pay today, scattered the way it feels */}
        <Reveal className="flex">
          <div className="flex w-full flex-col">
            <div className="ui-label mb-5 text-[color:var(--color-faint)]">Separate subscriptions</div>

            <div className="grid flex-1 grid-cols-2 gap-3">
              {STACKED_PLANS.map((p, i) => (
                <div
                  key={p.app}
                  className="tilt-card rounded-[13px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4"
                  style={{
                    transform: `rotate(${TILT[i]}deg)`,
                    boxShadow: '0 14px 28px -18px rgba(16,13,10,.5), 0 1px 2px rgba(16,13,10,.06)',
                  }}
                >
                  <BrandTile code={p.code} size={32} />
                  <div className="mt-3 truncate text-[13px] text-[color:var(--color-graphite)]">{p.app}</div>
                  <div className="display tabular mt-0.5 text-[24px] leading-none text-foreground">${p.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-[color:var(--color-border)] pt-4">
              <span className="ui-label text-[color:var(--color-faint)]">Every month</span>
              <span className="display tabular text-[34px] leading-none text-[color:var(--color-graphite)] line-through decoration-[color:var(--color-brand-accent)] decoration-[3px]">
                ${stackTotal}
              </span>
            </div>
          </div>
        </Reveal>

        {/* the swap */}
        <Reveal delay={80} className="flex items-center justify-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-white shadow-[0_14px_28px_-12px_var(--color-brand-glow)]"
            aria-hidden="true"
          >
            <ArrowRight size={18} className="rotate-90 lg:rotate-0" />
          </span>
        </Reveal>

        {/* the one that replaces it */}
        <Reveal delay={140} className="flex">
          <div
            className="panel reg-marks flex w-full flex-col overflow-hidden p-5 sm:p-7"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-brand-accent) 50%, transparent)',
              background:
                'radial-gradient(130% 100% at 50% 0%, color-mix(in srgb, var(--color-brand-accent) 13%, transparent) 0%, transparent 64%), var(--color-card)',
              boxShadow: '0 40px 80px -56px var(--color-brand-glow), 0 2px 6px rgba(16,13,10,.05)',
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <Mark size={19} className="text-accent" />
                <span className="display-sm text-[17px] text-foreground">OpenLedger Pro</span>
              </span>
              <span className="ui-label rounded-full bg-brand-accent px-2.5 py-1 text-[9px] text-white">
                Best value
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="display tabular text-[62px] leading-[0.9] text-accent">${OUR_PRICE}</span>
              <span className="text-[13px] text-[color:var(--color-faint)]">per month</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              {SHOWN_TILES.map((code) => (
                <BrandTile key={code} code={code} size={28} />
              ))}
              <span className="ui-label rounded-full border border-[color:var(--color-border)] px-2.5 py-1.5 text-[color:var(--color-graphite)]">
                +{MODELS.length - SHOWN_TILES.length}
              </span>
            </div>

            <ul className="mt-6 flex-1 space-y-2">
              {['Every model, one thread', 'One memory across all of them', `$${saving} a month back`].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[14px] text-[color:var(--color-graphite)]">
                  <Check size={15} className="mt-[3px] shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>

            <a href="#" className="btn btn-accent mt-7 w-full">
              Start free
            </a>
          </div>
        </Reveal>
      </div>

      {/* ---------------------------------------------- token optimisation */}
      <Reveal delay={80}>
        <div className="panel mt-4 grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          <div>
            <div className="ui-label mb-3 text-accent">Token optimisation</div>
            <h3 className="display-sm text-[21px] text-foreground sm:text-[24px]">And it keeps getting cheaper.</h3>
            <p className="mt-2.5 max-w-[42ch] text-[14px] leading-[1.6] text-[color:var(--color-graphite)]">
              The router spends what a request needs, not what the biggest model charges.
            </p>
          </div>

          <div>
            <div className="flex items-end justify-between gap-6">
              <div className="ui-label text-[color:var(--color-faint)]">Tokens in a typical request</div>
              <div className="text-right">
                <span className="display tabular text-[30px] leading-none text-accent">{TOKEN_SAVING.headline}</span>
                <span className="ui-label ml-2 text-[color:var(--color-faint)]">{TOKEN_SAVING.note}</span>
              </div>
            </div>

            <div className="mt-3 flex h-8 w-full gap-1 overflow-hidden rounded-[8px]">
              <span
                className="flex h-full items-center justify-center rounded-[6px] text-[11px] font-semibold text-[color:var(--color-graphite)]"
                style={{ width: `${100 - TOKEN_SAVING.billedPct}%`, background: 'var(--rule-strong)' }}
              >
                Saved
              </span>
              <span
                className="flex h-full items-center justify-center rounded-[6px] bg-brand-accent text-[11px] font-semibold text-white"
                style={{ width: `${TOKEN_SAVING.billedPct}%` }}
              >
                Billed
              </span>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {TOKEN_SAVING.levers.map((lever) => (
                <span
                  key={lever}
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-3 py-1.5 text-[12px] text-[color:var(--color-graphite)]"
                >
                  {lever}
                </span>
              ))}
            </div>
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
