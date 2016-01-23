function ViewPage() {
  var that = this;

  var api = new SessionAPI();

  var state = this.state = data;
  this.state.currentTime = 0;
  this.state.zoom = 0.3;
  this.state.playing = false;

  this._watchForUpdates();

  var $el = this.$el = document.createElement('div');
  
  var $audio = this.$audio = document.createElement('audio');
  $audio.type = 'audio/wav';
  $audio.src = '/blobs/' + data.playback_id;
  $el.appendChild($audio);


  var $title = this.$title = document.createElement('h2');
  $el.appendChild($title);

  var timeline = this.timeline = new Timeline();
  timeline.props.onSeek = function(newTime) {
    $audio.currentTime = newTime;
  };
  $el.appendChild(this.timeline.$el);

  var $downloadButton = this.$downloadButton = document.createElement('a');
  $downloadButton.innerText = 'Download CSV';
  $downloadButton.className = 'download-button';
  $el.appendChild($downloadButton);

  var zoomBar = this.zoomBar = new ZoomBar();
  zoomBar.onchange = function(value) {
    this.setState({zoom: value});
  }.bind(this);
  $el.appendChild(zoomBar.$el);

  var transcriptInput = this.transcriptInput = new TranscriptInput();
  $el.appendChild(transcriptInput.$el);
  transcriptInput.onsubmit = function(text) {
    that.setState({status: 'ALIGNING'});
    api.patch(that.state.id, {
      transcript: text
    }).then(function(sess) {
      that.setState(sess);
    });
    that._watchForUpdates();
  };

  var spaceListener = new KeyListener(32);
  spaceListener.onpress = function() {
    if ($audio.paused) {
      $audio.play();
    } else {
      $audio.pause();
    }
  };

  function update(t) {
    var newTime = $audio.currentTime;
    if (that.state.currentTime != newTime) {
      that.setState({currentTime: newTime});
    }
    var playing = !$audio.paused;
    if (that.state.playing != playing) {
      that.setState({playing: playing});
    }
    window.requestAnimationFrame(update);
  }
  window.setTimeout(update, 0);

  this.setState = this.setState.bind(this);
}

ViewPage.prototype.setState = function(updates) {
  for (k in updates) {
    this.state[k] = updates[k];
  }
  this.render();
}

ViewPage.prototype._watchForUpdates = function() {
  if (this.isWatching) {
    return;
  }
  if (this.state.status === 'DONE') {
    return;
  }
  this.isWatching = true;
  var watcher = new SessionWatcher(this.state.id);
  watcher.watch(function(sess) {
    // TODO(maxhawkins): fix jank caused by this update
    this.setState(sess);
    if (sess.status === 'DONE') {
      watcher.stop();
      this.isWatching = false;
    }
  }.bind(this));
}

ViewPage.prototype.render = function() {
  var words = [];
  var transcript = this.state.transcript;
  if (transcript) {
    words = transcript.words.filter(function(word) {
      return word.case === 'success';
    });
  }

  this.timeline.props.freqHz = this.state.freq_hz;
  this.timeline.props.waveform = this.state.waveform;
  this.timeline.props.currentTime = this.state.currentTime;
  this.timeline.props.playing = this.state.playing;
  this.timeline.props.zoom = this.state.zoom;
  this.timeline.props.words = words;
  this.timeline.render();

  this.$title.innerText = this.state.name;

  var href = this.state.id + '.csv';
  if (!this.setHref) {
    this.$downloadButton.href = href;
    this.setHref = true;
  }

  this.transcriptInput.props = {
    status: this.state.status,
  };
  this.transcriptInput.render();
};
