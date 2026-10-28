# Truco Oriental

Truco uruguayo en pixel art. Recorrés Uruguay de boliche en boliche apostando tu propia plata, con un mate que se lava, mañas bien criollas y un porteño esperándote en Colonia para la final.

## Cómo jugar

No hace falta instalar nada: abrí `index.html` en el navegador. También se puede publicar tal cual con GitHub Pages.

Para servirlo localmente:

```bash
npm start
```

## Qué tiene

- **Truco uruguayo completo:** muestra y piezas, flor y contraflor, envido, real envido y falta envido, truco, retruco y vale cuatro, irse al mazo. Partidas a 30 en malas y buenas.
- **La gira:** mapa de Uruguay con cinco paradas y rivales con estilos distintos.
  1. Montevideo, club de barrio: Don Rubén.
  2. La Paloma, Rocha: La Chola, que te lee la cara.
  3. Tacuarembó, Patria Gaucha: partida de a cuatro con el Tío Pocholo contra Don Aparicio y El Chiquito.
  4. Paysandú, Semana de la Cerveza: El Sanducero, mentiroso de ley.
  5. Colonia del Sacramento: la final contra El Porteño, al mejor de tres (uruguayo, argentino y desempate).
- **De a cuatro:** el compañero enfrente y los rivales a los costados, señas del tío al empezar cada mano y el pie como voz del equipo.
- **Plata y apuestas:** apostás antes de cada partida; si te fundís, hay changas.
- **Almacén de Don Tito:** mates y termos con habilidades distintas, pilchas gauchas y despensa. Lo que no usás se vende a la mitad.
- **El ombú:** árbol de habilidades con cinco ramas (Lengua, Manos, Ojo, Viveza y Garra) y habilidades que necesitan dos ramas.
- **Mate y termo:** las mañas cuestan cebadas; el mate se lava si abusás.
- **Mañas:** Mirada de reojo, Feria de Tristán Narvaja, Sudestada, La yapa, Paro general, Garra charrúa y Maracanazo.
- **Chicana y armar el paquete:** se cargan cada tantas manos y se mejoran en el ombú.
- **Cagazo:** tu pinta gaucha hace que el rival te quiera menos los cantos.
- **Sonido:** milonga campera con guitarra criolla de verdad, fogón y efectos.

Para probar compras: tocá 5 veces seguidas el botón **Inicio** y aparece un tío rico con $1000.

## Estructura

```
index.html            pantallas y orden de carga
css/estilos.css       estética pixel art, mesa, mapa, almacén y ombú
assets/guitarra.js    muestras de guitarra criolla en base64
js/reglas.js          mazo, muestra, piezas, jerarquía, envido, flor y ganador de la mano
js/pixel.js           paleta, sprites y dibujo de las cartas
js/sonido.js          música y efectos con Web Audio
js/catalogo.js        mates, termos, mañas, frases, paradas y guardado
js/habilidades.js     el ombú, la despensa, las pilchas y el cagazo
js/motor.js           estado de la partida, cantos, mañas, chicana e inteligencia de los rivales
js/mesa.js            dibujo de la mesa, avisos y botones
js/gira.js            partidas de la gira, apuestas, pantallas y mapa de Uruguay
js/pantallas.js       almacén, ombú, inicio y changas
js/eventos.js         clicks, volumen y arranque
tests/simular.js      simulador de partidas completas para detectar trabas
docs/diseno.md        documento de diseño
```

Los scripts son clásicos (sin módulos ni compilación) y comparten el ámbito global, así que el orden de carga en `index.html` importa.

## Pruebas

```bash
npm test
```

Simula partidas completas de todas las paradas, con todas las mañas y habilidades, y falla si el motor se traba.

## Créditos

- Muestras de guitarra: [tonejs-instruments](https://github.com/Makefully-Studios/tonejs-instruments) (MIT).
- Tipografías: Silkscreen y VT323, de Google Fonts (SIL Open Font License).
