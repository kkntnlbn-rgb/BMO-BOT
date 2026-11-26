import React from 'react';
import {interpolate} from 'remotion';
import {CUES, Cue} from './cues';
import {Kashida} from './fx';
import {C, F, W, easeInOut, easeOut, p, useS} from './theme';

/** word start times, spread across each line's spoken window by character length */
const wordTimes = (cue: Cue) => {
  const out: number[][] = [];
  if (cue.lineSpeech) {
    cue.lines.forEach((ln, li) => {
      const [a, b] = cue.lineSpeech![li];
      const ws = ln.split(' ');
      const tot = ws.reduce((s, w) => s + w.length, 0);
      let acc = 0;
      out.push(ws.map((w) => {
        const v = a + ((b - a) * acc) / tot;
        acc += w.length;
        return v;
      }));
    });
    return out;
  }
  const all = cue.lines.map((l) => l.split(' '));
  const tot = all.flat().reduce((s, w) => s + w.length, 0);
  const [a, b] = cue.speech;
  let acc = 0;
  return all.map((ws) => ws.map((w) => {
    const v = a + ((b - a) * acc) / tot;
    acc += w.length;
    return v;
  }));
};

const Word: React.FC<{t: number; at: number; text: string; cue: Cue; glow?: string}> = ({t, at, text, cue, glow}) => {
  // LOH reveal: each whole word wipes in from its right edge, rising 26px and de-blurring (0.55s expo-out)
  const k = p(t, at, 0.55, easeOut);
  const kd = cue.kashida?.find((x) => x.word === text);
  const px = kd ? interpolate(p(t, at + 0.15, 0.9, easeInOut), [0, 1], [kd.stretch[0], kd.stretch[1]]) : 0;
  return (
    <span
      style={{
        display: 'inline-block',
        clipPath: `inset(-60% 0 -70% ${(1 - k) * 100}%)`,
        transform: `translateY(${(1 - k) * 26}px)`,
        filter: `blur(${(1 - k) * 8}px)`,
        opacity: 0.2 + 0.8 * k,
        textShadow: glow,
        visibility: t < at ? 'hidden' : 'visible',
      }}
    >
      {kd ? <Kashida right={kd.right} left={kd.left} px={px} /> : text}
    </span>
  );
};

const CueView: React.FC<{cue: Cue; t: number}> = ({cue, t}) => {
  if (t < cue.from - 0.1 || t > cue.to + 0.5) return null;
  const times = wordTimes(cue);
  const out = p(t, cue.to - 0.2, 0.4, easeInOut); // LOH exit: lift 60px, fade, blur 6
  const side = cue.mode === 'side' || (!cue.mode && !cue.pills);
  const size = cue.size ?? (side ? 104 : 124);
  const ink = cue.ink ?? C.white;
  const glow = ink === C.white && side ? '0 0 22px rgba(18,14,4,.3), 0 0 6px rgba(18,14,4,.16)' : undefined;
  const y = cue.y ?? (side ? 960 : 900);
  return (
    <div
      dir="rtl"
      style={{
        position: 'absolute',
        top: y,
        right: side || cue.pills ? 64 : 70,
        left: side || cue.pills ? 120 : 70,
        transform: `translateY(-50%) translateY(${-out * 60}px)`,
        filter: `blur(${out * 6}px)`,
        opacity: 1 - out,
        display: 'flex',
        flexDirection: 'column',
        alignItems: side || cue.pills ? 'flex-start' : 'center',
        fontFamily: F.head,
        fontWeight: 900,
        color: ink,
        lineHeight: 1.12,
        textAlign: side ? 'right' : 'center',
      }}
    >
      {cue.lines.map((ln, li) => {
        const style = cue.lineStyle?.[li];
        const fs = style === 'small' ? size * 0.62 : size;
        const lineAt = times[li][0];
        const ws = ln.split(' ');
        if (cue.pills || style === 'pill') {
          // terracotta box grows out of a thin line, then the words land inside it
          const g = p(t, lineAt - 0.18, 0.45, easeOut);
          const bg = cue.pillBg ?? C.terracotta;
          return (
            <div key={li} style={{position: 'relative', marginBottom: 14, fontSize: fs, padding: '2px 30px 16px', color: cue.pillInk ?? C.frame}}>
              <div style={{position: 'absolute', inset: 0, background: bg, borderRadius: 14, transformOrigin: '100% 50%', transform: `scaleX(${g}) scaleY(${0.08 + 0.92 * p(t, lineAt - 0.05, 0.35, easeOut)})`}} />
              <span style={{position: 'relative', display: 'inline-flex', gap: fs * 0.24}}>
                {ws.map((w, wi) => <Word key={wi} t={t} at={times[li][wi] + 0.05} text={w} cue={cue} />)}
              </span>
            </div>
          );
        }
        return (
          <div key={li} style={{fontSize: fs, display: 'flex', gap: fs * 0.24, flexWrap: 'wrap', justifyContent: side ? 'flex-start' : 'center', maxWidth: W - 200}}>
            {ws.map((w, wi) => <Word key={wi} t={t} at={times[li][wi]} text={w} cue={cue} glow={glow} />)}
          </div>
        );
      })}
    </div>
  );
};

/** Global caption layer; cues tagged with `scene` are drawn by their scene instead. */
export const Captions: React.FC<{only?: string}> = ({only}) => {
  const t = useS();
  return (
    <>
      {CUES.filter((c) => (only ? c.scene === only : !c.scene)).map((c, i) => (
        <CueView key={i} cue={c} t={t} />
      ))}
    </>
  );
};

/** For scene-embedded captions (they ride the scene's push), time is absolute via offset */
export const SceneCaptions: React.FC<{scene: string; o: number}> = ({scene, o}) => {
  const t = useS() + o;
  return (
    <>
      {CUES.filter((c) => c.scene === scene).map((c, i) => (
        <CueView key={i} cue={c} t={t} />
      ))}
    </>
  );
};
