/* Truco Oriental · almacén, ombú, inicio y changas
   Pantallas fuera de la mesa. */
/* ---------- almacén de Don Tito ---------- */
let tiendaTab='mates',tapsInicio=[];
function renderTienda(){
  const sellBtn=(k,id,it)=>{
    const eq=C.eq[k]===id;
    if(it.price===null) return '<span class="stat">Trofeo: no se vende</span>';
    if(!it.price) return '<span class="stat">No vale un peso</span>';
    return `<button class="btn ghost" data-sell="${k}:${id}" ${eq?'disabled title="No podés vender lo que estás usando"':''}>Vender $${it.price/2}</button>`;
  };
  const card=(k,id,it)=>{
    const owned=(k==='mate'?C.mates:C.termos).includes(id),eq=C.eq[k]===id;
    let acts='';
    if(eq) acts='<span class="enuso">En uso</span>'+sellBtn(k,id,it);
    else if(owned) acts=`<button class="btn blue" data-equip="${k}:${id}">Usar</button>`+sellBtn(k,id,it);
    else if(it.price===null) acts='<span class="stat">Se gana en la final</span>';
    else acts=`<button class="btn hot" data-buy="${k}:${id}" ${C.plata>=it.price?'':'disabled'}>Comprar $${it.price}</button>`;
    const stat=k==='mate'?(it.lav>=99?'Nunca se lava':'Se lava tras '+it.lav+' manos con mañas'):'Guarda '+it.cap+' cebadas';
    return `<div class="item ${eq?'eq':''} ${owned?'':'nuevo'}"><div class="top"><img src="${sprite(it.spr,4)}" alt=""><div><div class="n">${it.n}</div><div class="stat">${stat}</div>${owned&&!eq?'<div class="stat">Lo tenés</div>':''}</div></div><div class="hab">${it.hab}</div><div class="acts">${acts}</div></div>`;
  };
  const desp=it=>{
    const n=C.despensa[it.id]||0;
    return `<div class="item"><div class="top"><img src="${sprite(it.spr,4)}" alt=""><div><div class="n">${it.n}</div><div class="stat">En la despensa: ${n}</div></div></div><div class="hab">${it.d}</div><div class="acts"><button class="btn hot" data-desp="${it.id}" ${C.plata>=it.price?'':'disabled'}>Comprar $${it.price}</button></div></div>`;
  };
  const tabs=[['mates','Mates'],['termos','Termos'],['pilchas','Pilchas'],['despensa','Despensa']];
  let body='';
  if(tiendaTab==='mates') body=Object.entries(MATES).filter(([id,it])=>it.price!==null||C.mates.includes(id)).map(([id,it])=>card('mate',id,it)).join('');
  if(tiendaTab==='termos') body=Object.entries(TERMOS).map(([id,it])=>card('termo',id,it)).join('');
  if(tiendaTab==='despensa') body=DESPENSA.map(desp).join('');
  if(tiendaTab==='pilchas') body=Object.entries(PILCHAS).map(([id,it])=>{
    const own=C.pilchas.includes(id),on=C.eqp[it.slot]===id,slotN=SLOTS.find(s=>s[0]===it.slot)[1];
    let acts;
    if(on) acts=`<span class="enuso">Puesta</span><button class="btn ghost" data-quitar="${it.slot}">Sacársela</button>`;
    else if(own) acts=`<button class="btn blue" data-poner="${id}">Ponérsela</button><button class="btn ghost" data-sellp="${id}">Vender $${it.price/2}</button>`;
    else acts=`<button class="btn hot" data-buyp="${id}" ${C.plata>=it.price?'':'disabled'}>Comprar $${it.price}</button>`;
    return `<div class="item ${on?'eq':''} ${own?'':'nuevo'}"><div class="top"><div><div class="n">${it.n}</div><div class="stat">${slotN} · pinta +${it.pinta}</div>${own&&!on?'<div class="stat">La tenés</div>':''}</div></div><div class="hab">${it.d}</div><div class="acts">${acts}</div></div>`;}).join('');
  const charla={mates:'El mate define cómo cargás las cebadas y cuándo se te lava. Lo que no uses, te lo compro a la mitad.',termos:'El termo es cuántas cebadas guardás. Uno bueno te dura toda la gira.',despensa:'Lo de la despensa se gasta solo en la próxima partida que juegues: una unidad de cada cosa que tengas.',pilchas:'Con buena pinta gaucha el rival te agarra cagazo: te quiere menos los envidos y los trucos. Una pilcha por lugar.'}[tiendaTab];
  $('tienda').innerHTML=`<div class="mostrador"><img src="${sprite('tito',6)}" alt="Don Tito"><div><div class="n">Don Tito</div><div class="bubble">${C.eq.mate==='pava'&&tiendaTab==='termos'?'Con la pava no precisás termo, campeón.':charla}</div></div></div>
   <div class="tabs" role="tablist">${tabs.map(([k,t])=>`<button class="tab ${tiendaTab===k?'on':''}" role="tab" aria-selected="${tiendaTab===k}" data-tab="${k}">${t}</button>`).join('')}</div>
   ${tiendaTab==='pilchas'?`<div class="vestidor"><img src="${figura(C.eqp,6)}" alt="Tu gaucho"><div><div class="n">Tu pinta: ${pinta()} de 10</div><div class="barra">${barra(pinta())}</div><div class="stat">${SLOTS.map(([k,n])=>n+': '+(C.eqp[k]?PILCHAS[C.eqp[k]].n:'nada')).join(' · ')}</div></div></div>`:''}
   <div class="estante">${body}</div>`;
}
function barra(v){return Array.from({length:10},(_,i)=>`<span class="${i<v?'on':''}"></span>`).join('')}

/* ---------- árbol de habilidades: el ombú ---------- */
let habSel=null;
function renderHab(){
  if(!habSel||!NODES.find(n=>n.id===habSel)) habSel=(NODES.find(n=>nodeState(n)==='open')||NODES[0]).id;
  const pins=NODES.map(nd=>{const p=nodePos(nd),st=nodeState(nd),col=nd.id==='raiz'?'#f3e7cf':nd.rama&&nd.rama!=='combo'?RAMAS[nd.rama].col:'#c58cf0';
    const ico=nd.id==='raiz'?sprite(eqMate().spr,2):iconImg(nd.rama);
    return `<button class="bola ${st} ${habSel===nd.id?'sel':''} ${nd.rama==='combo'?'combo':''}" style="left:${p.x/10}%;top:${p.y/6.8}%;--c:${col}" data-hsel="${nd.id}" aria-label="${nd.n}${st==='own'?', aprendida':st==='lock'?', bloqueada':', disponible'}"><img src="${ico}" alt="">${st==='open'?`<span class="costo">${nd.cost}</span>`:''}</button>`}).join('');
  const labels=Object.entries(RAMAS).map(([k,r])=>{const last=NODES.filter(n=>n.rama===k).pop(),p=nodePos(last),a=r.ang*Math.PI/180;
    let x=p.x+Math.cos(a)*95,y=p.y-Math.sin(a)*60;if(k==='manos'){x=p.x+110;y=p.y}x=Math.max(70,Math.min(930,x));y=Math.max(18,Math.min(660,y));return `<span class="rama-lbl" style="left:${x/10}%;top:${y/6.8}%;color:${r.col}">${r.n}</span>`}).join('');
  const nd=NODES.find(n=>n.id===habSel),st=nodeState(nd);
  const ramaTxt=nd.rama==='combo'?'Junta dos ramas':nd.rama?RAMAS[nd.rama].n+' · '+RAMAS[nd.rama].sub:'La raíz';
  const reqs=nd.req.filter(r=>r!=='raiz').map(r=>{const q=NODES.find(n=>n.id===r);return `<li class="${hasHab(r)?'ok':''}">${hasHab(r)?'✓':'·'} ${q.n}</li>`}).join('');
  let btn;
  if(st==='own') btn=`<span class="enuso">${nd.base?'La tenés de entrada':'Aprendida'}</span>`;
  else if(st==='open') btn=`<button class="btn hot" data-learn="${nd.id}" ${C.pm>=nd.cost?'':'disabled'}>Aprender por ${nd.cost} ${nd.cost===1?'punto':'puntos'}</button>${C.pm<nd.cost?'<div class="stat">Te faltan '+(nd.cost-C.pm)+' puntos de mesa.</div>':''}`;
  else btn=`<span class="stat">Bloqueada: primero aprendé lo que necesita.</span>`;
  $('arbol').innerHTML=`<div class="arbol-head"><div><h2>El ombú</h2><p>Tus habilidades crecen como las ramas del ombú. Tocá una bolita para ver qué hace. Algunas necesitan dos ramas a la vez. Se aprenden con puntos de mesa: 1 por partida ganada, 2 más la primera vez contra cada rival y 3 más por la final.</p></div><div class="pm"><span>Puntos de mesa</span><b>${C.pm}</b></div></div>
   <div class="hab-wrap"><div class="ombu-scroll"><div class="ombu"><canvas id="ombuCv" width="250" height="170" aria-hidden="true"></canvas>${labels}${pins}</div></div>
   <div class="hab-panel"><img src="${nd.id==='raiz'?sprite(eqMate().spr,4):iconImg(nd.rama)}" alt=""><div class="rama-t2">${ramaTxt}</div><h3>${nd.n}</h3><p>${nd.d}</p>${reqs?'<div class="stat">Necesita:</div><ul class="reqs">'+reqs+'</ul>':''}${btn}</div></div>`;
  drawOmbu();
}
function drawOmbu(){
  const cv=$('ombuCv'),x=cv&&cv.getContext&&cv.getContext('2d'); if(!x||!x.fillRect) return;
  const S=4,P=nd=>{const p=nodePos(nd);return {x:p.x/S,y:p.y/S}},px=(X,Y,c)=>{x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),1,1)};
  const hash=(a,b)=>(((a*73856093)^(b*19349663))>>>0)%100;
  x.fillStyle='#120c08';x.fillRect(0,0,250,170);
  for(let i=0;i<70;i++){const X=hash(i,7)*2.5,Y=hash(i,13)*1.1;px(X,Y,hash(i,3)<30?'#f3e7cf':'#6d6355')}
  x.fillStyle='#1f2a14';x.fillRect(0,146,250,24);
  for(let X=0;X<250;X+=2){const h=hash(X,5)%4;x.fillStyle=h?'#2f4a1c':'#4a6b2a';x.fillRect(X,146-h%3,1,h%3+1)}
  const blob=(cx,cy,r,c1,c2)=>{for(let Y=-r;Y<=r;Y++)for(let X=-r;X<=r;X++){const d=X*X+Y*Y;if(d<=r*r){px(cx+X,cy+Y,(d>r*r*0.6&&(X+Y)%2===0)?c2:c1)}}};
  NODES.forEach(nd=>{if(nd.id==='raiz')return;const p=P(nd);blob(p.x,p.y,11,'#17250f','#120c08')});
  NODES.forEach(nd=>{if(nd.id==='raiz'||!hasHab(nd.id))return;const p=P(nd);blob(p.x,p.y,10,'#2f5a1e','#244816');
    for(let i=0;i<14;i++){const a=hash(i,nd.k*31+i)*0.0628,r=4+hash(i+5,nd.id.length)%7;px(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,hash(i,2)<50?'#5f8e34':'#7fae48')}});
  const fork={x:125,y:114};
  const branch=(a,b,w,own)=>{const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),cx=mx-dy/len*len*0.12,cy=my+dx/len*len*0.12*0.4;
    const n=Math.ceil(len*2);for(let i=0;i<=n;i++){const t=i/n,X=(1-t)*(1-t)*a.x+2*(1-t)*t*cx+t*t*b.x,Y=(1-t)*(1-t)*a.y+2*(1-t)*t*cy+t*t*b.y,ww=w*(1-t*0.35);
      x.fillStyle=own?'#8a5a35':'#3b2615';x.fillRect(Math.round(X-ww/2),Math.round(Y-ww/2),Math.max(1,Math.round(ww)),Math.max(1,Math.round(ww)));
      if(own&&i%3===0){x.fillStyle='#b07a3c';x.fillRect(Math.round(X-ww/2),Math.round(Y-ww/2),1,1)}}};
  NODES.forEach(nd=>{if(nd.id==='raiz')return;nd.req.forEach(r=>{const q=NODES.find(n=>n.id===r);const a=r==='raiz'?fork:P(q);
    const w=r==='raiz'?5:nd.rama==='combo'?2:Math.max(2,4-(nd.k||0)*0.7);branch(a,P(nd),w,hasHab(r)&&hasHab(nd.id))})});
  for(let Y=110;Y<=150;Y++){const w=8+(Y-110)*0.22;for(let X=-w/2;X<=w/2;X++){const edge=Math.abs(X)>w/2-1.5;px(125+X,Y,edge?'#3b2615':(hash(Math.round(X),Y)<18?'#5c3a20':'#7a4f22'))}}
  [[-1,0.5],[1,0.6],[-1,1.4],[1,1.2]].forEach(([s,k])=>{for(let i=0;i<22;i++){const X=125+s*(6+i*k),Y=150+i*0.5+Math.sin(i/3)*1.2;x.fillStyle='#3b2615';x.fillRect(Math.round(X),Math.round(Y),2,1)}});
}

/* ---------- inicio ---------- */
function renderInicio(){
  const next=STOPS.find((s,i)=>stopState(i)==='open');
  const ganadas=STOPS.filter(s=>C.won[s.id]).length;
  const m=eqMate(),t=eqTermo();
  const desp=DESPENSA.filter(d=>C.despensa[d.id]).map(d=>d.n+' ×'+C.despensa[d.id]).join(', ');
  $('inicio').innerHTML=`<div class="portada">
     <canvas id="portada" width="320" height="150" aria-hidden="true"></canvas>
     <h2 class="logo">Truco <span>Oriental</span></h2>
     <p class="lema">Truco uruguayo de boliche en boliche, con mate, mañas y un porteño esperando en Colonia.</p>
   </div>
   <div class="inicio-grid">
     <div class="menu">
       <button class="opcion destacada" data-a="irMapa"><b>${ganadas?'Seguir la gira':'Empezar la gira'}</b><span>${next?'Próxima parada: '+next.lugar+', contra '+next.rival:'Ya sos campeón. Podés volver a cualquier mesa.'}</span></button>
       <button class="opcion" data-a="irTienda"><b>Almacén de Don Tito</b><span>Mates, termos y la despensa. También compra lo que no usás.</span></button>
       <button class="opcion" data-a="irHab"><b>Habilidades</b><span>${C.pm} ${C.pm===1?'punto':'puntos'} de mesa para gastar en chicanas, paquetes y mañas.</span></button>
       <button class="opcion" data-a="rapida"><b>Partida rápida</b><span>Una de práctica contra Don Rubén, sin apostar.</span></button>
       <button class="opcion" data-a="comoJugar"><b>Cómo se juega</b><span>Muestra, piezas, flor, envido y truco en un minuto.</span></button>
     </div>
     <div class="tumesa">
       <div class="n">Tu mesa</div>
       <div class="imgs">${C.eq.mate==='pava'?`<img src="${sprite('pava',5)}" alt="${m.n}">`:`<img src="${sprite(m.spr,5)}" alt="${m.n}"><img src="${sprite(t.spr,5)}" alt="${t.n}">`}</div>
       <div class="stat">${m.n}${C.eq.mate==='pava'?'':' · '+t.n}</div>
       <div class="vest-mini"><img src="${figura(C.eqp,4)}" alt="Tu gaucho"><div><div class="stat">Pinta gaucha</div><div class="barra">${barra(pinta())}</div></div></div>
       <dl class="datos"><dt>Plata</dt><dd>$${C.plata}</dd><dt>Puntos de mesa</dt><dd>${C.pm}</dd><dt>Paradas ganadas</dt><dd>${ganadas} de ${STOPS.length}</dd><dt>Despensa</dt><dd>${desp||'Vacía'}</dd></dl>
       <div class="gira">${STOPS.map((s,i)=>`<span class="${stopState(i)}" title="${s.lugar}">${s.final?'★':i+1}</span>`).join('')}</div>
     </div>
   </div>`;
  const cv=$('portada'),x=cv.getContext&&cv.getContext('2d');
  if(x&&x.drawImage){
    x.imageSmoothingEnabled=false;
    const draw=(src,dx,dy,w,h)=>{const im=new Image();im.onload=()=>x.drawImage(im,dx,dy,w,h);im.src=src};
    const cs=[{num:1,suit:'espada',id:'1espada'},{num:1,suit:'basto',id:'1basto'},{num:7,suit:'espada',id:'7espada'},{num:7,suit:'oro',id:'7oro'}];
    cs.forEach((c,i)=>draw(cardImg(c),100+i*44,15,80,120));
    draw(sprite(m.spr,6),4,38,96,96);
  }
  if(!C.intro){C.intro=true;saveC();modal(`<h2>La gira del truco</h2><p>Arrancás con $500, un mate de plástico con la yerba mal armada y un termo que gotea.</p><p>Recorré el país de boliche en boliche, apostando tu propia plata. Con lo que ganes, comprá mejores mates y termos en el almacén, y aprendé habilidades con los puntos de mesa. En Colonia te espera el porteño.</p><div class="botones"><button class="btn hot" data-a="cerrar">Dale, vamos</button></div>`)}
}
function comoJugar(){
  modal(`<h2>Cómo se juega</h2>
   <p>Truco uruguayo: tres cartas cada uno, se juegan tres manos (primera, segunda y tercera) y gana quien gane dos. Se juega a 30, en malas y buenas.</p>
   <p><b>La muestra manda.</b> El 2, 4, 5, 11 y 10 de su palo son piezas y le ganan a todo. Si la muestra es pieza, el 12 toma su lugar.</p>
   <p>Después vienen el 1 de espadas, el 1 de bastos, el 7 de espadas, el 7 de oros, los 3, los 2, los 1 falsos, 12, 11, 10, 7 falsos, 6, 5 y 4.</p>
   <p><b>Envido:</b> dos cartas del mismo palo más 20, o pieza más la carta más alta. <b>Flor:</b> tres del mismo palo o piezas que las completen; se canta antes de tu primera carta y anula el envido.</p>
   <p><b>Truco, retruco y vale cuatro</b> suben lo que vale la mano. Si no querés, el otro se lleva lo que valía antes.</p>
   <div class="botones"><button class="btn hot" data-a="cerrar">Entendido</button></div>`);
}

/* ---------- changas ---------- */
const CHANGAS=[
  {t:'Le cortaste el pasto a la vecina de enfrente y de paso le arreglaste la canilla.',min:100,max:160},
  {t:'Cuidaste coches afuera del Centenario en un clásico. Volviste afónico.',min:100,max:180},
  {t:'Le hiciste la mudanza a un primo que vive en un cuarto piso sin ascensor.',min:200,max:250},
  {t:'Vendiste tortas fritas en la rambla un día de lluvia. Se te fueron todas.',min:120,max:200},
  {t:'Paseaste seis perros en Pocitos. Uno se te escapó atrás de una paloma.',min:100,max:170},
  {t:'Ayudaste a armar los puestos de la feria de Tristán Narvaja a las seis de la mañana.',min:130,max:210},
  {t:'Pintaste la reja del club de barrio. Quedó medio despareja, pero pagaron igual.',min:150,max:230},
  {t:'Atendiste la cantina del club en un baile. Chorizos al pan sin parar.',min:140,max:220},
  {t:'Cargaste cajones de fruta en el Mercado Modelo. Te dieron unas mandarinas de yapa.',min:160,max:250},
  {t:'Tocaste el chico en una llamada de práctica. El director te dijo que vuelvas.',min:100,max:150},
  {t:'Ayudaste a armar el escenario de un tablado. Te colaste a ver la primera murga.',min:180,max:250},
  {t:'Le arreglaste la bici a un gurí del barrio y le cambiaste la cadena.',min:100,max:140},
  {t:'Hiciste de DJ en un cumple de quince. Pusiste cumbia hasta las cinco.',min:170,max:250},
  {t:'Le limpiaste el patio a la abuela de un amigo. Te mandó con un táper de tallarines.',min:100,max:160},
  {t:'Repartiste volantes de una pizzería en 18 de Julio. Te dieron una muzzarella.',min:100,max:150},
  {t:'Ayudaste a un vecino a carnear para el asado del sábado. Quedaste invitado.',min:150,max:240}
];
let lastChanga=-1;
function hacerChanga(){
  if(C.changaLock){modal('<h2>Ya hiciste una changa</h2><p>Para conseguir otra, jugá una partida, aunque sea una rápida. Nadie te da laburo dos veces seguidas.</p><div class="botones"><button class="btn hot" data-a="cerrar">Ta</button></div>');return}
  C.changaLock=true;
  let i;do{i=Math.floor(Math.random()*CHANGAS.length)}while(i===lastChanga);lastChanga=i;
  const c=CHANGAS[i],monto=Math.round((c.min+Math.random()*(c.max-c.min))/10)*10;
  C.plata+=monto;saveC();updPlata();sfx('mate');
  modal(`<h2>Changa hecha</h2><p>${c.t}</p><p>Te ganaste <b>$${monto}</b>.</p><div class="botones"><button class="btn hot" data-a="cerrar">Ta</button></div>`);
  renderMapa();
}
