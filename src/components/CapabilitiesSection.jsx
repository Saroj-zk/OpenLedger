import React from 'react';
import { Section, SectionHead, Reveal } from './ui/Ledger';
import { FormatTile } from './ui/Glyphs';
import { countByKind, MODELS } from '../data/catalog';
import { CAPABILITIES } from '../data/capabilities';
import { Link } from '../router';

/* =====================================================================
   What you can do
   A short answer to "text only, or more than that?" before the catalog
   asks anyone to read a table. Music sits inside audio here; the model
   list keeps it as its own group.
   ===================================================================== */

const SHORT = {
  text: 'Chat, code, analysis and documents that run to a million tokens.',
  image: 'Generate from a prompt, or edit and inpaint an image you already have.',
  audio: 'Transcription in 90+ languages, speech to speech, and music from a brief.',
  video: 'Short clips from a written description, some of them with sound.',
};

function countFor(kind) {
  return kind === 'audio' ? countByKind('audio') + countByKind('music') : countByKind(kind);
}

export default function CapabilitiesSection() {
  return (
    <Section id="capabilities" index="02" label="Capabilities">
      <SectionHead
        eyebrow="What you can do"
        title="Uncensored chat, images, video and more."
        deck="Text, image, video, audio, code and search in one place, all private or anonymous."
        meta={[{ label: 'Models', value: String(MODELS.length) }]}
      />

      <div className="mt-10 grid grid-cols-1 border-t border-[color:var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((c, i) => (
          <Reveal
            key={c.kind}
            delay={i * 70}
            className="border-b border-[color:var(--color-border)] py-7 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
          >
            <FormatTile kind={c.kind} size={48} />

            <div className="mt-5 flex items-baseline gap-2.5">
              <h3 className="display-sm text-[19px] text-foreground">{c.label}</h3>
              <span className="ui-label tabular text-[color:var(--color-faint)]">{countFor(c.kind)} models</span>
            </div>

            <p className="mt-2 max-w-[34ch] text-[13.5px] leading-[1.6] text-[color:var(--color-graphite)]">
              {SHORT[c.kind]}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140} className="mt-9 flex flex-wrap items-center gap-3">
        <Link to="/capabilities" className="btn btn-accent">
          See what you can make
        </Link>
        <span className="ui-label text-[color:var(--color-faint)]">
          Every kind, with what people use it for
        </span>
      </Reveal>
    </Section>
  );
}
