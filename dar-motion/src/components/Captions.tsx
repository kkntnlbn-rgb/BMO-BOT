import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';
import { CUES, F } from '../data/defaultTimestamps';
import { DynamicKashida } from './DynamicKashida';

// arabic-kinetic-kashida: word-by-word white captions, burgundy pills, geometric kashida on chosen words.
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
  const timed = words.map((x) => {
    const at = cue.speech[0] + ((cue.speech[1] - cue.speech[0]) * acc) / total;
    acc += x.w.length + 2;
    return { ...x, at };
  });

  const lineH = cue.pills ? 118 : 128;
  const top = (cue.pills ? 820 : 880) - (cue.lines.length * lineH) / 2;

  return (
    <div dir="rtl" lang="ar" style={{ position: 'absolute', right: 96, top, display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', gap: cue.pills ? 12 : 0, fontFamily: FONTS.kinetic, fontWeight: 900,
      fontSize: cue.pills ? 86 : 104, lineHeight: `${lineH}px`, color: COLORS.white,
      textShadow: cue.pills ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.72), 0 1px 4px rgba(0, 0, 0, 0.9)' }}>
      {cue.lines.map((_, li) => (
        <div key={li} style={{ display: 'flex', gap: 22, whiteSpace: 'nowrap' }}>
          {timed.filter((x) => x.li === li).map((x, i) => {
            const s = spring({ fps, frame: frame - F(x.at), config: { damping: 22, stiffness: 300, mass: 0.8 } });
            const shown = t >= x.at;
            const k = cue.kashida && cue.kashida.word === x.w ? cue.kashida : null;
            const body = k ? (
              <DynamicKashida rightPart={k.right} leftPart={k.left} startFrame={F(x.at) + 2}
                endFrame={F(cue.speech[1]) - 1} fromStretchPx={k.stretch[0]} toStretchPx={k.stretch[1]}
                fontSize={104} strokeThickness={12} baselineOffsetPx={30} />
            ) : x.w;
            return (
              <span key={i} style={{ display: 'inline-block', visibility: shown ? 'visible' : 'hidden',
                transform: `scale(${0.86 + 0.14 * s})`, transformOrigin: '100% 60%',
                ...(cue.pills ? { background: COLORS.burgundy, padding: '0px 22px 10px', borderRadius: 4 } : {}) }}>
                {body}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
