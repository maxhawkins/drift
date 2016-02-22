function DragListener() {
  this.isDragging = false;

  this._handleStart = this._handleStart.bind(this);
  this._handleEnd = this._handleEnd.bind(this);
  this._handleDrop = this._handleDrop.bind(this);

  document.addEventListener('dragstart', this._handleStart, false);
  document.addEventListener('dragover', this._handleStart, false);
  document.addEventListener('dragend', this._handleEnd, false);
  document.addEventListener('dragleave', (function(e) {
    if (e.target !== document.body) {
      return;
    }
    this._handleEnd(e);
  }).bind(this), false);
  document.addEventListener('drop', this._handleDrop, false);
}

DragListener.prototype._handleStart = function(e) {
  if (this.onstart && this.isDragging === false) {
    this.onstart();
  }
  this.isDragging = true;
  e.preventDefault();
};

DragListener.prototype._handleEnd = function(e) {
  if (this.onend && this.isDragging === true) {
    this.onend();
  }
  this.isDragging = false;
  e.preventDefault();
};

DragListener.prototype._handleDrop = function(e) {
  var files = event.dataTransfer.files
  if (this.ondrop) { this.ondrop(files); }
  if (this.onend) { this.onend(); }
  this.isDragging = false;
  e.preventDefault();
};