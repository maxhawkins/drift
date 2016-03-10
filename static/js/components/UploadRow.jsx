import React from 'react';

export default class UploadRow extends React.Component {
  render() {
    var upload = this.props.upload;

    var url = null;
    if (upload.status === 'DONE') {
      url = '/sessions/' + upload.id;
    }

    return (<tr className="upload">
      <td clasName="timestamp">{formatTimestamp(upload.timestamp)}</td>
      <td>{upload.name}</td>
      <td>
        <a href={url} target="_blank">{upload.status}</a>
      </td>
    </tr>);
  }
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

