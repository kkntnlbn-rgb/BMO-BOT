import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';
import { CUES, F } from '../data/defaultTimestamps';
import { DynamicKashida } from './DynamicKashida';

// arabic-kinetic-kashida: each word rises from slightly below with a soft blur (enter),
// then lifts up and blurs out (exit). Elongated words stretch with geometric kashida.
const ENTER = 12; // frames
const EXIT = 9; // frames, staggered 1f per word
const RISE = 46; // px below on enter
const LIFT = 34; // px above on exit
const BLUR_IN = 14;
const BLUR_OUT = 10;

export const Captions: React.FC<{ hideBetween?: [number, number][] }> = ({ hideBetween = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hideBetween.some(([a, b]) => t >= a && t < b)) return null;
  const cue = CUES.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;

  const words = cue.lines.flatMap((ln, li) => ln.split(' ').map((w) => ({ w, li })));
  const total = words.reduce((n, x) => n + x.w.length + 2, 0);
  let acc = 0;
  const timed = words.map((x, idx) => {
    const at = cue.speech[0] + ((cue.speech[1] - cue.speech[0]) * acc) / total;
    acc += x.w.length + 2;
    return { ...x, at, idx };
  });

  const lineH = cue.pills ? 118 : 128;
  const top = (cue.pills ? 820 : 880) - (cue.lines.length * lineH) / 2;
  const endF = F(cue.to);

  return (
    <div dir="rtl" lang="ar" style={{ position: 'absolute', right: 96, top, display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', gap: cue.pills ? 12 : 0, fontFamily: FONTS.kinetic, fontWeight: 900,
      fontSize: cue.pills ? 86 : 104, lineHeight: `${lineH}px`, color: COLORS.white,
      textShadow: cue.pills ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.72), 0 1px 4px rgba(0, 0, 0, 0.9)' }}>
      {cue.lines.map((_, li) => (
        <div key={li} style={{ display: 'flex', gap: 22, whiteSpace: 'nowrap' }}>
          {timed.filter((x) => x.li === li).map((x) => {
            const f0 = F(x.at);
            if (frame < f0) return <span key={x.idx} style={{ visibility: 'hidden' }}>{x.w}</span>;
            // enter: spring position, expo-out blur/opacity
            const s = spring({ fps, frame: frame - f0, config: { damping: 20, stiffness: 170, mass: 0.9 } });
            const eIn = interpolate(frame, [f0, f0 + ENTER], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
            // exit: staggered lift + blur, expo-in
            const x0 = endF - EXIT - (timed.length - 1 - x.idx);
            const eOut = interpolate(frame, [x0, x0 + EXIT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.7, 0, 0.84, 0) });
            const y = (1 - s) * RISE - eOut * LIFT;
            const blur = (1 - eIn) * BLUR_IN + eOut * BLUR_OUT;
            const op = eIn * (1 - eOut);
            const k = cue.kashida?.find((kk) => kk.word === x.w);
            const body = k ? (
              <DynamicKashida rightPart={k.right} leftPart={k.left} startFrame={f0 + 2}
                endFrame={Math.max(f0 + 10, F(cue.speech[1]) - 1)} fromStretchPx={k.stretch[0]} toStretchPx={k.stretch[1]}
                fontSize={cue.pills ? 86 : 104} strokeThickness={11} baselineOffsetPx={29} />
            ) : x.w;
            return (
              <span key={x.idx} style={{ display: 'inline-block', opacity: op, filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
                transform: `translateY(${y.toFixed(2)}px)`,
                ...(cue.pills ? { background: COLORS.terracotta, padding: '0px 22px 10px', borderRadius: 4 } : {}) }}>
                {body}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
