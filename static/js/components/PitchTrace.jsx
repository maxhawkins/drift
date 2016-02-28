import React from 'react';

export default class PitchTrace extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.freqHz !== nextProps.freqHz ||
      this.props.scaleX !== nextProps.scaleX ||
      this.props.minPitch !== nextProps.minPitch ||
      this.props.maxPitch !== nextProps.maxPitch ||
      this.props.height !== nextProps.height;
  }
  render() {
    var data = this.props.freqHz;
    var circles = [];
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var time = d[0], freq = d[1];

      var x = this.props.scaleX * time;
      var yScale = this.props.height / (this.props.minPitch - this.props.maxPitch);
      var y = (freq - this.props.maxPitch) * yScale;

      circles.push(<circle key={i} r="1" transform={`translate(${x},${y})`} />);
    }

    return (<g className="pitch-trace" transform={this.props.transform}>
      {circles}
    </g>);
  }
}

PitchTrace.defaultProps = {
  freqHz: [],
  scaleX: 1,
  minPitch: 50,
  maxPitch: 400,
  height: 300,
};
