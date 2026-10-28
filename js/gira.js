/* Truco Oriental · gira y mapa
   Partidas de la gira, apuestas, pantallas y el mapa de Uruguay. */
/* ---------- partidas de la gira ---------- */
function startStop(st,bet){
  MATCH.stop=st; MATCH.bet=bet||0;
  if(bet){C.plata-=bet;saveC()}
  MATCH.serie=st.final?{res:[],idx:0}:null;
  MATCH.boost={};
  for(const d of DESPENSA) if(C.despensa[d.id]>0){C.despensa[d.id]--;MATCH.boost[d.id]=true}
  saveC();
  show('juego');
  newGame(st.final?{rules:'uy',target:15}:{rules:'uy',target:30});
}
function gameOver(){
  if(!G||pantalla!=='juego') return;
  const pw=G.score.p>=G.target;
  sfx(pw?'flor':'pierde');
  const st=MATCH.stop;
  if(MATCH.serie){
    const S=MATCH.serie; S.res[S.idx]=pw?'p':'c';
    const wins=S.res.filter(r=>r==='p').length, losses=S.res.filter(r=>r==='c').length;
    render();
    if(wins<2&&losses<2){
      S.idx++;
      const next=S.idx===1?'truco argentino, sin muestra ni flor':'desempate en truco uruguayo';
      return modal(`<h2>${pw?'¡Ganaste el juego!':'Perdiste el juego'}</h2><p>${G.score.p} a ${G.score.c}. La serie va ${wins} a ${losses}.</p><p>Sigue: <b>${next}</b>, a 15.</p><div class="botones"><button class="btn hot" data-a="sigSerie">Siguiente juego</button></div>`);
    }
    return finishMatch(wins>=2);
  }
  finishMatch(pw);
}
function finishMatch(pw){
  C.changaLock=false;
  const st=MATCH.stop,bet=MATCH.bet;
  let lines='';
  if(st.id==='rapida'){
    lines=`<p>${pw?'Ganaste la partida de práctica.':'Perdiste la de práctica. Nadie se enteró.'}</p>`;
  } else if(pw){
    const first=!C.won[st.id];
    const gain=bet*2+(first?st.premio:0);
    C.plata+=gain; C.won[st.id]=true;
    const idx=STOPS.indexOf(st); if(idx>=C.prog&&idx<STOPS.length-1) C.prog=idx+1;
    const pts=1+(first?2:0)+(st.final?3:0); C.pm+=pts;
    lines=`<p>Cobrás <b>$${gain}</b>: tu apuesta de $${bet} más $${bet} del rival${first?' y $'+st.premio+' de premio por ser la primera vez':''}.</p>`;
    lines+=`<p>Ganás <b>${pts} ${pts===1?'punto':'puntos'} de mesa</b> para aprender habilidades.</p>`;
    if(st.final&&!C.mates.includes('pava')){C.mates.push('pava');lines+='<p>Y te llevás el trofeo: <b>La pava, de una</b>. Equipala en el almacén.</p>'}
    if(st.final) lines='<p><b>¡Campeón del Río de la Plata!</b> El porteño vuelve en el ferry con las manos vacías.</p>'+lines;
    else if(C.prog===idx+1) lines+=`<p>Se abrió la próxima parada: <b>${STOPS[idx+1].lugar}</b>.</p>`;
  } else {
    lines=`<p>Perdiste los $${bet} que apostaste.</p>`;
    if(C.plata<STOPS[0].min) lines+='<p>Te quedaste corto de plata. En el mapa podés hacer una changa.</p>';
  }
  saveC();
  modal(`<h2>${pw?(st.final?'¡Ganaste la final!':'¡Ganaste!'):'Perdiste contra '+st.rival}</h2>${lines}<div class="botones">${st.id!=='rapida'&&C.plata>=st.min?`<button class="btn" data-a="revancha">${pw?'Jugar otra vez':'Revancha'}</button>`:''}<button class="btn hot" data-a="irMapa">Volver al mapa</button></div>`);
}

/* ---------- pantallas ---------- */
let pantalla='mapa',selStop=0;
function show(s){
  pantalla=s;
  document.body.classList.toggle('en-inicio',s==='inicio');
  for(const [k,id] of [['inicio','scrInicio'],['mapa','scrMapa'],['tienda','scrTienda'],['hab','scrHab'],['juego','scrJuego']]) $(id).hidden=s!==k;
  for(const [k,id] of [['inicio','navInicio'],['mapa','navMapa'],['tienda','navTienda'],['hab','navHab']]){const b=$(id);b.hidden=s==='juego';b.classList&&b.classList.toggle('on',s===k)}
  if(s!=='juego'){clearTimeout(cpuTimer);G=null}
  if(s==='inicio') renderInicio();
  if(s==='mapa') renderMapa();
  if(s==='tienda') renderTienda();
  if(s==='hab') renderHab();
  updPlata();
  window.scrollTo(0,0);
}
function updPlata(){$('plata').textContent='$ '+C.plata}
function modal(html){$('modal').innerHTML=html?`<div class="modal" role="dialog" aria-modal="true"><div class="box">${html}</div></div>`:'';const b=$('modal').querySelector('.btn.hot');if(b)b.focus()}

/* ---------- mapa de Uruguay ---------- */
const UY=[[-57.62,-30.18],[-57.1,-30.1],[-56.8,-30.1],[-56.0,-30.8],[-55.6,-30.85],[-55.2,-31.0],[-54.6,-31.45],[-54.0,-31.9],[-53.6,-32.3],[-53.25,-32.6],[-53.7,-33.0],[-53.5,-33.5],[-53.37,-33.74],[-53.8,-34.4],[-54.3,-34.7],[-54.95,-34.97],[-55.6,-34.8],[-56.2,-34.92],[-56.8,-34.65],[-57.4,-34.45],[-57.85,-34.48],[-58.35,-33.95],[-58.4,-33.4],[-58.15,-33.0],[-58.1,-32.3],[-57.95,-31.4],[-57.8,-30.9]];
const GW=84,GH=94,LON0=-58.9,LON1=-52.9,LAT0=-29.7,LAT1=-35.4,MS=4;
const gx=lon=>(lon-LON0)/(LON1-LON0)*GW, gy=lat=>(LAT0-lat)/(LAT0-LAT1)*GH;
function inPoly(x,y,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
let mapBase=null;
function buildMap(){
  const poly=UY.map(([lo,la])=>[gx(lo),gy(la)]);
  const land=[];for(let y=0;y<GH;y++){land[y]=[];for(let x=0;x<GW;x++)land[y][x]=inPoly(x+0.5,y+0.5,poly)}
  const near=(x,y,d)=>{for(let yy=y-d;yy<=y+d;yy++)for(let xx=x-d;xx<=x+d;xx++)if(land[yy]&&land[yy][xx])return true;return false};
  const cv=document.createElement('canvas');cv.width=GW*MS;cv.height=GH*MS;const c=cv.getContext('2d');
  const hash=(x,y)=>((x*73856093)^(y*19349663))>>>0;
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){
    const lon=LON0+(x+0.5)/GW*(LON1-LON0), lat=LAT0-(y+0.5)/GH*(LAT0-LAT1), h=hash(x,y)%7;
    let col;
    if(land[y][x]){col=h===0?'#7fae48':h===1?'#5f8e34':'#6b9a3a'}
    else{
      const water=(lat<-33.75&&!(lon<-58.45&&lat>-34.55))||(lon<-57.6&&near(x,y,1))||(lon>-54.1&&lat<-32.4&&near(x,y,2));
      col=water?(h===0?'#3f7f9f':'#2c5f7c'):(h===0?'#8a8460':'#7b765a');
    }
    c.fillStyle=col;c.fillRect(x*MS,y*MS,MS,MS);
  }
  c.fillStyle='#2b1d14';
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){if(!land[y][x])continue;
    if(!land[y-1]?.[x]||!land[y+1]?.[x]||!land[y][x-1]||!land[y][x+1]) c.fillRect(x*MS,y*MS,MS,MS)}
  const rio=[[-54.4,-31.75],[-55.4,-32.3],[-56.4,-32.75],[-57.2,-33.15],[-58.15,-33.35]];
  c.fillStyle='#7ec8f0';
  for(let i=0;i<rio.length-1;i++){const [a,b]=[rio[i],rio[i+1]];const x0=gx(a[0]),y0=gy(a[1]),x1=gx(b[0]),y1=gy(b[1]);const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*2);
    for(let k=0;k<=n;k++){const x=Math.floor(x0+(x1-x0)*k/n),y=Math.floor(y0+(y1-y0)*k/n);if(land[y]&&land[y][x])c.fillRect(x*MS,y*MS,MS,MS)}}
  mapBase=cv;
}
function drawMap(){
  if(!mapBase) buildMap();
  const cv=$('mapa'),c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  c.drawImage(mapBase,0,0);
  c.fillStyle='#f2c14e';
  for(let i=0;i<STOPS.length-1;i++){
    const a=STOPS[i],b=STOPS[i+1],x0=gx(a.lon),y0=gy(a.lat),x1=gx(b.lon),y1=gy(b.lat),n=Math.ceil(Math.hypot(x1-x0,y1-y0));
    c.fillStyle=i<C.prog?'#f2c14e':'#f3e7cf66';
    for(let k=1;k<n;k+=2){const x=Math.round(x0+(x1-x0)*k/n),y=Math.round(y0+(y1-y0)*k/n);c.fillRect(x*MS,y*MS,MS,MS)}
  }
  c.font='12px Silkscreen, monospace';c.fillStyle='#f3e7cfcc';
  c.fillText('BRASIL',gx(-54.9)*MS,gy(-30.35)*MS);
  c.fillText('ARGENTINA',gx(-58.85)*MS,gy(-29.95)*MS);
  c.fillText('Río de la Plata',gx(-58.6)*MS,gy(-35.2)*MS);
  c.fillText('Atlántico',gx(-54.3)*MS,gy(-35.3)*MS);
}
function stopState(i){return C.won[STOPS[i].id]?'done':i<=C.prog?'open':'lock'}
function renderMapa(){
  drawMap();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{if(pantalla==='mapa')drawMap()});
  $('pins').innerHTML=STOPS.map((s,i)=>{const stt=stopState(i);
    return `<button class="pin ${stt} ${i===selStop?'sel':''}" style="left:${gx(s.lon)/GW*100}%;top:${gy(s.lat)/GH*100}%" data-stop="${i}" aria-label="${s.lugar}${stt==='lock'?', bloqueada':''}">${s.final?'★':i+1}</button>`}).join('');
  const s=STOPS[selStop],stt=stopState(selStop);
  const tag=stt==='done'?'<span class="tag">Ganada</span>':stt==='lock'?'<span class="tag lock">Bloqueada</span>':s.final?'<span class="tag final">La final</span>':'<span class="tag">Abierta</span>';
  const can=stt!=='lock'&&C.plata>=s.min;
  const why=stt==='lock'?'Ganale primero a '+STOPS[selStop-1].rival+'.':C.plata<s.min?'Necesitás al menos $'+s.min+' para sentarte.':'';
  $('parada').innerHTML=`<div class="head"><img src="${sprite(s.spr,6)}" alt="${s.rival}"><div><h2>${s.rival}</h2><div class="lugar">${s.lugar} · ${s.sitio}</div></div></div>
    ${tag}<p>${s.desc}</p>
    <dl class="datos"><dt>Apuesta mínima</dt><dd>$${s.min}</dd><dt>Premio la primera vez</dt><dd>$${s.premio}</dd><dt>Tu pinta le da</dt><dd>${['mucho cagazo','bastante cagazo','algo de cagazo','poco cagazo'][Math.min(3,Math.round((s.ai.aguante||0)*7.5))]}</dd><dt>Partida</dt><dd>${s.final?'Al mejor de 3, juegos a 15':s.duo?'De a cuatro, con el Tío Pocholo, a 30':'Truco uruguayo a 30'}</dd></dl>
    ${why?`<p style="color:var(--crema-2)">${why}</p>`:''}
    <div class="botones"><button class="btn hot" data-a="jugarStop" ${can?'':'disabled'}>Sentarse a jugar</button><button class="btn ghost" data-a="rapida">Partida rápida</button>${C.plata<STOPS[0].min?`<button class="btn" data-a="changa" ${C.changaLock?'disabled title="Jugá una partida para conseguir otra changa"':''}>${C.changaLock?'Changa: jugá una partida antes':'Hacer una changa'}</button>`:''}</div>`;
}
function betModal(){
  const s=STOPS[selStop],max=Math.min(C.plata,s.min*4);
  MATCH.tmpBet=Math.min(max,Math.max(s.min,MATCH.tmpBet&&MATCH.tmpStop===selStop?MATCH.tmpBet:s.min));MATCH.tmpStop=selStop;
  const b=MATCH.tmpBet;
  modal(`<h2>¿Cuánto apostás?</h2><p>${s.rival} pone lo mismo que vos. Si ganás, te llevás el doble${!C.won[s.id]?' y $'+s.premio+' de premio':''}. Si perdés, perdés lo apostado.</p>
   <div class="apuesta"><button class="btn" data-a="betMenos" aria-label="Bajar apuesta">−</button><span class="monto">$${b}</span><button class="btn" data-a="betMas" aria-label="Subir apuesta">+</button></div>
   <div class="chips"><button class="btn ghost" style="color:var(--borde);border-color:var(--borde)" data-a="betMin">Mínimo $${s.min}</button><button class="btn ghost" style="color:var(--borde);border-color:var(--borde)" data-a="betMax">Máximo $${max}</button></div>
   <p style="font-size:18px">Tenés $${C.plata}. Te quedarían $${C.plata-b}.</p>
   <div class="botones"><button class="btn ghost" style="color:var(--borde);border-color:var(--borde)" data-a="cerrar">Mejor no</button><button class="btn hot" data-a="betOk">Apostar $${b}</button></div>`);
}
