import React from 'react';

/* =====================================================================
   Brand tiles
   The ledger tables stay monochrome on purpose. These are for the
   illustrated scenes only, where the point is that you recognise the
   providers at a glance, so they carry each vendor's colour and their
   actual mark, built like an app icon: gradient face, top highlight,
   coloured shadow underneath.

   The marks are the real ones rather than approximations. A drawn
   lookalike reads as a mistake at this size, and the whole job of these
   tiles is instant recognition.
   ===================================================================== */

export const BRAND = {
  OA: { name: 'OpenAI', base: '#0D0D0D', top: '#3D3D3D' },
  AN: { name: 'Anthropic', base: '#D97757', top: '#E8926F' },
  GG: { name: 'Gemini', base: '#4B6FD8', top: '#9A7BE8' },
  XA: { name: 'xAI', base: '#1B1B1F', top: '#3A3A42' },
  DS: { name: 'DeepSeek', base: '#4D6BFE', top: '#7189FF' },
  MT: { name: 'Meta', base: '#0866FF', top: '#3B87FF' },
  MS: { name: 'Mistral', base: '#FA520F', top: '#FF7A3D' },
  BF: { name: 'Black Forest Labs', base: '#111827', top: '#334155' },
  SA: { name: 'Stability AI', base: '#7C3AED', top: '#9B6BFF' },
  TL: { name: 'Tools', base: '#475569', top: '#6B7A8F' },
};

/* Every mark is drawn as a filled path in a 24x24 box, so BrandTile can
   inset them all by the same amount and they optically match. */
function Glyph({ code }) {
  switch (code) {
    case 'OA':
      return (
        <path
          fill="#fff"
          d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
        />
      );

    case 'AN':
      return (
        <path
          fill="#fff"
          d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"
        />
      );

    case 'GG':
      /* Gemini's four point sparkle. The Google search G would be wrong
         here: the tile stands for the model, not the search engine. */
      return (
        <path
          fill="#fff"
          d="M12 1.4c.74 6.02 4.44 9.72 10.46 10.46-6.02.74-9.72 4.44-10.46 10.46-.74-6.02-4.44-9.72-10.46-10.46C7.56 11.12 11.26 7.42 12 1.4Z"
        />
      );

    case 'XA':
      /* The xAI slash mark: one long stroke through the diagonal, with
         the short counter-stroke cut away from it. */
      return (
        <g fill="#fff">
          <path d="M6.36 8.77 16.4 23h-4.47L1.9 8.77z" />
          <path d="M22.1 1 12.14 15.11l-2.23-3.16L17.63 1z" />
          <path d="M6.46 16.68 4.23 19.84 2 23h4.46l2.23-3.16z" />
        </g>
      );

    case 'DS':
      /* DeepSeek's whale, turning to the left. */
      return (
        <g fill="#fff">
          <path d="M22.4 4.1c-.5-.3-1 .1-1.4.5-.9.9-1.7 2-2.8 2.6-1.7 1-3.6.9-5.4.3-2-.7-3.8-1.9-5.9-2.2-2.3-.4-4.7.4-6.2 2.2-1.1 1.3-1.5 3-1.1 4.6.5 2.1 2.2 3.7 4.1 4.6 2.4 1.1 5.1 1.3 7.7 1 2.8-.3 5.6-1.3 7.6-3.3 1.9-1.9 2.9-4.6 2.9-7.3 0-.9.1-2.1-.5-2.6zM7.2 11.6a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7z" />
          <path d="M9.6 17.6c1 .9 1.8 2 2.3 3.2.2.4.3 1 .8 1.1.4 0 .6-.4.7-.8.3-1.2.2-2.5-.2-3.6-1.2.2-2.4.2-3.6.1z" />
        </g>
      );

    case 'MT':
      return (
        <path
          fill="#fff"
          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
        />
      );

    case 'MS':
      /* Mistral's grid: a filled square whose top rows step back in two
         notches. Drawn on a 5x5 cell grid, which is what gives the mark
         its stepped silhouette at icon size. */
      return (
        <g fill="#fff">
          <rect x="2" y="2" width="4" height="4" />
          <rect x="14" y="2" width="4" height="4" />
          <rect x="2" y="6" width="8" height="4" />
          <rect x="14" y="6" width="8" height="4" />
          <rect x="2" y="10" width="20" height="12" />
        </g>
      );

    case 'BF':
      /* Black Forest Labs: the faceted prism. */
      return (
        <g fill="#fff">
          <path d="M12 1.4 22.6 12 12 22.6 1.4 12z" opacity=".55" />
          <path d="M12 5.9 18.1 12 12 18.1 5.9 12z" />
        </g>
      );

    case 'SA':
      /* Stability AI: three offset bars. */
      return (
        <g fill="#fff">
          <rect x="3" y="4" width="18" height="4.4" rx="1" />
          <rect x="6.4" y="9.8" width="14.6" height="4.4" rx="1" />
          <rect x="3" y="15.6" width="11.2" height="4.4" rx="1" />
        </g>
      );

    case 'TL':
      /* Not a vendor. The tools an agent can reach. */
      return (
        <path
          fill="#fff"
          d="M20.2 6.1a1 1 0 0 0-1.6-.3l-2.5 2.5-2.4-2.4 2.5-2.5a1 1 0 0 0-.3-1.6 6.2 6.2 0 0 0-8 7.7L3.1 15.3a2.9 2.9 0 0 0 4.1 4.1l5.8-4.8a6.2 6.2 0 0 0 7.2-8.5zM5.6 18.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"
        />
      );

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
      {/* One inset for every mark, so they optically match each other. */}
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
        <g transform="translate(4.7 4.7) scale(0.608)">
          <Glyph code={code} />
        </g>
      </svg>

      {/* the gloss across the top third */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background: 'linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,0) 48%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)',
        }}
      />
    </span>
  );
}

/* =====================================================================
   Format tiles
   The same app-icon build, for what the models produce rather than who
   makes them.
   ===================================================================== */

export const FORMATS = {
  text: { label: 'Text', base: '#3F4756', top: '#79879C', deep: '#242A34' },
  image: { label: 'Images', base: '#7C3AED', top: '#A985FF', deep: '#4C1D95' },
  audio: { label: 'Audio', base: '#0D9488', top: '#45E0C8', deep: '#0A5F58' },
  video: { label: 'Video', base: '#E11D48', top: '#FF7D97', deep: '#8E0F2E' },
};

function FormatGlyph({ kind }) {
  switch (kind) {
    case 'text':
      return (
        <>
          <rect x="7.4" y="2.9" width="12" height="15.4" rx="2.4" fill="#fff" opacity=".32" />
          <rect x="4.4" y="5.4" width="12.4" height="15.4" rx="2.4" fill="#fff" />
          <g fill="currentColor">
            <rect x="6.9" y="8.9" width="7.4" height="1.5" rx=".75" />
            <rect x="6.9" y="12" width="5.4" height="1.5" rx=".75" />
            <rect x="6.9" y="15.1" width="6.6" height="1.5" rx=".75" />
          </g>
        </>
      );
    case 'image':
      return (
        <>
          <rect x="2.9" y="6.2" width="15.8" height="12.9" rx="2.6" fill="#fff" />
          <circle cx="7.6" cy="10.5" r="1.6" fill="currentColor" />
          <path
            d="M3.6 17.6 8.4 13l3.1 2.9 2.8-2.6 3.2 3v.6a1.5 1.5 0 0 1-1.5 1.5H5.1a1.5 1.5 0 0 1-1.5-1.5z"
            fill="currentColor"
          />
          <path d="m19.4 2.6.85 2.15L22.4 5.6l-2.15.85-.85 2.15-.85-2.15L16.4 5.6l2.15-.85z" fill="#fff" />
        </>
      );
    case 'audio':
      return (
        <>
          <circle cx="12" cy="12" r="9.1" fill="#fff" opacity=".2" />
          <circle cx="12" cy="12" r="6.4" fill="#fff" opacity=".14" />
          <g fill="#fff">
            <rect x="4.6" y="10.3" width="2.3" height="3.4" rx="1.15" />
            <rect x="8.3" y="6.4" width="2.3" height="11.2" rx="1.15" />
            <rect x="12" y="8.6" width="2.3" height="6.8" rx="1.15" />
            <rect x="15.7" y="5.2" width="2.3" height="13.6" rx="1.15" />
            <rect x="19.4" y="10.8" width="2.3" height="2.4" rx="1.15" />
          </g>
        </>
      );
    case 'video':
      return (
        <>
          <rect x="2.6" y="5.2" width="18.8" height="13.6" rx="3.2" fill="#fff" />
          <path d="M10.2 9.2 15.8 12l-5.6 2.8z" fill="currentColor" />
          <g fill="currentColor" opacity=".34">
            <rect x="4.6" y="7.2" width="1.7" height="1.7" rx=".55" />
            <rect x="4.6" y="15.1" width="1.7" height="1.7" rx=".55" />
            <rect x="17.7" y="7.2" width="1.7" height="1.7" rx=".55" />
            <rect x="17.7" y="15.1" width="1.7" height="1.7" rx=".55" />
          </g>
        </>
      );
    default:
      return null;
  }
}

export function FormatTile({ kind, size = 48, className = '' }) {
  const f = FORMATS[kind] || FORMATS.text;
  const radius = Math.round(size * 0.27);

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        color: f.base,
        background: `radial-gradient(120% 120% at 28% 12%, ${f.top} 0%, ${f.base} 58%, ${f.deep} 100%)`,
        boxShadow: `0 14px 26px -10px ${f.base}70, 0 2px 4px rgba(0,0,0,.16), inset 0 1.5px 0 rgba(255,255,255,.55), inset 0 -8px 16px rgba(0,0,0,.14)`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
        <FormatGlyph kind={kind} />
      </svg>
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background: 'linear-gradient(180deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,0) 48%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)',
        }}
      />
    </span>
  );
}
