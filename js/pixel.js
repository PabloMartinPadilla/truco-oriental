/* Truco Oriental · pixel art
   Paleta, sprites de mates, termos y retratos, y el dibujo de las cartas. */
/* ---------- pixel art ---------- */
const PAL={k:'#2b1d14',b:'#7fc8f8',y:'#5a7d2a',Y:'#8fb04a',g:'#3fbf5a',G:'#7be08a',s:'#c9ccd1',c:'#b07a3c',C:'#d9a35f',d:'#7a4f22',w:'#efe6d6',h:'#8a5a35',n:'#1e1a18',N:'#4a4440',R:'#ff6b5e',r:'#d9342b',S:'#e3e6ea',L:'#8a4b22',l:'#6e3a19',x:'#e8c27a',v:'#d6eef2',e:'#3a8f6a',E:'#6cc59a',o:'#f2c14e',O:'#c9902a',X:'#fff3a0',q:'#e8480f',Q:'#b23a0e',a:'#8dd3f5',A:'#3aa0e0',W:'#eef8ff',j:'#2f7d32',f:'#e0a878',F:'#c08050',m:'#d8d2c8',u:'#3b3f6e',p:'#4d6b8a'};
const SPR={
  plastico:["...........b....","..........b.....",".........b......","...kkkkkbkkk....","..kyyYyybyyyk...","..kyYyyyyyYyk...","..kGgggggggGk...","..kGgggggggGk...","..kGgggggggGk...","...kGgggggGk....","...kGgggggGk....","....kGgggGk.....","....kkkkkkk..y..","...........y.y..","................","................"],
  nona:["..........s.....",".........s......","...kkkkkskkk....","...kvyYyyyYvk...","...kvyyYyyyvk...","...kvyyyyYyvk...","...kvyYyyyyvk...","...kvyyyYyyvk...","...kvyyyyyyvk...","...kvvvvvvvvk...","....kkkkkkkk....","................","................","................","................","................"],
  pata:["...........s....","..........s.....",".........s......","...ssssssssss...","...syYyyysyYys..","...kkkkkkkkkk...","...kwhwwhwwhk...","...khwwhwhwwk...","...kwwhwwwhwk...","...khwhwwhwhk...","...kwwwhwwwwk...","...khwwwwhwhk...","..knnnnnnnnnnk..","..knNnnnnnnNnk..","..kknnnkknnnkk..","...kkkk..kkkk..."],
  tplastico:["......kkkk......",".....kRRRRk.....",".....kkkkkk.....","....kRrrrrRk....","....krrrrrrkkk..","....kRrrrrrk.k..","....kRwwwwrk.k..","....kRwwwwrkk...","....kRrrrrrk....","....kRrrrrrk....","....kRrrrrrk....","....kRrrrrrk..b.","....kRrrrrrk....","....kRrrrrrk.bb.",".....kkkkkk..bb.","................"],
  tampolla:["......kkkk......",".....kSSSSk.....",".....kkkkkk.....","....kEeeeeEk....","....keeeeeekkk..","....kEeeeeek.k..","....kEwwwwek.k..","....kEwwwwekk...","....kEeeeeek....","....kEeeeeek....","....kEeeeeek....","....kEeeeeek....","....kEeeeeek....","....kSssssSk....",".....kkkkkk.....","................"],
  tcampero:["......kkkk......",".....kSSSSk.....",".....kkkkkk.....","....kSssssSk....","....kSssssSk....","....kLlllllk....","....kLxlxllk....","....kLlllllkk...","....kLlllllk.k..","....kLxlxllk.k..","....kLlllllk.k..","....kLlllllkk...","....kLxlxllk....","....kSssssSk....",".....kkkkkk.....","................"],
  retrato:["....uuuuuu....","...uuuuuuuu...","..uuuuuuuuuuu.","..kffffffffk..","..ffkkffkkff..","..ffkwffwkff..","..ffffFFffff..","..fffFFFFfff..","..fmmmmmmmmf..","..ffmmffmmff..","..fffkkkkfff..","...ffffffff...","....ffffff....","...pppppppp..."]
};
const SUIT_SPR={
  oro:["................","................","................","......kkkk......","....kkooookk....","....koOOOOok....","...koOoooOOok...","...koOoOOoOok...","...koOoOOoOok...","...koOooooOok...","....koOOOOok....","....kkooookk....","......kkkk......","................","................","................"],
  copa:[".......kk.......","......koXk......","...kkkkoOkkkk...","..koaaaaaaWWok..",".koaAaaaaaaWWok.","koooooooooooooXk",".kQQqqqqqqqqqqk.",".kQQqqqkokqqqqk.",".kQQqqqkXkqqqqk.","..kQQqqqkqqqqk..","...kQQqqqqqqk...","....kkoXook.....","......kOok......",".....kooXok.....","...kOoooooXok...","...kkkkkkkkkk..."],
  espada:[".......kk.......","......kSsk......","......kSsk......","......kSsk......","......kSsk......","......kSsk......","......kSsk......","......kSsk......","......kSsk......","..kkkkkSskkkkk..","..kOooooooooOk..","..kkkkkookkkkk..","......kAak......","......kAak......",".....kooXok.....","......kkkk......"],
  basto:["......kkkk......",".....krXXrk.....","....kroXXork....","...kGGooggjjk...","...kGGooggjjk...","..koGGgogjjjk...","..koGGgogjjjk...","...kkGgXgjjk....","....kGgXgjjok...","....kGgXgjjok...","...koGGXgjjk....","...kokGggjk.....","....kkGggjok....",".....kGggjok....","......kggkk.....",".......kk......."]
};
const FIG={
  12:["o..o..o","oo.o.oo","ooooooo","oRoooRo","ooooooo"],
  11:["..kk...",".kddk..","kddddk.","kdkddk.","..kddk.","..kddk.",".kkkkk."],
  10:["..RRR..",".RRRRR.","RRRRRRR",".wwwww.",".wkwkw.",".wwwww."]
};
const DIG={0:["111","101","101","101","111"],1:["010","110","010","010","111"],2:["111","001","111","100","111"],3:["111","001","111","001","111"],4:["101","101","111","001","001"],5:["111","100","111","001","111"],6:["111","100","111","101","111"],7:["111","001","010","010","010"]};
const SUITCOL={oro:'#c9902a',copa:'#d9342b',espada:'#3d6fb0',basto:'#3f8f3a'};

function drawMatrix(ctx,mat,ox,oy,sc){mat.forEach((row,y)=>[...row].forEach((ch,x)=>{if(PAL[ch]){ctx.fillStyle=PAL[ch];ctx.fillRect(ox+x*sc,oy+y*sc,sc,sc)}}))}
function drawDigits(ctx,num,ox,oy,sc,col){
  ctx.fillStyle=col;
  String(num).split('').forEach((d,i)=>DIG[d].forEach((row,y)=>[...row].forEach((b,x)=>{if(b==='1')ctx.fillRect(ox+(i*4+x)*sc,oy+y*sc,sc,sc)})));
}
const imgCache={};
function sprite(name,scale){
  const key=name+scale; if(imgCache[key]) return imgCache[key];
  const mat=SPR[name], cv=document.createElement('canvas');
  cv.width=mat[0].length*scale; cv.height=mat.length*scale;
  drawMatrix(cv.getContext('2d'),mat,0,0,scale);
  return imgCache[key]=cv.toDataURL();
}
function cardImg(c){
  const key=c?c.id:'back'; if(imgCache[key]) return imgCache[key];
  const W=40,Hh=60,cv=document.createElement('canvas'); cv.width=W; cv.height=Hh; const x=cv.getContext('2d');
  x.fillStyle='#2b1d14'; x.fillRect(0,0,W,Hh);
  if(!c){
    x.fillStyle='#24406b'; x.fillRect(1,1,W-2,Hh-2);
    x.fillStyle='#3d6fb0'; for(let i=3;i<W-3;i+=2)for(let j=3;j<Hh-3;j+=2) if((i+j)%4===2) x.fillRect(i,j,1,1);
    x.fillStyle='#f3e7cf'; x.fillRect(2,2,W-4,1);x.fillRect(2,Hh-3,W-4,1);x.fillRect(2,2,1,Hh-4);x.fillRect(W-3,2,1,Hh-4);
    drawMatrix(x,["...R...","..RrR..",".RrorR.","RrooorR",".RrorR.","..RrR..","...R..."],16,26,1);
  } else {
    x.fillStyle='#f3e7cf'; x.fillRect(1,1,W-2,Hh-2);
    x.fillStyle=SUITCOL[c.suit]; x.fillRect(3,3,W-6,1);x.fillRect(3,Hh-4,W-6,1);x.fillRect(3,3,1,Hh-6);x.fillRect(W-4,3,1,Hh-6);
    x.fillStyle='#f3e7cf'; x.fillRect(3,12,1,3);x.fillRect(W-4,Hh-15,1,3);
    const w=String(c.num).length*4-1;
    drawDigits(x,c.num,5,5,1,'#2b1d14');
    drawDigits(x,c.num,W-5-w,Hh-10,1,'#2b1d14');
    const S=SUIT_SPR[c.suit];
    if(c.num>=10){ const f=FIG[c.num]; drawMatrix(x,f,20-f[0].length,8,2); drawMatrix(x,S,12,28,1); }
    else if(c.num===1){ drawMatrix(x,S,4,14,2); }
    else { drawDigits(x,c.num,17,9,2,SUITCOL[c.suit]); drawMatrix(x,S,12,25,1); }
  }
  x.clearRect(0,0,1,1);x.clearRect(W-1,0,1,1);x.clearRect(0,Hh-1,1,1);x.clearRect(W-1,Hh-1,1,1);
  return imgCache[key]=cv.toDataURL();
}
