import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {createContext, useContext} from 'react';

export const W = 1080;
export const H = 1920;
export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

/** Local scene time in seconds. */
export const useS = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

/** Absolute timeline seconds: each scene provides its start offset, so every child times off the voice-over. */
export const Offset = createContext(0);
export const useT = () => useS() + useContext(Offset);

export const C = {
  yellow: '#f3c32c',
  yellowDeep: '#e2ac12',
  yellowLight: '#ffd95c',
  brown: '#493929',
  brownSoft: '#6b5640',
  cream: '#fff6dc',
  white: '#ffffff',
};

export const F = {
  head: 'Thmanyah Serif',
  ui: 'Tajawal',
};

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({family: F.head, url: staticFile('fonts/thmanyah-serif-black.otf'), weight: '900'});
  loadFont({family: F.ui, url: staticFile('fonts/tajawal-arabic-500-normal.woff2'), weight: '500'});
  loadFont({family: F.ui, url: staticFile('fonts/tajawal-arabic-700-normal.woff2'), weight: '700'});
};

/* Same motion language as the Saiqal piece: soft quart-out entrances, slow-in/slow-out pans */
export const easeOut = Easing.bezier(0.25, 1, 0.5, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const panEase = Easing.bezier(0.76, 0, 0.24, 1);
export const backOut = Easing.bezier(0.34, 1.45, 0.64, 1); // gentle overshoot for 3D pops

export const p = (t: number, start: number, dur: number, easing = easeOut) =>
  interpolate(t, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
