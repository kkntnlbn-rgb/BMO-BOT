/**
 * Master timeline — exactly 30.000s (1800 frames @60fps).
 * Every visual cue is locked to where its voice-over phrase is placed.
 * Edit times here (seconds) to re-pace the whole film.
 */
export const DURATION = 21.0;

/** Scene boundaries (pans are centred on these) — the OG clip now lives inside scene 1 */
export const B = [0, 4.7, 8.5, 11.5, 18.8, DURATION];

/** Voice-over phrases: [source in, source out] in vo.mp3 → placed at `at` */
export const VO = [
  {from: 0.0, to: 2.17, at: 0.2}, // تدري وش أسهل من التسجيل عالأوجي؟
  {from: 2.5, to: 5.9, at: 4.85}, // إنك تسجل براندك عندنا! بثلاث ضغطات بس
  {from: 6.25, to: 8.34, at: 8.86}, // بتحل مشاكل كثيييرة
  {from: 8.82, to: 9.97, at: 11.95}, // من واجهة التطبيق
  {from: 10.18, to: 11.5, at: 13.16}, // تروح لحسابي
  {from: 11.8, to: 12.78, at: 14.66}, // ثم انضم لنا
  {from: 13.1, to: 14.58, at: 15.82}, // وتعبي بيانات براندك
  {from: 14.75, to: 15.6, at: 17.4}, // وتضغط إرسال
];

/** OG reaction clip — drops over the first line; his voice lands right after the question */
export const CLIP = {from: 1.6, to: 5.19, at: 1.0};

/** Second reaction (frustrated typing) under «بتحل مشاكل كثيييرة» — muted */
export const CLIP2 = {from: 1.3, to: 5.3, at: 8.5};

/** Visual cues (absolute seconds) */
export const E = {
  hook: 0.2,
  hookClock: 0.4,
  clipCard: 0.85,
  line1: 4.9,
  line2: 6.62,
  keys: [6.62, 7.05, 7.47],
  clip2Card: 8.3,
  problems: 8.9,
  badges: [8.6, 8.72, 8.84, 8.96, 9.08],
  bigWord: 9.78,
  stretch: [10.1, 0.75] as [number, number],
  flip: 11.0,
  phoneIn: 11.3,
  captions: [
    [12.0, 12.9],
    [13.2, 14.3],
    [14.7, 15.45],
    [15.85, 17.05],
    [17.4, 19.0],
  ] as [number, number][],
  tapAccount: 14.4,
  toAccount: 14.55,
  tapJoin: 15.5,
  toJoin: 15.65,
  fields: [15.95, 16.25, 16.55, 16.85],
  tapSend: 17.95,
  sent: 18.1,
  logo: 18.7,
  logoSpin: [18.75, 1.1] as [number, number],
  tagline: 19.2,
  chime: 19.8,
};
