function FileDialog() {
  this.$el = document.createElement('input');
  this.$el.type = 'file';
  this.$el.style.position = 'fixed';
  this.$el.style.top = '-100em';
  this.$el.multiple = true;
  document.body.appendChild(this.$el);

  this.$el.addEventListener('change', (function() {
    if (this.onchoose) {
      this.onchoose(this.$el.files);
    }
    this.$el.value = '';
  }).bind(this), false);
}

FileDialog.prototype.activate = function() {
  this.$el.click();
}
