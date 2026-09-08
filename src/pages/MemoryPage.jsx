import React from 'react';
import MemoryChatDemo, { MODELS } from '../components/MemoryChatDemo';
import { Reveal, Rule, useInView } from '../components/ui/Ledger';
import { BrandTile } from '../components/ui/Glyphs';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { Link } from '../router';

/* =====================================================================
   /memory
   Unified Memory. The landing card claims context survives a model
   change; this page has to demonstrate it, so the middle of the page is
   a chat window that plays the conversation rather than a transcript
   printed as a table.

   Two details carry the argument:
   - inside each reply, the parts that came from memory are marked, so
     you can watch the budget and the diet resurface in a model that was
     never told them;
   - the memory panel beside the chat fills up on the first message and
     then lights up whenever a later model reads from it.

   Everything runs on one step counter. The conversation, the model
   switcher, and the panel are all views of the same number.
   ===================================================================== */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** A spec line, set the way the plates on the home page cards are. */
function SpecLine({ items, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      {items.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && (
            <span className="text-[9px] text-[color:var(--color-faint)]" aria-hidden="true">
              &#9670;
            </span>
          )}
          <span className="ui-label text-[color:var(--color-graphite)]">{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="ui-label mb-5 flex items-center gap-2 text-accent">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
      {children}
    </div>
  );
}

/* ------------------------------------------------ 03 what it remembers */
/* Four kinds of memory, each shown with the entries it would actually
   hold. The entries are listed as rows rather than floated as pills:
   pills wrapped to different depths in each card and left the cards
   ragged along the bottom, and rows read as a store rather than tags. */

const REMEMBERS = [
  {
    glyph: 'sliders',
    term: 'Preferences',
    detail: 'How you like things written, explained, recommended, or structured.',
    entries: ['Vegetarian', 'Concise answers', 'Avoid crowded places'],
  },
  {
    glyph: 'layers',
    term: 'Ongoing Context',
    detail: 'The projects, plans, research, and tasks you’re currently working on.',
    entries: ['Japan trip', 'October', '7 days'],
  },
  {
    glyph: 'note',
    term: 'Important Details',
    detail: 'Information that helps future responses understand what you’re trying to do.',
    entries: ['Budget: $2,000', 'Travelling solo'],
  },
  {
    glyph: 'check',
    term: 'Decisions',
    detail: 'Choices you’ve already made, so AI doesn’t keep taking you back to the beginning.',
    entries: ['Kyoto added', 'Hotel selected'],
  },
];

/** Small drawn glyphs. Kept local so the page owns its own icon set. */
function CatGlyph({ name }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 20 20" width={17} height={17} aria-hidden="true">
      {name === 'sliders' && (
        <>
          <path d="M3 6h14M3 14h14" {...s} />
          <circle cx="8" cy="6" r="2.1" {...s} />
          <circle cx="13" cy="14" r="2.1" {...s} />
        </>
      )}
      {name === 'layers' && (
        <>
          <path d="M10 2.6 17.4 6.5 10 10.4 2.6 6.5z" {...s} />
          <path d="M2.6 10.5 10 14.4l7.4-3.9" {...s} />
        </>
      )}
      {name === 'note' && (
        <>
          <rect x="4" y="2.8" width="12" height="14.4" rx="2.2" {...s} />
          <path d="M7.2 7h5.6M7.2 10.4h5.6M7.2 13.8h3.2" {...s} />
        </>
      )}
      {name === 'check' && (
        <>
          <circle cx="10" cy="10" r="7.4" {...s} />
          <path d="m6.6 10.2 2.3 2.3 4.5-4.7" {...s} />
        </>
      )}
    </svg>
  );
}

/* ---------------------------------------------------- 04 under the hood */
/* The headline makes a spatial claim — the memory stays with you, not the
   model — so the diagram is spatial too. The narrowing between the memory
   band and the band below it is the whole point: a model receives a
   filtered slice, never the store. */

const MECHANICS = [
  [
    'Remember',
    'Context worth keeping.',
    'Useful preferences, decisions, and ongoing context are identified from your conversations.',
  ],
  [
    'Unify',
    'One memory, independent of the model.',
    'Your context lives in a shared memory layer instead of being locked inside individual AI models.',
  ],
  [
    'Retrieve',
    'Only what’s relevant.',
    'When you ask something new, relevant context is retrieved instead of passing your entire conversation history to the model.',
  ],
  ['Control', 'You decide what stays.', 'Review, update, or remove memories and control what context is available to AI.'],
];

const STACK_MODELS = ['OA', 'AN', 'GG', 'DS'];
const STACK_FACTS = ['Preferences', 'Projects', 'Decisions', 'Context'];

/** A connector with a pulse running down it. */
function Drop({ running, delay = 0, height = 'h-5' }) {
  return (
    <span
      className={`relative mx-auto block ${height} w-px overflow-hidden bg-[color:var(--rule-strong)]`}
      aria-hidden="true"
    >
      {running && (
        <span
          className="absolute inset-0 bg-brand-accent"
          style={{ animation: `travel-y 2.2s ease-in-out ${delay}ms infinite` }}
        />
      )}
    </span>
  );
}

function MemoryStack() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const running = inView && !prefersReducedMotion();

  return (
    <div ref={ref} className="panel px-5 py-7 sm:px-8">
      <div className="ui-label mb-6 text-[color:var(--color-faint)]">Architecture</div>

      <div className="flex flex-col items-center">
        <span className="ui-label rounded-full border border-[color:var(--rule-strong)] bg-[color:var(--color-card)] px-4 py-2 text-foreground">
          You
        </span>
        <Drop running={running} />

        {/* everything you have told it */}
        <div
          className="w-full rounded-[13px] border px-4 py-4 sm:px-5"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-brand-accent) 48%, transparent)',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-brand-accent) 14%, transparent), color-mix(in srgb, var(--color-brand-accent) 4%, transparent))',
            boxShadow: '0 18px 40px -28px var(--color-brand-glow)',
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="ui-label text-accent">Your Unified Memory</span>
            <span className="ui-label tabular text-[color:var(--color-faint)]">Yours</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STACK_FACTS.map((f) => (
              <span
                key={f}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2.5 py-1 text-[11.5px] text-[color:var(--color-graphite)]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <Drop running={running} delay={200} />

        {/* only the slice the question needs. Narrower on purpose. */}
        <div className="w-full max-w-[62%] rounded-[11px] border border-dashed border-[color:var(--rule-strong)] bg-[color:var(--color-tertiary)] px-4 py-2.5 text-center">
          <span className="ui-label text-[color:var(--color-graphite)]">Relevant context</span>
        </div>

        {/* out to whichever model is answering */}
        <div className="relative w-full" aria-hidden="true">
          <Drop running={running} delay={400} height="h-4" />
          <span className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-[color:var(--rule-strong)]" />
          <div className="grid grid-cols-4">
            {STACK_MODELS.map((code, i) => (
              <Drop key={code} running={running} delay={520 + i * 120} height="h-4" />
            ))}
          </div>
        </div>

        <div className="grid w-full grid-cols-4">
          {STACK_MODELS.map((code) => (
            <span key={code} className="flex flex-col items-center gap-2">
              <BrandTile code={code} size={30} />
              <span className="ui-label text-[8.5px] text-[color:var(--color-faint)]">{MODELS[code].name}</span>
            </span>
          ))}
        </div>

        <p className="mt-7 text-center text-[13.5px] text-[color:var(--color-graphite)]">
          The model gets the context it needs.{' '}
          <span className="font-medium text-accent">Your memory stays yours.</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {/* ====================================================== 01 intro */}
        <section className="py-14 md:py-20">
          <Reveal>
            <Eyebrow>Unified Memory</Eyebrow>
            <h1 className="display max-w-[18ch] text-[clamp(2.2rem,5.2vw,3.8rem)] text-balance text-foreground">
              One memory across every model.
            </h1>
            <p className="mt-5 max-w-[60ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[17px]">
              Your preferences, projects, decisions, and context live in one private memory, independent of the model
              you choose. Switch models without starting over.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <SpecLine
              className="mt-8 border-t border-[color:var(--color-border)] pt-5"
              items={['User controlled', 'Cross-model', 'Private']}
            />
          </Reveal>
        </section>

        {/* ================================================= 02 in action */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>Same context. Different model.</Eyebrow>
              <h2 className="display max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                Switch models without repeating yourself.
              </h2>
            </Reveal>

            <Reveal delay={80} className="mt-9">
              <MemoryChatDemo />
            </Reveal>

            <Reveal delay={140} className="mt-6">
              <span className="text-[15px] font-medium text-accent">
                You only said it once. Every model had the context.
              </span>
            </Reveal>
          </div>
        </section>

        {/* ============================================ 03 what it remembers */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>More than chat history</Eyebrow>
              <h2 className="display max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                It remembers what matters.
              </h2>
              <p className="mt-4 max-w-[58ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
                Unified Memory builds a private understanding of the context you choose to carry across conversations
                and models.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {REMEMBERS.map((cat, i) => (
                <Reveal key={cat.term} delay={i * 70} className="flex">
                  <div className="panel flex w-full flex-col p-5 transition-colors duration-300 hover:border-[color:var(--rule-strong)]">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border text-accent"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--color-brand-accent) 32%, transparent)',
                        background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
                      }}
                    >
                      <CatGlyph name={cat.glyph} />
                    </span>

                    <h3 className="display-sm mt-4 text-[17px] text-foreground">{cat.term}</h3>

                    {/* A fixed measure, so every card's rule lands on the same
                        line and the entries below start together. */}
                    <p className="mt-2 min-h-[68px] text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">
                      {cat.detail}
                    </p>

                    <div className="mt-1 space-y-2 border-t border-[color:var(--color-border)] pt-4">
                      {cat.entries.map((entry) => (
                        <span key={entry} className="flex items-center gap-2.5 text-[12.5px] text-foreground">
                          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-brand-accent" aria-hidden="true" />
                          <span className="truncate">{entry}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140} className="mt-7">
              <span className="text-[15px] font-medium text-accent">Less repeating. More relevant responses.</span>
            </Reveal>
          </div>
        </section>

        {/* ============================================== 04 under the hood */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>How Unified Memory works</Eyebrow>
              <h2 className="display max-w-[24ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                Your memory stays with you, not the model.
              </h2>
              <p className="mt-4 max-w-[62ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
                Your context lives in one private memory layer, independent of any AI model. When you switch models,
                only the relevant context is made available so the conversation can continue without starting over.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10">
              <MemoryStack />
            </Reveal>

            {/* the four steps, as one connected run rather than loose boxes
                with arrows floating in the gaps between them */}
            <Reveal delay={140} className="mt-4">
              <div className="panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {MECHANICS.map(([term, line, detail], i) => (
                  <div
                    key={term}
                    className="relative border-b border-[color:var(--color-border)] p-5 last:border-b-0 sm:p-6 lg:border-b-0 lg:border-r lg:last:border-r-0"
                  >
                    <span className="ui-label tabular text-[color:var(--color-faint)]">
                      {String(i + 1).padStart(2, '0')} &middot; {term}
                    </span>
                    <h3 className="display-sm mt-3 text-[16px] text-foreground">{line}</h3>
                    <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{detail}</p>

                    {/* the hand-off, sitting on the rule it crosses */}
                    {i < MECHANICS.length - 1 && (
                      <span
                        className="absolute right-0 top-1/2 z-10 hidden h-[22px] w-[22px] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[11px] text-[color:var(--color-graphite)] lg:flex"
                        aria-hidden="true"
                      >
                        &#8594;
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={180} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
                Continue
              </a>
              <Link to="/models" className="btn btn-ghost px-7 py-3.5 text-[15px]">
                See every model
              </Link>
              <SpecLine className="ml-auto hidden lg:flex" items={['Remember', 'Unify', 'Retrieve', 'Control']} />
            </Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
