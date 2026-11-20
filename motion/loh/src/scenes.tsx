import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {Clock3D, Contact, Extrude, FlipBadge3D, IconHome, IconJoin, IconUser, KeyCap3D, Phone, SCREEN, Tap, Words} from './fx';
import {C, F, Offset, W, backOut, easeInOut, p, sec, useT} from './theme';
import {CLIP, CLIP2, E} from './timing';
import {Cfg, defaults} from './config';

export const CfgCtx = createContext<Cfg>(defaults);
const useCfg = () => useContext(CfgCtx);
const hl = (w: string) => (w ? [w] : []);

/** Camera is alive inside every scene: slow push + drift (same as Saiqal). */
const Live: React.FC<{t: number; t0: number; t1: number; push?: number; drift?: number; children: React.ReactNode}> = ({t, t0, t1, push = 0.04, drift = 16, children}) => {
  const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  return <AbsoluteFill style={{transform: `translateX(${(k - 0.5) * drift}px) scale(${1 + push * k})`}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

/* ── S1: hook question — the OG reaction drops in over it (no cut), with a light tint behind ── */
export const S1Hook: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const o = useContext(Offset);
  const k = p(t, E.clipCard, 0.75, backOut);
  const tint = p(t, E.clipCard, 0.6);
  const lift = p(t, E.clipCard - 0.1, 0.7, easeInOut);
  const w = 900;
  const h = (w * 464) / 560;
  return (
    <Live t={t} t0={0} t1={5.0}>
      <div style={{position: 'absolute', left: 760, top: 210, opacity: 1 - tint}}>
        <Clock3D size={230} k={p(t, E.hookClock, 0.9, backOut)} t={t} spin={-360 * (1 - p(t, E.hookClock, 1.4))} />
      </div>
      {/* light tint over everything behind the clip */}
      <AbsoluteFill style={{background: C.brown, opacity: 0.26 * tint}} />
      {/* the question rises to make room, so it stays readable above the clip */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-560 * lift}px) scale(${1 - 0.12 * lift})`, transformOrigin: '50% 40%'}}>
        <Center y={760}>
          <Words text={c.hook} at={E.hook} stagger={0.12} size={118} hl={hl(c.hookHighlight)} />
        </Center>
      </div>
      <div
        style={{
          position: 'absolute',
          left: (W - w) / 2,
          top: 760,
          width: w,
          height: h,
          borderRadius: 48,
          overflow: 'hidden',
          border: `12px solid ${C.yellow}`,
          background: '#000',
          boxShadow: '0 50px 90px rgba(20,12,4,.55)',
          transform: `translateY(${(1 - k) * -1500}px) rotate(${(1 - k) * 8 - 1.5}deg)`,
          opacity: t < E.clipCard ? 0 : 1,
        }}
      >
        <Sequence from={sec(CLIP.at - o)}>
          <OffthreadVideo src={staticFile('media/og.mp4')} startFrom={sec(CLIP.from)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Sequence>
        {t < CLIP.at && (
          <OffthreadVideo src={staticFile('media/og.mp4')} startFrom={sec(CLIP.from)} endAt={sec(CLIP.from) + 1} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        )}
      </div>
    </Live>
  );
};

/* ── S3: «إنك تسجل براندك عندنا! بثلاث ضغطات بس» + 3D step keys ───── */
export const S3ThreeTaps: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const icons = [<IconHome key="h" />, <IconUser key="u" />, <IconJoin key="j" />];
  const size = 270;
  return (
    <Live t={t} t0={4.4} t1={8.8}>
      <Center y={380}>
        <Words text={c.line1} at={E.line1} stagger={0.16} size={110} hl={hl(c.line1Highlight)} />
      </Center>
      <Center y={760}>
        <Words text={c.line2} at={E.line2} stagger={0.15} size={92} color={C.brownSoft} />
      </Center>
      {icons.map((icon, i) => {
        const x = W / 2 + (1 - i) * 330 - size / 2; // RTL: step 1 on the right
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 1060 + Math.sin(t * 2 + i) * 8}}>
            <KeyCap3D size={size} icon={icon} n={i + 1} k={p(t, E.keys[i], 0.8, backOut)} t={t} seed={i} />
          </div>
        );
      })}
    </Live>
  );
};

/* ── S4: «بتحل مشاكل كثيييرة» — the screen gets pulled, the «ي» multiplies, then it snaps back ── */
export const YA_MAX = 9;
export const S4Problems: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const [s0, sd] = E.stretch;
  const stretch = p(t, s0, sd, easeInOut);
  const n = 1 + Math.round(stretch * (YA_MAX - 1)); // ي → ييييييييي
  // screen pull: grows with the voice, then an elastic snap-back
  const rel = t - (s0 + sd);
  const pull = rel < 0 ? stretch : Math.exp(-5.5 * rel) * Math.cos(16 * rel);
  const sx = 1 + 0.22 * pull;
  const sy = 1 - 0.07 * pull;
  // per-letter pop on the newest «ي»
  const lastAdd = s0 + ((n - 1) / (YA_MAX - 1)) * sd;
  const pop = n > 1 && t < s0 + sd + 0.2 ? 1 + 0.08 * (1 - p(t, lastAdd, 0.12)) : 1;
  const badges = [
    {x: 40, y: 1430, s: 180},
    {x: 850, y: 1470, s: 190},
    {x: 470, y: 1640, s: 140},
    {x: 20, y: 170, s: 150},
    {x: 900, y: 150, s: 150},
  ];
  const o = useContext(Offset);
  const ck = p(t, E.clip2Card, 0.8);
  const cw = 860;
  const ch = (cw * 328) / 480;
  const word = `${c.bigWordStart}${c.bigWordLetter.repeat(n)}${c.bigWordEnd}`;
  const box = (ghost = 0) => (
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
        boxShadow: ghost ? undefined : '0 24px 40px rgba(73,57,41,.35)',
        whiteSpace: 'nowrap',
        opacity: ghost ? 0.18 * ghost : 1,
      }}
    >
      {word}
    </div>
  );
  const pulling = Math.max(0, Math.abs(pull));
  return (
    <Live t={t} t0={8.2} t1={11.8}>
      <AbsoluteFill style={{transform: `scale(${sx}, ${sy})`, transformOrigin: '50% 48%'}}>
        {/* reaction #2 — the "problems" */}
        <div
          style={{
            position: 'absolute',
            left: (W - cw) / 2,
            top: 270,
            width: cw,
            height: ch,
            borderRadius: 44,
            overflow: 'hidden',
            border: `12px solid ${C.brown}`,
            background: '#000',
            boxShadow: '0 40px 70px rgba(73,57,41,.45)',
            transform: `translateY(${(1 - ck) * -120}px) rotate(${(1 - ck) * 5 + 1.5}deg) scale(${0.9 + 0.1 * ck})`,
            opacity: Math.min(1, ck * 1.6),
          }}
        >
          <Sequence from={0} durationInFrames={Math.max(1, sec(CLIP2.at - o))}>
            <OffthreadVideo src={staticFile('media/reaction2.mp4')} startFrom={sec(CLIP2.from)} endAt={sec(CLIP2.from) + 1} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
          <Sequence from={sec(CLIP2.at - o)}>
            <OffthreadVideo src={staticFile('media/reaction2.mp4')} startFrom={sec(CLIP2.from)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
        </div>
        {badges.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x - (sx - 1) * (540 - b.x) * 0.6, top: b.y + Math.sin(t * 1.8 + i) * 10}}>
            <FlipBadge3D size={b.s} k={p(t, E.badges[i], 0.7, backOut)} flip={p(t, E.flip + i * 0.12, 0.7, easeInOut)} t={t} seed={i} />
          </div>
        ))}
        <Center y={1000}>
          <Words text={c.problems} at={E.problems} stagger={0.16} size={120} />
        </Center>
        <Center y={1170}>
          <div style={{position: 'relative', transform: `scale(${(0.6 + 0.4 * p(t, E.bigWord, 0.7, backOut)) * pop})`, opacity: p(t, E.bigWord, 0.35)}}>
            {/* rubber-band echoes while the word is being pulled */}
            {[1, 2, 3].map((g) => (
              <div key={g} style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', transform: `translateX(${g * 26 * pulling}px)`, filter: 'blur(4px)'}}>
                {box(pulling * (1 - g * 0.25))}
              </div>
            ))}
            <div style={{position: 'relative'}}>{box()}</div>
          </div>
        </Center>
      </AbsoluteFill>
    </Live>
  );
};

/* ── S5: the three taps on the real app ────────────────────────────── */
const PW = 600;
const SW = PW - 28;
const SC = SW / SCREEN.w;
const sx = (x: number) => 14 + x * SC;
const sy = (y: number) => 14 + y * SC;

const Caption: React.FC<{t: number; text: string; at: number; until: number; hl: string[]}> = ({t, text, at, until, hl: h}) => {
  if (t < at - 0.1 || t > until + 0.5) return null;
  const out = p(t, until, 0.4, easeInOut);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, transform: `translateY(${-out * 60}px)`, opacity: 1 - out, filter: `blur(${out * 6}px)`}}>
      <Center y={0}>
        <Words text={text} at={at} stagger={0.13} size={100} hl={h} />
      </Center>
    </div>
  );
};

const typed = (t: number, at: number, s: string, cps = 40) => s.slice(0, Math.max(0, Math.floor((t - at) * cps)));

export const S5App: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const enter = p(t, E.phoneIn, 0.95);
  const toAcc = p(t, E.toAccount, 0.55, easeInOut);
  const toJoin = p(t, E.toJoin, 0.55, easeInOut);
  const screens = [
    {src: 'media/screen-home.png', x: toAcc * 0.35},
    {src: 'media/screen-account.png', x: -1 + toAcc + toJoin * 0.35},
    {src: 'media/screen-join.png', x: -1 + toJoin},
  ];
  // camera focus keyframes: time, focus x/y (screenshot px), zoom
  const kf: [number, number, number, number][] = [
    [E.phoneIn + 0.6, 460, 1000, 1.0],
    [E.tapAccount - 0.6, 460, 1000, 1.0],
    [E.tapAccount, 300, 1600, 1.12],
    [E.toAccount + 0.4, 460, 1000, 1.0],
    [E.tapJoin, 460, 1300, 1.1],
    [E.toJoin + 0.3, 460, 1000, 1.0],
    [E.fields[0] + 0.05, 460, 1000, 1.0],
    [E.fields[0] + 0.45, 460, 1000, 1.14],
    [E.tapSend - 0.5, 460, 1250, 1.14],
    [E.tapSend, 460, 1300, 1.1],
    [E.sent + 0.8, 460, 1000, 1.0],
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
    {y: 695, v: c.formCompany},
    {y: 905, v: c.formPerson},
    {y: 1115, v: c.formPhone},
    {y: 1325, v: c.formEmail},
  ];
  const sent = p(t, E.sent, 0.6, backOut);

  return (
    <AbsoluteFill>
      {c.captions.map((cap, i) => (
        <Caption key={i} t={t} text={cap.text} at={E.captions[i][0]} until={E.captions[i][1]} hl={hl(cap.highlight)} />
      ))}

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
            {fields.map((f, i) => {
              const v = typed(t, E.fields[i], f.v);
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
            {t > E.sent - 0.05 && (
              <AbsoluteFill style={{background: `rgba(73,57,41,${0.55 * Math.min(1, sent)})`, alignItems: 'center', justifyContent: 'center'}}>
                <div style={{position: 'relative', width: 220, height: 220}}>
                  <FlipBadge3D size={220} k={sent} flip={1} t={t} seed={3} />
                </div>
                <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 64, color: C.yellow, marginTop: 40, opacity: p(t, E.sent + 0.2, 0.4)}}>{c.sentText}</div>
              </AbsoluteFill>
            )}
          </Phone>
          <Tap x={sx(170)} y={sy(1880)} at={E.tapAccount} t={t} />
          <Tap x={sx(460)} y={sy(1555)} at={E.tapJoin} t={t} />
          <Tap x={sx(460)} y={sy(1537)} at={E.tapSend} t={t} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── S6: extruded 3D LOH logo; clock hands spin and land as a check ── */
export const S6Logo: React.FC = () => {
  const t = useT();
  const c = useCfg();
  const k = p(t, E.logo, 1.1);
  const spin = interpolate(p(t, E.logoSpin[0], E.logoSpin[1], easeInOut), [0, 1], [-720, 0]);
  const LW = 980;
  const LH = (894 * LW) / 970;
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
    <Live t={t} t0={18.5} t1={21} push={0.03} drift={0}>
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
        <Words text={c.tagline} at={E.tagline} stagger={0.13} size={84} hl={hl(c.taglineHighlight)} />
      </Center>
    </Live>
  );
};
