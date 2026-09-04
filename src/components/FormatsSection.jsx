import React from 'react';
import { Section, SectionHead, Reveal } from './ui/Ledger';
import { FormatTile } from './ui/Glyphs';
import { countByKind, MODELS } from '../data/catalog';
import { Link } from '../router';

/* =====================================================================
   Formats
   A short answer to "text only, or more than that?" before the catalog
   asks anyone to read a table. Music sits inside audio here; the model
   list keeps it as its own group.
   ===================================================================== */

const FORMATS = [
  {
    kind: 'text',
    label: 'Text',
    count: countByKind('text'),
    body: 'Chat, code, analysis and documents that run to a million tokens.',
  },
  {
    kind: 'image',
    label: 'Images',
    count: countByKind('image'),
    body: 'Generate from a prompt, or edit and inpaint an image you already have.',
  },
  {
    kind: 'audio',
    label: 'Audio',
    count: countByKind('audio') + countByKind('music'),
    body: 'Transcription in 90+ languages, speech to speech, and music from a brief.',
  },
  {
    kind: 'video',
    label: 'Video',
    count: countByKind('video'),
    body: 'Short clips from a written description, some of them with sound.',
  },
];

export default function FormatsSection() {
  return (
    <Section id="formats" index="02" label="Formats">
      <SectionHead
        eyebrow="Formats"
        title="Not just text."
        deck="One subscription covers every kind of output, from the same chat and the same API."
        meta={[{ label: 'Models', value: String(MODELS.length) }]}
      />

      <div className="mt-10 grid grid-cols-1 border-t border-[color:var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map((f, i) => (
          <Reveal
            key={f.kind}
            delay={i * 70}
            className="border-b border-[color:var(--color-border)] py-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <FormatTile kind={f.kind} size={40} />

            <div className="mt-4 flex items-baseline gap-2.5">
              <h3 className="display-sm text-[18px] text-foreground">{f.label}</h3>
              <span className="ui-label tabular text-[color:var(--color-faint)]">{f.count} models</span>
            </div>

            <p className="mt-2 max-w-[34ch] text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">
              {f.body}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140} className="mt-9 flex flex-wrap items-center gap-3">
        <Link to="/models" className="btn btn-accent">
          See every model
        </Link>
        <span className="ui-label text-[color:var(--color-faint)]">
          Named by provider, with what each one is good at
        </span>
      </Reveal>
    </Section>
  );
}
