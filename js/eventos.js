/* Truco Oriental · eventos
   Clicks, volumen y arranque del juego. */
/* ---------- eventos ---------- */
document.addEventListener('click',e=>{
  SND.init();
  const pin=e.target.closest('[data-stop]'); if(pin){selStop=+pin.dataset.stop;sfx('click');return renderMapa()}
  const buy=e.target.closest('[data-buy]');
  if(buy){const [k,id]=buy.dataset.buy.split(':');const it=k==='mate'?MATES[id]:k==='termo'?TERMOS[id]:MANAS.find(m=>m.id===id);
    if(C.plata<it.price) return; C.plata-=it.price;
    if(k==='mate'){C.mates.push(id);C.eq.mate=id}else if(k==='termo'){C.termos.push(id);C.eq.termo=id}else C.manas.push(id);
    saveC();sfx('mate');updPlata();return renderTienda()}
  const tab=e.target.closest('[data-tab]'); if(tab){tiendaTab=tab.dataset.tab;sfx('click');return renderTienda()}
  const sell=e.target.closest('[data-sell]');
  if(sell){const [k,id]=sell.dataset.sell.split(':');const it=k==='mate'?MATES[id]:TERMOS[id];const list=k==='mate'?C.mates:C.termos;
    if(C.eq[k]===id||!it.price||!list.includes(id))return;list.splice(list.indexOf(id),1);C.plata+=it.price/2;saveC();sfx('puntos');updPlata();return renderTienda()}
  const bp=e.target.closest('[data-buyp]');if(bp){const id=bp.dataset.buyp,it=PILCHAS[id];if(C.plata<it.price||C.pilchas.includes(id))return;C.plata-=it.price;C.pilchas.push(id);C.eqp[it.slot]=id;saveC();sfx('mate');updPlata();return renderTienda()}
  const pp=e.target.closest('[data-poner]');if(pp){const id=pp.dataset.poner;C.eqp[PILCHAS[id].slot]=id;saveC();sfx('click');return renderTienda()}
  const qp=e.target.closest('[data-quitar]');if(qp){delete C.eqp[qp.dataset.quitar];saveC();sfx('click');return renderTienda()}
  const sp=e.target.closest('[data-sellp]');if(sp){const id=sp.dataset.sellp,it=PILCHAS[id];if(C.eqp[it.slot]===id||!C.pilchas.includes(id))return;C.pilchas.splice(C.pilchas.indexOf(id),1);C.plata+=it.price/2;saveC();sfx('puntos');updPlata();return renderTienda()}
  const desp=e.target.closest('[data-desp]');
  if(desp){const it=DESPENSA.find(d=>d.id===desp.dataset.desp);if(C.plata<it.price)return;C.plata-=it.price;C.despensa[it.id]=(C.despensa[it.id]||0)+1;saveC();sfx('mate');updPlata();return renderTienda()}
  const hs=e.target.closest('[data-hsel]');if(hs){habSel=hs.dataset.hsel;sfx('click');return renderHab()}
  const ln=e.target.closest('[data-learn]');
  if(ln){const nd=NODES.find(n=>n.id===ln.dataset.learn);if(!nd||nodeState(nd)!=='open'||C.pm<nd.cost)return;C.pm-=nd.cost;if(nd.mana)C.manas.push(nd.id);else C.hab.push(nd.id);saveC();sfx('flor');return renderHab()}
  const eqb=e.target.closest('[data-equip]');
  if(eqb){const [k,id]=eqb.dataset.equip.split(':');C.eq[k]=id;saveC();sfx('click');return renderTienda()}
  const m=e.target.closest('[data-mana]'); if(m){useMana(m.dataset.mana);return}
  const c=e.target.closest('[data-card]');
  if(c&&c.closest('#handP')&&G){
    const i=+c.dataset.card;
    if(H.feriaPick) feriaSwap(i); else act('p',{type:'play',idx:i});
    return;
  }
  const b=e.target.closest('[data-a]'); if(!b) return;
  const a=b.dataset.a;
  if(a==='musica'){SND.init();SND.want=!SND.mus;SND.setMusic(SND.want);saveAudio();updAudioUI();return}
  sfx('click');
  switch(a){
    case 'irMapa': modal('');return show('mapa');
    case 'irTienda': return show('tienda');
    case 'irInicio':{const now=Date.now();tapsInicio=tapsInicio.filter(t=>now-t<3000);tapsInicio.push(now);
      if(tapsInicio.length>=5){tapsInicio=[];C.plata+=1000;saveC();updPlata();sfx('flor');modal('<h2>Apareció un tío rico</h2><p>Te pasó $1000 por debajo de la mesa. No le digas a nadie.</p><div class="botones"><button class="btn hot" data-a="cerrar">Ta</button></div>');if(pantalla==='inicio')renderInicio();return}
      if(pantalla==='inicio')return;modal('');return show('inicio')}
    case 'irHab': return show('hab');
    case 'comoJugar': return comoJugar();
    case 'cerrar': return modal('');
    case 'cerrarAnuncio': if(H){H.toast=null;H.hold=0;step()} return;
    case 'jugarStop': return betModal();
    case 'betMenos': MATCH.tmpBet=Math.max(STOPS[selStop].min,MATCH.tmpBet-50);return betModal();
    case 'betMas': MATCH.tmpBet=Math.min(Math.min(C.plata,STOPS[selStop].min*4),MATCH.tmpBet+50);return betModal();
    case 'betMin': MATCH.tmpBet=STOPS[selStop].min;return betModal();
    case 'betMax': MATCH.tmpBet=Math.min(C.plata,STOPS[selStop].min*4);return betModal();
    case 'betOk': modal('');return startStop(STOPS[selStop],MATCH.tmpBet);
    case 'rapida': return startStop(QUICK,0);
    case 'revancha': modal('');if(MATCH.stop.id==='rapida')return startStop(QUICK,0);selStop=STOPS.indexOf(MATCH.stop);show('mapa');return betModal();
    case 'sigSerie': modal('');return newGame({rules:MATCH.serie.idx===1?'ar':'uy',target:15});
    case 'changa': return hacerChanga();
    case 'abandonar': return modal(`<h2>¿Te levantás de la mesa?</h2><p>${MATCH.bet?'Si abandonás, perdés los $'+MATCH.bet+' que apostaste.':'Es una partida de práctica, no perdés nada.'}</p><div class="botones"><button class="btn ghost" style="color:var(--borde);border-color:var(--borde)" data-a="cerrar">Sigo jugando</button><button class="btn red" data-a="abandonarOk">Abandonar</button></div>`);
    case 'abandonarOk': modal('');return show('mapa');
    case 'reset': return modal('<h2>¿Empezar la gira de nuevo?</h2><p>Perdés la plata, los mates, los termos y las paradas ganadas.</p><div class="botones"><button class="btn ghost" style="color:var(--borde);border-color:var(--borde)" data-a="cerrar">No</button><button class="btn red" data-a="resetOk">Sí, de cero</button></div>');
    case 'resetOk': C=freshCampaign();C.intro=true;saveC();selStop=0;modal('');return show('inicio');
  }
  if(!G) return;
  if(a==='repartir') return doDeal(false);
  if(a==='paquete') return doDeal(true);
  if(a==='cancelFeria'){H.feriaPick=false;return step()}
  if(a==='chicana') return chicana();
  if(a.startsWith('env-')) return act('p',{type:'envido',kind:a.slice(4)});
  act('p',{type:a});
});
ayudas.addEventListener('change',()=>render());
const vM=$('volMusica'),vS=$('volSfx');vM.value=Math.round(SND.musVol*100);vS.value=Math.round(SND.sfxVol*100);
vM.addEventListener('input',()=>{SND.musVol=vM.value/100;SND.setVolumes();saveAudio()});
vS.addEventListener('input',()=>{SND.sfxVol=vS.value/100;SND.init();SND.setVolumes();saveAudio()});
vS.addEventListener('change',()=>sfx('carta'));

selStop=Math.min(C.prog,STOPS.length-1);
window.__truco.api={chicana,canChicana,doDeal,paqReady,state:()=>({G,H,C,MATCH}),act,nextHand,newGame,manaOk,useMana,feriaSwap,cpuTurn,canEnvido,canTruco,mustFlor,startStop,STOPS,show};
show('inicio');
