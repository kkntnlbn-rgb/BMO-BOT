import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { COLORS, FONTS } from './styles/tokens';
import { F, OUTRO_WORDS } from './data/defaultTimestamps';
import { InvertedCornerFrame } from './components/InvertedCornerFrame';
import { StopMotionPaper } from './components/StopMotionPaper';
import { PostageStampCard } from './components/PostageStampCard';
import { SocialCommentCard } from './components/SocialCommentCard';
import { InkCheckmark } from './components/InkCheckmark';
import { PageCurl3D } from './components/PageCurl3D';
import { Captions, SceneCaptions } from './components/Captions';
import { DynamicKashida } from './components/DynamicKashida';
import { Cut, Shot } from './components/Footage';
import { BrandMap } from './components/BrandMap';
import { DrawBracket, glitchFilter, Inset, PaperBg, PhotoStack, StampFrame } from './components/Editorial';

loadFont({ family: 'Thmanyah Serif', url: staticFile('assets/fonts/thmanyah-serif-text-black.otf'), weight: '900' });

const img = (n: string) => staticFile(`assets/images/${n}`);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* ---------- small pieces ---------- */
const HandNote: React.FC<{ lines: string[] }> = ({ lines }) => (
  <div dir="rtl" style={{ position: 'relative', background: '#F6F2E8', padding: '46px 52px 70px', borderRadius: 3,
    backgroundImage: 'repeating-linear-gradient(#0000 0 66px, #d8d0bf 66px 68px)', backgroundPosition: '0 96px',
    fontFamily: FONTS.kinetic, fontWeight: 900, fontSize: 52, lineHeight: '68px', color: '#2a2622',
    clipPath: 'polygon(0 0,100% 0,100% 84%,89% 100%,0 100%)' }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
    <div style={{ position: 'absolute', left: 52, bottom: 22, fontSize: 32, opacity: 0.6 }}>دار</div>
    {/* corner peel */}
    <div style={{ position: 'absolute', right: 0, bottom: 0, width: '11%', height: '16%',
      background: 'linear-gradient(135deg,#d9cfbb 0 48%, #0000 52%)', filter: 'drop-shadow(-3px -3px 4px rgba(0,0,0,.3))' }} />
  </div>
);

const Tag: React.FC<{ at: number; x: number; y: number; r: number; text: string }> = ({ at, x, y, r, text }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ fps, frame: frame - at, config: { damping: 22, stiffness: 300, mass: 0.8 } });
  return (
    <div dir="rtl" style={{ position: 'absolute', left: x, top: y, width: 230, height: 100, background: '#FBF8F1',
      boxShadow: '0 10px 18px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.kinetic, fontWeight: 900, fontSize: 42, color: '#1d1a17', transform: `rotate(${r}deg) scale(${s})` }}>{text}</div>
  );
};

/* ---------- PiP card scene (transitions-maps-3d §2) ---------- */
const PipCard: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ fps, frame, config: { damping: 22, stiffness: 300, mass: 0.8 } });
  const g = spring({ fps, frame: frame - (F(4.70) - F(4.33)), config: { damping: 20, stiffness: 90 } });
  const sc = s * interpolate(g, [0, 1], [1.1, 0.95]);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 70, top: 500, width: 600, height: 840, overflow: 'hidden',
        boxShadow: '0 24px 44px rgba(0,0,0,.5)', transform: `scale(${sc}) rotate(${-1.5 * g}deg)` }}>
        <Sequence durationInFrames={F(6.10) - F(4.33)}><Shot src="pipfront" rate={0.93} push={0.03} /></Sequence>
        <Sequence from={F(6.10) - F(4.33)}><Shot src="pipcup" rate={0.8} push={0.03} /></Sequence>
      </div>
      <Tag at={F(6.45) - F(4.33)} x={36} y={1180} r={-8} text="دار" />
      <Tag at={F(6.59) - F(4.33)} x={130} y={1370} r={6} text="الفناتير" />
      <Tag at={F(6.73) - F(4.33)} x={330} y={1250} r={-4} text="النعيرية" />
    </AbsoluteFill>
  );
};

/* ---------- comments slide-out wrapper ---------- */
const SlideOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [at, at + 9], [0, -1500], { ...clamp, easing: Easing.in(Easing.cubic) });
  return <div style={{ transform: `translateY(${y}px)` }}>{children}</div>;
};

/* ---------- checklist (tactile-paper-collage §4) ---------- */
const Checklist: React.FC = () => {
  const items = [['النعيرية', 'الفرع الأول'], ['الفناتير · الجبيل', 'الفرع الثاني'], ['فرعنا الجاي', 'قريباً بإذن الله']];
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const q = spring({ fps, frame: frame - F(2.25), config: { damping: 22, stiffness: 300, mass: 0.8 } });
  return (
    <AbsoluteFill dir="rtl" style={{ fontFamily: FONTS.kinetic, fontWeight: 900, color: COLORS.ink }}>
      <PaperBg tone="sand" />
      {items.map(([h, p], i) => (
        <div key={i} style={{ position: 'absolute', right: 90, left: 90, top: 330 + i * 430, height: 400, borderBottom: i < 2 ? '3px solid rgba(65,56,21,.35)' : 'none' }}>
          <div style={{ position: 'absolute', right: 0, top: 60 }}>
            {i < 2 ? <InkCheckmark startFrame={F(0.36 + i * 0.9)} duration={7} size={170} />
              : <svg width={170} height={170} viewBox="0 0 100 100"><rect x={14} y={24} width={62} height={62} fill="none" stroke="#413815" strokeWidth={3} />
                  <text x={45} y={78} textAnchor="middle" fontSize={60} fill={COLORS.burgundy} fontFamily={FONTS.kinetic}
                    style={{ transform: `scale(${q})`, transformOrigin: '45px 55px' }}>؟</text></svg>}
          </div>
          <div style={{ position: 'absolute', right: 200, top: 70, fontSize: 104 }}>{h}</div>
          <div style={{ position: 'absolute', right: 200, top: 225, fontSize: 48, color: COLORS.brown }}>{p}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- outro: watercolor + cream mist + brown serif (transitions-maps-3d §6) ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t0 = F(41.16);
  const cam = interpolate(frame, [0, F(44.6) - t0], [1.22, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const ty = interpolate(frame, [0, F(44.6) - t0], [0, -18]);
  const words = OUTRO_WORDS;
  return (
    <AbsoluteFill>
      <PaperBg tone="sand" />
      <AbsoluteFill style={{ transform: `translateY(${ty}px) scale(${cam})`, filter: 'saturate(0.72) contrast(0.9) brightness(1.08) sepia(0.12) blur(0.6px)' }}>
        <Shot src="aerial" rate={0.6} push={0} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${COLORS.cream} 0%, ${COLORS.cream} 28%, rgba(200,182,124,0) 58%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 50% 100%, rgba(200,182,124,0) 55%, rgba(200,182,124,.85) 100%)' }} />
      <div dir="rtl" style={{ position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: FONTS.editorial,
        fontWeight: 900, color: COLORS.brown, fontSize: 112, lineHeight: '150px' }}>
        {[0, 1].map((ln) => (
          <div key={ln}>{words.filter((w) => w.line === ln).map((w, i) => {
            const f0 = F(w.t) - t0;
            const s = spring({ fps, frame: frame - f0, config: { damping: 20, stiffness: 170, mass: 0.9 } });
            const e = interpolate(frame, [f0, f0 + 12], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
            const body = w.w === 'أوسع'
              ? <DynamicKashida rightPart="أوسـ" leftPart="ـع" startFrame={f0 + 2} endFrame={f0 + 22} toStretchPx={150} fontSize={112} strokeThickness={12} baselineOffsetPx={31} color={COLORS.brown} />
              : w.w;
            return <span key={i} style={{ display: 'inline-block', margin: '0 14px', opacity: frame >= f0 ? e : 0,
              filter: e < 0.98 ? `blur(${((1 - e) * 14).toFixed(2)}px)` : undefined, transform: `translateY(${((1 - s) * 46).toFixed(2)}px)` }}>{body}</span>;
          })}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ fps, frame, config: { damping: 20, stiffness: 90 } });
  const wipe = interpolate(frame, [0, 26], [100, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const fill = interpolate(frame, [24, 40], [0, 1], clamp);
  const box: React.CSSProperties = { position: 'absolute', width: 520, left: 280, top: 620 };
  return (
    <AbsoluteFill style={{ transform: `scale(${0.97 + 0.03 * s})` }}>
      <PaperBg tone="sand" />
      <DrawBracket at={0} x={200} y={520} w={680} h={880} color={COLORS.burgundy} />
      <Img src={img('dar_logo_outline_olive.png')} style={{ ...box, clipPath: `inset(0 0 0 ${wipe}%)`, opacity: 1 - fill }} />
      <Img src={img('dar_logo_filled_olive.png')} style={{ ...box, opacity: fill }} />
    </AbsoluteFill>
  );
};

/* ---------- sound (sound-design-foley) ---------- */
const FX: [string, number, number][] = [
  ['quick_whoosh', 1.64, 0.3], ['soft_pop', 2.93, 0.5], ['quick_whoosh', 4.33, 0.3],
  ['quick_whoosh', 7.70, 0.35], ['quick_whoosh', 7.97, 0.35], ['quick_whoosh', 8.23, 0.35], ['quick_whoosh', 8.50, 0.35],
  ['quick_whoosh', 10.2, 0.4], ['soft_pop', 12.25, 0.5], ['quick_whoosh', 14.53, 0.3], ['soft_pop', 16.61, 0.5],
  ['quick_whoosh', 19.45, 0.3], ['soft_pop', 22.67, 0.5], ['pin_drop', 28.6, 0.5], ['pin_drop', 29.4, 0.5],
  ['quick_whoosh', 32.06, 0.35], ['ui_bubble_pop', 33.4, 0.4], ['quick_whoosh', 35.6, 0.45], ['soft_pop', 36.1, 0.4], ['soft_pop', 36.27, 0.4],
  ['quick_whoosh', 37.26, 0.3], ['quick_whoosh', 41.16, 0.3], ['pen_tick', 44.6, 0.4],
];
const SoundDesignTrack: React.FC = () => (
  <>
    <Audio src={staticFile('assets/audio/voiceover.mp3')} volume={1} />
    {FX.map(([n, t, v], i) => (
      <Sequence key={i} from={F(t)} durationInFrames={20}><Audio src={staticFile(`assets/audio/foley/${n}.wav`)} volume={v} /></Sequence>
    ))}
  </>
);

/* ---------- promise scene (replaces page-curl + checklist) ----------
   Gold paper. Words build exactly like the reference (feathered reveal, knock-out pill),
   then a whip-push: the whole text block shoots left with horizontal motion blur while a
   rounded card of the lounge arrives from the right, tilted, and settles; Dar badges pop. */
const PromiseScene: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const t0 = F(32.06);
  const w = F(35.6) - t0; // whip frame
  const out = interpolate(frame, [w - 1, w + 8], [0, 1], { ...clamp, easing: Easing.bezier(0.55, 0, 0.9, 0.35) });
  const inE = interpolate(frame, [w + 2, w + 13], [0, 1], { ...clamp, easing: Easing.bezier(0.12, 0.9, 0.25, 1) });
  const inV = 1 - interpolate(frame, [w + 2, w + 13], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const drift = interpolate(frame, [w + 13, w + 60], [0, 1], clamp);
  const badge = (d: number) => spring({ fps, frame: frame - (w + 14 + d), config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const hb = (id: string, v: number) => (
    <svg width={0} height={0} style={{ position: 'absolute' }}><filter id={id} x="-30%" y="0" width="160%" height="100%"><feGaussianBlur stdDeviation={`${v.toFixed(1)} 0`} /></filter></svg>
  );
  return (
    <AbsoluteFill>
      <PaperBg tone="gold" />
      {/* text block – pushed out */}
      {hb('pr-out', out * 90)}
      <AbsoluteFill style={{ transform: `translateX(${-out * 1150}px)`, filter: out > 0.01 ? 'url(#pr-out)' : undefined }}>
        {frame < w + 10 && <SceneCaptions scene="promise" offset={t0} only={0} />}
      </AbsoluteFill>
      {/* card – pushed in */}
      {frame >= w + 2 && (
        <>
          {hb('pr-in', inV * 80)}
          <div style={{ position: 'absolute', left: 110, top: 520, width: 860, height: 860,
            transform: `translateX(${(1 - inE) * 1100}px) rotate(${(-3.5 + (1 - inE) * 9 + drift * 1.2).toFixed(2)}deg) scale(${1 + drift * 0.02})`,
            filter: inV > 0.02 ? 'url(#pr-in)' : undefined }}>
            <StampFrame style={{ inset: 0 }}><Shot src="lounge" rate={0.55} push={0.05} /></StampFrame>
            {[[-26, -26, 0], [834, -26, 5]].map(([x, y, d], i) => (
              <div key={i} style={{ position: 'absolute', left: x, top: y, width: 70, height: 70, borderRadius: 35, background: '#2B250D',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge(d)})`, boxShadow: '0 6px 14px rgba(0,0,0,.4)' }}>
                <Img src={img('dar_mark_olive.png')} style={{ width: 40, filter: 'brightness(3.2) sepia(.6)' }} />
              </div>
            ))}
          </div>
          <SceneCaptions scene="promise" offset={t0} only={1} />
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- the film ---------- */
const GLITCH_CUTS = [2.93, 12.25, 16.61, 22.67].map(F);
const STACK = (n: string) => img(n);

export const DarFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const rel = (a: number, b: number) => F(a) - F(b);
  const outroIn = interpolate(frame, [F(41.16) - 6, F(41.16) + 6], [0, 1], clamp);
  const logoIn = interpolate(frame, [F(44.6), F(44.6) + 8], [0, 1], clamp);
  const fx = glitchFilter(frame, GLITCH_CUTS);

  return (
    <AbsoluteFill style={{ background: '#0c0a03' }}>
      <AbsoluteFill style={{ filter: fx }}>
        {/* 1 · sand paper, big centered words */}
        <Cut from={0} to={1.64} pushOut><PaperBg tone="sand" /></Cut>
        {/* 2 · rounded inset: the terrace */}
        <Cut from={1.64} to={2.93} pushIn><Inset><Shot src="open" push={0} /></Inset></Cut>
        {/* 3 · glitch → gold paper card */}
        <Cut from={2.93} to={4.33} pushOut><PaperBg tone="gold" /></Cut>
        {/* 4 · inset: branch front → pour into the Dar cup */}
        <Cut from={4.33} to={7.58} pushIn pushOut>
          <Inset>
            <Sequence durationInFrames={rel(6.10, 4.33)}><Shot src="pipfront" rate={0.9} push={0} /></Sequence>
            <Sequence from={rel(6.10, 4.33)}><Shot src="pipcup" rate={0.8} push={0} /></Sequence>
          </Inset>
        </Cut>
        {/* 5–6 · sand paper: photos fly in and stack, then fly out to reveal the next words */}
        <Cut from={7.58} to={12.25} pushIn>
          <PaperBg tone="sand" />
          <PhotoStack enterAt={4} gap={8} exitAt={rel(10.2, 7.58)} photos={[
            { src: STACK('stamp1.jpg'), x: 40, y: 430, w: 420, h: 520, r: -6, from: 'right' },
            { src: STACK('paper.jpg'), x: 150, y: 700, w: 370, h: 470, r: 5, from: 'right' },
            { src: STACK('stamp2.jpg'), x: 40, y: 1010, w: 400, h: 500, r: -3, from: 'left' },
            { src: STACK('stamp4.jpg'), x: 190, y: 1200, w: 340, h: 280, r: 7, from: 'right' },
          ]} />
        </Cut>
        {/* 7 · glitch → dark card: «مرحبا» */}
        <Cut from={12.25} to={14.53} pushOut><PaperBg tone="dark" /></Cut>
        {/* 8 · inset: the Dar wall */}
        <Cut from={14.53} to={16.61} pushIn><Inset><Shot src="logodoor" rate={0.8} push={0} /></Inset></Cut>
        {/* 9 · glitch → gold card: «وعد» */}
        <Cut from={16.61} to={19.45} pushOut><PaperBg tone="gold" /></Cut>
        {/* 10 · inset: hospitality details */}
        <Cut from={19.45} to={22.67} pushIn>
          <Inset>
            <Sequence durationInFrames={24}><Shot src="match1" rate={0.6} push={0} /></Sequence>
            <Sequence from={24} durationInFrames={24}><Shot src="match2" rate={0.6} push={0} /></Sequence>
            <Sequence from={48} durationInFrames={24}><Shot src="match4" rate={0.6} push={0} /></Sequence>
            <Sequence from={72}><Shot src="match3" rate={0.6} push={0} /></Sequence>
          </Inset>
        </Cut>
        {/* 11 · glitch → full-bleed night montage */}
        <Cut from={22.67} to={23.51}><Shot src="night1" /></Cut>
        <Cut from={23.51} to={24.6}><Shot src="night2" rate={0.95} /></Cut>
        <Cut from={24.6} to={25.94} pushOut><Shot src="night3" rate={0.64} /></Cut>
        {/* 12 · projected logo → branded map */}
        <Cut from={25.94} to={27.4} pushIn><Shot src="project" rate={0.45} /></Cut>
        <Cut from={27.4} to={30.48}><BrandMap /></Cut>
        {/* 13 · bar + growing pills → hand → 3D page curl */}
        <Cut from={30.48} to={32.06} pushOut><Shot src="bar" rate={0.68} /></Cut>
        <Cut from={32.06} to={37.26} pushIn pushOut><PromiseScene /></Cut>
        {/* 15 · inset: wide night → team */}
        <Cut from={37.26} to={41.3} pushIn>
          <Inset>
            <Sequence durationInFrames={rel(39.2, 37.26)}><Shot src="wide" rate={0.67} push={0} /></Sequence>
            <Sequence from={rel(39.2, 37.26)}><Shot src="wave" rate={0.78} push={0} /></Sequence>
          </Inset>
        </Cut>
        {/* 16 · watercolor pull-back */}
        <Sequence from={F(41.16) - 6} durationInFrames={F(44.6) - F(41.16) + 14}><AbsoluteFill style={{ opacity: outroIn }}><Outro /></AbsoluteFill></Sequence>
        {/* 17 · logo: bracket draws, outline → filled */}
        <Sequence from={F(44.6)}><AbsoluteFill style={{ opacity: logoIn }}><Logo /></AbsoluteFill></Sequence>

        <Captions hideBetween={[[27.4, 30.48]]} />
      </AbsoluteFill>
      <InvertedCornerFrame color="#ECE4CC" />
      <SoundDesignTrack />
    </AbsoluteFill>
  );
};
