import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile} from 'remotion';
import {Contact, FlipBadge3D, Words} from './fx';
import {Bottle3D, Flash, MiniBottle, PhotoCard, Recycle3D, Sparkles} from './elements';
import {C, H, W, backOut, easeInOut, p, useT} from './theme';
import {E, M} from './timing';
import {Cfg, defaults} from './config';

export const CfgCtx = createContext<Cfg>(defaults);
const useCfg = () => useContext(CfgCtx);
const hl = (w: string) => (w ? [w] : []);
const easeIn = (x: number) => x * x * x;

/** Camera is alive inside every scene: slow push + drift (same grammar as LOH / Saiqal). */
const Live: React.FC<{t: number; t0: number; t1: number; push?: number; drift?: number; children: React.ReactNode}> = ({t, t0, t1, push = 0.04, drift = 16, children}) => {
  const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  return <AbsoluteFill style={{transform: `translateX(${(k - 0.5) * drift}px) scale(${1 + push * k})`}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

/** Phrase caption that reveals word by word, then lifts away when the next phrase starts. */
const Caption: React.FC<{t: number; text: string; h: string; at: number; until: number; y: number; size?: number; color?: string}> = ({t, text, h, at, until, y, size = 100, color}) => {
  if (t < at - 0.1 || t > until + 0.5) return null;
  const out = p(t, until, 0.4, easeInOut);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: `translateY(${-out * 60}px)`, opacity: 1 - out, filter: `blur(${out * 6}px)`}}>
      <Center y={0}>
        <Words text={text} at={at} stagger={0.11} size={size} hl={hl(h)} color={color} />
      </Center>
    </div>
  );
};

/* ── S1 0–6s: the transparent 3D bottle turns slowly in a natural setting ─────── */
export const S1Start: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const k = p(t, E.bottleIn, 1.0, backOut);
  const [a1] = M('s1a');
  const [b1] = M('s1b');
  return (
    <Live t={t} t0={0} t1={6.3}>
      {/* natural backdrop: the wave photo, softened and tinted into the palette */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile('media/wave.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '4% 50%', transform: `scale(${1.25 + t * 0.02})`, filter: 'blur(7px) saturate(1.1)'}} />
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(201,236,214,.25) 0%, rgba(201,236,214,.55) 55%, ${C.yellow} 82%)`}} />
      </AbsoluteFill>
      <Contact x={W / 2} y={1210} w={360} k={k} />
      <div style={{position: 'absolute', left: W / 2 - 160, top: 330, transform: `translateY(${(1 - k) * 260}px) scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.5)}}>
        <Bottle3D h={880} t={t} spin={0.22} />
      </div>
      <Caption t={t} text={c.s1[0].text} h={c.s1[0].highlight} at={a1} until={b1 - 0.15} y={1330} size={112} />
      <Caption t={t} text={c.s1[1].text} h={c.s1[1].highlight} at={b1} until={7} y={1300} size={96} />
    </Live>
  );
};

/* ── S2 6–11.25s: bottles rain down into a pile; the real pile drops in over it ─ */
const FALL = Array.from({length: 18}, (_, i) => ({
  x: 60 + random('fx' + i) * 900,
  y: 1330 + random('fy' + i) * 320,
  r: -70 + random('fr' + i) * 140,
  h: 170 + random('fh' + i) * 90,
  d: i * 0.11,
  crushed: random('fc' + i) * 0.7,
}));

export const S2Problem: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const ck = p(t, E.pileCard, 0.75, backOut);
  const tint = p(t, E.pileCard, 0.6);
  const [a, b, cc] = [M('s2a')[0], M('s2b')[0], M('s2c')[0]];
  const badges = [
    {x: 40, y: 470, s: 150},
    {x: 890, y: 430, s: 160},
    {x: 30, y: 1150, s: 130},
    {x: 910, y: 1130, s: 140},
  ];
  return (
    <Live t={t} t0={5.7} t1={11.5}>
      {/* the hero bottle is the first to fall */}
      {FALL.map((f, i) => {
        const st = E.fall0 + f.d;
        const k = Math.min(1, Math.max(0, (t - st) / 0.7));
        const land = p(t, st + 0.7, 0.35, backOut);
        const y = -400 + (f.y + 400) * easeIn(k) - (k >= 1 ? (1 - land) * 22 : 0);
        return (
          <div key={i} style={{position: 'absolute', left: f.x, top: y, transform: `rotate(${f.r * k}deg)`, opacity: t < st ? 0 : 1}}>
            <MiniBottle h={f.h} crushed={f.crushed * land} />
          </div>
        );
      })}
      <AbsoluteFill style={{background: C.brown, opacity: 0.22 * tint}} />
      {badges.map((bd, i) => (
        <div key={i} style={{position: 'absolute', left: bd.x, top: bd.y + Math.sin(t * 1.8 + i) * 10}}>
          <FlipBadge3D size={bd.s} k={p(t, E.badges[i], 0.6, backOut)} flip={0} t={t} seed={i} />
        </div>
      ))}
      <div style={{position: 'absolute', left: (W - 700) / 2, top: 470, transform: `translateY(${(1 - ck) * -1500}px) rotate(${(1 - ck) * 8 - 1.5}deg)`, opacity: t < E.pileCard ? 0 : 1}}>
        <PhotoCard src="media/pile.jpg" w={700} h={750} />
      </div>
      <Caption t={t} text={c.s2[0].text} h={c.s2[0].highlight} at={a} until={b - 0.15} y={230} size={96} />
      <Caption t={t} text={c.s2[1].text} h={c.s2[1].highlight} at={b} until={cc - 0.15} y={230} size={96} />
      <Caption t={t} text={c.s2[2].text} h={c.s2[2].highlight} at={cc} until={12} y={230} size={96} />
    </Live>
  );
};

/* ── S3 11.25–15s: the 3D recycling symbol spins in and swallows the bottle ──── */
export const S3Recycle: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const rk = p(t, E.recycleIn, 1.1, backOut);
  const into = p(t, E.bottleIntoRecycle, 0.8, easeInOut);
  const [a, b, cc] = [M('s3a')[0], M('s3b')[0], M('s3c')[0]];
  const badges = [
    {x: 60, y: 300, s: 140},
    {x: 880, y: 280, s: 150},
    {x: 70, y: 1050, s: 130},
    {x: 890, y: 1070, s: 140},
  ];
  return (
    <Live t={t} t0={10.95} t1={15.3}>
      {badges.map((bd, i) => (
        <div key={i} style={{position: 'absolute', left: bd.x, top: bd.y + Math.sin(t * 1.8 + i) * 10}}>
          <FlipBadge3D size={bd.s} k={1} flip={p(t, E.solved + i * 0.12, 0.7, easeInOut)} t={t} seed={i} />
        </div>
      ))}
      <Contact x={W / 2} y={1060} w={460} k={rk} />
      <div style={{position: 'absolute', left: (W - 600) / 2, top: 380}}>
        <Recycle3D size={600} k={rk} t={t} />
      </div>
      {/* the hero bottle shrinks and spins into the symbol's heart */}
      <div
        style={{
          position: 'absolute',
          left: W / 2 - 110,
          top: 380,
          transform: `translateY(${into * 180}px) scale(${1 - into * 0.92}) rotate(${into * 300}deg)`,
          opacity: 1 - p(t, E.bottleIntoRecycle + 0.6, 0.25),
        }}
      >
        <Bottle3D h={600} t={t} spin={0.4} />
      </div>
      <div style={{position: 'absolute', left: W / 2, top: 680}}>
        <Flash t={t} at={E.bottleIntoRecycle + 0.65} size={700} />
      </div>
      <Caption t={t} text={c.s3[0].text} h={c.s3[0].highlight} at={a} until={b - 0.12} y={1210} size={120} />
      <Caption t={t} text={c.s3[1].text} h={c.s3[1].highlight} at={b} until={cc - 0.12} y={1210} size={120} />
      <Caption t={t} text={c.s3[2].text} h={c.s3[2].highlight} at={cc} until={16} y={1180} size={100} />
    </Live>
  );
};

/* ── S4 15–22s: the bottle transforms into new products — with the requested shine ── */
const PRODUCTS = [
  {src: 'media/vase.jpg', slot: {x: 690, y: 1240, s: 0.5}},
  {src: 'media/pens.jpg', slot: {x: 390, y: 1240, s: 0.5}},
  {src: 'media/basket.jpg', slot: {x: 90, y: 1240, s: 0.5}},
];
const PW = 560;
const PH = 600;

export const S4Transform: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const [a, b] = [M('s4a')[0], M('s4b')[0]];
  const first = E.products[0];
  const bottleGone = p(t, first, 0.35, easeInOut);
  return (
    <Live t={t} t0={14.7} t1={22.3}>
      {/* ambient shine across the whole scene */}
      <Sparkles t={t} at={15.0} n={22} w={W} h={H} seed="amb" />
      {/* the hero bottle, turning, until it becomes the first product */}
      <div style={{position: 'absolute', left: W / 2 - 126, top: 380, transform: `scale(${1 - bottleGone}) rotate(${bottleGone * 120}deg)`, opacity: 1 - bottleGone}}>
        <Bottle3D h={700} t={t} spin={0.5} />
      </div>
      {PRODUCTS.map((pr, i) => {
        const at = E.products[i];
        const pop = p(t, at + 0.1, 0.7, backOut);
        const next = i < 2 ? p(t, E.products[i + 1] - 0.05, 0.6, easeInOut) : 0;
        const x = interpolate(next, [0, 1], [(W - PW) / 2, pr.slot.x - (PW * (1 - pr.slot.s)) / 2]);
        const y = interpolate(next, [0, 1], [380, pr.slot.y - (PH * (1 - pr.slot.s)) / 2]);
        const s = interpolate(next, [0, 1], [1, pr.slot.s]) * pop;
        const tagK = p(t, at + 0.35, 0.45);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: PW, height: PH, transform: `scale(${s}) rotate(${(1 - pop) * -10 + (i - 1) * 1.5}deg)`, opacity: t < at ? 0 : 1}}>
            <PhotoCard src={pr.src} w={PW} h={PH} fit="cover" />
            <div
              dir="rtl"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -46,
                transform: `translateX(-50%) scale(${0.6 + 0.4 * tagK})`,
                opacity: tagK,
                background: C.brown,
                color: C.yellow,
                fontFamily: 'Thmanyah Serif',
                fontWeight: 900,
                fontSize: next > 0.5 ? 64 : 58,
                padding: '6px 34px 14px',
                borderRadius: 22,
                whiteSpace: 'nowrap',
                boxShadow: '0 16px 30px rgba(14,77,59,.35)',
              }}
            >
              {c.products[i]}
            </div>
          </div>
        );
      })}
      {/* transformation flashes + sparkle bursts */}
      {E.products.map((at, i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: W / 2, top: 680}}>
            <Flash t={t} at={at} size={900} />
          </div>
          {t > at && t < at + 1.2 && (
            <div style={{position: 'absolute', left: W / 2 - 360, top: 330, width: 720, height: 720}}>
              <Sparkles t={t} at={at} n={12} w={720} h={720} seed={'b' + i} burst={0.3 * (1 - p(t, at, 1.0))} />
            </div>
          )}
        </React.Fragment>
      ))}
      <Caption t={t} text={c.s4[0].text} h={c.s4[0].highlight} at={a} until={b - 0.12} y={190} size={96} />
      <Caption t={t} text={c.s4[1].text} h={c.s4[1].highlight} at={b} until={22.5} y={190} size={90} />
    </Live>
  );
};

/* ── S5 22–30s: the camera widens on a clean, bright environment; Vision 2030 close ── */
export const S5Close: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const wk = p(t, E.widen, 1.8, easeInOut); // card → full frame (camera widening)
  const cw = interpolate(wk, [0, 1], [640, W]);
  const ch = interpolate(wk, [0, 1], [430, H]);
  const r = interpolate(wk, [0, 1], [44, 0]);
  const zoom = interpolate(wk, [0, 1], [1.9, 1.08]) + (t - E.widen) * 0.01;
  const [a, b, cc, d] = [M('s5a')[0], M('s5c')[0], M('s5d')[0], M('s5e')[0]];
  const fin = p(t, d, 0.9, backOut);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: (W - cw) / 2,
          top: (H - ch) / 2 - 120 * (1 - wk),
          width: cw,
          height: ch,
          borderRadius: r,
          overflow: 'hidden',
          boxShadow: `0 40px 70px rgba(14,77,59,${0.35 * (1 - wk)})`,
        }}
      >
        <Img src={staticFile('media/landscape.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 60%', transform: `scale(${zoom})`}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,40,30,0) 30%, rgba(6,40,30,.55) 62%, rgba(6,40,30,.85) 100%)', opacity: wk}} />
      </div>
      <Sparkles t={t} at={22.4} n={16} w={W} h={H * 0.6} seed="fin" />
      <Caption t={t} text={c.s5[0].text} h={c.s5[0].highlight} at={a} until={b - 0.12} y={1260} size={96} color={C.cream} />
      <Caption t={t} text={c.s5[1].text} h={c.s5[1].highlight} at={b} until={cc - 0.12} y={1290} size={104} color={C.cream} />
      <Caption t={t} text={c.s5[2].text} h={c.s5[2].highlight} at={cc} until={d - 0.12} y={1290} size={110} color={C.cream} />
      {t > d - 0.1 && (
        <>
          <div style={{position: 'absolute', left: W / 2 - 110, top: 1010}}>
            <Recycle3D size={220} k={fin} t={t} />
          </div>
          <Center y={1270}>
            <Words text={c.s5[3].text} at={d} stagger={0.14} size={118} hl={hl(c.s5[3].highlight)} color={C.cream} />
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};
