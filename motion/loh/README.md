# LOH — "سجّل براندك بثلاث ضغطات" (Remotion)

9:16, 1080×1920, 60fps, **22.0s (1320 frames)**. Same motion language as `../saiqal` (camera-pan hand-offs,
motion blur, weighted quart-out entrances, live camera drift), re-skinned to the LOH identity:
yellow `#f3c32c`, brown `#493929`, Thmanyah Serif Black.

```bash
npm install
npm run studio
npx remotion render LOH out/loh-promo.mp4             # final (motion blur, 6 samples)
npx remotion render LOH out/preview.mp4 --scale=0.4 --props='{"blur":1}'   # fast preview
```

## Control panel (لوحة التحكم)
Run `npm install` then `npm run studio`, pick **LOH**, and use the **Props** panel on the right:
every text, the highlighted word, the two brand colors (color pickers), the form values,
voice/clip/SFX volumes and motion-blur quality are editable live, with instant preview.
Click **Render** in Studio (or `npx remotion render LOH out/loh.mp4`) to export.
Set *motionBlur* to 1 for fast previews, 6 for the final.

All timing lives in **`src/timing.ts`** (seconds): scene boundaries `B`, voice-over phrase
placement `VO`, the OG clip `CLIP`, and every visual cue `E`. Defaults: `src/config.ts`.

## Beats (locked to the voice-over in public/media/vo.mp3)
| Time | Visual | VO |
|---|---|---|
| 0.0 | Hook text + 3D clock motif | تدري وش أسهل من التسجيل عالأوجي؟ |
| 2.8 | OG reaction clip (own audio) | — |
| 7.35 | Text + three 3D step keys | إنك تسجل براندك عندنا! بثلاث ضغطات بس |
| 11.3 | Frustrated-typing reaction + 3D "!" coins → ✓, «كثيييرة» stretch | بتحل مشاكل كثيييرة |
| 15.0 | 3D phone, real app: home → حسابي → انضم لنا → typing → إرسال | من واجهة التطبيق … وتضغط إرسال |
| 22.5 | Extruded 3D LOH logo, clock hands land as a check + tagline | — |


