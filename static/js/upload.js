function init() {
  var $main = document.getElementById('main');

  var uploader = new Uploader();

  var page = new UploadPage(uploader)
  $main.appendChild(page.$el);

  page.render();
}

document.body.onload = init;
