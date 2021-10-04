import Obstacle from "./Obstacle.js";
import {dif} from "../engine/vector2.js";

class FirePit extends Obstacle {
  constructor(position) {
    super(position, 30);
    this._timeSinceFire = 0;
  }

  update = (delta) => {
    this._timeSinceFire += delta;
  };

  draw = (scene, resources) => {
    this.animate(scene, resources['res/fire_pit.png'], 4, 500,
      this._timeSinceFire, dif(this.position, [64, 96]), 128, 128);
  };
}

export default FirePit;
