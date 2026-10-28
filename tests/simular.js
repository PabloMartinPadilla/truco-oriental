// Simula partidas completas de la gira (1 contra 1, de a cuatro y la final al mejor de tres)
// para detectar trabas del motor. Uso: npm test  (o node tests/simular.js [vueltas])
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const vueltas = Number(process.argv[2] || 10);
let reloj = 1e12;
const cola = [];
const ctx2d = new Proxy({}, { get: (t, k) => (k === 'canvas' ? {} : () => {}), set: () => true });
const elemento = () => ({
  innerHTML: '', textContent: '', checked: true, value: '60', src: '', alt: '', hidden: false, style: {},
  classList: { toggle() {}, add() {}, remove() {} }, scrollTop: 0, scrollHeight: 0,
  addEventListener() {}, closest() { return null; }, querySelector() { return null; }, focus() {},
  getContext: () => ctx2d, width: 0, height: 0, toDataURL: () => 'x',
});
const elementos = {};
const sandbox = {
  console, Math, JSON, Object, Array, Set, Promise, Number, String,
  Date: { now: () => (reloj += 400) },
  setTimeout: (f) => { cola.push(f); return cola.length; }, clearTimeout() {},
  setInterval: () => 0, clearInterval() {},
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  localStorage: { _s: {}, getItem(k) { return this._s[k] || null; }, setItem(k, v) { this._s[k] = v; } },
  Image: function () {},
  document: {
    getElementById: (id) => elementos[id] || (elementos[id] = elemento()),
    addEventListener() {}, createElement: () => elemento(), body: { classList: { toggle() {} } },
  },
};
sandbox.window = sandbox;
sandbox.window.scrollTo = () => {};
vm.createContext(sandbox);

const orden = require('./orden.json').filter((f) => !f.startsWith('assets/'));
sandbox.GUITAR_SAMPLES = {};
const codigo = orden.map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n;\n');
vm.runInContext(codigo, sandbox);

const T = sandbox.__truco.api;
const vaciar = () => { while (cola.length) cola.shift()(); };

function jugar() {
  for (let pasos = 0; pasos < 20000; pasos++) {
    vaciar();
    const { G, H, MATCH } = T.state();
    if (!G) return 'sin partida';
    if (G.over) {
      vaciar();
      const S = MATCH.serie;
      const g = S && S.res.filter((r) => r === 'p').length, p = S && S.res.filter((r) => r === 'c').length;
      if (S && g < 2 && p < 2) { T.newGame({ rules: S.idx === 1 ? 'ar' : 'uy', target: 15 }); continue; }
      return S ? S.res.join('') : (G.score.p >= G.target ? 'p' : 'c');
    }
    if (H.ended) { if (H.dealPrompt) T.doDeal(T.paqReady() && Math.random() < 0.5); continue; }
    if (H.toAct !== 'p') throw new Error('El motor quedó esperando a ' + H.toAct);
    if (H.feriaPick) { T.feriaSwap(0); continue; }
    const r = Math.random();
    for (const id of ['reojo', 'sudestada', 'yapa', 'paro', 'feria', 'garra', 'maracanazo'])
      if (r < 0.08 && T.manaOk(id)) { T.useMana(id); break; }
    if (T.state().H.feriaPick) continue;
    if (T.mustFlor('p')) { T.act('p', { type: 'flor' }); continue; }
    if (r < 0.1 && T.canChicana()) { T.chicana(); continue; }
    if (T.state().H.pending) { T.act('p', { type: Math.random() < 0.6 ? 'quiero' : 'noquiero' }); continue; }
    if (r < 0.15 && T.canEnvido('p')) { T.act('p', { type: 'envido', kind: 'envido' }); continue; }
    if (r < 0.25 && T.canTruco('p')) { T.act('p', { type: 'truco' }); continue; }
    T.act('p', { type: 'play', idx: 0 });
  }
  throw new Error('La partida no terminó');
}

const res = {};
for (let k = 0; k < vueltas; k++) {
  for (const s of T.STOPS) {
    const { C } = T.state();
    C.plata = 10000;
    C.manas = ['reojo', 'yapa', 'feria', 'paro', 'sudestada', 'garra', 'maracanazo'];
    C.hab = ['lengua1', 'lengua2', 'lengua3', 'paq1', 'paq2', 'paq3', 'ojo2', 'feria2', 'versopicante', 'garracampeon', 'ojotallador', 'manero'];
    C.eqp = { cabeza: 'sombrero', abrigo: 'poncho', pies: 'botas' };
    T.startStop(s, s.min);
    const r = jugar();
    res[s.id + ':' + r] = (res[s.id + ':' + r] || 0) + 1;
  }
}
console.log('Partidas simuladas sin trabas:', vueltas * T.STOPS.length);
console.log(res);
