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
  {from: 2.45, to: 5.8, at: 8.2}, // إنك تسجل براندك عندنا! بثلاث ضغطات بس
  {from: 6.15, to: 8.15, at: 12.8}, // بتحل مشاكل كثيييرة
  {from: 8.3, to: 9.52, at: 16.2}, // من واجهة التطبيق
  {from: 9.88, to: 12.5, at: 17.9}, // تروح لحسابي ثم انضم لنا
  {from: 12.75, to: 14.25, at: 21.1}, // وتعبي بيانات براندك
  {from: 14.35, to: 15.3, at: 22.9}, // وتضغط إرسال
];

/** OG reaction clip */
export const CLIP = {from: 0.8, to: 5.19, at: 3.1};

/** Visual cues (absolute seconds) */
export const E = {
  hook: 0.4,
  hookClock: 0.6,
  clipCard: 2.9,
  line1: 8.2,
  line2: 9.9,
  keys: [10.0, 10.4, 10.8],
  problems: 12.8,
  badges: [12.9, 13.05, 13.2, 13.35, 13.5],
  bigWord: 13.4,
  stretch: [14.0, 0.75] as [number, number],
  flip: 14.0,
  phoneIn: 15.4,
  captions: [
    [16.2, 17.6],
    [17.9, 19.1],
    [19.2, 20.7],
    [21.1, 22.65],
    [22.9, 25.3],
  ] as [number, number][],
  tapAccount: 18.6,
  toAccount: 18.75,
  tapJoin: 20.1,
  toJoin: 20.25,
  fields: [21.2, 21.55, 21.9, 22.25],
  tapSend: 23.6,
  sent: 23.75,
  logo: 25.1,
  logoSpin: [25.2, 1.7] as [number, number],
  tagline: 26.0,
  chime: 26.75,
};
