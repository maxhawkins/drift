import React from 'react';

export default class TranscriptInput extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.disabled !== nextProps.disabled;
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.textarea.value)
  }
  render() {
    return (<div className="transcript-input">
      <h3></h3>
      <form onSubmit={this.onSubmit.bind(this)}>
        <textarea disabled={this.props.disabled} ref="textarea"></textarea>
        <input disabled={this.props.disabled} type="submit" />
      </form>
    </div>);
  }
}
