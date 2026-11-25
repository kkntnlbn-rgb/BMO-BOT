# الاستدامة — رحلة زجاجة الماء (Remotion)

University awareness film, 9:16, 1080×1920, 60fps, **exactly 30.000s**. Same motion system as
`../loh` and `../saiqal`: one continuous camera pan per hand-off, shutter motion blur,
word-by-word RTL captions with highlight boxes, layered-extrusion 3D objects, live camera drift.
Palette: mint `#c9ecd6`, deep green `#0e4d3b`, water blue `#2b9fd8`. Font: Thmanyah Serif Black.

The recurring character is the **water bottle** — a real 3D model (Three.js lathe geometry, clear-PET
material, water, ribbed cap; `src/three/BottleSpin.tsx`) pre-rendered as a 240-frame transparent
turntable in `public/bottle/`. It turns in nature (1), falls with the waste (2), spins into the 3D
recycling symbol (3), then bursts into the brief's step-by-step guides, which resolve — with flashes
and sparkle "shine" — into the vase, cosmetics organizer, pen holder and gift basket (4), before the
camera widens onto a clean landscape and the Vision 2030 close (5).

Re-render the bottle after editing it:
`npx remotion render BottleSpin public/bottle --sequence --image-format=png --gl=angle` (then convert to webp).

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

Voice-over: ElevenLabs "Abdulrahman" (`public/media/vo-abdulrahman.mp3`); pauses tightened and
tempo ×1.17 into `vo.wav` (28.3s). Phrase timings: `src/vo-marks.json`; all cues: `src/timing.ts`.
Images come from the project brief PDF.
