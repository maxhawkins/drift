function init() {
  var $main = document.getElementById('main');

  var page = new ViewPage();
  $main.appendChild(page.$el);

  page.render();
}

document.body.onload = init;
