import React from 'react';
import { Reveal, Rule } from '../components/ui/Ledger';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { TOKEN, STATS, FLOW, PRINCIPLES, UTILITY } from '../data/token';

/* =====================================================================
   /token
   What the token is for, where the money comes from, and what stops it
   being diluted. The value loop is the argument, so it gets the page's
   largest element.
   ===================================================================== */

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {/* --------------------------------------------------------- intro */}
        <section className="py-14 md:py-20">
          <Reveal>
            <div className="ui-label mb-5 flex items-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Tokenomics
            </div>
            <h1 className="display max-w-[20ch] text-[clamp(2.2rem,5.2vw,3.8rem)] text-balance text-foreground">
              {TOKEN.symbol} is rewarded for real usage, not printed out of thin air.
            </h1>
            <p className="mt-5 max-w-[62ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[17px]">
              Usage funds the loop. A share of every credit spent buys {TOKEN.symbol} on the open market, rewards
              the providers who served the work, and burns what is left over.
            </p>
          </Reveal>
        </section>

        <Rule />

        {/* --------------------------------------------------------- stats */}
        <section className="grid grid-cols-1 gap-x-10 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <div className="display text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-accent">{stat.value}</div>
              <p className="mt-3 max-w-[26ch] text-[13px] leading-[1.55] text-[color:var(--color-graphite)]">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </section>

        <Rule />

        {/* ---------------------------------------------------- value loop */}
        <section className="py-14 md:py-20">
          <Reveal className="flex items-baseline justify-between gap-6">
            <h2 className="display-sm text-[22px] text-foreground sm:text-[26px]">How value flows</h2>
            <span className="ui-label text-[color:var(--color-faint)]">4 steps</span>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((item, i) => (
              <Reveal key={item.step} delay={i * 90} className="relative flex">
                {/* connector into the next step */}
                {i < FLOW.length - 1 && (
                  <span
                    className="pointer-events-none absolute -right-3.5 top-1/2 hidden h-px w-3.5 bg-[color:var(--color-border)] lg:block"
                    aria-hidden="true"
                  />
                )}

                <article
                  className={`panel flex w-full flex-col p-5 sm:p-6 ${
                    item.highlight ? 'border-brand-accent/45 bg-brand-accent/[0.06]' : ''
                  }`}
                >
                  <span className="ui-label text-[color:var(--color-faint)]">[{item.step}]</span>
                  <h3 className="display-sm mt-4 text-[17px] text-foreground">{item.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-6 text-[13px] text-[color:var(--color-faint)]">
              The buy, reward and burn loop.{' '}
              <span className="font-medium text-accent">Live from day one of the token</span>, not a phase two promise.
            </p>
          </Reveal>
        </section>

        <Rule />

        {/* ------------------------------------------------------- utility */}
        <section className="py-14 md:py-20">
          <Reveal className="flex items-baseline justify-between gap-6">
            <h2 className="display-sm text-[22px] text-foreground sm:text-[26px]">What {TOKEN.symbol} does</h2>
            <span className="ui-label text-[color:var(--color-faint)]">4 uses</span>
          </Reveal>

          <dl className="mt-6 grid gap-x-16 border-t border-[color:var(--color-border)] md:grid-cols-2">
            {UTILITY.map(([term, detail], i) => (
              <Reveal
                key={term}
                row
                delay={i * 55}
                className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-border)] py-3.5"
              >
                <dt className="text-[15px] font-medium text-foreground">{term}</dt>
                <dd className="text-right text-[14px] text-[color:var(--color-graphite)]">{detail}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <Rule />

        {/* ---------------------------------------------------- principles */}
        <section className="py-14 md:py-20">
          <Reveal className="flex items-baseline justify-between gap-6">
            <h2 className="display-sm text-[22px] text-foreground sm:text-[26px]">The rules we hold ourselves to</h2>
            <span className="ui-label text-[color:var(--color-faint)]">4 commitments</span>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.tag} delay={i * 80} className="flex">
                <article className="panel flex w-full flex-col p-5 sm:p-6">
                  <span className="ui-label w-fit rounded-full border border-brand-accent/35 px-2.5 py-1 text-accent">
                    {p.tag}
                  </span>
                  <p className="mt-4 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <Rule />

        {/* ------------------------------------------------------- closing */}
        <section className="py-14 md:py-20">
          <Reveal className="flex flex-wrap items-center gap-3">
            <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
              Read the tokenomics paper
            </a>
            <a href="#" className="btn btn-ghost px-7 py-3.5 text-[15px]">
              Contract and audits
            </a>
            <span className="ui-label ml-auto hidden text-[color:var(--color-faint)] lg:inline">
              Figures published before launch
            </span>
          </Reveal>

          <p className="mt-6 max-w-[70ch] text-[12px] leading-[1.6] text-[color:var(--color-faint)]">
            {TOKEN.symbol} is a utility token for paying for and operating the network. Nothing on this page is
            investment advice, an offer, or a promise of future value.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
