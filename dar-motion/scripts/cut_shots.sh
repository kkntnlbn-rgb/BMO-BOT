#!/usr/bin/env bash
# Cuts the chosen shots from footage/clipN.mov into public/assets/video/<name>.mp4 (1080x1920, 30fps) – ffmpeg-pipeline skill
set -e
OUT=public/assets/video; mkdir -p $OUT public/assets/images
cut(){ ffmpeg -nostdin -v error -y -ss $3 -to $4 -i footage/clip$2.mov -an \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
  -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p -movflags +faststart $OUT/$1.mp4; echo "  $1"; }
still(){ ffmpeg -nostdin -v error -y -ss $3 -i footage/clip$2.mov -frames:v 1 -q:v 2 public/assets/images/$1.jpg; echo "  $1.jpg"; }
cut open      7 4.60 6.60
cut match1    4 0.60 1.60
cut match2    5 11.40 12.60
cut match3    4 1.75 2.90
cut match4    5 10.10 11.30
cut logodoor  7 2.70 4.40
cut pipfront  2 13.10 14.75
cut pipcup    4 12.50 13.68
cut night1    1 3.45 5.40
cut night2    2 12.00 13.05
cut night3    2 18.75 19.62
cut project   1 2.72 3.38
cut bar       4 5.20 6.28
cut hand      3 9.60 10.28
cut wide      2 9.80 11.10
cut wave      6 12.05 13.58
cut aerial    7 8.00 14.00
still paper   5 0.75
still stamp1  6 4.80
still stamp2  6 6.10
still stamp3  6 8.60
still stamp4  4 4.40
still logosrc 1 3.05
