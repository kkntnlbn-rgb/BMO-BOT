import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, VIDEO_CONFIG } from '../styles/tokens';

interface Props {
  border?: number;
  cornerRadius?: number;
  opacity?: number;
}

export const InvertedCornerFrame: React.FC<Props> = ({
  border = 26,
  cornerRadius = 42,
  opacity = 1,
}) => {
  const W = VIDEO_CONFIG.width;
  const H = VIDEO_CONFIG.height;
  const b = border;
  const r = cornerRadius;

  // Outer rectangle + inner path with 4 concave inward-curving quarter-circle corners (evenodd fill)
  const innerPath = [
    `M ${b + r} ${b}`,
    `L ${W - b - r} ${b}`,
    `A ${r} ${r} 0 0 0 ${W - b} ${b + r}`,
    `L ${W - b} ${H - b - r}`,
    `A ${r} ${r} 0 0 0 ${W - b - r} ${H - b}`,
    `L ${b + r} ${H - b}`,
    `A ${r} ${r} 0 0 0 ${b} ${H - b - r}`,
    `L ${b} ${b + r}`,
    `A ${r} ${r} 0 0 0 ${b + r} ${b}`,
    'Z',
  ].join(' ');

  const outerPath = `M 0 0 H ${W} V ${H} H 0 Z`;

  return (
    <AbsoluteFill style={{ zIndex: 9999, pointerEvents: 'none', opacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path
          d={`${outerPath} ${innerPath}`}
          fill={COLORS.cream}
          fillRule="evenodd"
        />
      </svg>
    </AbsoluteFill>
  );
};
