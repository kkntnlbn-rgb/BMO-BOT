# Dar — motion collage template

Ticket-frame collage animation synced to `../voiceover/dar-voiceover-abdulrahman.mp3` (1080×1920, 25 fps, 47.8 s).

## Replace placeholders
Drop images (jpg/png/webp) into `assets/` using these names; anything missing renders as a labelled placeholder.

| File name | Scene | Time |
|---|---|---|
| `01-opening` | Aerial of Nuairyah / Jubail | 0.0 |
| `02-match-1` … `02-match-4` | Same object (Dar cup) in 4 places, same spot in frame | 1.6 |
| `03-card-front` | Nuairyah branch front (inset card) | 4.3 |
| `04-card-cup` | Hand holding a Dar cup | 6.1 |
| `05-stamp-1` … `05-stamp-3` | Nuairyah photos as postage stamps | 10.5 |
| `06-night-1` … `06-night-3` | Night shots: sign, cup in car, seating | 22.7 |
| `07-fanateer-front` | Al Fanateer branch front | 25.9 |
| `08-interior` | Inside the new branch | 30.5 |
| `09-hand` | Hand opening the door / turning a page | 32.1 |
| `10-wide-night` | Wide night shot of the facade | 37.3 |
| `11-watercolor` | Watercolor illustration of Jubail (outro) | 41.2 |
| `logo` | Dar logo, transparent PNG | 44.6 |

The comment bubbles (16.6 s) are placeholders for real customer comments.

## Render
```
npm install
node render.js                       # -> out/dar-motion.mp4
node render.js --preview 5,12.3,30   # -> out/preview-<t>.png
```
