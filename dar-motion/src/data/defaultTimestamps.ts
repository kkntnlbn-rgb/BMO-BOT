// whisper-word-timestamps fallback: speech windows measured from pauses in
// public/assets/audio/voiceover.mp3 (silencedetect -35 dB / 0.18 s), in seconds.
// Words inside a window are spread by character length (see Captions.tsx).
export type Cue = {
  from: number; // caption appears (s)
  to: number; // caption leaves (s)
  speech: [number, number]; // spoken window used to time each word (s)
  lines: string[]; // one or two words per line, stacked like the reference
  pills?: boolean; // terracotta pill stacking (box grows from a line)
  mode?: 'side' | 'center' | 'top';
  ink?: string; // text colour when sitting on light paper
  lineStyle?: ('pill' | 'small' | undefined)[]; // per-line: dark knockout pill / smaller line
  lineSpeech?: [number, number][]; // per-line spoken windows (overrides speech)
  y?: number; // vertical centre override
  size?: number; // base font size override
  scene?: string; // rendered inside a scene (moves with its push transition) instead of the global layer
  pillBg?: string; pillInk?: string;
  kashida?: { word: string; right: string; left: string; stretch: [number, number] }[];
};

const OLIVE = '#413815';
export const CUES: Cue[] = [
  { from: 0.0, to: 1.64, speech: [0.05, 0.9], lines: ['ياهلا', 'وسهلا!'], mode: 'center', ink: OLIVE },
  { from: 1.64, to: 2.93, speech: [1.75, 2.45], lines: ['كثير يسألونا…'], mode: 'side' },
  { from: 2.93, to: 4.33, speech: [2.98, 3.85], lines: ['ليه سميناه', 'دار؟'], mode: 'center',
    kashida: [{ word: 'سميناه', right: 'سميـ', left: 'ـناه', stretch: [0, 110] }] },
  { from: 4.33, to: 7.58, speech: [4.4, 7.2], lines: ['لأننا من البداية', 'ما بغيناه', 'مقهى وبس…'], mode: 'side' },
  { from: 7.58, to: 10.46, speech: [7.6, 9.9], lines: ['بغيناه مكان', 'تحس فيه', 'إنك بين أهلك'], mode: 'side', ink: OLIVE,
    kashida: [{ word: 'أهلك', right: 'أهـ', left: 'ـلك', stretch: [0, 130] }] },
  { from: 10.46, to: 12.25, speech: [10.5, 11.8], lines: ['ومن أول يوم', 'في النعيرية'], mode: 'center', ink: OLIVE },
  { from: 12.25, to: 14.53, speech: [12.3, 14.0], lines: ['كانت كلمتنا:', 'مرحبا…'], mode: 'center',
    kashida: [{ word: 'مرحبا…', right: 'مرحـ', left: 'ـبا…', stretch: [0, 170] }] },
  { from: 14.53, to: 16.61, speech: [14.6, 16.1], lines: ['والقلب أوسع', 'من الدار'], mode: 'side',
    kashida: [{ word: 'أوسع', right: 'أوسـ', left: 'ـع', stretch: [0, 120] }] },
  { from: 16.61, to: 19.45, speech: [16.66, 19.0], lines: ['وما كانت', 'عبارة وبس…', 'كانت وعد'], mode: 'center' },
  { from: 19.45, to: 22.67, speech: [19.5, 22.1], lines: ['إن كل زيارة', 'تكون مليانة', 'ضيافة وراحة'], mode: 'side',
    kashida: [{ word: 'وراحة', right: 'وراحـ', left: 'ـة', stretch: [0, 100] }] },
  { from: 22.67, to: 25.94, speech: [22.72, 25.5], lines: ['واليوم،', 'بفضل الله', 'ثم ثقتكم', 'وحبكم'], mode: 'side' },
  { from: 25.94, to: 27.4, speech: [25.98, 27.2], lines: ['نكتب', 'فصل جديد'], mode: 'side',
    kashida: [{ word: 'جديد', right: 'جـ', left: 'ـديد', stretch: [0, 110] }] },
  { from: 30.48, to: 32.06, speech: [30.55, 31.6], lines: ['وهذي', 'البداية', 'بس…'], pills: true },
  { from: 32.06, to: 36.2, speech: [32.1, 35.2], scene: 'promise', mode: 'center', ink: '#2B250D', y: 760, size: 108,
    lines: ['وخلال السنة الجاية', 'نوعدكم', 'بفروع جديدة وتطور أكبر'], lineStyle: [undefined, 'pill', 'small'],
    lineSpeech: [[32.1, 33.2], [33.5, 33.95], [34.0, 35.25]], pillBg: '#2B250D', pillInk: '#D8C78E',
    kashida: [{ word: 'الجاية', right: 'الجـ', left: 'ـاية', stretch: [0, 120] }] },
  { from: 36.2, to: 37.26, speech: [36.2, 36.8], scene: 'promise', mode: 'center', y: 1500, size: 120,
    lines: ['بإذن الله'], lineStyle: ['small'] },
  { from: 37.26, to: 41.16, speech: [37.3, 40.6], lines: ['أهل النعيرية،', 'أهل الجبيل،', 'وكل من مرّ علينا…'], mode: 'side' },
];

// outro title (brown serif) word times
export const OUTRO_WORDS: { w: string; t: number; line: 0 | 1 }[] = [
  { w: 'يا هلا', t: 41.2, line: 0 }, { w: 'وسهلا…', t: 41.6, line: 0 },
  { w: 'والقلب', t: 42.54, line: 1 }, { w: 'أوسع', t: 43.37, line: 1 }, { w: 'من الدار', t: 43.75, line: 1 },
];

export const F = (s: number) => Math.round(s * 30);
