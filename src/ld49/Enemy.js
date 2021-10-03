
// PNJ before ?
import Character from "./Character";
import { dif, div, magnitude, mul, sum } from "../engine/vector2";

class Enemy extends Character {
  constructor(position, player, game) {
    super(position, 20, 1);
    this.game = game;
    this.damage = 20;
    this.target = player.position;
    this.state = "CHASE";
    this.range = this.collider.radius + 22;

    this.attackCooldown = 1000; //ms
    this.attackDuration = 500; // ms
    this._timeSinceLastAttack = this.attackCooldown + 1;
    this.attackInflictedDamage = false;

    this._timeSinceChase = 0;
  }

  die = () => {
    this.game.onEnemyDie();
    this.state = "DEAD";
  };

  update = (delta, player) => {
    // update timings
    this._timeSinceLastAttack += delta;
    this._timeSinceChase += delta;

    // update effects
    if (this.effect) {
      this.effect.apply(this, delta);
      if (this.effect.over) {
        this.effect = null;
      }
    }

    if (this.state === "DEAD") {
      // wait for death animation
      this._deadSince += delta;
      // console.log("dead", this._deadSince > this.deathAnimationDuration);
      if (this._deadSince > this.deathAnimationDuration) {
        this.toKill = true;
        this.collider.toKill = true;
      }
      return;
    }

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
        // console.log(magn, this.range);
        if (magn < this.range) {
          if (this._timeSinceLastAttack > this.attackCooldown) {
            this._timeSinceLastAttack = 0;
            this.state = "ATTACK";
          }
          return;
        }

        if (this.effect) {
          break; // do not move while effect applied
        }

        const timedVelocity = this.velocity * delta / 1000;
        this.position = sum(this.position, mul(this.direction, timedVelocity));
        // this.positionX += this.dirX * timedVelocity;
        // this.positionY += this.dirY * timedVelocity;
        this.collider.position = this.position;
        break;
      }
      case "ATTACK": {
        if (!this.attackInflictedDamage
          && this._timeSinceLastAttack > 5 / 6 * this.attackDuration) {
          this.attackInflictedDamage = true;
          player.hit(this.damage);
        }
        if (this._timeSinceLastAttack > this.attackDuration) {
          this.state = "CHASE";
          this.attackInflictedDamage = false;
          return;
        }
        break;
      }
      default: {

      }
    }
  };

  draw = (scene, resources) => {
    const dir = this.direction[0] >= 0 ? 'right' : 'left';
    if (this.state === "DEAD") {
      this.animate(scene, resources[`/res/enemy_dying_${dir}.png`], 8, this.deathAnimationDuration,
        this._deadSince, dif(this.position, [64, 96]), 128, 128);
    } else if (this.state === "ATTACK") {
      this.animate(scene, resources[`/res/enemy_eat_${dir}.png`], 6, this.attackDuration,
        this._timeSinceLastAttack, dif(this.position, [64, 96]), 128, 128);
    } else if (this.state === "CHASE"){
      this.animate(scene, resources[`/res/enemy_run_${dir}.png`], 4, 500,
          this._timeSinceChase, dif(this.position, [64, 96]), 128, 128);
    }
    this.collider.draw(scene);
  };

  drawHud = (scene, resources) => {
    if (this.state === "DEAD") {
      return;
    }
    const barWidth = 50;
    const barHeight = 10;
    const padding = 2;
    const innerBarWidth = barWidth - padding;
    const innerBarHeight = barHeight - padding;
    scene.ctx.fillStyle = "#000000";
    scene.ctx.fillRect(this.position[0] - barWidth / 2, this.position[1] - 80 - barHeight / 2, barWidth, barHeight);
    scene.ctx.fillStyle = "#FF0000";
    scene.ctx.fillRect(this.position[0] - innerBarWidth / 2, this.position[1] - 80 - innerBarHeight / 2, innerBarWidth * this.health / this.maxHealth, innerBarHeight);
  }
}

export default Enemy;
