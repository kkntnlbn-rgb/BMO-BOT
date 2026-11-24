import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';

// transitions-maps-3d §3: branded vector map, roads draw on, Ken Burns 1.0→1.06, spring pin drops.
const MAIN = ['M40 1900 C190 1580 260 1320 310 1060 C350 860 330 600 390 330', 'M310 1060 C490 1040 650 1010 830 960',
  'M90 800 C310 800 540 760 760 640', 'M390 330 C450 500 600 590 760 640', 'M540 1660 C620 1430 730 1220 860 1040',
  'M150 1380 C360 1360 550 1320 740 1230', 'M640 1900 C660 1650 680 1460 740 1230', 'M210 550 C270 680 290 850 310 1060'];
const SEC = Array.from({ length: 18 }, (_, i) => {
  const x = 60 + ((i * 197) % 700), y = 420 + ((i * 331) % 1380), dx = 140 + ((i * 53) % 160), dy = -150 + ((i * 89) % 300);
  return `M${x} ${y} q${dx / 2} ${dy} ${dx} ${dy / 3}`;
});
const COAST = 'M0 0 H560 C600 150 690 250 760 410 C830 560 780 690 840 820 C900 950 980 970 1000 1070 C1030 1200 1080 1230 1080 1290 V1920 H0 Z';

const Pin: React.FC<{ x: number; y: number; at: number; en: string; ar: string; dy?: number }> = ({ x, y, at, en, ar, dy = -150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - at, config: { damping: 10, stiffness: 160 } });
  const o = interpolate(frame, [at, at + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lo = interpolate(frame, [at + 4, at + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <g>
      <g transform={`translate(${x} ${y - (1 - s) * 140})`} opacity={o}>
        <path d="M0 0 C-26 -36 -40 -54 -40 -80 A40 40 0 1 1 40 -80 C40 -54 26 -36 0 0Z" fill={COLORS.white} />
        <circle cy={-80} r={15} fill={COLORS.terracotta} />
      </g>
      <g opacity={lo} textAnchor="middle" fill={COLORS.white} fontFamily={FONTS.kinetic} fontWeight={900}>
        <text x={x} y={y + dy} fontSize={56}>{en}</text>
        <text x={x} y={y + dy + 62} fontSize={54}>{ar}</text>
      </g>
    </g>
  );
};

export const BrandMap: React.FC = () => {
  const frame = useCurrentFrame();
  const kb = interpolate(frame, [0, 92], [1.0, 1.06]);
  const pull = interpolate(frame, [0, 28], [1.45, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const draw = (i: number) => interpolate(frame, [2 + i * 1.2, 30 + i * 1.2], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <AbsoluteFill style={{ background: COLORS.olive }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ transform: `scale(${kb * pull})`, transformOrigin: '45% 45%' }}>
        <defs>
          <radialGradient id="vig" cx="40%" cy="50%" r="75%"><stop offset="0.6" stopColor={COLORS.burgundy} /><stop offset="1" stopColor="#2a240c" /></radialGradient>
        </defs>
        <path d={COAST} fill="url(#vig)" />
        <g fill="none" stroke={COLORS.cream} strokeLinecap="round">
          {MAIN.map((d, i) => <path key={i} d={d} strokeWidth={9} opacity={0.75} pathLength={1} strokeDasharray={1} strokeDashoffset={draw(i)} />)}
          {SEC.map((d, i) => <path key={i} d={d} strokeWidth={4} opacity={0.45} pathLength={1} strokeDasharray={1} strokeDashoffset={draw(i + 4)} />)}
        </g>
        <text x={930} y={430} textAnchor="middle" fontFamily={FONTS.kinetic} fontSize={40} fill={COLORS.sand} opacity={0.9}>الخليج العربي</text>
        <Pin x={340} y={700} at={36} en="Al Nairyah" ar="النعيرية" dy={-215} />
        <Pin x={790} y={1000} at={60} en="Al Fanateer" ar="الفناتير" dy={110} />
      </svg>
    </AbsoluteFill>
  );
};
