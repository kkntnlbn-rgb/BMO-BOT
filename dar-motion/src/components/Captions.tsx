import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';
import { CUES, F } from '../data/defaultTimestamps';
import { DynamicKashida } from './DynamicKashida';

// Word motion (reference style): each word wipes in right→left with a soft blur while rising a
// little from below; on exit the words lift up and blur away, one after another.
// Modes: 'side' (stacked right, over footage), 'center' (big centered words on paper cards),
// 'top' (smaller centered words above a rounded inset). Pills: the box grows from a line first.
const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
const ENTER = 14;
const EXIT = 10;

const LAYOUT = {
  side: { size: 104, lineH: 128, center: 880 },
  center: { size: 150, lineH: 178, center: 900 },
  top: { size: 94, lineH: 116, center: 330 },
} as const;

export const Captions: React.FC<{ hideBetween?: [number, number][] }> = ({ hideBetween = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hideBetween.some(([a, b]) => t >= a && t < b)) return null;
  const cue = CUES.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;

  const mode = cue.mode ?? 'side';
  const L = LAYOUT[mode];
  const size = cue.pills ? 90 : L.size;
  const lineH = cue.pills ? 124 : L.lineH;
  const color = cue.ink ?? COLORS.white;
  const onLight = color !== COLORS.white;

  const words = cue.lines.flatMap((ln, li) => ln.split(' ').map((w) => ({ w, li })));
  const total = words.reduce((n, x) => n + x.w.length + 2, 0);
  let acc = 0;
  const timed = words.map((x, idx) => {
    const at = cue.speech[0] + ((cue.speech[1] - cue.speech[0]) * acc) / total;
    acc += x.w.length + 2;
    return { ...x, at, idx };
  });
  const top = L.center - (cue.lines.length * lineH) / 2;
  const endF = F(cue.to);
  const centered = mode !== 'side';

  return (
    <div dir="rtl" lang="ar" style={{ position: 'absolute', top, left: centered ? 60 : undefined, right: centered ? 60 : 96,
      display: 'flex', flexDirection: 'column', alignItems: centered ? 'center' : 'flex-start', gap: cue.pills ? 14 : 0,
      fontFamily: FONTS.kinetic, fontWeight: 900, fontSize: size, lineHeight: `${lineH}px`, color,
      textShadow: onLight || cue.pills ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.72), 0 1px 4px rgba(0, 0, 0, 0.9)' }}>
      {cue.lines.map((_, li) => {
        const ws = timed.filter((x) => x.li === li);
        const lineStart = F(ws[0].at);
        // pill: box grows from a thin line (right → left), then words wipe in
        const grow = cue.pills ? interpolate(frame, [lineStart - 6, lineStart + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_OUT }) : 1;
        const lineOut = interpolate(frame, [endF - EXIT - (cue.lines.length - 1 - li) * 2, endF - (cue.lines.length - 1 - li) * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_IN });
        return (
          <div key={li} style={{ position: 'relative', display: 'flex', gap: size * 0.22, whiteSpace: 'nowrap',
            padding: cue.pills ? '0 24px 12px' : undefined, opacity: cue.pills ? 1 - lineOut : 1,
            transform: cue.pills ? `translateY(${-lineOut * 30}px)` : undefined }}>
            {cue.pills && frame >= lineStart - 6 && (
              <div style={{ position: 'absolute', inset: 0, background: COLORS.terracotta, borderRadius: 4,
                transform: `scaleX(${Math.max(0.012, grow)})`, transformOrigin: '100% 50%' }} />
            )}
            {ws.map((x) => {
              const f0 = F(x.at);
              if (frame < f0) return <span key={x.idx} style={{ visibility: 'hidden', position: 'relative' }}>{x.w}</span>;
              const s = spring({ fps, frame: frame - f0, config: { damping: 22, stiffness: 140, mass: 1 } });
              const eIn = interpolate(frame, [f0, f0 + ENTER], [0, 1], { extrapolateRight: 'clamp', easing: EXPO_OUT });
              const x0 = endF - EXIT - (timed.length - 1 - x.idx);
              const eOut = cue.pills ? 0 : interpolate(frame, [x0, x0 + EXIT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_IN });
              const y = (1 - s) * (centered ? 54 : 46) - eOut * 38;
              const blur = (1 - eIn) * 16 + eOut * 12;
              const wipe = (1 - eIn) * 100; // reveal right → left
              const k = cue.kashida?.find((kk) => kk.word === x.w);
              const body = k ? (
                <DynamicKashida rightPart={k.right} leftPart={k.left} startFrame={f0 + 3}
                  endFrame={Math.max(f0 + 14, F(cue.speech[1]) - 1)} fromStretchPx={k.stretch[0]} toStretchPx={k.stretch[1] * (size / 104)}
                  fontSize={size} color={color} />
              ) : x.w;
              return (
                <span key={x.idx} style={{ position: 'relative', display: 'inline-block', opacity: Math.min(1, eIn * 1.4) * (1 - eOut),
                  filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined, transform: `translateY(${y.toFixed(2)}px)`,
                  clipPath: `inset(-30% 0 -30% ${wipe.toFixed(2)}%)` }}>
                  {body}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
