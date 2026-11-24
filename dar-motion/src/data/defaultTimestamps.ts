// whisper-word-timestamps fallback: speech windows measured from pauses in
// public/assets/audio/voiceover.mp3 (silencedetect -35 dB / 0.18 s), in seconds.
// Words inside a window are spread by character length (see Captions.tsx).
export type Cue = {
  from: number; // caption appears (s)
  to: number; // caption leaves (s)
  speech: [number, number]; // spoken window used to time each word (s)
  lines: string[]; // one or two words per line, stacked like the reference
  pills?: boolean; // burgundy pill stacking
  kashida?: { word: string; right: string; left: string; stretch: [number, number] }[];
};

export const CUES: Cue[] = [
  { from: 0.0, to: 1.64, speech: [0.02, 0.9], lines: ['ياهلا', 'وسهلا!'] },
  { from: 1.64, to: 2.93, speech: [1.64, 2.4], lines: ['كثير', 'يسألونا…'] },
  { from: 2.93, to: 4.33, speech: [2.93, 3.85], lines: ['ليه', 'سميناه', 'دار؟'],
    kashida: [{ word: 'سميناه', right: 'سميـ', left: 'ـناه', stretch: [110, 10] }] },
  { from: 4.33, to: 7.58, speech: [4.33, 7.2], lines: ['لأننا', 'من البداية', 'ما بغيناه', 'مقهى وبس…'] },
  { from: 7.58, to: 10.46, speech: [7.58, 9.9], lines: ['بغيناه', 'مكان', 'تحس فيه', 'بين أهلك'],
    kashida: [{ word: 'أهلك', right: 'أهـ', left: 'ـلك', stretch: [0, 150] }] },
  { from: 10.46, to: 12.25, speech: [10.46, 11.8], lines: ['ومن أول', 'يوم في', 'النعيرية'] },
  { from: 12.25, to: 14.53, speech: [12.25, 14.0], lines: ['كانت', 'كلمتنا:', 'مرحبا…'],
    kashida: [{ word: 'مرحبا…', right: 'مرحـ', left: 'ـبا…', stretch: [0, 200] }] },
  { from: 14.53, to: 16.61, speech: [14.53, 16.1], lines: ['والقلب', 'أوسع', 'من الدار'],
    kashida: [{ word: 'أوسع', right: 'أوسـ', left: 'ـع', stretch: [0, 170] }] },
  { from: 16.61, to: 19.45, speech: [16.61, 19.0], lines: ['وما كانت', 'عبارة وبس…', 'كانت وعد'] },
  { from: 19.45, to: 22.67, speech: [19.45, 22.1], lines: ['إن كل', 'زيارة', 'مليانة', 'ضيافة وراحة'],
    kashida: [{ word: 'وراحة', right: 'وراحـ', left: 'ـة', stretch: [0, 120] }] },
  { from: 22.67, to: 25.94, speech: [22.67, 25.5], lines: ['واليوم،', 'بفضل الله', 'ثم ثقتكم', 'وحبكم'] },
  { from: 25.94, to: 27.4, speech: [25.94, 27.2], lines: ['نكتب', 'فصل جديد'],
    kashida: [{ word: 'جديد', right: 'جـ', left: 'ـديد', stretch: [0, 120] }] },
  { from: 30.48, to: 32.06, speech: [30.48, 31.6], lines: ['وهذي', 'البداية', 'بس…'], pills: true },
  { from: 32.06, to: 33.49, speech: [32.06, 33.2], lines: ['وخلال', 'السنة', 'الجاية'],
    kashida: [{ word: 'الجاية', right: 'الجـ', left: 'ـاية', stretch: [0, 150] }] },
  { from: 37.26, to: 41.16, speech: [37.26, 40.6], lines: ['أهل النعيرية،', 'أهل الجبيل،', 'وكل من', 'مرّ علينا…'] },
];

// outro title (brown serif) word times
export const OUTRO_WORDS: { w: string; t: number; line: 0 | 1 }[] = [
  { w: 'يا هلا', t: 41.2, line: 0 }, { w: 'وسهلا…', t: 41.6, line: 0 },
  { w: 'والقلب', t: 42.54, line: 1 }, { w: 'أوسع', t: 43.37, line: 1 }, { w: 'من الدار', t: 43.75, line: 1 },
];

export const F = (s: number) => Math.round(s * 30);
