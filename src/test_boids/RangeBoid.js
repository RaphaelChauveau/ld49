import { Boid } from "./Boid";

class RangeBoid extends Boid {
  constructor(x, y) {
    super(x, y);
    this.range = 150;
    this.color = "#454abb";
  }
}

export default RangeBoid;
