function UploadPage() {
  this.state = {
    dragging: false,
    uploads: [],
  };
  this.$el = document.createElement('div');

  this.uploader = new Uploader();
  this.uploader.onchange = (function(queue) {
    this.setState({uploads: queue});
  }).bind(this);

  var dragListener = new DragListener();
  dragListener.onstart = (function() {
    this.setState({dragging: true});
  }).bind(this);
  dragListener.onend = (function() {
    this.setState({dragging: false});
  }).bind(this);
  dragListener.ondrop = (function(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this.uploader.upload(file);
    }
  }).bind(this);

  var fileDialog = new FileDialog();
  fileDialog.onchoose = (function(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this.uploader.upload(file);
    }
  }).bind(this);

  var uploadTarget = this.uploadTarget = new UploadTarget();
  uploadTarget.onclick = function() {
    fileDialog.activate();
  };
  this.$el.appendChild(uploadTarget.$el);

  var uploadList = this.uploadList = new UploadList();
  this.$el.appendChild(uploadList.$el);

  this.render = this.render.bind(this);
}

UploadPage.prototype.setState = function(updates) {
  for (k in updates) {
    this.state[k] = updates[k];
  }
  this.render();
}

UploadPage.prototype.render = function() {
  this.uploadTarget.props = {active: this.state.dragging};
  this.uploadTarget.render();
  this.uploadList.props = {uploads: this.state.uploads};
  this.uploadList.render();
}
