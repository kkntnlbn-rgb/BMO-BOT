import React from 'react';
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';

// Full-bleed live-action shot with a slow push-in ("camera is always alive").
export const Shot: React.FC<{ src: string; rate?: number; push?: number }> = ({ src, rate = 1, push = 0.05 }) => {
  const frame = useCurrentFrame();
  // arrives slightly enlarged and settles (expo-out), then keeps a slow push – never static
  const settle = interpolate(frame, [0, 22], [0.1, 0], { extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const s = 1 + settle + interpolate(frame, [0, 150], [0, Math.max(push, 0.04)], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})` }}>
      <OffthreadVideo src={staticFile(`assets/video/${src}.mp4`)} playbackRate={rate} muted
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

/* Whip-push (reference): the outgoing scene shoots left with horizontal motion blur while the
   incoming one arrives from the right, tilted, and eases to rest. */
export const PUSH_IN = 10; // frames
export const PUSH_OUT = 9; // frames the outgoing scene keeps moving after the cut
const EASE_IN = Easing.bezier(0.55, 0, 0.9, 0.35);
const EASE_OUT = Easing.bezier(0.12, 0.9, 0.25, 1);

const HBlur: React.FC<{ id: string; amount: number; children: React.ReactNode }> = ({ id, amount, children }) => (
  <AbsoluteFill style={{ filter: amount > 0.5 ? `url(#${id})` : undefined }}>
    {amount > 0.5 && (
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <filter id={id} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${amount.toFixed(1)} 0`} /></filter>
      </svg>
    )}
    {children}
  </AbsoluteFill>
);

const PushWrap: React.FC<{ id: string; dur: number; pushIn: boolean; pushOut: boolean; children: React.ReactNode }> = ({ id, dur, pushIn, pushOut, children }) => {
  const f = useCurrentFrame();
  const eIn = pushIn ? interpolate(f, [0, PUSH_IN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT }) : 1;
  const vIn = pushIn ? 1 - interpolate(f, [0, PUSH_IN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }) : 0;
  const eOut = pushOut ? interpolate(f, [dur, dur + PUSH_OUT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_IN }) : 0;
  const x = (1 - eIn) * 1080 - eOut * 1180;
  const r = (1 - eIn) * 6 - eOut * 4;
  const blur = vIn * 70 + eOut * 80;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`, transformOrigin: '50% 60%' }}>
      <HBlur id={id} amount={blur}>{children}</HBlur>
    </AbsoluteFill>
  );
};

// Scene window [from, to) in seconds. push: arrive with a whip from the right / leave with a whip to the left.
export const Cut: React.FC<{ from: number; to: number; pushIn?: boolean; pushOut?: boolean; children: React.ReactNode }> = ({ from, to, pushIn = false, pushOut = false, children }) => {
  const a = Math.round(from * 30), b = Math.round(to * 30);
  const dur = Math.max(1, b - a);
  return (
    <Sequence from={a} durationInFrames={dur + (pushOut ? PUSH_OUT : 0)} layout="none">
      {pushIn || pushOut
        ? <PushWrap id={`hb-${a}`} dur={dur} pushIn={pushIn} pushOut={pushOut}>{children}</PushWrap>
        : <AbsoluteFill>{children}</AbsoluteFill>}
    </Sequence>
  );
};
