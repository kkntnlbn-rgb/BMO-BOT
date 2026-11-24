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
import { Captions } from './components/Captions';
import { Cut, Shot } from './components/Footage';
import { BrandMap } from './components/BrandMap';

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
    <AbsoluteFill dir="rtl" style={{ background: COLORS.cream, fontFamily: FONTS.kinetic, fontWeight: 900, color: COLORS.ink }}>
      {items.map(([h, p], i) => (
        <div key={i} style={{ position: 'absolute', right: 90, left: 90, top: 330 + i * 430, height: 400, borderBottom: i < 2 ? '3px solid #cbbfa6' : 'none' }}>
          <div style={{ position: 'absolute', right: 0, top: 60 }}>
            {i < 2 ? <InkCheckmark startFrame={F(0.36 + i * 0.9)} duration={7} size={170} />
              : <svg width={170} height={170} viewBox="0 0 100 100"><rect x={14} y={24} width={62} height={62} fill="none" stroke="#8D7F6B" strokeWidth={3} />
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
  const cam = interpolate(frame, [0, F(44.6) - t0], [1, 1.04]);
  const ty = interpolate(frame, [0, F(44.6) - t0], [0, -18]);
  const words = OUTRO_WORDS;
  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      <AbsoluteFill style={{ transform: `translateY(${ty}px) scale(${cam})`, filter: 'saturate(0.72) contrast(0.9) brightness(1.08) sepia(0.12) blur(0.6px)' }}>
        <Shot src="aerial" rate={0.6} push={0} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(${COLORS.cream} 0%, ${COLORS.cream} 28%, rgba(234,227,210,0) 58%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(120% 80% at 50% 100%, rgba(234,227,210,0) 55%, rgba(234,227,210,.85) 100%)' }} />
      <div dir="rtl" style={{ position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: FONTS.editorial,
        fontWeight: 900, color: COLORS.brown, fontSize: 112, lineHeight: '150px' }}>
        {[0, 1].map((ln) => (
          <div key={ln}>{words.filter((w) => w.line === ln).map((w, i) => {
            const s = spring({ fps, frame: frame - (F(w.t) - t0), config: { damping: 22, stiffness: 300, mass: 0.8 } });
            return <span key={i} style={{ display: 'inline-block', margin: '0 14px', opacity: frame >= F(w.t) - t0 ? 1 : 0, transform: `scale(${0.86 + 0.14 * s})` }}>{w.w}</span>;
          })}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ fps, frame, config: { damping: 20, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ background: COLORS.cream, alignItems: 'center', justifyContent: 'center' }}>
      <Img src={img('dar_logo_navy.png')} style={{ width: 380, opacity: s, transform: `scale(${0.96 + 0.04 * s})` }} />
    </AbsoluteFill>
  );
};

/* ---------- sound (sound-design-foley) ---------- */
const FX: [string, number, number][] = [
  ['soft_pop', 1.94, 0.45], ['soft_pop', 2.24, 0.45], ['soft_pop', 2.54, 0.45],
  ['soft_pop', 4.33, 0.4], ['stamp_thud', 6.45, 0.35], ['stamp_thud', 6.59, 0.35], ['stamp_thud', 6.73, 0.35],
  ['paper_unfold', 7.58, 0.55], ['paper_unfold', 7.91, 0.55], ['paper_unfold', 8.31, 0.55],
  ['stamp_thud', 10.46, 0.4], ['stamp_thud', 10.6, 0.4], ['stamp_thud', 10.73, 0.4],
  ['quick_whoosh', 16.61, 0.35], ['ui_bubble_pop', 16.7, 0.45], ['ui_bubble_pop', 16.86, 0.45], ['ui_bubble_pop', 17.02, 0.45],
  ['quick_whoosh', 22.2, 0.3], ['pin_drop', 28.6, 0.5], ['pin_drop', 29.4, 0.5],
  ['card_flip_paper', 32.45, 0.65], ['pen_tick', 33.85, 0.6], ['pen_tick', 34.75, 0.6], ['quick_whoosh', 41.16, 0.3],
];
const SoundDesignTrack: React.FC = () => (
  <>
    <Audio src={staticFile('assets/audio/voiceover.mp3')} volume={1} />
    {FX.map(([n, t, v], i) => (
      <Sequence key={i} from={F(t)} durationInFrames={20}><Audio src={staticFile(`assets/audio/foley/${n}.wav`)} volume={v} /></Sequence>
    ))}
  </>
);

/* ---------- the film ---------- */
export const DarFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const rel = (a: number, b: number) => F(a) - F(b);
  const frameOpacity = interpolate(frame, [F(41.16), F(41.16) + 18], [1, 0], clamp);
  const outroIn = interpolate(frame, [F(41.16) - 9, F(41.16) + 9], [0, 1], clamp);
  const logoIn = interpolate(frame, [F(44.6), F(44.6) + 12], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: COLORS.burgundy }}>
      {/* 1 opening */}
      <Cut from={0} to={1.64}><Shot src="open" /></Cut>
      {/* 2 fixed-object match cuts every 9 frames */}
      <Cut from={1.64} to={1.94}><Shot src="match1" push={0} /></Cut>
      <Cut from={1.94} to={2.24}><Shot src="match2" push={0} /></Cut>
      <Cut from={2.24} to={2.54}><Shot src="match3" push={0} /></Cut>
      <Cut from={2.54} to={2.93}><Shot src="match4" /></Cut>
      {/* 3 logo wall – shows under the PiP card until the burgundy swap */}
      <Cut from={2.93} to={4.70}><Shot src="logodoor" rate={0.95} /></Cut>
      {/* 4 PiP card → burgundy */}
      <Cut from={4.33} to={7.58}><PipCard /></Cut>
      {/* 5 stop-motion notes */}
      <Cut from={7.58} to={11.0}>
        <StopMotionPaper enterFrame={0} targetX={-150} targetY={-330} targetRotate={-5} width={560}><HandNote lines={['مرحبا…', 'والقلب أوسع من الدار']} /></StopMotionPaper>
        <StopMotionPaper enterFrame={9} src={img('paper.jpg')} targetX={-200} targetY={40} targetRotate={4} width={480} />
        <StopMotionPaper enterFrame={21} targetX={-110} targetY={420} targetRotate={-2.5} width={540}><HandNote lines={['هنا تحس', 'إنك بين أهلك']} /></StopMotionPaper>
      </Cut>
      {/* 6 perforated stamps */}
      <Cut from={10.46} to={17.4}>
        <PostageStampCard id="s1" src={img('stamp1.jpg')} enterFrame={0} exitFrame={rel(16.61, 10.46)} x={40} y={470} rotate={-6} width={340} height={430} />
        <PostageStampCard id="s2" src={img('stamp2.jpg')} enterFrame={4} exitFrame={rel(16.61, 10.46) + 3} x={300} y={600} rotate={5} width={300} height={390} />
        <PostageStampCard id="s3" src={img('stamp4.jpg')} enterFrame={8} exitFrame={rel(16.61, 10.46) + 6} x={120} y={960} rotate={-3} width={340} height={420} />
      </Cut>
      {/* 7 brand-voice cards */}
      <Cut from={16.61} to={22.67}>
        <div style={{ position: 'absolute', left: 30, top: 520, display: 'flex', flexDirection: 'column', gap: 40, transform: 'scale(1.3)', transformOrigin: '0 0' }}>
          {[['مقهى دار', 'مرحبا… والقلب أوسع من الدار'], ['مقهى دار', 'كل زيارة… ضيافة وراحة'], ['مقهى دار', 'وعدٌ من أول يوم']].map(([u, c], i) => (
            <SlideOut key={i} at={rel(22.2, 16.61) + i * 3}><div style={{ transform: 'scale(1.0)', width: 600 }}><SocialCommentCard username={u} text={c} meta="" enterFrame={3 + i * 5} /></div></SlideOut>
          ))}
        </div>
      </Cut>
      {/* 8 night montage */}
      <Cut from={22.67} to={23.51}><Shot src="night1" /></Cut>
      <Cut from={23.51} to={24.6}><Shot src="night2" rate={0.95} /></Cut>
      <Cut from={24.6} to={25.94}><Shot src="night3" rate={0.64} /></Cut>
      {/* 9 projected logo → branded map */}
      <Cut from={25.94} to={27.4}><Shot src="project" rate={0.45} /></Cut>
      <Cut from={27.4} to={30.48}><BrandMap /></Cut>
      {/* 10 interior + pills → hand → 3D page curl */}
      <Cut from={30.48} to={32.06}><Shot src="bar" rate={0.68} /></Cut>
      <Cut from={32.06} to={32.45}><Shot src="hand" push={0} /></Cut>
      <Cut from={32.45} to={33.49}><AbsoluteFill style={{ background: COLORS.burgundy }} /><PageCurl3D cardImageSrc={img('dar_card.png')} startFrame={-4} duration={30} scale={0.58} position={[-0.2, -0.02, 0]} /></Cut>
      {/* 11 ink checklist */}
      <Cut from={33.49} to={37.26}><Checklist /></Cut>
      {/* 12 wide night + team */}
      <Cut from={37.26} to={39.2}><Shot src="wide" rate={0.67} /></Cut>
      <Cut from={39.2} to={41.5}><Shot src="wave" rate={0.78} /></Cut>
      {/* 13 watercolor outro (18-frame crossfade) */}
      <Sequence from={F(41.16) - 9} durationInFrames={F(44.6) - F(41.16) + 21}><AbsoluteFill style={{ opacity: outroIn }}><Outro /></AbsoluteFill></Sequence>
      {/* 14 logo */}
      <Sequence from={F(44.6)}><AbsoluteFill style={{ opacity: logoIn }}><Logo /></AbsoluteFill></Sequence>

      <Captions hideBetween={[[27.4, 30.48]]} />
      {frame < F(41.16) + 18 && <InvertedCornerFrame opacity={frameOpacity} />}
      <SoundDesignTrack />
    </AbsoluteFill>
  );
};
