class Entity {
  constructor(position) {
    this.position = position;
    this.toKill = false;
  }

  animate = (scene, spriteSheet, nbFrames, duration, timeEllapsed, position, cellWidth, cellHeight) => {
    const currentLoopSince = timeEllapsed % duration;
    const currentFrame = Math.floor(currentLoopSince / (duration / nbFrames));

    scene.drawImage(spriteSheet, cellWidth * currentFrame, 0, cellWidth, cellHeight,
      position[0], position[1], cellWidth, cellHeight);
  };

  update = () => null;
  draw = () => null;
  drawHud = () => null;
}

export default Entity;
