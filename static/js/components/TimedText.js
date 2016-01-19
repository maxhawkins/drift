function Word() {
  this.props = {
    text: '',
  };

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.setAttribute('class', 'word');

  var $rule = this.$rule = document.createElementNS("http://www.w3.org/2000/svg", "line");
  $rule.setAttribute('x1', 0);
  $rule.setAttribute('x2', 0);
  $rule.setAttribute('y1', '-100%');
  $rule.setAttribute('y2', '100%');
  $el.appendChild($rule);

  var $text = this.$text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  $text.setAttribute('font-size', 10);
  $text.setAttribute('transform', 'translate(2, 10)');
  $el.appendChild($text);
}

Word.prototype.render = function() {
  this.$text.textContent = this.props.text;
};

function TimedText() {
  this.props = {
    words: [],
    scaleX: 1,
  };

  var $el = this.$el = document.createElementNS("http://www.w3.org/2000/svg", "g");
  $el.setAttribute('class', 'timed-text');

  this.words = [];
}

TimedText.prototype._update = function() {
  var data = this.props.words;

  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    var word = this.words[i];
    if (i >= this.words.length) {
      word = new Word();
      this.$el.appendChild(word.$el);
      this.words.push(word);
    }

    word.props.text = d.word;

    var transform = 'translate(' + (this.props.scaleX * d.start) + ',0)';
    word.$el.setAttribute('transform', transform);
  }

  for (var i = data.length; i < this.words.length; i++) {
    var word = this.words[i];
    word.$el.setAttribute('transform', 'translate(-999999,-999999)');
  }

  for (var i = 0; i < this.words.length; i++) {
    this.words[i].render();
  }
};

TimedText.prototype.render = function() {
  if (this.props.scaleX !== this.lastScaleX || this.props.words.length != this.wordCount) {
    this._update();
    this.props.words._calculated = true;
    this.lastScaleX = this.props.scaleX;
    this.wordCount = this.props.words.length
  }
};
