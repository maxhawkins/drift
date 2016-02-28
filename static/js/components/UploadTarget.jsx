import React from 'react';

export default class UploadTarget extends React.Component {
  render() {
    var className = 'drag-target';
    if (this.props.active) {
      className += ' active';
    }
    return (<div onClick={this.props.onClick} className={className}>
      <div className="select-files">Select files to process</div>
      <div>Or drag and drop them here</div>
    </div>);
  }
}
