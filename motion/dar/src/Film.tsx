import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Captions} from './Captions';
import {ChromaFlash, TicketFrame} from './fx';
import {Ending, LogoBuild, LogoDrop, MapScene, MarkGround, Opening, Plain, Promise, Reel, Stamps} from './scenes';
import {C, H, W, loadFonts, panEase, sec, useS} from './theme';

loadFonts();

export const DURATION = 47.6; // VO 44.6s + logo hold
export const TOTAL = sec(DURATION);
const PUSH = 0.5;

type In = 'none' | 'push-left' | 'push-up' | 'cut' | 'flash';
type Ch = {t0: number; t1: number; in: In; el: (o: number) => React.ReactNode};

/* Chapters follow the approved shot plan; montage shots are cut on the voice (reference rhythm). */
const CH: Ch[] = [
  {t0: 0, t1: 1.64, in: 'none', el: (o) => <Opening o={o} />},
  {t0: 1.64, t1: 2.93, in: 'push-left', el: (o) => <Reel o={o} ids={[7, 2]} t0={1.64} t1={2.93} />},
  {t0: 2.93, t1: 4.33, in: 'flash', el: (o) => <MarkGround o={o} color={C.oliveMid} t0={2.93} y={240} size={330} />},
  {t0: 4.33, t1: 7.58, in: 'push-left', el: (o) => <Reel o={o} ids={[8, 9, 12, 23]} t0={4.33} t1={7.58} weights={[1, 1.2, 0.9, 1.1]} ground={C.olive} />},
  {t0: 7.58, t1: 10.46, in: 'push-up', el: (o) => <Stamps o={o} />},
  {t0: 10.46, t1: 12.25, in: 'cut', el: (o) => <Plain o={o} color={C.sand} />},
  {t0: 12.25, t1: 14.53, in: 'flash', el: (o) => <MarkGround o={o} color={C.olive} t0={12.25} y={250} size={300} />},
  {t0: 14.53, t1: 16.61, in: 'push-left', el: (o) => <Reel o={o} ids={[5, 21, 24]} t0={14.53} t1={16.61} />},
  {t0: 16.61, t1: 19.45, in: 'flash', el: (o) => <MarkGround o={o} color={C.oliveMid} t0={16.61} y={240} size={300} />},
  {t0: 19.45, t1: 22.67, in: 'push-left', el: (o) => (
      <Reel
        o={o}
        ids={[19, 26, 14, 15]}
        t0={19.45}
        t1={22.67}
        ground={C.oliveMid}
        tags={[
          {x: 110, y: 560, r: -8, at: 20.3, text: 'حيّاكم'},
          {x: 120, y: 1330, r: 6, at: 20.9, text: 'مقهى دار'},
          {x: 560, y: 1430, r: -4, at: 21.5, text: 'الفناتير'},
        ]}
      />
    )},
  {t0: 22.67, t1: 25.94, in: 'flash', el: (o) => <Reel o={o} ids={[36, 50, 54, 52, 53]} t0={22.67} t1={25.94} weights={[1, 1, 0.8, 1, 1]} />},
  {t0: 25.94, t1: 27.4, in: 'cut', el: (o) => <LogoDrop o={o} />},
  {t0: 27.4, t1: 30.48, in: 'push-up', el: (o) => <MapScene o={o} />},
  {t0: 30.48, t1: 32.06, in: 'push-left', el: (o) => <Reel o={o} ids={[13, 20, 41]} t0={30.48} t1={32.06} />},
  {t0: 32.06, t1: 37.26, in: 'push-up', el: (o) => <Promise o={o} />},
  {t0: 37.26, t1: 41.16, in: 'push-left', el: (o) => <Reel o={o} ids={[42, 55, 43, 47, 48]} t0={37.26} t1={41.16} />},
  {t0: 41.16, t1: 44.6, in: 'cut', el: (o) => <Ending o={o} />},
  {t0: 44.6, t1: DURATION, in: 'cut', el: (o) => <LogoBuild o={o} />},
];

const vec = (d: In): [number, number] => (d === 'push-left' ? [-W, 0] : d === 'push-up' ? [0, -H] : [0, 0]);

/** Whip-push: outgoing and incoming travel on one vector (same hand-off grammar as LOH / Saiqal) */
const Push: React.FC<{inT: In; outT: In; len: number; children: React.ReactNode}> = ({inT, outT, len, children}) => {
  const f = useCurrentFrame();
  const Tf = sec(PUSH);
  const pushing = (x: In) => x === 'push-left' || x === 'push-up';
  const e = pushing(inT) ? interpolate(f, [0, Tf], [0, 1], {extrapolateRight: 'clamp', easing: panEase}) : 1;
  const x = pushing(outT) ? interpolate(f, [len - Tf, len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: panEase}) : 0;
  const [ix, iy] = vec(inT);
  const [ox, oy] = vec(outT);
  return <AbsoluteFill style={{transform: `translate(${-ix * (1 - e) + ox * x}px, ${-iy * (1 - e) + oy * x}px)`}}>{children}</AbsoluteFill>;
};

const Flashes: React.FC = () => {
  const t = useS();
  return (
    <>
      {CH.filter((c) => c.in === 'flash').map((c) => (
        <ChromaFlash key={c.t0} t={t} at={c.t0} />
      ))}
    </>
  );
};

const Sfx: React.FC<{at: number; src: string; vol: number; len?: number}> = ({at, src, vol, len = 1}) => (
  <Sequence from={Math.max(0, sec(at))} durationInFrames={sec(len)}>
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

export const Film: React.FC<{blur?: number}> = ({blur = 5}) => (
  <AbsoluteFill style={{background: C.olive}}>
    <CameraMotionBlur samples={blur} shutterAngle={blur > 1 ? 200 : 0}>
      <AbsoluteFill>
        {CH.map((c, i) => {
          const next = CH[i + 1];
          const pushIn = c.in === 'push-left' || c.in === 'push-up';
          const pushOut = next && (next.in === 'push-left' || next.in === 'push-up');
          const start = pushIn ? c.t0 - PUSH / 2 : c.t0;
          const end = pushOut ? c.t1 + PUSH / 2 : c.t1;
          const len = sec(end) - sec(start);
          return (
            <Sequence key={i} from={sec(start)} durationInFrames={len}>
              <Push inT={c.in} outT={next ? next.in : 'none'} len={len}>
                {c.el(start)}
              </Push>
            </Sequence>
          );
        })}
        <Captions />
      </AbsoluteFill>
    </CameraMotionBlur>
    <Flashes />
    <TicketFrame />

    <Audio src={staticFile('media/vo.mp3')} />
    {/* foley locked to the visual beats */}
    {CH.filter((c) => c.in === 'push-left' || c.in === 'push-up').map((c) => (
      <Sfx key={'w' + c.t0} at={c.t0 - 0.3} src="sfx/quick_whoosh.wav" vol={0.35} />
    ))}
    {CH.filter((c) => c.in === 'flash').map((c) => (
      <Sfx key={'f' + c.t0} at={c.t0 - 0.08} src="sfx/soft_pop.wav" vol={0.3} len={0.5} />
    ))}
    {[7.62, 7.9, 8.2, 8.5].map((t) => (
      <Sfx key={'s' + t} at={t + 0.25} src="sfx/stamp_thud.wav" vol={0.45} len={0.6} />
    ))}
    <Sfx at={10.15} src="sfx/card_flip_paper.wav" vol={0.35} />
    {[27.85, 29.45, 34.2, 34.45, 34.7].map((t) => (
      <Sfx key={'p' + t} at={t + 0.25} src="sfx/pin_drop.wav" vol={0.4} len={0.6} />
    ))}
    {[30.5, 30.9, 31.3].map((t) => (
      <Sfx key={'b' + t} at={t} src="sfx/ui_bubble_pop.wav" vol={0.3} len={0.4} />
    ))}
    <Sfx at={42.9} src="sfx/paper_unfold.wav" vol={0.35} />
    <Sfx at={44.65} src="sfx/pen_tick.wav" vol={0.35} />
  </AbsoluteFill>
);
