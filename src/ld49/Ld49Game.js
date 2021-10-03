import Game from '../engine/game';
import Obstacle from "./Obstacle";
import {magnitude, mul, sum} from "../engine/vector2";
import ResourceLoader from "../engine/resourceLoader";
import PhysicalEntity from "./PhysicalEntity";
import Character from "./Character";
import Player from "./Player";
import Enemy from "./Enemy";
import FirePit from "./FirePit";

const WIDTH = 800;
const HEIGHT = 600;

export class Ld49Game extends Game {
  constructor(canvas) {
    super(canvas);
    this.updatePerSecond = 60;
    this.drawPerSecond = 30;

    this.colliders = [];
    this.entities = [];
    this.enemies = [];
    this.waveNumber = 1;
    this.state = "PLAYING";

    this.initLevel();

    this.resources = {};
  }

  loadAssets = () => {
    this.resourceLoader = new ResourceLoader();
    this.loadImage("/res/player_right.png");
    this.loadImage("/res/player_left.png");
    this.loadImage("/res/base_run_right.png");
    this.loadImage("/res/base_run_left.png");
    this.loadImage("/res/base_dying_right.png");
    this.loadImage("/res/base_dying_left.png");
    this.loadImage("/res/base_eat_right.png");
    this.loadImage("/res/base_eat_left.png");

    this.loadImage("/res/attack.png");

    // environment
    this.loadImage("/res/fire_pit.png");
    this.loadImage("/res/tree_1.png");
    this.loadImage("/res/medium_tree_1.png");
    this.loadImage("/res/medium_tree_2.png");
    this.loadImage("/res/small_rock_1.png");
    this.loadImage("/res/medium_rock_1.png");
    this.loadImage("/res/medium_rock_2.png");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
  };

  initEnvironment = () => {
    // TOP
    // this.createObstacle([400, -100000], 100010);

    //
    this.createObstacle([100, 0], 20, "/res/tree_1.png");
    this.createObstacle([200, 0], 30, "/res/medium_tree_1.png");
    this.createObstacle([300, 0], 30, "/res/medium_tree_2.png");
    this.createObstacle([400, 0], 20, "/res/small_rock_1.png");
    this.createObstacle([500, 0], 30, "/res/medium_rock_1.png");
    this.createObstacle([600, 0], 30, "/res/medium_rock_2.png");

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

    this.initEnvironment();

    // enemies
    // this.createEnemy([100, -200]);
    // this.createEnemy([200, -200]); // , 20, 5); // fat boi
  };

  startWave = () => {
    console.log('START WAVE !!');
    // TODO sound ?
    const nbEnemies = this.waveNumber * 2;

    for (let i = 0; i < nbEnemies; i += 1) {
      const random1 = Math.random() * 2 - 1;
      const random2 = Math.random() * 2 - 1;
      const position = [Math.cos(random1 * Math.PI), Math.cos(random2 * Math.PI)];
      this.createEnemy(sum(this.player.position, mul(position, 500)));
    }
  };

  onEnnemyDie = () => {
    // TODO score ++ ;
  };

  onPlayerDie = () => {
    console.log("ON PLAYER DIE");
    // TODO state = PLAYING | GAME_OVER
    this.state = "GAME_OVER";
  };

  /* createBoid = (x, y, r, w) => {
    const boid = new Boid(x, y, r, w);
    this.boids.push(boid);
    this.colliders.push(boid);
  }; */

  /* createRangeBoid = (x, y) => {
    const boid = new RangeBoid(x, y);
    this.boids.push(boid);
    this.colliders.push(boid);
  }; */

  createObstacle = (p, r, i) => {
    console.log('II', i);
    const obstacle = new Obstacle(p, r, i);
    this.entities.push(obstacle);
    this.colliders.push(obstacle);
    return obstacle;
  };

  createCharacter = (p, r, w = 1) => {
    const character = new Character(p, r, w);
    this.entities.push(character);
    this.colliders.push(character.collider);
    return character;
  };

  createPlayer = (p) => {
    const player = new Player(p, this);
    this.entities.push(player);
    this.colliders.push(player.collider);
    return player;
  };

  createEnemy = (p) => {
    const enemy = new Enemy(p, this.player);
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

    console.log(this.waveDelay);
    if (this.waveDelay > 0) {
      console.log('AAA', delta);
      this.waveDelay -= delta;
      if (this.waveDelay <= 0) {
        console.log('START WAVE');
        this.startWave();
        this.waveDelay = 0;
      }
    }

    this.player.update(delta, this.inputHandler, this.canvas, this.enemies);
    for (const enemy of this.enemies) {
      enemy.update(delta, this.player);
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
    scene.ctx.fillStyle = "black";
    scene.ctx.textAlign = "center";
    scene.ctx.fillText(`GAME OVER`, 400, 100);
    scene.ctx.font = "30px Arial Black";
    scene.ctx.fillText(`Score: ${this.score}`, 400, 150);
    scene.ctx.fillText(`Highscore: TODO`, 400, 200);
    scene.ctx.font = "20px Arial Black";
    scene.ctx.fillText(`(Dev: TODODO)`, 400, 250);
    scene.ctx.font = "50px Arial Black";
    scene.ctx.fillText("ENTER TO RETRY", 400, 500);
  };

  draw = (scene) => {
    scene.setCenterPosition(Math.round(this.player.position[0]), Math.round(this.player.position[1]));

    // TODO floor & stuff
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
    scene.ctx.fillStyle = "#000000";
    scene.ctx.fillRect(0, 0, barWidth, barHeight);
    scene.ctx.fillStyle = "#FF0000";
    scene.ctx.fillRect(padding,padding, innerBarWidth * this.player.health / this.player.maxHealth, innerBarHeight);

    // console.log(this.state);
    if (this.state === "GAME_OVER") {
      // console.log("IS GO");
      this.drawGameOverUI(scene);
    }
  };
}
