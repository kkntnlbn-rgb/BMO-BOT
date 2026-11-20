import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  Arabesque,
  Bowl,
  Branch,
  CardamomPlate,
  CopperTools,
  CutoutReveal,
  Khanjar,
  RoseBottle,
  SaffronPlate,
  SepiaFigure,
  Star8,
  Steam,
  TornFrame,
  TrayScene,
} from './elements';
import {Words} from './text';
import {C, F, H, W, easeIn, prog} from './theme';

/** Every scene: slow camera push, then a motivated exit (slide left + motion blur). */
const Shell: React.FC<{children: React.ReactNode; exit?: 'left' | 'fade' | 'none'; push?: number}> = ({children, exit = 'left', push = 0.04}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const e = prog(f, d - 10, 10, easeIn);
  const s = 1 + push * (f / d);
  const tx = exit === 'left' ? -e * 260 : 0;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${tx}px) scale(${s})`,
        opacity: exit === 'none' ? 1 : 1 - e,
        filter: exit === 'left' ? `blur(${e * 10}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Center: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', left: 0, width: W, top: y, display: 'flex', justifyContent: 'center'}}>{children}</div>
);

/* S1 0.0s — "قبل لا يصير للصيقل اسم" */
export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shell>
      <Center y={760}>
        <Words text={'قبل لا يصير \n للصيقل اسم'} start={4} stagger={7} size={112} highlight={['اسم']} hlStart={34} />
      </Center>
      <Star8 size={260} x={80} y={120} t={prog(f, 40, 20)} />
    </Shell>
  );
};

/* S2 2.0s — steaming bowl, "كان له طعم / ما يشبه غيره" */
export const S2Taste: React.FC = () => {
  const f = useCurrentFrame();
  const b = prog(f, 0, 22);
  return (
    <Shell>
      <div style={{position: 'absolute', left: W / 2 - 190, top: 700, opacity: 0.35}}>
        <Star8 size={380} x={190} y={190} t={prog(f, 2, 26)} rot={10 + f * 0.15} style={{filter: 'none'}} />
      </div>
      <Steam x={W / 2} y={790} t={prog(f, 8, 40)} h={420} />
      <div style={{position: 'absolute', left: W / 2 - 200, top: 760, transform: `translateY(${(1 - b) * 120}px) scale(${0.85 + 0.15 * b})`, opacity: b}}>
        <Bowl size={400} />
      </div>
      <Center y={1080}>
        <Words text="كان له طعم" start={12} size={130} />
      </Center>
      <Center y={1250}>
        <Words text="ما يشبه غيره" start={26} stagger={4} size={58} font={F.body} weight={500} color={C.creamDim} />
      </Center>
    </Shell>
  );
};

/* S3 4.0s — the founder's story: torn-paper portrait, branches, star */
export const S3Story: React.FC<{portrait?: string | null}> = ({portrait}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 26);
  return (
    <Shell push={0.06}>
      <Branch x={560} y={300} scale={1.7} rot={-30} t={prog(f, 4, 40)} seed={2} sway={1.5} />
      <div style={{position: 'absolute', left: 150, top: 560, opacity: prog(f, 6, 20)}}>
        <Arabesque w={150} h={520} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 470,
          transform: `translate(${(1 - p) * 500}px, ${(1 - p) * 60}px) rotate(${(1 - p) * 14 - 2}deg)`,
          opacity: p,
        }}
      >
        <TornFrame w={560} h={660} src={portrait}>
          <SepiaFigure />
        </TornFrame>
      </div>
      <Star8 size={190} x={262} y={492} t={prog(f, 14, 20)} />
      <Center y={1210}>
        <Words text="بدأت الحكاية" start={20} size={110} />
      </Center>
      <Center y={1360}>
        <Words text="من يد تعرف اسرار الحلوى" start={34} stagger={3} size={52} font={F.body} weight={500} color={C.creamDim} />
      </Center>
    </Shell>
  );
};

/* S4 7.0s — ingredients slide in from the right with kashida label lines */
export const S4Ingredients: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    {label: 'الزعفران', y: 420, el: <SaffronPlate size={250} />},
    {label: 'الهيل', y: 760, el: <CardamomPlate size={250} />},
    {label: 'ماء الورد', y: 1090, el: <RoseBottle h={420} />},
  ];
  return (
    <Shell>
      <Star8 size={300} x={150} y={110} t={prog(f, 0, 18)} />
      {items.map((it, i) => {
        const t = prog(f, 2 + i * 6, 20);
        const line = prog(f, 10 + i * 6, 18);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 640, top: it.y, transform: `translateX(${(1 - t) * 520}px) rotate(${(1 - t) * 25}deg)`}}>{it.el}</div>
            <div
              dir="rtl"
              style={{
                position: 'absolute',
                right: 1080 - 640 + 30,
                top: it.y + 50,
                fontFamily: F.body,
                fontWeight: 700,
                fontSize: 66,
                color: C.cream,
                opacity: line,
                clipPath: `inset(0 0 0 ${(1 - line) * 100}%)`,
              }}
            >
              {it.label}
            </div>
            <div style={{position: 'absolute', right: 1080 - 660, top: it.y + 138, height: 3, width: 380 * line, background: C.cream, opacity: 0.85}} />
          </React.Fragment>
        );
      })}
    </Shell>
  );
};

/* S5 8.6s — "كبرت الحكاية ... كبرت معها سمعة الصيقل" */
export const S5Grew: React.FC = () => {
  const f = useCurrentFrame();
  const a = prog(f, 0, 16);
  const swap = prog(f, 22, 12);
  return (
    <Shell>
      <Branch x={40} y={160} scale={1.8} rot={30} t={prog(f, 18, 30)} seed={5} sway={1.2} />
      <Branch x={480} y={1420} scale={1.7} rot={-60} t={prog(f, 24, 30)} seed={7} sway={1.2} />
      <Star8 size={240} x={1000} y={100} t={1 - prog(f, 6, 14)} />
      <Center y={860}>
        <div style={{transform: `translateX(${(1 - a) * -300 + swap * 400}px)`, opacity: a * (1 - swap), filter: `blur(${swap * 8}px)`}}>
          <Words text="كبرت الحكاية" start={0} size={100} />
        </div>
      </Center>
      <Center y={860}>
        <div style={{transform: `translateX(${(1 - swap) * -380}px)`, opacity: swap}}>
          <Words text="كبرت معها سمعة الصيقل" start={22} stagger={3} size={88} />
        </div>
      </Center>
    </Shell>
  );
};

/* S6 10.2s — food photo assembled from cut-out pieces */
export const S6Tray: React.FC = () => {
  const f = useCurrentFrame();
  const w = 760;
  const h = 520;
  return (
    <Shell push={0.05}>
      <Branch x={500} y={220} scale={1.6} rot={-20} t={1} seed={9} sway={1.5} />
      <div style={{position: 'absolute', left: (W - w) / 2, top: 640}}>
        <CutoutReveal
          w={w}
          h={h}
          f={f}
          start={0}
          pieces={[
            {x: 280, y: 0, w: 480, h: 360, dx: 600, dy: -80, delay: 0},
            {x: 0, y: 120, w: 330, h: 300, dx: -520, dy: 40, delay: 6},
            {x: 200, y: 300, w: 380, h: 220, dx: 0, dy: 500, delay: 12},
          ]}
        >
          <TrayScene w={w} h={h} />
        </CutoutReveal>
      </div>
    </Shell>
  );
};

/* S7 12.0s — "يرجع لها مرة بعد مرة" (horizontal type pass) */
export const S7Return: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 36], [-420, 300]);
  return (
    <Shell exit="fade">
      <Center y={1180}>
        <div style={{transform: `translateX(${x}px)`}}>
          <Words text="يرجع لها مرة بعد مرة" start={0} stagger={3} dur={12} size={92} />
        </div>
      </Center>
    </Shell>
  );
};

/* S8 13.0s — copper tools assemble from cut-outs */
export const S8Copper: React.FC = () => {
  const f = useCurrentFrame();
  const s = 760;
  return (
    <Shell push={0.05}>
      <div style={{position: 'absolute', left: (W - s) / 2, top: 560}}>
        <CutoutReveal
          w={s}
          h={s}
          f={f}
          start={0}
          dur={20}
          pieces={[
            {x: 0, y: 60, w: 760, h: 240, dx: 700, dy: 0, delay: 0},
            {x: 60, y: 280, w: 340, h: 380, dx: -600, dy: 120, delay: 5},
            {x: 380, y: 280, w: 380, h: 380, dx: 300, dy: 600, delay: 10},
          ]}
        >
          <div style={{padding: 80}}>
            <CopperTools w={600} h={600} />
          </div>
        </CutoutReveal>
      </div>
    </Shell>
  );
};

/* S9 14.8s — photo tiles stack into a collage + tag "بقي الطعم كما هو" */
export const S9Collage: React.FC = () => {
  const f = useCurrentFrame();
  const tiles = [
    {x: 190, y: 560, w: 360, h: 300, r: -3, dx: -700, dy: 0, d: 0},
    {x: 520, y: 600, w: 380, h: 280, r: 2, dx: 700, dy: -100, d: 5},
    {x: 220, y: 860, w: 340, h: 300, r: 2, dx: -600, dy: 300, d: 10},
    {x: 500, y: 900, w: 400, h: 300, r: -2, dx: 600, dy: 400, d: 15},
  ];
  const tag = prog(f, 36, 16);
  return (
    <Shell>
      {tiles.map((t, i) => {
        const p = prog(f, t.d, 20);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: t.w,
              height: t.h,
              borderRadius: 16,
              overflow: 'hidden',
              transform: `translate(${(1 - p) * t.dx}px, ${(1 - p) * t.dy}px) rotate(${t.r + (1 - p) * 10}deg)`,
              boxShadow: '0 20px 40px rgba(10,2,0,.55)',
              border: `6px solid ${C.paper}`,
            }}
          >
            {i % 2 === 0 ? (
              <TrayScene w={t.w} h={t.h} />
            ) : (
              <div style={{width: '100%', height: '100%', background: '#2a1409', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CopperTools w={t.h * 0.95} h={t.h * 0.95} />
              </div>
            )}
          </div>
        );
      })}
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          left: 330,
          top: 1180,
          padding: '10px 34px',
          background: C.paper,
          color: C.bg,
          fontFamily: F.head,
          fontWeight: 700,
          fontSize: 64,
          boxShadow: '0 12px 24px rgba(0,0,0,.45)',
          clipPath: `inset(0 0 0 ${(1 - tag) * 100}%)`,
        }}
      >
        بقي الطعم كما هو
      </div>
      <Star8 size={150} x={830} y={1225} t={prog(f, 42, 18)} />
      <Star8 size={260} x={1010} y={1500} t={prog(f, 30, 20)} />
    </Shell>
  );
};

/* S10 17.4s — brand lockup: crossed khanjars + calligraphic name */
export const S10Logo: React.FC = () => {
  const f = useCurrentFrame();
  const k = prog(f, 0, 30);
  const name = prog(f, 14, 26);
  return (
    <Shell exit="fade" push={0.03}>
      <Star8 size={280} x={1000} y={120} t={prog(f, 6, 20)} rot={20} />
      <Star8 size={280} x={90} y={1560} t={prog(f, 54, 20)} rot={-10} />
      <div style={{position: 'absolute', left: W / 2 - 290, top: 420, transform: `rotate(-24deg)`, transformOrigin: 'center'}}>
        <Khanjar h={760} t={k} />
      </div>
      <div style={{position: 'absolute', left: W / 2 - 10, top: 420, transform: `rotate(24deg)`}}>
        <Khanjar h={760} t={k} flip />
      </div>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          width: W,
          top: 560,
          textAlign: 'center',
          fontFamily: F.logo,
          fontWeight: 700,
          fontSize: 200,
          lineHeight: 1.05,
          color: C.paper,
          textShadow: '0 8px 24px rgba(20,4,0,.6)',
          WebkitMaskImage: `linear-gradient(270deg, #000 ${name * 100}%, transparent ${name * 100 + 12}%)`,
          maskImage: `linear-gradient(270deg, #000 ${name * 100}%, transparent ${name * 100 + 12}%)`,
          filter: `blur(${(1 - name) * 4}px)`,
        }}
      >
        حلوى
        <br />
        الصيقل
      </div>
      <Center y={1200}>
        <Words text="حلوى قطرية اصيلة" start={46} stagger={5} size={72} highlight={['قطرية']} hlStart={62} />
      </Center>
      <Center y={1320}>
        <Words text="بطعم ... لا يُنسى" start={70} stagger={6} size={56} font={F.body} weight={500} color={C.creamDim} />
      </Center>
    </Shell>
  );
};
