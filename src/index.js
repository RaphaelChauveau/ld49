'use strict';

import {Ld49Game} from "./ld49/Ld49Game.js";

console.log('APP');
const canvas = document.getElementById('canvas');
console.log('CANVAS', canvas);
const game = new Ld49Game(canvas);
console.log('GAME', game);
game.run();
