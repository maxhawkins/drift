function Upload(file) {
  this.name = file.name;
  this.file = file;
  this.id = null;
  this.status = 'WAITING';
  this.timestamp = new Date(Date.now());
}

Upload.prototype.update = function(changes) {
  for (k in changes) {
    this[k] = changes[k];
  }
};

function Uploader() {
  this.queue = [];
  this.active = 0;
  this.uploadAPI = new UploadAPI();

  this._work = this._work.bind(this);
};

Uploader.prototype.upload = function(file) {
  var upload = new Upload(file);
  this.queue.push(upload);
  this._notify();

  window.setTimeout(this._work, 0);
};

Uploader.prototype._remaining = function() {
  return this.queue.filter(function(upload) {
    return upload.status === 'WAITING';
  });
};

Uploader.prototype._work = function() {
  if (this.active >= 2) {
    return;
  }
  var remaining = this._remaining();
  if (remaining.length == 0) {
    return;
  }
  var upload = remaining[0];

  this.active += 1;
  upload.status = 'UPLOADING';
  this._notify();

  var watcher = null;

  var that = this;
  this.uploadAPI.post(upload.file).then(function(result) {
    upload.update(result);
    upload.file = null;
    that._notify();

    watcher = new SessionWatcher(upload.id);
    watcher.watch(function(changed) {
      upload.update(changed);
      that._notify();
    });

    return watcher.awaitStatus('DONE');
  }, function(err) {
    console.error(err);
    upload.status = 'UPLOAD_ERROR';
    that._notify();
  }).then(function() {
    watcher.stop();
    that.active -= 1;
    window.setTimeout(that._work, 0);
  });
};

Uploader.prototype._notify = function() {
  if (this.onchange) {
    this.onchange(this.queue);
  }
};
