import React from 'react';
import { Section, Reveal, ArrowLink } from './ui/Ledger';

/* The retention ledger. Every privacy claim on this page has to survive
   being written down as a row, so it is written down as a row. */
const LEDGER = [
  ['Prompts and responses', 'Never stored'],
  ['Uploaded files', 'Dropped on close'],
  ['Saved memory', 'Until you delete it'],
  ['Account email', 'Until you close it'],
  ['Card details', 'We never see them'],
  ['Training data', 'Never, by anyone'],
];

export default function PrivacySection() {
  return (
    <Section id="privacy" index="04" label="Privacy" full>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="ui-label mb-5 flex items-center gap-2 text-accent">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
            Privacy
          </div>
          <h2 className="display text-[clamp(2rem,4.4vw,3.2rem)] text-balance text-foreground">
            Private by design. Unfiltered by default.
          </h2>
          <p className="mt-4 max-w-[44ch] text-balance text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
            Most AI privacy pages are adjectives. This one is a list. If a line is not on it, we do not hold it, and we
            add no filter of our own.
          </p>

          <div className="mt-8 flex items-center gap-8">
            <div>
              <div className="display text-[40px] leading-none text-accent">0</div>
              <div className="ui-label mt-2 text-[color:var(--color-faint)]">Prompts stored</div>
            </div>
            <div className="h-12 w-px bg-[color:var(--color-border)]" />
            <div>
              <div className="display text-[40px] leading-none text-foreground">0</div>
              <div className="ui-label mt-2 text-[color:var(--color-faint)]">Filters we add</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="ui-label flex items-center justify-between border-b border-[color:var(--color-border)] pb-3 text-[color:var(--color-faint)]">
            <span>What we hold</span>
            <span>How long</span>
          </div>
          <dl>
            {LEDGER.map(([item, life], i) => (
              <Reveal
                key={item}
                row
                delay={140 + i * 55}
                className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-border)] py-3.5"
              >
                <dt className="text-[15px] font-medium text-foreground">{item}</dt>
                <dd className="whitespace-nowrap text-[14px] text-[color:var(--color-graphite)]">{life}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="flex items-center justify-between gap-4 pt-4">
            <span className="ui-label text-[color:var(--color-faint)]">No logs, no corpus, no resale</span>
            <ArrowLink href="#">Data policy</ArrowLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
