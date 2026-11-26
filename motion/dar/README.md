# مقهى دار — الفناتير (Remotion)

9:16, 1080×1920, 60fps, 47.6s (VO 44.6s + logo build). Rebuilt on the same engine as `../loh`,
`../sustain` and `../saiqal` (whip-push hand-offs, shutter motion blur, word-by-word RTL reveal,
layered-extrusion 3D), keeping the approved Dar rules from the first cut (branch `claude/brave-bohr-doo4m1`):
cream ticket frame `#ECE4CC` with bitten corners, plain brand grounds (#413815 · #8F7E2F · #C8B67C,
terracotta #B75F3D), big white captions on the right with no shadow, smooth tatweel kashida
(`سميناه، أهلك، مرحبا، أوسع، وراحة، جديد، الجاية`), perforated stamps, the map, terrace→stamp ending
and the outline→filled logo build. From the reference film: real opening footage cut on the voice
with zoom-settle on every cut, plus chroma flashes.

## Footage (not in git — 86MB)
Put the three parts of the brand film in `footage/part1..3.mov`, then:
```bash
for p in 1 2 3; do ffmpeg -i footage/part$p.mov -c:v libx264 -crf 17 -g 15 -pix_fmt yuv420p -an public/shots/part$p.mp4; done
```
Shot ids (`src/shots.ts`) are the scene-detected cuts of those parts.

```bash
npm install && npm run studio            # composition "Dar"
npx remotion render Dar out/dar.mp4 --props='{"blur":4}'
```
Captions & word windows: `src/cues.ts` (from the approved cut). Chapters, shots and foley: `src/Film.tsx`.
