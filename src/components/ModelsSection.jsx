import React from 'react';
import { Section, SectionHead, Reveal, ProviderTile, ArrowLink } from './ui/Ledger';
import { MODELS, MODEL_TOTAL, PROVIDERS, KINDS, countByKind } from '../data/catalog';

/**
 * The model list, set as ruled type rather than a stack of cards. Six
 * rows are enough to make the point; the rest live behind the link.
 */
const SHOWN = MODELS.filter((m) => m.kind === 'text').slice(0, 6);
const KIND_COUNTS = KINDS.map((k) => ({ ...k, count: countByKind(k.id) })).filter((k) => k.count > 0);

export default function ModelsSection() {
  return (
    <Section id="models" index="02" label="Models" tint full>
      <SectionHead
        eyebrow="Models"
        title="Every model you already pay for."
        deck="Text, images, video, audio and music. Reason with one model, draft with another, and hand the routine work to the cheapest."
        meta={[
          { label: 'Models', value: `${MODEL_TOTAL}+` },
          { label: 'Providers', value: String(PROVIDERS.length) },
        ]}
      />

      <Reveal delay={40} className="mt-10 flex flex-wrap gap-2">
        {KIND_COUNTS.map((k) => (
          <span
            key={k.id}
            className="ui-label rounded-full border border-[color:var(--color-border)] px-3.5 py-1.5 text-[color:var(--color-graphite)]"
          >
            {k.label}
            <span className="ml-2 tabular text-[color:var(--color-faint)]">{k.count}</span>
          </span>
        ))}
      </Reveal>

      <div className="mt-8 border-t border-[color:var(--color-border)]">
        <Reveal>
          <div className="ui-label hidden grid-cols-[1.3fr_0.7fr_auto_1.5fr] items-center gap-6 border-b border-[color:var(--color-border)] py-3 text-[color:var(--color-faint)] md:grid">
            <span>Model</span>
            <span>Provider</span>
            <span className="text-right">Context</span>
            <span>Best for</span>
          </div>
        </Reveal>

          <ul>
            {SHOWN.map((m, i) => (
              <Reveal
                key={m.name}
                as="li"
                row
                delay={i * 55}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[color:var(--color-border)] py-3.5 md:grid-cols-[1.3fr_0.7fr_auto_1.5fr] md:gap-6"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <ProviderTile code={m.code} size={28} />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-foreground">{m.name}</span>
                    <span className="block truncate text-[13px] text-[color:var(--color-graphite)] md:hidden">
                      {m.bestFor}
                    </span>
                  </span>
                </span>
                <span className="hidden text-[14px] text-[color:var(--color-graphite)] md:block">{m.provider}</span>
                <span className="tabular text-right font-mono text-[13px] text-foreground">{m.detail}</span>
                <span className="hidden text-[14px] text-[color:var(--color-graphite)] md:block">{m.bestFor}</span>
              </Reveal>
            ))}
          </ul>

        <Reveal delay={SHOWN.length * 55} className="flex items-center justify-between gap-4 py-4">
          <span className="ui-label text-[color:var(--color-faint)]">
            {MODEL_TOTAL - SHOWN.length}+ more, added as they ship
          </span>
          <ArrowLink href="/models">See every model</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}
