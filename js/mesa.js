/* Truco Oriental · mesa
   Dibujo de la partida: cartas, bazas, avisos y botones. */
/* ---------- dibujo de la partida ---------- */
function sticksSVG(n){
  const box=(k,ox)=>{
    const L=[[2,2,16,2],[16,2,16,16],[16,16,2,16],[2,16,2,2],[2,2,16,16]];
    let s='';for(let i=0;i<k;i++){const l=L[i];s+=`<line x1="${l[0]+ox}" y1="${l[1]}" x2="${l[2]+ox}" y2="${l[3]}" stroke="#f3e7cf" stroke-width="2.2" stroke-linecap="square"/><rect x="${l[2]+ox-1.5}" y="${l[3]-1.5}" width="3" height="3" fill="#e0533d"/>`}
    return s+(k===0?`<rect x="${2+ox}" y="2" width="14" height="14" fill="none" stroke="#f3e7cf33" stroke-dasharray="2 2"/>`:'');
  };
  let s='';for(let i=0;i<3;i++)s+=box(Math.max(0,Math.min(5,n-i*5)),i*20);
  return `<svg width="62" height="19" viewBox="0 0 62 19" aria-hidden="true">${s}</svg>`;
}
function sideHTML(x){
  const n=G.score[x];
  const rows=G.target>15?`<div>malas ${sticksSVG(Math.min(15,n))}</div><div>buenas ${sticksSVG(Math.max(0,n-15))}</div>`:`<div>a 15 ${sticksSVG(n)}</div>`;
  return `<div class="side ${x==='p'?'me':''}"><div><div class="who">${teamName(x)}</div><div class="pts">${n}</div></div><div class="sticks">${rows}</div></div>`;
}
function cardHTML(c,opts={}){
  const pz=c&&isPieza(c,H.m);
  const st=opts.anim?` style="animation:${opts.anim[0]} ${opts.anim[2]||.45}s ease-out both;animation-delay:${opts.anim[1].toFixed(3)}s"`:'';
  const show=ayudas.checked&&pz&&opts.badge;
  const cls=['card',opts.mini?'mini':'',opts.play?'play':'',opts.pick?'pick':''].join(' ');
  const tag=opts.play||opts.pick?'button':'div';
  const label=c?cardName(c)+(pz?', pieza':''):'carta tapada';
  return `<${tag} class="${cls}"${st} ${opts.idx!==undefined?`data-card="${opts.idx}"`:''} aria-label="${label}"><img src="${cardImg(c)}" alt="${label}">${show?'<span class="badge">pieza</span>':''}</${tag}>`;
}
function statusText(){
  if(G.over) return G.score.p>=G.target?'<b>¡Ganaron el juego!</b>'.replace('Ganaron',two()?'Ganaron':'Ganaste'):'<b>'+teamName('c')+(two()?' ganaron':' ganó')+' el juego.</b>';
  if(H.dealPrompt) return '<b>Te toca repartir.</b> Repartí normal o armá el paquete.';
  if(H.ended) return 'Mano terminada. Mirá las cartas…';
  if(Date.now()<H.dealUntil) return (H.dealer==='p'?'Estás repartiendo…':nm(H.dealer)+' reparte…');
  if(H.busy) return 'A ver quién la gana…';
  if(H.toAct!=='p') return nm(H.toAct)+(H.pending&&H.toAct==='q'?' responde por el equipo…':' está pensando…')+(!H.pending&&canEnvido('p')?' Si querés, cantá envido.':'');
  if(H.feriaPick) return '<b>Elegí</b> la carta que llevás a la feria.';
  if(mustFlor('p')) return '<b>Tenés flor:</b> cantala antes de jugar.';
  if(H.pending&&H.pending.type==='truco') return 'Les cantaron <b>'+TRUCO_N[H.pending.level].toLowerCase()+'</b>. ¿Querés?'.replace('Les',two()?'Les':'Te');
  if(H.pending&&H.pending.type==='envido') return (two()?'Les':'Te')+' cantaron <b>'+H.pending.chain.map(k=>({envido:'envido',real:'real envido',falta:'falta envido'})[k]).join(' + ')+'</b>. ¿Querés?';
  return '<b>Tu turno:</b> jugá una carta o cantá.';
}
function actionsHTML(){
  const B=(a,t,cls='',dis=false)=>`<button class="btn ${cls}" data-a="${a}" ${dis?'disabled':''}>${t}</button>`;
  if(G.over||H.ended||H.busy||Date.now()<H.dealUntil) return '';
  if(H.toAct!=='p'){
    if(!H.pending&&canEnvido('p')) return B('env-envido','Envido')+B('env-real','Real envido')+B('env-falta','Falta envido');
    return '';
  }
  if(H.feriaPick) return B('cancelFeria','Cancelar feria','ghost');
  if(mustFlor('p')) return B('flor','¡Flor!','hot');
  let s='';
  const chicBtn=()=>{const f=G.chic.need-G.chic.charge;return H.chicUsed?'':B('chicana',chicReady()?'Chicana':'Chicana (faltan '+f+')',chicReady()?'blue':'ghost',!chicReady())};
  if(H.pending){
    s+=B('quiero','Quiero','blue')+B('noquiero','No quiero','red');
    if(H.pending.type==='envido'){
      const r=envRaises();
      if(r.includes('real')) s+=B('env-real','Real envido');
      if(r.includes('falta')) s+=B('env-falta','Falta envido');
    } else {
      if(canRaiseTruco()) s+=B('truco',TRUCO_N[H.pending.level+1]+'!','hot');
      if(canEnvidoResp('p')) s+=B('env-envido','Envido')+B('env-real','Real envido')+B('env-falta','Falta envido');
    }
    return s+chicBtn();
  }
  if(canEnvido('p')) s+=B('env-envido','Envido')+B('env-real','Real envido')+B('env-falta','Falta envido');
  else if(G.rules==='uy'&&H.b===0&&!played(0,'p')&&H.florDone) s+='<button class="btn ghost" disabled title="Con flor no se juega el envido">Envido (hubo flor)</button>';
  if(canTruco('p')) s+=B('truco',TRUCO_N[H.truco.value+1]+'!','hot');
  s+=B('mazo','Irse al mazo','ghost')+chicBtn();
  return s;
}
function toastHTML(t){
  if(!t) return '';
  const vs=t.vs?`<div class="vs"><div>${teamName('p')}<b>${t.vs[0]}</b></div><div>${teamName('c')}<b>${t.vs[1]}</b></div></div>`:'';
  return `<div class="anuncio" data-a="cerrarAnuncio" role="status"><div class="t">${t.t}</div>${vs}<div class="g">${t.g}</div></div>`;
}
function sprOf(x){const st=MATCH.stop;return x==='c'?st.spr:x==='q'?st.duo.sprP:st.duo.sprR2}
const POS_ANIM={top:'repC',left:'repL',right:'repR'};
function dealDelay(x,i,el){const n=G.seats.length,k=(G.seats.indexOf(x)-G.seats.indexOf(H.dealer)-1+n)%n;return (i*n+k)*0.15-el}
function seatHTML(x,pos,el,dealing){
  if(!x) return '';
  const sub=TEAM(x)==='c'?(two()?(G.mano===x?'es mano':H.dealer===x?'reparte':'rival'):G.energy.c+' cebadas · '+(G.mano===x?'es mano':'es pie')):'Tu compañero'+(G.mano===x?' · es mano':'')+(voz()==='q'&&x==='q'?' · es pie, canta él':'');
  const cards=H.hand[x].map((c,i)=>{const face=H.ended||(H.peek||[]).some(p=>p.s===x&&p.i===i);return cardHTML(face?c:null,Object.assign({mini:pos!=='top'||two()},dealing?{anim:[POS_ANIM[pos],dealDelay(x,i,el)]}:{}))}).join('');
  const hc=pos==='top'?(two()?'mini':''):'mini vert';
  return `<div class="seat-id"><img src="${sprite(sprOf(x),pos==='top'?4:3)}" alt="${nm(x)}"><div><div class="name">${nm(x)}</div><div class="sub">${sub}</div></div></div>
   ${TEAM(x)==='c'&&(x==='c')?`<div class="cagazo" title="Cuánto cagazo te tiene: acepta menos tus cantos"><span class="lbl">Cagazo</span><div class="barra">${barra(cagazo())}</div></div>`:''}<div class="bubble">${H.say[x]||''}</div><div class="hand ${hc}">${cards}</div>`;
}
function serieInfo(){return MATCH.serie?MATCH.serie.res.concat(Array(3-MATCH.serie.res.length).fill(null)).map((r,i)=>`<span class="${r==='p'?'w':r==='c'?'l':''} ${i===MATCH.serie.idx?'now':''}">${['Uruguayo','Argentino','Desempate'][i]}</span>`).join(''):''}
function render(){
  if(!G) return;
  const m=eqMate(),t=eqTermo(),cp=cap(),now=Date.now(),el=(now-H.dealStart)/1000,dealing=now<H.dealUntil;
  $('matchInfo').innerHTML=`<b>${MATCH.stop.lugar}</b> · ${MATCH.stop.sitio}${MATCH.bet?' · Apuesta <b>$'+MATCH.bet+'</b>':''}${G.rules==='ar'?' · <b>Truco argentino</b>':''}${two()?' · <b>De a cuatro</b>':''}`;
  $('serie').innerHTML=serieInfo();
  $('score').innerHTML=sideHTML('p')+sideHTML('c');
  const dos=two();
  $('mesa').classList.toggle('cuatro',dos);
  $('seatTop').innerHTML=seatHTML(dos?'q':'c','top',el,dealing);
  $('seatLeft').innerHTML=dos?seatHTML('c','left',el,dealing):''; $('seatRight').innerHTML=dos?seatHTML('d','right',el,dealing):'';
  $('seatLeft').hidden=!dos; $('seatRight').hidden=!dos;
  $('bubbleP').textContent=H.say.p?'Vos: '+H.say.p:'';
  const myTurn=!H.ended&&!H.busy&&!dealing&&H.toAct==='p'&&!H.pending&&!mustFlor('p');
  $('handP').innerHTML=H.hand.p.map((c,i)=>cardHTML(c,Object.assign({idx:i,badge:true,play:myTurn&&!H.feriaPick,pick:H.feriaPick},dealing?{anim:['repP',dealDelay('p',i,el)]}:{}))).join('');
  const uy=G.rules==='uy';
  $('muestraBox').hidden=!uy||dos; $('centro').style.gridTemplateColumns=uy&&!dos?'':'1fr';
  const muAnim=dealing?{anim:['flip',G.seats.length*3*0.15+0.1-el,.4]}:{};
  if(uy&&!dos) $('muestra').innerHTML=cardHTML(H.m,muAnim);
  const an=(i,x,k)=>{const t0=H.playedAt[i+x];return t0&&now-t0<450?{anim:[k,-(now-t0)/1000,.4]}:{}};
  const chipOf=(r,i)=>r?`<span class="res ${r==='p'?'w':r==='c'?'l':''}">${r==='p'?(dos?'Ganaron':'Ganaste'):r==='c'?(dos?'Perdieron':'Perdiste'):'Parda'}</span>`:`<span class="lbl">${['Primera','Segunda','Tercera'][i]}</span>`;
  if(!dos){
    $('bazas').innerHTML=[0,1,2].map(i=>{
      const tb=H.table[i],chip=chipOf(H.results[i],i);
      const slot=(x,k)=>tb[x]?cardHTML(tb[x],an(i,x,k)):'<div class="slot"></div>';
      return `<div class="baza ${i===H.b&&!H.ended?'now':''}">${slot('c','tirC')}${chip}${slot('p','tirP')}</div>`;
    }).join('');
  } else {
    const i=H.b,tb=H.table[i];
    const slot=(x,k)=>tb[x]?cardHTML(tb[x],an(i,x,k)):'<div class="slot"></div>';
    const mu=uy?`<div class="lbl">Muestra</div>${cardHTML(H.m,muAnim)}`:'';
    const truco=H.truco.value>1?`<span class="evento">${TRUCO_N[H.truco.value]}</span>`:'';
    const cruz=`<div class="cruz"><div class="c-tl">${mu}</div><div class="c-t">${slot('q','tirC')}</div><div class="c-tr">${truco}</div><div class="c-l">${slot('c','tirL')}</div><div class="c-m">${chipOf(H.results[i],i)}</div><div class="c-r">${slot('d','tirR')}</div><div class="c-bl"></div><div class="c-b">${slot('p','tirP')}</div><div class="c-br"></div></div>`;
    const tiny=(j,x)=>H.table[j][x]?cardHTML(H.table[j][x],{mini:true}):'<div class="slot"></div>';
    const prev=[];for(let j=0;j<i;j++)prev.push(`<div class="prev-b"><div class="minicruz"><div class="m-t">${tiny(j,'q')}</div><div class="m-l">${tiny(j,'c')}</div><div class="m-r">${tiny(j,'d')}</div><div class="m-b">${tiny(j,'p')}</div></div>${chipOf(H.results[j],j)}</div>`);
    $('bazas').innerHTML=`<div class="centro4">${cruz}<div class="prev">${prev.length?'<div class="lbl">Manos anteriores</div>'+prev.join(''):'<div class="lbl">Se juega la '+['primera','segunda','tercera'][i]+'</div>'}</div></div>`;
  }
  $('anuncio').innerHTML=toastHTML(H.toast);
  if(H.dealPrompt){
    const left=Math.max(0,Math.ceil((H.dealAuto-now)/1000)),ok=paqReady(),falta=G.paq.need-G.paq.charge;
    $('reparto').innerHTML=`<div class="reparto"><div class="t">Te toca repartir</div><div class="botones"><button class="btn hot" data-a="repartir">Repartir</button><button class="btn ${ok?'blue':''}" data-a="paquete" ${ok?'':'disabled'}>Armar paquete</button></div><div class="g">${ok?'El paquete está listo: te das buenas cartas.':'Armar paquete: faltan '+falta+(falta===1?' mano':' manos')+'.'}</div><div class="cuenta">Reparto solo en ${left} s</div></div>`;
  } else $('reparto').innerHTML='';
  $('status').innerHTML=statusText();
  const evN={lluvia:'Día de lluvia',rambla:'Atardecer en la rambla'};
  let ev=H.event?`<span class="evento">${evN[H.event]}</span>`:'';
  if(H.paro) ev+=' <span class="evento">Paro general</span>';
  if(H.tilt) ev+=' <span class="evento">Rival calentado</span>';
  if(H.truco.value>1) ev+=` <span class="evento">${TRUCO_N[H.truco.value]} querido</span>`;
  $('evento').innerHTML=ev;
  $('acciones').innerHTML=actionsHTML();
  $('senas').hidden=!dos;
  if(dos) $('senas').innerHTML=`<b>Señas del tío</b> · Guiño: tiene pieza · Cejas: as bravo · Boca torcida: siete bravo o un tres · Se rasca la oreja: nada · Cachete inflado: 30 o más de envido.${H.sena?' <span class="hoy">Esta mano: '+H.sena.g.toLowerCase()+'.</span>':''}`;
  const lav=G.lavCount>=m.lav;
  let info='';
  if(ayudas.checked){const fv=uy?florVal(H.orig.p,H.m):null;info=`<div class="estado">Tu envido: ${envidoVal(H.orig.p,H.m)}${fv!==null?' · Flor: '+fv:''}</div>`}
  const imgs=C.eq.mate==='pava'?`<img src="${sprite('pava',3)}" alt="${m.n}">`:`<img src="${sprite(m.spr,3)}" alt="${m.n}"><img src="${sprite(t.spr,3)}" alt="${t.n}">`;
  const fq=G.chic.need-G.chic.charge,fp=G.paq.need-G.paq.charge;
  $('equipoBox').innerHTML=`<div class="imgs">${imgs}</div>
   <div class="estado">${m.n}${C.eq.mate==='pava'?'':' · '+t.n}</div>
   <div class="pips" aria-label="${G.energy.p} de ${cp} cebadas">${Array.from({length:cp},(_,i)=>`<span class="pip ${i<G.energy.p?'on':''}"></span>`).join('')}</div>
   <div class="estado ${lav?'mal':''}">${lav?'Mate lavado':G.energy.p+' de '+cp+' cebadas'}${G.freeMana&&!G.freeUsed?' · 1 maña gratis':''}</div>
   <div class="estado">${paqReady()?'Paquete listo':'Paquete: faltan '+fp+' manos'} · ${chicReady()?'Chicana lista':'Chicana: faltan '+fq}</div>${info}`;
  $('manas').innerHTML=MANAS.filter(mn=>C.manas.includes(mn.id)).map(mn=>`<button class="mana ${(mn.id==='yapa'&&H.yapa)||(mn.id==='paro'&&H.paro)||(mn.id==='feria'&&H.feriaPick)?'on':''}" data-mana="${mn.id}" ${manaOk(mn.id)?'':'disabled'}><span class="t"><span>${mn.name}</span><span>${manaCost(mn)}</span></span><span class="d">${mn.desc}</span></button>`).join('');
  const lg=$('log'); lg.innerHTML=G.logs.slice(-30).map(l=>`<div class="${l.who}">${l.t}</div>`).join(''); lg.scrollTop=lg.scrollHeight;
}
function step(){
  render();
  clearTimeout(cpuTimer);
  if(!H.ended&&!G.over&&!H.busy&&H.toAct!=='p'){
    const wait=Math.max(850+Math.random()*500,H.hold-Date.now()+300);
    cpuTimer=setTimeout(cpuTurn,wait);
  }
}
