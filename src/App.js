import React from 'react';

import { BoidGame } from "./test_boids/BoidGame";


function App() {

  const canvas = document.getElementById('canvas');
  //const game = new MyGame(canvas);
  const game = new BoidGame(canvas);
  game.run();


  return (
    <div className="App">
      <button onClick={game.stop}>
        STOP APP
      </button>
    </div>
  );
}

export default App;
