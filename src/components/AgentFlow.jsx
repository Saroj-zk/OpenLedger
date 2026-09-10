import React from 'react';
import { Plane } from 'lucide-react';
import { BrandTile } from './ui/Glyphs';
import { Mark } from './ui/Ledger';

/* =====================================================================
   Built for Agents — the architecture run.

   Not a chat window, and not an abstract box diagram either. There is a
   MacBook on the left running an agent, and everything that happens to
   it happens on its screen: the prompt is typed into the composer, the
   run log fills in underneath, the booking confirms there. To the right
   is the wiring — one API into the routing layer, the layer fanned out
   to the models, and a second route down to a paid service once the
   agent needs to act.

   The device matters. A floating "Agent" node asks the viewer to
   imagine where the work is happening; a laptop with a prompt on it
   does not.

   Two rules hold the wiring together, and both are what make a diagram
   read as engineering rather than decoration:

     · every connector runs on the horizontal or the vertical, never a
       diagonal, with a small radius at the turns;
     · every connector is dotted and ends in an arrowhead, so direction
       is legible when nothing is moving, and traffic is shown by the
       dots marching rather than by a bead sliding down a wire — a
       single travelling dot reads as a loading spinner.

   Three lines carry all of it: the trunk out of the laptop at y=AXIS,
   the fan hanging off the vertical at x=BUS, and the drop from the
   layer down to the service. Everything is drawn in a fixed 980x470
   space and scaled to whichever stage is selected, so the geometry is
   written once and the 9:16 crop is the same picture rather than a
   different one. Like the chat scripts, the run is a pure function of
   elapsed milliseconds.
   ===================================================================== */

const W = 980;
const H = 470;

/* The one horizontal everything on the top half sits on. */
const AXIS = 200;

const LID = { x: 34, y: AXIS - 120, w: 344, h: 240 };
const HUB = { x: 470, y: AXIS - 46, w: 172, h: 92 };
const SVC = { x: 458, y: 356, w: 196, h: 78 };

/* The vertical the model fan hangs off. */
const BUS = 712;
const ROW = { x: 792, w: 158, h: 40 };

const MODELS = [
  { code: 'OA', name: 'GPT-4o', y: 119 },
  { code: 'AN', name: 'Claude', y: 173 },
  { code: 'GG', name: 'Gemini', y: 227 },
  { code: 'DS', name: 'DeepSeek', y: 281 },
];
const GHOST_Y = 335;

export const FLOW = {
  laptopIn: [200, 1100],
  linkApi: [1150, 1950],
  hubIn: [1550, 2250],
  fan: [2350, 3350],
  modelsIn: [2550, 3750],
  prompt: [4100, 5500],
  send: 5600,
  /* the request leaves the laptop, then fans out */
  reqTrunk: [5700, 6150],
  reqFan: [6100, 6600],
  /* and comes back the same way */
  resFan: [6800, 7300],
  resTrunk: [7250, 7700],
  /* the agent has to pay for the booking */
  route402: [7900, 8600],
  svcIn: [8150, 8750],
  tx402: [8850, 9700],
  back402: [10000, 10600],
  result: 10700,
  endCard: 12000,
  total: 14000,
};

/* The copy column from the brief, each line held long enough to read. */
const LABELS = [
  [[1150, 2350], 'YOUR AGENT → OPENLEDGER'],
  [[2350, 3800], 'ONE API → 100+ AI MODELS'],
  [[3800, 5600], 'GPT · CLAUDE · GEMINI · DEEPSEEK · + MORE'],
  [[5600, 7800], 'ACTION REQUIRED'],
  [[7800, 8850], 'AGENT PAYS THE SERVICE DIRECTLY'],
  [[8850, 10700], 'x402 → PAYMENT AUTHORIZED ✓'],
  [[10700, 12100], 'FLIGHT BOOKED ✓'],
];

const PROMPT = 'Book a flight to Tokyo.';

const clamp = (n) => Math.max(0, Math.min(1, n));
const span = ([a, b], t) => clamp((t - a) / (b - a));
const ease = (p) => 1 - Math.pow(1 - p, 3);
const lerp = (a, b, p) => a + (b - a) * p;

function labelAt(t) {
  for (const [range, text] of LABELS) if (t >= range[0] && t < range[1]) return text;
  return null;
}

/* ------------------------------------------------------------- routing */

/* Corner radius on the turns. Small enough that the run still reads as
   orthogonal, large enough that the joins are not sharp pixels. */
const R = 9;

/** An orthogonal path through the given points, with softened corners. */
function drawn(pts) {
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const p = pts[i];
    const a = pts[i - 1];
    const b = pts[i + 1];
    const rIn = Math.min(R, Math.hypot(p.x - a.x, p.y - a.y) / 2);
    const rOut = Math.min(R, Math.hypot(b.x - p.x, b.y - p.y) / 2);
    const i1 = { x: p.x + Math.sign(a.x - p.x) * rIn, y: p.y + Math.sign(a.y - p.y) * rIn };
    const i2 = { x: p.x + Math.sign(b.x - p.x) * rOut, y: p.y + Math.sign(b.y - p.y) * rOut };
    d += ` L${i1.x} ${i1.y} Q${p.x} ${p.y} ${i2.x} ${i2.y}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last.x} ${last.y}`;
}

/**
 * A connector, as both a path and a measurable polyline. The polyline is
 * what lets a travelling arrow be placed analytically at any progress
 * without reaching into the DOM for getPointAtLength.
 */
function route(...pts) {
  const segs = [];
  let len = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, l, at: len });
    len += l;
  }
  return { d: drawn(pts), len, segs };
}

/** Position and heading at a fraction along a route. */
function pointAt(r, p) {
  const target = clamp(p) * r.len;
  let seg = r.segs[r.segs.length - 1];
  for (const s of r.segs) {
    if (target <= s.at + s.l) {
      seg = s;
      break;
    }
  }
  const q = seg.l ? clamp((target - seg.at) / seg.l) : 1;
  return {
    x: lerp(seg.a.x, seg.b.x, q),
    y: lerp(seg.a.y, seg.b.y, q),
    a: (Math.atan2(seg.b.y - seg.a.y, seg.b.x - seg.a.x) * 180) / Math.PI,
  };
}

const ARROW = 'M-6.5 -4.6 L2 0 L-6.5 4.6 Z';

/**
 * One connector.
 *
 * `draw` lays the wire in. The dotted stroke cannot double as the reveal
 * — a dash pattern can only be one thing — so the reveal is a mask: a
 * fat white stroke on the same path whose dash offset retreats. The mask
 * is given explicit user-space bounds, because the default object bounds
 * collapse to nothing on a perfectly horizontal line and would hide the
 * wire entirely.
 *
 * `live` is 0, 1 or -1: no traffic, traffic outbound, traffic returning.
 */
function Wire({ id, path, draw, live = 0, arrows = [] }) {
  if (draw <= 0) return null;
  const head = pointAt(path, 1);
  const hot = live !== 0;

  return (
    <g>
      <mask id={`wire-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
        <path
          d={path.d}
          fill="none"
          stroke="#fff"
          strokeWidth="20"
          strokeLinecap="butt"
          strokeDasharray={path.len}
          strokeDashoffset={path.len * (1 - draw)}
        />
      </mask>

      <g mask={`url(#wire-${id})`}>
        <path
          d={path.d}
          fill="none"
          strokeWidth={hot ? 2.1 : 1.7}
          strokeLinecap="round"
          strokeDasharray="2 7"
          stroke={hot ? 'var(--color-brand-accent)' : 'var(--rule-strong)'}
          style={hot ? { animation: `${live > 0 ? 'ants-fwd' : 'ants-rev'} .5s linear infinite` } : undefined}
        />
      </g>

      {draw > 0.97 && (
        <g transform={`translate(${head.x} ${head.y}) rotate(${head.a})`}>
          <path d={ARROW} fill={hot ? 'var(--color-brand-accent)' : 'var(--rule-strong)'} />
        </g>
      )}

      {arrows.map(({ p, rev }, i) => {
        const pt = pointAt(path, p);
        return (
          <g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${pt.a + (rev ? 180 : 0)})`}>
            <path d={ARROW} fill="var(--color-brand-accent)" transform="scale(1.15)" />
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------- panels */

/** A titled panel on the wiring: a strip of label over a body. */
function Panel({ box, appear, accent, strip, children }) {
  return (
    <div
      className="absolute flex flex-col rounded-[15px] border"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: appear,
        transform: `scale(${lerp(0.95, 1, appear)})`,
        borderColor: accent
          ? 'color-mix(in srgb, var(--color-brand-accent) 48%, transparent)'
          : 'var(--color-border)',
        background: 'var(--color-card)',
        boxShadow: accent
          ? '0 22px 46px -24px var(--color-brand-glow)'
          : '0 16px 32px -22px rgba(16,13,10,.45)',
      }}
    >
      <div
        className="flex items-center justify-center border-b py-[4px]"
        style={{
          borderRadius: '14px 14px 0 0',
          borderColor: accent
            ? 'color-mix(in srgb, var(--color-brand-accent) 26%, transparent)'
            : 'var(--color-border)',
          background: accent
            ? 'color-mix(in srgb, var(--color-brand-accent) 11%, transparent)'
            : 'var(--color-tertiary)',
        }}
      >
        <span
          className="ui-label text-[8px]"
          style={{ color: accent ? 'var(--color-accent)' : 'var(--color-faint)' }}
        >
          {strip}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-[3px] text-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- laptop screen */

/** One line of the agent's run log. */
function Step({ show, done, children }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-[7px]" style={{ animation: 'msg-in .3s ease-out both' }}>
      {done ? (
        <span
          className="grid h-[13px] w-[13px] shrink-0 place-items-center rounded-full"
          style={{ background: 'color-mix(in srgb, var(--color-brand-accent) 18%, transparent)' }}
        >
          <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true">
            <path
              d="M2 6.2 4.6 8.8 10 3.2"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <span className="h-[13px] w-[13px] shrink-0 animate-spin rounded-full border-[1.5px] border-[color:var(--color-border)] border-t-[color:var(--color-brand-accent)]" />
      )}
      <span
        className="text-[10.5px] leading-none"
        style={{ color: done ? 'var(--color-graphite)' : 'var(--color-faint)' }}
      >
        {children}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- run */

export default function AgentFlow({ t, w, h }) {
  /* The label chip below needs about 90px; the rest of the frame is the
     diagram's. Allowed past 1:1 so a 16:9 stage is actually filled. */
  const scale = Math.min(1.12, (w - 60) / W, (h - 130) / H);

  const laptop = ease(span(FLOW.laptopIn, t));
  const link = ease(span(FLOW.linkApi, t));
  const hub = ease(span(FLOW.hubIn, t));
  const fan = ease(span(FLOW.fan, t));
  const svc = ease(span(FLOW.svcIn, t));
  const drop = ease(span(FLOW.route402, t));
  const rest = ease(clamp(span(FLOW.modelsIn, t) * 1.3 - 0.52));

  const running = ([a, b]) => t >= a && t < b;
  const reqTrunk = running(FLOW.reqTrunk) ? span(FLOW.reqTrunk, t) : null;
  const reqFan = running(FLOW.reqFan) ? span(FLOW.reqFan, t) : null;
  const resFan = running(FLOW.resFan) ? span(FLOW.resFan, t) : null;
  const resTrunk = running(FLOW.resTrunk) ? span(FLOW.resTrunk, t) : null;
  const tx = running(FLOW.tx402) ? span(FLOW.tx402, t) : null;
  const rx = running(FLOW.back402) ? span(FLOW.back402, t) : null;

  const connected = t >= FLOW.linkApi[1];
  const typed = PROMPT.slice(0, Math.round(span(FLOW.prompt, t) * PROMPT.length));
  const typing = t >= FLOW.prompt[0] && t < FLOW.send;
  const sent = t >= FLOW.send;
  const calling = t >= FLOW.reqTrunk[0];
  const answered = t >= FLOW.resTrunk[1];
  const paying = t >= FLOW.tx402[0];
  const paid = t >= FLOW.tx402[1];
  const booked = t >= FLOW.result;
  const label = labelAt(t);

  /* The three runs of wire. */
  const trunk = route({ x: LID.x + LID.w + 10, y: AXIS }, { x: HUB.x - 3, y: AXIS });
  const branches = MODELS.map((m) =>
    route({ x: HUB.x + HUB.w + 3, y: AXIS }, { x: BUS, y: AXIS }, { x: BUS, y: m.y }, { x: ROW.x - 3, y: m.y }),
  );
  const ghostBranch = route(
    { x: HUB.x + HUB.w + 3, y: AXIS },
    { x: BUS, y: AXIS },
    { x: BUS, y: GHOST_Y },
    { x: ROW.x - 3, y: GHOST_Y },
  );
  const paidRoute = route({ x: SVC.x + SVC.w / 2, y: HUB.y + HUB.h + 3 }, { x: SVC.x + SVC.w / 2, y: SVC.y - 3 });

  /* Models light in sequence as the fan carries the request. */
  const modelHeat = (i) => {
    if (reqFan !== null) return clamp(reqFan * 1.35 - i * 0.1) > 0.5 ? 1 : 0;
    if (resFan !== null || (t >= FLOW.reqFan[1] && t < FLOW.resFan[1])) return 1;
    return 0;
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div style={{ width: W * scale, height: H * scale }}>
        <div
          className="relative"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {/* ------------------------------------------------------ wiring */}
          <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <Wire
              id="trunk"
              path={trunk}
              draw={link}
              live={reqTrunk !== null ? 1 : resTrunk !== null ? -1 : 0}
              arrows={[
                ...(reqTrunk !== null ? [{ p: reqTrunk }] : []),
                ...(resTrunk !== null ? [{ p: 1 - resTrunk, rev: true }] : []),
              ]}
            />

            {branches.map((b, i) => (
              <Wire
                key={MODELS[i].code}
                id={`fan${i}`}
                path={b}
                draw={ease(clamp(fan * 1.25 - i * 0.07))}
                live={reqFan !== null ? 1 : resFan !== null ? -1 : 0}
                arrows={[
                  ...(reqFan !== null ? [{ p: clamp(reqFan * 1.35 - i * 0.1) }] : []),
                  ...(resFan !== null ? [{ p: 1 - clamp(resFan * 1.35 - i * 0.1), rev: true }] : []),
                ]}
              />
            ))}

            <g opacity="0.55">
              <Wire id="fan-rest" path={ghostBranch} draw={rest} />
            </g>

            <Wire
              id="x402"
              path={paidRoute}
              draw={drop}
              live={tx !== null ? 1 : rx !== null ? -1 : 0}
              arrows={[
                ...(tx !== null ? [{ p: tx }] : []),
                ...(rx !== null ? [{ p: 1 - rx, rev: true }] : []),
              ]}
            />
          </svg>

          {/* ------------------------------------------------------ laptop */}
          <div
            className="absolute"
            style={{
              left: LID.x,
              top: LID.y,
              width: LID.w,
              opacity: laptop,
              transform: `translateY(${lerp(16, 0, laptop)}px)`,
            }}
          >
            {/* the lid: aluminium shell, thin bezel, camera in the top rail */}
            <div
              className="relative"
              style={{
                width: LID.w,
                height: LID.h,
                borderRadius: 15,
                padding: '11px 9px 11px',
                background: 'linear-gradient(158deg,#4a453e 0%,#2b2723 26%,#1c1916 62%,#141110 100%)',
                boxShadow:
                  '0 34px 64px -30px rgba(16,13,10,.62), inset 0 1px 0 rgba(255,255,255,.16), inset 0 0 0 1px rgba(0,0,0,.35)',
              }}
            >
              {/* camera */}
              <span
                className="absolute left-1/2 top-[4.5px] h-[3px] w-[3px] rounded-full"
                style={{ marginLeft: -1.5, background: '#4b4842', boxShadow: '0 0 0 1px rgba(0,0,0,.5)' }}
              />

              {/* the display */}
              <div
                className="relative flex h-full flex-col overflow-hidden"
                style={{ borderRadius: 6, background: 'var(--color-card)' }}
              >
                {/* title bar */}
                <div
                  className="flex shrink-0 items-center gap-[6px] border-b px-[9px]"
                  style={{
                    height: 25,
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-tertiary)',
                  }}
                >
                  <span className="flex gap-[4px]">
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#ff5f57' }} />
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#febc2e' }} />
                    <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#28c840' }} />
                  </span>
                  <span className="ml-[5px] text-[10.5px] font-semibold text-foreground">Travel Agent</span>
                  <span
                    className="ui-label ml-auto flex items-center gap-[4px] rounded-full border px-[6px] py-[2px] text-[7.5px] transition-colors duration-500"
                    style={{
                      borderColor: connected
                        ? 'color-mix(in srgb, var(--color-brand-accent) 40%, transparent)'
                        : 'var(--color-border)',
                      background: 'var(--color-card)',
                      color: connected ? 'var(--color-accent)' : 'var(--color-faint)',
                    }}
                  >
                    <span
                      className="h-[4px] w-[4px] rounded-full"
                      style={{ background: connected ? 'var(--color-brand-accent)' : 'var(--color-faint)' }}
                    />
                    {connected ? 'API connected' : 'connecting'}
                  </span>
                </div>

                <div className="flex min-h-0 flex-1">
                  {/* rail — three tools, the agent's own */}
                  <div
                    className="flex w-[28px] shrink-0 flex-col items-center gap-[6px] border-r pt-[9px]"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-tertiary)' }}
                  >
                    <span
                      className="h-[15px] w-[15px] rounded-[4px]"
                      style={{ background: 'color-mix(in srgb, var(--color-brand-accent) 78%, transparent)' }}
                    />
                    <span className="h-[15px] w-[15px] rounded-[4px]" style={{ background: 'var(--rule-strong)', opacity: 0.5 }} />
                    <span className="h-[15px] w-[15px] rounded-[4px]" style={{ background: 'var(--rule-strong)', opacity: 0.5 }} />
                  </div>

                  {/* thread */}
                  <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-[7px] overflow-hidden px-[10px] py-[9px]">
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14px]"
                      style={{ background: 'linear-gradient(180deg, var(--color-card), transparent)' }}
                    />
                    <div className="flex items-center justify-center gap-[5px]">
                      <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                      <span className="ui-label whitespace-nowrap text-[7.5px] text-[color:var(--color-faint)]">
                        New session
                      </span>
                      <span className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                    </div>

                    {connected && (
                      <div className="flex items-start gap-[6px]" style={{ animation: 'msg-in .35s ease-out both' }}>
                        <span
                          className="mt-[2px] grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full"
                          style={{ background: 'color-mix(in srgb, var(--color-brand-accent) 16%, transparent)' }}
                        >
                          <Mark size={9} className="text-accent" />
                        </span>
                        <span
                          className="rounded-[10px] rounded-bl-[3px] border px-[9px] py-[6px] text-[10.5px] leading-[1.4]"
                          style={{
                            borderColor: 'var(--color-border)',
                            background: 'var(--color-tertiary)',
                            color: 'var(--color-graphite)',
                          }}
                        >
                          Connected to OpenLedger — 100+ models and paid tools ready.
                        </span>
                      </div>
                    )}

                    {sent && (
                      <div className="flex justify-end" style={{ animation: 'msg-in .35s ease-out both' }}>
                        <span
                          className="max-w-[86%] rounded-[10px] rounded-br-[3px] px-[9px] py-[6px] text-[11.5px] leading-[1.35] text-foreground"
                          style={{
                            background: 'color-mix(in srgb, var(--color-brand-accent) 13%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-brand-accent) 26%, transparent)',
                          }}
                        >
                          {PROMPT}
                        </span>
                      </div>
                    )}

                    <Step show={calling} done={answered}>
                      {answered ? 'Routed via OpenLedger' : 'Calling OpenLedger…'}
                    </Step>
                    <Step show={paying} done={paid}>
                      {paid ? 'Payment authorised · x402' : 'Authorising payment…'}
                    </Step>

                    {booked && (
                      <div
                        className="rounded-[9px] border px-[9px] py-[6px] text-left"
                        style={{
                          animation: 'note-flash 1.6s ease-out both',
                          borderColor: 'color-mix(in srgb, var(--color-brand-accent) 40%, transparent)',
                          background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-foreground">LHR → HND</span>
                          <span className="ui-label text-[7.5px] text-accent">Confirmed</span>
                        </div>
                        <div className="mt-[2px] text-[9px] text-[color:var(--color-faint)]">
                          Tokyo · 14 Oct · nonstop · paid via x402
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* composer */}
                <div
                  className="flex shrink-0 items-center gap-[6px] border-t px-[9px]"
                  style={{ height: 34, borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
                >
                  <div
                    className="flex h-[22px] flex-1 items-center rounded-[7px] border px-[8px]"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-tertiary)' }}
                  >
                    <span
                      className="truncate text-[10.5px]"
                      style={{ color: typing ? 'var(--color-foreground)' : 'var(--color-faint)' }}
                    >
                      {typing ? typed : 'Message your agent…'}
                      {typing && <span className="caret ml-[1px] !h-[0.8em] !w-[3px] align-middle" />}
                    </span>
                  </div>
                  <span
                    className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full transition-colors duration-300"
                    style={{
                      background: typing ? 'var(--color-brand-accent)' : 'var(--rule-strong)',
                      color: typing ? '#fff' : 'var(--color-card)',
                    }}
                  >
                    <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true">
                      <path
                        d="M6 10V2.6M6 2.2 2.8 5.4M6 2.2 9.2 5.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {/* glass */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(118deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.05) 26%, rgba(255,255,255,0) 46%)',
                  }}
                />
              </div>
            </div>

            {/* hinge */}
            <div
              className="mx-auto"
              style={{
                width: LID.w - 104,
                height: 4,
                background: 'linear-gradient(180deg,#0d0b09,#2f2a24)',
                borderRadius: '0 0 3px 3px',
              }}
            />

            {/* deck */}
            <div
              className="relative"
              style={{
                width: LID.w + 64,
                marginLeft: -32,
                height: 12,
                borderRadius: '2px 2px 11px 11px',
                background: 'linear-gradient(180deg,#3d3830 0%,#28241f 34%,#171412 100%)',
                boxShadow: '0 18px 28px -14px rgba(16,13,10,.55), inset 0 1px 0 rgba(255,255,255,.14)',
              }}
            >
              {/* the scoop on the front edge */}
              <span
                className="absolute left-1/2 bottom-0 rounded-t-[6px]"
                style={{ width: 66, marginLeft: -33, height: 4, background: 'rgba(0,0,0,.55)' }}
              />
            </div>
          </div>

          {/* ------------------------------------------------- routing layer */}
          <Panel box={HUB} appear={hub} accent strip="Routing layer">
            <Mark size={20} className="text-accent" />
            <span className="text-[14.5px] font-semibold leading-none text-foreground">OpenLedger</span>
            <span className="text-[9.5px] leading-none text-[color:var(--color-faint)]">
              One API · 100+ models
            </span>
          </Panel>

          {/* ------------------------------------------------------- models */}
          {MODELS.map((m, i) => {
            const a = ease(clamp(span(FLOW.modelsIn, t) * 1.3 - i * 0.12));
            const heat = modelHeat(i);
            return (
              <div
                key={m.code}
                className="absolute flex items-center gap-[9px] rounded-[11px] border pl-[7px] pr-[10px] transition-colors duration-300"
                style={{
                  left: ROW.x,
                  top: m.y - ROW.h / 2,
                  width: ROW.w,
                  height: ROW.h,
                  opacity: a,
                  transform: `translateX(${lerp(-16, 0, a)}px)`,
                  background: 'var(--color-card)',
                  borderColor: heat
                    ? 'color-mix(in srgb, var(--color-brand-accent) 48%, transparent)'
                    : 'var(--color-border)',
                  boxShadow: heat
                    ? '0 16px 30px -20px var(--color-brand-glow)'
                    : '0 12px 24px -18px rgba(16,13,10,.42)',
                }}
              >
                <BrandTile code={m.code} size={24} round />
                <span className="text-[12.5px] font-medium leading-none text-foreground">{m.name}</span>
                <span
                  className="ml-auto h-[6px] w-[6px] shrink-0 rounded-full transition-colors duration-300"
                  style={{ background: heat ? 'var(--color-brand-accent)' : 'var(--rule-strong)' }}
                />
              </div>
            );
          })}

          {/* the rest of the catalog, standing in for itself */}
          <div
            className="absolute flex items-center justify-center rounded-[11px] border border-dashed"
            style={{
              left: ROW.x,
              top: GHOST_Y - ROW.h / 2,
              width: ROW.w,
              height: ROW.h - 6,
              opacity: rest,
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="ui-label text-[8.5px] text-[color:var(--color-faint)]">+ 96 more models</span>
          </div>

          {/* --------------------------------------------------- paid route */}
          <Panel box={SVC} appear={svc} strip="External service">
            <span className="flex items-center gap-[7px]">
              <span
                className="grid h-[22px] w-[22px] place-items-center rounded-[7px]"
                style={{ background: 'var(--color-tertiary)' }}
              >
                <Plane size={13} className="text-[color:var(--color-graphite)]" />
              </span>
              <span className="text-[13.5px] font-semibold leading-none text-foreground">Travel Service</span>
            </span>
            <span className="text-[9.5px] leading-none text-[color:var(--color-faint)]">Settled via x402</span>

            {paid && (
              <span
                className="absolute -right-3 -top-3 rounded-full px-[9px] py-[4px] text-[10px] font-semibold"
                style={{
                  animation: 'note-flash 1.6s ease-out both',
                  background: 'color-mix(in srgb, var(--color-brand-accent) 16%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-brand-accent) 40%, transparent)',
                  color: 'var(--color-accent)',
                }}
              >
                Paid ✓
              </span>
            )}
          </Panel>
        </div>
      </div>

      {/* the copy line for the beat currently running */}
      <div className="mt-6 flex h-8 items-center">
        {label && (
          <span
            key={label}
            className="rounded-[8px] bg-[color:var(--color-tertiary)] px-3.5 py-2 font-mono text-[12.5px] tracking-[0.02em] text-[color:var(--color-graphite)]"
            style={{ animation: 'msg-in .35s ease-out both' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
