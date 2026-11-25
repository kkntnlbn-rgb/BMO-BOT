import React from 'react';
import {Img, random, staticFile} from 'remotion';
import {Extrude} from './fx';
import {C, p, backOut} from './theme';

/**
 * The hero: a transparent 3D water bottle. Rotation is faked the way a turntable
 * render looks — highlights and label slide across the body while the silhouette breathes.
 */
export const Bottle3D: React.FC<{h: number; t: number; spin?: number; tilt?: number; style?: React.CSSProperties}> = ({h, t, spin = 0.5, tilt = 0, style}) => {
  const a = t * spin * Math.PI * 2; // turntable angle
  const sx = 0.92 + 0.08 * Math.abs(Math.cos(a)); // silhouette breathing
  const hl = Math.sin(a); // -1..1 highlight travel
  const w = h * 0.36;
  return (
    <div style={{position: 'relative', width: w, height: h, transform: `rotate(${tilt}deg) scaleX(${sx})`, filter: 'drop-shadow(0 30px 40px rgba(14,77,59,.35))', ...style}}>
      <svg viewBox="0 0 100 280" width={w} height={h} style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="bodyG" x1="0" x2="1">
            <stop offset="0" stopColor="#9fd6f2" stopOpacity="0.75" />
            <stop offset={0.5 + hl * 0.3} stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#5fb3e0" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="waterG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#7cc8ee" stopOpacity="0.55" />
            <stop offset="1" stopColor="#2b8fd0" stopOpacity="0.75" />
          </linearGradient>
          <clipPath id="bodyClip">
            <path d="M38 30 L62 30 L62 46 Q86 62 86 96 L86 262 Q86 276 72 276 L28 276 Q14 276 14 262 L14 96 Q14 62 38 46 Z" />
          </clipPath>
        </defs>
        {/* cap */}
        <rect x="34" y="2" width="32" height="28" rx="5" fill={C.blue} />
        <rect x="34" y="2" width="32" height="7" rx="3" fill="#59bdf0" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={37 + i * 6 + hl * 2} y="11" width="2.4" height="16" fill={C.blueDeep} opacity="0.55" />
        ))}
        <g clipPath="url(#bodyClip)">
          <rect x="0" y="0" width="100" height="280" fill="url(#bodyG)" />
          {/* water with a gentle slosh */}
          <path d={`M0 ${120 + Math.sin(t * 3) * 3} Q 50 ${112 + Math.cos(t * 3) * 5} 100 ${120 - Math.sin(t * 3) * 3} L100 280 L0 280 Z`} fill="url(#waterG)" />
          {/* ribs */}
          {[150, 175, 200, 225].map((y) => (
            <path key={y} d={`M0 ${y} Q50 ${y + 6} 100 ${y}`} stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.2" fill="none" />
          ))}
          {/* label wraps around and slides with the turn */}
          <g transform={`translate(${hl * 26} 0)`} opacity={0.55 + 0.45 * Math.cos(a) ** 2}>
            <rect x="10" y="98" width="80" height="40" fill="#ffffff" opacity="0.85" />
            <path d="M30 118 q10 -14 20 0 q10 14 20 0" stroke={C.leaf} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          {/* specular streaks */}
          <rect x={22 + hl * 30} y="40" width="7" height="230" rx="3.5" fill="#fff" opacity="0.7" />
          <rect x={34 + hl * 30} y="60" width="3" height="200" rx="1.5" fill="#fff" opacity="0.45" />
        </g>
        <path d="M38 30 L62 30 L62 46 Q86 62 86 96 L86 262 Q86 276 72 276 L28 276 Q14 276 14 262 L14 96 Q14 62 38 46 Z" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.6" />
      </svg>
    </div>
  );
};

/** Small flat bottle used for the falling pile */
export const MiniBottle: React.FC<{h: number; crushed?: number}> = ({h, crushed = 0}) => (
  <svg viewBox="0 0 100 280" width={h * 0.36} height={h} style={{overflow: 'visible'}}>
    <rect x="34" y="2" width="32" height="28" rx="5" fill={C.blue} />
    <path
      d={`M38 30 L62 30 L62 46 Q${86 - crushed * 10} 62 ${86 - crushed * 14} 96 L${86 - crushed * 6} 262 Q86 276 72 276 L28 276 Q14 276 ${14 + crushed * 8} 262 L${14 + crushed * 12} 96 Q14 62 38 46 Z`}
      fill="#bfe6f7"
      fillOpacity="0.8"
      stroke="#ffffff"
      strokeWidth="2"
    />
    <rect x="22" y="60" width="6" height="190" rx="3" fill="#fff" opacity="0.7" />
  </svg>
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
