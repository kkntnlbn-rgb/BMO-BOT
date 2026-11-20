# LOH — "سجّل براندك بثلاث ضغطات" (Remotion)

9:16, 1080×1920, 60fps, **21.0s (1260 frames)**. Same motion language as `../saiqal` (camera-pan hand-offs,
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
| 0.0 | Hook text; the OG reaction drops in over it (light tint behind), his voice right after the question | تدري وش أسهل من التسجيل عالأوجي؟ |
| 4.7 | Text + three 3D step keys | إنك تسجل براندك عندنا! بثلاث ضغطات بس |
| 8.5 | Muted frustrated-typing reaction + 3D "!" coins → ✓, «كثيييرة» stretch | بتحل مشاكل كثيييرة |
| 11.5 | 3D phone, real app: home → حسابي → انضم لنا → typing → إرسال | من واجهة التطبيق … وتضغط إرسال |
| 18.8 | Extruded 3D LOH logo, clock hands land as a check + tagline | — |


