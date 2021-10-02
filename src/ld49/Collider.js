import Entity from "./Entity";

class Collider extends Entity {
  constructor(position, radius, weight) {
    super(position);
    this.radius = radius;
    this.weight = weight;
  }

  draw = (scene) => {
    scene.ctx.strokeStyle = '#FF9900';
    scene.ctx.beginPath();
    scene.ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
    scene.ctx.closePath();
    scene.ctx.stroke();
  };
}

export default Collider;
