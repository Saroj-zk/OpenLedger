import React from 'react';
import { Section, SectionHead, Reveal } from './ui/Ledger';

const SPEC = [
  ['Company-wide AI access', 'Give every team access from one managed workspace.'],
  ['Private company data', 'Your prompts and company data are not used to train models.'],
  ['Model access controls', 'Choose which AI models each team can use.'],
  ['Central user management', 'Add, remove, and manage employee access from one place.'],
  ['Unified company memory', 'Keep approved company context available across models and teams.'],
  ['Usage & spend controls', 'Set limits and keep track of AI usage across the organization.'],
  ['Audit & visibility', 'See how AI is being used across your company.'],
  ['Enterprise API', 'Connect your internal tools and agents through one API.'],
];

export default function EnterpriseSection() {
  return (
    <Section id="enterprise" index="08" label="Enterprise" full>
      <SectionHead
        eyebrow="Enterprise"
        title="Give your team AI. Keep your data private."
        deck="One secure workspace for your company to access leading AI models, with the privacy and controls IT teams need."
      />

      <Reveal className="mt-12 flex items-baseline justify-between gap-6">
        <h3 className="display-sm text-[18px] text-foreground">One place for every team.</h3>
        <span className="ui-label text-[color:var(--color-faint)]">Enterprise Controls</span>
      </Reveal>

      <dl className="mt-5 grid gap-x-16 border-t border-[color:var(--color-border)] md:grid-cols-2">
        {SPEC.map(([term, detail], i) => (
          <Reveal
            key={term}
            row
            delay={i * 50}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 border-b border-[color:var(--color-border)] py-3.5"
          >
            <dt className="text-[15px] font-medium text-foreground shrink-0">{term}</dt>
            <dd className="text-left sm:text-right text-[14px] text-[color:var(--color-graphite)]">{detail}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-3">
        <a href="#" className="btn btn-primary">
          Talk to Sales
        </a>
        <a href="#" className="btn btn-ghost">
          Enterprise Security
        </a>
      </Reveal>
    </Section>
  );
}
