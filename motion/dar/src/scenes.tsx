import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {DarMark3D, Glints, Ground, Montage, PaperTags, Shot, Stamp} from './fx';
import {SceneCaptions} from './Captions';
import {C, F, H, W, backOut, easeInOut, easeOut, p, useS} from './theme';

type P = {o: number};
const useT = (o: number) => useS() + o;

/* 0.00 «ياهلا وسهلا!» — sand ground, the Dar mark turns in as a solid 3D object */
export const Opening: React.FC<P> = ({o}) => {
  const t = useT(o);
  return (
    <AbsoluteFill>
      <Ground color={C.sand} />
      <div style={{position: 'absolute', left: W / 2 - 190, top: 230}}>
        <DarMark3D size={380} k={p(t, 0.0, 1.0, backOut)} t={t} color="olive" />
      </div>
    </AbsoluteFill>
  );
};

/* plain brand ground with a floating 3D mark (used for the «why Dar?» / promise beats) */
export const MarkGround: React.FC<P & {color: string; mark?: 'cream' | 'olive'; t0: number; y?: number; size?: number}> = ({o, color, mark = 'cream', t0, y = 260, size = 300}) => {
  const t = useT(o);
  return (
    <AbsoluteFill>
      <Ground color={color} />
      <div style={{position: 'absolute', left: W / 2 - size / 2, top: y, opacity: 0.95}}>
        <DarMark3D size={size} k={p(t, t0, 0.9, backOut)} t={t} color={mark} spin={(t - t0) * 20} />
      </div>
      <Glints t={t} at={t0} n={10} w={W} h={H} seed={'mg' + t0} />
    </AbsoluteFill>
  );
};

/* montage wrapper with absolute times */
export const Reel: React.FC<P & {ids: number[]; t0: number; t1: number; weights?: number[]; ground?: string; tags?: {x: number; y: number; r: number; at: number; text: string}[]}> = ({o, ids, t0, t1, weights, ground, tags}) => {
  const t = useT(o);
  return (
    <AbsoluteFill>
      <Montage ids={ids} t0={t0} t1={t1} o={o} weights={weights} ground={ground} />
      {tags && <PaperTags t={t} items={tags} />}
    </AbsoluteFill>
  );
};

/* 7.58 «بغيناه مكان… بين أهلك» — perforated stamps fly in and stack in 3D, then fly off */
const STAMPS = [
  {id: 17, x: 130, y: 330, r: -8, at: 7.62},
  {id: 25, x: 520, y: 260, r: 7, at: 7.9},
  {id: 18, x: 170, y: 760, r: 5, at: 8.2},
  {id: 19, x: 540, y: 700, r: -6, at: 8.5},
];
export const Stamps: React.FC<P> = ({o}) => {
  const t = useT(o);
  const away = p(t, 10.15, 0.55, easeInOut);
  return (
    <AbsoluteFill style={{perspective: 1600}}>
      <Ground color={C.sand} />
      {STAMPS.map((s, i) => {
        const k = p(t, s.at, 0.7, backOut);
        const dir = i % 2 ? 1 : -1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              transformStyle: 'preserve-3d',
              transform: `translate3d(${(1 - k) * dir * 900 + away * dir * 1100}px, ${(1 - k) * -500 - away * 600}px, ${(1 - k) * 400}px) rotateZ(${s.r * k + (1 - k) * dir * 40 + away * dir * 30}deg) rotateX(${(1 - k) * 35}deg) rotateY(${dir * (1 - k) * 25}deg)`,
              opacity: t < s.at ? 0 : 1,
            }}
          >
            <Stamp id={s.id} w={400} h={520} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 10.46 «ومن أول يوم في النعيرية» / colour grounds */
export const Plain: React.FC<P & {color: string}> = ({color}) => <Ground color={color} />;

/* 25.94 «نكتب فصل جديد» — the projected «مقهى دار – الفناتير» logo shot */
export const LogoDrop: React.FC<P> = ({o}) => {
  const t = useT(o);
  return (
    <AbsoluteFill>
      <Shot id={49} len={1.5} t0={25.94 - o} />
      <Glints t={t} at={26.0} n={12} w={W} h={H * 0.6} seed="drop" />
      <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(20,16,4,.35), rgba(20,16,4,0) 65%)'}} />
    </AbsoluteFill>
  );
};

/* 27.4 the map (reference look): flat top-down, dark sea, brand-olive land, light roads; the camera
   drifts from النعيرية to الفناتير while white pins drop with bilingual labels */
const LAND = 'M0 0 H700 C 690 140, 760 220, 720 330 S 800 520, 760 640 S 860 820, 820 960 S 900 1180, 870 1320 S 960 1560, 1000 1700 L1000 2400 H0 Z';
const ROADS = [
  'M80 1900 C 200 1600, 260 1300, 330 1100 S 520 700, 640 380',
  'M40 1250 C 220 1200, 420 1150, 600 1000 S 780 860, 840 820',
  'M330 1100 C 400 1300, 520 1500, 700 1640 S 880 1800, 960 1900',
  'M120 600 C 260 650, 360 720, 430 880 S 560 1180, 640 1260',
  'M250 300 C 300 500, 320 700, 330 1100',
];
const MINOR = Array.from({length: 26}, (_, i) => {
  const x = 60 + ((i * 137) % 640);
  const y = 300 + ((i * 251) % 1500);
  return `M${x} ${y} l ${40 + (i % 5) * 18} ${-20 + (i % 7) * 9}`;
});
const MapPin: React.FC<{x: number; y: number; at: number; t: number; ar: string; en: string}> = ({x, y, at, t, ar, en}) => {
  const k = p(t, at, 0.55, backOut);
  const lab = p(t, at + 0.25, 0.4);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: t < at ? 0 : 1}}>
      <svg viewBox="0 0 40 56" width={54} height={76} style={{position: 'absolute', left: -27, top: -76 - (1 - k) * 180}}>
        <path d="M20 0 C 9 0 0 9 0 20 C 0 35 20 56 20 56 C 20 56 40 35 40 20 C 40 9 31 0 20 0 Z" fill="#ffffff" />
        <circle cx="20" cy="20" r="7" fill={C.olive} />
      </svg>
      <div style={{position: 'absolute', left: -220, width: 440, top: -190, textAlign: 'center', color: '#fff', fontFamily: F.head, fontWeight: 900, lineHeight: 1.05, opacity: lab, transform: `translateY(${(1 - lab) * 14}px)`}}>
        <div style={{fontSize: 48, letterSpacing: 1}}>{en}</div>
        <div dir="rtl" style={{fontSize: 52}}>{ar}</div>
      </div>
    </div>
  );
};
export const MapScene: React.FC<P> = ({o}) => {
  const t = useT(o);
  const pan = p(t, 27.6, 2.6, easeInOut);
  const camY = interpolate(pan, [0, 1], [-420, -980]);
  const camX = interpolate(pan, [0, 1], [-40, -260]);
  const z = interpolate(pan, [0, 1], [1.05, 1.3]);
  const route = p(t, 28.9, 0.9, easeInOut);
  return (
    <AbsoluteFill style={{background: '#232017', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 2400, transformOrigin: '0 0', transform: `translate(${camX}px, ${camY}px) scale(${z})`}}>
        <svg width={1000} height={2400} style={{position: 'absolute', inset: 0}}>
          <path d={LAND} fill={C.olive} />
          {MINOR.map((d, i) => (
            <path key={i} d={d} stroke={C.oliveMid} strokeWidth={4} opacity={0.6} />
          ))}
          {ROADS.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={C.sand} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(t, 27.45 + i * 0.12, 1.0, easeOut)} opacity={0.9} />
          ))}
          <path d="M330 1100 C 480 1180, 600 1330, 700 1640" fill="none" stroke={C.terracotta} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - route} />
          {[{x: 300, y: 1050}, {x: 560, y: 960}, {x: 690, y: 1720}].map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={40} height={28} rx={4} fill="none" stroke={C.sand} strokeWidth={3} opacity={0.7} />
          ))}
        </svg>
        <MapPin x={330} y={1100} at={27.9} t={t} ar="النعيرية" en="Al Nairyah" />
        <MapPin x={700} y={1640} at={29.4} t={t} ar="الجبيل — الفناتير" en="Jubail · Alfanateer" />
      </div>
    </AbsoluteFill>
  );
};

/* 32.06 «وخلال السنة الجاية… نوعدكم» — sand ground, new-branch pins rise in 3D; then a side push into the lounge for «بإذن الله» */
export const Promise: React.FC<P> = ({o}) => {
  const t = useT(o);
  const push = p(t, 35.95, 0.6, easeInOut);
  const pins = [0, 1, 2].map((i) => 34.2 + i * 0.25);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${-push * W}px)`}}>
        <Ground color={C.sand} />
        {pins.map((at, i) => {
          const k = p(t, at, 0.6, backOut);
          return (
            <div key={i} style={{position: 'absolute', left: 300 + i * 240, top: 1260, transform: `translateY(${(1 - k) * 200}px) scale(${k})`, opacity: t < at ? 0 : 1}}>
              <svg viewBox="0 0 60 84" width={96} height={134} style={{filter: 'drop-shadow(0 18px 14px rgba(20,16,4,.3))'}}>
                <path d="M30 0 C 13 0 0 13 0 30 C 0 52 30 84 30 84 C 30 84 60 52 60 30 C 60 13 47 0 30 0 Z" fill={i === 1 ? C.terracotta : C.olive} />
                <text x="30" y="38" textAnchor="middle" fontFamily={F.head} fontWeight={900} fontSize="26" fill={C.frame}>+</text>
              </svg>
            </div>
          );
        })}
        <Glints t={t} at={34.2} n={10} w={W} h={H} seed="prom" color={C.olive} />
        <SceneCaptions scene="promise" o={o} />
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${(1 - push) * W}px)`, filter: `blur(${(1 - push) * push * 30}px)`}}>
        {t > 35.9 && <Shot id={17} len={1.4} t0={35.95 - o} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 41.16 ending: the terrace shot shrinks into a perforated stamp on dark olive */
export const Ending: React.FC<P> = ({o}) => {
  const t = useT(o);
  const k = p(t, 42.2, 1.0, easeInOut);
  const w = interpolate(k, [0, 1], [W, 600]);
  const h = interpolate(k, [0, 1], [H, 780]);
  const x = (W - w) / 2;
  const y = interpolate(k, [0, 1], [0, 420]);
  const perf = p(t, 42.9, 0.4);
  return (
    <AbsoluteFill>
      <Ground color={C.olive} />
      <div style={{position: 'absolute', left: x - perf * 22, top: y - perf * 22, width: w + perf * 44, height: h + perf * 44, background: C.frame, opacity: perf, borderRadius: 6, transform: `rotate(${-3 * k}deg)`, boxShadow: '0 30px 50px rgba(0,0,0,.35)'}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', transform: `rotate(${-3 * k}deg)`}}>
        <Shot id={2} len={3.4} t0={41.16 - o} settle={false} />
        <AbsoluteFill style={{background: 'rgba(20,16,4,.25)', opacity: 1 - k}} />
      </div>
      <SceneCaptions scene="ending" o={o} />
    </AbsoluteFill>
  );
};

/* 44.6 logo: a frame draws itself, the outline logo is drawn, then it fills */
export const LogoBuild: React.FC<P> = ({o}) => {
  const t = useT(o);
  const frame = p(t, 44.65, 0.9, easeInOut);
  const draw = p(t, 44.9, 1.0, easeInOut);
  const fill = p(t, 45.9, 0.6, easeInOut);
  const LW = 620;
  const LH = (1520 / 1164) * LW;
  const fx = (W - LW) / 2;
  const fy = 300;
  return (
    <AbsoluteFill>
      <Ground color={C.olive} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <rect x={fx - 70} y={fy - 70} width={LW + 140} height={LH + 140} rx={28} fill="none" stroke={C.sand} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - frame} />
      </svg>
      <div style={{position: 'absolute', left: fx, top: fy, width: LW, height: LH, transform: `scale(${1 + (t - 44.6) * 0.012})`}}>
        <Img src={staticFile('logo/dar_logo_outline_cream.png')} style={{position: 'absolute', inset: 0, width: LW, height: LH, clipPath: `inset(${(1 - draw) * 100}% 0 0 0)`, opacity: 1 - fill * 0.85}} />
        <Img src={staticFile('logo/dar_logo_filled_cream.png')} style={{position: 'absolute', inset: 0, width: LW, height: LH, opacity: fill}} />
      </div>
      <Glints t={t} at={45.9} n={14} w={W} h={H} seed="logo" />
    </AbsoluteFill>
  );
};
