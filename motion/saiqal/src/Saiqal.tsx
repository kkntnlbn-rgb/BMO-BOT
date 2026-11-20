import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {PaperBg} from './elements';
import {S10Logo, S1Intro, S2Taste, S3Story, S4Ingredients, S5Grew, S6Tray, S8Copper, S9Collage} from './scenes';
import {FPS, H, W, loadFonts, panEase} from './theme';

loadFonts();

export type SaiqalProps = {portrait: string | null};
type Dir = 'left' | 'right' | 'up' | 'down';

const U = FPS / 30; // authoring unit → frames
const T = 22 * U; // camera-pan transition length (~0.73s): weighted, never rushed

/**
 * Scene list mirrors the reference: each hand-off is one continuous camera pan —
 * the outgoing scene travels out while the incoming one travels in on the same vector.
 */
const SCENES: {el: (p: SaiqalProps) => React.ReactNode; hold: number; out?: Dir}[] = [
  {el: () => <S1Intro />, hold: 44, out: 'left'},
  {el: () => <S2Taste />, hold: 48, out: 'up'},
  {el: (p) => <S3Story portrait={p.portrait} />, hold: 70, out: 'left'},
  {el: () => <S4Ingredients />, hold: 46, out: 'right'},
  {el: () => <S5Grew />, hold: 60, out: 'up'},
  {el: () => <S6Tray />, hold: 124, out: 'left'},
  {el: () => <S8Copper />, hold: 50, out: 'left'},
  {el: () => <S9Collage />, hold: 66, out: 'right'},
  {el: () => <S10Logo />, hold: 110},
];

const vec = (d: Dir): [number, number] =>
  d === 'left' ? [-W, 0] : d === 'right' ? [W, 0] : d === 'up' ? [0, -H * 0.8] : [0, H * 0.8];

const Pan: React.FC<{inDir?: Dir; outDir?: Dir; hold: number; children: React.ReactNode}> = ({inDir, outDir, hold, children}) => {
  const f = useCurrentFrame();
  const tIn = inDir ? T : 0;
  const e = inDir ? interpolate(f, [0, T], [0, 1], {extrapolateRight: 'clamp', easing: panEase}) : 1;
  const x = outDir ? interpolate(f, [tIn + hold, tIn + hold + T], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: panEase}) : 0;
  const [ix, iy] = inDir ? vec(inDir) : [0, 0];
  const [ox, oy] = outDir ? vec(outDir) : [0, 0];
  const tx = -ix * (1 - e) + ox * x;
  const ty = -iy * (1 - e) + oy * x;
  const op = interpolate(e, [0, 0.45], [0, 1], {extrapolateRight: 'clamp'}) * (1 - interpolate(x, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp'}));
  return <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px)`, opacity: op}}>{children}</AbsoluteFill>;
};

// Build absolute timing
let cursor = 0;
export const TIMELINE = SCENES.map((s, i) => {
  const inDir = i > 0 ? SCENES[i - 1].out : undefined;
  const tIn = inDir ? T : 0;
  const hold = s.hold * U;
  const tOut = s.out ? T : 0;
  const from = cursor;
  cursor += tIn + hold;
  return {...s, inDir, from, hold, dur: tIn + hold + tOut};
});
export const TOTAL = TIMELINE[TIMELINE.length - 1].from + TIMELINE[TIMELINE.length - 1].dur;
const CUTS = TIMELINE.slice(1).map((s) => s.from);

export const Saiqal: React.FC<SaiqalProps> = (props) => (
  <AbsoluteFill style={{background: '#3a1104'}}>
    <PaperBg />
    {/* real camera-shutter motion blur on every pan and entrance */}
    <CameraMotionBlur samples={6} shutterAngle={200}>
      <AbsoluteFill>
        {TIMELINE.map((s, i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.dur}>
            <Pan inDir={s.inDir} outDir={s.out} hold={s.hold}>
              {s.el(props)}
            </Pan>
          </Sequence>
        ))}
      </AbsoluteFill>
    </CameraMotionBlur>
    {/* sound-design-planner: low pad bed, a whoosh riding each pan, paper ticks on cut-outs, chime on logo */}
    <Audio src={staticFile('sfx/pad.wav')} volume={0.6} />
    {CUTS.map((c) => (
      <Sequence key={c} from={Math.max(0, c - 4 * U)} durationInFrames={60 * U}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.45} />
      </Sequence>
    ))}
    {[5, 6, 7].flatMap((idx) => [0, 6, 12].map((d) => TIMELINE[idx].from + (T + d * 2 * U))).map((c) => (
      <Sequence key={'p' + c} from={c} durationInFrames={24 * U}>
        <Audio src={staticFile('sfx/paper.wav')} volume={0.3} />
      </Sequence>
    ))}
    <Sequence from={TIMELINE[8].from + T + 10 * U} durationInFrames={160 * U}>
      <Audio src={staticFile('sfx/chime.wav')} volume={0.4} />
    </Sequence>
  </AbsoluteFill>
);
