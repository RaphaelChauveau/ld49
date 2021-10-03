import PhysicalEntity from "./PhysicalEntity";
import Effect from "./Effect";

class Character extends PhysicalEntity {
  constructor(position, radius, weight) {
    super(position, [0, 0], radius, weight);
    this.direction = [0, 1]; // normalized vector

    this.velocity = 120; // TODO param ? (no, subclasses)

    this.damage = 20;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this._deadSince = 0; // ms
    this.deathAnimationDuration = 1000; // ms
  }

  die = () => {
    // TODO override
  };

  hit = (damage, effect) => {
    this.effect = effect || this.effect;
    this.health -= damage;
    if (this.health <= 0) {
      this.die();

    }
    //this.position = [0, 0];
    //this.collider.position = this.position;
  };

  draw = (scene) => {
    scene.ctx.strokeStyle = "#FF0000";
    scene.ctx.beginPath();
    scene.ctx.arc(this.position[0], this.position[1], this.collider.radius, 0, 2 * Math.PI);
    scene.ctx.moveTo(this.position[0] + this.direction[0] * this.collider.radius * 2,
               this.position[1] + this.direction[1] * this.collider.radius * 2);
    scene.ctx.lineTo(this.position[0], this.position[1]);
    scene.ctx.closePath();
    scene.ctx.stroke();
  };
}

export default Character;
