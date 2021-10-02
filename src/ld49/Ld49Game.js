import Game from '../engine/game';
import Obstacle from "./Obstacle";
import { magnitude } from "../engine/vector2";
import ResourceLoader from "../engine/resourceLoader";
import PhysicalEntity from "./PhysicalEntity";
import Character from "./Character";
import Player from "./Player";

//import logoRes from "../res/logo.png";
//import playerRes from "../res/player.png";

const WIDTH = 800;
const HEIGHT = 600;

export class Ld49Game extends Game {
  constructor(canvas) {
    super(canvas);
    this.updatePerSecond = 60;
    this.drawPerSecond = 30;

    this.colliders = [];
    this.entities = [];

    this.player = this.createPlayer([200, 200]);
    //this.createCharacter([201, 200], 10, 1);

    this.createObstacle([0, 0], 20);
    this.createObstacle([200, 300], 20);
    this.createObstacle([220, 300], 30);
    this.createObstacle([230, 270], 10);
    this.createObstacle([400, 300], 10);

    // TOP
    this.createObstacle([400, -100000], 100010);

    //this.createCharacter([200, 200], 10, 1);

    // this.createRangeBoid(200, 200);

    // boids
    // this.createBoid(100, 100);
    // this.createBoid(200, 100, 20, 5); // fat boi

    this.resources = {};
  }

  loadAssets = () => {
    this.resourceLoader = new ResourceLoader();
    this.loadImage("/res/player_right.png");
    this.loadImage("/res/player_left.png");
  };

  loadImage = (path) => {
    this.resources[path] = this.resourceLoader.loadImage(path);
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

  createObstacle = (p, r) => {
    const obstacle = new Obstacle(p, r);
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
    const player = new Player(p);
    this.entities.push(player);
    this.colliders.push(player.collider);
    return player;
  };

  update = (delta) => {
    if (delta > 20) {
      // TODO if delta too high (> (2?) * classic delta) => pause
      // TODO handle in engine ?
      console.log(delta);
    }

    // TODO all updates
    this.player.update(delta, this.inputHandler);

    // TODO expend
    this.player.expend(this.colliders);
    /*for (const boid of this.boids) {
      boid.update(delta, this.player);
    }
    this.player.expand(this.colliders);
    for (const boid of this.boids) {
      boid.expand(this.colliders);
    }*/

    // test // TODO in player ?
    /*if (this.inputHandler.getKeyDown('Space')) {
      for (const boid of this.boids) {
        const fromPlayerX = boid.positionX - this.player.positionX;
        const fromPlayerY = boid.positionY - this.player.positionY;
        const ratio = 100 / magnitude(fromPlayerX, fromPlayerY);
        // TODO affected by entity weight ?
        boid.addEffect(new Effect(500, [fromPlayerX * ratio, fromPlayerY * ratio])); // TODO away from player
      }
    }*/
  };

  draw = (scene) => {
    scene.setCenterPosition(this.player.position[0], this.player.position[1]);

    //console.log('draw game');
    //scene.setCenterPosition(400, 300);

    // console.log(this.entities);
    for (const entity of this.entities) {
      entity.draw(scene, this.resources);
    }

    /*for (const boid of this.boids) {
      boid.draw(scene, this.logoImage);
    }
    for (const obstacle of this.obstacles) {
      obstacle.draw(scene);
    }
    this.player.draw(scene);*/
    scene.setCenterPosition(WIDTH / 2, HEIGHT / 2);
    // TODO interface
  };
}
