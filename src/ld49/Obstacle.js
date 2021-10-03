import Collider from "./Collider";

class Obstacle extends Collider {
  constructor(position, radius, image) {
    super(position, radius, -1);
    this.image = image;
  }

  draw = (scene, resources) => {
    if (this.image) {
      scene.drawImage(resources[this.image], this.position[0] - 64, this.position[1] - 128 - 32, 128, 128 + 64);
    }
    scene.ctx.strokeStyle = '#FF9900';
    scene.ctx.beginPath();
    scene.ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
    scene.ctx.closePath();
    scene.ctx.stroke();
  };

  drawHud = (scene) => {
  };
}

export default Obstacle;
