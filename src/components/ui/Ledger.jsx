import React, { useEffect, useRef, useState } from 'react';
import { Link } from '../../router';

/* =====================================================================
   Ledger primitives
   Every section on this page is an entry in a ledger: a ruled band with
   an index in the margin, a headline, and a meta column that carries the
   numbers. These components enforce that rhythm.
   ===================================================================== */

export function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12, ...options },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

/* One observer for every Reveal on the page. Dozens of separate
   observers is the usual way this gets built and the usual reason a
   long page stutters on the first scroll. */
let sharedObserver = null;
const pending = new WeakMap();

function watch(node, onEnter) {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter();
    return () => {};
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fn = pending.get(entry.target);
          pending.delete(entry.target);
          sharedObserver.unobserve(entry.target);
          if (fn) fn();
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
  }
  pending.set(node, onEnter);
  sharedObserver.observe(node);
  return () => {
    pending.delete(node);
    sharedObserver.unobserve(node);
  };
}

/**
 * Fades and lifts its children once they scroll into view.
 * `delay` staggers siblings; `row` uses the shorter travel meant for
 * items in a ruled list.
 */
export function Reveal({ children, delay = 0, row = false, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return watch(ref.current, () => setShown(true));
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${row ? 'reveal-row' : ''} ${shown ? 'is-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Hairline with ledger ticks at both ends. */
export function Rule({ className = '' }) {
  return <div className={`rule-line ${className}`} />;
}

/**
 * A page section. `index` is the ledger entry number, `label` the entry
 * name; together they print in the margin as `03 / COUNCIL`.
 */
export function Section({
  id,
  index,
  label,
  dark = false,
  tint = false,
  grid = false,
  full = false,
  className = '',
  children,
}) {
  const ground = dark
    ? 'ledger-dark bg-background text-foreground'
    : tint
      ? 'bg-[color:var(--color-tertiary)]'
      : 'bg-background';
  return (
    <section
      id={id}
      className={`relative flex scroll-mt-24 flex-col ${ground} ${full ? 'lg:min-h-screen' : ''} ${className}`}
    >
      {grid && <div className="ledger-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />}

      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <Rule />
      </div>

      <div className="relative flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-8 md:py-20">{children}</div>
      </div>

      {index && (
        <span className="ui-label pointer-events-none absolute right-5 top-6 hidden select-none text-[color:var(--color-faint)] sm:right-8 lg:block">
          {index} / {label}
        </span>
      )}
    </section>
  );
}

/**
 * Section header. Left: eyebrow + headline + deck. Right: an optional
 * meta list, printed as tabular mono rows so numbers line up.
 */
export function SectionHead({ eyebrow, title, deck, meta, align = 'split', size = 'lg' }) {
  const titleSize =
    size === 'sm' ? 'text-[clamp(1.7rem,2.6vw,2.3rem)]' : 'text-[clamp(2rem,4.6vw,3.4rem)]';
  return (
    <header
      className={
        align === 'center'
          ? 'mx-auto max-w-[54rem] text-center'
          : 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16'
      }
    >
      <Reveal>
        {eyebrow && (
          <div className={`ui-label mb-5 flex items-center gap-2 text-accent ${align === 'center' ? 'justify-center' : ''}`}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
            {eyebrow}
          </div>
        )}
        <h2 className={`display ${titleSize} text-balance text-foreground`}>{title}</h2>
        {deck && (
          <p
            className={`mt-4 text-pretty text-[16px] leading-[1.55] text-[color:var(--color-graphite)] ${
              align === 'center' ? 'mx-auto max-w-[62ch]' : 'max-w-[64ch]'
            }`}
          >
            {deck}
          </p>
        )}
      </Reveal>

      {meta && align !== 'center' && (
        <Reveal delay={90}>
          <dl className="flex gap-8 lg:flex-col lg:gap-4 lg:border-l lg:border-[color:var(--color-border)] lg:pl-8">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="ui-label text-[color:var(--color-faint)]">{m.label}</dt>
                <dd className="tabular mt-1 font-display text-[26px] font-semibold leading-none text-foreground">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}
    </header>
  );
}

/** The OpenLedger mark, drawn from the brand path. */
export function Mark({ size = 22, className = '' }) {
  return (
    <svg width={size} height={size * (46 / 48)} viewBox="0 0 48 46" fill="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
      />
    </svg>
  );
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={19} className="text-accent" />
      <span className="display-sm text-[17px] tracking-[-0.02em] text-foreground">OpenLedger</span>
    </span>
  );
}

/**
 * Provider tile. Deliberately a two-letter monogram rather than a vendor
 * logo — the page reads providers as ledger entries, and monograms keep
 * the row monochrome and evenly weighted.
 */
export function ProviderTile({ code, size = 34, active = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[9px] border font-mono text-[11px] font-semibold tracking-[0.06em] transition-colors ${
        active
          ? 'border-brand-accent/40 bg-brand-accent/10 text-accent'
          : 'border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] text-[color:var(--color-graphite)]'
      }`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {code}
    </span>
  );
}

export function StatusDot({ tone = 'live', className = '' }) {
  const color = tone === 'live' ? '#16a34a' : tone === 'beta' ? '#d97706' : 'var(--color-faint)';
  return (
    <span
      className={`inline-block h-[6px] w-[6px] rounded-full ${className}`}
      style={{ background: color, animation: tone === 'live' ? 'pulse-dot 2.6s ease-in-out infinite' : 'none' }}
      aria-hidden="true"
    />
  );
}

/** Small arrow link used at the foot of cards. Routes internally when
    the href is a path on this site. */
export function ArrowLink({ children, href = '#', className = '' }) {
  const classes = `group/al ui-label inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent ${className}`;
  const arrow = <span className="transition-transform duration-300 group-hover/al:translate-x-1">&#8594;</span>;

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {children}
        {arrow}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
      {arrow}
    </a>
  );
}
