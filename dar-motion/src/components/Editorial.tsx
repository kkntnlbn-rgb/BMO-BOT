import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../styles/tokens';

// Editorial documentary style (reference: paper/gold/black textured cards, rounded insets,
// photo stacks flying in and out, glitch-invert flashes, slow pushes).

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);

/* ---------- textured grounds ---------- */
const TONES = {
  sand: { base: '#E4D9B8', edge: '#B9A56C', grain: 0.22 }, // light paper (Dar sand family)
  gold: { base: '#A8933F', edge: '#4E4318', grain: 0.3 }, // Dar olive/gold paper
  dark: { base: '#2B250D', edge: '#0c0a03', grain: 0.28 }, // Dar dark olive → black vignette
} as const;
export type Tone = keyof typeof TONES;

export const PaperBg: React.FC<{ tone: Tone; drift?: boolean }> = ({ tone, drift = true }) => {
  const frame = useCurrentFrame();
  const t = TONES[tone];
  const s = drift ? 1 + frame * 0.0006 : 1;
  return (
    <AbsoluteFill style={{ background: t.base, overflow: 'hidden' }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, mixBlendMode: 'multiply', opacity: t.grain }}>
        <filter id={`grain-${tone}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#grain-${tone})`} />
      </svg>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.35 }}>
        <filter id={`fiber-${tone}`}><feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={4} seed={9} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter={`url(#fiber-${tone})`} />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 45%, transparent 45%, ${t.edge} 120%)` }} />
    </AbsoluteFill>
  );
};

/* ---------- rounded inset media on a dark ground, slow push ---------- */
export const Inset: React.FC<{ children: React.ReactNode; top?: number; height?: number; enter?: boolean }> = ({ children, top = 560, height = 1180, enter = true }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = enter ? spring({ fps, frame, config: { damping: 26, stiffness: 90, mass: 1 } }) : 1;
  const push = 1 + interpolate(frame, [0, 150], [0, 0.07], clamp);
  return (
    <AbsoluteFill>
      <PaperBg tone="dark" />
      <div style={{ position: 'absolute', left: 90, right: 90, top, height, borderRadius: 46, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,.6), 0 0 0 2px rgba(200,182,124,.15)',
        transform: `translateY(${(1 - s) * 120}px) scale(${0.94 + 0.06 * s})`, opacity: Math.min(1, s * 1.6) }}>
        <AbsoluteFill style={{ transform: `scale(${push})` }}>{children}</AbsoluteFill>
        <AbsoluteFill style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,.55)' }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- photos fly in from the edge, stack, then fly out to reveal what is under ---------- */
export type StackPhoto = { src: string; x: number; y: number; w: number; h: number; r: number; from: 'right' | 'left' | 'top' };
export const PhotoStack: React.FC<{ photos: StackPhoto[]; enterAt: number; gap?: number; exitAt: number }> = ({ photos, enterAt, gap = 7, exitAt }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {photos.map((p, i) => {
        const f0 = enterAt + i * gap;
        if (frame < f0) return null;
        const s = spring({ fps, frame: frame - f0, config: { damping: 24, stiffness: 120, mass: 1 } });
        const v = spring({ fps, frame: frame - f0 - 1, config: { damping: 24, stiffness: 120, mass: 1 } });
        const out = interpolate(frame, [exitAt + (photos.length - 1 - i) * 3, exitAt + (photos.length - 1 - i) * 3 + 12], [0, 1], { ...clamp, easing: EXPO_IN });
        const dx = p.from === 'right' ? 1300 : p.from === 'left' ? -1300 : 0;
        const dy = p.from === 'top' ? -1500 : 0;
        const x = p.x + (1 - s) * dx - out * 1400;
        const y = p.y + (1 - s) * dy - out * 120;
        const r = p.r + (1 - s) * (p.from === 'left' ? -28 : 28) - out * 22;
        const blur = Math.min(Math.abs(s - v) * 220 + out * 10, 16);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: p.w, height: p.h, background: '#f4efe2', padding: 14,
            boxShadow: '0 22px 40px rgba(0,0,0,.42)', transform: `rotate(${r}deg)`, filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
            <Img src={p.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- glitch-invert flash around a cut (reference 3.3s / 22.5s) ---------- */
// pattern relative to the cut frame: invert, clean, invert(+hue), clean, invert
const GLITCH = new Map<number, string>([
  [-3, 'invert(1) hue-rotate(180deg) contrast(1.2)'],
  [-1, 'invert(1) hue-rotate(200deg) saturate(1.6)'],
  [1, 'invert(1) hue-rotate(160deg) contrast(1.3)'],
  [2, 'brightness(1.6) contrast(1.4)'],
]);
export const glitchFilter = (frame: number, cuts: number[]) => {
  for (const c of cuts) { const f = GLITCH.get(frame - c); if (f) return f; }
  return undefined;
};

/* ---------- bracket that draws itself (reference logo build) ---------- */
export const DrawBracket: React.FC<{ at: number; x: number; y: number; w: number; h: number; color?: string }> = ({ at, x, y, w, h, color = COLORS.olive }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 22], [1, 0], { ...clamp, easing: EXPO_OUT });
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <path d={`M ${x + w * 0.42} ${y} H ${x} V ${y + h} H ${x + w} V ${y + h * 0.58}`} fill="none" stroke={color} strokeWidth={14}
        strokeLinecap="square" pathLength={1} strokeDasharray={1} strokeDashoffset={p} />
    </svg>
  );
};
