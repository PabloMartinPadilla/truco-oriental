/* Truco Oriental · tutorial
   Guía ilustrada de "Cómo se juega", consejos de Don Rubén durante la partida
   y explicaciones la primera vez que se entra a cada pantalla. */

/* ---------- estado de los consejos ---------- */
if (!C.tips || typeof C.tips !== 'object') C.tips = {};
if (typeof C.tipsOff !== 'boolean') C.tipsOff = false;
let tipAbierto = null;
const colaTips = [];

const cartaMini = (num, suit, extra) =>
  `<span class="tut-carta${extra ? ' ' + extra : ''}"><img src="${cardImg({ num, suit, id: num + suit })}" alt="${num} de ${SUITP[suit]}"></span>`;

/* ---------- la caja de consejos ---------- */
function mostrarTip(id, titulo, html) {
  if (C.tipsOff || C.tips[id]) return;
  if (tipAbierto === id || colaTips.some(t => t.id === id)) return;
  colaTips.push({ id, titulo, html });
  if (!tipAbierto) siguienteTip();
}
function siguienteTip() {
  const t = colaTips.shift();
  const caja = $('consejo');
  if (!t) { tipAbierto = null; caja.innerHTML = ''; caja.hidden = true; return; }
  tipAbierto = t.id;
  C.tips[t.id] = true; saveC();
  if (H && H.dealPrompt) H.dealAuto = Date.now() + 20000;
  caja.hidden = false;
  caja.innerHTML = `<div class="consejo-box" role="dialog" aria-label="Consejo de Don Rubén">
    <img src="${sprite('ruben', 4)}" alt="">
    <div class="consejo-txt"><div class="consejo-t">${t.titulo}</div><div class="consejo-c">${t.html}</div>
    <div class="botones"><button class="btn hot" data-tip="ok">Entendido</button><button class="btn ghost" data-tip="off">No mostrar más consejos</button></div></div></div>`;
  const b = caja.querySelector('[data-tip="ok"]'); if (b) b.focus();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-tip]'); if (!b) return;
  if (b.dataset.tip === 'off') { C.tipsOff = true; saveC(); colaTips.length = 0; }
  siguienteTip();
  if (G && H) step();
});

/* ---------- cuándo aparece cada consejo ---------- */
function revisarTips() {
  if (C.tipsOff || !G || !H || pantalla !== 'juego') return;
  if (Date.now() < H.dealUntil) { const h = H; setTimeout(() => { if (H === h) revisarTips(); }, H.dealUntil - Date.now() + 120); return; }
  const uy = G.rules === 'uy';
  if (G.handNo === 1 && !H.ended) {
    mostrarTip('bienvenida', 'Así se juega una mano',
      'Cada uno tiene tres cartas. Se juegan tres rondas: <b>primera, segunda y tercera</b>. El que gana dos se lleva la mano. Para tirar, tocá una de tus cartas. Arriba, los fósforos cuentan los puntos: '+(G.target>15?'se juega a 30, primero las malas y después las buenas.':'esta partida es a 15, para ir aprendiendo.'));
  }
  if (uy && !H.ended) {
    const piezas = PIECE_ORDER.map(n => n === H.m.num ? 12 : n);
    mostrarTip('muestra', 'La muestra manda',
      `La carta del medio es la <b>muestra</b>. Su palo, ahora ${SUITP[H.m.suit]}, tiene las <b>piezas</b>: le ganan a cualquier otra carta. De mayor a menor:<div class="tut-fila">${piezas.map(n => cartaMini(n, H.m.suit)).join('')}</div>Si la muestra es una de esas, el 12 toma su lugar. Tus piezas llevan la etiqueta amarilla.`);
  }
  if (two() && !H.ended) {
    mostrarTip('cuatro', 'De a cuatro',
      'El Tío Pocholo está enfrente y es tu compañero. Al empezar cada mano te hace una seña: mirá la tabla de señas abajo de los botones. El que juega último de cada equipo, el <b>pie</b>, canta y responde por los dos.');
  }
  if (G.rules === 'ar' && !H.ended) {
    mostrarTip('argentino', 'Truco argentino',
      'En este juego no hay muestra, ni piezas, ni flor. El envido se cuenta con dos cartas del mismo palo más 20. Las bravas son las mismas: 1 de espadas, 1 de bastos, 7 de espadas y 7 de oros.');
  }
  if (H.toAct === 'p' && !H.pending && !H.ended && !H.busy) {
    mostrarTip('bravas', 'Las cartas bravas',
      `Después de las piezas vienen las bravas:<div class="tut-fila">${cartaMini(1, 'espada')}${cartaMini(1, 'basto')}${cartaMini(7, 'espada')}${cartaMini(7, 'oro')}</div>Y después, de mayor a menor: los 3, los 2, los 1 de copas y oros, 12, 11, 10, los 7 de copas y bastos, 6, 5 y 4.`);
  }
  if (canEnvido('p') && H.toAct === 'p') {
    mostrarTip('envido', 'El envido',
      `Antes de tirar tu primera carta podés cantar <b>envido</b>. Se cuenta con dos cartas del mismo palo más 20, o con una pieza más tu carta más alta. Gana el que tiene más. Ahora tenés <b>${envidoVal(H.orig.p, H.m)}</b>: lo ves siempre abajo, junto al mate.`);
  }
  if (mustFlor('p')) {
    mostrarTip('flor', '¡Tenés flor!',
      'Tres cartas del mismo palo, o piezas que la completen, son <b>flor</b>. Hay que cantarla antes de tirar tu primera carta. Vale 3 puntos y esa mano no se juega el envido.');
  }
  if (H.pending && H.pending.type === 'truco' && TEAM(H.pending.by) === 'c' && H.toAct === 'p') {
    mostrarTip('truco', 'Te cantaron truco',
      'Si querés, la mano pasa a valer 2. Si no querés, el rival se lleva 1. Podés subir: <b>retruco</b> vale 3 y <b>vale cuatro</b>, 4. Mentir es parte del juego: el que canta no siempre tiene.');
  }
  if (H.pending && H.pending.type === 'envido' && TEAM(H.pending.by) === 'c' && H.toAct === 'p') {
    mostrarTip('envidoResp', 'Te cantaron envido',
      `Si querés, se comparan los tantos: vos tenés <b>${envidoVal(H.orig.p, H.m)}</b>. Envido vale 2, real envido 3 y la falta envido lo que le falta al que va ganando. Si no querés, el rival se lleva 1.`);
  }
  if (G.handNo >= 2 && H.toAct === 'p' && !H.ended && MANAS.some(mn => C.manas.includes(mn.id) && manaOk(mn.id))) {
    mostrarTip('mate', 'El mate y las mañas',
      'Abajo está tu mate: cada mano cargás <b>cebadas</b> y las gastás en <b>mañas</b>, los botones de la derecha. Pasá el mouse o leé la descripción de cada una. Ojo: si usás mañas muchas manos seguidas, el mate se lava y deja de cargar.');
  }
  if (chicReady() && H.toAct === 'p' && !H.ended) {
    mostrarTip('chicana', 'La chicana está lista',
      'Tocá <b>Chicana</b> para picar al rival. Si grita fanfarrón, seguro tiene buenas cartas; si grita nervioso, tiene poco. A veces miente. Calentado, esa mano te quiere todo.');
  }
  if (H.dealPrompt) {
    mostrarTip('paquete', 'Te toca repartir',
      'Podés repartir normal o, si el paquete está cargado, <b>armar el paquete</b> y darte buenas cartas. Se carga con las manos jugadas. Si no tocás nada, se reparte solo.');
  }
  if (cagazo() > 0 && !H.ended) {
    mostrarTip('cagazo', 'El cagazo',
      'La barra roja junto al rival es el <b>cagazo</b> que te tiene. Con más pinta gaucha te quiere menos los cantos. Las pilchas se compran en el almacén.');
  }
}

/* ---------- explicaciones de cada pantalla ---------- */
function tipPantalla(s) {
  if (C.tipsOff || C.tips['pant_' + s]) return;
  const txt = {
    mapa: ['La gira', 'Cinco paradas, de Montevideo a Colonia. Tocá una para conocer al rival. Para jugar apostás de tu plata: si ganás cobrás el doble, y la primera vez también un premio. Si te quedás sin plata, hacé una changa. La <b>partida rápida</b> es para practicar sin apostar.'],
    tienda: ['El almacén de Don Tito', 'El <b>mate</b> decide cómo cargás las cebadas, el <b>termo</b> cuántas guardás, las <b>pilchas</b> le dan cagazo al rival y la <b>despensa</b> tiene ayudas para una sola partida. Lo que no usás, Don Tito te lo compra a la mitad.'],
    hab: ['El ombú', 'Acá aprendés habilidades con los <b>puntos de mesa</b> que ganás en la gira. Tocá una bolita para ver qué hace. Las que titilan ya las podés aprender; las violetas necesitan dos ramas.']
  }[s];
  if (!txt) return;
  C.tips['pant_' + s] = true; saveC();
  modal(`<div class="tut-cab"><img src="${sprite('ruben', 4)}" alt=""><h2>${txt[0]}</h2></div><p>${txt[1]}</p><div class="botones"><button class="btn hot" data-a="cerrar">Entendido</button></div>`);
}

/* ---------- guía ilustrada ---------- */
let guiaPag = 0;
function paginasGuia() {
  const m = { num: 4, suit: 'oro', id: '4oro' };
  const ej1 = [{ num: 6, suit: 'copa' }, { num: 7, suit: 'copa' }, { num: 3, suit: 'espada' }].map(c => ({ ...c, id: c.num + c.suit }));
  const ej2 = [{ num: 5, suit: 'oro' }, { num: 3, suit: 'basto' }, { num: 12, suit: 'copa' }].map(c => ({ ...c, id: c.num + c.suit }));
  return [
    ['De qué se trata', `<p>Truco uruguayo, uno contra uno (y de a cuatro en Tacuarembó). Cada uno recibe <b>tres cartas</b> y se juegan tres rondas: <b>primera, segunda y tercera</b>. El que gana dos se lleva la mano.</p><p>Se juega a <b>30 puntos</b>, en malas (los primeros 15) y buenas. Los puntos se ganan con el truco, el envido y la flor.</p>`],
    ['La muestra y las piezas', `<p>Al repartir se da vuelta una carta: la <b>muestra</b>. Su palo tiene las <b>piezas</b>, que le ganan a todo. Si la muestra es el 4 de oros, las piezas son, de mayor a menor:</p><div class="tut-fila">${cartaMini(4, 'oro', 'muestra')}<span class="tut-flecha">→</span>${cartaMini(2, 'oro')}${cartaMini(12, 'oro')}${cartaMini(5, 'oro')}${cartaMini(11, 'oro')}${cartaMini(10, 'oro')}</div><p>Normalmente son el 2, 4, 5, 11 y 10. Como acá el 4 es la muestra, el <b>12</b> toma su lugar.</p>`],
    ['El orden de las cartas', `<p>Después de las piezas vienen las <b>bravas</b>:</p><div class="tut-fila">${cartaMini(1, 'espada')}${cartaMini(1, 'basto')}${cartaMini(7, 'espada')}${cartaMini(7, 'oro')}</div><p>Y después, de mayor a menor: los 3, los 2, los 1 de copas y oros, 12, 11, 10, los 7 de copas y bastos, 6, 5 y 4. Si dos cartas empatan, la ronda es <b>parda</b>.</p>`],
    ['Envido y flor', `<p>Antes de tirar tu primera carta podés cantar <b>envido</b>: dos cartas del mismo palo suman 20 más sus números (las figuras valen 0).</p><div class="tut-fila">${ej1.map(c => cartaMini(c.num, c.suit)).join('')}<span class="tut-valor">${envidoVal(ej1, m)}</span></div><p>Con una pieza, se cuenta la pieza (el 2 vale 30, el 4 29, el 5 28, el 11 y el 10 27) más tu carta más alta:</p><div class="tut-fila">${ej2.map(c => cartaMini(c.num, c.suit)).join('')}<span class="tut-valor">${envidoVal(ej2, m)}</span></div><p>Con tres del mismo palo, o piezas que la completen, tenés <b>flor</b>: se canta sí o sí, vale 3 y anula el envido.</p>`],
    ['El truco', `<p>En cualquier momento podés cantar <b>truco</b>: la mano pasa a valer 2. El rival puede querer, no querer (y vos te llevás 1) o subir a <b>retruco</b> (3). Después viene el <b>vale cuatro</b> (4).</p><p>Si tenés poco, <b>irse al mazo</b> también es de vivo. Y acordate: en el truco se miente.</p>`],
    ['Mate, mañas y viveza', `<p>Tu mate carga <b>cebadas</b> cada mano. Con ellas usás <b>mañas</b>: mirar una carta del rival, ir a la feria a cambiar una tuya, la sudestada que cambia la muestra y más. Si abusás, el mate se lava.</p><p>La <b>chicana</b> hace gritar al rival y lo delata. <b>Armar el paquete</b> te da buenas cartas cuando repartís. Las dos se cargan cada tantas manos.</p>`],
    ['La gira', `<p>En el mapa hay cinco paradas, de Montevideo a Colonia, donde te espera el porteño. Antes de cada partida apostás de tu plata.</p><p>Con lo que ganes, comprá mates, termos y pilchas en el <b>almacén</b>. Con los puntos de mesa, aprendé habilidades en el <b>ombú</b>. ¡Suerte, y que no se te lave el mate!</p>`]
  ];
}
function guia(p) {
  const pags = paginasGuia();
  guiaPag = Math.max(0, Math.min(pags.length - 1, p));
  const [t, h] = pags[guiaPag];
  const ult = guiaPag === pags.length - 1;
  modal(`<div class="tut-cab"><img src="${sprite('ruben', 4)}" alt=""><div><div class="tut-paso">${guiaPag + 1} de ${pags.length}</div><h2>${t}</h2></div></div>
    <div class="tut-cuerpo">${h}</div>
    <div class="tut-puntos">${pags.map((_, i) => `<span class="${i === guiaPag ? 'on' : ''}"></span>`).join('')}</div>
    <div class="botones">${guiaPag ? '<button class="btn ghost tut-btn" data-guia="prev">Anterior</button>' : '<button class="btn ghost tut-btn" data-a="cerrar">Saltar</button>'}
    ${ult ? '<button class="btn hot" data-guia="fin">¡A jugar!</button>' : '<button class="btn hot" data-guia="next">Siguiente</button>'}</div>`);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-guia]'); if (!b) return;
  const a = b.dataset.guia;
  if (a === 'next') return guia(guiaPag + 1);
  if (a === 'prev') return guia(guiaPag - 1);
  if (a === 'fin') { modal(''); if (pantalla === 'inicio') renderInicio(); }
  if (a === 'abrir') return guia(0);
  if (a === 'tips') { C.tipsOff = !C.tipsOff; saveC(); return renderInicio(); }
  if (a === 'resetTips') { C.tips = {}; C.tipsOff = false; saveC(); renderInicio(); return modal('<h2>Consejos de nuevo</h2><p>Don Rubén te va a volver a explicar todo en la próxima partida.</p><div class="botones"><button class="btn hot" data-a="cerrar">Ta</button></div>'); }
});

/* ---------- enganches con el resto del juego ---------- */
comoJugar = () => guia(0);

const _step = step;
step = function () { _step(); revisarTips(); };

const _cpuTurn = cpuTurn;
cpuTurn = function () {
  if (tipAbierto) { clearTimeout(cpuTimer); cpuTimer = setTimeout(cpuTurn, 600); return; }
  _cpuTurn();
};

const _show = show;
show = function (s) {
  if (s !== 'juego') { colaTips.length = 0; tipAbierto = null; const c = $('consejo'); if (c) { c.innerHTML = ''; c.hidden = true; } }
  _show(s);
  if (s === 'mapa' || s === 'tienda' || s === 'hab') tipPantalla(s);
};

const _renderInicio = renderInicio;
renderInicio = function () {
  const primeraVez = !C.intro;
  _renderInicio();
  const menu = document.querySelector('#inicio .menu');
  if (menu) {
    const x = document.createElement('div');
    x.className = 'tut-opciones';
    x.innerHTML = `<button class="btn ghost" data-guia="tips">Consejos en la partida: ${C.tipsOff ? 'no' : 'sí'}</button><button class="btn ghost" data-guia="resetTips">Volver a ver los consejos</button>`;
    menu.appendChild(x);
  }
  if (primeraVez) {
    modal(`<div class="tut-cab"><img src="${sprite('ruben', 4)}" alt=""><h2>¡Bienvenido a la gira!</h2></div>
      <p>Soy Don Rubén. Arrancás con $500, un mate de plástico y un termo que gotea. Vas a recorrer el país de boliche en boliche, apostando tu plata, hasta llegar a Colonia, donde te espera el porteño.</p>
      <p>¿Nunca jugaste al truco uruguayo, o hace mucho? Te lo explico en un minuto. Igual, en la mesa te voy a ir dando consejos.</p>
      <div class="botones"><button class="btn ghost tut-btn" data-a="cerrar">Ya sé jugar</button><button class="btn hot" data-guia="abrir">Explicame</button></div>`);
  }
};

/* ---------- la primera partida contra Don Rubén es a 15 ---------- */
const esPrimeraConRuben = () => MATCH.stop && MATCH.stop.id === 'mvd' && !C.won.mvd;
const _newGame = newGame;
newGame = function (opts) {
  if (esPrimeraConRuben() && (opts.target || 30) === 30) opts = Object.assign({}, opts, { target: 15 });
  _newGame(opts);
};
const _renderMapa = renderMapa;
renderMapa = function () {
  _renderMapa();
  if (STOPS[selStop].id === 'mvd' && !C.won.mvd) {
    document.querySelectorAll('#parada dd').forEach(dd => { if (dd.textContent === 'Truco uruguayo a 30') dd.textContent = 'Truco uruguayo a 15, para arrancar'; });
  }
};
