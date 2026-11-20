/**
 * Master timeline — exactly 30.000s (1800 frames @60fps).
 * Every visual cue is locked to where its voice-over phrase is placed.
 * Edit times here (seconds) to re-pace the whole film.
 */
export const DURATION = 30;

/** Scene boundaries (pans are centred on these) */
export const B = [0, 3.0, 7.8, 12.4, 15.6, 25.0, DURATION];

/** Voice-over phrases: [source in, source out] in vo.mp3 → placed at `at` */
export const VO = [
  {from: 0.0, to: 2.2, at: 0.4}, // تدري وش أسهل من التسجيل عالأوجي؟
  {from: 2.6, to: 5.95, at: 8.2}, // إنك تسجل براندك عندنا! بثلاث ضغطات بس
  {from: 6.3, to: 8.4, at: 12.8}, // بتحل مشاكل كثيييرة
  {from: 8.9, to: 9.66, at: 16.2}, // من واجهة التطبيق
  {from: 9.85, to: 11.3, at: 17.9}, // تروح لحسابي
  {from: 11.6, to: 12.7, at: 19.5}, // ثم انضم لنا
  {from: 12.92, to: 14.42, at: 21.1}, // وتعبي بيانات براندك
  {from: 14.6, to: 15.68, at: 22.9}, // وتضغط إرسال
];

/** OG reaction clip */
export const CLIP = {from: 0.8, to: 5.19, at: 3.1};

/** Visual cues (absolute seconds) */
export const E = {
  hook: 0.4,
  hookClock: 0.6,
  clipCard: 2.9,
  line1: 8.27,
  line2: 10.06,
  keys: [10.06, 10.45, 10.86],
  problems: 12.8,
  badges: [12.9, 13.05, 13.2, 13.35, 13.5],
  bigWord: 13.75,
  stretch: [14.02, 0.8] as [number, number],
  flip: 14.02,
  phoneIn: 15.4,
  captions: [
    [16.2, 17.6],
    [17.9, 19.3],
    [19.5, 20.85],
    [21.1, 22.65],
    [22.9, 25.3],
  ] as [number, number][],
  tapAccount: 18.9,
  toAccount: 19.05,
  tapJoin: 20.25,
  toJoin: 20.4,
  fields: [21.3, 21.65, 22.0, 22.35],
  tapSend: 23.55,
  sent: 23.7,
  logo: 25.1,
  logoSpin: [25.2, 1.7] as [number, number],
  tagline: 26.0,
  chime: 26.75,
};
