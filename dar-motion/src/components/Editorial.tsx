import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../styles/tokens';

// Editorial documentary style (reference: paper/gold/black textured cards, rounded insets,
// photo stacks flying in and out, glitch-invert flashes, slow pushes).

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);

/* ---------- plain grounds (solid Dar colours, no texture) ---------- */
const TONES = { sand: '#C8B67C', gold: '#8F7E2F', dark: '#413815' } as const;
export type Tone = keyof typeof TONES;
export const PaperBg: React.FC<{ tone: Tone; drift?: boolean }> = ({ tone }) => <AbsoluteFill style={{ background: TONES[tone] }} />;

/* ---------- perforated postage-stamp frame (reference) ---------- */
export const StampFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({ children, style, pad = 24 }) => (
  <div style={{ position: 'absolute', padding: pad, filter: 'drop-shadow(0 18px 26px rgba(20,16,4,.45))',
    background: 'radial-gradient(circle, transparent 9px, #F4EFE2 9.6px) -12px -12px / 24px 24px', ...style }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', outline: '3px solid #F4EFE2' }}>{children}</div>
  </div>
);

/* ---------- full-bleed shot with a slow push (captions sit on top) ---------- */
export const Inset: React.FC<{ children: React.ReactNode; top?: number; height?: number; enter?: boolean; tone?: Tone }> = ({ children }) => {
  const frame = useCurrentFrame();
  const push = 1 + interpolate(frame, [0, 150], [0, 0.07], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(rgba(20,16,4,.42) 0%, rgba(20,16,4,0) 34%)' }} />
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
          <StampFrame key={i} pad={20} style={{ left: x, top: y, width: p.w, height: p.h, transform: `rotate(${r}deg)`,
            filter: `drop-shadow(0 18px 26px rgba(20,16,4,.45))${blur > 0.4 ? ` blur(${blur.toFixed(1)}px)` : ''}` }}>
            <Img src={p.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </StampFrame>
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
