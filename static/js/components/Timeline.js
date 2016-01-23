function Timeline() {
  this.props = {
    freqHz: [],
    waveform: [],
    words: [],
    currentTime: 0,
    zoom: 0,
    paddingLeft: 60,
    paddingRight: 60,
    minPitch: 50,
    maxPitch: 400,
  };

  var $el = this.$el = document.createElement('div');
  $el.className = 'timeline';

  var $scales = this.$scales = document.createElement('div');
  $scales.className = 'scales';
  $el.appendChild($scales);

  var $scroll = this.$scroll = document.createElement('div');
  $scroll.className = 'scroll';
  $scroll.style['overflow-x'] = 'scroll';
  $el.appendChild($scroll);

  var $canvas = this.$canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $canvas.setAttribute('height', '100%');
  $canvas.addEventListener('mousedown', this._handleClick.bind(this), false);
  $scroll.appendChild($canvas);

  var $charts = this.$charts = document.createElementNS("http://www.w3.org/2000/svg", "g");
  var transform = 'translate(' + this.props.paddingLeft + ', 0)';
  this.$charts.setAttribute('transform', transform);
  $charts.setAttribute('class', 'charts');
  $canvas.appendChild($charts);

  var timedText = this.timedText = new TimedText();
  timedText.$el.setAttribute('transform', 'translate(0, 380)');
  $charts.appendChild(timedText.$el);

  var waveform = this.waveform = new Waveform();
  waveform.props.height = 100;
  waveform.$el.setAttribute('transform', 'translate(0, 70)');
  $charts.appendChild(waveform.$el);

  var pitchTrace = this.pitchTrace = new PitchTrace();
  pitchTrace.props.height = 200;
  pitchTrace.$el.setAttribute('transform', 'translate(0, 140)');
  $charts.appendChild(pitchTrace.$el);

  var pitchScale = this.pitchScale = new PitchScale();
  pitchScale.props.height = 200;
  pitchScale.$el.style['position'] = 'absolute';
  pitchScale.$el.style['top'] = 140;
  pitchScale.$el.style['left'] = 5;
  $scales.appendChild(pitchScale.$el);

  var playhead = this.playhead = new Playhead();
  $charts.appendChild(playhead.$el);

  this._scaleX = this._scaleX.bind(this);
}

Timeline.prototype._scaleX = function() {
  return 1000 * this.props.zoom + 30 * (1 - this.props.zoom);
}

Timeline.prototype._handleClick = function(e) {
  var screenX = e.offsetX + this.$canvas.scrollLeft - this.props.paddingLeft;
  var newTime = screenX / this._scaleX();
  if (this.props.onSeek) {
    this.props.onSeek(newTime);
  }
};

Timeline.prototype.render = function() {
  var waveform = this.props.waveform;
  var lastSample = waveform[waveform.length - 1];
  var duration = lastSample[0] + lastSample[1];

  var width = parseInt(
    this._scaleX() * duration +
    this.props.paddingLeft +
    this.props.paddingRight);
  if (this.$canvas.clientWidth != width) {
    this.$canvas.setAttribute('width', width);
  }

  this.timedText.props.words = this.props.words;
  this.timedText.props.scaleX = this._scaleX();
  this.timedText.render();

  this.waveform.props.waveform = this.props.waveform;
  this.waveform.props.scaleX = this._scaleX();
  this.waveform.render();

  this.pitchTrace.props.freqHz = this.props.freqHz;
  this.pitchTrace.props.scaleX = this._scaleX();
  this.pitchTrace.render();

  this.playhead.props.currentTime = this.props.currentTime;
  this.playhead.props.scaleX = this._scaleX();
  this.playhead.render();

  this.pitchScale.render();
};
