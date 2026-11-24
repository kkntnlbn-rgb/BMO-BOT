---
name: whisper-word-timestamps
description: Extracts exact millisecond word-level timestamps from Arabic voiceover audio and maps them to Remotion 30fps frame numbers in src/data/wordTimestamps.json for tight kinetic typography synchronization.
---

# Word-Level Timestamp Synchronization

## Workflow
Whenever `public/assets/audio/voiceover.wav` (or `.mp3`) is provided:
1. Run `python3 scripts/extract_timestamps.py public/assets/audio/voiceover.wav src/data/wordTimestamps.json`.
2. Every kinetic text cue and Dynamic Kashida duration MUST read its `startFrame` and `endFrame` from `src/data/wordTimestamps.json` (`Math.round(seconds * 30)`).
3. Pay special attention to elongated Arabic words (`ليــــــن`, `كـــبرته`, `الشور`):
   - `kashidaStartFrame = word.startFrame + 2`
   - `kashidaEndFrame = word.endFrame - 1`
4. If the voiceover file is not yet placed by the user, fall back gracefully to the calibrated default timestamps pre-populated in `src/data/defaultTimestamps.ts` based on the 38.68s reference cut.
