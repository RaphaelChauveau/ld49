import Game from '../engine/game.js';
import Obstacle from "./Obstacle.js";
import {magnitude, mul, sum} from "../engine/vector2.js";
import ResourceLoader from "../engine/resourceLoader.js";
import Player from "./Player.js";
import Enemy from "./Enemy.js";
import FirePit from "./FirePit.js";
import {load, play} from "../engine/sound_test/soundTest.js";

const WIDTH = 800;
const HEIGHT = 600;
const arenaRadius = 500;

export class Ld49Game extends Game {
  constructor(canvas) {
    super(canvas);
    this.updatePerSecond = 60;
    this.drawPerSecond = 30;

    this.highscore = 0;

    this.colliders = [];
    this.entities = [];
    this.enemies = [];
    this.waveNumber = 1;
    this.state = "PLAYING";
    this.score = 0;

    this.initLevel();

    this.resources = {};
  }

  loadAssets = () => {
    this.resourceLoader = new ResourceLoader();
    this.loadImage("../../res/player_right.png");
    this.loadImage("../../res/player_left.png");
    this.loadImage("../../res/player_run_right.png");
    this.loadImage("../../res/player_run_left.png");
    this.loadImage("../../res/player_dying_right.png");
    this.loadImage("../../res/player_dying_left.png");


    this.loadImage("../../res/enemy_run_right.png");
    this.loadImage("../../res/enemy_run_left.png");
    this.loadImage("../../res/enemy_dying_right.png");
    this.loadImage("../../res/enemy_dying_left.png");
    this.loadImage("../../res/enemy_eat_right.png");
    this.loadImage("../../res/enemy_eat_left.png");

    this.loadImage("../../res/attack.png");

    // environment
    this.loadImage("../../res/fire_pit.png");
    this.loadImage("../../res/tree_1.png");
    this.loadImage("../../res/medium_tree_1.png");
    this.loadImage("../../res/medium_tree_2.png");
    this.loadImage("../../res/small_rock_1.png");
    this.loadImage("../../res/medium_rock_1.png");
    this.loadImage("../../res/medium_rock_2.png");

    // sounds
    load("../../res/Crunch.ogg");
    load("../../res/Death.ogg");
    load("../../res/Death2.ogg");
    load("../../res/Hibou.ogg");
    load("../../res/Hit.ogg");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
  };

  initEnvironment = () => {
    // new
    this.createObstacle([603 - 500, 129 - 500], 20, "../../res/tree_1.png");
    this.createObstacle([309 - 500, 411 - 500], 20, "../../res/tree_1.png");
    this.createObstacle([855 - 500, 471 - 500], 20, "../../res/tree_1.png");
    this.createObstacle([366 - 500, 951 - 500], 20, "../../res/tree_1.png");
    this.createObstacle([858 - 500, 261 - 500], 30, "../../res/medium_tree_1.png");
    this.createObstacle([750 - 500, 606 - 500], 30, "../../res/medium_tree_1.png");
    this.createObstacle([156 - 500, 687 - 500], 30, "../../res/medium_tree_1.png");
    this.createObstacle([609 - 500, 426 - 500], 30, "../../res/medium_tree_2.png");
    this.createObstacle([81 - 500, 495 - 500], 30, "../../res/medium_tree_2.png");
    this.createObstacle([333 - 500, 123 - 500], 20, "../../res/small_rock_1.png");
    this.createObstacle([948 - 500, 513 - 500], 20, "../../res/small_rock_1.png");
    this.createObstacle([603 - 500, 693 - 500], 20, "../../res/small_rock_1.png");
    this.createObstacle([222 - 500, 801 - 500], 20, "../../res/small_rock_1.png");
    this.createObstacle([387 - 500, 264 - 500], 30, "../../res/medium_rock_1.png");
    this.createObstacle([747 - 500, 348 - 500], 30, "../../res/medium_rock_1.png");
    this.createObstacle([654 - 500, 834 - 500], 30, "../../res/medium_rock_1.png");
    this.createObstacle([225 - 500, 210 - 500], 30, "../../res/medium_rock_2.png");
    this.createObstacle([333 - 500, 606 - 500], 30, "../../res/medium_rock_2.png");
    this.createObstacle([489 - 500, 777 - 500], 30, "../../res/medium_rock_2.png");

    this.firePit = new FirePit([0, 0]);
    this.entities.push(this.firePit);
    this.colliders.push(this.firePit);
  };

  initLevel = () => {
    this.colliders = [];
    this.entities = [];
    this.enemies = [];
    this.waveNumber = 1;
    this.player = this.createPlayer([0, -100]);
    this.state = "PLAYING";
    this.waveDelay = 5000; // ms (starts wave at the end of countdown)
    this.score = 0;

    this.initEnvironment();

    // enemies
    // this.createEnemy([100, -200]);
    // this.createEnemy([200, -200]); // , 20, 5); // fat boi
  };

  startWave = () => {
    play("../../res/Hibou.ogg");

    const nbEnemies = this.waveNumber * 2;

    for (let i = 0; i < nbEnemies; i += 1) {
      const random1 = Math.random() * 2 - 1;
      const random2 = Math.random() * 2 - 1;
      const position = [Math.cos(random1 * Math.PI), Math.cos(random2 * Math.PI)];
      this.createEnemy(sum(this.player.position, mul(position, 500)));
    }
  };

  onEnemyDie = () => {
    this.score += 2;
    play('../../res/Death2.ogg');
  };

  onPlayerDie = () => {
    console.log("ON PLAYER DIE");
    play('../../res/Death.ogg');
    this.state = "GAME_OVER";
    this.highscore = parseInt(window.localStorage.getItem('score') || '0', 10);
    if (this.score > this.highscore) {
      window.localStorage.setItem('score', this.score);
    }
  };

  createObstacle = (p, r, i) => {
    const obstacle = new Obstacle(p, r, i);
    this.entities.push(obstacle);
    this.colliders.push(obstacle);
    return obstacle;
  };

  createPlayer = (p) => {
    const player = new Player(p, this);
    this.entities.push(player);
    this.colliders.push(player.collider);
    return player;
  };

  createEnemy = (p) => {
    const enemy = new Enemy(p, this.player, this);
    this.entities.push(enemy);
    this.enemies.push(enemy);
    this.colliders.push(enemy.collider);
    return enemy;
  };

  updateGameOver = () => {
    if (this.inputHandler.getKeyDown('Enter')) {
      this.initLevel();
      // this.state = "PLAYING";
    }
  };

  update = (delta) => {
    if (delta > 40) {
      // TODO if delta too high (> (2?) * classic delta) => pause
      // TODO handle in engine ?
      console.log(delta);
      return;
    }

    if (this.waveDelay > 0) {
      this.waveDelay -= delta;
      if (this.waveDelay <= 0) {
        this.startWave();
        this.waveDelay = 0;
      }
    }

    if (magnitude(this.player.position) > arenaRadius) {
      this.player.hit(20 * delta / 1000);
    }

    this.player.update(delta, this.inputHandler, this.canvas, this.enemies);
    for (const enemy of this.enemies) {
      enemy.update(delta, this.player, this);
    }
    this.firePit.update(delta);

    this.player.expend(this.colliders);
    for (const enemy of this.enemies) {
      enemy.expend(this.colliders);
    }

    this.colliders = this.colliders.filter((collider) => !collider.toKill);
    this.entities = this.entities.filter((entity) => !entity.toKill);
    this.enemies = this.enemies.filter((enemy) => !enemy.toKill);

    if (this.enemies.length === 0 && this.player.health > 0
      && this.waveDelay === 0) {
      // TODO finished wave, congrats
      this.score += 50;
      this.waveNumber += 1;
      this.waveDelay = 5000;
    }

    this.entities.sort((a, b) => a.position[1] - b.position[1]);

    if (this.state === "GAME_OVER") {
      this.updateGameOver();
    }
  };

  drawGameOverUI = (scene) => {
    scene.ctx.font = "50px Arial Black";
    scene.ctx.fillStyle = "white";
    scene.ctx.textAlign = "center";
    scene.ctx.fillText(`GAME OVER`, 400, 100);
    scene.ctx.font = "30px Arial Black";
    scene.ctx.fillText(`Score: ${this.score}`, 400, 150);
    scene.ctx.fillText(`Highscore: ${this.highscore}`, 400, 200);
    scene.ctx.font = "20px Arial Black";
    scene.ctx.fillText(`(Dev: 632)`, 400, 250);
    scene.ctx.font = "50px Arial Black";
    scene.ctx.fillText("ENTER TO RETRY", 400, 500);
  };



  draw = (scene) => {
    scene.setCenterPosition(Math.round(this.player.position[0]), Math.round(this.player.position[1]));

    // XXX FLOOR
    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#19332d";
    scene.ctx.arc(0, 0, 500, 0, 2 * Math.PI);
    scene.ctx.fill();
    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#25562e";
    scene.ctx.arc(0, 0, 200, 0, 2 * Math.PI);
    scene.ctx.fill();
    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#468232";
    scene.ctx.arc(0, 0, 100, 0, 2 * Math.PI);
    scene.ctx.fill();
    scene.ctx.beginPath();
    scene.ctx.fillStyle = "#a8ca58";
    scene.ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    scene.ctx.fill();


    // XXX ENTITIES
    for (const entity of this.entities) {
      entity.draw(scene, this.resources);
    }
    for (const entity of this.entities) {
      entity.drawHud(scene, this.resources);
    }

    // XXX INTERFACE
    scene.setCenterPosition(WIDTH / 2, HEIGHT / 2);
    const barWidth = 100;
    const barHeight = 30;
    const padding = 4;
    const innerBarWidth = barWidth - padding * 2;
    const innerBarHeight = barHeight - padding * 2;
    scene.ctx.fillStyle = "#de9e41";
    scene.ctx.fillRect(20, 20, barWidth, barHeight);
    scene.ctx.fillStyle = "#000000";
    scene.ctx.fillRect(20 + padding,20 + padding, innerBarWidth, innerBarHeight);
    scene.ctx.fillStyle = "#a53030";
    scene.ctx.fillRect(20 + padding,20 + padding, innerBarWidth * this.player.health / this.player.maxHealth, innerBarHeight);



    if (this.state === "GAME_OVER") {
      this.drawGameOverUI(scene);
    } else {
      scene.ctx.font = "20px Arial Black";
      scene.ctx.fillStyle = "white";
      scene.ctx.textAlign = "center";
      scene.ctx.fillText(`SCORE: ${this.score}`, 700, 40);

      if (magnitude(this.player.position) > arenaRadius) {
        scene.ctx.font = "50px Arial Black";
        scene.ctx.fillStyle = "red";
        scene.ctx.textAlign = "center";
        scene.ctx.fillText("DO NOT LEAVE THE FIRE", 400, 100);
      }
    }
  };
}
