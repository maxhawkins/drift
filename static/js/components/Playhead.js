function pad(x, n) {
  return ('000000000' + x).slice(-n);
}

function timestamp(seconds) {
  var mins = parseInt(seconds / 60);
  var secs = parseInt(seconds - mins * 60);
  var frac = parseInt((seconds - secs - mins * 60) * 100);

  return pad(mins, 2) +
    ':' +
    pad(secs, 2) +
    '.' +
    pad(frac, 2);
}

function Playhead() {
  this.props = {
    currentTime: 0,
    scaleX: 1,
  }

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.setAttribute('class', 'playhead');

  var $group = this.$group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.appendChild($group);

  var $line = this.$line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  $line.setAttribute('x1', 0);
  $line.setAttribute('x2', 0);
  $line.setAttribute('y1', 0);
  $line.setAttribute('y2', '100%');
  $group.appendChild($line);

  var $label = this.$label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  $label.setAttribute('transform', 'translate(5, 10)');
  $label.setAttribute('font-size', '12');
  $label.textContent = timestamp(0);
  $group.appendChild($label);
}

Playhead.prototype.render = function() {
  var x = this.props.scaleX * this.props.currentTime;
  var transform = 'translate(' + x + ', 0)';
  this.$group.setAttribute('transform', transform);

  this.$label.textContent = timestamp(this.props.currentTime);
};
