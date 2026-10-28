/* Truco Oriental · reglas
   Mazo español, muestra, piezas, jerarquía, envido, flor y quién gana la mano. */


let RIVAL='Don Rubén';
const SUITS=['oro','copa','espada','basto'];
const SUITP={oro:'oros',copa:'copas',espada:'espadas',basto:'bastos'};
const NUMS=[1,2,3,4,5,6,7,10,11,12];
const PIECE_ORDER=[2,4,5,11,10];
const PIECE_ENV={2:30,4:29,5:28,11:27,10:27};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const opp=x=>x==='p'?'c':'p';
const $=id=>document.getElementById(id);

/* ---------- reglas ---------- */
function isPieza(c,m){
  if(c.suit!==m.suit) return false;
  if(PIECE_ORDER.includes(c.num)) return true;
  if(c.num===12) return PIECE_ORDER.includes(m.num);
  return false;
}
function piezaNum(c,m){return c.num===12?m.num:c.num}
function power(c,m){
  if(isPieza(c,m)) return 100+(5-PIECE_ORDER.indexOf(piezaNum(c,m)));
  if(c.num===1&&c.suit==='espada') return 50;
  if(c.num===1&&c.suit==='basto') return 49;
  if(c.num===7&&c.suit==='espada') return 48;
  if(c.num===7&&c.suit==='oro') return 47;
  return {3:40,2:39,1:38,12:37,11:36,10:35,7:34,6:33,5:32,4:31}[c.num];
}
function envVal(c,m){return isPieza(c,m)?PIECE_ENV[piezaNum(c,m)]:(c.num<=7?c.num:0)}
function florVal(hand,m){
  const pz=hand.filter(c=>isPieza(c,m)), np=hand.filter(c=>!isPieza(c,m));
  let has=false;
  if(pz.length>=2) has=true;
  else if(pz.length===1&&np[0].suit===np[1].suit) has=true;
  else if(pz.length===0&&hand.every(c=>c.suit===hand[0].suit)) has=true;
  if(!has) return null;
  if(!pz.length) return 20+hand.reduce((s,c)=>s+envVal(c,m),0);
  const pv=pz.map(c=>envVal(c,m)).sort((a,b)=>b-a);
  return pv[0]+pv.slice(1).reduce((s,v)=>s+v%10,0)+np.reduce((s,c)=>s+envVal(c,m),0);
}
function envidoVal(hand,m){
  const pz=hand.filter(c=>isPieza(c,m)), np=hand.filter(c=>!isPieza(c,m));
  if(pz.length){
    const best=Math.max(...pz.map(c=>envVal(c,m)));
    return best+(np.length?Math.max(...np.map(c=>envVal(c,m))):0);
  }
  let best=Math.max(...hand.map(c=>envVal(c,m)));
  for(const s of SUITS){
    const v=hand.filter(c=>c.suit===s).map(c=>envVal(c,m)).sort((a,b)=>b-a);
    if(v.length>=2) best=Math.max(best,20+v[0]+v[1]);
  }
  return best;
}
function handWinner(R,mano){
  const n=x=>R.filter(r=>r===x).length;
  if(n('p')>=2) return 'p';
  if(n('c')>=2) return 'c';
  if(R.length>=2){
    if(R[0]==='t'&&R[1]!=='t') return R[1];
    if(R[0]!=='t'&&R[1]==='t') return R[0];
  }
  if(R.length===3){
    if(R[2]!=='t') return R[2];
    return R.find(r=>r!=='t')||mano;
  }
  return null;
}
function fullDeck(){const d=[];for(const s of SUITS)for(const n of NUMS)d.push({suit:s,num:n,id:n+s});return d}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(c,m){const all=fullDeck().filter(o=>o.id!==c.id&&o.id!==m.id);const p=power(c,m);return all.filter(o=>power(o,m)<p).length/all.length}
function cardName(c){return c.num+' de '+SUITP[c.suit]}

window.__truco={isPieza,power,envidoVal,florVal,handWinner};
