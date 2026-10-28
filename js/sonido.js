/* Truco Oriental · sonido
   Guitarra criolla sampleada, milonga campera de fondo, fogón y efectos. */
/* ---------- sonido: guitarra criolla sampleada, fogón y efectos ---------- */
const NOTE_F={E2:82.41,Fs2:92.5,A2:110,B2:123.47,D3:146.83,E3:164.81,Fs3:185,G3:196,A3:220,B3:246.94,Cs4:277.18,E4:329.63,Gs4:415.3,B4:493.88,E5:659.25};
const SND={ctx:null,mus:false,musVol:0.6,sfxVol:0.8,timer:null,next:0,step:0,samples:[],loaded:false,
  init(){
    if(this.ctx){if(this.ctx.state==='suspended')this.ctx.resume();return}
    const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
    try{this.ctx=new C()}catch(e){return}
    const c=this.ctx;
    this.master=c.createGain();this.master.connect(c.destination);
    this.musG=c.createGain();this.musG.gain.value=0;this.musG.connect(this.master);
    this.sfxG=c.createGain();this.sfxG.gain.value=this.sfxVol;this.sfxG.connect(this.master);
    const rev=c.createConvolver(),len=Math.floor(c.sampleRate*1.4),ir=c.createBuffer(2,len,c.sampleRate);
    for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,4)}
    rev.buffer=ir;this.revIn=c.createGain();this.revIn.gain.value=0.12;this.revIn.connect(rev);rev.connect(this.master);
    const decode=(n,ab)=>new Promise(res=>{try{c.decodeAudioData(ab,buf=>{this.samples.push({f:NOTE_F[n],buf});res()},()=>res())}catch(e){res()}});
    const jobs=Object.keys(NOTE_F).map(n=>{
      const b64=typeof GUITAR_SAMPLES!=='undefined'&&GUITAR_SAMPLES[n];
      if(b64){const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return decode(n,u.buffer)}
      if(typeof GUITAR_URL==='undefined') return Promise.resolve();
      return fetch(GUITAR_URL+n+'.mp3').then(r=>r.ok?r.arrayBuffer():null).then(ab=>ab?decode(n,ab):null).catch(()=>{});
    });
    Promise.all(jobs).then(()=>{this.samples.sort((a,b)=>a.f-b.f);this.loaded=this.samples.length>0;if(this.mus)this.setMusic(true);updAudioUI()});
  },
  pluck(f,t,vol,dest){
    if(!this.loaded) return; const c=this.ctx;
    let best=this.samples[0];for(const s of this.samples) if(Math.abs(Math.log(s.f/f))<Math.abs(Math.log(best.f/f))) best=s;
    const src=c.createBufferSource(),g=c.createGain();
    src.buffer=best.buf;src.playbackRate.value=f/best.f;
    g.gain.setValueAtTime(vol,t);g.gain.setTargetAtTime(0,t+1.6,0.25);
    src.connect(g);g.connect(dest||this.musG);g.connect(this.revIn);src.start(t);src.stop(t+2.6);
  },
  strum(fs,t,gap,vol,dest){fs.forEach((f,i)=>this.pluck(f,t+i*gap+Math.random()*0.006,vol*(1-i*0.06),dest))},
  noise(t,dur,freq,q,vol,type,sweepTo){
    const c=this.ctx,len=Math.max(1,Math.floor(c.sampleRate*dur)),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);
    const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
    s.buffer=buf;fl.type=type||'bandpass';fl.frequency.setValueAtTime(freq,t);if(sweepTo)fl.frequency.exponentialRampToValueAtTime(sweepTo,t+dur);fl.Q.value=q||1;g.gain.value=vol;
    s.connect(fl);fl.connect(g);g.connect(this.sfxG);s.start(t);
  },
  thump(t,f,dur,vol){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*0.5,t+dur);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.connect(g);g.connect(this.sfxG);o.start(t);o.stop(t+dur+0.02);
  },
  play(name){
    if(!this.ctx||this.sfxVol<=0) return; const t=this.ctx.currentTime+0.01, S=this.sfxG;
    switch(name){
      case 'carta': this.noise(t,0.06,2400,0.7,0.55);this.thump(t,150,0.08,0.3);break;
      case 'repartir': for(let i=0;i<6;i++)this.noise(t+i*0.09,0.05,3000,0.7,0.3,'bandpass',1700);break;
      case 'click': this.noise(t,0.02,3800,2,0.2,'highpass');break;
      case 'truco': this.strum([82.41,123.47,164.81,196,246.94,329.63],t,0.022,0.8,S);break;
      case 'envido': this.strum([110,164.81,220,261.63,329.63],t,0.035,0.6,S);break;
      case 'flor': [329.63,415.3,493.88,659.25].forEach((f,i)=>this.pluck(f,t+i*0.11,0.7,S));break;
      case 'gana': this.pluck(246.94,t,0.7,S);this.pluck(329.63,t+0.14,0.7,S);break;
      case 'pierde': this.pluck(196,t,0.6,S);this.pluck(146.83,t+0.16,0.6,S);break;
      case 'puntos': this.noise(t,0.16,2500,0.6,0.35,'highpass',6000);break;
      case 'mate': this.noise(t,0.45,500,4,0.35,'bandpass',1500);this.noise(t+0.5,0.3,700,4,0.25,'bandpass',1800);break;
    }
  },
  /* milonga campera en Mi menor: pulgar en 3-3-2, rasgueo suave y punteo cada dos vueltas */
  prog:['Em','Em','B7','B7','Em','Am','B7','Em'],
  chords:{Em:{bass:[82.41,123.47,82.41],up:[164.81,196,246.94]},B7:{bass:[123.47,92.5,123.47],up:[155.56,220,246.94]},Am:{bass:[110,164.81,110],up:[130.81,164.81,220]}},
  mel:[[329.63,293.66,246.94],[196,246.94,329.63],[311.13,246.94,220],[185,220,311.13],[329.63,246.94,196],[261.63,220,329.63],[311.13,246.94,185],[164.81,196,246.94]],
  setVolumes(){
    if(!this.ctx) return; const c=this.ctx;
    this.sfxG.gain.setTargetAtTime(this.sfxVol,c.currentTime,0.05);
    this.musG.gain.setTargetAtTime(this.mus?this.musVol*0.8:0,c.currentTime,0.25);
  },
  setMusic(on){
    this.mus=on; if(!this.ctx) return; this.setVolumes();
    if(on&&this.loaded&&!this.timer){this.next=this.ctx.currentTime+0.15;this.step=0;this.timer=setInterval(()=>this.tick(),90)}
    if(!on&&this.timer){const tm=this.timer;setTimeout(()=>{if(!this.mus){clearInterval(tm);if(this.timer===tm)this.timer=null}},1200)}
  },
  tick(){
    const c=this.ctx,e8=60/84/2;
    while(this.next<c.currentTime+0.4){
      const bar=Math.floor(this.step/8)%8,cycle=Math.floor(this.step/64),pos=this.step%8,ch=this.chords[this.prog[bar]];
      const h=()=>0.9+Math.random()*0.2,sw=Math.random()*0.012,t=this.next+sw;
      const ac=[0,3,6].indexOf(pos);
      if(ac>=0){
        this.pluck(ch.bass[ac],t,0.85*h());
        if(cycle%2===1) this.pluck(this.mel[bar][ac],t+0.01,0.55*h());
      } else if(pos===2||pos===5||pos===7){
        this.strum(ch.up,t,0.014,(pos===7?0.22:0.3)*h());
      }
      if(Math.random()<0.15)this.crackle(this.next+Math.random()*e8);
      this.next+=e8;this.step++;
    }
  },
  crackle(t){const c=this.ctx,len=Math.floor(c.sampleRate*0.01),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    s.buffer=buf;f.type='highpass';f.frequency.value=1800+Math.random()*3000;g.gain.value=0.03+Math.random()*0.05;s.connect(f);f.connect(g);g.connect(this.musG);s.start(t)}
};
const sfx=n=>SND.play(n);
function updAudioUI(){
  const b=$('btnMusica'); if(!b) return;
  b.textContent=SND.mus?(SND.ctx&&!SND.loaded?'Afinando…':'Música: sí'):'Música: no'; b.setAttribute('aria-pressed',SND.mus);
}
SND.want=true;
function saveAudio(){try{localStorage.setItem('truco-audio',JSON.stringify({m:SND.musVol,s:SND.sfxVol,w:SND.want}))}catch(e){}}
try{const a=JSON.parse(localStorage.getItem('truco-audio')||'null');if(a){SND.musVol=a.m;SND.sfxVol=a.s;if(a.w===false)SND.want=false}}catch(e){}
function arrancarMusica(e){if(e&&e.target&&e.target.closest&&e.target.closest('#btnMusica'))return;SND.init();if(SND.want&&!SND.mus)SND.setMusic(true);updAudioUI()}
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,arrancarMusica,{once:false,passive:true}));
