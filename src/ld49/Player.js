import Character from "./Character";
import {mul, sum} from "../engine/vector2";

class Player extends Character {
  constructor(position) {
    super(position, 20, 3);
    this.velocity = 180;
  };

  update = (delta, inputHandler) => {
    let moving = true;
    // TODO priority & diagonals
    if (inputHandler.getKey('KeyW')) {
      this.direction = [0, -1];
    } else if (inputHandler.getKey('KeyS')) {
      this.direction = [0, 1];
    } else if (inputHandler.getKey('KeyA')) {
      this.direction = [-1, 0];
    } else if (inputHandler.getKey('KeyD')) {
      this.direction = [1, 0];
    } else {
      moving = false;
    }

    if (moving) {
      this.position = sum(this.position, mul(this.direction, this.velocity * delta / 1000));
      this.collider.position = sum(this.position, mul(this.direction, this.velocity * delta / 1000));
    }
  };

  draw = (scene, resources) => {
    const spriteSheet = this.direction[0] >= 0 ? '/res/player_right.png' : '/res/player_left.png';
    scene.drawImage(resources[spriteSheet], this.position[0] - 64, this.position[1] - 64, 128, 128);
    this.collider.draw(scene);
  };
}

export default Player;
