import React from 'react';

import PitchScale from '../components/PitchScale.jsx';
import Playhead from '../components/Playhead.jsx';
import PitchTrace from '../components/PitchTrace.jsx';
import Waveform from '../components/Waveform.jsx';
import TimedText from '../components/TimedText.jsx';

class TimelineCharts extends React.Component {
  render() {
    return (<svg
      ref="canvas"
      style={{height: '100%'}}
      onMouseDown={this.props.handleClick}>
      <g className="charts" transform={`translate(${this.props.paddingLeft}, 0)`}>
        <TimedText
          words={this.props.words}
          transform="translate(0, 380)"
          scaleX={this.props.scaleX} />
        <Waveform
          waveform={this.props.waveform}
          transform="translate(0, 70)"
          height={100}
          scaleX={this.props.scaleX} />
        <PitchTrace
          freqHz={this.props.freqHz}
          transform="translate(0, 140)"
          height={200}
          scaleX={this.props.scaleX} />
        <Playhead currentTime={this.props.currentTime} scaleX={this.props.scaleX} />
      </g>
    </svg>);
  }
  _calcWidth() {
    var waveform = this.props.waveform;
    if (waveform.length <= 0) {
      return;
    }
    var lastSample = waveform[waveform.length - 1];
    var duration = lastSample[0] + lastSample[1];
    var width = Math.floor(
      this.props.scaleX * duration +
      this.props.paddingLeft +
      this.props.paddingRight);
    this.refs.canvas.setAttribute('width', width);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.waveform != prevProps.waveform ||
      this.props.scaleX != prevProps.scaleX) {
      this._calcWidth();
    }
  }
  componentDidMount() {
    this._calcWidth();
  }
}

TimelineCharts.defaultProps = {
  paddingLeft: 60,
  paddingRight: 60,
}

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
    };
  }
  _handleClick(ev) {
    var screenX = ev.clientX + this.state.scrollLeft - this.props.paddingLeft;
    var newTime = screenX / this._scaleX();
    this.props.onSeek(newTime);
  }
  _scaleX() {
    return 1000 * this.props.zoom + 30 * (1 - this.props.zoom);
  }
  componentDidMount() {
    // TODO(maxhawkins): make this resize when the clientwidth sizes
    this.setState({scrollWidth: this.refs.scroll.clientWidth});
  }
  componentDidUpdate(prevProps, prevState) {
    // TODO(maxhawkins): extract this scroll logic into
    // its own component.
    if (this.props.playing &&
        !this._isInScroll(this.props.currentTime)) {
      this._scrollTo(this.props.currentTime);
    }
  }
  _onScroll(ev) {
    this.setState({scrollLeft: this.refs.scroll.scrollLeft});
  }
  _isInScroll(t) {
    var x = this._scaleX() * t;
    var left = this.state.scrollLeft - this.props.paddingLeft;
    var right = left + this.state.scrollWidth - 50;
    return x >= left && x <= right;
  }
  _scrollTo(t) {
    var x = this._scaleX() * t + this.props.paddingLeft;
    this.refs.scroll.scrollLeft = x;
  };
  render() {
    return (<div className="timeline">
      <div className="scales">
        <PitchScale
          height={200}
          style={{position: 'absolute', top: 140, left: 5}} />
      </div>
      <div ref="scroll" onScroll={this._onScroll.bind(this)} className="scroll" style={{overflowX: 'scroll'}}>
        <TimelineCharts
          freqHz={this.props.freqHz}
          waveform={this.props.waveform}
          words={this.props.words}
          scaleX={this._scaleX()}
          currentTime={this.props.currentTime}
          paddingLeft={this.props.paddingLeft}
          paddingRight={this.props.paddingRight}
          handleClick={this._handleClick.bind(this)} />
      </div>
    </div>);
  }
}

Timeline.defaultProps = {
  freqHz: [],
  waveform: [],
  words: [],
  currentTime: 0,
  playing: false,
  zoom: 0,
  paddingLeft: 60,
  paddingRight: 60,
  minPitch: 50,
  maxPitch: 400,
};
