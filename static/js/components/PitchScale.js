function PitchScale() {
  this.props = {
    height: 200,
    minPitch: 50,
    maxPitch: 400,
    tickCount: 7,
    fontSize: 14,
  };

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $el.setAttribute('class', 'pitch-scale');
  $el.setAttribute('width', 100);
  $el.setAttribute('height', this.props.height + this.props.fontSize * 2);

  var $label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  var labelY = this._scaleY(this.props.minPitch) + this.props.fontSize / 4;
  $label.setAttribute('transform', 'translate(2, ' + labelY + ')');
  $label.textContent = 'Hz';
  $el.appendChild($label);

  var $bar = document.createElementNS("http://www.w3.org/2000/svg", "line");
  $bar.setAttribute('class', 'bar');
  $bar.setAttribute('x1', 48);
  $bar.setAttribute('x2', 48);
  $bar.setAttribute('y1', this._scaleY(this.props.minPitch));
  $bar.setAttribute('y2', this._scaleY(this.props.maxPitch));
  $el.appendChild($bar);

  // TODO(maxhawkins): set this in render() so we can update the scale
  var tickSize = (this.props.maxPitch - this.props.minPitch) / this.props.tickCount;
  for (var tick = this.props.minPitch; tick <= this.props.maxPitch; tick += tickSize) {
    var y = this._scaleY(tick);

    var $text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    $text.textContent = '' + tick;
    $text.setAttribute('transform', 'translate(39, ' + (y + this.props.fontSize / 4) + ')');
    $text.setAttribute('text-anchor', 'end');
    $el.appendChild($text);

    var $tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    $tick.setAttribute('class', 'tick');
    $tick.setAttribute('x1', 45);
    $tick.setAttribute('x2', 51);
    $tick.setAttribute('y1', y);
    $tick.setAttribute('y2', y);
    $el.appendChild($tick);
  }
}

PitchScale.prototype._scaleY = function(pitch) {
  var yScale = this.props.height / (this.props.minPitch - this.props.maxPitch);
  var y = (pitch - this.props.maxPitch) * yScale + this.props.fontSize;
  return y;
}

PitchScale.prototype.render = function() {};
