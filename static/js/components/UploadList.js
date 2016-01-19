function UploadList() {
  this.props = {
    uploads: [],
  };

  this.$el = document.createElement('table');
  this.$el.className = 'upload-list';

  this.$thead = document.createElement('thead');
  this.$thead.innerHTML = [
    '<tr>',
      '<th class="timestamp-header"></th>',
      '<th class="name-header">Name</th>',
      '<th class="status-header">Status</th>',
    '</tr>',
  ].join('');
  this.$el.appendChild(this.$thead);

  this.$tbody = document.createElement('tbody');
  this.$el.appendChild(this.$tbody);

  this.render = this.render.bind(this);
}

UploadList.prototype.render = function() {
  if (this.props.uploads.length == 0) {
    this.$el.style.display = 'none';
  } else {
    this.$el.style.display = 'block';
  }

  var rows = this.props.uploads.map(function(upload) {
    var row = new UploadRow();
    row.props = upload;
    row.render();
    return row;
  });

  this.$tbody.innerHTML = '';
  for (var i = 0; i < rows.length; i++) {
    this.$tbody.appendChild(rows[i].$el);
  }
};
