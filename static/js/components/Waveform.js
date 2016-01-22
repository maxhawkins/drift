function Waveform() {
  this.props = {
    waveform: [],
    scaleX: 1,
    height: 100,
  };

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.setAttribute('class', 'waveform');

  var $scale = this.$scale = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $scale.setAttribute('class', 'scale');
  $el.appendChild($scale);

  var $rule = this.$rule = document.createElementNS("http://www.w3.org/2000/svg", "line");
  $rule.setAttribute('class', 'rule');
  $rule.setAttribute('x1', 0);
  $rule.setAttribute('y1', 0);
  $rule.setAttribute('y2', 0);
  $rule.setAttribute('stroke-width', 0.001);
  $scale.appendChild($rule);

  var $peakTop = this.$peakTop = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  $peakTop.setAttribute('class', 'peak');
  $scale.appendChild($peakTop);

  var $rmsTop = this.$rmsTop = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  $rmsTop.setAttribute('class', 'rms');
  $scale.appendChild($rmsTop);

  var $peakBottom = this.$peakBottom = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  $peakBottom.setAttribute('class', 'peak');
  $peakBottom.setAttribute('transform', 'scale(1,-1)')
  $scale.appendChild($peakBottom);

  var $rmsBottom = this.$rmsBottom = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  $rmsBottom.setAttribute('class', 'rms');
  $rmsBottom.setAttribute('transform', 'scale(1,-1)')
  $scale.appendChild($rmsBottom);
}

Waveform.prototype._updateShape = function() {
  var data = this.props.waveform;

  var rmsPath = '0,0 ';
  var peakPath = '0,0 ';
  var duration = -1;

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var start = d[0], dur = d[1], peak = d[2], rms = d[3];
    var end = start + dur;

    if (end > duration) {
      duration = end;
    }

    peakPath += start + ',' + peak + ' ' + end + ',' + peak + ' ';
    rmsPath += start + ',' + rms + ' ' + end + ',' + rms + ' ';
  }

  peakPath += duration + ',0';
  rmsPath += duration + ',0';

  this.$rmsTop.setAttribute('points', rmsPath);
  this.$peakTop.setAttribute('points', peakPath);

  // TODO(maxhawkins): Maybe we should get rid of this?
  // We're taking the absolute value so adding a bottom
  // waveform doesn't add any more information.
  this.$rmsBottom.setAttribute('points', rmsPath);
  this.$peakBottom.setAttribute('points', peakPath);

  this.$rule.setAttribute('x2', duration);
}

Waveform.prototype.render = function() {
  if (!this.props.waveform._calculated) {
    this._updateShape();
    this.props.waveform._calculated = true;
  }

  if (this.props.scaleX !== this.lastScaleX) {
    var scaleX = this.props.scaleX;
    var scaleY = this.props.height / 2;
    var transform = 'scale(' + scaleX + ',' + scaleY + ')';
    this.$scale.setAttribute('transform', transform);
    this.lastScaleX = scaleX;
  }
};
