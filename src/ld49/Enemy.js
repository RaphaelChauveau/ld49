
// PNJ before ?
import Character from "./Character";
import {dif, div, magnitude, mul, sum} from "../engine/vector2";

class Enemy extends Character {
  constructor(position, player) {
    super(position, 20, 1);
    this.target = player.position;
    this.state = "CHASE";
    this.range = this.collider.radius + 22;

  }

  update = (delta, player) => {
    // update timings
    // this._timeSinceLastAttack += delta;

    // update effects
    // this._applyEffects(delta);

    // face player
    this.target = player.position;
    //this.targetX = player.positionX;
    //this.targetY = player.positionY;

    if (this.target[0] === this.position[0] && this.target[1] === this.position[1]) {
      return; // TODO ? maybe not
    }
    //const toTargetX = this.targetX - this.positionX;
    //const toTargetY = this.targetY - this.positionY;

    const toTarget = dif(this.target, this.position);

    const magn = magnitude(toTarget);
    this.direction = div(toTarget, magn);

    switch (this.state) {
      case "CHASE": {
        console.log(magn, this.range);
        if (magn < this.range) {
          /* if (this._timeSinceLastAttack > this.attackCooldown) {
            this._timeSinceLastAttack = 0;
            this.state = "ATTACK";
          } */
          return;
        }

        /*let hasEffect = false;
        for (const effect of this.effects) {
          if (!effect.over) {
            hasEffect = true;
          }
        }
        if (hasEffect) {
          break;
        }*/

        const timedVelocity = this.velocity * delta / 1000;
        this.position = sum(this.position, mul(this.direction, timedVelocity));
        // this.positionX += this.dirX * timedVelocity;
        // this.positionY += this.dirY * timedVelocity;
        this.collider.position = this.position;
        break;
      }
      case "ATTACK": {
        /*if (this._timeSinceLastAttack > this.attackDuration) {
          this.state = "CHASE";
          return;
        }*/
        break;
      }
      default: {

      }
    }

  };

  draw = (scene, resources) => {
    const spriteSheet = this.direction[0] >= 0 ? '/res/player_right.png' : '/res/player_left.png';
    scene.drawImage(resources[spriteSheet], this.position[0] - 64, this.position[1] - 64, 128, 128);
    this.collider.draw(scene);
  };
}

export default Enemy;
