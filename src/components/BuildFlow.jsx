import React from 'react';

/* =====================================================================
   Build — an agent writing an application, in its own terminal.

   The other runs on this stage are product UI. This one is a developer
   tool, so it is drawn as one: a dark window that ignores the site's
   theme entirely, a monospace transcript, tool calls with their results,
   and an application taking shape across two files.

   What is on screen is an app being built from a sentence — a board
   component and the page that mounts it — not an integration with
   anything. The agent is the product here; OpenLedger is the line in
   the footer that says which model is answering.

   The code is the point of the shot, so it is real TypeScript and real
   JSX: a viewer who writes software for a living will read it frame by
   frame, and a fake costs more credibility than the shot buys.

   Everything is drawn at a fixed size and scaled to the stage, and the
   run is a pure function of elapsed milliseconds like every other
   script here.
   ===================================================================== */

const W = 880;
const H = 520;

const BAR = 40;
const FOOT = 46;

/* The terminal's own palette. Deliberately not the design tokens: this
   window is dark whichever theme the page is in. */
const C = {
  shell: '#0B0C0E',
  bar: '#141619',
  line: 'rgba(255,255,255,.09)',
  text: '#C9D1D9',
  dim: '#7D8590',
  faint: '#565D66',
  accent: '#E2823F',
  add: '#3FB950',
  del: '#F85149',
  addBg: 'rgba(63,185,80,.12)',
  delBg: 'rgba(248,81,73,.11)',
};

const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

/* --------------------------------------------------------------- code */

const NEW_FILE = `import { useState } from 'react';
import type { Task, Status } from '../types';
import { Column } from './Column';

const COLUMNS: Status[] = ['todo', 'doing', 'done'];

export function Board({ initial }: { initial: Task[] }) {
  const [tasks, setTasks] = useState(initial);
  const inColumn = (s: Status) => tasks.filter((t) => t.status === s);

  const move = (id: string, to: Status) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: to } : t)));

  return (
    <div className="grid grid-cols-3 gap-4">
      {COLUMNS.map((status) => (
        <Column key={status} status={status} tasks={inColumn(status)} onDrop={move} />
      ))}
    </div>
  );
}`;

/* A patch, written the way a diff reads: a mark per line, and removed
   lines holding their number instead of advancing it. */
const PATCH = [
  [' ', "import { useTasks } from './hooks/useTasks';"],
  ['+', "import { Board } from './components/Board';"],
  [' ', "import { Spinner } from './components/Spinner';"],
  [' ', ''],
  [' ', 'export default function App() {'],
  [' ', '  const tasks = useTasks();'],
  ['-', '  return <TaskList tasks={tasks} />;'],
  ['+', '  if (!tasks) return <Spinner />;'],
  ['+', ''],
  ['+', '  return ('],
  ['+', '    <main className="mx-auto max-w-5xl px-6 py-10">'],
  ['+', '      <h1 className="text-2xl font-semibold">Sprint board</h1>'],
  ['+', '      <p className="mb-6 text-sm text-slate-500">Drag a card to move it.</p>'],
  ['+', '      <Board initial={tasks} />'],
  ['+', '    </main>'],
  ['+', '  );'],
  [' ', '}'],
];

/** Number a patch. Removed lines keep the number; everything else takes one. */
function number(rows, start) {
  let n = start;
  return rows.map(([mark, text]) => {
    const line = { n, mark, text };
    if (mark !== '-') n += 1;
    return line;
  });
}

const WRITE_LINES = number(
  NEW_FILE.split('\n').map((text) => ['+', text]),
  1,
);
const EDIT_LINES = number(PATCH, 1);

const ADDED = [...WRITE_LINES, ...EDIT_LINES].filter((l) => l.mark === '+').length;
const REMOVED = EDIT_LINES.filter((l) => l.mark === '-').length;

/* ------------------------------------------------------------ the run */

export const BUILD = {
  open: [200, 900],
  prompt: [1000, 3300],
  send: 3400,
  think: [3500, 5300],
  tools: [5400, 6000, 6600],
  writeAt: 7200,
  write: [7350, 9750],
  editAt: 10400,
  edit: [10550, 12950],
  cmdAt: 13600,
  cmdOut: 14600,
  doneAt: 15300,
  endCard: 16600,
  total: 19200,
};

const PROMPT = 'Build a sprint board with drag-and-drop columns.';

const TOOLS = [
  ['read_file', 'src/App.tsx', '38 lines'],
  ['list_dir', 'src/components', '6 entries'],
  ['read_file', 'src/types.ts', '12 lines'],
];

const clamp = (n) => Math.max(0, Math.min(1, n));
const span = ([a, b], t) => clamp((t - a) / (b - a));
const ease = (p) => 1 - Math.pow(1 - p, 3);
const lerp = (a, b, p) => a + (b - a) * p;

/* ------------------------------------------------------- highlighting */

/* Enough TypeScript and JSX to colour these two files correctly. A real
   grammar would be a dependency and a bundle; this is a dozen rules and
   no import. Order is the trick — an attribute has to be claimed before
   the plain identifier rule can take it. */
const RULES = [
  ['comment', /^\/\/[^\n]*/],
  ['string', /^(?:'[^']*'|"[^"]*"|`[^`]*`)/],
  ['tag', /^<\/?[A-Za-z][\w.]*/],
  ['attr', /^[a-zA-Z_$][\w$]*(?=\s*=\s*[{"'])/],
  [
    'keyword',
    /^\b(?:import|export|from|const|let|var|async|await|function|return|for|of|in|if|else|new|class|extends|implements|yield|type|interface|default|try|catch|throw|typeof)\b/,
  ],
  ['literal', /^\b(?:true|false|null|undefined|this)\b/],
  ['number', /^\b\d+(?:\.\d+)?\b/],
  ['type', /^\b[A-Z][A-Za-z0-9_]*\b/],
  ['fn', /^\b[a-zA-Z_$][\w$]*(?=\s*\()/],
  ['word', /^[a-zA-Z_$][\w$]*/],
  ['space', /^\s+/],
  ['punct', /^[\s\S]/],
];

const TONE = {
  text: C.text,
  tag: '#7EE787',
  attr: '#79C0FF',
  comment: C.faint,
  string: '#A5D6FF',
  keyword: '#FF7B72',
  literal: '#79C0FF',
  number: '#79C0FF',
  type: '#7EE787',
  fn: '#D2A8FF',
  word: C.text,
  space: C.text,
  punct: C.dim,
};

/* Highlighting is pure, and the same twenty lines are re-rendered on
   every frame of the run, so the result is worth keeping. */
const cache = new Map();

function tokens(src) {
  const hit = cache.get(src);
  if (hit) return hit;

  const out = [];
  let rest = src;
  /* Prose between two JSX tags is not TypeScript. Without this, the
     capital letter starting a sentence gets coloured as a type name,
     which is exactly the sort of tell a developer notices. Each line is
     tokenized on its own, so the machine only has to hold within one. */
  let mode = 'code';
  let depth = 0;

  while (rest) {
    if (mode === 'text') {
      const run = /^[^<{]+/.exec(rest);
      if (run) {
        out.push(['text', run[0]]);
        rest = rest.slice(run[0].length);
        continue;
      }
      if (rest[0] === '{') {
        mode = 'expr';
        depth = 1;
        out.push(['punct', '{']);
        rest = rest.slice(1);
        continue;
      }
      mode = 'code'; /* a '<': let the tag rule take it */
    }

    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (!m) continue;

      if (kind === 'tag') mode = 'tag';
      else if (mode === 'tag' && m[0] === '>') mode = 'text';
      else if (mode === 'expr' && m[0] === '{') depth += 1;
      else if (mode === 'expr' && m[0] === '}') {
        depth -= 1;
        if (depth === 0) mode = 'text';
      }

      out.push([kind, m[0]]);
      rest = rest.slice(m[0].length);
      break;
    }
  }

  cache.set(src, out);
  return out;
}

function Code({ src }) {
  return tokens(src).map(([kind, text], i) => (
    <span key={i} style={{ color: TONE[kind] }}>
      {text}
    </span>
  ));
}

function Caret() {
  return (
    <span
      className="ml-[1px] inline-block h-[0.95em] w-[6px] translate-y-[2px]"
      style={{ background: C.accent, animation: 'caret-blink 1.1s steps(1) infinite' }}
    />
  );
}

/* ---------------------------------------------------------- the parts */

/** A file the agent is writing, gutter and all. */
function FileBlock({ title, path, lines, shown }) {
  const visible = lines.slice(0, shown);

  return (
    <div style={{ animation: 'msg-in .3s ease-out both' }}>
      <div className="mb-1.5 flex items-center gap-2">
        <span style={{ color: C.accent }}>◆</span>
        <span className="font-semibold" style={{ color: C.text }}>
          {title}
        </span>
        <span style={{ color: '#7EE787' }}>{path}</span>
      </div>

      <div
        className="overflow-hidden rounded-[7px]"
        style={{ border: `1px solid ${C.line}`, background: 'rgba(255,255,255,.015)' }}
      >
        {visible.map((l, i) => (
          <div
            key={`${l.n}-${i}`}
            className="flex items-start"
            style={{
              background: l.mark === '+' ? C.addBg : l.mark === '-' ? C.delBg : 'transparent',
              minHeight: 18,
            }}
          >
            <span
              className="w-[42px] shrink-0 select-none pr-2.5 text-right"
              style={{ color: l.mark === '+' ? C.add : l.mark === '-' ? C.del : C.faint }}
            >
              {l.n}
            </span>
            <span
              className="w-[12px] shrink-0 select-none"
              style={{ color: l.mark === '+' ? C.add : l.mark === '-' ? C.del : 'transparent' }}
            >
              {l.mark === ' ' ? '' : l.mark}
            </span>
            <span className="min-w-0 flex-1 whitespace-pre pr-3">
              <Code src={l.text} />
              {i === visible.length - 1 && shown < lines.length && <Caret />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One tool the agent reached for, and what it got back. */
function Tool({ name, arg, meta }) {
  return (
    <div className="flex items-center gap-2" style={{ animation: 'msg-in .25s ease-out both' }}>
      <span style={{ color: C.faint }}>▸</span>
      <span style={{ color: '#79C0FF' }}>{name}</span>
      <span style={{ color: C.text }}>{arg}</span>
      <span style={{ color: C.faint }}>{meta}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- run */

export default function BuildFlow({ t, w, h }) {
  const scale = Math.min(1.3, (w - 56) / W, (h - 104) / H);

  const open = ease(span(BUILD.open, t));
  const typed = PROMPT.slice(0, Math.round(span(BUILD.prompt, t) * PROMPT.length));
  const typing = t >= BUILD.prompt[0] && t < BUILD.send;
  const sent = t >= BUILD.send;
  const thinking = t >= BUILD.think[0] && t < BUILD.think[1];
  const thought = t >= BUILD.think[1];

  const writeShown = t >= BUILD.writeAt ? Math.ceil(span(BUILD.write, t) * WRITE_LINES.length) : 0;
  const editShown = t >= BUILD.editAt ? Math.ceil(span(BUILD.edit, t) * EDIT_LINES.length) : 0;

  /* The context meter in the title bar, filling as the run uses it up. */
  const ctx = lerp(3.1, 18.4, clamp(t / BUILD.doneAt));

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className="flex flex-col overflow-hidden rounded-[13px]"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            background: C.shell,
            border: `1px solid ${C.line}`,
            boxShadow: '0 40px 80px -36px rgba(0,0,0,.7)',
            opacity: open,
            fontFamily: MONO,
            fontSize: 13,
            lineHeight: '18px',
          }}
        >
          {/* ---------------------------------------------------- title bar */}
          <div
            className="flex shrink-0 items-center gap-3 px-4"
            style={{ height: BAR, background: C.bar, borderBottom: `1px solid ${C.line}` }}
          >
            <span className="flex gap-[7px]">
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FF5F57' }} />
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#FEBC2E' }} />
              <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#28C840' }} />
            </span>
            <span className="ml-1.5" style={{ color: C.dim }}>
              sprint-board/main
            </span>

            <span className="ml-auto flex items-center gap-2.5">
              <span className="h-[7px] w-[64px] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,.1)' }}>
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${ctx * 4}%`, background: C.dim }}
                />
              </span>
              <span className="tabular-nums" style={{ color: C.dim }}>
                {ctx.toFixed(2)}%
              </span>
            </span>
          </div>

          {/* ------------------------------------------------------- session */}
          <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-4 py-3">
            {sent && (
              <div
                className="flex items-start gap-2.5 rounded-[7px] px-3 py-2"
                style={{ background: 'rgba(255,255,255,.04)', animation: 'msg-in .3s ease-out both' }}
              >
                <span style={{ color: C.accent }}>›</span>
                <span style={{ color: C.text }}>{PROMPT}</span>
              </div>
            )}

            {(thinking || thought) && (
              <div className="flex items-center gap-2" style={{ color: C.dim }}>
                <span style={{ color: C.accent }}>◆</span>
                {thinking ? 'Thinking…' : 'Thought for 1.8s'}
              </div>
            )}

            {TOOLS.map(([name, arg, meta], i) => t >= BUILD.tools[i] && (
              <Tool key={name + arg} name={name} arg={arg} meta={meta} />
            ))}

            {writeShown > 0 && (
              <FileBlock title="Write" path="src/components/Board.tsx" lines={WRITE_LINES} shown={writeShown} />
            )}

            {editShown > 0 && (
              <FileBlock title="Edit" path="src/App.tsx" lines={EDIT_LINES} shown={editShown} />
            )}

            {t >= BUILD.cmdAt && (
              <div className="flex flex-col gap-1" style={{ animation: 'msg-in .25s ease-out both' }}>
                <span className="flex items-center gap-2">
                  <span style={{ color: C.faint }}>$</span>
                  <span style={{ color: C.text }}>npm run build</span>
                </span>
                {t >= BUILD.cmdOut && (
                  <span className="pl-[18px]" style={{ color: C.add, animation: 'msg-in .25s ease-out both' }}>
                    ✓ built in 1.24s · 0 errors
                  </span>
                )}
              </div>
            )}

            {t >= BUILD.doneAt && (
              <div
                className="flex flex-wrap items-center gap-x-3 rounded-[7px] px-3 py-2"
                style={{
                  animation: 'note-flash 1.6s ease-out both',
                  background: 'rgba(226,130,63,.11)',
                  border: '1px solid rgba(226,130,63,.32)',
                }}
              >
                <span style={{ color: C.accent }}>✓</span>
                <span style={{ color: C.text }}>2 files changed</span>
                <span style={{ color: C.add }}>+{ADDED}</span>
                <span style={{ color: C.del }}>−{REMOVED}</span>
                <span style={{ color: C.dim }}>· build passed</span>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- the prompt */}
          <div
            className="flex shrink-0 items-center gap-2.5 px-4"
            style={{ height: FOOT, borderTop: `1px solid ${C.line}`, background: 'rgba(255,255,255,.02)' }}
          >
            <span style={{ color: C.accent }}>›</span>
            <span className="min-w-0 flex-1 truncate" style={{ color: typing ? C.text : C.faint }}>
              {typing ? typed : sent ? '' : ''}
              {!sent && <Caret />}
            </span>
            <span className="shrink-0" style={{ color: C.faint }}>
              openledger/auto · always-approve
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
