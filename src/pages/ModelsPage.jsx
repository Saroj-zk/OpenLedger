import React from 'react';
import { Reveal, Rule, ProviderTile } from '../components/ui/Ledger';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { MODELS, KINDS, PROVIDERS, MODEL_TOTAL } from '../data/catalog';

/* =====================================================================
   /models
   The whole list, grouped by what each model produces, with a sentence
   on each saying when you would actually reach for it.
   ===================================================================== */

function GroupHeading({ kind, count }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-[color:var(--rule-strong)] pb-3">
      <h2 className="display-sm text-[22px] text-foreground sm:text-[26px]">{kind.label}</h2>
      <span className="ui-label text-[color:var(--color-faint)]">
        {count} {count === 1 ? 'model' : 'models'}
      </span>
    </div>
  );
}

function ModelRow({ model, delay }) {
  return (
    <Reveal
      row
      delay={delay}
      className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-[color:var(--color-border)] py-5 sm:gap-5"
    >
      <ProviderTile code={model.code} size={34} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[16px] font-medium text-foreground">{model.name}</h3>
          <span className="text-[13px] text-[color:var(--color-graphite)]">{model.provider}</span>
          <span className="tabular ml-auto shrink-0 font-mono text-[12px] text-[color:var(--color-faint)]">
            {model.detail}
          </span>
        </div>
        <p className="mt-1.5 max-w-[80ch] text-[14px] leading-[1.6] text-[color:var(--color-graphite)]">
          {model.description}
        </p>
      </div>
    </Reveal>
  );
}

export default function ModelsPage() {
  const groups = KINDS.map((kind) => ({
    kind,
    models: MODELS.filter((m) => m.kind === kind.id),
  })).filter((g) => g.models.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* --------------------------------------------------------- intro */}
      <section className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-8 py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 md:py-20">
          <Reveal>
            <div className="ui-label mb-5 flex items-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              The model list
            </div>
            <h1 className="display text-[clamp(2.2rem,5vw,3.6rem)] text-balance text-foreground">
              Every model, one subscription.
            </h1>
            <p className="mt-4 max-w-[60ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
              Text, images, video, audio and music, from every provider worth routing to. Pick one by name, or send
              auto and let the router choose per request.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <dl className="flex gap-8 lg:flex-col lg:gap-4 lg:border-l lg:border-[color:var(--color-border)] lg:pl-8">
              <div>
                <dt className="ui-label text-[color:var(--color-faint)]">Models</dt>
                <dd className="tabular mt-1 display-sm text-[26px] leading-none text-foreground">{MODEL_TOTAL}+</dd>
              </div>
              <div>
                <dt className="ui-label text-[color:var(--color-faint)]">Providers</dt>
                <dd className="tabular mt-1 display-sm text-[26px] leading-none text-foreground">
                  {PROVIDERS.length}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Rule />

        {/* --------------------------------------------------- jump links */}
        <nav aria-label="Jump to a kind" className="flex flex-wrap gap-2 py-5">
          {groups.map((g) => (
            <a
              key={g.kind.id}
              href={`#${g.kind.id}`}
              className="ui-label rounded-full border border-[color:var(--color-border)] px-3.5 py-1.5 text-[color:var(--color-graphite)] transition-colors hover:border-[color:var(--rule-strong)] hover:text-foreground"
            >
              {g.kind.label}
              <span className="ml-2 text-[color:var(--color-faint)]">{g.models.length}</span>
            </a>
          ))}
        </nav>

        {/* ------------------------------------------------------- groups */}
        <div className="pb-20">
          {groups.map((g) => (
            <section key={g.kind.id} id={g.kind.id} className="scroll-mt-24 pt-12 first:pt-4">
              <GroupHeading kind={g.kind} count={g.models.length} />
              <div>
                {g.models.map((m, i) => (
                  <ModelRow key={m.name} model={m} delay={i * 45} />
                ))}
              </div>
            </section>
          ))}

          <p className="pt-10 text-[14px] text-[color:var(--color-faint)]">
            New models are added as providers ship them. Anything you have already built keeps working.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
