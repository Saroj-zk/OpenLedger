import React from 'react';
import { Reveal, Rule } from '../components/ui/Ledger';
import { FormatTile } from '../components/ui/Glyphs';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { CAPABILITIES } from '../data/capabilities';
import { MODELS, countByKind } from '../data/catalog';
import { Link } from '../router';

/* =====================================================================
   /capabilities
   What you can make, kind by kind. The catalog page lists models by
   name; this one starts from the job and names the models second.
   ===================================================================== */

function modelsFor(kind) {
  const list = MODELS.filter((m) => m.kind === kind);
  return kind === 'audio' ? [...list, ...MODELS.filter((m) => m.kind === 'music')] : list;
}

function countFor(kind) {
  return kind === 'audio' ? countByKind('audio') + countByKind('music') : countByKind(kind);
}

export default function CapabilitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {/* --------------------------------------------------------- intro */}
        <section className="py-14 md:py-20">
          <Reveal>
            <div className="ui-label mb-5 flex items-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              What you can do
            </div>
            <h1 className="display max-w-[18ch] text-[clamp(2.2rem,5.2vw,3.8rem)] text-balance text-foreground">
              Uncensored chat, images, video and more.
            </h1>
            <p className="mt-5 max-w-[58ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[17px]">
              Text, image, video, audio, code and search in one place, all private or anonymous. One subscription, one
              thread, one memory across every one of them.
            </p>
          </Reveal>

          <Reveal delay={90} className="mt-8 flex flex-wrap gap-2.5">
            {CAPABILITIES.map((c) => (
              <a
                key={c.kind}
                href={`#${c.kind}`}
                className="ui-label flex items-center gap-2 rounded-full border border-[color:var(--color-border)] py-1.5 pl-1.5 pr-3.5 text-[color:var(--color-graphite)] transition-colors hover:border-[color:var(--rule-strong)] hover:text-foreground"
              >
                <FormatTile kind={c.kind} size={22} />
                {c.label}
                <span className="tabular text-[color:var(--color-faint)]">{countFor(c.kind)}</span>
              </a>
            ))}
          </Reveal>
        </section>

        {/* ---------------------------------------------------------- kinds */}
        {CAPABILITIES.map((c, i) => (
          <section key={c.kind} id={c.kind} className="scroll-mt-24">
            <Rule />
            <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 md:py-16">
              {/* what it is */}
              <Reveal>
                <FormatTile kind={c.kind} size={56} />
                <div className="mt-5 flex items-baseline gap-3">
                  <h2 className="display text-[clamp(1.8rem,3.2vw,2.4rem)] text-foreground">{c.label}</h2>
                  <span className="ui-label tabular text-[color:var(--color-faint)]">
                    {countFor(c.kind)} models
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-medium text-accent">{c.line}</p>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-[color:var(--color-graphite)]">
                  {c.body}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {modelsFor(c.kind).map((m) => (
                    <span
                      key={m.name}
                      className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2.5 py-1 font-mono text-[11px] text-[color:var(--color-graphite)]"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* what you do with it */}
              <Reveal delay={90}>
                <div className="ui-label mb-1 flex items-center justify-between border-b border-[color:var(--color-border)] pb-3 text-[color:var(--color-faint)]">
                  <span>What people use it for</span>
                  <span className="tabular">{c.uses.length}</span>
                </div>
                <dl>
                  {c.uses.map(([term, detail], j) => (
                    <Reveal
                      key={term}
                      row
                      delay={j * 55}
                      className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-border)] py-3.5"
                    >
                      <dt className="text-[15px] font-medium text-foreground">{term}</dt>
                      <dd className="max-w-[34ch] text-right text-[14px] text-[color:var(--color-graphite)]">
                        {detail}
                      </dd>
                    </Reveal>
                  ))}
                </dl>
              </Reveal>
            </div>

            {i === CAPABILITIES.length - 1 && <Rule />}
          </section>
        ))}

        {/* ------------------------------------------------------- closing */}
        <section className="py-14 md:py-20">
          <Reveal className="flex flex-wrap items-center gap-3">
            <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
              Start a chat
            </a>
            <Link to="/models" className="btn btn-ghost px-7 py-3.5 text-[15px]">
              See the model list
            </Link>
            <span className="ui-label ml-auto hidden text-[color:var(--color-faint)] lg:inline">
              Nothing stored, on any of them
            </span>
          </Reveal>
        </section>
      </div>

      <Footer />
    </div>
  );
}
