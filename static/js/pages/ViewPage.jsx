import React from 'react';
import ReactDOM from 'react-dom';
 
import TranscriptInput from '../components/TranscriptInput.jsx'
import ZoomBar from '../components/ZoomBar.jsx'
import Timeline from '../components/Timeline.jsx'

import KeyListener from '../components/KeyListener.js'
import SessionWatcher from '../api/SessionWatcher.js'
import SessionAPI from '../api/SessionAPI.js'

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.api = new SessionAPI();

    this.state = {
      name: '',
      id: null,
      status: 'INITIAL',
      currentTime: 0,
      zoom: 0.3,
      playing: false,
      isWatching: false,
    };

    for (var k in this.props.session) {
      this.state[k] = this.props.session[k];
    }

    var that = this;

    var spaceListener = new KeyListener(32);
    spaceListener.onpress = function() {
      var player = that.refs.player;
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    };

    // The timestamps we get from the <audio> tag change
    // at around 30fps. For smoother (60fps) scrolling we
    // need to animate between the timestamps instead.
    var lastFrame = 0;
    var lastPlayerTime = 0;
    var animateCurrentTime = (t) => {
      var player = this.refs.player;
      var isPlaying = !player.paused;
      var playerTime = player.currentTime;

      var newTime = playerTime;

      var diff = t - lastFrame;
      lastFrame = t;

      // TODO(maxhawkins): find a better way to estimate the
      // rate. This way is pretty janky because we're not
      // sampling the player's currentTime consistently.
      if (isPlaying && playerTime === lastPlayerTime) {
        newTime += diff / 1000;
      }
      lastPlayerTime = playerTime;

      this.setState({
        currentTime: newTime,
        playing: isPlaying,
      });
    }

    function update(t) {
      animateCurrentTime(t);
      window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);

    this._watchForUpdates = this._watchForUpdates.bind(this);
    this._watchForUpdates();
  }
  _watchForUpdates() {
    var that = this;
    if (this.isWatching) {
      return;
    }
    if (this.state.status === 'DONE') {
      return;
    }
    this.isWatching = true;
    var watcher = new SessionWatcher(this.state.id);
    watcher.watch(function(sess) {
      if (sess.status === 'ERROR') {
        that.setState({status: 'ERROR'});

        watcher.stop();
        that.isWatching = false;
      } if (sess.status === 'DONE') {
        watcher.stop();
        that.isWatching = false;

        that.api.get(that.state.id, {
          sideload: ['transcript'],
        }).then(function(updated) {
          that.setState(updated);
        });
      }
    });
  }

  onSeek(t) {
    var player = this.refs.player;
    player.currentTime = t;
  }
  onZoom(value) {
    this.setState({zoom: value});
  }
  onTranscript(transcript) {
    var that = this;
    this.setState({status: 'ALIGNING'});
    this.api.patch(this.state.id, {
      transcript: transcript
    }).then(function(sess) {
      that.setState(sess);
    });
    window.setTimeout(this._watchForUpdates, 0);
  }

  render() {
    var words = [];
    var transcript = this.state.transcript;
    if (transcript) {
      words = transcript.words.filter(function(word) {
        return word.case === 'success';
      });
    }
    var csvURL = this.state.id + '.csv';

    var errorMsg = '';
    if (this.state.status === 'ERROR') {
      errorMsg = 'Uh oh, there was a transcription error. Please try re-running Drift or contact the administrator.';
    }
    
    return (<div>
      <h2>{this.state.name}</h2>
      <Timeline
        freqHz={this.state.freq_hz}
        waveform={this.state.waveform}
        currentTime={this.state.currentTime}
        playing={this.state.playing}
        zoom={this.state.zoom}
        words={words}
        onSeek={this.onSeek.bind(this)} />
      <a href={csvURL} className="download-button">Download CSV</a>
      <ZoomBar
        amount={this.state.zoom}
        onChange={this.onZoom.bind(this)} />
      <div className="align-error">
        {errorMsg}
      </div>
      <TranscriptInput
        disabled={this.state.status !== 'DONE'}
        onSubmit={this.onTranscript.bind(this)} />
      <audio ref="player" type="audio/wav" src={`/blobs/${this.state.playback_id}.wav`} />
    </div>);
  }
}
