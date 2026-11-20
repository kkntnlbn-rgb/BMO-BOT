# Saiqal heritage motion (Remotion)

A 9:16 (1080×1920, 30fps, 22s) heritage-style sweets promo, rebuilt in code from a reference analysis.

```bash
npm install
npm run studio          # live preview
npm run render          # → out/saiqal.mp4
```

## Scenes (frames @30fps)
| # | From | Beat |
|---|------|------|
| 1 | 0   | «قبل لا يصير للصيقل اسم», gold sweep on «اسم» |
| 2 | 60  | Steaming bowl + star, «كان له طعم / ما يشبه غيره» |
| 3 | 120 | Torn-paper portrait, branch, «بدأت الحكاية» |
| 4 | 210 | Ingredients: saffron, cardamom, rose water |
| 5 | 258 | «كبرت الحكاية» → «كبرت معها سمعة الصيقل» |
| 6 | 306 | Food scene assembled from cut-outs |
| 7 | 360 | «يرجع لها مرة بعد مرة» type pass |
| 8 | 390 | Copper tools cut-out assembly |
| 9 | 444 | Photo collage + tag «بقي الطعم كما هو» |
| 10 | 522 | Crossed khanjars + «حلوى الصيقل» lockup |

## Swapping in real photos
All visuals are drawn in SVG (no third-party photos). Put your own licensed
images in `public/` and pass them in, e.g. `defaultProps={{portrait: staticFile('portrait.jpg')}}`
in `src/Root.tsx`. Other photo slots (`TrayScene`, `CopperTools`) can be swapped for `<Img>` the same way.

Fonts: Amiri, Aref Ruqaa, Tajawal (OFL, via @fontsource). SFX are synthesized with ffmpeg.
