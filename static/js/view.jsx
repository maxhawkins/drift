
// function init() {
//   var $main = document.getElementById('main');

//   var page = new ViewPage();
//   $main.appendChild(page.$el);

//   page.render();
// }

// document.body.onload = init;


import React from 'react';
import ReactDOM from 'react-dom';
 
class World extends React.Component {
  render() {
    return <h1>World</h1>
  }
}
 
ReactDOM.render(<World/>, document.body);

