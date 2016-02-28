import React from 'react';

import Uploader from '../api/Uploader.js';
import DragListener from '../components/DragListener.js';
import FileDialog from '../components/FileDialog.jsx';
import UploadTarget from '../components/UploadTarget.jsx';
import UploadList from '../components/UploadList.jsx';

export default class UploadPage extends React.Component {
  constructor(props) {
    super(props);

    this.uploader = new Uploader();
    this.uploader.onchange = (queue) => {
      this.setState({uploads: queue});
    };

    var dragListener = new DragListener();
    dragListener.onstart = () => {
      this.setState({dragging: true});
    };
    dragListener.onend = () => {
      this.setState({dragging: false});
    };
    dragListener.ondrop = this._onChoose.bind(this);

    this.state = {
      dragging: false,
      uploads: [],
    };
  }
  _onChoose(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this.uploader.upload(file);
    } 
  }
  _onClickUpload() {
    var dialog = this.refs.dialog;
    dialog.activate()
  }
  render() {
    return (<div>
      <FileDialog
        ref="dialog"
        onChoose={this._onChoose.bind(this)} />
      <UploadTarget
        dragging={this.state.dragging}
        onClick={this._onClickUpload.bind(this)} />
      <UploadList uploads={this.state.uploads} />
    </div>);
  }
}
