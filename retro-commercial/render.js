const {chromium}=require('playwright');const path=require('path');
(async()=>{const times=process.argv[2].split(',').map(Number);const out=process.argv[3];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('console',m=>console.log('C:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('scene.html'));await p.evaluate(()=>window.ready);
for(let i=0;i<times.length;i++){await p.evaluate(t=>render(t),times[i]);
 await p.screenshot({path:`${out}${String(i).padStart(4,'0')}.png`});}
await b.close();})();
