import Character from "./Character";
import {angle, dif, div, magnitude, mul, normalize, sum} from "../engine/vector2";

class Player extends Character {
  constructor(position) {
    super(position, 20, 3);
    this.velocity = 180;

    this.animation = "IDLE";
    this._timeSinceAnimation = 0;

    // TODO buffer attacks
    this.attackDuration = 300; // ms
    this.attackCoolDown = 600; // ms
    this.attackDirection = [-1, 0];
    this.attackRadius = Math.PI * 3 / 4; // PI / 2
    this.attackRange = 120; // 100
    this._timeSinceAttack = this.attackCoolDown + 1; // will not start fire
  };

  update = (delta, inputHandler, canvas, enemies) => {
    const oldAnimation = this.animation;

    // update timings
    this._timeSinceAnimation += delta;
    this._timeSinceAttack += delta;

    let moving = true;
    this.animation = "RUN";
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
      this.animation = "IDLE";
    }

    if (moving) {
      this.position = sum(this.position, mul(this.direction, this.velocity * delta / 1000));
      this.collider.position = sum(this.position, mul(this.direction, this.velocity * delta / 1000));
    }

    if (this.animation !== oldAnimation) {
      this._timeSinceAnimation = 0;
    }

    if (inputHandler.getKeyDown('Space')) {
      if (this._timeSinceAttack > this.attackCoolDown) {
        this._timeSinceAttack = 0;

        const toMouse = dif(inputHandler.getMousePosition(), [canvas.width / 2, canvas.height / 2]);
        this.attackDirection = normalize(toMouse);

        for (const enemy of enemies) {
          const toEnemy = dif(enemy.position, this.position);
          const dist = magnitude(toEnemy);
          if (Math.abs(angle(this.attackDirection, toEnemy))
            < this.attackRadius / 2 && dist < this.attackRange) {
            enemy.hit(mul(div(toEnemy, dist), 100));
          }
        }
        // TODO do damage + sound & stuff
      }
    }
  };

  draw = (scene, resources) => {
    // TODO switch on input change (=animationDirection)
    const dir = this.direction[0] >= 0 ? 'right' : 'left';

    if (this._timeSinceAttack < this.attackDuration) {
        const nbFrames = 5;
        const currentFrame = Math.floor(this._timeSinceAttack / (this.attackDuration / nbFrames));

        // XXX just drawing a rotated image :fear:
        scene.ctx.save();
        scene.ctx.translate(this.position[0], this.position[1]);
        let angle = Math.acos(this.attackDirection[0]);
        if (this.attackDirection[1] < 0) {
          angle = 2 * Math.PI - angle;
        }
        scene.ctx.rotate(angle);
        scene.ctx.translate(-this.position[0], -this.position[1]);
        scene.drawImage(resources['/res/attack.png'], 256 * currentFrame, 0, 256, 256,
          this.position[0] - 128, this.position[1] - 128, 256, 256);
        scene.ctx.restore();
    }

    switch (this.animation) {
      case "IDLE": {
        const spriteSheet = `/res/player_${dir}.png`;
        scene.drawImage(resources[spriteSheet], this.position[0] - 64, this.position[1] - 64, 128, 128);
        break;
      }
      case "RUN": {
        const nbFrames = 4;
        const animationDuration = 500; // ms
        const currentLoopSince = this._timeSinceAnimation % animationDuration;
        const currentFrame = Math.floor(currentLoopSince / (animationDuration / nbFrames));
        const spriteSheet = `/res/base_run_${dir}.png`;
        scene.drawImage(resources[spriteSheet], 128 * currentFrame, 0, 128, 128,
          this.position[0] - 64, this.position[1] - 96, 128, 128);
        break;
      }
    }

    this.collider.draw(scene);
  };
}

export default Player;
