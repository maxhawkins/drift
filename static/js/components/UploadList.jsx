import React from 'react';

import UploadRow from './UploadRow.jsx';

export default class UploadList extends React.Component {
  render() {
    var rows = this.props.uploads.map((upload) => {
      return (<UploadRow upload={upload} />);
    });

    return (<div>
      <table
        className="upload-list"
        style={{display: (rows.length > 0 ? 'block' : 'none')}}>
        <tbody>
          <tr>
            <th className="timestamp-header"></th>
            <th className="name-header">Name</th>
            <th className="status-header">Status</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>);
  }
}
