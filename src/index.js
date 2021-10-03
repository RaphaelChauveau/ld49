'use strict';
//import React from 'react';
//import ReactDOM from 'react-dom';
// import App from './App';

import {Ld49Game} from "./ld49/Ld49Game.js";
// import * as serviceWorker from './serviceWorker';

console.log('APP');
const canvas = document.getElementById('canvas');
console.log('CANVAS', canvas);
const game = new Ld49Game(canvas);
console.log('GAME', game);
game.run();


//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
