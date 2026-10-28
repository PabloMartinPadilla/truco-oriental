/* Truco Oriental · habilidades, despensa y pilchas
   El ombú (árbol de habilidades), la despensa, las pilchas gauchas y el cagazo. */
/* ---------- árbol de habilidades, despensa y Don Tito ---------- */
SPR.tito=["....wwwwww....","...wwwwwwww...","..kffffffffk..","..ffkkffkkff..","..ffkwffwkff..","..ffffFFffff..","..fffFFFFfff..","..fmmmmmmmmf..","...ffkkkkff...","....ffffff....","..wwwwwwwwww..",".wwwwbbbbwwww.",".wwwwbbbbwwww.",".wwwwbbbbwwww."];
MANAS.push(
  {id:'garra',name:'Garra charrúa',cost:2,price:0,desc:'Si van perdiendo por 8 o más, la mano que ganes vale doble.'},
  {id:'maracanazo',name:'Maracanazo',cost:5,price:0,desc:'Una vez por partida: la próxima carta que tirás gana esa mano.'}
);
const TREE=[
  {rama:'La Lengua',sub:'Chicanas',nodes:[
    {id:'chicana0',n:'Chicana',d:'Calentás al rival: grita algo que suele delatar su mano y esa mano quiere todo. Cada 4 o 5 manos.',cost:0,base:true},
    {id:'lengua1',n:'Lengua larga',d:'Chicana cada 3 o 4 manos, y los gritos delatan más.',cost:2},
    {id:'lengua2',n:'Lengua de murguista',d:'Chicana cada 2 o 3 manos. Casi nunca te pueden mentir al gritar.',cost:3},
    {id:'lengua3',n:'Cuplé venenoso',d:'Tu chicana le saca 1 cebada al rival y esa mano no puede usar mañas.',cost:4}]},
  {rama:'Las Manos',sub:'Repartir',nodes:[
    {id:'paq0',n:'Armar paquete',d:'Cuando repartís, te das buenas cartas. Cada 6 o 7 manos.',cost:0,base:true},
    {id:'paq1',n:'Manos rápidas',d:'Paquete cada 5 o 6 manos.',cost:2},
    {id:'paq2',n:'Tallador de boliche',d:'Paquete cada 3 o 4 manos.',cost:3},
    {id:'paq3',n:'Paquete fino',d:'El paquete siempre te deja una pieza o un as bravo.',cost:4}]},
  {rama:'El Ojo',sub:'Información',nodes:[
    {id:'reojo',mana:true,n:'Mirada de reojo',d:'Maña. Ves una carta del rival por 2 segundos.',cost:0,base:true},
    {id:'paro',mana:true,n:'Paro general',d:'Maña. Nadie puede subir el truco esa mano.',cost:2},
    {id:'ojo2',n:'Ojo de lince',d:'La Mirada de reojo te muestra dos cartas durante 4 segundos.',cost:3}]},
  {rama:'La Viveza',sub:'Cartas',nodes:[
    {id:'feria',mana:true,n:'Feria de Tristán Narvaja',d:'Maña. Cambiás una carta tuya por una del mazo.',cost:0,base:true},
    {id:'sudestada',mana:true,n:'Sudestada',d:'Maña. Sale otra muestra y cambian las piezas.',cost:3},
    {id:'feria2',n:'Feria completa',d:'En la feria cambiás hasta dos cartas por el mismo precio.',cost:3}]},
  {rama:'La Garra',sub:'El tanto',nodes:[
    {id:'yapa',mana:true,n:'La yapa',d:'Maña. Si ganás el envido, sumás 1 punto más.',cost:0,base:true},
    {id:'garra',mana:true,n:'Garra charrúa',d:'Maña. Si van perdiendo por 8 o más, la mano que ganes vale doble. 2 cebadas.',cost:2},
    {id:'maracanazo',mana:true,n:'Maracanazo',d:'Maña, una vez por partida: la próxima carta que tirás gana esa mano. 5 cebadas.',cost:5}]}
];
const DESPENSA=[
  {id:'yerbapalo',n:'Yerba con palo',price:60,d:'Arrancás la próxima partida con 1 cebada más.',spr:'yerba1'},
  {id:'compuesta',n:'Yerba compuesta',price:90,d:'En la próxima partida el mate tarda una mano más en lavarse.',spr:'yerba2'},
  {id:'bizcochos',n:'Bizcochos de grasa',price:80,d:'La chicana arranca cargada en la próxima partida.',spr:'bizcocho'},
  {id:'garrapinada',n:'Garrapiñada',price:100,d:'El paquete arranca cargado en la próxima partida.',spr:'garrap'}
];
Object.assign(SPR,{
  yerba1:["................","....kkkkkkkk....","...kGGGGGGGGk...","...kGwwwwwwGk...","...kGwyyyywGk...","...kGwyYyywGk...","...kGwyyYywGk...","...kGwwwwwwGk...","...kGGGGGGGGk...","...kGrrrrrrGk...","...kGGGGGGGGk...","...kGGGGGGGGk...","...kGGGGGGGGk...","...kkkkkkkkkk...","................","................"],
  yerba2:["................","....kkkkkkkk....","...kooooooook...","...kowwwwwwok...","...kowyGyywok...","...kowGyGywok...","...kowyyGywok...","...kowwwwwwok...","...kooooooook...","...koeeeeeeok...","...kooooooook...","...kooooooook...","...kooooooook...","...kkkkkkkkkk...","................","................"],
  bizcocho:["................","................","....kkkkkkk.....","...kCCCCCCCk....","..kCcCcCcCcCk...","..kccccccccck...","..kCcCcCcCcCk...","...kkkkkkkkk....",".......kkkkkkk..","......kCCCCCCCk.",".....kCcCcCcCcCk",".....kccccccccck",".....kCcCcCcCcCk","......kkkkkkkkk.","................","................"],
  garrap:["................","......kkkk......",".....kwwwwk.....","....kwwwwwwk....","....kwCdCdwk....","...kwdCdCdCwk...","...kwCdCdCdwk...","...kwdCdCdCwk...","...kwCdCdCdwk...","...kwdCdCdCwk...","...kwCdCdCdwk...","...kwwwwwwwwk...","....kkkkkkkk....","................","................","................"]
});
function lenguaLvl(){return (hasHab('lengua1')?1:0)+(hasHab('lengua2')?1:0)}
function paqLvl(){return (hasHab('paq1')?1:0)+(hasHab('paq2')?1:0)}
function freshCampaign(){return {plata:500,pm:0,hab:[],despensa:{},pilchas:[],eqp:{},mates:['plastico'],termos:['tplastico'],manas:['reojo','yapa','feria'],eq:{mate:'plastico',termo:'tplastico'},prog:0,won:{},intro:false}}
(function migrar(){
  if(!Array.isArray(C.hab)) C.hab=[];
  if(!C.despensa) C.despensa={};
  if(typeof C.pm!=='number') C.pm=Object.keys(C.won||{}).length*3;
  if(C.chicana>=1&&!C.hab.includes('lengua1')) C.hab.push('lengua1');
  if(C.chicana>=2&&!C.hab.includes('lengua2')) C.hab.push('lengua2');
  if(C.paquete>=1&&!C.hab.includes('paq1')) C.hab.push('paq1');
  if(C.paquete>=2&&!C.hab.includes('paq2')) C.hab.push('paq2');
  saveC();
})();

/* ---------- pilchas gauchas y cagazo ---------- */
const SLOTS=[['cabeza','Cabeza'],['cuello','Cuello'],['abrigo','Abrigo'],['cintura','Cintura'],['piernas','Piernas'],['pies','Pies']];
const PILCHAS={
  boina:{n:'Boina',slot:'cabeza',price:150,pinta:1,d:'La de todos los días. Ya te miran distinto.'},
  sombrero:{n:'Sombrero de ala ancha',slot:'cabeza',price:450,pinta:2,d:'Negro, con barbijo de cuero. Hace sombra y respeto.'},
  panuelo:{n:'Pañuelo al cuello',slot:'cuello',price:100,pinta:1,d:'Colorado, bien anudado.'},
  chaleco:{n:'Chaleco de cuero',slot:'abrigo',price:300,pinta:1,d:'Curtido, con olor a fogón.'},
  poncho:{n:'Poncho de lana',slot:'abrigo',price:650,pinta:2,d:'Tejido a mano, con guardas. Imponente.'},
  faja:{n:'Faja colorada',slot:'cintura',price:150,pinta:1,d:'Te sostiene la bombacha y la dignidad.'},
  rastra:{n:'Rastra con monedas',slot:'cintura',price:750,pinta:2,d:'Cinto ancho con monedas de plata. Brilla en la mesa.'},
  bombacha:{n:'Bombacha de campo',slot:'piernas',price:250,pinta:1,d:'Holgada, con alforzas. Para montar o para trucar.'},
  alpargatas:{n:'Alpargatas',slot:'pies',price:120,pinta:1,d:'Negras, de lona. Las de siempre.'},
  botas:{n:'Botas de potro',slot:'pies',price:550,pinta:2,d:'De cuero crudo. Pisan fuerte en el boliche.'}
};
const FIG_BASE=["................","................","......nnnn......",".....nffffn.....",".....fkffkf.....",".....ffffff.....",".....ffmmff.....","......ffff......","....wwwwwwww....","...wwwwwwwwww...","...fwwwwwwwwf...","...fwwwwwwwwf...","...fwwwwwwwwf...","....wwwwwwww....","....NNNNNNNN....","....NNNNNNNN....","....NNN..NNN....","....NNN..NNN....","....NNN..NNN....","....NNN..NNN....","....NNN..NNN....","....fff..fff....","...ffff..ffff...","................"];
const FIG_LAYERS={
  bombacha:{14:"...SSSSSSSSSS...",15:"...SSSSSSSSSS...",16:"...SSSS..SSSS...",17:"..SSSSS..SSSSS..",18:"..SSSSS..SSSSS..",19:"...SSSS..SSSS...",20:"....SSS..SSS...."},
  alpargatas:{21:"....nnn..nnn....",22:"...wwww..wwww..."},
  botas:{18:"....lll..lll....",19:"....lll..lll....",20:"....lll..lll....",21:"....lll..lll....",22:"...llll..llll..."},
  chaleco:{8:"....LL....LL....",9:"....LLL..LLL....",10:"....LLL..LLL....",11:"....LLL..LLL....",12:"....LLL..LLL....",13:"....LLLLLLLL...."},
  poncho:{8:"...cccccccccc...",9:"..cCCCCCCCCCCc..",10:"..crrrrrrrrrrc..",11:"..cCCCCCCCCCCc..",12:"..cccccccccccc..",13:"..crrrrrrrrrrc..",14:"...cccccccccc..."},
  faja:{14:"....rrrrrrrr...."},
  rastra:{14:"....kssssssk...."},
  panuelo:{7:".....rrrrrr.....",8:"......rrrr......"},
  boina:{1:"......uuuu......",2:"....uuuuuuuu...."},
  sombrero:{0:".....nnnnnn.....",1:".....nnnnnn.....",2:"..nnnnnnnnnnnn.."}
};
const FIG_ORDER=['bombacha','alpargatas','botas','chaleco','poncho','faja','rastra','panuelo','boina','sombrero'];
function figura(eqp,scale){
  const rows=FIG_BASE.map(r=>r.split(''));
  for(const id of FIG_ORDER){if(!Object.values(eqp||{}).includes(id))continue;const L=FIG_LAYERS[id];
    for(const y in L)L[y].split('').forEach((ch,x)=>{if(ch!=='.')rows[y][x]=ch})}
  const cv=document.createElement('canvas');cv.width=16*scale;cv.height=24*scale;const x=cv.getContext('2d');
  if(!x||!x.fillRect) return '';
  rows.forEach((r,y)=>r.forEach((ch,X)=>{if(PAL[ch]){x.fillStyle=PAL[ch];x.fillRect(X*scale,y*scale,scale,scale)}}));
  return cv.toDataURL();
}
function pinta(){return Object.values(C.eqp||{}).reduce((s,id)=>s+(PILCHAS[id]?PILCHAS[id].pinta:0),0)}
STOPS[0].ai.aguante=0;STOPS[1].ai.aguante=0.2;STOPS[2].ai.aguante=0.4;STOPS[3].ai.aguante=0.1;STOPS[4].ai.aguante=0;
(function(){if(!Array.isArray(C.pilchas))C.pilchas=[];if(!C.eqp)C.eqp={};saveC()})();

/* ---------- el ombú: árbol de habilidades como grafo ---------- */
const RAMAS={garra:{n:'La Garra',sub:'El tanto',col:'#e0703d',ang:162},lengua:{n:'La Lengua',sub:'Chicanas',col:'#e0533d',ang:126},manos:{n:'Las Manos',sub:'Repartir',col:'#f2c14e',ang:90},ojo:{n:'El Ojo',sub:'Información',col:'#7ec8f0',ang:54},viveza:{n:'La Viveza',sub:'Cartas',col:'#8fb04a',ang:18}};
const NODES=[{id:'raiz',n:'Tu mesa',d:'Donde empieza todo: un mate, un mazo y ganas de trucar.',cost:0,base:true,rama:null,req:[]}];
for(const r of TREE){const key={'La Lengua':'lengua','Las Manos':'manos','El Ojo':'ojo','La Viveza':'viveza','La Garra':'garra'}[r.rama];
  r.nodes.forEach((nd,k)=>NODES.push(Object.assign({},nd,{rama:key,k,req:[k?r.nodes[k-1].id:'raiz']})))}
NODES.push(
  {id:'versopicante',n:'Verso picante',d:'Cuando cantás flor, la chicana queda cargada.',cost:3,rama:'combo',req:['yapa','lengua1'],between:['garra','lengua'],k:1.6},
  {id:'garracampeon',n:'Garra de campeón',d:'Cuando usás la Garra charrúa, el rival te agarra cagazo: +3 en la barra esa mano.',cost:4,rama:'combo',req:['garra','lengua2'],between:['garra','lengua'],k:2.9},
  {id:'ojotallador',n:'Ojo de tallador',d:'Cuando reparte el rival, le ves una carta al terminar el reparto.',cost:4,rama:'combo',req:['paq2','ojo2'],between:['manos','ojo'],k:2.6},
  {id:'manero',n:'Mañero',d:'Si van perdiendo, todas las mañas cuestan 1 cebada menos.',cost:3,rama:'combo',req:['paro','feria'],between:['ojo','viveza'],k:1.4}
);
function nodePos(nd){
  const O={x:500,y:455};
  if(nd.id==='raiz') return {x:500,y:560};
  const at=(ang,k)=>{const a=ang*Math.PI/180,d=105+k*98;return {x:O.x+Math.cos(a)*d*1.18,y:O.y-Math.sin(a)*d}};
  if(nd.rama==='combo'){const a=(RAMAS[nd.between[0]].ang+RAMAS[nd.between[1]].ang)/2;return at(a,nd.k)}
  return at(RAMAS[nd.rama].ang,nd.k);
}
function hasHab(id){
  const nd=NODES.find(n=>n.id===id); if(!nd) return false;
  if(nd.base) return true; if(nd.mana) return C.manas.includes(id); return C.hab.includes(id);
}
function nodeState(nd){return hasHab(nd.id)?'own':nd.req.every(hasHab)?'open':'lock'}
const NODE_ICON={
  raiz:null,
  lengua:["........",".kkkkkk.","krrrrrrk","kwwwwwwk","kRrrrrRk",".kkkkkk.","........","........"],
  manos:["..k.k...",".kfkfk..",".kfkfkk.",".kffffk.","kfffffk.",".kffffk.","..kfffk.","...kkk.."],
  ojo:["........","..kkkk..",".kwwwwk.","kwwkkwwk","kwwkkwwk",".kwwwwk.","..kkkk..","........"],
  viveza:[".kkkkk..",".kwwwk..",".kwrwk..",".kwwwk..",".kwrwk..",".kwwwk..",".kkkkk..","........"],
  garra:["........",".kkkkk..","kfkfkfk.","kfffffk.","kfffffk.",".kffffk.","..kkkk..","........"],
  combo:["...kk...","..kook..",".kooook.","kooXXook",".kooook.","..kook..","...kk...","........"]
};
function iconImg(key){
  const k='ico_'+key; if(imgCache[k]) return imgCache[k];
  const mat=NODE_ICON[key]; const cv=document.createElement('canvas');cv.width=24;cv.height=24;const x=cv.getContext('2d');
  if(!x||!x.fillRect) return '';
  drawMatrix(x,mat,0,0,3); return imgCache[k]=cv.toDataURL();
}
