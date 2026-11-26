import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, staticFile} from 'remotion';
import {C, F, H, W, backOut, easeInOut, p, sec, useS} from './theme';
import {SHOT} from './shots';

/* ───────────────── ticket frame: cream border with inverted (bitten) corners ───────────────── */
export const TicketFrame: React.FC<{k?: number}> = ({k = 1}) => {
  const b = 26; // border
  const r = 62; // corner bite radius
  const x0 = b, y0 = b, x1 = W - b, y1 = H - b;
  // inner window with concave corners (evenodd hole)
  const hole = `M${x0 + r} ${y0} L${x1 - r} ${y0} A${r} ${r} 0 0 0 ${x1} ${y0 + r} L${x1} ${y1 - r} A${r} ${r} 0 0 0 ${x1 - r} ${y1} L${x0 + r} ${y1} A${r} ${r} 0 0 0 ${x0} ${y1 - r} L${x0} ${y0 + r} A${r} ${r} 0 0 0 ${x0 + r} ${y0} Z`;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: k}}>
      <path d={`M0 0 H${W} V${H} H0 Z ${hole}`} fill={C.frame} fillRule="evenodd" />
    </svg>
  );
};

/* ───────────────── plain brand ground (no texture, per the approved look) ───────────────── */
export const Ground: React.FC<{color: string}> = ({color}) => <AbsoluteFill style={{background: color}} />;

/* ───────────────── footage: full-bleed shot with zoom-settle then slow push ───────────────── */
export const Shot: React.FC<{id: number; len: number; t0: number; offset?: number; settle?: boolean; pos?: string}> = ({id, len, t0, offset = 0, settle = true, pos = '50% 50%'}) => {
  const t = useS() - t0;
  const s = SHOT[id];
  const avail = s.b - s.a - offset - 0.04;
  const rate = Math.max(0.05, Math.min(1, avail / len)); // never run past the cut: slow it instead
  const z = (settle ? interpolate(p(t, 0, 0.55), [0, 1], [1.13, 1.0]) : 1) + 0.045 * Math.min(1, t / Math.max(len, 0.01));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        <OffthreadVideo src={staticFile(`shots/part${s.part}.mp4`)} startFrom={sec(s.a + offset)} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A run of shots cut on the beat inside [t0, t1] (absolute seconds), reference-style montage */
export const Montage: React.FC<{ids: number[]; t0: number; t1: number; o: number; weights?: number[]; shade?: boolean; ground?: string}> = ({ids, t0, t1, o, weights, shade = true, ground}) => {
  const w = weights ?? ids.map(() => 1);
  const sum = w.reduce((a, b) => a + b, 0);
  let acc = t0;
  const card = !!ground;
  const t = useS() + o;
  const pop = p(t, t0, 0.55, backOut);
  const inner = (
    <>
      {ids.map((id, i) => {
        const len = ((t1 - t0) * w[i]) / sum;
        const st = acc;
        acc += len;
        const last = i === ids.length - 1;
        return (
          <Sequence key={i} from={sec(st - o)} durationInFrames={sec(len + (last ? 0.6 : 0.02))}>
            <Shot id={id} len={len} t0={st - o} />
          </Sequence>
        );
      })}
    </>
  );
  if (card) {
    return (
      <AbsoluteFill style={{background: ground}}>
        <div style={{position: 'absolute', left: 180, top: 380, width: 720, height: 1100, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.35)', transform: `scale(${0.86 + 0.14 * pop})`, opacity: Math.min(1, pop * 2)}}>
          {inner}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {inner}
      {/* soft right-side falloff so white captions read without a text shadow */}
      {shade && <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(20,16,4,.55) 0%, rgba(20,16,4,.22) 50%, rgba(20,16,4,0) 78%)'}} />}
    </AbsoluteFill>
  );
};

/** Stop-motion paper tags (10–12fps quantized jitter), like the reference's «ص ٢٠٢٣» slips */
export const PaperTags: React.FC<{t: number; items: {x: number; y: number; r: number; at: number; text: string}[]}> = ({t, items}) => {
  const q = Math.floor(t * 12) / 12;
  return (
    <>
      {items.map((it, i) => {
        if (q < it.at) return null;
        const jx = (random('tx' + i + Math.floor(q * 12)) - 0.5) * 3;
        const jy = (random('ty' + i + Math.floor(q * 12)) - 0.5) * 3;
        const jr = (random('tr' + i + Math.floor(q * 12)) - 0.5) * 1.2;
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: 'absolute',
              left: it.x + jx,
              top: it.y + jy,
              transform: `rotate(${it.r + jr}deg)`,
              background: C.frame,
              padding: '14px 30px 22px',
              fontFamily: F.head,
              fontWeight: 900,
              fontSize: 58,
              color: C.olive,
              boxShadow: '0 10px 18px rgba(0,0,0,.3), inset 0 -6px 0 rgba(0,0,0,.05)',
              borderRadius: 4,
            }}
          >
            {it.text}
          </div>
        );
      })}
    </>
  );
};

/* ───────────────── chroma flash: RGB split + light burst between chapters ───────────────── */
export const ChromaFlash: React.FC<{t: number; at: number}> = ({t, at}) => {
  const k = interpolate(t, [at - 0.12, at, at + 0.22], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (k <= 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#ff3b2f', mixBlendMode: 'screen', opacity: 0.35 * k, transform: `translateX(${-26 * k}px)`}} />
      <AbsoluteFill style={{background: '#1fd6ff', mixBlendMode: 'screen', opacity: 0.3 * k, transform: `translateX(${26 * k}px)`}} />
      <AbsoluteFill style={{background: '#fff8e6', opacity: 0.85 * k}} />
    </AbsoluteFill>
  );
};

/* ───────────────── 3D extrusion (layered Z stack) ───────────────── */
export const Extrude: React.FC<{w: number; h: number; depth?: number; layers?: number; rx?: number; ry?: number; rz?: number; scale?: number; render: (side: boolean) => React.ReactNode}> = ({
  w, h, depth = 40, layers = 14, rx = 0, ry = 0, rz = 0, scale = 1, render,
}) => (
  <div style={{position: 'absolute', width: w, height: h, perspective: 1600}}>
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
      {Array.from({length: layers}, (_, i) => {
        const z = depth / 2 - (i / (layers - 1)) * depth;
        const side = i > 0;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transform: `translateZ(${z}px)`, filter: side ? `brightness(${0.62 - (i / layers) * 0.2})` : undefined}}>
            {render(side)}
          </div>
        );
      })}
    </div>
  </div>
);

/** The Dar mark as a solid 3D object */
export const DarMark3D: React.FC<{size: number; k: number; t: number; color?: 'cream' | 'olive'; spin?: number}> = ({size, k, t, color = 'cream', spin = 0}) => (
  <Extrude
    w={size}
    h={size * (1168 / 1070)}
    depth={size * 0.07}
    layers={16}
    rx={10 + Math.sin(t * 1.1) * 5}
    ry={(1 - k) * -70 + Math.sin(t * 0.9) * 12 + spin}
    scale={0.6 + 0.4 * k}
    render={() => <Img src={staticFile(`logo/dar_mark_${color}.png`)} style={{width: '100%', height: '100%'}} />}
  />
);

/* ───────────────── perforated postage stamp holding a still from the footage ───────────────── */
export const Stamp: React.FC<{id: number; w: number; h: number; offset?: number}> = ({id, w, h, offset = 0.3}) => {
  const s = SHOT[id];
  const pr = 9; // perforation radius
  const step = 26;
  const holes: React.ReactNode[] = [];
  for (let x = step / 2; x < w; x += step) {
    holes.push(<circle key={'t' + x} cx={x} cy={0} r={pr} />, <circle key={'b' + x} cx={x} cy={h} r={pr} />);
  }
  for (let y = step / 2; y < h; y += step) {
    holes.push(<circle key={'l' + y} cx={0} cy={y} r={pr} />, <circle key={'r' + y} cx={w} cy={y} r={pr} />);
  }
  const id2 = `perf${id}`;
  return (
    <div style={{position: 'relative', width: w, height: h, filter: 'drop-shadow(0 22px 26px rgba(20,16,4,.38))'}}>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
        <defs>
          <mask id={id2}>
            <rect width={w} height={h} fill="#fff" />
            <g fill="#000">{holes}</g>
          </mask>
        </defs>
        <rect width={w} height={h} fill={C.frame} mask={`url(#${id2})`} />
      </svg>
      <div style={{position: 'absolute', inset: 24, overflow: 'hidden', background: '#000'}}>
        <OffthreadVideo src={staticFile(`shots/part${s.part}.mp4`)} startFrom={sec(s.a + offset)} playbackRate={Math.max(0.05, (s.b - s.a - offset - 0.05) / 3.2)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    </div>
  );
};

/* ───────────────── kashida: a widening run of the font's own tatweel glyph ───────────────── */
export const Kashida: React.FC<{right: string; left: string; px: number}> = ({right, left, px}) => (
  <span style={{whiteSpace: 'nowrap'}}>
    {right}
    {/* clip horizontally only — vertical overflow stays visible so the stroke is never cut */}
    <span style={{display: 'inline-block', width: px, clipPath: 'inset(-0.6em 0 -0.8em 0)', verticalAlign: 'top', whiteSpace: 'nowrap', direction: 'rtl'}}>
      <span>{'ـ'.repeat(40)}</span>
    </span>
    {left}
  </span>
);

/* ───────────────── twinkling glints ───────────────── */
export const Glints: React.FC<{t: number; at: number; n?: number; w: number; h: number; seed?: string; color?: string}> = ({t, at, n = 12, w, h, seed = 'g', color = '#fff7df'}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {Array.from({length: n}, (_, i) => {
      const x = random(seed + 'x' + i) * w;
      const y = random(seed + 'y' + i) * h;
      const sz = 14 + random(seed + 's' + i) * 26;
      const tw = Math.max(0, Math.sin((t - at) * 4.5 + random(seed + 'p' + i) * 6.28)) ** 3;
      const on = p(t, at + random(seed + 'd' + i) * 0.5, 0.3);
      return (
        <svg key={i} viewBox="-10 -10 20 20" width={sz} height={sz} style={{position: 'absolute', left: x, top: y, opacity: on * tw, transform: `rotate(${(t - at) * 40}deg) scale(${0.6 + tw * 0.6})`}}>
          <path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10 Z" fill={color} />
        </svg>
      );
    })}
  </div>
);

export {F, backOut, easeInOut};
