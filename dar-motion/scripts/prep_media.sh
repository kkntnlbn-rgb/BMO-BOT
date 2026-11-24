#!/usr/bin/env bash
set -e
IN_DIR="${1:-raw_footage}"
OUT_DIR="public/assets/video"
mkdir -p "$OUT_DIR"

for f in "$IN_DIR"/*.{mov,mp4,MOV,MP4}; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  name="${base%.*}"
  echo "🎬 Normalizing $base -> 1080x1920 @ 30fps..."
  ffmpeg -y -i "$f" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
    -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p -movflags +faststart \
    "$OUT_DIR/${name}.mp4"
done
echo "✅ All clips normalized in $OUT_DIR"
