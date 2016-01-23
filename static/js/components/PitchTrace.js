function PitchTrace() {
  this.props = {
    freqHz: [],
    scaleX: 1,
    minPitch: 50,
    maxPitch: 400,
    height: 300,
  };

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.setAttribute('class', 'pitch-trace');

  this.circles = [];
}

PitchTrace.prototype._updateShape = function() {
  var data = this.props.freqHz;
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var time = d[0], freq = d[1];

    var circle = this.circles[i];
    if (i >= this.circles.length) {
      circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute('r', 1);
      this.circles.push(circle);
      this.$el.appendChild(circle);
    }

    var x = this.props.scaleX * time;
    var yScale = this.props.height / (this.props.minPitch - this.props.maxPitch);
    var y = (freq - this.props.maxPitch) * yScale;
    var transform = 'translate(' + x + ',' +  y + ')';
    circle.setAttribute('transform', transform);
  }

  for (var i = data.length; i < this.circles.length; i++) {
    var circle = this.circles[i];
    circle.setAttribute('transform', 'translate(-999999,-9999999)');
  }
}

PitchTrace.prototype.render = function() {
  if (this.props.scaleX !== this.lastScaleX) {
    this._updateShape();
    this.lastScaleX = this.props.scaleX;
  }
};
