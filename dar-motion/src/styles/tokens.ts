export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1428, // 47.6 s = Dar voiceover (44.6 s) + 3 s logo hold
} as const;

export const COLORS = {
  cream: '#EAE3D2',
  burgundy: '#5E1A16',
  navy: '#0D1B3E',
  brown: '#6D4C2D',
  white: '#FFFFFF',
  ink: '#1A1A1A',
} as const;

export const FONTS = {
  // user-supplied font overrides the skill default
  kinetic: '"Thmanyah Serif", serif',
  editorial: '"Thmanyah Serif", serif',
} as const;
