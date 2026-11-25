import React from 'react';
import {Img, random, staticFile} from 'remotion';
import {Extrude} from './fx';
import {C, p, backOut} from './theme';

/**
 * The hero: a real 3D bottle (Three.js lathe + clear-PET material, see three/BottleSpin.tsx),
 * pre-rendered as a 240-frame transparent turntable and played back at any speed.
 */
const frameSrc = (i: number) => staticFile(`bottle/element-${String(((i % 240) + 240) % 240).padStart(3, '0')}.webp`);
export const Bottle3D: React.FC<{h: number; t: number; spin?: number; tilt?: number; phase?: number; style?: React.CSSProperties}> = ({h, t, spin = 0.5, tilt = 0, phase = 0, style}) => {
  const idx = Math.floor((t * spin + phase) * 240);
  const iw = h * 0.6;
  return (
    <div style={{position: 'relative', width: h * 0.36, height: h, transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 30px 40px rgba(14,77,59,.30))', ...style}}>
      <Img src={frameSrc(idx)} style={{position: 'absolute', left: -(iw - h * 0.36) / 2, top: 0, width: iw, height: h}} />
    </div>
  );
};

/** Pile bottles reuse the 3D render at different angles (squashed a little as they land) */
export const MiniBottle: React.FC<{h: number; crushed?: number; angle?: number}> = ({h, crushed = 0, angle = 0}) => (
  <div style={{width: h * 0.36, height: h, transform: `scaleX(${1 - crushed * 0.18}) scaleY(${1 - crushed * 0.08})`}}>
    <Img src={frameSrc(Math.floor(angle * 240))} style={{marginLeft: -h * 0.12, width: h * 0.6, height: h}} />
  </div>
);

/** 3D recycling symbol: the PDF's icon extruded into a solid, spinning badge */
export const Recycle3D: React.FC<{size: number; k: number; t: number}> = ({size, k, t}) => (
  <Extrude
    w={size}
    h={size}
    depth={size * 0.12}
    layers={14}
    rx={14 + Math.sin(t * 1.1) * 6}
    ry={(1 - k) * 360 + Math.sin(t * 1.4) * 16}
    scale={k}
    render={(side) => <Img src={staticFile('media/recycle.png')} style={{width: '100%', height: '100%', filter: side ? 'brightness(.45) saturate(1.2)' : 'drop-shadow(0 0 0 #fff)'}} />}
  />
);

/** Twinkling 4-point glints — the "shine" effect asked for in scene 4 */
export const Sparkles: React.FC<{t: number; at: number; n?: number; w: number; h: number; seed?: string; burst?: number}> = ({t, at, n = 14, w, h, seed = 's', burst = 0}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {Array.from({length: n}, (_, i) => {
      const x = random(seed + 'x' + i) * w;
      const y = random(seed + 'y' + i) * h;
      const ph = random(seed + 'p' + i) * 6.28;
      const sz = 18 + random(seed + 's' + i) * 34;
      const tw = Math.max(0, Math.sin((t - at) * 5 + ph)) ** 3;
      const on = p(t, at + random(seed + 'd' + i) * 0.4, 0.3);
      return (
        <svg key={i} viewBox="-10 -10 20 20" width={sz} height={sz} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, opacity: on * tw, transform: `rotate(${(t - at) * 40 + i * 20}deg) scale(${0.6 + tw * 0.6 + burst})`}}>
          <path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10 Z" fill="#ffffff" />
          <circle r="2.2" fill="#fffbe0" />
        </svg>
      );
    })}
  </div>
);

/** One radial flash used when the bottle transforms */
export const Flash: React.FC<{t: number; at: number; size: number}> = ({t, at, size}) => {
  const k = p(t, at, 0.45);
  if (k <= 0 || k >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: -size / 2,
        top: -size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.5) 30%, rgba(255,255,255,0) 65%)',
        transform: `scale(${0.3 + k * 1.4})`,
        opacity: 1 - k,
      }}
    />
  );
};

/** Rounded photo card (the same card language as the LOH reactions) */
export const PhotoCard: React.FC<{src: string; w: number; h: number; border?: string; style?: React.CSSProperties; fit?: 'cover' | 'contain'; bg?: string}> = ({src, w, h, border = C.cream, style, fit = 'cover', bg = '#fff'}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 44,
      overflow: 'hidden',
      border: `12px solid ${border}`,
      background: bg,
      boxShadow: '0 40px 70px rgba(14,77,59,.35)',
      ...style,
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit}} />
  </div>
);

export {backOut};
