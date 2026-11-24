import React, { useMemo } from 'react';
import { Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../styles/tokens';

interface PostageStampProps {
  id: string;
  src: string;
  enterFrame: number;
  exitFrame: number;
  x: number;
  y: number;
  rotate: number;
  width?: number;
  height?: number;
}

export const PostageStampCard: React.FC<PostageStampProps> = ({
  id,
  src,
  enterFrame,
  exitFrame,
  x,
  y,
  rotate,
  width = 340,
  height = 420,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    fps,
    frame: Math.max(0, frame - enterFrame),
    config: { damping: 13, stiffness: 185 },
  });

  const exitY = interpolate(frame, [exitFrame, exitFrame + 10], [0, -1450], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const holes = useMemo(() => {
    const r = 7;
    const step = 22;
    const list: { cx: number; cy: number }[] = [];
    for (let px = step / 2; px < width; px += step) {
      list.push({ cx: px, cy: 0 }, { cx: px, cy: height });
    }
    for (let py = step / 2; py < height; py += step) {
      list.push({ cx: 0, cy: py }, { cx: width, cy: py });
    }
    return { r, list };
  }, [width, height]);

  if (frame < enterFrame) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transform: `translateY(${exitY}px) rotate(${rotate}deg) scale(${enterSpring})`,
        filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.42))',
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <mask id={`stamp-mask-${id}`}>
            <rect width={width} height={height} fill="white" />
            {holes.list.map((h, i) => (
              <circle key={i} cx={h.cx} cy={h.cy} r={holes.r} fill="black" />
            ))}
          </mask>
        </defs>
        <g mask={`url(#stamp-mask-${id})`}>
          <rect width={width} height={height} fill={COLORS.white} />
          <foreignObject x={16} y={16} width={width - 32} height={height - 32}>
            <Img
              src={src}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </foreignObject>
        </g>
      </svg>
    </div>
  );
};
