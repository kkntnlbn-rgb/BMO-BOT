import {Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

export const W = 1080;
export const H = 1920;
export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);
export const useS = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

/** Dar Cafe palette (Color Scheme.pdf) + details used in the approved film */
export const C = {
  olive: '#413815', // dark olive — primary
  oliveMid: '#8F7E2F',
  sand: '#C8B67C',
  frame: '#ECE4CC', // ticket frame cream
  terracotta: '#B75F3D',
  brown: '#41160B',
  ink: '#2B250D',
  white: '#FFFFFF',
};

export const F = {head: 'Thmanyah Serif', latin: 'Thmanyah Serif'};
let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({family: F.head, url: staticFile('fonts/thmanyah-serif-black.otf'), weight: '900'});
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // expo-out (skill: no linear)
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const panEase = Easing.bezier(0.76, 0, 0.24, 1);
export const backOut = Easing.bezier(0.34, 1.45, 0.64, 1);
export const p = (t: number, start: number, dur: number, easing = easeOut) =>
  interpolate(t, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
