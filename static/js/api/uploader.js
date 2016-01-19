function Upload(file) {
  this.name = file.name;
  this.file = file;
  this.id = null;
  this.status = 'WAITING';
  this.timestamp = new Date(Date.now());
}

function Uploader() {
  this.queue = [];
  this.active = 0;
  this.sessionAPI = new SessionAPI();
  this.uploadAPI = new UploadAPI();

  this._work = this._work.bind(this);
}

Uploader.prototype.upload = function(file) {
  var upload = new Upload(file);
  this.queue.push(upload);
  this._notify();

  window.setTimeout(this._work, 0);
}

Uploader.prototype._remaining = function() {
  return this.queue.filter(function(upload) {
    return upload.status === 'WAITING';
  });
}

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

  var checkStatus = function() {
    return that.sessionAPI.get(upload.id).then(function(result) {
      for (k in result) {
        upload[k] = result[k];
      }
      that._notify();
      if (upload.status === 'ERROR') {
        console.error(upload.error);
        return upload
      }
      if (upload.status === 'DONE') {
        return upload;
      }
  
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          checkStatus().then(resolve, reject);
        }, 500);
      });
    })
  }
  


  var that = this;
  this.uploadAPI.post(upload.file).then(function(result) {
    for (k in result) {
      upload[k] = result[k];
    }
    upload.file = null;
    that._notify();

    return checkStatus();
  }, function(err) {
    console.log(err);
    upload.status = 'UPLOAD_ERROR';
    that._notify();
  }).then(function() {
    console.log('done');
    that.active -= 1;
    window.setTimeout(that._work, 0);
  });
}

Uploader.prototype._notify = function() {
  if (this.onchange) {
    this.onchange(this.queue);
  }
}
