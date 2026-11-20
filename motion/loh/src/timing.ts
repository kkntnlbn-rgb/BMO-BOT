/**
 * Master timeline — exactly 30.000s (1800 frames @60fps).
 * Every visual cue is locked to where its voice-over phrase is placed.
 * Edit times here (seconds) to re-pace the whole film.
 */
export const DURATION = 22.0;

/** Scene boundaries (pans are centred on these) */
export const B = [0, 2.6, 6.1, 9.9, 12.9, 20.0, DURATION];

/** Voice-over phrases: [source in, source out] in vo.mp3 → placed at `at` */
export const VO = [
  {from: 0.0, to: 2.2, at: 0.2}, // تدري وش أسهل من التسجيل عالأوجي؟
  {from: 2.6, to: 5.95, at: 6.3}, // إنك تسجل براندك عندنا! بثلاث ضغطات بس
  {from: 6.3, to: 8.4, at: 10.3}, // بتحل مشاكل كثيييرة
  {from: 8.9, to: 9.66, at: 13.2}, // من واجهة التطبيق
  {from: 9.85, to: 11.3, at: 14.05}, // تروح لحسابي
  {from: 11.6, to: 12.7, at: 15.7}, // ثم انضم لنا
  {from: 12.92, to: 14.42, at: 16.95}, // وتعبي بيانات براندك
  {from: 14.6, to: 15.68, at: 18.5}, // وتضغط إرسال
];

/** OG reaction clip (starts 1s before he speaks) */
export const CLIP = {from: 1.8, to: 5.19, at: 2.6};

/** Second reaction (frustrated typing) under «بتحل مشاكل كثيييرة» — muted */
export const CLIP2 = {from: 1.3, to: 5.3, at: 9.9};

/** Visual cues (absolute seconds) */
export const E = {
  hook: 0.2,
  hookClock: 0.4,
  clipCard: 2.4,
  line1: 6.37,
  line2: 8.16,
  keys: [8.16, 8.55, 8.96],
  clip2Card: 9.7,
  problems: 10.32,
  badges: [10.0, 10.12, 10.24, 10.36, 10.48],
  bigWord: 11.25,
  stretch: [11.52, 0.8] as [number, number],
  flip: 12.4,
  phoneIn: 12.7,
  captions: [
    [13.2, 13.85],
    [14.05, 15.35],
    [15.7, 16.6],
    [16.95, 18.05],
    [18.5, 20.2],
  ] as [number, number][],
  tapAccount: 15.45,
  toAccount: 15.6,
  tapJoin: 16.55,
  toJoin: 16.7,
  fields: [17.05, 17.35, 17.65, 17.95],
  tapSend: 19.15,
  sent: 19.3,
  logo: 19.9,
  logoSpin: [19.95, 1.1] as [number, number],
  tagline: 20.4,
  chime: 21.0,
};
