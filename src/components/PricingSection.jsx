import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHead, Reveal, Mark } from './ui/Ledger';
import { BrandTile } from './ui/Glyphs';
import { PLANS, STACKED_PLANS, OUR_PRICE, TOKEN_SAVING, MODELS } from '../data/catalog';

/* =====================================================================
   Pricing
   Two arguments, in the order people care about them. First the stack
   of subscriptions against the one that replaces it. Then the part that
   keeps costing less after you have switched: the router only spends
   what a request actually needs.
   ===================================================================== */

const SHOWN_TILES = ['OA', 'AN', 'GG', 'XA', 'DS', 'MT'];

const SEGMENT_STYLE = {
  faint: { background: 'var(--rule-strong)', opacity: 0.55 },
  mid: { background: 'color-mix(in srgb, var(--color-brand-accent) 45%, transparent)' },
  accent: { background: 'var(--color-brand-accent)' },
};

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

      {/* ------------------------------------------- the stack vs the one */}
      <div className="mt-12 grid items-stretch gap-3.5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.92fr)]">
        <Reveal className="flex">
          <div className="panel flex w-full flex-col p-5 sm:p-7">
            <div className="ui-label mb-5 text-[color:var(--color-faint)]">Separate subscriptions</div>

            <ul className="flex-1 space-y-1">
              {STACKED_PLANS.map((p) => (
                <li
                  key={p.app}
                  className="flex items-center gap-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-3 py-2.5"
                >
                  <BrandTile code={p.code} size={28} />
                  <span className="flex-1 truncate text-[14px] text-foreground">{p.app}</span>
                  <span className="tabular font-mono text-[13px] text-[color:var(--color-graphite)]">${p.price}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-baseline justify-between border-t border-[color:var(--color-border)] pt-4">
              <span className="ui-label text-[color:var(--color-faint)]">Total every month</span>
              <span className="display tabular text-[30px] leading-none text-[color:var(--color-graphite)] line-through decoration-[color:var(--rule-strong)] decoration-2">
                ${stackTotal}
              </span>
            </div>
          </div>
        </Reveal>

        {/* the swap */}
        <Reveal delay={80} className="flex items-center justify-center">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-accent shadow-[0_8px_18px_-10px_rgba(0,0,0,.4)]"
            aria-hidden="true"
          >
            <ArrowRight size={17} className="rotate-90 lg:rotate-0" />
          </span>
        </Reveal>

        <Reveal delay={140} className="flex">
          <div
            className="panel reg-marks flex w-full flex-col p-5 sm:p-7"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-brand-accent) 45%, transparent)',
              background:
                'radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--color-brand-accent) 10%, transparent) 0%, transparent 62%), var(--color-card)',
              boxShadow: '0 30px 70px -50px var(--color-brand-glow)',
            }}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="ui-label text-accent">One subscription</span>
              <span className="ui-label rounded-full bg-brand-accent px-2.5 py-1 text-[9px] text-white">
                Best value
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mark size={20} className="text-accent" />
              <span className="display-sm text-[19px] text-foreground">OpenLedger Pro</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="display tabular text-[54px] leading-none text-accent">${OUR_PRICE}</span>
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

            <p className="mt-5 flex-1 text-[14px] leading-[1.6] text-[color:var(--color-graphite)]">
              Every model, one thread, one memory, and{' '}
              <span className="font-medium text-foreground">${saving} a month back.</span>
            </p>

            <a href="#" className="btn btn-accent mt-6 w-full">
              Start free
            </a>
          </div>
        </Reveal>
      </div>

      {/* ---------------------------------------------- token optimisation */}
      <Reveal delay={80}>
        <div className="panel mt-3.5 p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="ui-label mb-2.5 text-accent">Token optimisation</div>
              <h3 className="display-sm max-w-[26ch] text-[20px] text-foreground sm:text-[23px]">
                Then it keeps costing less every month after that.
              </h3>
              <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.6] text-[color:var(--color-graphite)]">
                Most requests do not need the most expensive model, and most context does not need sending twice. The
                router works that out per request, so you are billed for the tokens that did the work.
              </p>
            </div>

            <div className="text-right">
              <div className="display tabular text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-accent">
                {TOKEN_SAVING.headline}
              </div>
              <div className="ui-label mt-2 max-w-[22ch] text-[color:var(--color-faint)]">{TOKEN_SAVING.note}</div>
            </div>
          </div>

          {/* what happens to a request's tokens */}
          <div className="mt-7">
            <div className="ui-label mb-2.5 flex items-center justify-between text-[color:var(--color-faint)]">
              <span>Tokens in a typical request</span>
              <span>What you are billed for</span>
            </div>

            <div className="flex h-3.5 w-full gap-[3px] overflow-hidden rounded-full">
              {TOKEN_SAVING.segments.map((seg) => (
                <span
                  key={seg.label}
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${seg.pct}%`, ...SEGMENT_STYLE[seg.tone] }}
                />
              ))}
            </div>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
              {TOKEN_SAVING.segments.map((seg) => (
                <li key={seg.label} className="flex items-center gap-2 text-[12.5px] text-[color:var(--color-graphite)]">
                  <span className="h-2 w-2 rounded-full" style={SEGMENT_STYLE[seg.tone]} />
                  {seg.label}
                  <span className="tabular font-mono text-[color:var(--color-faint)]">{seg.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* the three levers */}
          <dl className="mt-7 grid gap-x-12 border-t border-[color:var(--color-border)] md:grid-cols-3">
            {TOKEN_SAVING.levers.map(([term, detail], i) => (
              <Reveal
                key={term}
                row
                delay={i * 60}
                className="border-b border-[color:var(--color-border)] py-4 md:border-b-0"
              >
                <dt className="text-[14px] font-medium text-foreground">{term}</dt>
                <dd className="mt-1 max-w-[34ch] text-[13px] leading-[1.55] text-[color:var(--color-graphite)]">
                  {detail}
                </dd>
              </Reveal>
            ))}
          </dl>
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
