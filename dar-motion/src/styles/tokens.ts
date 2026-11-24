export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 1428, // 47.6 s = Dar voiceover (44.6 s) + 3 s logo hold
} as const;

export const COLORS = {
  // Dar Cafe official palette (Color Scheme.pdf); keys kept so the skill components stay unchanged
  cream: '#EAE3D2', // frame / paper (logo sits on light ground)
  burgundy: '#41160B', // Dar dark brown – collage canvas, map land
  navy: '#413815', // Dar dark olive – logo, curl back face, map sea
  brown: '#5F4839', // Dar brown – serif slogan, sub-labels
  terracotta: '#B75F3D', // Dar terracotta – pills, accents
  olive: '#8F7E2F',
  sand: '#C8B67C',
  white: '#FFFFFF',
  ink: '#1A1A1A',
} as const;

export const FONTS = {
  // user-supplied font overrides the skill default
  kinetic: '"Thmanyah Serif", serif',
  editorial: '"Thmanyah Serif", serif',
} as const;
