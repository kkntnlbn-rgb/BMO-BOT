import numpy as np, wave
SR=44100; D=10.0; N=int(SR*D); out=np.zeros((N,2))
rng=np.random.default_rng(3)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); s=sig[:max(0,N-i)]*g
    out[i:i+len(s),0]+=s*(1-pan)*0.5*2**.5; out[i:i+len(s),1]+=s*(1+pan)*0.5*2**.5
def env(n,a=0.005,r=0.2):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/r); return e
def tone(f,d,kind='clar',a=.01,r=.3):
    n=int(d*SR); t=np.arange(n)/SR
    vib=1+0.004*np.sin(2*np.pi*5.5*t)*np.minimum(1,t/0.15)
    ph=2*np.pi*f*np.cumsum(vib)/SR
    if kind=='clar': s=np.sin(ph)+.45*np.sin(3*ph)+.22*np.sin(5*ph)+.1*np.sin(7*ph)
    elif kind=='bass': s=np.sin(ph)+.5*np.sin(2*ph)+.2*np.sin(3*ph)
    elif kind=='bell': s=np.sin(ph)+.4*np.sin(2.76*ph)+.2*np.sin(5.4*ph)
    else: s=np.sin(ph)+.3*np.sin(2*ph)
    e=env(n,a,r); e[-200:]*=np.linspace(1,0,200); return s*e
def nt(m): return 440*2**((m-69)/12)
BPM=140; B=60/BPM
# --- music (C major ragtime-ish, starts after the whoosh) ---
prog=[(48,[60,64,67]),(53,[60,65,69]),(55,[59,62,67]),(48,[60,64,67])]*3+[(53,[60,65,69]),(55,[59,62,65,67])]
mel=[72,74,76,79,76,74,72,67, 69,72,77,76,74,72,69,72, 71,74,79,77,76,74,71,74, 72,76,79,84,79,76,72,76]
t0=0.25; beat=0
while t0+beat*B<9.3:
    tb=t0+beat*B; bar=int(beat//4); root,ch=prog[bar%len(prog)]
    if beat%2==0: add(tone(nt(root-12 if beat%4==0 else root-5),B*.9,'bass',.005,.18),tb,0,.55)
    else:
        for m in ch: add(tone(nt(m),B*.5,'piano',.003,.09),tb,0.25,.12)
    beat+=1
# melody 8th notes in the action, sparser at start
i=0;tb=0.35
while tb<9.0:
    if not(6.95<tb<7.25):
        m=mel[i%len(mel)]+(12 if 3.0<tb<7 and i%8 in(3,7) else 0)
        add(tone(nt(m),B*.48,'clar',.01,.12),tb,-0.2,.16)
    i+=1; tb+=B/2
# --- SFX ---
def noise(d): return rng.standard_normal(int(d*SR))
def lp(x,a):
    y=np.zeros_like(x);acc=0
    for k in range(len(x)): acc+=a*(x[k]-acc); y[k]=acc
    return y
def sweep(f0,f1,d,kind='sin'):
    n=int(d*SR);f=np.geomspace(f0,f1,n);ph=2*np.pi*np.cumsum(f)/SR;return np.sin(ph)
def whoosh(d,rise=True):
    x=noise(d); n=len(x); a=np.linspace(.05,.5,n) if rise else np.linspace(.5,.05,n)
    y=np.zeros(n);acc=0
    for k in range(n): acc+=a[k]*(x[k]-acc); y[k]=acc
    e=np.sin(np.pi*np.linspace(0,1,n))**1.5; return y*e
add(whoosh(.32),0.0,0,.9)                       # transition
add(sweep(220,900,.35)*env(int(.35*SR),.01,.3),0.12,0,.25)  # hop up slide whistle
add(sweep(900,300,.3)*env(int(.3*SR),.01,.25),0.5,0,.22)
def thump(f=70,d=.25): n=int(d*SR);t=np.arange(n)/SR;return np.sin(2*np.pi*f*t*np.exp(-t*6))*np.exp(-t*14)+lp(noise(d),.2)*np.exp(-t*40)*.6
add(thump(),0.85,0,.9)
def boing(t,f=180,d=.45): n=int(d*SR);tt=np.arange(n)/SR;fr=f*(1+.35*np.sin(2*np.pi*14*tt)*np.exp(-tt*5));return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-tt*5)
add(boing(0,160),0.86,0,.35)
for tt,f in [(1.0,2400),(1.25,2900),(1.5,2600),(1.8,3100),(2.1,2800)]: add(tone(f,.3,'bell',.002,.08),tt,np.sin(tt*5)*.6,.08)
for tt in [1.2,1.5,2.3,2.55]: add(sweep(3000,4200,.08)*env(int(.08*SR),.002,.04),tt,-.5,.08)  # bird chirps
# rustle at branch shake
add(lp(noise(.8),.35)*np.sin(np.pi*np.linspace(0,1,int(.8*SR)))*(.5+.5*np.sign(np.sin(np.linspace(0,60,int(.8*SR))))),2.95,0,.35)
# falling whistles + bonks
for (tf,tl,pan) in [(3.0,3.73,-.5),(3.12,3.46,.1),(3.3,4.02,-.7),(3.42,4.15,.6),(3.62,4.37,-.4)]:
    add(sweep(1500,500,tl-tf)*.12,tf,pan,.6)
    add(boing(0,260+80*pan,.35),tl,pan,.3)
def knock(): n=int(.15*SR);t=np.arange(n)/SR;return (np.sin(2*np.pi*520*t)+.6*np.sin(2*np.pi*1380*t))*np.exp(-t*35)
add(knock(),3.46,0,.6); add(boing(0,300,.35),4.56,.5,.3)
# juice swirl: watery whoosh + rising slide
add(whoosh(1.3)*1.0,4.2,0,.7); add(sweep(200,1200,.65)*env(int(.65*SR),.05,.6),4.2,0,.18)
for k in range(10): add(tone(600+rng.random()*900,.08,'sin',.002,.02)*.6,4.3+k*.12,rng.random()*1.4-.7,.25)  # bloops
add(sweep(900,250,.45)*env(int(.45*SR),.01,.4),5.45,0,.2)
# splash
x=noise(.8);n=len(x);tt=np.arange(n)/SR; add(lp(x,.5)*np.exp(-tt*5),5.93,0,.6); add(thump(55,.35),5.93,0,1.0)
# hero sting: cymbal + chord + sparkles
x=noise(1.6);tt=np.arange(len(x))/SR;cym=(x-lp(x,.3))*np.exp(-tt*2.2); add(cym,7.0,0,.25)
for m in [60,64,67,72,76]: add(tone(nt(m),2.2,'clar',.02,1.2),7.0,0,.09)
for k,tt0 in enumerate([7.5,7.8,8.2,8.5,8.9,9.1]): add(tone(nt(84+[0,4,7,12,7,4][k]),.6,'bell',.002,.25),tt0,(-1)**k*.5,.09)
# final chord
for m in [48,60,64,67,72,79]: add(tone(nt(m),.85,'clar' if m>50 else 'bass',.01,.6),9.15,0,.12)
# mix
out*=0.9/np.max(np.abs(out)); fade=np.ones(N); fade[-int(.25*SR):]=np.linspace(1,0,int(.25*SR)); out*=fade[:,None]
pcm=(out*32767).astype(np.int16)
w=wave.open('audio.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes());w.close()
print('ok')
