/* Truco Oriental · motor de juego
   Estado de la partida (1 contra 1 o 2 contra 2), cantos, mañas, chicana y la inteligencia de los rivales. */
/* ---------- estado de la partida (1 contra 1 o 2 contra 2) ---------- */
let G,H,cpuTimer=null,peekTimer=null,toastTimer=null,dealTimer=null;
function paqNeed(){const [a,b]=[[6,7],[5,6],[3,4]][paqLvl()];return a+Math.floor(Math.random()*(b-a+1))}
function chicNeed(){const [a,b]=[[4,5],[3,4],[2,3]][lenguaLvl()];return a+Math.floor(Math.random()*(b-a+1))}
const ayudas=$('ayudas');
const TEAM=x=>(x==='p'||x==='q')?'p':'c';
const nextSeat=x=>{const s=G.seats;return s[(s.indexOf(x)+1)%s.length]};
const prevSeat=x=>{const s=G.seats;return s[(s.indexOf(x)+s.length-1)%s.length]};
const seatsOf=t=>G.seats.filter(s=>TEAM(s)===t);
const partnerOf=x=>G.seats.find(s=>s!==x&&TEAM(s)===TEAM(x));
function pieOf(t){const s=G.seats,i=s.indexOf(G.mano),order=s.slice(i).concat(s.slice(0,i));return order.filter(z=>TEAM(z)===t).pop()}
const voz=()=>two()&&pieOf('p')==='q'?'q':'p';
const responder=x=>TEAM(x)==='c'?voz():nextSeat(x);
function nm(x){return x==='p'?'Vos':x==='q'?G.partner:x==='d'?G.rival2:RIVAL}
function teamName(t){if(G.seats.length===2)return t==='p'?'Vos':RIVAL;return t==='p'?'Ustedes':RIVAL+' y '+G.rival2}
const two=()=>G.seats.length===4;
function sumaTxt(t){return t==='p'?(two()?'Ustedes suman':'Sumás'):(two()?teamName('c')+' suman':RIVAL+' suma')}
function llevaTxt(t){return t==='p'?(two()?'Ustedes se llevan':'Te llevás'):(two()?teamName('c')+' se llevan':RIVAL+' se lleva')}
function ganaTxt(t){return t==='p'?(two()?'Ganan ustedes':'Ganás vos'):(two()?'Ganan '+teamName('c'):'Gana '+RIVAL)}

function newGame(opts){
  clearTimeout(cpuTimer);
  const st=MATCH.stop;
  RIVAL=st.rival;
  let start=2;
  if(C.eq.mate==='nona') start+=2;
  if(C.eq.termo==='tacero'&&C.eq.mate!=='pava') start+=1;
  const seats=st.duo?['p','c','q','d']:['p','c'];
  G={seats,partner:st.duo?st.duo.partner:null,rival2:st.duo?st.duo.rival2:null,
     score:{p:0,c:0},mano:seats[seats.length-1],energy:{p:Math.min(cap(),start),c:3},lavCount:0,leak:0,handNo:0,over:false,lastWinner:null,logs:[],lastEvent:-5,
     rules:opts.rules||'uy',target:opts.target||30,ai:st.ai,freeMana:C.eq.termo==='tmatera'&&C.eq.mate!=='pava',freeUsed:false,
     paq:{charge:0,need:paqNeed()},chic:{charge:0,need:chicNeed()},lavBonus:0,maracUsed:false,mom:0};
  const bo=MATCH.boost||{};
  if(bo.yerbapalo){G.energy.p=Math.min(cap(),G.energy.p+1);log('p','Yerba con palo: arrancás con 1 cebada más.')}
  if(bo.compuesta){G.lavBonus=1;log('p','Yerba compuesta: el mate tarda más en lavarse.')}
  if(bo.bizcochos){G.chic.charge=G.chic.need;log('p','Bizcochos de grasa: la chicana arranca cargada.')}
  if(bo.garrapinada){G.paq.charge=G.paq.need;log('p','Garrapiñada: el paquete arranca cargado.')}
  log('s',(G.rules==='ar'?'Truco argentino':'Truco uruguayo')+(two()?' de a cuatro':'')+' a '+G.target+'. '+RIVAL+': '+st.frase);
  if(two()) log('q',G.partner+': '+st.duo.frase);
  newHand();
}
function newHand(rig){
  clearTimeout(cpuTimer);clearTimeout(dealTimer);
  G.mano=nextSeat(G.mano); G.handNo++;
  const n=G.seats.length;
  let deck=shuffle(fullDeck());
  if(rig){
    let bs=-1;
    const fino=hasHab('paq3');
    for(let k=0;k<(fino?60:6);k++){const d=shuffle(fullDeck());const hp=d.slice(-3);const mm=G.rules==='ar'?DUMMY_M:d[d.length-1-3*n];
      const sc=hp.map(c=>pct(c,mm)).sort((a,b)=>b-a);let v=sc[0]+sc[1]*0.7+envidoVal(hp,mm)/110;
      if(fino&&Math.max(...hp.map(c=>power(c,mm)))>=49)v+=5;if(v>bs){bs=v;deck=d}}
  }
  const hand={},orig={};
  for(const s of G.seats){hand[s]=[deck.pop(),deck.pop(),deck.pop()];orig[s]=hand[s].slice()}
  const m=G.rules==='ar'?DUMMY_M:deck.pop();
  const fl=G.rules==='uy';
  const flor={sung:{}};for(const s of G.seats)flor[s]=fl&&florVal(hand[s],m)!==null;
  H={deck,m,hand,orig,results:[],b:0,table:[{},{},{}],leader:G.mano,toAct:G.mano,
     pending:null,savedTruco:null,resumeAct:null,playTurn:null,truco:{value:1,last:null},
     envDone:false,florDone:!fl,flor,paro:false,yapa:false,usedHand:false,usedBaza:false,cpuUsedHand:false,cpuTrucoChecked:{},
     event:null,ended:false,busy:false,peek:null,feriaPick:false,say:{},toast:null,hold:0,
     dealer:prevSeat(G.mano),dealStart:Date.now(),dealUntil:Date.now()+1100+n*450,playedAt:{},dealPrompt:false,rigged:!!rig,tilt:false,chicUsed:false,sena:null,senaCaught:false};
  H.hold=H.dealUntil;{const h=H;setTimeout(()=>{if(G&&H===h)render()},H.dealUntil-Date.now()+60)}
  if(G.handNo>1&&Math.random()<0.2&&G.lastEvent<G.handNo-1){
    H.event=rnd(['lluvia','rambla']); G.lastEvent=G.handNo;
    if(H.event==='lluvia'){gainP(1);G.energy.c=Math.min(6,G.energy.c+1);log('s','Se largó a llover: tortas fritas para todos, +1 cebada.')}
    else log('s','Atardecer en la rambla: esta mano no hay mañas, truco puro.');
  }
  if(two()){pocholoSena();if(voz()==='q')log('q',G.partner+' es el pie: esta mano canta y responde él por el equipo.')}
  if(TEAM(H.dealer)==='c'&&hasHab('ojotallador')){const h=H;setTimeout(()=>{if(!G||H!==h||!H.hand.c.length)return;H.peek=[{s:'c',i:Math.floor(Math.random()*H.hand.c.length)}];log('p','Ojo de tallador: le viste una carta a '+nm('c')+' mientras repartía.');render();setTimeout(()=>{if(H===h){H.peek=null;render()}},2500)},H.dealUntil-Date.now()+100)}
  sfx('repartir');
  if(rig) log('p','Armaste el paquete: te diste buenas cartas sin que nadie se avive.');
  log('s','Mano '+G.handNo+'. '+(H.dealer==='p'?'Repartiste vos. ':'Repartió '+nm(H.dealer)+'. ')+(G.rules==='uy'?'Muestra: '+cardName(m)+'. ':'')+(G.mano==='p'?'Sos mano.':nm(G.mano)+' es mano.'));
  step();
}
function pocholoSena(){
  const h=H.orig.q,m=H.m,best=Math.max(...h.map(c=>power(c,m))),ev=envidoVal(h,m);
  let s;
  if(best>=100) s={g:'Te guiña un ojo',k:'tiene una pieza'};
  else if(best>=49) s={g:'Levanta las cejas',k:'tiene un as bravo'};
  else if(best>=47||h.some(c=>c.num===3)) s={g:'Tuerce la boca',k:'tiene un siete bravo o un tres'};
  else s={g:'Se rasca la oreja',k:'no tiene nada'};
  if(ev>=30) s.g+=' e infla un cachete';
  H.sena=s; H.say.q=s.g+'.';
  if(Math.random()<0.15+(G.ai.lee||0)*0.3){H.senaCaught=true;log('c',G.rival2+' le vio la seña a '+G.partner+'.')}
}
function log(who,t){G.logs.push({who,t}); if(G.logs.length>60) G.logs.shift()}
function say(x,t){H.say[x]=t; log(TEAM(x)==='p'?(x==='q'?'q':'p'):'c',nm(x)+': '+t)}
function toast(t){H.toast=t;H.hold=Math.max(H.hold,Date.now()+2300);clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(H.toast===t){H.toast=null;render()}},3200)}
function addPoints(t,n){
  if(n<=0) return;
  G.score[t]=Math.min(G.target,G.score[t]+n); setTimeout(()=>sfx('puntos'),250);
  if(G.score[t]>=G.target&&!G.over){G.over=true;H.ended=true;clearTimeout(cpuTimer);setTimeout(gameOver,1600)}
}
function gainP(n,why){const before=G.energy.p;G.energy.p=Math.max(0,Math.min(cap(),G.energy.p+n));if(why&&G.energy.p!==before)log('p',why)}

/* ---------- consultas ---------- */
const played=(b,x)=>H.table[b][x]!==undefined;
const mustFlor=x=>H.flor[x]&&!H.flor.sung[x]&&!H.florDone&&H.b===0&&!played(0,x);
function canEnvido(x){return !H.pending&&!H.envDone&&!H.florDone&&H.b===0&&!played(0,x)&&H.truco.value===1&&!mustFlor(x)}
function canEnvidoResp(x){return H.pending&&H.pending.type==='truco'&&H.pending.level===2&&H.truco.value===1&&!H.envDone&&!H.florDone&&H.b===0&&!played(0,x)&&!mustFlor(x)}
function canTruco(x){return !H.pending&&!H.paro&&H.truco.value<4&&H.truco.last!==TEAM(x)}
function canRaiseTruco(){return H.pending&&H.pending.type==='truco'&&H.pending.level<4&&!H.paro}
function envRaises(){const ch=H.pending.chain,last=ch[ch.length-1];const r=[];if(last==='envido')r.push('real');if(last!=='falta')r.push('falta');return r}
const ptsTxt=n=>n+(n===1?' punto':' puntos');
function teamEnvido(t){return Math.max(...seatsOf(t).map(s=>envidoVal(H.orig[s],H.m)))}
function cagazo(){return Math.max(0,Math.min(10,Math.round(pinta()*(1-(G.ai.aguante||0)))+G.mom+((H&&H.cgBonus)||0)))}
function chicReady(){return G.chic.charge>=G.chic.need}
function paqReady(){return G.paq.charge>=G.paq.need}

/* ---------- acciones ---------- */
function act(x,a){
  if(H.ended||H.busy) return;
  const interrupt=x==='p'&&a.type==='envido'&&!H.pending&&canEnvido(x);
  if(H.toAct!==x&&!interrupt) return;
  if(a.type==='flor'){ if(mustFlor(x)) singFlor(x); return step(); }
  if(mustFlor(x)&&a.type!=='mazo') return;
  switch(a.type){
    case 'play':{
      if(H.pending) return;
      const card=H.hand[x].splice(a.idx,1)[0];
      if(x==='p'&&H.marac){H.marac=false;H.maracCard=card.id;log('p','¡Maracanazo! El '+cardName(card)+' gana esta mano.');toast({t:'¡Maracanazo!',g:'Tu '+cardName(card)+' gana la mano, sea cual sea.',win:true})}
      H.table[H.b][x]=card; H.playedAt[H.b+x]=Date.now(); H.say[x]=''; sfx('carta');
      if(Object.keys(H.table[H.b]).length<G.seats.length){H.toAct=nextSeat(x);return step()}
      H.busy=true; render();
      setTimeout(()=>{H.busy=false;resolveBaza();step()},1100);
      return;
    }
    case 'envido':{
      const k=a.kind;
      if(H.pending&&H.pending.type==='envido'){
        if(!envRaises().includes(k)) return;
        H.pending.chain.push(k); H.pending.by=x; say(x,rnd(FR[k])); sfx('envido'); H.toAct=responder(x); return step();
      }
      if(canEnvidoResp(x)){H.savedTruco=H.pending;H.resumeAct=null}
      else if(canEnvido(x)){H.resumeAct=H.toAct}
      else return;
      H.pending={type:'envido',chain:[k],by:x}; say(x,rnd(FR[k])); sfx('envido'); H.toAct=responder(x); return step();
    }
    case 'truco':{
      if(H.pending&&H.pending.type==='truco'){
        if(!canRaiseTruco()) return;
        acceptTruco(H.pending.level,H.pending.by);
        const lv=H.pending.level+1; H.pending={type:'truco',level:lv,by:x};
        say(x,rnd(FR[TRUCO_K[lv]])); sfx('truco'); H.toAct=responder(x); return step();
      }
      if(!canTruco(x)) return;
      H.playTurn=x; const lv=H.truco.value+1; H.pending={type:'truco',level:lv,by:x};
      say(x,rnd(FR[TRUCO_K[lv]])); sfx('truco'); H.toAct=responder(x); return step();
    }
    case 'quiero':
    case 'noquiero':{
      const acc=a.type==='quiero'; if(!H.pending) return;
      say(x,rnd(FR[a.type]));
      if(H.pending.type==='envido') resolveEnvido(acc);
      else if(acc){acceptTruco(H.pending.level,H.pending.by);H.pending=null;H.toAct=H.playTurn}
      else {const t=TEAM(H.pending.by);endHand(t,H.pending.level-1,(t==='p'?teamName('c')+' no quiso':'No quisiste')+' el '+TRUCO_N[H.pending.level].toLowerCase()+'.')}
      return step();
    }
    case 'mazo':{
      if(H.pending&&H.pending.type==='envido') return;
      say(x,rnd(FR.mazo));
      const lose=TEAM(x),win=lose==='p'?'c':'p',txt=(lose==='p'?(two()?'Se fueron':'Te fuiste'):nm(x)+' se fue')+' al mazo.';
      if(H.pending&&H.pending.type==='truco') endHand(TEAM(H.pending.by),H.pending.level-1,txt);
      else endHand(win,H.truco.value,txt);
      return step();
    }
  }
}
function acceptTruco(level,by){
  if(H.truco.value>=level) return;
  H.truco.value=level;H.truco.last=TEAM(by);
  if(C.eq.termo==='tcampero'&&C.eq.mate!=='pava') gainP(1,'Termo campero: +1 cebada por el '+TRUCO_N[level].toLowerCase()+' querido.');
}
function restoreAfterEnvido(){
  if(H.savedTruco){H.pending=H.savedTruco;H.savedTruco=null;H.toAct=responder(H.pending.by)}
  else {H.pending=null;H.toAct=H.resumeAct}
}
function envidoWonBonus(){if(C.eq.mate==='algarrobo') gainP(1,'Mate de algarrobo: +1 cebada.')}
function resolveEnvido(acc){
  const ch=H.pending.chain,by=H.pending.by,val={envido:2,real:3};
  const name=ch.map(k=>({envido:'Envido',real:'Real envido',falta:'Falta envido'})[k]).join(' + ');
  if(acc){
    const ep=teamEnvido('p'),ec=teamEnvido('c');
    const w=ep>ec?'p':ec>ep?'c':TEAM(G.mano);
    const pts=ch.includes('falta')?Math.max(1,G.target-Math.max(G.score.p,G.score.c)):ch.reduce((s,k)=>s+val[k],0);
    const cs=seatsOf('c').reduce((a,s)=>envidoVal(H.orig[s],H.m)>envidoVal(H.orig[a],H.m)?s:a);
    H.say[cs]='Tengo '+ec+'.';
    if(two()){const ps=seatsOf('p').reduce((a,s)=>envidoVal(H.orig[s],H.m)>envidoVal(H.orig[a],H.m)?s:a);if(ps==='q')H.say.q='Tengo '+ep+'.'}
    log('s',name+' querido. '+teamName('p')+' '+ep+', '+teamName('c')+' '+ec+'. '+ganaTxt(w)+': '+ptsTxt(pts)+(ep===ec?' (empate: gana el mano).':'.'));
    addPoints(w,pts);
    let extra='';
    if(w==='p'&&H.yapa){addPoints('p',1);extra=' + 1 de yapa';log('p','La yapa: +1 punto.')}
    if(w==='p') envidoWonBonus();
    toast({t:name+' querido',vs:[ep,ec],g:ganaTxt(w)+': +'+ptsTxt(pts)+extra+(ep===ec?' (empate, gana el mano)':''),win:w==='p'});
  } else {
    const pts=ch.length===1?1:ch.slice(0,-1).reduce((s,k)=>s+val[k],0),t=TEAM(by);
    log('s',llevaTxt(t)+' '+ptsTxt(pts)+' por el envido no querido.');
    addPoints(t,pts);
    if(t==='p') envidoWonBonus();
    toast({t:name+' no querido',g:llevaTxt(t)+' +'+ptsTxt(pts),win:t==='p'});
  }
  H.envDone=true; H.pending=null; restoreAfterEnvido();
}
function singFlor(x){
  say(x,'¡Flor! '+rnd(VERSOS)); sfx('flor');
  if(TEAM(x)==='p'&&hasHab('versopicante')&&!chicReady()){G.chic.charge=G.chic.need;log('p','Verso picante: la chicana quedó cargada.')}
  const holders=G.seats.filter(s=>H.flor[s]&&!H.flor.sung[s]&&(s===x||!played(0,s)));
  holders.forEach(s=>H.flor.sung[s]=true);
  const hp=holders.filter(s=>TEAM(s)==='p'),hc=holders.filter(s=>TEAM(s)==='c');
  const best=a=>Math.max(...a.map(s=>florVal(H.orig[s],H.m)));
  if(hp.length&&hc.length){
    const fp=best(hp),fc=best(hc),w=fp>fc?'p':fc>fp?'c':TEAM(G.mano);
    const o=(TEAM(x)==='p'?hc:hp)[0]; H.say[o]='¡Contraflor! Tengo '+florVal(H.orig[o],H.m)+'.';
    log('s','Contraflor: '+teamName('p')+' '+fp+', '+teamName('c')+' '+fc+'. '+ganaTxt(w)+' 6 puntos.');
    addPoints(w,6); if(w==='p') envidoWonBonus();
    toast({t:'Flor y contraflor',vs:[fp,fc],g:ganaTxt(w)+': +6 puntos',win:w==='p'});
  } else {
    const t=TEAM(x),pts=3*holders.length;
    addPoints(t,pts); log('s',sumaTxt(t)+' '+pts+' puntos de flor.'); if(t==='p') envidoWonBonus();
    toast({t:holders.length>1?'¡Dos flores!':'¡Flor!',g:sumaTxt(t)+' '+pts+' puntos. No hay envido esta mano.',win:t==='p'});
  }
  H.florDone=true; H.envDone=true;
  if(H.pending&&H.pending.type==='envido'){H.pending=null;restoreAfterEnvido()}
}
function bazaTop(b){
  const t=H.table[b];let top=-1,seat=null,teams=new Set();
  for(const s of Object.keys(t)){const p=H.maracCard===t[s].id?999:power(t[s],H.m);if(p>top){top=p;seat=s;teams=new Set([TEAM(s)])}else if(p===top)teams.add(TEAM(s))}
  return {top,seat,tie:teams.size>1,team:teams.size>1?'t':TEAM(seat)};
}
function resolveBaza(){
  const bt=bazaTop(H.b),r=bt.team;
  H.results.push(r); H.usedBaza=false; sfx(r==='p'?'gana':r==='c'?'pierde':'click');
  if(H.b===0&&r==='c'&&C.eq.mate==='guampa') gainP(1,'Mate de guampa: garra, +1 cebada.');
  const w=handWinner(H.results,TEAM(G.mano));
  if(w){endHand(w,H.truco.value,(w==='p'?(two()?'Ganaron':'Ganaste'):teamName('c')+(two()?' ganaron':' ganó'))+' la mano.');return}
  H.b++; if(r!=='t') H.leader=bt.seat; H.toAct=H.leader;
}
function endHand(w,pts,why){
  if(H.ended&&!G.over) return;
  H.pending=null;
  if(w==='p'&&H.garra){pts*=2;why+=' Garra charrúa: vale doble.'}
  log('s',why+' '+sumaTxt(w)+' '+ptsTxt(pts)+'.');
  addPoints(w,pts); H.ended=true; G.lastWinner=w;
  G.lavCount=H.usedHand?G.lavCount+1:0; G.prevUsed=H.usedHand;
  G.paq.charge++; G.chic.charge++;
  {const before=cagazo();if(w==='p'&&(H.truco.value>1||/no quis/.test(why)))G.mom=Math.min(3,G.mom+1);else if(w==='c')G.mom=Math.max(-3,G.mom-1);const after=cagazo();if(after!==before)log('s',after>before?teamName('c')+' te tiene más cagazo.':teamName('c')+' se agrandó: te tiene menos cagazo.')}
  if(w==='c'&&H.truco.value===4&&C.eq.termo==='tampolla'&&C.eq.mate!=='pava'){gainP(-2,'Se te sacudió la ampolla del termo: −2 cebadas.')}
  if(!H.toast||Date.now()>H.hold) toast({t:w==='p'?(two()?'Ganaron la mano':'Ganaste la mano'):(two()?'Perdieron la mano':'Perdiste la mano'),g:why+' '+sumaTxt(w)+' '+ptsTxt(pts)+'.',win:w==='p'});
  {const h=H;setTimeout(()=>afterHand(h),2700)}
}
function afterHand(h){
  if(!G||G.over||H!==h||pantalla!=='juego') return;
  const nextMano=nextSeat(G.mano),dealer=prevSeat(nextMano);
  if(dealer==='p'){
    H.dealPrompt=true;H.dealAuto=Date.now()+6000;
    const tick=()=>{if(!G||H!==h||!H.dealPrompt)return;if(Date.now()>=H.dealAuto)return doDeal(false);render();dealTimer=setTimeout(tick,1000)};
    tick();
  } else nextHand(false);
}
function doDeal(rig){
  if(!G||!H.dealPrompt) return;
  if(rig&&!paqReady()) return;
  H.dealPrompt=false;clearTimeout(dealTimer);
  if(rig){G.paq.charge=0;G.paq.need=paqNeed()}
  nextHand(rig);
}
function nextHand(rig){
  if(G.over) return;
  const m=eqMate(), lav=G.lavCount>=m.lav+G.lavBonus;
  let gain=lav?(m.lavMin||0):1;
  if(G.lastWinner==='p'&&!lav) gain+=C.eq.mate==='pata'?2:1;
  gainP(gain);
  if(lav) log('s','El mate está lavado: '+(gain?'cargás solo 1 cebada.':'no cargás cebadas.')+' Pasá una mano sin mañas para cambiar la yerba.');
  if(C.eq.termo==='tplastico'&&C.eq.mate!=='pava'){
    if(!G.prevUsed){G.leak++; if(G.leak>=3&&G.energy.p>0){gainP(-1,'Se te chorreó el termo de plástico: −1 cebada.');G.leak=0}}
    else G.leak=0;
  }
  G.energy.c=Math.min(6,G.energy.c+1+(G.lastWinner==='c'?1:0));
  newHand(rig);
}

/* ---------- chicana ---------- */
const GRITOS={fuerte:["¡Te voy a hacer pedazos, botija!","¡Con esto te gano con los ojos cerrados!","¡Andá preparando la billetera!"],
  flojo:["¡Callate y jugá, pesado!","¡No me ponés nervioso, eh!","¡Dejame pensar tranquilo, che!"]};
function canChicana(){return !H.ended&&!H.busy&&H.toAct==='p'&&Date.now()>=H.dealUntil&&chicReady()&&!H.chicUsed&&!mustFlor('p')}
function chicana(){
  if(!canChicana()) return;
  G.chic.charge=0;G.chic.need=chicNeed();H.chicUsed=true;H.tilt=true;
  say('p',rnd(FR.chicana));
  const t=seatsOf('c')[0],s=teamStrength(t);
  let fuerte=s>=0.55;
  const truth=[0.75,0.85,0.95][lenguaLvl()]-(G.ai.bluff>0.15?0.15:0);
  if(hasHab('lengua3')){G.energy.c=Math.max(0,G.energy.c-1);H.cpuUsedHand=true;log('p','Cuplé venenoso: '+teamName('c')+' pierde 1 cebada y no puede usar mañas esta mano.')}
  if(Math.random()>truth) fuerte=!fuerte;
  const g=rnd(GRITOS[fuerte?'fuerte':'flojo']);
  setTimeout(()=>{if(!G)return;say(t,g);toast({t:nm(t)+' se calentó',g:'«'+g+'» Calentado, esta mano va a querer todo.',win:true});sfx('truco');step()},500);
  step();
}

/* ---------- mañas del jugador ---------- */
function manaOk(id){
  const mn=MANAS.find(m=>m.id===id);
  if(!C.manas.includes(id)) return false;
  if(H.ended||H.busy||H.toAct!=='p'||Date.now()<H.dealUntil||H.event==='rambla'||H.usedBaza||G.energy.p<manaCost(mn)||H.feriaPick) return false;
  if(mustFlor('p')) return false;
  if(id==='reojo') return seatsOf('c').some(s=>H.hand[s].length);
  if(id==='feria') return H.hand.p.length>0&&H.deck.length>0;
  if(id==='sudestada') return G.rules==='uy'&&H.b<=1&&H.deck.length>0;
  if(id==='yapa') return !H.envDone&&!H.florDone&&!H.yapa;
  if(id==='paro') return !H.paro&&H.truco.value<4&&!(H.pending&&H.pending.type==='truco');
  if(id==='garra') return !H.garra&&G.score.c-G.score.p>=8;
  if(id==='maracanazo') return !G.maracUsed&&!H.pending&&!played(H.b,'p');
  return false;
}
function payMana(id){const mn=MANAS.find(m=>m.id===id);const c=manaCost(mn);if(G.freeMana&&!G.freeUsed){G.freeUsed=true;log('p','Matera de cuero: esta maña sale gratis.')}G.energy.p-=c;H.usedHand=true;H.usedBaza=true;sfx('mate')}
function useMana(id){
  if(!manaOk(id)) return;
  if(id==='feria'){H.feriaPick=true;H.feriaLeft=hasHab('feria2')?2:1;H.feriaPaid=false;return step()}
  payMana(id);
  if(id==='reojo'){
    const all=[];seatsOf('c').forEach(s=>H.hand[s].forEach((c,i)=>all.push({s,i})));
    const lince=hasHab('ojo2');H.peek=shuffle(all).slice(0,lince?2:1);
    log('p','Mirada de reojo: le viste '+(H.peek.length>1?'dos cartas':'una carta')+' al rival.');
    clearTimeout(peekTimer); peekTimer=setTimeout(()=>{if(H){H.peek=null;render()}},lince?4000:2000);
  }
  if(id==='sudestada'){sudestada('p')}
  if(id==='yapa'){H.yapa=true;log('p','Pediste la yapa: si ganás el envido, +1.')}
  if(id==='paro'){H.paro=true;log('p','¡Paro general! Nadie sube el truco esta mano.')}
  if(id==='garra'){H.garra=true;if(hasHab('garracampeon')){H.cgBonus=3;log('p','Garra de campeón: el rival te agarra cagazo.')}log('p','¡Garra charrúa! Si ganan esta mano, vale doble.');toast({t:'¡Garra charrúa!',g:'Si ganás esta mano, vale el doble.',win:true})}
  if(id==='maracanazo'){H.marac=true;G.maracUsed=true;log('p','Preparaste el Maracanazo: la próxima carta que tires gana esa mano.')}
  step();
}
function sudestada(x){
  H.deck.unshift(H.m); H.m=H.deck.pop();
  if(!H.florDone){for(const s of G.seats)H.flor[s]=florVal(H.orig[s],H.m)!==null}
  log(TEAM(x)==='p'?'p':'c','Sudestada'+(x!=='p'?' de '+nm(x):'')+': la muestra ahora es '+cardName(H.m)+'.');
  toast({t:'¡Sudestada!',g:'La muestra ahora es el '+cardName(H.m)+'. Cambian las piezas.',win:x==='p'});
}
function feriaSwap(idx){
  if(!H.feriaPaid){payMana('feria');H.feriaPaid=true}
  const old=H.hand.p[idx], nw=H.deck.pop();
  H.deck.splice(Math.floor(Math.random()*(H.deck.length+1)),0,old);
  H.hand.p[idx]=nw; const oi=H.orig.p.findIndex(c=>c.id===old.id); if(oi>=0) H.orig.p[oi]=nw;
  if(!H.florDone) H.flor.p=G.rules==='uy'&&florVal(H.orig.p,H.m)!==null;
  H.feriaLeft--;H.feriaPick=H.feriaLeft>0&&H.deck.length>0;
  log('p','Fuiste a la feria: cambiaste el '+cardName(old)+' por el '+cardName(nw)+'.'+(H.feriaPick?' Podés cambiar una más.':''));
  step();
}

/* ---------- la máquina (rivales y el compañero) ---------- */
function strength(x){
  const m=H.m,ai=G.ai,t=TEAM(x),o=t==='p'?'c':'p';
  const vals=H.hand[x].map(c=>pct(c,m)).sort((a,b)=>b-a);
  const won=H.results.filter(r=>r===t).length,lost=H.results.filter(r=>r===o).length;
  let s=(vals[0]||0)*0.55+(vals[1]||0)*0.3+won*0.4-lost*0.4;
  const tb=H.table[H.b],opp=Object.keys(tb).filter(k=>TEAM(k)===o).map(k=>power(tb[k],m));
  if(opp.length&&H.hand[x].some(c=>power(c,m)>Math.max(...opp))) s+=0.15;
  if(t==='c'&&ai.lee&&Math.random()<ai.lee&&H.hand.p.length&&H.hand[x].length){
    const pb=Math.max(...H.hand.p.map(c=>power(c,m))),cb=Math.max(...H.hand[x].map(c=>power(c,m)));
    s+=cb>pb?0.2:-0.2;
  }
  if(t==='c'&&H.senaCaught&&H.sena) s+=/pieza|bravo/.test(H.sena.k)?-0.15:0.1;
  return Math.max(0,Math.min(1,s));
}
function teamStrength(x){const p=partnerOf(x);return p?Math.max(strength(x),strength(p)*0.9):strength(x)}
function cpuCard(x){
  const m=H.m,t=TEAM(x),cs=H.hand[x].map((c,i)=>({i,p:power(c,m)})).sort((a,b)=>a.p-b.p);
  const tb=H.table[H.b],ks=Object.keys(tb);
  const opp=ks.filter(k=>TEAM(k)!==t).map(k=>power(tb[k],m)),mine=ks.filter(k=>TEAM(k)===t).map(k=>power(tb[k],m));
  const ob=opp.length?Math.max(...opp):-1,mb=mine.length?Math.max(...mine):-1;
  const left=G.seats.length-ks.length-1;
  if(mb>ob&&mb>=0&&(left===0||mb>=100)) return cs[0].i;
  if(ob>=0){
    const target=Math.max(ob,mb);
    const beat=cs.find(c=>c.p>ob);
    if(beat&&(mb<=ob)) return beat.i;
    if(mb>ob) return cs[0].i;
    const tie=cs.find(c=>c.p===ob); if(tie&&H.results[0]===t) return tie.i;
    return cs[0].i;
  }
  if(H.b===0) return cs.length===3?cs[1].i:cs[0].i;
  return cs[cs.length-1].i;
}
function cpuTurn(){
  if(!G||H.ended||H.busy||G.over) return;
  const x=H.toAct; if(x==='p') return;
  if(Date.now()<H.hold){clearTimeout(cpuTimer);cpuTimer=setTimeout(cpuTurn,H.hold-Date.now()+200);return}
  const ai=x==='q'?{bluff:0.05,env:0.05,truco:0.05,mana:0,lee:0}:G.ai,t=TEAM(x);
  if(mustFlor(x)) return act(x,{type:'flor'});
  const ev=(t==='c'||H.pending)?teamEnvido(t):envidoVal(H.orig[x],H.m), r=Math.random(), ea=Math.round(ai.env*10);
  const tilt=t==='c'&&H.tilt?0.12:0;
  const cg=t==='c'&&H.pending&&TEAM(H.pending.by)==='p'?cagazo():0;
  if(H.pending){
    if(H.pending.type==='envido'){
      const last=H.pending.chain[H.pending.chain.length-1], raises=envRaises();
      if(last==='falta') return act(x,{type:ev>=31-ea||r<0.05+tilt?'quiero':'noquiero'});
      if(raises.includes('real')&&ev>=31-ea&&r<0.5) return act(x,{type:'envido',kind:'real'});
      if(raises.includes('falta')&&ev>=33-ea&&r<0.3) return act(x,{type:'envido',kind:'falta'});
      const need=(last==='real'?28:26)-ea+Math.round(cg/3);
      return act(x,{type:ev>=need||r<Math.max(0,0.08+ai.env+tilt-cg*0.01)?'quiero':'noquiero'});
    }
    if(canEnvidoResp(x)&&ev>=28-ea&&r<0.7) return act(x,{type:'envido',kind:ev>=31?'real':'envido'});
    const s=teamStrength(x), lv=H.pending.level, th=0.55+(lv-2)*0.07-tilt+cg*0.015;
    if(canRaiseTruco()&&(s>0.82-tilt+cg*0.01&&r<0.6||r<ai.bluff*0.4+tilt-cg*0.01)) return act(x,{type:'truco'});
    if(s>=th||(s>=th-0.15&&r<0.4)) return act(x,{type:'quiero'});
    return act(x,{type:'noquiero'});
  }
  if(t==='c'&&!H.cpuUsedHand&&H.event!=='rambla'&&H.b===0&&!played(0,x)&&r<ai.mana*2){
    const weakest=H.hand[x].map((c,i)=>({i,p:pct(c,H.m)})).sort((a,b)=>a.p-b.p)[0];
    if(G.rules==='uy'&&G.energy.c>=4&&strength(x)<0.33&&r<ai.mana&&!H.florDone){
      G.energy.c-=4;H.cpuUsedHand=true;sfx('mate');sudestada(x);H.say[x]='¡Qué sudestada, che!';return step();
    }
    if(G.energy.c>=2&&weakest&&weakest.p<0.22&&H.deck.length){
      G.energy.c-=2;H.cpuUsedHand=true;sfx('mate');
      const old=H.hand[x][weakest.i],nw=H.deck.pop();
      H.deck.splice(Math.floor(Math.random()*(H.deck.length+1)),0,old);
      H.hand[x][weakest.i]=nw;const oi=H.orig[x].findIndex(c=>c.id===old.id);if(oi>=0)H.orig[x][oi]=nw;
      if(!H.florDone)H.flor[x]=G.rules==='uy'&&florVal(H.orig[x],H.m)!==null;
      log('c',nm(x)+' fue a la feria de Tristán Narvaja y cambió una carta.');H.say[x]='Voy a la feria un ratito.';
      return step();
    }
  }
  if(canEnvido(x)){
    const own=envidoVal(H.orig[x],H.m);
    if(own>=30-ea&&r<0.8) return act(x,{type:'envido',kind:r<0.4?'real':'envido'});
    if(own>=27-ea&&r<0.65+ai.env) return act(x,{type:'envido',kind:'envido'});
    if(r<0.04+ai.env) return act(x,{type:'envido',kind:'envido'});
  }
  if(canTruco(x)&&!H.cpuTrucoChecked[H.b+x]){
    H.cpuTrucoChecked[H.b+x]=true;
    const s=teamStrength(x);
    const miedo=t==='c'?1-cagazo()*0.04:1;
    if((s>0.72&&Math.random()<(0.55+ai.truco)*miedo)||(s<0.3&&Math.random()<ai.bluff*miedo)) return act(x,{type:'truco'});
  }
  act(x,{type:'play',idx:cpuCard(x)});
}
