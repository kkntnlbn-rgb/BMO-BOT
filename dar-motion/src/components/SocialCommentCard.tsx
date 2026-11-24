import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONTS } from '../styles/tokens';

interface CommentProps {
  username: string;
  text: string;
  meta: string;
  likedByAuthor?: boolean;
  enterFrame: number;
}

export const SocialCommentCard: React.FC<CommentProps> = ({
  username,
  text,
  meta,
  likedByAuthor = false,
  enterFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    fps,
    frame: Math.max(0, frame - enterFrame),
    config: { damping: 12, stiffness: 210 },
  });

  if (frame < enterFrame) return null;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: '20px 24px',
        width: 560,
        boxShadow: '0 12px 26px rgba(0,0,0,0.3)',
        transform: `scale(${0.75 + pop * 0.25})`,
        opacity: Math.min(1, pop * 1.4),
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        direction: 'ltr',
        fontFamily: FONTS.kinetic,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#E5E0D8',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, color: '#6E6E6E', fontWeight: 600 }}>
          {username}{' '}
          {likedByAuthor && (
            <span style={{ color: '#E0245E', marginLeft: 8 }}>❤️ by author</span>
          )}
        </div>
        <div
          dir="rtl"
          style={{
            fontSize: 24,
            color: '#1A1A1A',
            fontWeight: 600,
            marginTop: 6,
            textAlign: 'left',
          }}
        >
          {text}
        </div>
        <div style={{ fontSize: 18, color: '#999', marginTop: 8 }}>
          {meta} &nbsp;&nbsp; Reply
        </div>
      </div>
    </div>
  );
};
