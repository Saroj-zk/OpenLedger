import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Paperclip, ArrowUp, ChevronDown, Check, RotateCcw, Play, Pause, Search, Star } from 'lucide-react';
import { BrandTile } from './ui/Glyphs';
import { MODELS as CATALOG, MODEL_TOTAL, KINDS } from '../data/catalog';
import AgentFlow, { FLOW } from './AgentFlow';

/* =====================================================================
   /chat — the recording stage.

   Not a marketing section. This is a rig for screen capture: a fixed
   pixel stage, a scripted run, and a simulated cursor, so a take is
   identical every time and nobody has to drive a real mouse while
   recording.

   Each run is a pure function of elapsed milliseconds: a script's own
   `derive` returns the entire UI state for any point on its timeline,
   which means a run loops cleanly, scrubs, and can be re-timed by moving
   one number rather than by unpicking a chain of timeouts.

   Two scripts share the rig — one for multi-model and token optimisation,
   one for unified memory — and the switcher in the controls swaps them.

   The model picker sits in the composer and opens upward, which is where
   Claude, Perplexity and Cursor put it. A picker in the header belongs to
   an older generation of these apps.
   ===================================================================== */

/* ------------------------------------------------------------ scripts */

/* The picker lists the real catalog, grouped the way the models page
   groups it. The point of the scroll in the middle of a run is that the
   list does not end — inventing five rows would have undersold it. */
const GROUPS = KINDS.map((k) => ({ ...k, items: CATALOG.filter((m) => m.kind === k.id) })).filter(
  (g) => g.items.length,
);

const CLAUDE = 'Claude Opus 4';
const GPT = 'GPT-4o';
const byName = (n) => CATALOG.find((m) => m.name === n);
const codeOf = (id) => (id === 'auto' ? 'auto' : byName(id)?.code);

/* Roughly how tall the rendered list is, and how much of it shows at
   once. Used for the scrollbar thumb, so its size tells the truth about
   how much catalog is below the fold. */
const ROW_H = 53;
const HEADER_H = 28;
const VIEW_H = 250;
const LIST_H = GROUPS.reduce((n, g) => n + g.items.length * ROW_H + HEADER_H, 0);

const clamp = (n) => Math.max(0, Math.min(1, n));
const span = ([a, b], t) => clamp((t - a) / (b - a));
const ease = (p) => 1 - Math.pow(1 - p, 3);

/* Both scripts change model the same way, so the beat is written once. */
function applySwitch(s, t, T, target, scrollTo) {
  if (t >= T.cursorToPicker[0] && t < T.menuOpen) {
    s.cursor = { to: 'picker', p: span(T.cursorToPicker, t) };
  } else if (t >= T.menuOpen && t < T.cursorToClaude[0]) {
    s.cursor = { to: 'picker', p: 1 };
  } else if (t >= T.cursorToClaude[0] && t < T.pick) {
    s.cursor = { to: 'claude', p: span(T.cursorToClaude, t) };
  } else if (t >= T.pick && t < T.pick + 700) {
    s.cursor = { to: 'claude', p: 1 };
  }

  if (t >= T.menuOpen && t < T.pick) {
    s.menuOpen = true;
    /* Down through the catalog, then back to the top to choose. The
       travel is the argument: you cannot see the end of the list. */
    if (t < T.scrollDown[0]) s.menuScroll = 0;
    else if (t < T.scrollDown[1]) s.menuScroll = ease(span(T.scrollDown, t)) * scrollTo;
    else if (t < T.scrollUp[0]) s.menuScroll = scrollTo;
    else if (t < T.scrollUp[1]) s.menuScroll = scrollTo * (1 - ease(span(T.scrollUp, t)));
    else s.menuScroll = 0;
  }

  if (t >= T.pick) s.model = target;
  s.click = (t >= T.menuOpen && t < T.menuOpen + 260) || (t >= T.pick && t < T.pick + 260);
}

/* ---------------------------------------------- A · multi-model & tokens */

const TOKEN = {
  id: 'token',
  label: 'Token',
  start: 'auto',
  target: CLAUDE,
  endLine: 'Choose your model. Or let Auto handle it.',
  endSpec: ['Multi-model', 'Token optimized'],
  total: 19400,
  /* 1600px over five seconds, about 320px a second — slow enough to read
     a model name as it goes past. The earlier pass ran at nearly twice
     that and the list was a blur. */
  scrollTo: 1600,
  q1: 'Convert 2.5 ETH to USD at $4,200 per ETH.',
  a1: '2.5 ETH × $4,200 = **$10,500**',
  note1: 'Token optimized',
  q2: 'What factors could affect ETH this week?',
  a2: 'ETF flows, liquidity, network activity, and broader market sentiment are key factors to watch.',
  T: {
    type1: [400, 2000],
    send1: 2100,
    think1: [2100, 2550],
    reply1: [2550, 3150],
    /* Two full seconds sit between the answer landing and the cursor
       moving. The token note is the point of the first turn. */
    cursorToPicker: [5350, 5900],
    menuOpen: 5900,
    scrollDown: [6300, 11300],
    scrollUp: [11500, 12600],
    cursorToClaude: [12700, 13200],
    pick: 13200,
    type2: [13800, 15200],
    send2: 15300,
    think2: [15300, 15750],
    reply2: [15750, 17150],
    endCard: 17500,
  },
};

/* ------------------------------------------------------ B · unified memory */

const MEMORY = {
  id: 'memory',
  label: 'Memory',
  start: GPT,
  target: CLAUDE,
  endLine: 'Different model. Same context.',
  endSpec: ['One memory', 'Every model'],
  total: 15800,
  scrollTo: 700,
  q1: 'Help me plan the launch of our new mobile app. We’re targeting October with an invite-only beta first.',
  a1: 'Got it. We’ll plan around an **October launch**, starting with an **invite-only beta**.',
  note1: 'Memory updated',
  q2: 'Continue the launch plan from where I left off in ChatGPT.',
  a2: 'Got it. You’re planning an **October launch** with an **invite-only beta** first. Let’s continue with the rollout plan.',
  /* What the layer hands the second model. Shown in the thread, because
     the retrieval is the thing being demonstrated. */
  recall: ['Mobile App Launch', 'October', 'Invite-Only Beta'],
  T: {
    type1: [300, 2100],
    send1: 2200,
    think1: [2200, 2600],
    reply1: [2600, 3900],
    cursorToPicker: [5100, 5600],
    menuOpen: 5600,
    scrollDown: [5900, 7700],
    scrollUp: [7800, 8400],
    cursorToClaude: [8500, 8950],
    pick: 8950,
    type2: [9400, 10800],
    send2: 10900,
    recall: [11000, 11700],
    think2: [11700, 12100],
    reply2: [12100, 13600],
    endCard: 14000,
  },
};

/**
 * The entire UI state at time `t`, for one script. Nothing else in this
 * file holds animation state, which is what keeps the loop seamless.
 */
function makeDerive(SC) {
  const T = SC.T;
  return (t) => {
    const s = {
      draft: '',
      typing: false,
      messages: [],
      model: SC.start,
      menuOpen: false,
      thinking: false,
      cursor: null,
      click: false,
      endCard: false,
      menuScroll: 0,
    };

    /* --- turn one --- */
    if (t >= T.type1[0] && t < T.send1) {
      s.typing = true;
      s.draft = SC.q1.slice(0, Math.round(span(T.type1, t) * SC.q1.length));
    }
    if (t >= T.send1) s.messages.push({ role: 'user', text: SC.q1 });
    if (t >= T.think1[0] && t < T.think1[1]) s.thinking = true;
    if (t >= T.reply1[0]) {
      const done = t >= T.reply1[1];
      s.messages.push({
        role: 'model',
        model: codeOf(SC.start),
        text: SC.a1.slice(0, Math.round(span(T.reply1, t) * SC.a1.length)),
        note: done ? SC.note1 : null,
        streaming: !done,
      });
    }

    /* --- the switch --- */
    applySwitch(s, t, T, SC.target, SC.scrollTo);

    /* --- turn two --- */
    if (t >= T.type2[0] && t < T.send2) {
      s.typing = true;
      s.draft = SC.q2.slice(0, Math.round(span(T.type2, t) * SC.q2.length));
    }
    if (t >= T.send2) s.messages.push({ role: 'user', text: SC.q2 });

    if (SC.recall && t >= T.recall[0]) {
      s.messages.push({ role: 'recall', items: SC.recall, done: t >= T.recall[1] });
    }

    if (t >= T.think2[0] && t < T.think2[1]) s.thinking = true;
    if (t >= T.reply2[0]) {
      const done = t >= T.reply2[1];
      s.messages.push({
        role: 'model',
        model: codeOf(SC.target),
        text: SC.a2.slice(0, Math.round(span(T.reply2, t) * SC.a2.length)),
        streaming: !done,
      });
    }

    if (t >= T.endCard) s.endCard = true;
    return s;
  };
}

/* Not a chat at all: an architecture run that draws itself. It still
   supplies a total and an end line, so the rig can treat it like the
   others. */
const AGENTS = {
  id: 'agents',
  label: 'Agents',
  kind: 'diagram',
  total: FLOW.total,
  endLine: 'One API. 100+ models. Ready to act.',
  endSpec: ['One API', 'x402 ready'],
  derive: (t) => ({
    draft: '',
    typing: false,
    messages: [],
    model: 'auto',
    menuOpen: false,
    thinking: false,
    cursor: null,
    click: false,
    endCard: t >= FLOW.endCard,
    menuScroll: 0,
  }),
};

const SCRIPTS = {
  token: { ...TOKEN, kind: 'chat', derive: makeDerive(TOKEN) },
  memory: { ...MEMORY, kind: 'chat', derive: makeDerive(MEMORY) },
  agents: AGENTS,
};

/**
 * Auto's avatar. Deliberately not the OpenLedger mark — that reads as a
 * lightning bolt, which promises speed. Auto's job is choosing, so the
 * glyph is a path that splits.
 */
function AutoAvatar({ size = 22 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" width={Math.round(size * 0.62)} height={Math.round(size * 0.62)}>
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[color:var(--color-graphite)]"
        >
          <path d="M2.6 6.2h4.1l3 7.6h4.4M2.6 13.8h4.1" />
          <path d="m12.6 3.9 2.3 2.3-2.3 2.3M12.6 11.5l2.3 2.3-2.3 2.3" />
        </g>
      </svg>
    </span>
  );
}

/** Renders **bold** runs in accent, so the answer has a figure to land on. */
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? (
      <strong key={i} className="font-semibold text-accent">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/* ------------------------------------------------------------- stage */

const STAGES = {
  '16:9': { w: 1152, h: 648 },
  '1:1': { w: 780, h: 780 },
  '9:16': { w: 460, h: 818 },
};

/** Scales the fixed stage down to fit the window, never up past 1:1. */
function useFit(w, h) {
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => {
      const availW = window.innerWidth - 80;
      const availH = window.innerHeight - 150;
      setK(Math.min(1, availW / w, availH / h));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w, h]);
  return k;
}

/* ------------------------------------------------------------------ */

export default function ChatStudio() {
  const [script, setScript] = useState('token');
  const [aspect, setAspect] = useState('16:9');
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [bare, setBare] = useState(false);
  const [t, setT] = useState(0);

  const stageRef = useRef(null);
  const pickerRef = useRef(null);
  const claudeRef = useRef(null);
  const [anchors, setAnchors] = useState({});

  const { w, h } = STAGES[aspect];
  const k = useFit(w, h);
  const SC = SCRIPTS[script];
  const s = SC.derive(t);

  /* The clock. rAF is the right driver for a capture rig — it rides the
     compositor, so a recording gets even frames. Some embedded browsers
     never paint and so never fire it, which would leave the run frozen at
     zero; if no frame arrives promptly we fall back to a timer. */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let timer = 0;
    let last = performance.now();
    let sawFrame = false;
    let usingTimer = false;

    const advance = (now) => {
      const dt = (now - last) * speed;
      last = now;
      setT((prev) => (prev + dt) % SCRIPTS[script].total);
    };
    const step = (now) => {
      /* If the timer already took over, a late frame must not advance the
         clock as well — two drivers means double speed. */
      if (usingTimer) return;
      sawFrame = true;
      advance(now);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const check = setTimeout(() => {
      if (sawFrame) return;
      usingTimer = true;
      cancelAnimationFrame(raf);
      last = performance.now();
      timer = setInterval(() => advance(performance.now()), 16);
    }, 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(check);
      clearInterval(timer);
    };
  }, [playing, speed, script]);

  /* where the cursor is allowed to travel */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const read = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - box.left) / k, y: (r.top + r.height / 2 - box.top) / k };
    };
    setAnchors((prev) => ({
      ...prev,
      picker: read(pickerRef.current) || prev.picker,
      claude: read(claudeRef.current) || prev.claude,
    }));
  }, [t, k, aspect, s.menuOpen]);

  /* H hides the chrome so a take has nothing to crop out */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'h' || e.key === 'H') setBare((b) => !b);
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === 'r' || e.key === 'R') setT(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* cursor position: rest → picker → the Claude row */
  const rest = { x: w * 0.74, y: h * 0.82 };
  let cursorPos = null;
  if (s.cursor) {
    const to = anchors[s.cursor.to];
    if (to) {
      const from = s.cursor.to === 'claude' ? anchors.picker || rest : rest;
      const e = 1 - Math.pow(1 - s.cursor.p, 3);
      cursorPos = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
    }
  }

  const active = s.model === 'auto' ? { name: 'Auto', code: null } : byName(s.model);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[color:var(--color-background)] py-10">
      {/* ------------------------------------------------------- the stage */}
      <div style={{ width: w * k, height: h * k }}>
        <div
          ref={stageRef}
          className="relative overflow-hidden bg-[color:var(--color-background)]"
          style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: 'top left' }}
        >
          <div className="flex h-full flex-col items-center justify-center px-10">
            {/* the window */}
            {SC.kind === 'diagram' ? (
              <AgentFlow t={t} w={w} h={h} />
            ) : (
              <>
              <div className="panel flex w-full max-w-[720px] flex-col overflow-visible">
                {/* thread */}
                <div className="flex min-h-[300px] flex-col justify-end gap-5 px-6 py-6">
                  {s.messages.map((m, i) =>
                    m.role === 'recall' ? (
                      <div
                        key={i}
                        className="mx-auto w-full max-w-[86%] rounded-[13px] border px-4 py-3"
                        style={{
                          animation: 'msg-in .4s ease-out both',
                          borderColor: 'color-mix(in srgb, var(--color-brand-accent) 45%, transparent)',
                          background: 'color-mix(in srgb, var(--color-brand-accent) 8%, transparent)',
                        }}
                      >
                        <span className="ui-label text-[9px] text-accent">Unified memory</span>
                        <span className="mt-2 flex flex-wrap gap-1.5">
                          {m.items.map((it) => (
                            <span
                              key={it}
                              className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2.5 py-1 text-[11.5px] text-[color:var(--color-graphite)]"
                            >
                              {it}
                            </span>
                          ))}
                        </span>
                        {m.done && (
                          <span
                            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-accent"
                            style={{ animation: 'note-flash 1.5s ease-out both' }}
                          >
                            <Check size={11} />
                            Relevant context retrieved
                          </span>
                        )}
                      </div>
                    ) : m.role === 'user' ? (
                      <div key={i} className="flex justify-end" style={{ animation: 'msg-in .4s ease-out both' }}>
                        <p className="max-w-[76%] rounded-[18px] rounded-br-[6px] border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-4 py-2.5 text-[15px] leading-[1.5] text-foreground">
                          {m.text}
                        </p>
                      </div>
                    ) : (
                      <div key={i} className="flex gap-3">
                        {m.model === 'auto' ? (
                          <span className="mt-[2px]">
                            <AutoAvatar size={26} />
                          </span>
                        ) : (
                          <BrandTile code={m.model} size={26} round className="mt-[2px] shrink-0" />
                        )}
                        <span className="min-w-0 flex-1">
                          <p className="text-[15px] leading-[1.65] text-foreground">
                            <Rich text={m.text} />
                            {m.streaming && <span className="caret ml-0.5 align-middle" />}
                          </p>
                          {m.note && (
                            <span
                              className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-accent"
                              style={{ animation: 'note-flash 1.5s ease-out both' }}
                            >
                              <Check size={11} />
                              {m.note}
                            </span>
                          )}
                        </span>
                      </div>
                    ),
                  )}
  
                  {s.thinking && (
                    <div className="flex items-center gap-2 pl-[38px]">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-[6px] w-[6px] rounded-full bg-[color:var(--color-faint)]"
                          style={{ animation: `pulse-dot 1s ease-in-out ${i * 160}ms infinite` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
  
                {/* composer — the model picker lives here, not in a header */}
                <div className="relative px-3 pb-3">
                  <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 pb-2.5 pt-3.5 shadow-[0_4px_14px_-8px_rgba(16,13,10,.28)]">
                    <p className="min-h-[24px] text-[15px] leading-[1.5] text-foreground">
                      {s.draft || <span className="text-[color:var(--color-faint)]">Ask anything…</span>}
                      {s.typing && <span className="caret ml-0.5 align-middle" />}
                    </p>
  
                    <div className="mt-2 flex items-center gap-2">
                      <Paperclip size={16} className="shrink-0 text-[color:var(--color-faint)]" />
  
                      {/* the picker */}
                      <span ref={pickerRef} className="relative">
                        <span
                          className="flex cursor-default items-center gap-1.5 rounded-full border py-1 pl-1 pr-2 transition-colors duration-200"
                          style={{
                            borderColor: s.menuOpen ? 'var(--rule-strong)' : 'var(--color-border)',
                            background: s.menuOpen ? 'var(--color-tertiary)' : 'transparent',
                          }}
                        >
                          {s.model === 'auto' ? (
                            <AutoAvatar size={20} />
                          ) : (
                            <BrandTile code={active.code} size={20} round />
                          )}
                          <span className="max-w-[128px] truncate text-[12.5px] font-medium text-foreground">
                            {active.name}
                          </span>
                          <ChevronDown
                            size={13}
                            className="text-[color:var(--color-faint)] transition-transform duration-200"
                            style={{ transform: s.menuOpen ? 'rotate(180deg)' : 'none' }}
                          />
                        </span>
  
                        {/* Opens upward, because it sits at the bottom. Search, sort
                            and filters are shown but inert — this is a stage, and a
                            live search box would only invite someone to type into it
                            mid-take. The list itself is the real catalog. */}
                        {s.menuOpen && (
                          <span
                            className="absolute bottom-[calc(100%+10px)] left-0 z-40 block w-[372px] overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-[0_28px_60px_-18px_rgba(16,13,10,.55)]"
                            style={{ animation: 'msg-in .18s ease-out both' }}
                          >
                            {/* search + sort */}
                            <span className="flex items-center gap-2 px-3 pb-2.5 pt-3">
                              <span className="flex flex-1 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-3 py-2">
                                <Search size={14} className="shrink-0 text-[color:var(--color-faint)]" />
                                <span className="text-[13px] text-[color:var(--color-faint)]">Search models…</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-tertiary)] px-2.5 py-2 text-[color:var(--color-graphite)]">
                                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                                  <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M4.4 2.6v10.8M2.2 11.2l2.2 2.2 2.2-2.2" />
                                    <path d="M11.6 13.4V2.6M9.4 4.8l2.2-2.2 2.2 2.2" />
                                  </g>
                                </svg>
                                <span className="ui-label text-[9px]">A&ndash;Z</span>
                              </span>
                            </span>
  
                            {/* filters */}
                            <span className="flex items-center gap-1 border-b border-[color:var(--color-border)] px-3 pb-2.5">
                              <Star size={14} className="mr-1 shrink-0 text-[color:var(--color-faint)]" />
                              {['All', 'Text', 'Image', 'Video', 'Audio'].map((f) => {
                                const on = f === 'All';
                                return (
                                  <span
                                    key={f}
                                    className="rounded-full px-2.5 py-1 text-[12px]"
                                    style={{
                                      background: on ? 'var(--color-foreground)' : 'transparent',
                                      color: on ? 'var(--color-background)' : 'var(--color-graphite)',
                                      fontWeight: on ? 600 : 400,
                                    }}
                                  >
                                    {f}
                                  </span>
                                );
                              })}
                              {/* the count, because breadth is the point of this shot */}
                              <span className="ui-label ml-auto shrink-0 text-[9px] text-accent">
                                {MODEL_TOTAL}+
                              </span>
                            </span>
  
                            {/* Auto, pinned above the catalog */}
                            <span
                              className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-3 py-2.5"
                              style={{ background: s.model === 'auto' ? 'var(--color-tertiary)' : 'transparent' }}
                            >
                              <AutoAvatar size={30} />
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2">
                                  <span className="text-[13.5px] font-semibold text-foreground">Auto</span>
                                  <span className="shrink-0 rounded-full bg-[color:var(--color-brand-haze)] px-2 py-[2px] text-[10.5px] font-medium text-accent">
                                    Recommended
                                  </span>
                                </span>
                                <span className="mt-[1px] block truncate text-[11.5px] text-[color:var(--color-faint)]">
                                  Picks the cheapest model that can answer
                                </span>
                              </span>
                              {s.model === 'auto' && <Check size={15} className="shrink-0 text-accent" />}
                            </span>
  
                            {/* the catalog */}
                            <span className="relative block h-[250px] overflow-hidden">
                              <span className="block" style={{ transform: `translateY(${-s.menuScroll}px)` }}>
                                {GROUPS.map((g) => (
                                  <span key={g.id} className="block">
                                    <span className="ui-label block bg-[color:var(--color-tertiary)] px-3 py-1.5 text-[8.5px] text-[color:var(--color-faint)]">
                                      {g.label}
                                      <span className="tabular ml-1.5">{g.items.length}</span>
                                    </span>
  
                                    {g.items.map((m) => {
                                      const on = m.name === s.model;
                                      const web = /live source|search/i.test(`${m.description} ${m.bestFor}`);
                                      return (
                                        <span
                                          key={m.name}
                                          ref={m.name === CLAUDE ? claudeRef : null}
                                          className="flex items-center gap-3 px-3 py-2.5"
                                          style={{ background: on ? 'var(--color-tertiary)' : 'transparent' }}
                                        >
                                          <BrandTile code={m.code} size={30} round />
                                          <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2">
                                              <span className="truncate text-[13.5px] font-semibold text-foreground">
                                                {m.name}
                                              </span>
                                              <span
                                                className="shrink-0 rounded-full px-2 py-[2px] text-[10px] font-medium"
                                                style={{ background: 'rgba(124,58,237,.13)', color: '#6D33D6' }}
                                              >
                                                Incognito
                                              </span>
                                              {web && (
                                                <span className="shrink-0 rounded-full bg-[color:var(--color-tertiary)] px-2 py-[2px] text-[10.5px] text-[color:var(--color-graphite)]">
                                                  web
                                                </span>
                                              )}
                                            </span>
                                            <span className="mt-[1px] flex items-center gap-1.5 text-[11.5px] text-[color:var(--color-faint)]">
                                              {m.provider}
                                              <span aria-hidden="true">|</span>
                                              <span className="tabular font-mono">{m.detail}</span>
                                            </span>
                                          </span>
                                          {on ? (
                                            <Check size={15} className="shrink-0 text-accent" />
                                          ) : (
                                            <Star size={15} className="shrink-0 text-[color:var(--color-border)]" />
                                          )}
                                        </span>
                                      );
                                    })}
                                  </span>
                                ))}
                              </span>
  
                              <span className="pointer-events-none absolute bottom-1 right-1 top-1 w-[3px] rounded-full bg-[color:var(--color-border)]">
                                <span
                                  className="absolute left-0 w-full rounded-full bg-[color:var(--rule-strong)]"
                                  style={{
                                    height: `${Math.max(8, (VIEW_H / LIST_H) * 100)}%`,
                                    top: `${(s.menuScroll / (LIST_H - VIEW_H)) * (100 - Math.max(8, (VIEW_H / LIST_H) * 100))}%`,
                                  }}
                                />
                              </span>
                            </span>
                          </span>
                        )}
                      </span>
  
                      <span
                        className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity duration-200"
                        style={{ background: 'var(--color-brand-accent)', opacity: s.draft ? 1 : 0.45 }}
                      >
                        <ArrowUp size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}

            {/* the closing line */}
            <div
              className="mt-7 flex flex-col items-center gap-2.5 transition-opacity duration-500"
              style={{ opacity: s.endCard ? 1 : 0 }}
            >
              <p className="text-[17px] font-medium text-foreground">{SC.endLine}</p>
              <span className="ui-label flex items-center gap-2.5 text-[color:var(--color-graphite)]">
                {SC.endSpec[0]}
                <span className="text-[8px] text-[color:var(--color-faint)]">&#9670;</span>
                {SC.endSpec[1]}
              </span>
            </div>
          </div>

          {/* the pointer */}
          {cursorPos && (
            <span
              className="pointer-events-none absolute z-50"
              style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-3px, -2px)' }}
              aria-hidden="true"
            >
              {s.click && (
                <span
                  className="absolute -left-3 -top-3 block h-7 w-7 rounded-full border-2 border-[color:var(--color-brand-accent)]"
                  style={{ animation: 'chip-in .26s ease-out both', opacity: 0.7 }}
                />
              )}
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path
                  d="M2 1.6 15.4 12.2h-6.2l-1.5 6.6z"
                  fill="#fff"
                  stroke="#100d0a"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------- controls */}
      {!bare && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button onClick={() => setT(0)} className="btn btn-ghost px-3 py-2">
            <RotateCcw size={14} />
            Restart
          </button>
          <button onClick={() => setPlaying((p) => !p)} className="btn btn-ghost px-3 py-2">
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : 'Play'}
          </button>

          <span className="flex overflow-hidden rounded-full border border-[color:var(--color-border)]">
            {Object.values(SCRIPTS).map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setScript(sc.id);
                  setT(0);
                }}
                className="ui-label px-3 py-2 transition-colors"
                style={{
                  background: script === sc.id ? 'var(--color-tertiary)' : 'transparent',
                  color: script === sc.id ? 'var(--color-foreground)' : 'var(--color-faint)',
                }}
              >
                {sc.label}
              </button>
            ))}
          </span>

          <span className="flex overflow-hidden rounded-full border border-[color:var(--color-border)]">
            {[0.5, 0.75, 1, 1.25, 1.5].map((sp) => (
              <button
                key={sp}
                onClick={() => setSpeed(sp)}
                className="ui-label px-3 py-2 transition-colors"
                style={{
                  background: speed === sp ? 'var(--color-tertiary)' : 'transparent',
                  color: speed === sp ? 'var(--color-foreground)' : 'var(--color-faint)',
                }}
              >
                {sp}&times;
              </button>
            ))}
          </span>

          <span className="flex overflow-hidden rounded-full border border-[color:var(--color-border)]">
            {Object.keys(STAGES).map((a) => (
              <button
                key={a}
                onClick={() => setAspect(a)}
                className="ui-label px-3 py-2 transition-colors"
                style={{
                  background: aspect === a ? 'var(--color-tertiary)' : 'transparent',
                  color: aspect === a ? 'var(--color-foreground)' : 'var(--color-faint)',
                }}
              >
                {a}
              </button>
            ))}
          </span>

          <span className="ui-label ml-1 text-[color:var(--color-faint)]">
            {STAGES[aspect].w}&times;{STAGES[aspect].h}
            {k < 1 && ` · shown at ${Math.round(k * 100)}%`}
          </span>

          <button onClick={() => setBare(true)} className="btn btn-ghost px-3 py-2">
            Hide
          </button>

          <span className="ui-label w-full pt-1 text-center text-[color:var(--color-faint)]">
            H hides these &middot; Space pauses &middot; R restarts &middot; run is {(SC.total / 1000).toFixed(1)}s at 1&times;
          </span>
        </div>
      )}
    </div>
  );
}
