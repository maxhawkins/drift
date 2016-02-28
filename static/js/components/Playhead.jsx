import React from 'react';

export default class Playhead extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.scaleX !== nextProps.scaleX ||
      this.props.currentTime !== nextProps.currentTime;
  }
  render() {
    var x = this.props.scaleX * this.props.currentTime;

    return (<g className="playhead">
      <line x1={x} x2={x} y1="0" y2="100%" />
      <text transform={`translate(${x + 5}, 10)`} fontSize="12">
        {timestamp(this.props.currentTime)}
      </text>
    </g>);
  }
}

Playhead.defaultProps = {
  currentTime: 0,
  scaleX: 1,
};

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