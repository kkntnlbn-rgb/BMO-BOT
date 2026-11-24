---
name: brand-frame-tokens
description: Enforces the exact visual identity, color palette, typography pairing, and permanent concave inverted-corner ticket frame for 9:16 editorial Arabic brand films in Remotion. Use for every scene and layout component.
---

# Brand Frame & Visual Design Tokens

## Video Specifications
- **Resolution:** `1080 × 1920` (9:16 Vertical)
- **FPS:** `30` (allows exact integer quantization for 10fps stop-motion via `Math.floor(frame / 3) * 3`)
- **Duration:** `1161` frames (`38.7` seconds)
- **Direction:** `rtl` (Arabic right-to-left everywhere)

## Exact Color Tokens (`src/styles/tokens.ts`)
- `--color-cream`: `#EAE3D2` (Outer inverted-corner frame, voting card paper, ending background)
- `--color-burgundy`: `#5E1A16` (Collage canvas, solid text highlight pills, map landmass)
- `--color-navy`: `#0D1B3E` (Map sea, reverse side of 3D curled paper, final brand logo)
- `--color-brown`: `#6D4C2D` (Ending serif slogan, logo accent dot)
- `--color-white`: `#FFFFFF` (Primary kinetic typography, pin markers, comment cards)
- `--color-shadow`: `rgba(15, 8, 6, 0.45)` (Drop shadows for tactile paper depth and night footage legibility)

## Permanent Inverted-Corner Frame Rules
1. Render `<InvertedCornerFrame />` as the topmost overlay (`zIndex: 9999`, `pointerEvents: 'none'`) from frame `0` to frame `1065`.
2. Frame border thickness: `26px` on all 4 edges.
3. Inner corners: **Concave (inward-curving) quarter-circle cutouts** with radius `42px` at all 4 corners, creating a classic tactile ticket/album silhouette.
4. At frames `1065–1085`, transition background smoothly to `#EAE3D2` so the outer frame merges invisibly into the final logo canvas.
5. Never place critical text closer than `56px` from any screen edge so nothing clips behind the inverted frame.

## Typography System
- **Primary Kinetic Font (`00:00–00:30`):** `IBM Plex Sans Arabic` (Weight `700` Bold) or local `DINNextLTArabic-Bold.ttf` / `LamaSans-Bold.ttf`.
- **Editorial Closing Font (`00:30–00:35`):** `Amiri` (Weight `700` Bold) or local `29LTZaridSerif-Bold.ttf` for "الشور شورك والراي رايك".
