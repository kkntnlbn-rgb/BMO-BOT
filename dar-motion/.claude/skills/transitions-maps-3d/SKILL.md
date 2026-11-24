---
name: transitions-maps-3d
description: Implements advanced visual transitions, match-cuts, branded vector maps with spring pin drops, and WebGL/Three.js GLSL 3D cylindrical page-curl shaders inside Remotion.
---

# Transitions, Match-Cuts, Branded Maps & 3D Page-Curl

## 1. Fixed-Object Match-Cut (`00:01.0–00:02.0`)
- Lock the isolated transparent PNG chair (`public/assets/images/chair_cutout.png`) at exact screen coordinates (`left: 50%`, `top: 56%`, `transform: translate(-50%, -50%)`).
- Hard-cut (`0`-frame cut) background layers underneath every `9` frames (`0.3s`) synced to musical percussion hits.
- Add a subtle ground contact shadow (`radial-gradient`) beneath the chair legs that adapts opacity slightly per background.

## 2. Full-Bleed to Picture-in-Picture Snap (`00:03.3–00:04.6`)
- Pop the drive-thru video container (`width: 720px`, `height: 920px`, centered) over the park background at F99.
- On the beat (F112), hard-swap the outer background layer from park video to solid `#5E1A16` (Burgundy) while keeping the video container locked in place.

## 3. Custom Branded Map Scene (`00:18.6–00:20.8`)
- Render vector map SVG (`public/assets/svg/dammam_map.svg`) styled strictly in brand tokens:
  - Water: `#0D1B3E`
  - Landmass: `#5E1A16` with dark radial edge vignette
  - Major roads: `#EAE3D2` (`opacity: 0.75`)
- Apply slow continuous Ken Burns scale (`1.0 -> 1.06` over 66 frames).
- Drop location pins (`Dammam الدمام` + custom Nuss logo pin) from `translateY(-140px)` with bouncy spring (`damping: 10, stiffness: 160`).

## 4. Real 3D Diagonal Page-Curl Shader (`00:22.6–00:24.3`)
- Use `@remotion/three` `<ThreeCanvas>` + a custom `THREE.ShaderMaterial` on a high-subdivision `PlaneGeometry(1, 1.45, 64, 96)`.
- **Vertex Shader:** Bend vertices around a moving diagonal cylinder axis (`angle ≈ -38deg`) driven by `uCurlProgress` (`0.0` rolled/closed -> `1.0` flat open).
- **Fragment Shader:** Detect `gl_FrontFacing`:
  - Front face: sample voting card texture (`#EAE3D2` cream card).
  - Back face: render solid `#0D1B3E` (Deep Navy) with subtle paper grain + directional crease shading along the curl radius.
- Cast soft shadow onto the flat portion of the card proportional to distance from the curl cylinder.

## 5. Digital-to-Physical Match-Cut (`00:25.0 -> 00:25.3`)
- Align the final frame of the macro digital ballot checkboxes with the exact tilt angle (`-4deg`) and position of the physical ballot held by the hand in the car footage (`public/assets/video/hand_voting.mp4`), cutting cleanly on the 3rd checkmark completion.

## 6. Watercolor Crossfade Ending (`00:30.6–00:38.7`)
- Crossfade (`18` frames) from night storefront banner to panoramic watercolor artwork (`public/assets/images/eastern_watercolor.png`).
- Overlay a top-down linear gradient mask (`#EAE3D2` 100% at top `0%–28%`, fading to `0%` at `58%`) so the skyline blends gently into cream mist.
- Drift camera very slowly (`scale: 1.0 -> 1.04`, `translateY: 0 -> -18px`).
- Crossfade cleanly into solid `#EAE3D2` + centered SVG Nuss logo (`#0D1B3E` + `#6D4C2D` dot).
