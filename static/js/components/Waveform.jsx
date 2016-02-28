import React from 'react';

export default class Waveform extends React.Component {
  render() {
    var scaleX = this.props.scaleX;
    var scaleY = this.props.height / 2;

    return (<g className="wave-container" transform={this.props.transform}>
      <g className="scale" transform={`scale(${scaleX},${scaleY})`}>
        <WaveformUnscaled waveform={this.props.waveform} />
      </g>
    </g>);
  }
}

Waveform.defaultProps = {
  waveform: [],
  scaleX: 1,
  height: 100,
};

class WaveformUnscaled extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.waveform != nextProps.waveform;
  }
  render() {
    var data = this.props.waveform;

    var rmsPath = '0,0 ';
    var peakPath = '0,0 ';
    var duration = -1;

    // TODO(maxhawkins): render this into a canvas for performance.
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

    // TODO(maxhawkins): Since the intensity values we calculate
    // aren't signed we're just mirroring the absolute value over
    // the x-axis to make it look like the chart for the signed ones.
    // This doesn't add any more information and we should probably
    // get rid of it or add signed data.

    return (<g className="waveform">
      <line
        className="rule"
        x1="0"
        x2={duration}
        y1="0"
        y2="0"
        strokeWidth="0.001"/>
      <polyline
        points={peakPath}
        className="peak"/>
      <polyline
        points={rmsPath}
        className="rms"/>
      <polyline
        points={peakPath}
        className="peak"
        transform="scale(1,-1)"/>
      <polyline
        points={rmsPath}
        className="rms"
        transform="scale(1,-1)"/>
    </g>);
  }
}

WaveformUnscaled.defaultProps = {
  waveform: [],
};
