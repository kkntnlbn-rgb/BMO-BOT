import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

export const W = 1080;
export const H = 1920;
export const FPS = 60;

/** Scene time in 30fps units (authoring grid), sub-frame precise at 60fps. */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / (fps / 30);
};
export const useDur = () => {
  const {durationInFrames, fps} = useVideoConfig();
  return durationInFrames / (fps / 30);
};

/** Entrances are stretched for a weighted, unhurried feel. */
export const SLOW = 1.35;

export const C = {
  bg: '#5b1e08',
  bgEdge: '#3a1104',
  cream: '#f1dfc4',
  creamDim: '#d9c1a0',
  paper: '#ead8b6',
  gold: '#c3913a',
  goldLight: '#e6bf6c',
  goldDark: '#8a5f1e',
  copper: '#b86a3c',
  copperDark: '#6e3418',
  wood: '#2a1309',
  green: '#244b30',
};

export const F = {
  head: 'Amiri',
  body: 'Tajawal',
  logo: 'Aref Ruqaa',
};

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({family: F.head, url: staticFile('fonts/amiri-arabic-700-normal.woff2'), weight: '700'});
  loadFont({family: F.logo, url: staticFile('fonts/aref-ruqaa-arabic-700-normal.woff2'), weight: '700'});
  loadFont({family: F.body, url: staticFile('fonts/tajawal-arabic-500-normal.woff2'), weight: '500'});
  loadFont({family: F.body, url: staticFile('fonts/tajawal-arabic-700-normal.woff2'), weight: '700'});
};

// Expo-out for entrances, expo-in for exits (smooth-motion-pro / silky-spring-motion recipe)
export const easeOut = Easing.bezier(0.25, 1, 0.5, 1); // quart-out: long, soft settle
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
/** Camera pan between scenes (graph-editor style: slow out, slow in). */
export const panEase = Easing.bezier(0.76, 0, 0.24, 1);

export const prog = (f: number, start: number, dur: number, easing = easeOut) =>
  interpolate(f, [start, start + dur * SLOW], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
