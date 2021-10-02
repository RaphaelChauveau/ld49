class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // camera
    this._position = {x: 0, y: 0};
    this._zoom = 1;
  }

  drawBegin = () => {
    this.ctx.fillStyle = '#F9F9F9';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  drawEnd = () => {

  };

  _updateTransform = () => {
    // this.ctx.setTransform(this._zoom, 0, 0, this._zoom, -this._position.x, -this._position.y);
    this.ctx.setTransform(this._zoom, 0, 0, this._zoom, 0, 0);
    this.ctx.translate(-this._position.x, -this._position.y);
  };

  setPosition = (x, y) => {
    this._position.x = x;
    this._position.y = y;
    this._updateTransform();
  };

  setCenterPosition = (x, y) => {
    const a = this._zoom * 2;
    this.setPosition(x - this.canvas.width / a,
                     y - this.canvas.height / a);
  };

  setZoom = (zoom) => {
    this._zoom = zoom;
    this._updateTransform();
  };

  drawImage = (imageResource, x, y, w, h, x2, y2, w2, h2) => {
    // console.log(imageResource);
    if (imageResource.status === 'LOADED') {
      if (x2 !== undefined) {
        this.ctx.drawImage(imageResource.value, x, y, w, h, x2, y2, w2, h2);
      } else {
        this.ctx.drawImage(imageResource.value, x, y, w, h);//, x2, y2, w2, h2);
      }
    }
  };

}

export default Scene;
