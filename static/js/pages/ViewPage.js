function ViewPage() {
  var that = this;

  var api = new SessionAPI();

  var state = this.state = data;
  this.state.currentTime = 0;
  this.state.zoom = 0.2;

  var $el = this.$el = document.createElement('div');
  
  var $audio = this.$audio = document.createElement('audio');
  $audio.type = 'audio/wav';
  $audio.src = '/blobs/' + data.playback_id;
  $el.appendChild($audio);

  var timeline = this.timeline = new Timeline();
  timeline.onSeek = function(newTime) {
    $audio.currentTime = newTime;
  };
  $el.appendChild(this.timeline.$el);

  var $downloadButton = this.$downloadButton = document.createElement('a');
  $downloadButton.innerText = 'Download CSV';
  $downloadButton.className = 'download-button';
  $el.appendChild($downloadButton);

  // var zoomBar = this.zoomBar = new ZoomBar();
  // zoomBar.onchange = function(value) {
  //   this.setState({zoom: value});
  // }.bind(this);
  // $el.appendChild(zoomBar.$el);

  var transcriptInput = new TranscriptInput();
  $el.appendChild(transcriptInput.$el);
  transcriptInput.onsubmit = function(text) {
    api.patch(that.state.id, {
      transcript: text
    });
  }

  window.addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
      if ($audio.paused) {
        $audio.play();
      } else {
        $audio.pause();
      }
    }
  }, false);

  function update(t) {
    that.setState({currentTime: $audio.currentTime});
    window.requestAnimationFrame(update);
  }
  setTimeout(update, function() {
    window.requestAnimationFrame(update);
  }, 0);

  this.setState = this.setState.bind(this);
}

ViewPage.prototype.setState = function(updates) {
  for (k in updates) {
    this.state[k] = updates[k];
  }
  this.render();
}

ViewPage.prototype.render = function() {
  this.timeline.props = {
    freq_hz: this.state.freq_hz,
    waveform: this.state.waveform,
    currentTime: this.state.currentTime,
    zoom: this.state.zoom,
    transcript: this.state.transcript,
  };
  this.timeline.render();

  var href = this.state.id + '.csv';
  if (!this.setHref) {
    this.$downloadButton.href = href;
    this.setHref = true;
  }
};
