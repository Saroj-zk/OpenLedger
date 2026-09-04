import React from 'react';
import { Wordmark, Reveal, StatusDot, Rule } from './ui/Ledger';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Chat', 'Models', 'Council Mode', 'iOS app', 'Android app', 'Pricing'],
  },
  {
    title: 'Developers',
    links: ['API reference', 'Quickstart', 'Model IDs', 'Status'],
  },
  {
    title: 'Company',
    links: ['About', '$OPEN token', 'Blog', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Data policy', 'Terms', 'Privacy notice'],
  },
];

const SOCIAL = ['X', 'Discord', 'GitHub', 'Bluesky'];

export default function Footer() {
  return (
    <footer className="ledger-dark relative bg-background text-foreground">
      {/* ------------------------------------------------- closing entry */}
      <div className="relative overflow-hidden">
        <div className="ledger-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 py-20 text-center sm:px-8 md:py-28">
          <Reveal>
            <div className="ui-label mb-6 flex items-center justify-center gap-2 text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
              Start
            </div>
            <h2 className="display mx-auto max-w-[18ch] text-[clamp(2.4rem,6vw,4.6rem)] text-balance">
              Models change every few weeks.
            </h2>
            <p
              className="mt-5 text-[clamp(1.3rem,3vw,2rem)] italic text-[color:var(--color-graphite)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Your interface shouldn&rsquo;t.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
                Start a chat
              </a>
              <a href="#api" className="btn btn-ghost px-7 py-3.5 text-[15px]">
                Get an API key
              </a>
            </div>

            <p className="ui-label mt-6 text-[color:var(--color-faint)]">
              Free to start &middot; No card &middot; Nothing retained
            </p>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------ directory */}
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <Rule />
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <Reveal className="lg:col-span-2">
            <Wordmark />
            <p className="mt-4 max-w-[30ch] text-[14px] leading-[1.6] text-[color:var(--color-graphite)]">
              One private layer for every model. Chat anywhere, keep your memory, leave no trace.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="ui-label rounded-full border border-[color:var(--color-border)] px-3 py-1.5 text-[color:var(--color-graphite)] transition-colors hover:border-brand-accent hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
          </Reveal>

          {COLUMNS.map((col, i) => (
            <Reveal as="nav" key={col.title} delay={80 + i * 60} aria-label={col.title}>
              <h3 className="ui-label mb-5 text-[color:var(--color-faint)]">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[14px] text-[color:var(--color-graphite)] transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Rule />
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <span className="ui-label text-[color:var(--color-faint)]">
            &copy; {new Date().getFullYear()} OpenLedger
          </span>
          <span className="ui-label flex items-center gap-2 text-[color:var(--color-graphite)]">
            <StatusDot tone="live" />
            All systems routing
          </span>
        </div>
      </div>
    </footer>
  );
}
