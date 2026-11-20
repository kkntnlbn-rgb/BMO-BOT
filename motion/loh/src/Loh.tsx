import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Bg} from './fx';
import {CfgCtx, YA_MAX, S1Hook, S2Reaction, S3ThreeTaps, S4Problems, S5App, S6Logo} from './scenes';
import {H, Offset, W, applyColors, loadFonts, panEase, sec} from './theme';
import {B, CLIP, CLIP2, DURATION, E, VO} from './timing';
import {Cfg} from './config';

loadFonts();

type Dir = 'left' | 'right' | 'up' | 'down';
const T = 0.6; // pan length (s) — same weighted camera hand-off as the Saiqal piece
const DIRS: Dir[] = ['left', 'up', 'left', 'up', 'right'];
const SCENES = [S1Hook, S2Reaction, S3ThreeTaps, S4Problems, S5App, S6Logo];
export const TOTAL = sec(DURATION); // exact length, frame-accurate

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

const Sfx: React.FC<{at: number; src: string; vol: number; len?: number}> = ({at, src, vol, len = 1}) => (
  <Sequence from={sec(at)} durationInFrames={sec(len)}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const Loh: React.FC<Cfg> = (cfg) => {
  applyColors(cfg.yellow, cfg.brown);
  const sv = cfg.sfxVolume;
  return (
    <CfgCtx.Provider value={cfg}>
      <AbsoluteFill style={{background: cfg.yellow}}>
        <Bg />
        <CameraMotionBlur samples={cfg.motionBlur} shutterAngle={cfg.motionBlur > 1 ? 200 : 0}>
          <AbsoluteFill>
            {SCENES.map((Scene, i) => {
              const start = i === 0 ? 0 : B[i] - T / 2;
              const end = i === SCENES.length - 1 ? B[i + 1] : B[i + 1] + T / 2;
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

        {/* ── voice-over, phrase by phrase, placed for a weighted rhythm ── */}
        {VO.map((v, i) => (
          <Sequence key={'vo' + i} from={sec(v.at)} durationInFrames={sec(v.to - v.from)}>
            <Audio src={staticFile('media/vo.mp3')} startFrom={sec(v.from)} volume={cfg.voVolume} />
          </Sequence>
        ))}
        <Sequence from={sec(CLIP.at)} durationInFrames={sec(CLIP.to - CLIP.from)}>
          <Audio src={staticFile('media/og.mp4')} startFrom={sec(CLIP.from)} volume={cfg.clipVolume} />
        </Sequence>

        <Sequence from={sec(CLIP2.at)} durationInFrames={sec(Math.min(CLIP2.to - CLIP2.from, B[4] + 0.3 - CLIP2.at))}>
          {/* sits under the voice-over, fades out with the pan */}
          <Audio
            src={staticFile('media/reaction2.mp4')}
            startFrom={sec(CLIP2.from)}
            volume={(f) => cfg.clip2Volume * interpolate(f, [0, 6, sec(B[4] - CLIP2.at - 0.3), sec(B[4] + 0.3 - CLIP2.at)], [0, 1, 1, 0], {extrapolateRight: 'clamp'})}
          />
        </Sequence>

        {/* ── sound design ── */}
        {B.slice(1, -1).map((b) => (
          <Sfx key={'w' + b} at={b - 0.35} src="sfx/whoosh.wav" vol={0.3 * sv} />
        ))}
        {[...E.keys, ...E.badges, E.flip, E.flip + 0.12, E.flip + 0.24].map((t, i) => (
          <Sfx key={'p' + i} at={t} src="sfx/pop.wav" vol={0.35 * sv} len={0.4} />
        ))}
        {/* a tick for every new «ي» */}
        {Array.from({length: YA_MAX - 1}, (_, i) => E.stretch[0] + ((i + 0.5) / (YA_MAX - 1)) * E.stretch[1]).map((t, i) => (
          <Sfx key={'y' + i} at={t} src="sfx/tap.wav" vol={0.35 * sv} len={0.15} />
        ))}
        {[E.tapAccount, E.tapJoin, E.tapSend].map((t) => (
          <Sfx key={'t' + t} at={t} src="sfx/tap.wav" vol={0.5 * sv} len={0.2} />
        ))}
        {[E.sent, E.chime].map((t) => (
          <Sfx key={'s' + t} at={t} src="sfx/success.wav" vol={0.45 * sv} />
        ))}
      </AbsoluteFill>
    </CfgCtx.Provider>
  );
};
