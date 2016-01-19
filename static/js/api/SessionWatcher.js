function SessionWatcher(sessionID) {
  this.sessionID = sessionID;
  this.api = new SessionAPI();
  this.stopped = false;
  this.lastStatus = null;
  this.interval = 500;
  this.callbacks = [];
  this._check = this._check.bind(this);

  window.setTimeout(this._check, this.interval);
}

SessionWatcher.prototype.watch = function(callback) {
  this.callbacks.push(callback);
}

SessionWatcher.prototype.awaitStatus = function(status) {
  return new Promise(function(resolve, reject) {
    this.watch(function(update) {
      if (update.status === 'ERROR') {
        reject(update.error);
        return;
      }
      if (update.status === status) {
        resolve(update);
      }
    });
  }.bind(this));
}

SessionWatcher.prototype.stop = function() {
  this.stopped = true;
  this.callbacks = [];
}

SessionWatcher.prototype._check = function() {
  this.api.get(this.sessionID)
    .then(function(result) {
      if (result.status !== this.lastStatus) {
        for (var i = 0; i < this.callbacks.length; i++) {
          this.callbacks[i](result);
        }
      }

      if (!this.stopped) {
        setTimeout(this._check, this.interval);
      }
    }.bind(this));
}
