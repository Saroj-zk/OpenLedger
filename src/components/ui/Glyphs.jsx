import React from 'react';

/* =====================================================================
   Brand tiles
   The ledger tables stay monochrome on purpose. These are for the
   illustrated scenes only, where the point is that you recognise the
   providers at a glance, so they carry each vendor's colour and a mark
   of their own, built like an app icon: gradient face, top highlight,
   coloured shadow underneath.
   ===================================================================== */

export const BRAND = {
  OA: { name: 'OpenAI', base: '#10A37F', top: '#2BC79E' },
  AN: { name: 'Anthropic', base: '#D97757', top: '#E8926F' },
  GG: { name: 'Google', base: '#4285F4', top: '#6BA1FF' },
  XA: { name: 'xAI', base: '#1B1B1F', top: '#3A3A42' },
  DS: { name: 'DeepSeek', base: '#4D6BFE', top: '#7189FF' },
  MT: { name: 'Meta', base: '#0866FF', top: '#3B87FF' },
  MS: { name: 'Mistral', base: '#FA520F', top: '#FF7A3D' },
  BF: { name: 'Black Forest Labs', base: '#111827', top: '#334155' },
  SA: { name: 'Stability AI', base: '#7C3AED', top: '#9B6BFF' },
  TL: { name: 'Tools', base: '#475569', top: '#6B7A8F' },
};

function Glyph({ code }) {
  const s = { fill: 'none', stroke: '#fff', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (code) {
    case 'OA':
      return (
        <>
          <path d="M12 3.4 19 7.4v8.2l-7 4-7-4V7.4z" {...s} />
          <path d="M12 3.4v8.2l7 4M12 11.6l-7 4" {...s} />
        </>
      );
    case 'AN':
      return (
        <>
          <path d="M8.4 18 12 7l3.6 11" {...s} strokeWidth={1.9} />
          <path d="M9.9 14.5h4.2" {...s} strokeWidth={1.9} />
        </>
      );
    case 'GG':
      return <path d="M16.9 9.2A5.2 5.2 0 1 0 17.2 14h-4.8" {...s} strokeWidth={1.9} />;
    case 'XA':
      return (
        <>
          <path d="M6.6 6.6 17.4 17.4" {...s} strokeWidth={1.9} />
          <path d="M17.4 6.6 6.6 17.4" {...s} strokeWidth={1.9} />
        </>
      );
    case 'DS':
      return (
        <>
          <path
            d="M4.6 13.6c2.7-4.7 8.8-6.3 15.2-4.5-1.7 4.7-6.4 7.1-11.2 7.1-2 0-3.4-.9-4-2.6Z"
            fill="#fff"
            stroke="none"
          />
          <circle cx="9.9" cy="12" r="1" fill="currentColor" stroke="none" />
        </>
      );
    case 'MT':
      return (
        <>
          <circle cx="9" cy="12" r="3.6" {...s} />
          <circle cx="15" cy="12" r="3.6" {...s} />
        </>
      );
    case 'MS':
      return (
        <g fill="#fff" stroke="none">
          <rect x="5" y="6.2" width="14" height="3.2" rx="0.6" />
          <rect x="5" y="10.4" width="9.6" height="3.2" rx="0.6" />
          <rect x="5" y="14.6" width="5.2" height="3.2" rx="0.6" />
        </g>
      );
    case 'BF':
      return (
        <>
          <path d="M12 4.4 19 12l-7 7.6L5 12z" {...s} />
          <path d="M12 8.6 15.6 12 12 15.4 8.4 12z" fill="#fff" stroke="none" />
        </>
      );
    case 'TL':
      return (
        <>
          <path d="M9.2 4v4.6M14.8 4v4.6" {...s} strokeWidth={1.9} />
          <path d="M6.6 8.6h10.8v3.2a5.4 5.4 0 0 1-10.8 0z" {...s} strokeWidth={1.8} />
          <path d="M12 17.2V20" {...s} strokeWidth={1.9} />
        </>
      );
    case 'SA':
      return <path d="M15.8 8.4a3.6 3.6 0 0 0-5.9 3.1c1.5 2.6 5.3 1.4 5.3 4a3.4 3.4 0 0 1-5.6 2" {...s} strokeWidth={1.9} />;
    default:
      return null;
  }
}

/**
 * A provider icon built like an app icon. `lifted` raises it and warms
 * its shadow, which the scenes use to mean "this is the one answering".
 */
export function BrandTile({ code, size = 34, lifted = false, className = '' }) {
  const brand = BRAND[code] || BRAND.OA;
  const radius = Math.round(size * 0.28);

  return (
    <span
      className={`relative inline-block shrink-0 transition-all duration-500 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        color: brand.base,
        background: `linear-gradient(157deg, ${brand.top} 0%, ${brand.base} 62%, ${brand.base} 100%)`,
        boxShadow: lifted
          ? `0 10px 22px -6px ${brand.base}88, 0 2px 4px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.5)`
          : `0 4px 10px -4px ${brand.base}55, 0 1px 2px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.4)`,
        transform: lifted ? 'translateY(-2px) scale(1.06)' : 'none',
      }}
      title={brand.name}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
        <Glyph code={code} />
      </svg>

      {/* the gloss across the top third */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background: 'linear-gradient(180deg, rgba(255,255,255,.28) 0%, rgba(255,255,255,0) 46%)',
        }}
      />
    </span>
  );
}
