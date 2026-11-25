# الاستدامة — رحلة زجاجة الماء (Remotion)

University awareness film, 9:16, 1080×1920, 60fps, **exactly 30.000s**. Same motion system as
`../loh` and `../saiqal`: one continuous camera pan per hand-off, shutter motion blur,
word-by-word RTL captions with highlight boxes, layered-extrusion 3D objects, live camera drift.
Palette: mint `#c9ecd6`, deep green `#0e4d3b`, water blue `#2b9fd8`. Font: Thmanyah Serif Black.

The recurring character is the **water bottle**: it turns in nature (1), falls with the waste (2),
spins into the 3D recycling symbol (3), then transforms — with flash + sparkle "shine" — into a vase,
a pen holder and a gift basket (4), before the camera widens onto a clean landscape and the
Vision 2030 close (5).

```bash
npm install
npm run studio     # "Sustain" → Props panel: all captions, product names, colors, volumes, blur
npx remotion render Sustain out/sustainability.mp4
```

| Time | Scene | Voice-over |
|---|---|---|
| 0–6 | 3D bottle turning over a soft wave backdrop | الماءُ سِرُّ الحياة… قد تكونُ بدايةَ حكاية |
| 6–11.25 | Bottles rain into a pile; the pile photo drops in, "!" coins | التخلُّصُ العشوائيُّ… يُهدِّدُ توازنَ بيئتِنا |
| 11.25–15 | 3D recycling symbol spins in and swallows the bottle; coins flip to ✓ | والحلّ؟ إعادةُ التدوير… إلى موارد |
| 15–22 | Bottle → vase → pen holder → basket, with flashes and sparkles | من زجاجةٍ مستهلَكة… لهدايا الأطفال |
| 22–30 | Camera widens from a card to the full landscape; Vision 2030 close | لا تجعلْ زجاجتَك نهايةَ قصّة… رؤيةَ السعوديّة ٢٠٣٠ |

Voice-over: ElevenLabs "Tareq Alharbi" (MSA narrator), `public/media/vo-raw.mp3`; pauses tightened
and tempo ×1.08 into `vo.wav` (29.1s). Phrase timings: `src/vo-marks.json`; all cues: `src/timing.ts`.
Images come from the project brief PDF.
