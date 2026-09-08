import React from 'react';
import { Reveal, Rule } from '../components/ui/Ledger';
import { GlyphTile, PrivacyPanel, RequestJourney, FilterCompare } from '../components/PrivacyVisuals';
import PageHeader from '../components/PageHeader';
import Footer from '../components/Footer';
import { Link } from '../router';

/* =====================================================================
   /private
   The Private AI page. The landing card makes the claim in one line;
   this is where it gets shown its working — what is kept, what is not,
   and the path a request actually takes to get answered.

   The journey diagram in section 03 is the argument. Everything else on
   the page is a promise, and a promise is only worth what the mechanism
   behind it can support.
   ===================================================================== */

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

/* ------------------------------------------------------- 02 privacy */

const PILLARS = [
  ['device', 'Local-Only History', 'Your conversation history stays on your device, where you control it.'],
  ['nostore', 'Zero Retention', 'Prompts and responses aren’t stored on our servers after processing.'],
  ['notrain', 'No Training', 'Your conversations aren’t collected or used to train AI models.'],
  ['noprofile', 'No Profiling', 'What you ask isn’t used to build an advertising or behavioral profile.'],
];

/* ------------------------------------------------------ 03 the path */

const STEPS = [
  [
    'Your Device',
    'Your conversation starts and remains on your device, with chat history stored locally.',
  ],
  [
    'Secure Proxy',
    'When you send a prompt, it travels through an encrypted connection to a secure proxy that routes the request without storing it.',
  ],
  [
    'Private Inference',
    'The request is sent to the selected AI model for processing without exposing your complete conversation history or identity to the compute provider.',
  ],
  [
    'Straight Back to You',
    'The generated response is streamed back through the secure proxy to your device without being permanently stored along the way.',
  ],
];

/* ---------------------------------------------------- 04 uncensored */

const FREEDOMS = [
  ['ask', 'Ask Freely', 'Explore questions and topics without unnecessary filters getting in the way.'],
  ['create', 'Create Freely', 'Write, research, brainstorm, code, and create with fewer restrictions.'],
  [
    'choose',
    'Choose Your Model',
    'Access leading AI models based on what works best for you, without being locked into a single provider.',
  ],
];

/* ------------------------------------------------------------------ */

export default function PrivatePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {/* ==================================================== 01 the claim */}
        <section className="py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <Reveal>
              <Eyebrow>Private AI</Eyebrow>
              <h1 className="display max-w-[16ch] text-[clamp(2.2rem,5.2vw,3.8rem)] text-balance text-foreground">
                What you ask stays yours.
              </h1>
              <p className="mt-5 max-w-[54ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)] sm:text-[17px]">
                Use powerful AI without giving up your privacy. Your conversations stay private, aren&rsquo;t used for
                training, and aren&rsquo;t stored on our servers.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
                  Start a Private Chat
                </a>
              </div>

              <SpecLine
                className="mt-8 border-t border-[color:var(--color-border)] pt-5"
                items={['Private by default', 'Zero retention', 'No training']}
              />
            </Reveal>

            <Reveal delay={110}>
              <PrivacyPanel />
            </Reveal>
          </div>
        </section>

        {/* ================================================= 02 what is kept */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>Privacy, built in</Eyebrow>
              <h2 className="display max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                Your conversations aren&rsquo;t the product.
              </h2>
              <p className="mt-4 max-w-[56ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
                Your prompts, responses, files, and generated content belong to you. They stay on your device instead
                of becoming a permanent record on our servers.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map(([glyph, term, detail], i) => (
                <Reveal key={term} delay={i * 70} className="flex">
                  <div className="panel flex w-full flex-col p-5 transition-colors duration-300 hover:border-[color:var(--rule-strong)]">
                    <GlyphTile name={glyph} />
                    <h3 className="display-sm mt-4 text-[17px] text-foreground">{term}</h3>
                    <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================= 03 how it works */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="display max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                Your request travels. Your data doesn&rsquo;t stay.
              </h2>
              <p className="mt-4 max-w-[56ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
                Privacy is built into how every conversation moves between you and the AI.
              </p>
            </Reveal>

            {/* the whole trip, in one picture */}
            <Reveal delay={80} className="mt-10">
              <RequestJourney />
            </Reveal>

            {/* and the same four stations, in full */}
            <Reveal delay={140} className="mt-4">
              <div className="panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map(([term, detail], i) => (
                  <div
                    key={term}
                    className="relative border-b border-[color:var(--color-border)] p-5 last:border-b-0 sm:p-6 lg:border-b-0 lg:border-r lg:last:border-r-0"
                  >
                    <span className="ui-label tabular text-[color:var(--color-faint)]">
                      {String(i + 1).padStart(2, '0')} &middot; {term}
                    </span>
                    <p className="mt-3 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{detail}</p>

                    {i < STEPS.length - 1 && (
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

            <Reveal delay={180}>
              <SpecLine className="mt-7" items={['Local storage', 'Encrypted transit', 'Zero retention']} />
            </Reveal>
          </div>
        </section>

        {/* ================================================== 04 uncensored */}
        <section className="scroll-mt-24">
          <Rule />
          <div className="py-14 md:py-16">
            <Reveal>
              <Eyebrow>Uncensored by design</Eyebrow>
              <h2 className="display max-w-[22ch] text-[clamp(1.8rem,3.4vw,2.6rem)] text-balance text-foreground">
                Private enough to ask. Free enough to explore.
              </h2>
              <p className="mt-4 max-w-[60ch] text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)]">
                Privacy protects what you ask. Uncensored AI gives you the freedom to ask it. Explore ideas, research
                difficult topics, create, code, and have open conversations without unnecessary platform-level
                restrictions.
              </p>
            </Reveal>

            {/* the layer that is not there */}
            <Reveal delay={80} className="mt-9">
              <FilterCompare />
            </Reveal>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FREEDOMS.map(([glyph, term, detail], i) => (
                <Reveal key={term} delay={i * 70} className="flex">
                  <div className="panel flex w-full flex-col p-5 transition-colors duration-300 hover:border-[color:var(--rule-strong)]">
                    <GlyphTile name={glyph} />
                    <h3 className="display-sm mt-4 text-[17px] text-foreground">{term}</h3>
                    <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">{detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140} className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#" className="btn btn-accent px-7 py-3.5 text-[15px]">
                Start Chatting
              </a>
              <Link to="/models" className="btn btn-ghost px-7 py-3.5 text-[15px]">
                See every model
              </Link>
              <SpecLine className="ml-auto hidden lg:flex" items={['Private', 'Uncensored', 'Multi-model']} />
            </Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
