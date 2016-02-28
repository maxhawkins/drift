import React from 'react';
import ReactDOM from 'react-dom';

import ViewPage from './pages/ViewPage.jsx';

ReactDOM.render(React.createElement(ViewPage, window.data), document.getElementById('main'));
