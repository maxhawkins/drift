import React from 'react';

export default class FileDialog extends React.Component {
  render() {
    return (<input
      ref="input"
      type="file"
      style={{
        position: 'fixed',
        top: '-100em',
      }}
      onChange={this._onChange.bind(this)}
      multiple="true" />);
  }
  activate() {
    this.refs.input.click();
  }
  _onChange() {
    var input = this.refs.input;
    var files = input.files;
    this.props.onChoose(files);
    input.value = '';
  }
}
