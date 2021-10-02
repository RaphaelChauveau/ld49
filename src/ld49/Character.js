import PhysicalEntity from "./PhysicalEntity";

class Character extends PhysicalEntity {
  constructor(position, radius, weight) {
    super(position, [0, 0], radius, weight);
    this.direction = [0, 1]; // normalized vector

    this.velocity = 120 // TODO param ? (no, subclasses)
  }

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
