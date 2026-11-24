// Renders index.html frame-by-frame with Playwright and muxes the voiceover with ffmpeg.
// Usage:  node render.js                 -> out/dar-motion.mp4
//         node render.js --preview 3,8.5  -> out/preview-<t>.png for each time
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 25, DUR = 47.8;
const ROOT = __dirname;
const VO = path.join(ROOT, '..', 'voiceover', 'dar-voiceover-abdulrahman.mp3');
const OUT = path.join(ROOT, 'out');

// any file in assets/ named like "03-card-front.jpg" or "logo.png" replaces its placeholder
function assets() {
  const dir = path.join(ROOT, 'assets'), map = {};
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) {
    if (/\.(jpe?g|png|webp)$/i.test(f)) map[f.replace(/\.[^.]+$/, '')] = 'assets/' + f;
  }
  return map;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(a => { window.ASSETS = a; }, assets());
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const pi = process.argv.indexOf('--preview');
  if (pi > -1) {
    for (const t of process.argv[pi + 1].split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(OUT, `preview-${t}.png`) });
    }
    await browser.close();
    return;
  }

  const n = Math.round(DUR * FPS);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', VO, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-t', String(DUR), '-movflags', '+faststart', path.join(OUT, 'dar-motion.mp4')],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 100 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('done', path.join(OUT, 'dar-motion.mp4'));
})();
