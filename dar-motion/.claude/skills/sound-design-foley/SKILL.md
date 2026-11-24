---
name: sound-design-foley
description: Synchronizes voiceover, background music with automatic audio ducking, and tactile Foley sound effects (paper rustle, stamp pops, pen scratches, whooshes) to exact Remotion visual events.
---

# Sound Design, Foley & Audio Ducking

## Audio Layer Architecture
Mount all audio via Remotion `<Audio />` inside a dedicated `<SoundDesignTrack />` component:
1. **Voiceover (`public/assets/audio/voiceover.wav`):** Volume `1.0` (0 dB reference, always clear).
2. **Background Music (`public/assets/audio/bgm.wav`):** Dynamic volume using `interpolate()` ducking:
   - Under active speech: `0.22`
   - During musical pauses / transitions (e.g., `00:01–00:02`, `00:12.8–00:13.3`, `00:35.5–00:38.7`): rise smoothly to `0.58` over 8 frames.
3. **Mandatory Foley Trigger Map (frame-locked to visuals):**
   - `F30, F39, F48` (Chair match-cuts): `foley/soft_pop.wav` (`vol: 0.45`)
   - `F138, F148, F160` (Stop-motion notes opening): `foley/paper_unfold.wav` (`vol: 0.55`)
   - `F249, F262, F275` (Postage stamps popping): `foley/stamp_thud.wav` (`vol: 0.40`)
   - `F318` (Stamps sliding up): `foley/quick_whoosh.wav` (`vol: 0.35`)
   - `F328, F342, F356` (TikTok comment pops): `foley/ui_bubble_pop.wav` (`vol: 0.45`)
   - `F568, F582` (Map pin drops): `foley/pin_drop.wav` (`vol: 0.50`)
   - `F678` (3D voting card curl): `foley/card_flip_paper.wav` (`vol: 0.65`)
   - `F732, F740, F748` (Checkmark ticks): `foley/pen_tick.wav` (`vol: 0.60`, pitch-shifted slightly if needed)
