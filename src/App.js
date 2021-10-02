import React from 'react';

// import { BoidGame } from "./test_boids/BoidGame";
import {Ld49Game} from "./ld49/Ld49Game";


function App() {

  const canvas = document.getElementById('canvas');
  const game = new Ld49Game(canvas);
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
