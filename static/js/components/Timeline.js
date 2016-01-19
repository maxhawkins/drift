function Timeline() {
  this.props = {
    freq_hz: [],
    amplitude: [],
    currentTime: 0,
    zoom: 0,
  };
  var $el = this.$el = document.createElement('div');
  $el.className = 'timeline';

  var $inner = this.$inner = document.createElement('div');
  $inner.className = 'inner';
  $el.appendChild($inner);

  var $scales = this.$scales = d3.select($el)
  .append('svg')
    .attr('class', 'scales')
    .attr('height', '100%')

  var $canvas = this.$canvas = d3.select($inner)
  .append('svg')
    .attr('height', '100%')
    .on('click', this._handleClick.bind(this))

  this.$charts = $canvas.append('g');

  var $staff = this.$staff = $canvas.append('g')
    .attr('class', 'staff')
  $staff.append('line')
    .attr('y1', 0)
    .attr('y2', '100%');
  this.$staffLabel = $staff.append('text')
    .attr('transform', 'translate(5, 12)')
    .text('00:00');


  this.scaleX = d3.scale.linear();
}

Timeline.prototype._handleClick = function() {
  var screenX = d3.mouse(this.$inner)[0] + this.$inner.scrollLeft;
  var newTime = this.scaleX.invert(screenX);
  if (this.onSeek) {
    this.onSeek(newTime);
  }
};

function pad(x, n) {
  return ('000000000' + x).slice(-n);
}

function timestamp(seconds) {
  var mins = parseInt(seconds / 60);
  var secs = parseInt(seconds - mins * 60);
  var frac = parseInt((seconds - secs - mins * 60) * 100);

  return pad(mins, 2) +
    ':' +
    pad(secs, 2) +
    '.' +
    pad(frac, 2);
}

Timeline.prototype.render = function() {
  var lengthSecs = d3.max(this.props.amplitude, function(x) {
    var time = x[0];
    return time;
  });

  var paddingLeft = 60;
  var chartWidth = (15 + this.props.zoom * 1000) * lengthSecs;

  var scaleX = this.scaleX;
  scaleX
    .domain([0, lengthSecs])
    .range([paddingLeft, paddingLeft + chartWidth]);

  var newWidth = scaleX(lengthSecs) - scaleX(0) + 100;
  var widthChanged = !this.oldWidth || (this.oldWidth - newWidth) > 1e-3
  if (widthChanged) {
    this.$canvas.attr('width', newWidth);
    this.oldWidth = newWidth;
  }

  var currentTime = this.props.currentTime;
  this.$staff
    .attr('transform', function(val) {
      var x = scaleX(currentTime);
      return 'translate(' + x + ', 0)';
    });
  this.$staffLabel.text(timestamp(currentTime));

  var amplitudePairs = [];
  var amplitude = this.props.amplitude;
  for (var i = 0; i < amplitude.length; i++) {
    var time = amplitude[i][0];
    var peak = amplitude[i][1];
    var rms = amplitude[i][2];
    var lastTime = 0;
    if (i > 0) {
      var lastTime = amplitude[i-1][0];
    }
    var duration = time - lastTime;
    amplitudePairs.push([lastTime, duration, peak, rms]);
  }


  if (this.props.transcript && (!this.props.transcript._key || widthChanged)) {
    var transcript = this.$charts.append('g')
      .attr('class', 'transcript');

    var goodWords = this.props.transcript.words.filter(function(word) {
      return word.case === 'success';
    });

    transcript.selectAll('text')
      .data(goodWords)
      .enter()
        .append('text')
        .text(function(word) { return word.word; })
        .attr('transform', function(word) {
          var x = scaleX(word.start);
          var y = 400;
          return 'translate(' + x + ',' + y + ')';
        });

    // transcript.selectAll('g')
    //   .data(goodWords)
    //   .enter()
    //     .append('g')
    //     .attr('transform', function(word) {
    //       var x = scaleX(word.start);
    //       return 'translate(' + x + ', 0)';
    //     })
    //   .selectAll('text')
    //   .data(function(word) {
    //     var phones = [];
    //     var start = 0;
    //     for (var i = 0; i < word.phones.length; i++) {
    //       var phone = word.phones[i];
    //       phones.push([start, phone.phone]);
    //       start += phone.duration;
    //     }
    //     return phones;
    //   })
    //     .enter()
    //       .append('text')
    //       .text(function(phone) {
    //         return phone[1].split('_')[0];
    //       })
    //       .attr('style', 'font-size: 10px')
    //       .attr('transform', function(phone) {
    //         var x = scaleX(phone[0]) - paddingLeft;
    //         return 'translate(' + x + ', 350)';
    //       });

    transcript.selectAll('line')
      .data(goodWords)
      .enter()
        .append('line')
        .attr('y1', 0)
        .attr('y2', '100%')
        .attr('transform', function(word) {
          var x = scaleX(word.start);
          return 'translate(' + x + ', 0)';
        });

    this.props.transcript._key = true;
  }

  
  if (!this.props.amplitude._key || widthChanged) {
    var scaleAmplitude = d3.scale.linear()
      .domain([0, 1])
      .clamp(true)
      .range([0, 150]);

    var barOverlap = 0.1;
    this.$charts.append('line')
      .attr('class', 'amplitude-center')
      .attr('x1', scaleX(0))
      .attr('x2', scaleX(lengthSecs))
      .attr('y1', 100)
      .attr('y2', 100);

    var bars = this.$charts.append('g')
      .attr('class', 'amplitude')
      .selectAll('.bar');
    bars = bars.data(this.props.amplitude, function(val) {
        return val[0];
      });
    var barGroup = bars.enter()
      .append('g')
        .attr('class', 'bar')
        .attr('transform', function(val) {
          var time = val[0], duration = val[1], peak = val[2];
          var x = scaleX(time) - barOverlap;
          var y = 0;
          var width = scaleX(duration) - scaleX(0) + barOverlap * 2;
          var height = 200;
          var transform = 'translate(' + x + ',' + y + ')';
          transform += ' scale(' + width + ',' + height + ')';
          return transform;
        });
    barGroup.append('rect')
      .attr('class', 'peak')
      .attr('width', 1)
      .attr('y', function(val) {
        var peak = val[2];
        return (1 - peak) / 2;
      })
      .attr('height', function(val) {
        var peak = val[2];
        return peak;
      });
    barGroup.append('rect')
      .attr('class', 'rms')
      .attr('width', 1)
      .attr('y', function(val) {
        var peak = val[2], rms = val[3];
        var diff = peak - rms;
        return (1 - rms) / 2;
      })
      .attr('height', function(val) {
        var rms = val[3];
        return rms;
      });
    bars.exit().remove();

    this.props.amplitude._key = true;
  }

  if (!this.props.freq_hz._key || widthChanged) {
    var scalePitch = d3.scale.linear()
      .domain([0, 255])
      .range([150, 0]);
    var pitchAxis = d3.svg.axis()
      .orient('left')
      .tickSize(0, 5)
      .tickPadding(10)
      .ticks(5)
      .scale(scalePitch);
    this.$scales.append('g')
      .attr('transform', 'translate(50, 200)')
      .call(pitchAxis);

    var line = d3.svg.line()
      .x(function(d) { return scaleX(d[0]); })
      .y(function(d) { return scalePitch(d[1]) + 250; })

    var pitches = this.$charts.append('g')
      .attr('class', 'pitches');

    pitches.append('path')
      .attr('class', 'pitch-line')
      .attr('d', line(this.props.freq_hz));

    var dots = pitches.append('g')
      .attr('class', 'dots')
      .selectAll('circle')
      .data(this.props.freq_hz, function(x) {
        return x[0];
      });
    dots.enter().append('circle')
      .attr('r', 1)
      .attr('transform', function(x) {
        var t = x[0];
        var pitch = x[1];
        var x = scaleX(t);
        var y = scalePitch(pitch) + 250;
        return 'translate(' + x + ',' + y + ')';
      });
    dots.exit().remove();

    this.props.freq_hz._key = true;
  }
};
