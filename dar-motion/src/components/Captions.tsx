import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';
import { CUES, Cue, F } from '../data/defaultTimestamps';
import { DynamicKashida } from './DynamicKashida';

// Word motion (reference "إنك تسجل براندك"): every word is uncovered right→left by a soft,
// feathered edge while it de-blurs and settles up from slightly below. Words overlap – the next
// starts before the previous has finished. Pills: the box stretches out first, then the words
// appear inside it in the ground colour (knock-out). Exit: lift + blur, staggered.
const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
const ENTER = 12;
const EXIT = 10;
const FEATHER = 45; // % soft edge of the reveal

const LAYOUT = {
  side: { size: 104, lineH: 128, center: 880 },
  center: { size: 140, lineH: 170, center: 900 },
  top: { size: 94, lineH: 116, center: 330 },
} as const;

const CueView: React.FC<{ cue: Cue; frame: number }> = ({ cue, frame }) => {
  const { fps } = useVideoConfig();
  const mode = cue.mode ?? 'side';
  const L = LAYOUT[mode];
  const baseSize = cue.size ?? (cue.pills ? 90 : L.size);
  const color = cue.ink ?? COLORS.white;
  const onLight = color !== COLORS.white;
  const styleOf = (li: number) => (cue.pills ? 'pill' : cue.lineStyle?.[li]);
  const sizeOf = (li: number) => (styleOf(li) === 'small' ? Math.round(baseSize * 0.62) : styleOf(li) === 'pill' && !cue.pills ? Math.round(baseSize * 0.82) : baseSize);

  // per-word timing (per-line windows when given)
  const timed: { w: string; li: number; at: number; idx: number }[] = [];
  const timeWords = (ws: { w: string; li: number }[], [a, b]: [number, number]) => {
    const total = ws.reduce((n, x) => n + x.w.length + 2, 0); let acc = 0;
    ws.forEach((x) => { timed.push({ ...x, at: a + ((b - a) * acc) / total, idx: timed.length }); acc += x.w.length + 2; });
  };
  if (cue.lineSpeech) cue.lines.forEach((ln, li) => timeWords(ln.split(' ').map((w) => ({ w, li })), cue.lineSpeech![li]));
  else timeWords(cue.lines.flatMap((ln, li) => ln.split(' ').map((w) => ({ w, li }))), cue.speech);

  const heights = cue.lines.map((_, li) => sizeOf(li) * 1.24 + (styleOf(li) === 'pill' ? 18 : 0));
  const top = (cue.y ?? L.center) - heights.reduce((a, b) => a + b, 0) / 2;
  const endF = F(cue.to);
  const centered = mode !== 'side';

  return (
    <div dir="rtl" lang="ar" style={{ position: 'absolute', top, left: centered ? 50 : undefined, right: centered ? 50 : 96,
      display: 'flex', flexDirection: 'column', alignItems: centered ? 'center' : 'flex-start', gap: 10,
      fontFamily: FONTS.kinetic, fontWeight: 900, color }}>
      {cue.lines.map((_, li) => {
        const ws = timed.filter((x) => x.li === li);
        const st = styleOf(li); const size = sizeOf(li);
        const lineStart = F(ws[0].at);
        const grow = st === 'pill' ? interpolate(frame, [lineStart - 7, lineStart + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_OUT }) : 1;
        const lineOut = interpolate(frame, [endF - EXIT - (cue.lines.length - 1 - li) * 2, endF - (cue.lines.length - 1 - li) * 2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_IN });
        const pillBg = cue.pillBg ?? COLORS.terracotta;
        const ink = st === 'pill' ? (cue.pillInk ?? '#EFE6CC') : color;
        return (
          <div key={li} style={{ position: 'relative', display: 'flex', gap: size * 0.24, whiteSpace: 'nowrap', fontSize: size,
            lineHeight: `${Math.round(size * 1.24)}px`, color: ink, padding: st === 'pill' ? `0 ${size * 0.28}px ${size * 0.14}px` : undefined,
            opacity: st === 'pill' ? 1 - lineOut : 1, transform: st === 'pill' ? `translateY(${-lineOut * 30}px)` : undefined,
            filter: st === 'pill' && lineOut > 0.02 ? `blur(${(lineOut * 10).toFixed(1)}px)` : undefined,
            textShadow: onLight || st === 'pill' ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.72), 0 1px 4px rgba(0, 0, 0, 0.9)' }}>
            {st === 'pill' && frame >= lineStart - 7 && (
              <div style={{ position: 'absolute', inset: 0, background: pillBg, borderRadius: 6,
                transform: `scaleX(${Math.max(0.01, grow)})`, transformOrigin: '100% 50%' }} />
            )}
            {ws.map((x) => {
              const f0 = F(x.at);
              if (frame < f0) return <span key={x.idx} style={{ visibility: 'hidden', position: 'relative' }}>{x.w}</span>;
              const s = spring({ fps, frame: frame - f0, config: { damping: 22, stiffness: 150, mass: 1 } });
              const eIn = interpolate(frame, [f0, f0 + ENTER], [0, 1], { extrapolateRight: 'clamp', easing: EXPO_OUT });
              const x0 = endF - EXIT - (timed.length - 1 - x.idx);
              const eOut = st === 'pill' ? 0 : interpolate(frame, [x0, x0 + EXIT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EXPO_IN });
              const y = (1 - s) * size * 0.32 - eOut * 38;
              const blur = (1 - eIn) * 14 + eOut * 12;
              const p = -FEATHER + eIn * (100 + FEATHER); // feathered reveal edge, right → left
              const mask = eIn < 1 ? `linear-gradient(to left, #000 ${p.toFixed(1)}%, transparent ${(p + FEATHER).toFixed(1)}%)` : undefined;
              const k = cue.kashida?.find((kk) => kk.word === x.w);
              const body = k ? (
                <DynamicKashida rightPart={k.right} leftPart={k.left} startFrame={f0 + 3}
                  endFrame={Math.max(f0 + 16, F((cue.lineSpeech?.[x.li] ?? cue.speech)[1]) - 1)} fromStretchPx={k.stretch[0]}
                  toStretchPx={k.stretch[1] * (size / 104)} fontSize={size} color={ink} />
              ) : x.w;
              return (
                <span key={x.idx} style={{ position: 'relative', display: 'inline-block', opacity: Math.min(1, eIn * 1.6) * (1 - eOut),
                  filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined, transform: `translateY(${y.toFixed(2)}px)`,
                  WebkitMaskImage: mask, maskImage: mask }}>
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

/** Global caption layer (cues without a `scene`). */
export const Captions: React.FC<{ hideBetween?: [number, number][] }> = ({ hideBetween = [] }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (hideBetween.some(([a, b]) => t >= a && t < b)) return null;
  const cue = CUES.find((c) => !c.scene && t >= c.from && t < c.to);
  return cue ? <CueView cue={cue} frame={frame} /> : null;
};

/** Captions that belong to a scene; `offset` = scene start frame (Sequence-relative time). */
export const SceneCaptions: React.FC<{ scene: string; offset: number; only?: number }> = ({ scene, offset, only }) => {
  const frame = useCurrentFrame() + offset;
  const t = frame / 30;
  const list = CUES.filter((c) => c.scene === scene);
  const cue = (only != null ? [list[only]] : list).find((c) => c && t >= c.from && t < c.to);
  return cue ? <CueView cue={cue} frame={frame} /> : null;
};
