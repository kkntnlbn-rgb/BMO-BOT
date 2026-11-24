import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../styles/tokens';

interface DynamicKashidaProps {
  /** Right half of word ending with tatweel join, e.g. "ليـ" or "كـ" */
  rightPart: string;
  /** Left half of word starting with tatweel join, e.g. "ـن" or "ـبرته" */
  leftPart: string;
  startFrame: number;
  endFrame: number;
  fromStretchPx?: number;
  toStretchPx?: number;
  fontSize?: number;
  strokeThickness?: number;
  baselineOffsetPx?: number;
  color?: string;
}

export const DynamicKashida: React.FC<DynamicKashidaProps> = ({
  rightPart,
  leftPart,
  startFrame,
  endFrame,
  fromStretchPx = 0,
  toStretchPx = 240,
  fontSize = 86,
  strokeThickness = 11,
  baselineOffsetPx = 20,
  color = COLORS.white,
}) => {
  const frame = useCurrentFrame();

  const stretchPx = interpolate(
    frame,
    [startFrame, endFrame],
    [fromStretchPx, toStretchPx],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  return (
    <div
      dir="rtl"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontFamily: FONTS.kinetic,
        fontWeight: 700,
        fontSize,
        color,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      {/* Right anchored glyphs */}
      <span style={{ display: 'inline-block' }}>{rightPart}</span>

      {/* Seamless geometric horizontal kashida bar (1.5px overlap on both joints to prevent sub-pixel seam) */}
      <span
        style={{
          display: 'inline-block',
          width: Math.max(0, stretchPx),
          height: strokeThickness,
          backgroundColor: color,
          marginRight: -3,
          marginLeft: -3,
          transform: `translateY(-${baselineOffsetPx}px)`,
        }}
      />

      {/* Left glyphs gliding smoothly leftward */}
      <span style={{ display: 'inline-block' }}>{leftPart}</span>
    </div>
  );
};
