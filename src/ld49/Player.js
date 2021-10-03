import Character from "./Character";
import {angle, dif, div, magnitude, mul, normalize, sum} from "../engine/vector2";
import Effect from "./Effect";

class Player extends Character {
  constructor(position, game) {
    super(position, 20, 3);
    this.game = game;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.velocity = 180;
    this.damage = 50;

    this.animation = "IDLE";
    this.orientation = "right";
    this._timeSinceAnimation = 0;

    // TODO buffer attacks ?
    this.attackDuration = 300; // ms
    this.attackCoolDown = 600; // ms
    this.attackDirection = [-1, 0];
    this.attackRadius = Math.PI * 3 / 4; // PI / 2
    this.attackRange = 120; // 100
    this._timeSinceAttack = this.attackCoolDown + 1; // will not start fire

    this.verticalInput = 0;
    this.horizontalInput = 0;
  };

  die = () => {
    // if (this.)
    this.game.onPlayerDie(); // TODO
    console.log('YOU ARE DEAD');
    this.animation = "DEAD";
    this._timeSinceAnimation = 0;
  };

  computeInputs = (inputHandler) => {
    if (this.verticalInput < 0) { // top, W pressed
      if (!inputHandler.getKey('KeyW')) {
        this.verticalInput = 0;
        if (inputHandler.getKey('KeyS')) {
          this.verticalInput = 1;
        }
      }
    } else if (this.verticalInput > 0) { // bottom, S pressed
      if (!inputHandler.getKey('KeyS')) {
        this.verticalInput = 0;
        if (inputHandler.getKey('KeyW')) {
          this.verticalInput = -1;
        }
      }
    }
    if (inputHandler.getKeyDown('KeyS')) {
      this.verticalInput = 1;
    } else if (inputHandler.getKeyDown('KeyW')) {
      this.verticalInput = -1;
    }

    if (this.horizontalInput < 0) { // top, A pressed
      if (!inputHandler.getKey('KeyA')) {
        this.horizontalInput = 0;
        if (inputHandler.getKey('KeyD')) {
          this.horizontalInput = 1;
          this.orientation = "right";
        }
      }
    } else if (this.horizontalInput > 0) { // bottom, D pressed
      if (!inputHandler.getKey('KeyD')) {
        this.horizontalInput = 0;
        if (inputHandler.getKey('KeyA')) {
          this.horizontalInput = -1;
          this.orientation = "left";
        }
      }
    }
    if (inputHandler.getKeyDown('KeyD')) {
      this.horizontalInput = 1;
      this.orientation = "right";
    } else if (inputHandler.getKeyDown('KeyA')) {
      this.horizontalInput = -1;
      this.orientation = "left";
    }
  };

  update = (delta, inputHandler, canvas, enemies) => {
    const oldAnimation = this.animation;

    // update timings
    this._timeSinceAnimation += delta;
    this._timeSinceAttack += delta;

    if (this.animation === "DEAD") {
      return;
    }

    let moving = true;
    this.animation = "RUN";
    // TODO priority & diagonals

    this.computeInputs(inputHandler);
    if (this.horizontalInput || this.verticalInput) {
      this.direction = normalize([this.horizontalInput, this.verticalInput]);
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

            enemy.hit(this.damage,
              new Effect(300, mul(div(toEnemy, dist), 100)));
          }
        }
        // TODO sound & stuff
      }
    }
  };

  draw = (scene, resources) => {
    // TODO switch on input change (=animationDirection)
    const dir = this.orientation; //this.direction[0] >= 0 ? 'right' : 'left';

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
        this.animate(scene, resources[`/res/base_run_${dir}.png`], 4, 500,
          this._timeSinceAnimation, dif(this.position, [64, 96]), 128, 128);
        break;
      }
      case "DEAD": {
        const pos = dif(this.position, [64, 96]);
        const res = resources[`/res/base_dying_${dir}.png`];
        if (this._timeSinceAnimation > this.deathAnimationDuration) {
          scene.drawImage(res, 128 * 7, 0, 128, 128, pos[0], pos[1], 128, 128);
        } else {
          this.animate(scene, res, 8, this.deathAnimationDuration,
            this._timeSinceAnimation, pos, 128, 128);
        }
      }
    }

    this.collider.draw(scene);
  };
}

export default Player;
