// Renders the "حكاية دار" chapter card used as the PageCurl3D front texture.
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1400 } });
  const root = 'file://' + path.resolve(__dirname, '..', 'public/assets');
  const html = `<html dir="rtl"><style>
  @font-face{font-family:T;src:url(${root}/fonts/thmanyah-serif-text-black.otf)}
  body{margin:0;width:1000px;height:1400px;background:#EAE3D2;font-family:T;color:#0D1B3E}
  .b{position:absolute;inset:44px;border:9px solid #0D1B3E;border-radius:26px}
  img{position:absolute;left:50%;top:110px;width:210px;transform:translateX(-50%)}
  .s{position:absolute;top:360px;width:100%;text-align:center;font-size:52px;color:#6D4C2D}
  .it{position:absolute;right:120px;left:120px;height:220px;border-bottom:3px solid #c9bfa8}
  .it h3{margin:0;position:absolute;right:120px;top:40px;font-size:64px}
  .it p{margin:0;position:absolute;right:120px;top:128px;font-size:40px;color:#6D4C2D}
  .bx{position:absolute;right:0;top:50px;width:78px;height:78px;border:5px solid #0D1B3E;border-radius:6px}
  </style><body><div class="b"></div><img src="${root}/images/dar_logo_navy.png"><div class="s">حكاية دار</div>
  <div class="it" style="top:520px"><div class="bx"></div><h3>الفصل الأول</h3><p>النعيرية</p></div>
  <div class="it" style="top:760px"><div class="bx"></div><h3>الفصل الثاني</h3><p>الفناتير · الجبيل</p></div>
  <div class="it" style="top:1000px;border:0"><div class="bx"></div><h3>الفصل الجاي</h3><p>قريباً بإذن الله</p></div></body></html>`;
  const f = path.resolve(__dirname, '..', 'out', 'card.html'); require('fs').mkdirSync(path.dirname(f), { recursive: true }); require('fs').writeFileSync(f, html); await p.goto('file://' + f);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: path.resolve(__dirname, '..', 'public/assets/images/dar_card.png') }); await b.close();
})();
