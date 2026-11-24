# Project: Dar Editorial Brand Film (Remotion 9:16)

## Active Skills (Auto-Enforce Always)
- `brand-frame-tokens`: Always preserve the `#EAE3D2` inverted-corner frame and Dar Cafe palette from Color Scheme.pdf (src/styles/tokens.ts). Font: Thmanyah Serif Black (user-supplied, overrides the skill default).
- `arabic-kinetic-kashida`: Never use Unicode `ـ` stepping for animation. Always use `<DynamicKashida />` geometric stretching.
- `tactile-paper-collage`: Enforce 10fps quantization (`Math.floor(frame / 3) * 3`) on notes, perforated SVG masks on stamps, and stroke-dashoffset on checkmarks.
- `transitions-maps-3d`: Use GLSL `<PageCurl3D />` with Dar dark-olive `#413815` reverse face for the card reveal.
- `sound-design-foley`: Keep every visual beat locked to Foley audio (+ ducked BGM when one is supplied).
- `whisper-word-timestamps`: Sync text to `src/data/wordTimestamps.json`; falls back to `src/data/defaultTimestamps.ts`.
- `ffmpeg-pipeline`: Normalize all raw footage to 1080x1920 @ 30fps before mounting (`scripts/cut_shots.sh`).

## Commands
- Cut shots: `./scripts/cut_shots.sh` (raw clips in `footage/clip1..7.mov`)
- Preview studio: `npx remotion studio src/index.ts`
- Typecheck: `npx tsc --noEmit`
- Render master: `npx remotion render src/index.ts DarBrandFilm out/dar_final_1080x1920.mp4 --codec=h264 --crf=16 --browser-executable=<chrome-headless-shell> --gl=swangle`
