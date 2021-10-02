class Input {
  constructor(canvas) {
    this._keyStates = {};
    this._justUpdated = {};
    this._mousePosition = [0, 0]; // init value
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
    canvas.addEventListener('mousemove', this._handleMouseMove);
    // TODO maybe on canvas
  }

  _handleKeyDown = (e) => {
    const keyCode = e.code;
    console.log(keyCode);
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (!wasKeyPressed) {
      this._keyStates[keyCode] = true;
      this._justUpdated[keyCode] = true;
    }
  };

  _handleKeyUp = (e) => {
    const keyCode = e.code;
    const wasKeyPressed = this._keyStates[keyCode] || false;
    if (wasKeyPressed) {
      this._keyStates[keyCode] = false;
      this._justUpdated[keyCode] = false;
    }
  };

  _handleMouseMove = (e) => {
    this._mousePosition = [e.pageX, e.pageY];
  };

  newFrame = () => {
    this._justUpdated = {};
  };

  clean() {
    // TODO remove listeners
    // window.removeEventListener('toot', this._handleKeyDown);
  }

  getKey = (keyCode) => {
    return this._keyStates[keyCode] || false;
  };

  getKeyDown = (keyCode) => {
    return this._justUpdated[keyCode] === true;
  };

  getKeyUp = (keyCode) => {
    return this._justUpdated[keyCode] === false;
  };

  getMousePosition = () => {
    return this._mousePosition;
  }

  // TODO mouse clicks
}

export default Input;
