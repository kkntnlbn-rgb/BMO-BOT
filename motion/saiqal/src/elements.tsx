import React from 'react';
import {AbsoluteFill, Img, random, useCurrentFrame} from 'remotion';
import {C, prog, useT} from './theme';

/* ---------- Background: warm maroon card + paper grain + vignette ---------- */
export const PaperBg: React.FC = () => {
  const f = useT();
  const seed = Math.floor(f / 2) % 7; // grain boils at 15fps // boiling grain, 15fps
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 45%, ${C.bg} 0%, #521a06 55%, ${C.bgEdge} 100%)`}}>
      <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'overlay', opacity: 0.35}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.25}}>
        <filter id="blotch">
          <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" seed={3} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.1  0 0 0 0 0.03  0 0 0 1.4 -0.4" />
        </filter>
        <rect width="100%" height="100%" filter="url(#blotch)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- 8-point star (rub el hizb) with cream paper border ---------- */
export const Star8: React.FC<{size: number; x: number; y: number; t: number; rot?: number; style?: React.CSSProperties}> = ({
  size,
  x,
  y,
  t,
  rot = 0,
  style,
}) => {
  const s = 0.4 + 0.6 * t;
  const sq = (inset: number, fill: string, stroke?: string) => (
    <>
      <rect x={inset} y={inset} width={100 - 2 * inset} height={100 - 2 * inset} fill={fill} stroke={stroke} strokeWidth={stroke ? 1.2 : 0} />
      <rect
        x={inset}
        y={inset}
        width={100 - 2 * inset}
        height={100 - 2 * inset}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 1.2 : 0}
        transform="rotate(45 50 50)"
      />
    </>
  );
  return (
    <svg
      viewBox="-5 -5 110 110"
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        opacity: t,
        transform: `rotate(${rot + (1 - t) * -120}deg) scale(${s})`,
        filter: 'drop-shadow(0 10px 18px rgba(20,4,0,.55))',
        ...style,
      }}
    >
      {sq(12, C.paper)}
      {sq(18, C.gold)}
      {sq(27, C.goldDark)}
      {sq(31, C.gold)}
      <circle cx="50" cy="50" r="7" fill={C.paper} opacity={0.8} />
    </svg>
  );
};

/* ---------- Growing olive-like branch (stroke draw-on + leaves pop) ---------- */
export const Branch: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  t: number;
  seed?: number;
  flip?: boolean;
  sway?: number;
}> = ({x, y, scale = 1, rot = 0, t, seed = 1, flip = false, sway = 0}) => {
  const f = useT();
  const P0 = [0, 0];
  const P1 = [120, -40];
  const P2 = [260, 30];
  const pt = (u: number) => [
    (1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0],
    (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1],
  ];
  const leaves = Array.from({length: 16}, (_, i) => {
    const u = 0.08 + (i / 16) * 0.9;
    const [lx, ly] = pt(u);
    const side = i % 2 === 0 ? -1 : 1;
    const ang = side * (40 + random(`${seed}a${i}`) * 30) + u * 10;
    const len = 26 + random(`${seed}l${i}`) * 14 - u * 8;
    const appear = Math.max(0, Math.min(1, (t - u * 0.85) / 0.15));
    return {lx, ly, ang, len, appear, i};
  });
  const twigs = [0.3, 0.55, 0.78].map((u, k) => {
    const [tx, ty] = pt(u);
    const side = k % 2 ? 1 : -1;
    return {tx, ty, side, u};
  });
  const swayDeg = Math.sin(f / 40 + seed) * sway;
  return (
    <svg
      viewBox="-40 -120 360 240"
      width={360 * scale}
      height={240 * scale}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        overflow: 'visible',
        transformOrigin: '11% 50%',
        transform: `rotate(${rot + swayDeg}deg) scaleX(${flip ? -1 : 1})`,
        filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.35))',
      }}
    >
      <path
        d={`M${P0} Q${P1} ${P2}`}
        stroke="#6f6a4c"
        strokeWidth={3.2}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - t}
      />
      {twigs.map(({tx, ty, side, u}, k) => (
        <path
          key={k}
          d={`M${tx} ${ty} q 20 ${side * 30} 50 ${side * 44}`}
          stroke="#6f6a4c"
          strokeWidth={2}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, (t - u) / 0.2))}
        />
      ))}
      {leaves.map(({lx, ly, ang, len, appear, i}) => (
        <g key={i} transform={`translate(${lx} ${ly}) rotate(${ang}) scale(${appear})`}>
          <path d={`M0 0 Q ${len * 0.5} ${-len * 0.28} ${len} 0 Q ${len * 0.5} ${len * 0.28} 0 0`} fill={i % 3 ? '#8f8a63' : '#a7a37a'} />
          <path d={`M0 0 L ${len * 0.9} 0`} stroke="#5f5a3d" strokeWidth={0.8} />
        </g>
      ))}
    </svg>
  );
};

/* ---------- Rising steam ---------- */
export const Steam: React.FC<{x: number; y: number; t: number; h?: number}> = ({x, y, t, h = 360}) => {
  const f = useT();
  const plume = (phase: number, amp: number, w: number, op: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const yy = -(i / 24) * h * t;
      const k = i / 24;
      const xx = Math.sin(k * 5 + f * 0.07 + phase) * amp * (0.25 + k) + Math.sin(k * 11 - f * 0.05 + phase) * 8;
      pts.push(`${xx.toFixed(1)},${yy.toFixed(1)}`);
    }
    return <polyline points={pts.join(' ')} fill="none" stroke={C.cream} strokeWidth={w} strokeLinecap="round" opacity={op} />;
  };
  return (
    <svg
      width={500}
      height={h + 40}
      viewBox={`-250 ${-h} 500 ${h + 40}`}
      style={{position: 'absolute', left: x - 250, top: y - h, overflow: 'visible', filter: 'blur(14px)', opacity: 0.9 * t}}
    >
      <defs>
        <linearGradient id="fadeUp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.75" stopColor="#fff" stopOpacity={0.6} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="steamMask">
          <rect x={-250} y={-h} width={500} height={h + 40} fill="url(#fadeUp)" />
        </mask>
      </defs>
      <g mask="url(#steamMask)">
        {plume(0, 40, 46, 0.35)}
        {plume(2.1, 55, 34, 0.3)}
        {plume(4.2, 30, 26, 0.4)}
      </g>
    </svg>
  );
};

/* ---------- Decorated sweets bowl (drawn) ---------- */
export const Bowl: React.FC<{size: number}> = ({size}) => (
  <svg viewBox="0 0 300 220" width={size} height={(size * 220) / 300} style={{overflow: 'visible', filter: 'drop-shadow(0 18px 20px rgba(0,0,0,.5))'}}>
    <defs>
      <linearGradient id="bowlG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#b7473a" />
        <stop offset="1" stopColor="#6e1f1a" />
      </linearGradient>
      <radialGradient id="foodG" cx="0.5" cy="0.4">
        <stop offset="0" stopColor="#f5d27a" />
        <stop offset="1" stopColor="#b9862d" />
      </radialGradient>
    </defs>
    <ellipse cx="150" cy="60" rx="140" ry="34" fill="url(#foodG)" />
    {Array.from({length: 18}, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = 40 + (i % 3) * 28;
      return <circle key={i} cx={150 + Math.cos(a) * r} cy={60 + Math.sin(a) * r * 0.24} r={10 + (i % 4) * 2} fill={i % 2 ? '#f7c33e' : '#e7a92a'} />;
    })}
    <circle cx="150" cy="58" r="14" fill="#7ba04a" />
    <path d="M10 62 Q 20 190 150 205 Q 280 190 290 62 Q 150 104 10 62 Z" fill="url(#bowlG)" />
    <path d="M24 92 Q 150 132 276 92" stroke={C.paper} strokeWidth="9" fill="none" opacity="0.9" />
    {Array.from({length: 11}, (_, i) => (
      <rect key={i} x={36 + i * 21.5} y={118 + Math.sin((i / 10) * Math.PI) * 14} width="12" height="34" rx="2" fill={C.paper} opacity="0.75" />
    ))}
    <path d="M44 168 Q 150 198 256 168" stroke={C.paper} strokeWidth="6" fill="none" opacity="0.8" />
  </svg>
);

/* ---------- Torn paper frame holding a sepia portrait (slot for a real photo) ---------- */
export const TornFrame: React.FC<{w: number; h: number; src?: string | null; children?: React.ReactNode}> = ({w, h, src, children}) => {
  const n = 40;
  const edge: string[] = [];
  const j = (k: string) => (random(k) - 0.5) * 10;
  for (let i = 0; i <= n; i++) edge.push(`${(i / n) * w},${6 + j('t' + i)}`);
  for (let i = 0; i <= n; i++) edge.push(`${w - 6 + j('r' + i)},${(i / n) * h}`);
  for (let i = n; i >= 0; i--) edge.push(`${(i / n) * w},${h - 6 + j('b' + i)}`);
  for (let i = n; i >= 0; i--) edge.push(`${6 + j('l' + i)},${(i / n) * h}`);
  return (
    <div style={{position: 'relative', width: w, height: h, filter: 'drop-shadow(0 22px 30px rgba(15,3,0,.6))'}}>
      <svg width={w} height={h} style={{position: 'absolute'}}>
        <polygon points={edge.join(' ')} fill={C.paper} />
      </svg>
      <div style={{position: 'absolute', inset: 26, overflow: 'hidden', background: '#c9a978'}}>
        {src ? <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(.35)'}} /> : children}
      </div>
    </div>
  );
};

/* Generic heritage figure silhouette in sepia (placeholder – not a real person) */
export const SepiaFigure: React.FC = () => (
  <svg viewBox="0 0 300 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="sepBg" cx="0.5" cy="0.35">
        <stop offset="0" stopColor="#e8d2a6" />
        <stop offset="1" stopColor="#a98551" />
      </radialGradient>
    </defs>
    <rect width="300" height="360" fill="url(#sepBg)" />
    <path d="M30 360 Q 40 250 150 236 Q 260 250 270 360 Z" fill="#4a2c16" />
    <path d="M118 240 L150 300 L182 240 Z" fill="#efe6d4" />
    <path d="M86 250 Q 150 70 214 250 Q 196 200 150 196 Q 104 200 86 250 Z" fill="#f4eee2" />
    <ellipse cx="150" cy="150" rx="40" ry="50" fill="#b98a5e" />
    <path d="M110 112 Q 150 70 190 112 L 196 132 Q 150 110 104 132 Z" fill="#f4eee2" />
    <ellipse cx="150" cy="110" rx="50" ry="10" fill="none" stroke="#1d130c" strokeWidth="7" />
    <path d="M120 180 Q 150 210 180 180 Q 175 200 150 205 Q 125 200 120 180 Z" fill="#3a2a20" />
    <rect width="300" height="360" fill="#7a4a1e" opacity="0.12" />
  </svg>
);

/* Arabesque pattern strip (behind portrait) */
export const Arabesque: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg width={w} height={h} style={{opacity: 0.55}}>
    <defs>
      <pattern id="arab" width="36" height="36" patternUnits="userSpaceOnUse">
        <circle cx="18" cy="18" r="10" fill="none" stroke={C.paper} strokeWidth="1.4" />
        <path d="M18 0 Q 26 18 18 36 M0 18 Q 18 26 36 18" stroke={C.paper} strokeWidth="1" fill="none" />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#arab)" />
  </svg>
);

/* ---------- Ingredients ---------- */
export const SaffronPlate: React.FC<{size: number}> = ({size}) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{filter: 'drop-shadow(0 12px 16px rgba(0,0,0,.5))'}}>
    <circle cx="100" cy="100" r="96" fill="#d8c3a2" />
    <circle cx="100" cy="100" r="84" fill="#5a2310" />
    {Array.from({length: 120}, (_, i) => {
      const a = random('sa' + i) * Math.PI * 2;
      const r = Math.sqrt(random('sr' + i)) * 70;
      const x = 100 + Math.cos(a) * r;
      const y = 100 + Math.sin(a) * r;
      const ang = random('sg' + i) * 360;
      return <rect key={i} x={x} y={y} width="16" height="2.4" rx="1.2" fill={i % 4 ? '#c0281c' : '#e8892a'} transform={`rotate(${ang} ${x} ${y})`} />;
    })}
  </svg>
);

export const CardamomPlate: React.FC<{size: number}> = ({size}) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{filter: 'drop-shadow(0 12px 16px rgba(0,0,0,.5))'}}>
    <circle cx="100" cy="100" r="96" fill="#d8c3a2" />
    <circle cx="100" cy="100" r="84" fill="#6b4a2c" />
    {Array.from({length: 46}, (_, i) => {
      const a = random('ca' + i) * Math.PI * 2;
      const r = Math.sqrt(random('cr' + i)) * 64;
      const x = 100 + Math.cos(a) * r;
      const y = 100 + Math.sin(a) * r;
      return (
        <ellipse key={i} cx={x} cy={y} rx="13" ry="7.5" fill={i % 3 ? '#b49a6a' : '#9c8a55'} stroke="#6b5532" strokeWidth="1" transform={`rotate(${random('cg' + i) * 180} ${x} ${y})`} />
      );
    })}
  </svg>
);

export const RoseBottle: React.FC<{h: number}> = ({h}) => (
  <svg viewBox="0 0 120 260" height={h} width={(h * 120) / 260} style={{filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.5))'}}>
    <rect x="44" y="0" width="32" height="26" rx="4" fill="#cfc3b0" />
    <path d="M46 26 L 46 54 Q 10 70 10 110 L 10 244 Q 10 258 24 258 L 96 258 Q 110 258 110 244 L 110 110 Q 110 70 74 54 L 74 26 Z" fill="#efe3d4" opacity="0.92" />
    <path d="M18 110 L 18 240" stroke="#fff" strokeWidth="6" opacity="0.6" />
    <rect x="22" y="130" width="76" height="96" rx="4" fill="#f6eee3" stroke="#d9c7b2" />
    <circle cx="60" cy="168" r="14" fill="#c9566a" />
    <circle cx="54" cy="162" r="8" fill="#e07c8b" />
    <path d="M60 182 Q 56 200 60 212" stroke="#6c8a4a" strokeWidth="3" fill="none" />
  </svg>
);

/* ---------- Basbousa tray on a wooden table (food scene) ---------- */
export const TrayScene: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg viewBox="0 0 600 400" width={w} height={h} preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#3b1d0d" />
        <stop offset="1" stopColor="#1c0c05" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#wood)" />
    <rect y="250" width="600" height="150" fill="#5b2b17" />
    {Array.from({length: 8}, (_, i) => (
      <rect key={i} y={256 + i * 18} width="600" height="6" fill={i % 2 ? '#8a3a22' : '#c0873e'} opacity="0.55" />
    ))}
    <ellipse cx="140" cy="250" rx="110" ry="40" fill="#b88a3e" />
    <ellipse cx="140" cy="244" rx="92" ry="30" fill="#d9a54a" />
    {Array.from({length: 14}, (_, i) => (
      <circle key={i} cx={140 + Math.cos(i) * (20 + (i % 3) * 22)} cy={244 + Math.sin(i) * (6 + (i % 3) * 7)} r="7" fill="#8a5a22" />
    ))}
    <g transform="translate(300 90) skewX(-6)">
      <rect width="260" height="200" rx="18" fill={C.green} />
      <rect x="14" y="14" width="232" height="172" rx="8" fill="#d8b467" />
      {Array.from({length: 7 * 5}, (_, i) => {
        const cx = 14 + (i % 7) * 33.1 + 16.5;
        const cy = 14 + Math.floor(i / 7) * 34.4 + 17;
        return (
          <g key={i}>
            <rect x={cx - 15} y={cy - 15} width="30" height="30" fill="#e9c77c" stroke="#b78b3e" strokeWidth="1.2" />
            <circle cx={cx} cy={cy} r="3.4" fill="#8fae4f" />
          </g>
        );
      })}
    </g>
  </svg>
);

/* ---------- Copper tools still life ---------- */
export const CopperTools: React.FC<{w: number; h: number}> = ({w, h}) => (
  <svg viewBox="0 0 600 600" width={w} height={h} style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id="cu" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#e2a06a" />
        <stop offset="0.45" stopColor={C.copper} />
        <stop offset="1" stopColor={C.copperDark} />
      </linearGradient>
      <linearGradient id="woodSp" x1="0" x2="1">
        <stop offset="0" stopColor="#c19463" />
        <stop offset="1" stopColor="#8a5f37" />
      </linearGradient>
    </defs>
    <g filter="drop-shadow(0 16px 14px rgba(0,0,0,.55))">
      <ellipse cx="200" cy="150" rx="90" ry="34" fill="url(#cu)" />
      <rect x="270" y="142" width="250" height="16" rx="8" fill="url(#cu)" />
      <ellipse cx="420" cy="230" rx="60" ry="26" fill="url(#woodSp)" />
      <rect x="160" y="222" width="230" height="14" rx="7" fill="url(#woodSp)" />
      <rect x="236" y="200" width="16" height="230" rx="8" fill="url(#cu)" />
      <path d="M200 430 Q 244 520 288 430 Z" fill="url(#cu)" />
      <path d="M90 360 Q 90 300 160 300 Q 230 300 230 360 L 220 460 Q 160 490 100 460 Z" fill="url(#cu)" />
      <ellipse cx="160" cy="302" rx="70" ry="16" fill="#5a2a12" />
      <path d="M350 400 Q 350 330 420 330 Q 490 330 490 400 Q 490 470 420 470 Q 350 470 350 400 Z" fill="url(#cu)" />
      <path d="M490 380 Q 540 360 552 330" stroke={C.copper} strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M395 330 Q 420 290 445 330 Z" fill="url(#cu)" />
      <circle cx="420" cy="300" r="8" fill={C.copperDark} />
    </g>
  </svg>
);

/* ---------- Gulf khanjar (curved dagger in decorated sheath) ---------- */
export const Khanjar: React.FC<{h: number; flip?: boolean; t: number}> = ({h, flip, t}) => (
  <svg viewBox="0 0 220 700" height={h} width={(h * 220) / 700} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <defs>
      <linearGradient id="kg" x1="0" x2="1">
        <stop offset="0" stopColor="#7c3b19" />
        <stop offset="0.5" stopColor="#c27b45" />
        <stop offset="1" stopColor="#6a2f12" />
      </linearGradient>
      <pattern id="kpat" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="3" fill="none" stroke="#e1a873" strokeWidth="1.2" opacity="0.7" />
      </pattern>
      <clipPath id="kreveal">
        <rect x="-50" y={-50 + (1 - t) * 800} width="320" height="800" />
      </clipPath>
    </defs>
    <g clipPath="url(#kreveal)" opacity={0.9} filter="drop-shadow(0 10px 12px rgba(0,0,0,.45))">
      <path d="M86 40 Q 70 10 96 0 Q 136 -6 140 30 Q 142 60 124 70 Q 132 120 124 190 L 92 190 Q 86 120 96 72 Q 80 64 86 40 Z" fill="url(#kg)" />
      <rect x="78" y="186" width="62" height="20" rx="6" fill="#d39258" />
      <path d="M86 206 L 132 206 L 140 420 Q 146 500 196 506 Q 222 500 214 456 L 236 452 Q 252 540 192 556 Q 108 562 92 440 Z" fill="url(#kg)" />
      <path d="M86 206 L 132 206 L 140 420 Q 146 500 196 506 Q 222 500 214 456 L 236 452 Q 252 540 192 556 Q 108 562 92 440 Z" fill="url(#kpat)" />
      {[250, 300, 350, 400].map((y) => (
        <rect key={y} x="86" y={y} width="52" height="9" rx="4" fill="#e9b47c" opacity="0.85" />
      ))}
      <circle cx="210" cy="470" r="9" fill="#e9b47c" />
      <path d="M96 40 Q 112 20 130 36" stroke="#f0c48e" strokeWidth="4" fill="none" />
    </g>
  </svg>
);

/* A frame that slides a "photo" into place in cut-out pieces (collage reveal) */
export const CutoutReveal: React.FC<{
  w: number;
  h: number;
  pieces: {x: number; y: number; w: number; h: number; dx: number; dy: number; delay: number}[];
  f: number;
  start: number;
  dur?: number;
  children: React.ReactNode;
}> = ({w, h, pieces, f, start, dur = 18, children}) => (
  <div style={{position: 'relative', width: w, height: h}}>
    {pieces.map((p, i) => {
      const t = prog(f, start + p.delay, dur);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: h,
            clipPath: `inset(${p.y}px ${w - p.x - p.w}px ${h - p.y - p.h}px ${p.x}px round 6px)`,
            transform: `translate(${(1 - t) * p.dx}px, ${(1 - t) * p.dy}px)`,
            opacity: Math.min(1, t * 2),
            filter: `drop-shadow(0 10px 14px rgba(0,0,0,${0.5 * t}))`,
          }}
        >
          {children}
        </div>
      );
    })}
  </div>
);
