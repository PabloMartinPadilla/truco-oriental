/* Truco Oriental · catálogo y gira
   Mates, termos, mañas, frases, paradas de la gira y guardado de la campaña. */
/* ---------- sprites nuevos ---------- */
Object.assign(PAL,{a:'#8dd3f5',z:'#6d6355'});
Object.assign(SPR,{
  calabaza:["..........s.....",".........s......","........s.......","....ssssssss....","...syyYysyyys...","...kkkkkkkkkk...","..kcCccccccCck..",".kcCcccccccccck.",".kcCcccccccccck.",".kccccccccccdck.",".kcccccccccdcck.","..kcccccccddck..","...kccccdddck...","....kkkkkkkk....","................","................"],
  algarrobo:["..........s.....",".........s......","...kkkkkkskk....","...kyYyyysyyk...","...khhdhhhhhk...","...khhhhdhhhk...","...khdhhhhhhk...","...khhhhhdhhk...","...khhdhhhhhk...","....khhhhhdk....","....khhdhhhk....","....kkkkkkkk....","................","................","................","................"],
  guampa:["...........s....","..........s.....",".........s......","..sssssssss.....","..kyYyysyyk.....","..kwwwwwwwk.....","..kwwwhwwwk.....","...kwwwwwwk.....","...kwwhwwwk.....","....kwwwwwk.....","....kwwwwk......",".....kwwwk......","......kwnk......","......knnk......",".......kk.......","................"],
  pava:["................",".......kk.......","......kNNk......","....kkkkkkkk....","...kSSSSSSSSk..k","..kSssssssssSkkk","..kSssssssssSk..","..kSssssssssSk..","..kSssssssssSk..","..kSssssssssSk..","...kSssssssSk...","....kkkkkkkk....","................","................","................","................"],
  tacero:["......kkkk......",".....kSSSSk.....",".....kkkkkk.....","....kSssssSk....","....ksssssskkk..","....kSssssskk.k.","....kSNNNNskk.k.","....kSNNNNskkk..","....kSssssskk...","....kSsssssk....","....kSsssssk....","....kSsssssk....","....kSsssssk....","....kSssssSk....",".....kkkkkk.....","................"],
  tmatera:["......kkkk......",".....kSSSSk.....",".....kkkkkk.....","....kSssssSk....","....kSssssSkkk..","....kLlllllk.k..","....kLlllllk.k..","....kLlllllkk...","....kLlllllk....","....kLlllllk....","....kLlllllk....","....kSssssSk....","....kSssssSk....","....kSssssSk....",".....kkkkkk.....","................"],
  ruben:SPR.retrato,
  chola:["....nnnnnn....","...nnnnnnnn...","..nnffffffnn..","..nffffffffn..","..nkkkffkkkn..","..nkkkffkkkn..","..nfffFFfffn..",".nnffffffffnn.",".nnffRRRRffnn.",".nnfffffffnn..",".nn.ffffff.nn.",".nnrrrrrrrrnn.","..rrrrrrrrrr..",".rrrrrrrrrrrr."],
  aparicio:["....nnnnnn....","....nnnnnn....","nnnnnnnnnnnnnn","..kffffffffk..","..ffkkffkkff..","..ffkwffwkff..","..ffffFFffff..","..fdffFFffdf..","..dddddddddd..","..ddddkkdddd..","...dddddddd...","....dddddd....","...rrrrrrrr...","..rrrrrrrrrr.."],
  sanducero:["...uuuuuuu....","..uuuuuuuuu...","..uuuuuuuuuuuu","..kffffffffk..","..ffkkffkkff..","..ffkwffwkff..","..ffffFFffff..","..fffFFFFfff..","..ffkffffkff..","..fffkkkkfff..","...ffffffff...","....ffffff....","...oooooooo...","..oooooooooo.."],
  pocholo:["..............","....ffffff....","...ffffffff...","..kffffffffk..","..fkkkffkkkf..","..fkwkffkwkf..","..fkkkffkkkf..","..ffffFFffff..","..fffFFFFfff..","..fmmmmmmmmf..","..ffmmffmmff..","...ffkkkkff...","....ffffff....","..gggggggggg.."],
  chiquito:["...nnnnnnnn...","..nnnnnnnnnn..",".kffffffffffk.",".ffkkffffkkff.",".ffkwffffwkff.",".fffffFFfffff.",".fdddFFFFdddf.",".dddddddddddd.",".dddddkkddddd.",".dddddddddddd.","..dddddddddd..","..hhhhhhhhhh..","hhhhhhhhhhhhhh","hhhhhhhhhhhhhh"],
  porteno:["...nnnnnnnn...","..nnNNnnnnnn..","..nnnnnnnnnn..","..nffffffffn..","..ffkkffkkff..","..ffkwffwkff..","..ffffFFffff..","..fffFFFFfff..","..ffnnnnnnff..","..fffkkkkfff..","...ffffffff...","....ffffff....","...awawawawa..","..awawawawawa."]
});

/* ---------- catálogo: mates, termos, mañas ---------- */
const MATES={
  plastico:{n:'Mate de plástico',spr:'plastico',price:0,lav:2,hab:'Sin habilidad. Se lava rápido: 2 manos seguidas con mañas.'},
  nona:{n:'Vaso de la nona',spr:'nona',price:300,lav:3,hab:'La nona te ceba el primero: arrancás cada partida con 2 cebadas más.'},
  algarrobo:{n:'Mate de algarrobo',spr:'algarrobo',price:700,lav:3,hab:'Cada envido o flor que ganás te carga 1 cebada.'},
  calabaza:{n:'Calabaza curada',spr:'calabaza',price:1100,lav:4,hab:'Mirada de reojo y Feria de Tristán Narvaja cuestan 1 cebada menos.'},
  guampa:{n:'Mate de guampa',spr:'guampa',price:1600,lav:4,hab:'Garra: si perdés la primera, recuperás 1 cebada.'},
  pata:{n:'Mate de pata de vaca',spr:'pata',price:2500,lav:5,lavMin:1,hab:'Nunca se lava del todo, y cada mano ganada te carga 2 cebadas extra.'},
  pava:{n:'La pava, de una',spr:'pava',price:null,lav:99,hab:'Premio por ganarle al porteño. Mate y termo en uno: 10 cebadas y nunca se lava.'}
};
const TERMOS={
  tplastico:{n:'Termo de plástico',spr:'tplastico',price:0,cap:4,hab:'Gotea: perdés 1 cebada cada 3 manos sin usar mañas.'},
  tampolla:{n:'Termo de ampolla',spr:'tampolla',price:400,cap:5,hab:'No gotea. Ojo: si perdés una mano a vale cuatro, se te sacude la ampolla y perdés 2 cebadas.'},
  tacero:{n:'Termo de acero',spr:'tacero',price:900,cap:6,hab:'Aguanta todo: arrancás cada partida con 1 cebada más.'},
  tmatera:{n:'Termo con matera de cuero',spr:'tmatera',price:1500,cap:7,hab:'La primera maña de cada partida te sale gratis.'},
  tcampero:{n:'Termo campero',spr:'tcampero',price:2600,cap:8,hab:'Cada truco querido, por vos o por el rival, te carga 1 cebada.'}
};
const MANAS=[
  {id:'reojo',name:'Mirada de reojo',cost:2,price:0,desc:'Ves una carta del rival por 2 segundos.'},
  {id:'yapa',name:'La yapa',cost:1,price:0,desc:'Si ganás el envido, sumás 1 punto más.'},
  {id:'feria',name:'Feria de Tristán Narvaja',cost:2,price:0,desc:'Cambiás una carta tuya por una del mazo, sin verla.'},
  {id:'paro',name:'Paro general',cost:2,price:500,desc:'Nadie puede subir el truco esta mano.'},
  {id:'sudestada',name:'Sudestada',cost:4,price:900,desc:'El viento da vuelta otra muestra. Cambian las piezas.'}
];
const VERSOS=["Mate amargo, bizcochito: flor te canto despacito.","Del Cerro a Tacuarembó, esta flor la tengo yo.","Ceibo rojo en la ribera, flor te canto a mi manera.","En la rambla sopla el viento, flor y me quedo contento.","Llueve y hay tortas fritas: flor, y vos con las manitas."];
const FR={
  truco:["¡Truco, bo!","¡Truco! A ver si te la bancás.","Truco, y no me mires así."],
  retruco:["¡Quiero retruco!","Retruco, botija."],
  vale:["¡Quiero vale cuatro!","¡Vale cuatro, que hoy pago yo!"],
  quiero:["Quiero.","Dale, quiero.","Ta, quiero."],
  noquiero:["No quiero.","Esa no, gracias.","Ni a palos."],
  mazo:["Me voy al mazo, ta."],
  envido:["Envido.","Envido, a ver qué tenés."],real:["Real envido."],falta:["¡Falta envido!"],
  chicana:["¿Y? ¿Querés o no querés?","Esa te la guardo.","Tomate un mate y pensalo.","La muestra no perdona, eh."]
};
const TRUCO_N={2:'Truco',3:'Retruco',4:'Vale cuatro'};
const TRUCO_K={2:'truco',3:'retruco',4:'vale'};
const DUMMY_M={suit:'x',num:0,id:'none'};

/* ---------- la gira ---------- */
const STOPS=[
  {id:'mvd',lugar:'Montevideo',sitio:'Club de barrio',rival:'Don Rubén',spr:'ruben',min:100,premio:100,lon:-56.19,lat:-34.9,
   desc:'El veterano del club. Juega derecho, casi nunca miente y te enseña a perder con dignidad.',ai:{bluff:0.04,env:0,truco:0,mana:0.25,lee:0},frase:'Sentate, botija. El mate está pronto.'},
  {id:'rocha',lugar:'La Paloma, Rocha',sitio:'Parador de la playa',rival:'La Chola',spr:'chola',min:150,premio:150,lon:-54.16,lat:-34.66,
   desc:'Desde la carpa de al lado te lee la cara. Si dudás, ella ya lo sabe.',ai:{bluff:0.06,env:0.02,truco:0.05,mana:0.35,lee:0.35},frase:'Con este sol no me hacés trampa, eh.'},
  {id:'tbo',lugar:'Tacuarembó',sitio:'Fiesta de la Patria Gaucha',rival:'Don Aparicio',spr:'aparicio',min:250,premio:250,lon:-55.98,lat:-31.71,
   desc:'Partida de a cuatro junto al fogón: vos y el Tío Pocholo contra el payador Don Aparicio y su hijo, El Chiquito. Cantan envido con cualquier cosa.',ai:{bluff:0.08,env:0.18,truco:0.04,mana:0.3,lee:0.1},frase:'Arrime la silla al fogón, compañero.',duo:{partner:'Tío Pocholo',rival2:'El Chiquito',sprP:'pocholo',sprR2:'chiquito',frase:'Vos tranquilo, sobrino, que yo te hago las señas.'}},
  {id:'pay',lugar:'Paysandú',sitio:'Semana de la Cerveza',rival:'El Sanducero',spr:'sanducero',min:400,premio:400,lon:-58.08,lat:-32.32,
   desc:'Mentiroso de ley. Te canta truco con un cuatro de copas y te mira a los ojos.',ai:{bluff:0.22,env:0.06,truco:0.14,mana:0.35,lee:0.15},frase:'¿Una partidita mientras toca la banda?'},
  {id:'col',lugar:'Colonia del Sacramento',sitio:'Final en el puerto',rival:'El Porteño',spr:'porteno',min:600,premio:1000,lon:-57.84,lat:-34.47,final:true,
   desc:'Cruzó el charco para llevarse la gloria. Al mejor de tres juegos a 15: uno uruguayo, uno argentino y el desempate en casa.',ai:{bluff:0.12,env:0.08,truco:0.1,mana:0.5,lee:0.25},frase:'Che, vine a ganar. ¿Arrancamos?'}
];
const QUICK={id:'rapida',lugar:'Partida rápida',sitio:'Sin apuesta',rival:'Don Rubén',spr:'ruben',min:0,premio:0,ai:STOPS[0].ai,frase:'Una de práctica, nomás.'};

let C;
function freshCampaign(){return {chicana:0,paquete:0,plata:500,mates:['plastico'],termos:['tplastico'],manas:['reojo','yapa','feria'],eq:{mate:'plastico',termo:'tplastico'},prog:0,won:{},intro:false}}
function saveC(){try{localStorage.setItem('truco-gira',JSON.stringify(C))}catch(e){}}
function loadC(){try{const s=JSON.parse(localStorage.getItem('truco-gira')||'null');if(s&&typeof s.plata==='number') return Object.assign(freshCampaign(),s)}catch(e){}return freshCampaign()}
C=loadC();

const MATCH={stop:null,bet:0,serie:null}; // serie: {games:[], idx}
function eqMate(){return MATES[C.eq.mate]}
function eqTermo(){return TERMOS[C.eq.termo]}
function cap(){return C.eq.mate==='pava'?10:eqTermo().cap}
function manaCost(mn){let c=mn.cost;if(typeof hasHab==='function'&&hasHab('manero')&&G&&G.score.c>G.score.p)c=Math.max(0,c-1);if(C.eq.mate==='calabaza'&&(mn.id==='reojo'||mn.id==='feria'))c=Math.max(0,c-1);if(G&&G.freeMana&&!G.freeUsed)c=0;return c}
