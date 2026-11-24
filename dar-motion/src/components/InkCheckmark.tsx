import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../styles/tokens';

interface InkCheckmarkProps {
  startFrame: number;
  duration?: number;
  size?: number;
}

export const InkCheckmark: React.FC<InkCheckmarkProps> = ({
  startFrame,
  duration = 7,
  size = 86,
}) => {
  const frame = useCurrentFrame();
  const pathLength = 160;
  const dashOffset = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [pathLength, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x={14} y={24} width={62} height={62} stroke="#8D7F6B" strokeWidth={3} />
      <path
        d="M 24 54 L 44 74 C 54 52 68 32 88 12"
        stroke={COLORS.ink}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
