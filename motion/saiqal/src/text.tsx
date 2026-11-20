import React from 'react';
import {C, F, prog, useT} from './theme';

/**
 * RTL word-by-word reveal. Each whole word is wiped in from its right edge
 * (Arabic reading direction) with a soft rise + de-blur. Letters are never
 * split, so Arabic joining stays intact.
 */
export const Words: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  dur?: number;
  size: number;
  font?: string;
  weight?: number;
  color?: string;
  highlight?: string[]; // words drawn with a gold sweep
  hlStart?: number;
  style?: React.CSSProperties;
}> = ({text, start, stagger = 6, dur = 20, size, font = F.head, weight = 700, color = C.cream, highlight = [], hlStart, style}) => {
  const f = useT();
  const words = text.split(' ');
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.25,
        textShadow: '0 4px 14px rgba(20,4,0,.45)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: size * 0.28,
        ...style,
      }}
    >
      {words.map((w, i) => {
        if (w === '\n') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const t = prog(f, start + i * stagger, dur);
        const isHl = highlight.includes(w);
        const ht = hlStart !== undefined ? prog(f, hlStart, 18) : 0;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              clipPath: `inset(-20% 0 -20% ${(1 - t) * 100}%)`,
              transform: `translateY(${(1 - t) * 24}px)`,
              filter: `blur(${(1 - t) * 8}px)`,
              opacity: 0.2 + 0.8 * t,
            }}
          >
            {isHl && (
              <span
                style={{
                  position: 'absolute',
                  right: -6,
                  top: '30%',
                  height: '55%',
                  width: `calc(${ht * 100}% + 12px)`,
                  background: `linear-gradient(270deg, ${C.gold}, ${C.goldLight})`,
                  opacity: 0.55,
                  filter: 'blur(4px)',
                  borderRadius: 6,
                }}
              />
            )}
            <span style={{position: 'relative', color: isHl && ht > 0 ? C.goldLight : undefined}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};
