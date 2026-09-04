import React from 'react';
import { Section, SectionHead, Reveal } from './ui/Ledger';

/* The checklist an IT or security team runs before they will approve a
   tool. Written so a reader who is not on that team can still tell what
   each line does, because they are usually the one forwarding the page. */
const SPEC = [
  ['Company sign in', 'Their existing work account'],
  ['Joiners and leavers', 'Access added and removed'],
  ['Data region', 'You pick the country'],
  ['Your own accounts', 'Contracts you already hold'],
  ['Who gets what', 'Models allowed per team'],
  ['Spend limits', 'Monthly caps and alerts'],
  ['Full audit log', 'Who used what, when'],
  ['Service contract', 'Uptime and response times'],
];

export default function EnterpriseSection() {
  return (
    <Section id="enterprise" index="08" label="Enterprise" full>
      <SectionHead
        eyebrow="Enterprise"
        title="Every model for the company. None of the company for them."
        deck="Teams reach for whichever AI tool is nearest, and your data goes with them."
        meta={[
          { label: 'Seats', value: 'Unlimited' },
          { label: 'Data region', value: 'Yours' },
        ]}
      />

      <Reveal className="mt-12 flex items-baseline justify-between gap-6">
        <h3 className="display-sm text-[18px] text-foreground">What your IT team controls</h3>
        <span className="ui-label text-[color:var(--color-faint)]">8 controls</span>
      </Reveal>

      <dl className="mt-5 grid gap-x-16 border-t border-[color:var(--color-border)] md:grid-cols-2">
        {SPEC.map(([term, detail], i) => (
          <Reveal
            key={term}
            row
            delay={i * 50}
            className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-border)] py-3.5"
          >
            <dt className="text-[15px] font-medium text-foreground">{term}</dt>
            <dd className="text-right text-[14px] text-[color:var(--color-graphite)]">{detail}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-3">
        <a href="#" className="btn btn-primary">
          Talk to us
        </a>
        <a href="#" className="btn btn-ghost">
          Security overview
        </a>
        <span className="ui-label ml-auto hidden text-[color:var(--color-faint)] lg:inline">
          Private inference available on request
        </span>
      </Reveal>
    </Section>
  );
}
