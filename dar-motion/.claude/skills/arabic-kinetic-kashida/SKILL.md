---
name: arabic-kinetic-kashida
description: Builds smooth, frame-accurate Arabic kinetic typography in Remotion, including true geometric SVG Dynamic Kashida stretching ("ليــــــن", "كـــبرته"), Split-Embrace word parting ("احتضنت" revealing "نص"), burgundy pill-stacked captions, and voice-synced keyframes.
---

# Arabic Kinetic Typography & Dynamic Kashida

## Critical Rule: NEVER Animate Kashida via Unicode `ـ` Characters
Adding repeated `ـ` (U+0640) characters causes ugly discrete step-jumps. All smooth Arabic stretching MUST be built using **Geometric SVG Split-Stretch**:

### Method: 3-Part SVG Dynamic Kashida (`<DynamicKashida />`)
1. Split the target Arabic word into 3 synchronized SVG/DOM elements positioned on the exact same typographic baseline:
   - **Right Prefix** (anchored right, e.g., `ليـ` or `كـ`)
   - **Horizontal Connector Bridge** (`<rect>` matching exact stroke thickness & baseline Y-offset of the font's connecting line)
   - **Left Suffix** (e.g., `ـن` or `ـبرته`)
2. Drive a single normalized progress value `p` (`0` to `1`) using `interpolate(frame, [startFrame, endFrame], [0, 1], { easing: Easing.bezier(0.22, 1, 0.36, 1) })`.
3. Set Bridge width = `baseWidth + p * maxStretchPx`.
4. Translate Left Suffix horizontally by `translateX(-p * maxStretchPx)`.
5. Both pieces stay mathematically welded with zero pixel gap at every frame (`1px` intentional overlap on both joints to prevent sub-pixel antialiasing seams).

## Key Signature Animations
1. **Split-Embrace (`00:02.0–00:03.3` | F60–F99):**
   - Start with `الشرقية احتضنت` on one line.
   - Split `احتضنت` into Right Fragment (`ح`) and Left Fragment (`ننت`).
   - Animate `ح` moving right (`+45px`) and `ننت` moving left (`-95px`) with spring physics while `نص` scales/fades into the center gap (`0.85 -> 1.0`).
   - Fade fragments opacity `1 -> 0` over 12 frames, leaving `الشرقية   نص` aligned.
2. **Tension Compress (`كـــبرته` at `00:03.8–00:04.6`):**
   - Start stretched (`maxStretchPx: 90`) and compress smoothly down to `12px` as the narrator hits the beat.
3. **Vocal Hold Stretch (`ليــــــن` at `00:07.0–00:08.0`):**
   - Start compact (`0px`) and smoothly elongate horizontally up to `240px` synced precisely to the Whisper duration of the word "لين".
4. **Solid Pill Stacking (`ولأننا / يهمنا / رايك` at `00:20.8–00:22.6`):**
   - Each word sits inside a tight inline-block box (`background: #5E1A16`, `color: #FFFFFF`, `padding: 4px 16px`, `marginBottom: 8px`) popping in sequentially on each word timestamp.
5. **Night-Footage Legibility (`00:13.0–00:18.6`):**
   - Apply `textShadow: '0 4px 24px rgba(0, 0, 0, 0.72), 0 1px 4px rgba(0, 0, 0, 0.9)'` on all white captions over dark video footage.
