import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {PaperBg} from './elements';
import {S10Logo, S1Intro, S2Taste, S3Story, S4Ingredients, S5Grew, S6Tray, S7Return, S8Copper, S9Collage} from './scenes';
import {loadFonts} from './theme';

loadFonts();

export type SaiqalProps = {portrait: string | null};

// [from, duration] in frames @30fps — overlaps give soft hand-offs between scenes
export const TIMELINE = {
  s1: [0, 66],
  s2: [60, 66],
  s3: [120, 96],
  s4: [210, 54],
  s5: [258, 54],
  s6: [306, 60],
  s7: [360, 36],
  s8: [390, 60],
  s9: [444, 84],
  s10: [522, 138],
} as const;
export const TOTAL = 660;

const cuts = [58, 118, 208, 256, 304, 358, 388, 442, 520];

export const Saiqal: React.FC<SaiqalProps> = ({portrait}) => {
  const seq = (k: keyof typeof TIMELINE, el: React.ReactNode) => (
    <Sequence key={k} from={TIMELINE[k][0]} durationInFrames={TIMELINE[k][1]}>
      {el}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#3a1104'}}>
      <PaperBg />
      {seq('s1', <S1Intro />)}
      {seq('s2', <S2Taste />)}
      {seq('s3', <S3Story portrait={portrait} />)}
      {seq('s4', <S4Ingredients />)}
      {seq('s5', <S5Grew />)}
      {seq('s6', <S6Tray />)}
      {seq('s7', <S7Return />)}
      {seq('s8', <S8Copper />)}
      {seq('s9', <S9Collage />)}
      {seq('s10', <S10Logo />)}
      {/* sound-design-planner: low pad bed + whoosh on every cut + paper ticks on collage + chime on logo */}
      <Audio src={staticFile('sfx/pad.wav')} volume={0.6} />
      {cuts.map((c) => (
        <Sequence key={c} from={c - 6} durationInFrames={30}>
          <Audio src={staticFile('sfx/whoosh.wav')} volume={0.45} />
        </Sequence>
      ))}
      {[444, 449, 454, 459, 306, 312, 318, 390, 395, 400].map((c) => (
        <Sequence key={'p' + c} from={c + 8} durationInFrames={12}>
          <Audio src={staticFile('sfx/paper.wav')} volume={0.35} />
        </Sequence>
      ))}
      <Sequence from={540} durationInFrames={80}>
        <Audio src={staticFile('sfx/chime.wav')} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
