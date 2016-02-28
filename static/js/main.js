import React from 'react';
import ReactDOM from 'react-dom';

import ViewPage from './pages/ViewPage.jsx';
import UploadPage from './pages/UploadPage.jsx';

var page;
var path = window.location.pathname;
if (path.indexOf('/upload') == 0) {
  page = UploadPage;
} else if (path.indexOf('/sessions') == 0) {
  page = ViewPage
} else {
  throw new Error('unknown page');
}

ReactDOM.render(
  React.createElement(page, window.data),
  document.getElementById('main'));
