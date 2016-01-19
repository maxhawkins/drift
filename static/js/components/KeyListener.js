function KeyListener(keyCode) {
  this.keyCode = keyCode;
  document.addEventListener('keyup', this._handle.bind(this), false);
}

KeyListener.prototype._handle = function(e) {
  if (e.target !== document.body) {
    return;
  }
  if (e.keyCode !== this.keyCode) {
    return;
  }
  if (this.onpress) {
    this.onpress();
  }
  e.preventDefault();
}