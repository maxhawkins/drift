import React from 'react';

export default class PitchScale extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.height !== nextProps.height ||
      this.props.minPitch !== nextProps.minPitch ||
      this.props.maxPitch !== nextProps.maxPitch ||
      this.props.tickCount !== nextProps.tickCount ||
      this.props.fontSize !== nextProps.fontSize;
  }
  _scaleY(pitch) {
    var yScale = this.props.height / (this.props.minPitch - this.props.maxPitch);
    var y = (pitch - this.props.maxPitch) * yScale + this.props.fontSize;
    return y;
  }

  render() {
    var labelY = this._scaleY(this.props.minPitch) + this.props.fontSize / 4;
    var tickSize = (this.props.maxPitch - this.props.minPitch) / this.props.tickCount;

    var tickLabels = [];
    var ticks = [];
    for (var tick = this.props.minPitch; tick <= this.props.maxPitch; tick += tickSize) {
      var y = this._scaleY(tick);

      tickLabels.push(<text
        key={'label-' + tick}
        transform={`translate(39, ${y + this.props.fontSize / 4})`}
        textAnchor="end">
        {tick}
      </text>);

      ticks.push(<line
        className="tick"
        key={'tick-' + tick}
        x1={45}
        x2={51}
        y1={y}
        y2={y} />);
    }

    var style = {
      width: 200,
      height: this.props.height + this.props.fontSize * 2,
    };
    for (var k in this.props.style) {
      style[k] = this.props.style[k];
    }

    return (<svg
      className="pitch-scale"
      style={style}>
        <text transform={`translate(2, ${labelY})`}>Hz</text>
      <line
        className="bar"
        x1={48}
        x2={48}
        y1={this._scaleY(this.props.minPitch)}
        y2={this._scaleY(this.props.maxPitch)}/>
      {tickLabels}
      {ticks}
    </svg>);
  }
};

PitchScale.defaultProps = {
  height: 200,
  minPitch: 50,
  maxPitch: 400,
  tickCount: 7,
  fontSize: 14,
};







// PitchScale.prototype.render = function() {};
