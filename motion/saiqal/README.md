# Saiqal heritage motion (Remotion)

A 9:16 (1080×1920, 60fps, ~26.5s) heritage-style sweets promo, rebuilt in code from a reference analysis.

```bash
npm install
npm run studio          # live preview
npm run render          # → out/saiqal.mp4
```

## Transition grammar (matched to the reference)
- Every hand-off is **one continuous camera pan**: the outgoing scene travels out while the
  incoming one travels in on the same vector (left / up / right), 22 authoring frames (~0.73s),
  `cubic-bezier(.76,0,.24,1)` — slow out, slow in.
- Directions: 1→2 left · 2→3 up · 3→4 left · 4→5 right · 5→6 up · 6→8 left · 8→9 left · 9→10 right.
- Real shutter motion blur (`@remotion/motion-blur`, 6 samples, 200°) on all movement.
- Entrances use a soft quart-out and are stretched ×1.35 (`SLOW` in `theme.ts`) for a weighted feel.
- Camera never still: slow push-in + lateral drift inside each scene.

Tune pacing in `src/Saiqal.tsx` (`SCENES[].hold`, `T`) and `src/theme.ts` (`SLOW`, `panEase`).

## Scenes
1 «قبل لا يصير للصيقل اسم» · 2 steaming bowl «كان له طعم» · 3 torn-paper portrait «بدأت الحكاية» ·
4 ingredients · 5 «كبرت الحكاية → كبرت معها سمعة الصيقل» · 6 cut-out food + «يرجع لها مرة بعد مرة» ·
8 copper tools · 9 collage «بقي الطعم كما هو» · 10 khanjars + «حلوى الصيقل».

## Swapping in real photos
All visuals are drawn in SVG (no third-party photos). Put your own licensed
images in `public/` and pass them in, e.g. `defaultProps={{portrait: staticFile('portrait.jpg')}}`
in `src/Root.tsx`. Other photo slots (`TrayScene`, `CopperTools`) can be swapped for `<Img>` the same way.

Fonts: Amiri, Aref Ruqaa, Tajawal (OFL, via @fontsource). SFX are synthesized with ffmpeg.
