var ZoomBar = function() {
    this.props = {
      amount: 0,
    };
    var $el = this.$el = document.createElement("div");
    $el.className = "zoom";

    var $indicator = this.$indicator = document.createElement("div");
    $indicator.className = "indicator";
    this.$el.appendChild(this.$indicator);

    var $label = this.$label = document.createElement('div');
    $label.className = 'label';
    $label.textContent = 'zoom';
    this.$el.appendChild($label);

    this.onmousedown = this.onmousedown.bind(this);
    this.onmousemove = this.onmousemove.bind(this);
    this.onmouseup = this.onmouseup.bind(this);

    $el.addEventListener('mousedown', this.onmousedown, false);
};

ZoomBar.prototype.onmousedown = function(ev) {
  // XXX: abstract to handle touch events as well
  ev.preventDefault();

  window.addEventListener('mousemove', this.onmousemove, false);
  window.addEventListener('mouseup', this.onmouseup, false);
};

ZoomBar.prototype._clickValue = function(clickX) {
  var value = (clickX - this.$el.offsetLeft) / this.$el.offsetWidth;
  value = Math.min(1, Math.max(0, value));
  return value;
}

ZoomBar.prototype.onmousemove = function(ev) {
  ev.preventDefault();

  if (this.onchange) {
    var value = this._clickValue(ev.clientX);
    this.onchange(value);
  }
};

ZoomBar.prototype.onmouseup = function(ev) {
  ev.preventDefault();

  window.removeEventListener('mousemove', this.onmousemove, false);
  window.removeEventListener('mouseup', this.onmouseup, false);

  if (this.onchange) {
    var value = this._clickValue(ev.clientX);
    this.onchange(value);
  }
};

ZoomBar.prototype.render = function() {
  var percent = (this.props.amount * 100) + '%';
  // PERF(maxhawkins): I think checking the style like
  // this invalidates the DOM on each frame.
  if (this.$indicator.style.width !== percent) {
    this.$indicator.style.width = percent;
  }
};
