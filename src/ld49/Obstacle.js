import Collider from "./Collider";

class Obstacle extends Collider {
  constructor(position, radius) {
    super(position, radius, -1);
  }
}

export default Obstacle;
