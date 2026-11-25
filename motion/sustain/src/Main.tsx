import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Bg} from './fx';
import {CfgCtx, S1Start, S2Problem, S3Recycle, S4Transform, S5Close} from './scenes';
import {H, Offset, W, applyColors, loadFonts, panEase, sec} from './theme';
import {B, DURATION, E, PAN, VO_AT} from './timing';
import {Cfg} from './config';

loadFonts();

type Dir = 'left' | 'right' | 'up' | 'down';
const DIRS: Dir[] = ['up', 'left', 'left', 'up'];
const SCENES = [S1Start, S2Problem, S3Recycle, S4Transform, S5Close];
export const TOTAL = sec(DURATION); // exactly 1800 frames

const vec = (d: Dir): [number, number] => (d === 'left' ? [-W, 0] : d === 'right' ? [W, 0] : d === 'up' ? [0, -H * 0.8] : [0, H * 0.8]);

/** One continuous camera pan per hand-off — the same transition grammar as Saiqal and LOH. */
const Pan: React.FC<{inDir?: Dir; outDir?: Dir; len: number; children: React.ReactNode}> = ({inDir, outDir, len, children}) => {
  const f = useCurrentFrame();
  const Tf = sec(PAN);
  const e = inDir ? interpolate(f, [0, Tf], [0, 1], {extrapolateRight: 'clamp', easing: panEase}) : 1;
  const x = outDir ? interpolate(f, [len - Tf, len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: panEase}) : 0;
  const [ix, iy] = inDir ? vec(inDir) : [0, 0];
  const [ox, oy] = outDir ? vec(outDir) : [0, 0];
  const op = interpolate(e, [0, 0.45], [0, 1], {extrapolateRight: 'clamp'}) * (1 - interpolate(x, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp'}));
  return <AbsoluteFill style={{transform: `translate(${-ix * (1 - e) + ox * x}px, ${-iy * (1 - e) + oy * x}px)`, opacity: op}}>{children}</AbsoluteFill>;
};

const Sfx: React.FC<{at: number; src: string; vol: number; len?: number}> = ({at, src, vol, len = 1}) => (
  <Sequence from={sec(at)} durationInFrames={sec(len)}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const Main: React.FC<Cfg> = (cfg) => {
  applyColors(cfg.bg, cfg.ink);
  const sv = cfg.sfxVolume;
  return (
    <CfgCtx.Provider value={cfg}>
      <AbsoluteFill style={{background: cfg.bg}}>
        <Bg />
        <CameraMotionBlur samples={cfg.motionBlur} shutterAngle={cfg.motionBlur > 1 ? 200 : 0}>
          <AbsoluteFill>
            {SCENES.map((Scene, i) => {
              const start = i === 0 ? 0 : B[i] - PAN / 2;
              const end = i === SCENES.length - 1 ? B[i + 1] : B[i + 1] + PAN / 2;
              const len = sec(end) - sec(start);
              return (
                <Sequence key={i} from={sec(start)} durationInFrames={len}>
                  <Pan inDir={i > 0 ? DIRS[i - 1] : undefined} outDir={DIRS[i]} len={len}>
                    <Offset.Provider value={start}>
                      <Scene />
                    </Offset.Provider>
                  </Pan>
                </Sequence>
              );
            })}
          </AbsoluteFill>
        </CameraMotionBlur>

        <Sequence from={sec(VO_AT)}>
          <Audio src={staticFile('media/vo.wav')} volume={cfg.voVolume} />
        </Sequence>
        <Audio src={staticFile('sfx/pad.wav')} volume={0.55 * cfg.musicVolume} />

        {B.slice(1, -1).map((b) => (
          <Sfx key={'w' + b} at={b - 0.35} src="sfx/whoosh.wav" vol={0.28 * sv} />
        ))}
        {Array.from({length: 8}, (_, i) => E.fall0 + 0.7 + i * 0.22).map((t, i) => (
          <Sfx key={'f' + i} at={t} src="sfx/tap.wav" vol={0.25 * sv} len={0.15} />
        ))}
        {[E.pileCard + 0.5, ...E.badges].map((t, i) => (
          <Sfx key={'b' + i} at={t} src="sfx/pop.wav" vol={0.3 * sv} len={0.4} />
        ))}
        {[E.recycleIn + 0.4, ...E.products, E.finale].map((t, i) => (
          <Sfx key={'s' + i} at={t} src="sfx/success.wav" vol={0.32 * sv} />
        ))}
      </AbsoluteFill>
    </CfgCtx.Provider>
  );
};
