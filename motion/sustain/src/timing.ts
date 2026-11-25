import marks from './vo-marks.json';

/**
 * Master timeline — exactly 30.000s (1800 frames @60fps).
 * The voice-over (public/media/vo.wav, tightened from the ElevenLabs take) starts at VO_AT;
 * every caption and visual cue is locked to its phrase via vo-marks.json.
 */
export const DURATION = 30;
export const VO_AT = 0.3;
type K = keyof typeof marks;
/** [start, end] of a voice-over phrase on the master timeline */
export const M = (k: K): [number, number] => [marks[k][0] + VO_AT, marks[k][1] + VO_AT];

/** Scene boundaries (camera pans are centred on these) */
export const B = [0, 5.85, 10.85, 14.6, 21.25, DURATION];
export const PAN = 0.55;

export const E = {
  bottleIn: 0.15,
  fall0: 5.9,
  pileCard: M('s2b')[0] - 0.15,
  badges: [M('s2b')[0] + 0.2, M('s2b')[0] + 0.35, M('s2c')[0], M('s2c')[0] + 0.15],
  recycleIn: M('s3b')[0] - 0.35,
  bottleIntoRecycle: M('s3b')[0] - 0.1,
  solved: M('s3c')[0] + 0.2,
  bottleBurst: M('s4b')[0] - 0.05,
  guides: [0, 1, 2, 3].map((i) => M('s4b')[0] + 0.05 + i * 0.22),
  guidesOut: M('s4c')[0] - 0.25,
  products: [M('s4c')[0] - 0.1, M('s4c')[0] + 0.4, M('s4d')[0] - 0.1, M('s4e')[0] - 0.1],
  widen: B[4] - 0.2,
  finale: M('s5e')[0],
};
