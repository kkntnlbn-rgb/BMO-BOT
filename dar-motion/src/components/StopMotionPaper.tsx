import React from 'react';
import { Img, interpolate, useCurrentFrame } from 'remotion';

interface StopMotionPaperProps {
  src?: string;
  children?: React.ReactNode;
  enterFrame: number;
  targetX: number;
  targetY: number;
  targetRotate: number;
  width?: number;
  fpsStep?: number; // 3 frames = 10fps stop-motion feel on 30fps timeline
}

export const StopMotionPaper: React.FC<StopMotionPaperProps> = ({
  src,
  children,
  enterFrame,
  targetX,
  targetY,
  targetRotate,
  width = 560,
  fpsStep = 3,
}) => {
  const rawFrame = useCurrentFrame();
  // Quantize to simulate authentic stop-motion photography
  const steppedFrame = Math.floor(rawFrame / fpsStep) * fpsStep;
  const local = Math.max(0, steppedFrame - enterFrame);

  const progress = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = rawFrame >= enterFrame ? 1 : 0;
  const scale = interpolate(progress, [0, 1], [0.55, 1]);
  const x = interpolate(progress, [0, 1], [0, targetX]);
  const y = interpolate(progress, [0, 1], [120, targetY]);
  const rot = interpolate(progress, [0, 1], [targetRotate * 2.2, targetRotate]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width,
        opacity,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        filter: 'drop-shadow(0 18px 26px rgba(0, 0, 0, 0.38))',
      }}
    >
      {children ?? <Img src={src!} style={{ width: '100%', display: 'block', borderRadius: 4 }} />}
    </div>
  );
};
