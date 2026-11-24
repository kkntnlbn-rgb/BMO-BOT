---
name: tactile-paper-collage
description: Creates handcrafted tactile paper collage animations in Remotion: 8-12fps stop-motion unfolding notes with corner peels, perforated SVG postage stamp masks with staggered spring exit, TikTok-style social comment cards, and ink-brush SVG checkmark drawing.
---

# Tactile Paper Collage & Stop-Motion Craft

## 1. Authentic Stop-Motion Quantization (8–10 FPS)
For handwritten customer notes (`00:04.6–00:07.0`), NEVER animate smoothly at 30/60fps.
- Quantize time using:
  `const steppedFrame = Math.floor(frame / 3) * 3;` (gives 10fps on a 30fps timeline).
- Use `steppedFrame` for all `translate`, `rotate`, `scale`, and `clipPath` values of the notes.
- Give each note a unique static resting rotation (`-7deg`, `+4.5deg`, `-2.5deg`) and layered drop shadow (`0 14px 28px rgba(0,0,0,0.38)`).
- Add an SVG folded bottom-left/bottom-right **Corner Peel** triangle with a subtle linear gradient highlight + shadow beneath it.

## 2. Perforated Postage Stamp Frames (`00:08.3–00:10.8`)
- Wrap landmark photos (Nuss branch, Ithra, Khobar Tower) in `<PostageStampCard />`.
- Generate the perforated edge mathematically via an SVG `<mask>` using evenly spaced semicircles punched out along a white rounded rectangle border (`borderWidth: 16px`, `toothRadius: 7px`, `toothSpacing: 22px`).
- **Entrance:** Staggered `spring({ fps: 30, frame: frame - delay, config: { damping: 14, stiffness: 180 } })` scaling from `0.6 -> 1.0` with slight rotation settle.
- **Exit (`00:10.6–00:11.0`):** Staggered rapid slide UP (`translateY: 0 -> -1400px`) with `Easing.in(Easing.cubic)` over 9 frames per stamp, offset by 3 frames each.

## 3. Social Media Comment Cards (`00:10.8–00:13.0`)
- Build clean React TikTok-style white cards (`borderRadius: 18px`, `padding: 18px 22px`, circular avatar, username, comment text, date, `Reply`, and `❤️ by author` badge where applicable).
- Enter sequentially from top to bottom with slight overshoot (`scale: 0.8 -> 1.03 -> 1.0`, `opacity: 0 -> 1`).

## 4. Ink-Brush Checkmark Trim Path (`00:24.3–00:25.2`)
- Animate the 3 voting checkmarks (`✓`) sequentially using SVG `strokeDasharray={pathLength}` and `strokeDashoffset={interpolate(localFrame, [0, 7], [pathLength, 0])}`.
- Use a slightly hand-drawn, variable-feel SVG path (`strokeLinecap="round"`, `strokeLinejoin="round"`, `stroke="#1A1A1A"`, `strokeWidth={9}`).
