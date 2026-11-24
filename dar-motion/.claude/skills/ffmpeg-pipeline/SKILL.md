---
name: ffmpeg-pipeline
description: Preprocesses raw live-action footage, trims clips to exact scene durations, normalizes frame rate to 30fps, removes background from the wooden chair hero object via rembg, and handles final high-bitrate H.264/ProRes rendering.
---

# FFmpeg Media Pipeline & Asset Preparation

## Standard Preprocessing Rules
1. Normalize all incoming live-action clips to `1080×1920` (vertical crop/scale preserving aspect ratio), `30fps`, `yuv420p`, fast-start MP4 so Remotion seeks every frame deterministically without lag:
   `ffmpeg -i input.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p -movflags +faststart output.mp4`
2. Chair cutout isolation: use `rembg i raw_chair.jpg public/assets/images/chair_cutout.png` if a raw chair photo is supplied without transparency.
3. Final Remotion Render Command (Social-Media Master Quality):
   `npx remotion render src/index.ts NussBrandFilm out/nuss_final_1080x1920.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --concurrency=50%`
