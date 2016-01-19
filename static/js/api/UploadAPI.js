function UploadAPI(baseURI) {
  this.baseURI = baseURI || '';
}

UploadAPI.prototype.post = function(file) {
  var form = new FormData();
  form.append('file', file);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.baseURI + "/upload", true);

  return new Promise(function(resolve, reject) {
    xhr.onerror = reject;
    xhr.onload = function(e) {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr.responseText);
        return;
      }
      var resp = JSON.parse(xhr.responseText);
      resolve(resp);
    };
    xhr.send(form);
  });
}
