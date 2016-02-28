import React from 'react';

export default class ZoomBar extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.amount !== nextProps.amount;
  }

  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  _clickValue(ev) {
    var clickX = ev.clientX;
    var el = this.refs.container;
    var value = (clickX - el.offsetLeft) / el.offsetWidth;
    value = Math.min(1, Math.max(0, value));
    return value;
  }

  onMouseDown(ev) {
    // TODO(maxhawkins): abstract to handle touch events as well
    ev.preventDefault();

    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
  }

  onMouseMove(ev) {
    ev.preventDefault();

    var value = this._clickValue(ev);
    this.props.onChange(value);
  }

  onMouseUp(ev) {
    ev.preventDefault();

    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('mouseup', this.onMouseUp, false);

    var value = this._clickValue(ev);
    this.props.onChange(value);
  }

  render() {
    var percent = (this.props.amount * 100) + '%';
    return (<div ref="container" onMouseDown={this.onMouseDown} className="zoom">
      <div className="indicator" style={{width: percent}}></div>
      <div className="label">zoom</div>
    </div>);
  }
}
