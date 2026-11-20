/**
 * Master timeline — exactly 30.000s (1800 frames @60fps).
 * Every visual cue is locked to where its voice-over phrase is placed.
 * Edit times here (seconds) to re-pace the whole film.
 */
export const DURATION = 24.8;

/** Scene boundaries (pans are centred on these) */
export const B = [0, 2.8, 7.35, 11.3, 15.0, 22.5, DURATION];

/** Voice-over phrases: [source in, source out] in vo.mp3 → placed at `at` */
export const VO = [
  {from: 0.0, to: 2.2, at: 0.3}, // تدري وش أسهل من التسجيل عالأوجي؟
  {from: 2.6, to: 5.95, at: 7.6}, // إنك تسجل براندك عندنا! بثلاث ضغطات بس
  {from: 6.3, to: 8.4, at: 12.0}, // بتحل مشاكل كثيييرة
  {from: 8.9, to: 9.66, at: 15.5}, // من واجهة التطبيق
  {from: 9.85, to: 11.3, at: 16.35}, // تروح لحسابي
  {from: 11.6, to: 12.7, at: 18.0}, // ثم انضم لنا
  {from: 12.92, to: 14.42, at: 19.3}, // وتعبي بيانات براندك
  {from: 14.6, to: 15.68, at: 20.9}, // وتضغط إرسال
];

/** OG reaction clip */
export const CLIP = {from: 0.8, to: 5.19, at: 2.85};

/** Second reaction (frustrated typing) under «بتحل مشاكل كثيييرة» */
export const CLIP2 = {from: 1.3, to: 5.3, at: 11.4};

/** Visual cues (absolute seconds) */
export const E = {
  hook: 0.3,
  hookClock: 0.5,
  clipCard: 2.6,
  line1: 7.67,
  line2: 9.46,
  keys: [9.46, 9.85, 10.26],
  clip2Card: 11.1,
  problems: 12.02,
  badges: [11.6, 11.75, 11.9, 12.05, 12.2],
  bigWord: 12.95,
  stretch: [13.22, 0.8] as [number, number],
  flip: 14.15,
  phoneIn: 14.8,
  captions: [
    [15.5, 16.0],
    [16.35, 17.6],
    [18.0, 19.0],
    [19.3, 20.55],
    [20.9, 22.8],
  ] as [number, number][],
  tapAccount: 17.75,
  toAccount: 17.9,
  tapJoin: 18.85,
  toJoin: 19.0,
  fields: [19.45, 19.75, 20.05, 20.35],
  tapSend: 21.55,
  sent: 21.7,
  logo: 22.4,
  logoSpin: [22.45, 1.3] as [number, number],
  tagline: 23.0,
  chime: 23.75,
};
