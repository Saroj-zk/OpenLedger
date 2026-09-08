import React, { useEffect, useState } from 'react';
import { RotateCcw, ChevronDown, ArrowUp, Check, Paperclip } from 'lucide-react';
import { useInView } from './ui/Ledger';
import { BrandTile } from './ui/Glyphs';

/* =====================================================================
   The Unified Memory demo.

   A chat window built to the pattern everyone already knows: the current
   model sits top left as a button, your messages are bubbles on the
   right, and the model's answer has no bubble at all — just an avatar
   and text running the width of the column. That last detail is the one
   that separates a real chat interface from a mock of one; put the
   assistant in a bubble and it stops looking like any app you have used.

   The switch is shown rather than described. At each change the picker
   opens, lists the models, and ticks the new one — which is exactly how
   you would do it yourself.

   Everything runs off one step counter. The thread, the picker, and the
   memory panel are all views of the same number.
   ===================================================================== */

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const MODELS = {
  OA: { code: 'OA', name: 'GPT' },
  AN: { code: 'AN', name: 'Claude' },
  GG: { code: 'GG', name: 'Gemini' },
  DS: { code: 'DS', name: 'DeepSeek' },
};

/** The list the picker offers. */
const PICKER = ['OA', 'AN', 'GG', 'DS'];

const SCRIPT = [
  {
    kind: 'ask',
    code: 'GG',
    text: 'I’m planning a 7-day trip to Japan in October. My budget is $2,000, I prefer quieter places, and I’m vegetarian.',
  },
  {
    kind: 'reply',
    code: 'GG',
    text: 'Got it. I’ll keep the trip within $2,000, prioritize less crowded areas, and keep vegetarian options in mind.',
  },
  { kind: 'switch', code: 'AN' },
  { kind: 'ask', code: 'AN', text: 'Find me a good place to stay in Kyoto.' },
  {
    kind: 'reply',
    code: 'AN',
    text: 'Since you’re looking for quieter places and keeping the full Japan trip under $2,000, I’d focus on smaller stays around Higashiyama or northern Kyoto, with easy access to vegetarian restaurants.',
    marks: ['quieter places', 'under $2,000', 'vegetarian restaurants'],
  },
  { kind: 'switch', code: 'GG' },
  { kind: 'ask', code: 'GG', text: 'What should I do there on day two?' },
  {
    kind: 'reply',
    code: 'GG',
    text: 'Keeping your preference for quieter experiences in mind, I’d start early at Nanzen-ji, walk the Philosopher’s Path, and spend the afternoon around northern Higashiyama.',
    marks: ['quieter experiences'],
  },
];

/* Written by the reply at index 1, then read by the replies at 4 and 7. */
const MEMORY = [
  { label: 'Vegetarian', writtenAt: 1, readAt: [4] },
  { label: 'Budget: $2,000', writtenAt: 1, readAt: [4] },
  { label: 'Prefers quieter places', writtenAt: 1, readAt: [4, 7] },
  { label: 'Japan · 7 days · October', writtenAt: 1, readAt: [4, 7] },
];

/** Highlights the fragments of a reply that could only have come from memory. */
function Marked({ text, marks = [] }) {
  if (!marks.length) return text;
  const escaped = marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));

  return parts.map((part, i) =>
    marks.includes(part) ? (
      <mark key={i} className="rounded-[3px] bg-[color:var(--color-brand-haze)] px-[3px] font-medium text-accent">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export default function MemoryChatDemo() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setStep(SCRIPT.length);
      return;
    }
    setStep(1);
    let i = 1;
    const tick = setInterval(() => {
      i += 1;
      if (i > SCRIPT.length) {
        clearInterval(tick);
        return;
      }
      setStep(i);
    }, 1500);
    return () => clearInterval(tick);
  }, [inView, run]);

  const shown = SCRIPT.slice(0, step);
  const newest = step - 1;
  const active = MODELS[[...shown].reverse().find((r) => r.code)?.code || 'GG'];
  const written = MEMORY.filter((m) => step > m.writtenAt);
  const done = step >= SCRIPT.length;
  const picking = shown[newest]?.kind === 'switch';

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
      {/* ------------------------------------------------- the chat window */}
      <div className="panel flex flex-col overflow-hidden">
        {/* header: the model button, where every chat app puts it */}
        <div className="relative flex items-center gap-2 border-b border-[color:var(--color-border)] px-3 py-2.5">
          <span
            className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 transition-colors duration-300"
            style={{ background: picking ? 'var(--color-tertiary)' : 'transparent' }}
          >
            <BrandTile code={active.code} size={21} />
            <span className="text-[14px] font-medium text-foreground">{active.name}</span>
            <ChevronDown
              size={14}
              className="text-[color:var(--color-faint)] transition-transform duration-300"
              style={{ transform: picking ? 'rotate(180deg)' : 'none' }}
            />
          </span>

          <span className="ui-label ml-auto flex items-center gap-1.5 pr-1 text-[color:var(--color-faint)]">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
              style={{ animation: !done ? 'pulse-dot 1.2s ease-in-out infinite' : 'none' }}
              aria-hidden="true"
            />
            <span className="tabular">{written.length}</span> in memory
          </span>

          {/* the picker, open at the moment of the switch */}
          {picking && (
            <div
              className="absolute left-3 top-[calc(100%+6px)] z-30 w-[228px] rounded-[13px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-1.5 shadow-[0_20px_44px_-18px_rgba(16,13,10,.45)]"
              style={{ animation: 'msg-in .22s cubic-bezier(.16,1,.3,1) both' }}
            >
              <span className="ui-label block px-2 pb-1.5 pt-1 text-[color:var(--color-faint)]">Switch model</span>
              {PICKER.map((code) => {
                const on = code === active.code;
                return (
                  <span
                    key={code}
                    className="flex items-center gap-2.5 rounded-[9px] px-2 py-2"
                    style={{ background: on ? 'var(--color-tertiary)' : 'transparent' }}
                  >
                    <BrandTile code={code} size={20} />
                    <span
                      className="text-[13px]"
                      style={{ color: on ? 'var(--color-foreground)' : 'var(--color-graphite)' }}
                    >
                      {MODELS[code].name}
                    </span>
                    {on && <Check size={14} className="ml-auto text-accent" />}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* the thread */}
        <div className="flex min-h-[452px] flex-1 flex-col justify-end gap-5 px-4 py-5 sm:px-5">
          {shown.map((row, i) => {
            const enter = { animation: i === newest ? 'msg-in .45s cubic-bezier(.16,1,.3,1) both' : 'none' };

            if (row.kind === 'switch') {
              return (
                <div key={i} className="flex items-center justify-center gap-2.5" style={enter}>
                  <span className="h-px w-10 bg-[color:var(--color-border)]" aria-hidden="true" />
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[color:var(--color-faint)]">
                    <BrandTile code={row.code} size={14} />
                    Switched to {MODELS[row.code].name}
                  </span>
                  <span className="h-px w-10 bg-[color:var(--color-border)]" aria-hidden="true" />
                </div>
              );
            }

            /* You: a bubble on the right, in a neutral grey rather than a
               brand colour, because that is what these apps actually do. */
            if (row.kind === 'ask') {
              return (
                <div key={i} className="flex justify-end" style={enter}>
                  <p className="max-w-[78%] rounded-[18px] rounded-br-[6px] border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-4 py-2.5 text-[14.5px] leading-[1.5] text-foreground">
                    {row.text}
                  </p>
                </div>
              );
            }

            /* The model: no bubble. Avatar, then the answer running the
               width of the column. */
            return (
              <div key={i} className="flex gap-3" style={enter}>
                <BrandTile code={row.code} size={26} className="mt-[2px] shrink-0" />
                <p className="max-w-[90%] text-[14.5px] leading-[1.65] text-foreground">
                  <Marked text={row.text} marks={row.marks} />
                </p>
              </div>
            );
          })}
        </div>

        {/* composer */}
        <div className="px-3 pb-3 pt-1">
          <div className="flex items-center gap-2.5 rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3.5 py-2.5 shadow-[0_2px_8px_-4px_rgba(16,13,10,.18)]">
            <Paperclip size={15} className="shrink-0 text-[color:var(--color-faint)]" />
            <span className="flex-1 truncate text-[14px] text-[color:var(--color-faint)]">Ask anything&hellip;</span>
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white"
              aria-hidden="true"
            >
              <ArrowUp size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ the memory panel */}
      <div className="panel flex flex-col p-4 sm:p-5">
        <div className="flex items-baseline justify-between border-b border-[color:var(--color-border)] pb-3">
          <span className="ui-label text-foreground">Unified Memory</span>
          <span className="ui-label tabular text-[color:var(--color-faint)]">
            {written.length} / {MEMORY.length}
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          {MEMORY.map((m) => {
            const isWritten = step > m.writtenAt;
            const isRead = m.readAt.includes(newest);

            if (!isWritten) {
              return (
                <li
                  key={m.label}
                  className="h-[34px] rounded-[9px] border border-dashed border-[color:var(--color-border)]"
                  aria-hidden="true"
                />
              );
            }

            return (
              <li
                key={m.label}
                className="flex items-center gap-2 rounded-[9px] border px-3 py-2 text-[12.5px] transition-all duration-500"
                style={{
                  animation: 'chip-in .4s cubic-bezier(.16,1,.3,1) both',
                  borderColor: isRead
                    ? 'color-mix(in srgb, var(--color-brand-accent) 55%, transparent)'
                    : 'var(--color-border)',
                  background: isRead
                    ? 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)'
                    : 'var(--color-card)',
                  color: isRead ? 'var(--color-accent)' : 'var(--color-graphite)',
                  boxShadow: isRead ? '0 8px 20px -12px var(--color-brand-glow)' : 'none',
                }}
              >
                <Check size={13} className="shrink-0" style={{ opacity: isRead ? 1 : 0.4 }} />
                <span className="truncate">{m.label}</span>
                {isRead && <span className="ui-label ml-auto shrink-0 text-[8.5px]">Used</span>}
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[12.5px] leading-[1.6] text-[color:var(--color-graphite)]">
          Written once, from the first message. Every model after it reads the same four facts &mdash; nobody had to
          repeat them.
        </p>

        {/* the panel is as tall as the chat beside it, so the space below
            earns its keep by standing for the "user controlled" claim */}
        <div className="mt-6 flex-1 rounded-[11px] border border-dashed border-[color:var(--color-border)] p-4">
          <span className="ui-label text-[color:var(--color-graphite)]">Yours to change</span>
          <p className="mt-2 text-[12.5px] leading-[1.6] text-[color:var(--color-graphite)]">
            Every entry can be reviewed, edited, or removed. Nothing is remembered that you have not chosen to keep.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Review', 'Edit', 'Delete'].map((a) => (
              <span
                key={a}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2.5 py-1 text-[11.5px] text-[color:var(--color-graphite)]"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end border-t border-[color:var(--color-border)] pt-4">
          <button
            onClick={() => {
              setStep(0);
              setRun((r) => r + 1);
            }}
            className="btn btn-ghost shrink-0 px-3 py-1.5"
          >
            <RotateCcw size={13} />
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
