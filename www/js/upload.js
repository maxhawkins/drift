function init() {
  var $file = document.getElementById('file');
  var $submit = document.getElementById('submit');
  var $form = document.getElementById('form');
  var $error = document.getElementById('error');

  $submit.disabled = false;

  function submit() {
    var data = new FormData($form);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/sessions", true);
    xhr.onload = function(e) {
      if (xhr.status < 200 || xhr.status >= 300) {
        $error.innerHTML = xhr.responseText;
        return;
      }
      var respData = JSON.parse(xhr.responseText);
      var sessionID = respData.session_id;
      window.location = '/sessions/' + sessionID;
    };
    xhr.send(data);
  }

  $form.addEventListener('submit', function(e) {
    e.preventDefault();
    submit();
    return false;
  }, false);
}

document.body.onload = init;
