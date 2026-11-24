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
  /** kept for API compatibility – the connector now comes from the font itself */
  strokeThickness?: number;
  baselineOffsetPx?: number;
  color?: string;
}

const RUN = 'ـ'.repeat(80); // long run of the font's own tatweel glyph

/**
 * Smooth kashida that stays welded to the letters.
 * The connector is not a drawn rectangle (which never matches the font's stroke weight or
 * baseline and reads as a detached "-----"). It is a run of the font's own tatweel glyph,
 * revealed by a container whose width animates continuously – so thickness, baseline and
 * joins are exactly the typeface's, and the stretch is still sub-pixel smooth (no stepping).
 */
export const DynamicKashida: React.FC<DynamicKashidaProps> = ({
  rightPart,
  leftPart,
  startFrame,
  endFrame,
  fromStretchPx = 0,
  toStretchPx = 240,
  fontSize = 86,
  color = COLORS.white,
}) => {
  const frame = useCurrentFrame();
  const stretchPx = interpolate(frame, [startFrame, endFrame], [fromStretchPx, toStretchPx], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const overlap = Math.round(fontSize * 0.04);

  return (
    <span dir="rtl" style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: FONTS.kinetic, fontWeight: 900,
      fontSize, color, whiteSpace: 'nowrap' }}>
      <span>{rightPart}</span>
      <span style={{ display: 'inline-block', width: Math.max(0, stretchPx), overflow: 'hidden', direction: 'rtl',
        marginLeft: -overlap, marginRight: -overlap, verticalAlign: 'baseline' }}>
        <span style={{ whiteSpace: 'nowrap' }}>{RUN}</span>
      </span>
      <span>{leftPart}</span>
    </span>
  );
};
