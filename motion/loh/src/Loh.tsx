import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Bg} from './fx';
import {S1Hook, S2Reaction, S3ThreeTaps, S4Problems, S5App, S6Logo} from './scenes';
import {H, Offset, W, loadFonts, panEase, sec} from './theme';

loadFonts();

type Dir = 'left' | 'right' | 'up' | 'down';
const T = 0.6; // pan length (s) — same weighted camera hand-off as the Saiqal piece

/* Scene boundaries are locked to the voice-over phrases */
const B = [0, 2.45, 7.0, 10.75, 12.9, 20.2, 24.2];
const DIRS: Dir[] = ['left', 'up', 'left', 'up', 'right'];
const SCENES = [S1Hook, S2Reaction, S3ThreeTaps, S4Problems, S5App, S6Logo];
export const TOTAL = sec(B[B.length - 1]);

const vec = (d: Dir): [number, number] => (d === 'left' ? [-W, 0] : d === 'right' ? [W, 0] : d === 'up' ? [0, -H * 0.8] : [0, H * 0.8]);

const Pan: React.FC<{inDir?: Dir; outDir?: Dir; len: number; children: React.ReactNode}> = ({inDir, outDir, len, children}) => {
  const f = useCurrentFrame();
  const Tf = sec(T);
  const e = inDir ? interpolate(f, [0, Tf], [0, 1], {extrapolateRight: 'clamp', easing: panEase}) : 1;
  const x = outDir ? interpolate(f, [len - Tf, len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: panEase}) : 0;
  const [ix, iy] = inDir ? vec(inDir) : [0, 0];
  const [ox, oy] = outDir ? vec(outDir) : [0, 0];
  const op = interpolate(e, [0, 0.45], [0, 1], {extrapolateRight: 'clamp'}) * (1 - interpolate(x, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp'}));
  return <AbsoluteFill style={{transform: `translate(${-ix * (1 - e) + ox * x}px, ${-iy * (1 - e) + oy * x}px)`, opacity: op}}>{children}</AbsoluteFill>;
};

export const Loh: React.FC<{blur?: number}> = ({blur = 6}) => (
  <AbsoluteFill style={{background: '#f3c32c'}}>
    <Bg />
    <CameraMotionBlur samples={blur} shutterAngle={blur > 1 ? 200 : 0}>
      <AbsoluteFill>
        {SCENES.map((Scene, i) => {
          const start = i === 0 ? 0 : B[i] - T / 2;
          const end = i === SCENES.length - 1 ? B[i + 1] : B[i + 1] + T / 2;
          const len = sec(end) - sec(start);
          return (
            <Sequence key={i} from={sec(start)} durationInFrames={len}>
              <Pan inDir={i > 0 ? DIRS[i - 1] : undefined} outDir={DIRS[i]} len={len}>
                <Offset.Provider value={start}>
                  <Scene o={start} />
                </Offset.Provider>
              </Pan>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </CameraMotionBlur>

    {/* ── audio: VO is split around the OG reaction clip ── */}
    <Sequence from={sec(0.3)} durationInFrames={sec(2.15)}>
      <Audio src={staticFile('media/vo.mp3')} />
    </Sequence>
    <Sequence from={sec(2.3)} durationInFrames={sec(4.4)}>
      <Audio src={staticFile('media/og.mp4')} startFrom={sec(0.8)} volume={1} />
    </Sequence>
    <Sequence from={sec(7.1)}>
      <Audio src={staticFile('media/vo.mp3')} startFrom={sec(2.4)} />
    </Sequence>
    {/* sound design: whoosh on each pan, pops on 3D icons, taps, success chime */}
    {B.slice(1, -1).map((b) => (
      <Sequence key={b} from={sec(b - 0.35)} durationInFrames={sec(1)}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} />
      </Sequence>
    ))}
    {[9.05, 9.4, 9.75, 10.9, 11.05, 11.2, 11.35, 11.5, 12.0, 12.1, 12.2].map((t) => (
      <Sequence key={'p' + t} from={sec(t)} durationInFrames={sec(0.4)}>
        <Audio src={staticFile('sfx/pop.wav')} volume={0.35} />
      </Sequence>
    ))}
    {[14.85, 16.45, 19.4].map((t) => (
      <Sequence key={'t' + t} from={sec(t)} durationInFrames={sec(0.2)}>
        <Audio src={staticFile('sfx/tap.wav')} volume={0.5} />
      </Sequence>
    ))}
    {[19.55, 21.8].map((t) => (
      <Sequence key={'s' + t} from={sec(t)} durationInFrames={sec(1)}>
        <Audio src={staticFile('sfx/success.wav')} volume={0.45} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
