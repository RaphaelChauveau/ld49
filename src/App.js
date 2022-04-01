import React from 'react';

import { BoidGame } from "./test_boids/BoidGame.js";
// import { Ld49Game } from "./ld49/Ld49Game";


function App() {

  console.log('APP');
  const canvas = document.getElementById('canvas');
  console.log('CANVAS', canvas);
  const game = new BoidGame(canvas);
  //const game = new Ld49Game(canvas);
  console.log('GAME', game);
  game.run();


  return (
    <div className="App">
    </div>
  );
}

export default App;
