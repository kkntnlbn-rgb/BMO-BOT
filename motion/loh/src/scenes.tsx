import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {Clock3D, Contact, Extrude, FlipBadge3D, IconHome, IconJoin, IconUser, KeyCap3D, Phone, SCREEN, Tap, Words} from './fx';
import {C, F, W, backOut, easeInOut, p, sec, useT} from './theme';

/** Absolute timeline time (seconds) inside a scene that starts at `o`. */
const useAbs = (_o: number) => useT();

/** Camera is alive inside every scene: slow push + drift (same as Saiqal). */
const Live: React.FC<{t: number; t0: number; t1: number; push?: number; drift?: number; children: React.ReactNode}> = ({t, t0, t1, push = 0.04, drift = 16, children}) => {
  const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  return <AbsoluteFill style={{transform: `translateX(${(k - 0.5) * drift}px) scale(${1 + push * k})`}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

/* ── S1 0.0s: «تدري وش أسهل من التسجيل عالأوجي؟» ───────────────────────── */
export const S1Hook: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  return (
    <Live t={t} t0={0} t1={2.8}>
      <div style={{position: 'absolute', left: 760, top: 210}}>
        <Clock3D size={230} k={p(t, 0.5, 0.9, backOut)} t={t} spin={-360 * (1 - p(t, 0.5, 1.4))} />
      </div>
      <Center y={760}>
        <Words text={'تدري وش أسهل \n من التسجيل عالأوجي؟'} at={0.3} stagger={0.13} size={118} hl={['عالأوجي؟']} />
      </Center>
    </Live>
  );
};

/* ── S2 2.15s: the OG reaction clip (with its own audio, added in the master) ── */
export const S2Reaction: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  const k = p(t, 2.25, 0.8);
  const w = 940;
  const h = (w * 464) / 560;
  return (
    <Live t={t} t0={2.15} t1={7.3} push={0.05}>
      <div
        style={{
          position: 'absolute',
          left: (W - w) / 2,
          top: 520,
          width: w,
          height: h,
          borderRadius: 48,
          overflow: 'hidden',
          border: `12px solid ${C.brown}`,
          boxShadow: '0 40px 70px rgba(73,57,41,.45)',
          transform: `translateY(${(1 - k) * 140}px) rotate(${(1 - k) * -5 - 1.2}deg) scale(${0.9 + 0.1 * k})`,
          opacity: Math.min(1, k * 1.6),
        }}
      >
        <Sequence from={sec(0.15)}>
          <OffthreadVideo src={staticFile('media/og.mp4')} startFrom={sec(0.8)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
      </div>
      <div style={{position: 'absolute', left: 90, top: 400}}>
        <Clock3D size={170} k={p(t, 2.6, 0.8, backOut)} t={t} />
      </div>
    </Live>
  );
};

/* ── S3 6.7s: «إنك تسجل براندك عندنا! بثلاث ضغطات بس» + 3D step keys ────── */
export const S3ThreeTaps: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  const keys = [
    {icon: <IconHome />, at: 9.05},
    {icon: <IconUser />, at: 9.4},
    {icon: <IconJoin />, at: 9.75},
  ];
  const size = 270;
  return (
    <Live t={t} t0={6.7} t1={11.0}>
      <Center y={380}>
        <Words text={'إنك تسجل براندك \n عندنا!'} at={7.15} stagger={0.14} size={110} hl={['عندنا!']} />
      </Center>
      <Center y={760}>
        <Words text="بثلاث ضغطات بس" at={8.85} stagger={0.14} size={92} color={C.brownSoft} />
      </Center>
      {keys.map((kk, i) => {
        const x = W / 2 + (1 - i) * 330 - size / 2; // RTL: step 1 on the right
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 1040 + Math.sin(t * 2 + i) * 8}}>
            <KeyCap3D size={size} icon={kk.icon} n={i + 1} k={p(t, kk.at, 0.7, backOut)} t={t} seed={i} />
          </div>
        );
      })}
    </Live>
  );
};

/* ── S4 10.45s: «بتحل مشاكل كثيييييرة» — problems flip to solved ─────────── */
export const S4Problems: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  const stretch = p(t, 11.95, 0.85, easeInOut); // follows the voice's long «كثيييرة»
  const tatweel = 'ـ'.repeat(Math.round(stretch * 9));
  const badges = [
    {x: 150, y: 330, s: 170, a: 10.9},
    {x: 790, y: 270, s: 200, a: 11.05},
    {x: 110, y: 1330, s: 210, a: 11.2},
    {x: 800, y: 1380, s: 170, a: 11.35},
    {x: 470, y: 1500, s: 140, a: 11.5},
  ];
  return (
    <Live t={t} t0={10.45} t1={13.2}>
      {badges.map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b.x, top: b.y + Math.sin(t * 1.8 + i) * 10}}>
          <FlipBadge3D size={b.s} k={p(t, b.a, 0.6, backOut)} flip={p(t, 12.0 + i * 0.1, 0.6, easeInOut)} t={t} seed={i} />
        </div>
      ))}
      <Center y={700}>
        <Words text="بتحل مشاكل" at={10.9} stagger={0.15} size={120} />
      </Center>
      <Center y={880}>
        <div
          dir="rtl"
          style={{
            fontFamily: F.head,
            fontWeight: 900,
            fontSize: 150,
            color: C.yellow,
            background: C.brown,
            padding: '0 36px 10px',
            borderRadius: 28,
            transform: `scale(${0.6 + 0.4 * p(t, 11.45, 0.6, backOut)})`,
            opacity: p(t, 11.45, 0.3),
            boxShadow: '0 24px 40px rgba(73,57,41,.35)',
            whiteSpace: 'nowrap',
          }}
        >
          {`كثيـ${tatweel}رة`}
        </div>
      </Center>
    </Live>
  );
};

/* ── S5 12.6s: the three taps, shown on the real app ──────────────────────── */
const PW = 600; // phone width
const SW = PW - 28;
const SC = SW / SCREEN.w; // screenshot px → on-screen px
const sx = (x: number) => 14 + x * SC;
const sy = (y: number) => 14 + y * SC;

const Caption: React.FC<{t: number; text: string; at: number; until: number; hl?: string[]}> = ({t, text, at, until, hl}) => {
  if (t < at - 0.1 || t > until + 0.5) return null;
  const out = p(t, until, 0.35, easeInOut);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, transform: `translateY(${-out * 60}px)`, opacity: 1 - out, filter: `blur(${out * 6}px)`}}>
      <Center y={0}>
        <Words text={text} at={at} stagger={0.12} size={100} hl={hl} />
      </Center>
    </div>
  );
};

const typed = (t: number, at: number, s: string, cps = 18) => s.slice(0, Math.max(0, Math.floor((t - at) * cps)));

export const S5App: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  const enter = p(t, 12.65, 1.0);
  // screen pushes (RTL apps push in from the left)
  const toAcc = p(t, 15.0, 0.5, easeInOut);
  const toJoin = p(t, 16.6, 0.5, easeInOut);
  const screens = [
    {src: 'media/screen-home.png', x: toAcc * 0.35},
    {src: 'media/screen-account.png', x: -1 + toAcc + toJoin * 0.35},
    {src: 'media/screen-join.png', x: -1 + toJoin},
  ];
  // camera focus keyframes (screenshot coords) + zoom
  const kf: [number, number, number, number][] = [
    // time, fx, fy, zoom
    [13.0, 460, 1000, 1.0],
    [14.4, 460, 1000, 1.0],
    [14.9, 300, 1600, 1.12],
    [15.3, 460, 1000, 1.0],
    [16.0, 460, 1300, 1.1],
    [16.9, 460, 1000, 1.0],
    [17.4, 460, 1000, 1.0],
    [17.9, 460, 1000, 1.14],
    [19.0, 460, 1250, 1.14],
    [19.5, 460, 1300, 1.1],
    [20.1, 460, 1000, 1.0],
  ];
  const ts = kf.map((k) => k[0]);
  const ip = (i: number) => interpolate(t, ts, kf.map((k) => k[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const fx = ip(1);
  const fy = ip(2);
  const z = ip(3);
  const phoneH = 14 * 2 + (SW * SCREEN.h) / SCREEN.w;
  const camX = (PW / 2 - sx(fx)) * (z - 1) * 1.6;
  const camY = (phoneH / 2 - sy(fy)) * (z - 1) * 1.6;

  const fields = [
    {y: 695, v: 'براند الريم', at: 17.55},
    {y: 905, v: 'عبدالله محمد', at: 17.9},
    {y: 1115, v: '0555 123 456', at: 18.25},
    {y: 1325, v: 'hello@brand.sa', at: 18.6},
  ];
  const sent = p(t, 19.55, 0.5, backOut);

  return (
    <AbsoluteFill>
      <Caption t={t} text="من واجهة التطبيق" at={13.0} until={14.5} />
      <Caption t={t} text="تروح لـ حسابي" at={14.6} until={15.8} hl={['حسابي']} />
      <Caption t={t} text="ثم انضم لنا" at={15.9} until={17.3} hl={['انضم']} />
      <Caption t={t} text="وتعبي بيانات براندك" at={17.45} until={18.95} hl={['براندك']} />
      <Caption t={t} text="وتضغط إرسال" at={19.05} until={21} hl={['إرسال']} />

      <div style={{position: 'absolute', left: (W - PW) / 2, top: 560, perspective: 1600}}>
        <Contact x={PW / 2} y={phoneH * 0.86 + 230} w={PW * 0.9} k={enter * 0.8} />
        <div
          style={{
            transformOrigin: '50% 30%',
            transform: `translate(${camX}px, ${camY + (1 - enter) * 900}px) rotateX(${(1 - enter) * 35 + 4}deg) rotateY(${Math.sin(t * 0.8) * 5 - 3}deg) scale(${z * 0.92})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <Phone w={PW} screens={screens}>
            {/* typing into the join form */}
            {fields.map((f, i) => {
              const v = typed(t, f.at, f.v);
              if (!v) return null;
              return (
                <div
                  key={i}
                  dir={/[a-z0-9]/i.test(f.v[0]) ? 'ltr' : 'rtl'}
                  style={{
                    position: 'absolute',
                    right: (SCREEN.w - 860) * SC,
                    top: (f.y - 40) * SC,
                    width: 760 * SC,
                    height: 80 * SC,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontFamily: F.ui,
                    fontWeight: 700,
                    fontSize: 46 * SC,
                    color: C.brown,
                    transform: `translateX(${(-1 + toJoin) * SW}px)`,
                  }}
                >
                  {v}
                  <span style={{opacity: Math.floor(t * 3) % 2 ? 1 : 0, marginInline: 2}}>|</span>
                </div>
              );
            })}
            {/* sent: dim + 3D badge */}
            {t > 19.5 && (
              <AbsoluteFill style={{background: `rgba(73,57,41,${0.55 * Math.min(1, sent)})`, alignItems: 'center', justifyContent: 'center'}}>
                <div style={{position: 'relative', width: 220, height: 220}}>
                  <FlipBadge3D size={220} k={sent} flip={1} t={t} seed={3} />
                </div>
                <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 64, color: C.yellow, marginTop: 40, opacity: p(t, 19.75, 0.4)}}>تم الإرسال</div>
              </AbsoluteFill>
            )}
          </Phone>
          {/* taps (phone coordinates) */}
          <Tap x={sx(170)} y={sy(1880)} at={14.85} t={t} />
          <Tap x={sx(460)} y={sy(1555)} at={16.45} t={t} />
          <Tap x={sx(460)} y={sy(1537)} at={19.4} t={t} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── S6 19.9s: LOH lockup — extruded 3D logo, clock hands spin and land as a check ── */
export const S6Logo: React.FC<{o: number}> = ({o}) => {
  const t = useAbs(o);
  const k = p(t, 20.2, 1.0);
  const spin = interpolate(p(t, 20.3, 1.5, easeInOut), [0, 1], [-720, 0]);
  const LW = 980; // rendered logo image width (source 970×894)
  const s = LW / 970;
  const LH = 894 * s;
  const logo = (side: boolean) => (
    <div style={{position: 'relative', width: LW, height: LH}}>
      <Img src={staticFile('media/logo-nohands.png')} style={{width: LW, height: LH, filter: side ? 'brightness(.55)' : undefined}} />
      <svg viewBox="0 0 970 894" width={LW} height={LH} style={{position: 'absolute', inset: 0}}>
        <g transform={`rotate(${spin} 455 470)`}>
          <path d="M404 431 L455 470 L516 406" fill="none" stroke={side ? '#2a2017' : C.brown} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="455" cy="470" r="8" fill={side ? '#2a2017' : C.brown} />
        </g>
      </svg>
    </div>
  );
  return (
    <Live t={t} t0={19.9} t1={24} push={0.03} drift={0}>
      <div style={{position: 'absolute', left: (W - LW) / 2, top: 420, width: LW, height: LH, clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`}}>
        <Extrude
          w={LW}
          h={LH}
          depth={34}
          layers={12}
          rx={10 * (1 - k) + Math.sin(t * 1.2) * 3}
          ry={-24 * (1 - k) + Math.sin(t * 0.9) * 5}
          render={(side) => logo(side)}
        />
      </div>
      <Center y={1240}>
        <Words text="سجّل براندك بثلاث ضغطات" at={21.0} stagger={0.12} size={84} hl={['بثلاث']} />
      </Center>
    </Live>
  );
};
