import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, p, useS, useT} from './theme';

/* ---------- Yellow card background with paper grain (same treatment as Saiqal) ---------- */
export const Bg: React.FC = () => {
  const t = useS();
  const seed = Math.floor(t * 15) % 7;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 85% at 50% 42%, ${C.yellowLight} 0%, ${C.yellow} 45%, ${C.yellowDeep} 100%)`}}>
      <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.28}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <svg width="100%" height="100%" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.18}}>
        <filter id="blotch">
          <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="3" seed={4} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 1.3 -0.35" />
        </filter>
        <rect width="100%" height="100%" filter="url(#blotch)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- RTL word reveal (whole words, Arabic joining intact) ---------- */
export const Words: React.FC<{
  text: string;
  at: number; // seconds
  stagger?: number;
  dur?: number;
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  hl?: string[];
}> = ({text, at, stagger = 0.11, dur = 0.55, size, color = C.brown, font = F.head, weight = 900, hl = []}) => {
  const t = useT();
  const words = text.split(' ');
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.3,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: size * 0.26,
        textShadow: '0 6px 0 rgba(14,77,59,.10)',
      }}
    >
      {words.map((w, i) => {
        if (w === '\n') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const k = p(t, at + i * stagger, dur);
        const isHl = hl.includes(w);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              clipPath: `inset(-25% 0 -25% ${(1 - k) * 100}%)`,
              transform: `translateY(${(1 - k) * 26}px)`,
              filter: `blur(${(1 - k) * 8}px)`,
              opacity: 0.2 + 0.8 * k,
            }}
          >
            {isHl && (
              <span
                style={{
                  position: 'absolute',
                  right: -10,
                  left: -10,
                  top: '18%',
                  bottom: '8%',
                  background: C.brown,
                  borderRadius: 14,
                  transformOrigin: 'right',
                  transform: `scaleX(${p(t, at + i * stagger + 0.2, 0.45)})`,
                }}
              />
            )}
            <span style={{position: 'relative', color: isHl ? C.yellow : undefined}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/* ---------- 3D extrusion: stacks layers along Z for a solid, lit 3D look ---------- */
export const Extrude: React.FC<{
  w: number;
  h: number;
  depth?: number;
  layers?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  scale?: number;
  render: (side: boolean) => React.ReactNode; // side = true → darker body layer
  style?: React.CSSProperties;
}> = ({w, h, depth = 40, layers = 14, rx = 0, ry = 0, rz = 0, scale = 1, render, style}) => (
  <div style={{position: 'absolute', width: w, height: h, perspective: 1400, ...style}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      }}
    >
      {Array.from({length: layers}, (_, i) => {
        const z = depth / 2 - (i / (layers - 1)) * depth;
        const side = i > 0;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transform: `translateZ(${z}px)`, filter: side ? `brightness(${0.78 - (i / layers) * 0.18})` : undefined}}>
            {render(side)}
          </div>
        );
      })}
    </div>
  </div>
);

/* Soft contact shadow under floating 3D objects */
export const Contact: React.FC<{x: number; y: number; w: number; k: number}> = ({x, y, w, k}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y,
      width: w,
      height: w * 0.18,
      borderRadius: '50%',
      background: 'rgba(14,77,59,.35)',
      filter: 'blur(14px)',
      opacity: k,
      transform: `scaleX(${0.6 + 0.4 * k})`,
    }}
  />
);

/* ---------- Icons (SVG, brown on cream) ---------- */
export const IconHome = ({c = C.brown}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <path d="M8 22 L24 9 L40 22 V39 a3 3 0 0 1 -3 3 H11 a3 3 0 0 1 -3 -3 Z" fill="none" stroke={c} strokeWidth="4.5" strokeLinejoin="round" />
    <circle cx="24" cy="33" r="3" fill={c} />
  </svg>
);
export const IconUser = ({c = C.brown}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <circle cx="24" cy="16" r="8" fill="none" stroke={c} strokeWidth="4.5" />
    <path d="M9 41 Q9 28 24 28 Q39 28 39 41" fill="none" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);
export const IconJoin = ({c = C.brown}) => (
  <svg viewBox="0 0 48 48" width="100%" height="100%">
    <rect x="9" y="7" width="30" height="36" rx="5" fill="none" stroke={c} strokeWidth="4.5" />
    <path d="M24 17 V33 M16 25 H32" stroke={c} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

/* 3D key-cap: rounded yellow button with icon and step number */
export const KeyCap3D: React.FC<{size: number; icon: React.ReactNode; n: number; k: number; t: number; seed: number}> = ({size, icon, n, k, t, seed}) => {
  const wob = Math.sin(t * 1.6 + seed) * 7;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <Contact x={size / 2} y={size * 1.02} w={size * 0.9} k={k} />
      <Extrude
        w={size}
        h={size}
        depth={size * 0.22}
        layers={16}
        rx={18 - 8 * k}
        ry={-26 * (1 - k) + wob}
        scale={k}
        render={(side) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: size * 0.26,
              background: side ? C.yellowDeep : `linear-gradient(150deg, #fff3c4 0%, ${C.yellowLight} 35%, ${C.yellow} 100%)`,
              boxShadow: side ? undefined : 'inset 0 -10px 0 rgba(14,77,59,.12), inset 0 6px 0 rgba(255,255,255,.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!side && <div style={{width: '52%', height: '52%'}}>{icon}</div>}
            {!side && (
              <div
                style={{
                  position: 'absolute',
                  top: -size * 0.12,
                  right: -size * 0.12,
                  width: size * 0.36,
                  height: size * 0.36,
                  borderRadius: '50%',
                  background: C.brown,
                  color: C.yellow,
                  fontFamily: F.head,
                  fontWeight: 900,
                  fontSize: size * 0.22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(14,77,59,.35)',
                }}
              >
                {n}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

/* 3D coin-badge that flips from "!" (problem) to "✓" (solved) */
export const FlipBadge3D: React.FC<{size: number; k: number; flip: number; t: number; seed: number}> = ({size, k, flip, t, seed}) => {
  // turn edge-on, swap the face (! → ✓) at 90°, turn back — the lit front face always faces camera
  const showBack = flip >= 0.5;
  const ry = (flip < 0.5 ? flip : 1 - flip) * 180 + Math.sin(t * 2 + seed) * 10;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <Contact x={size / 2} y={size * 1.0} w={size * 0.8} k={k} />
      <Extrude
        w={size}
        h={size}
        depth={size * 0.18}
        layers={14}
        rx={12}
        ry={ry}
        scale={k}
        render={(side) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: side ? '#0a3328' : showBack ? `linear-gradient(150deg, #fff3c4, ${C.yellow})` : `linear-gradient(150deg, #2f8a6c, ${C.brown})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                            boxShadow: side ? undefined : 'inset 0 6px 0 rgba(255,255,255,.25)',
            }}
          >
            {!side &&
              (showBack ? (
                <svg viewBox="0 0 48 48" width="56%" height="56%">
                  <path d="M11 25 L20 34 L37 14" fill="none" stroke={C.brown} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span style={{fontFamily: F.head, fontWeight: 900, fontSize: size * 0.56, color: C.yellow, lineHeight: 1}}>!</span>
              ))}
          </div>
        )}
      />
    </div>
  );
};

/* 3D clock disc — the LOH "O" as a floating motif (plays the role the 8-point star had) */
export const Clock3D: React.FC<{size: number; k: number; t: number; spin?: number}> = ({size, k, t, spin = 0}) => (
  <Extrude
    w={size}
    h={size}
    depth={size * 0.16}
    layers={12}
    rx={16}
    ry={-30 + Math.sin(t * 1.3) * 12}
    rz={(1 - k) * -90}
    scale={k}
    render={(side) => (
      <div style={{width: '100%', height: '100%', borderRadius: '50%', background: side ? '#0a3328' : C.brown, position: 'relative'}}>
        {!side && (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="38" fill="none" stroke={C.yellow} strokeWidth="5" strokeDasharray="52 8" transform="rotate(-80 50 50)" />
            <circle cx="50" cy="50" r="29" fill="none" stroke={C.yellow} strokeWidth="3" strokeDasharray="38 7" transform="rotate(-60 50 50)" />
            <g transform={`rotate(${spin} 50 54)`}>
              <path d="M38 46 L50 56 L66 38" fill="none" stroke={C.yellow} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        )}
      </div>
    )}
  />
);

/* ---------- Phone mockup that shows real app screenshots (920×2000) ---------- */
export const SCREEN = {w: 920, h: 2000};
export const Phone: React.FC<{w: number; screens: {src: string; x: number}[]; children?: React.ReactNode}> = ({w, screens, children}) => {
  const sw = w - 28;
  const sh = (sw * SCREEN.h) / SCREEN.w;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: sh + 28,
        borderRadius: w * 0.13,
        background: `linear-gradient(145deg, #6e5843, ${C.brown} 40%, #2c2117)`,
        boxShadow: '0 50px 80px rgba(14,77,59,.45), inset 0 2px 0 rgba(255,255,255,.25)',
        padding: 14,
      }}
    >
      <div style={{position: 'relative', width: sw, height: sh, borderRadius: w * 0.11, overflow: 'hidden', background: '#f7f7f7'}}>
        {screens.map((s, i) => (
          <Img key={i} src={staticFile(s.src)} style={{position: 'absolute', top: 0, left: 0, width: sw, height: sh, transform: `translateX(${s.x * sw}px)`}} />
        ))}
        <div style={{position: 'absolute', inset: 0}}>{children}</div>
      </div>
      <div style={{position: 'absolute', top: 26, left: '50%', width: w * 0.28, height: 30, marginLeft: -w * 0.14, borderRadius: 20, background: '#111'}} />
    </div>
  );
};

/* Finger-tap indicator: press dot + expanding ring */
export const Tap: React.FC<{x: number; y: number; at: number; t: number}> = ({x, y, at, t}) => {
  const a = p(t, at - 0.25, 0.25);
  const r = p(t, at, 0.5);
  const out = p(t, at + 0.35, 0.3);
  if (t < at - 0.3 || out >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: -60,
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: `6px solid ${C.yellow}`,
          transform: `scale(${0.3 + r * 1.2})`,
          opacity: (1 - r) * (1 - out),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -26,
          top: -26,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.55)',
          border: `5px solid ${C.brown}`,
          transform: `scale(${(0.6 + 0.4 * a) * (t > at && t < at + 0.12 ? 0.85 : 1)})`,
          opacity: a * (1 - out),
          boxShadow: '0 10px 20px rgba(0,0,0,.25)',
        }}
      />
    </div>
  );
};
