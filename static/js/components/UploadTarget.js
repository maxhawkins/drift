function UploadTarget() {
  this.props = {};

  this.$el = document.createElement('div');
  this.$el.innerHTML = [
    '<div class="select-files">Select files to process</div>',
    '<div>Or drag and drop them here</div>',
  ].join('');
  this.$el.className = 'drag-target';

  this.$el.addEventListener('click', (function(e) {
    if (this.onclick) { this.onclick(); }
    event.preventDefault();
  }).bind(this), false);

  this.render = this.render.bind(this);
}

UploadTarget.prototype.render = function() {
  if (this.props.active) {
    this.$el.classList.add('active');
  } else {
    this.$el.classList.remove('active');
  }
};
