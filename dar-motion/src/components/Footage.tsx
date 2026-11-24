import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';

// Full-bleed live-action shot with a slow push-in ("camera is always alive").
export const Shot: React.FC<{ src: string; rate?: number; push?: number }> = ({ src, rate = 1, push = 0.05 }) => {
  const frame = useCurrentFrame();
  const s = 1 + interpolate(frame, [0, 90], [0, push], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>
      <OffthreadVideo src={staticFile(`assets/video/${src}.mp4`)} playbackRate={rate} muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// Hard cut window [from, to) in seconds.
export const Cut: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={Math.round(from * 30)} durationInFrames={Math.max(1, Math.round(to * 30) - Math.round(from * 30))} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);
