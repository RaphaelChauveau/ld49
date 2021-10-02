import Entity from "./Entity";
import Collider from "./Collider";
import { dif, magnitude, mul, sum } from "../engine/vector2";

class PhysicalEntity extends Entity {
  constructor(position, colliderOffset, radius, weight) {
    super(position);
    // TODO offset used ?
    this.colliderOffset = colliderOffset;
    this.collider = new Collider(sum(position, colliderOffset), radius, weight)
    this.effect = null;
  }

  expend = (colliders) => {
    let displacement = [0, 0];
    for (const collider of colliders) {
      if (this.collider === collider) {
        continue;
      }
      const toOther = dif(collider.position, this.collider.position);
      const magn = magnitude(toOther);
      const overlap = this.collider.radius + collider.radius - magn;

      if (overlap > 0) {
        let ratio = overlap / magn;
        if (collider.weight !== -1) { // not unmoveable
          ratio *= 1 - this.collider.weight / (this.collider.weight + collider.weight);
        }
        displacement = dif(displacement, mul(toOther, ratio));
      }
    }
    this.position = sum(this.position, displacement);
    this.collider.position = this.position; // TODO no offset (useless ?)
  };

  draw = (scene) => {
    scene.ctx.strokeStyle = "#FF0000";
    scene.ctx.beginPath();
    scene.ctx.moveTo(this.position[0] - 5, this.position[1]);
    scene.ctx.lineTo(this.position[0] + 5, this.position[1]);
    scene.ctx.moveTo(this.position[0], this.position[1] - 5);
    scene.ctx.lineTo(this.position[0], this.position[1] + 5);
    scene.ctx.stroke();

    this.collider.draw(scene);
  }
}

export default PhysicalEntity;