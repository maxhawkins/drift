function TranscriptInput() {
  var $el = this.$el = document.createElement('div')
  $el.className = 'transcript-input';

  var $header = this.$header = document.createElement('h3');
  $header.innerText = 'Transcript';
  $el.appendChild($header);

  var $form = this.$form = document.createElement('form');
  $el.appendChild($form);

  var $textarea = this.$textarea = document.createElement('textarea');
  $form.appendChild($textarea);

  var $submit = this.$submit = document.createElement('input');
  $submit.type = 'submit';
  $form.appendChild($submit);

  $form.addEventListener('submit', function(e) {
    if (this.onsubmit) {
      this.onsubmit($textarea.value);
    }
    e.preventDefault();
  }.bind(this), false);
}

TranscriptInput.prototype.render = function() {

};
