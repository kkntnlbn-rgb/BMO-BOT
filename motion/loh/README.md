# LOH — "سجّل براندك بثلاث ضغطات" (Remotion)

9:16, 1080×1920, 60fps, ~24s. Same motion language as `../saiqal` (camera-pan hand-offs,
motion blur, weighted quart-out entrances, live camera drift), re-skinned to the LOH identity:
yellow `#f3c32c`, brown `#493929`, Thmanyah Serif Black.

```bash
npm install
npm run studio
npx remotion render LOH out/loh-promo.mp4             # final (motion blur, 6 samples)
npx remotion render LOH out/preview.mp4 --scale=0.4 --props='{"blur":1}'   # fast preview
```

## Beats (locked to the voice-over in public/media/vo.mp3)
| Time | Visual | VO |
|---|---|---|
| 0.0 | Hook text + 3D clock motif | تدري وش أسهل من التسجيل عالأوجي؟ |
| 2.45 | OG reaction clip (own audio) | — |
| 7.0 | Text + three 3D step keys (home / account / join) | إنك تسجل براندك عندنا! بثلاث ضغطات بس |
| 10.75 | 3D "!" coins flip to ✓, stretched «كثيـــرة» | بتحل مشاكل كثيييرة |
| 12.9 | 3D phone with the real app: home → حسابي → انضم لنا → form typing → إرسال | من واجهة التطبيق … وتضغط إرسال |
| 20.2 | Extruded 3D LOH logo, clock hands spin and land as a check | — |

Timings live in `src/Loh.tsx` (`B`, `DIRS`, audio) and `src/scenes.tsx` (absolute seconds).
