function UploadRow() {
  this.$el = document.createElement('tr');
  this.$el.className = 'upload';

  this.$timestamp = document.createElement('td');
  this.$timestamp.className = 'timestamp';
  this.$el.appendChild(this.$timestamp);

  this.$name = document.createElement('td');
  this.$el.appendChild(this.$name);

  this.$link = document.createElement('a');
  this.$link.target = '_blank';
  this.$name.appendChild(this.$link);

  this.$status = document.createElement('td');
  this.$el.appendChild(this.$status);

  this.render = this.render.bind(this);
}

function pad(number) {
  return ('000' + number).slice(-2);
}

function formatTimestamp(ts) {
  var time = new Date(ts);
  var ampm = 'AM';
  var h = time.getHours();
  if (h > 12) {
    ampm = 'PM';
    h -= 12;
  }
  if (h == 0) {
    h = 12;
  }
  var str = '';
  str += pad(h % 12 + 1);
  str += ':' + pad(time.getMinutes());
  str += ':' + pad(time.getSeconds());
  str += ' ' + ampm;
  return str;
}

UploadRow.prototype.render = function() {
  this.$link.innerText = this.props.name;
  if (this.props.status === 'DONE') {
    this.$link.href = '/sessions/' + this.props.id;
  }
  this.$timestamp.innerText = formatTimestamp(this.props.timestamp);
  this.$status.innerText = this.props.status;
};
