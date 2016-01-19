
function SessionAPI(baseURI) {
  this.baseURI = baseURI || '';
}

SessionAPI.prototype.get = function(session_id) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", this.baseURI + "/sessions/" + session_id + '.json', true);
  return new Promise(function(resolve, reject) {
    xhr.onerror = reject;
    xhr.onload = function(e) {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr.responseText);
        return;
      }
      var resp = JSON.parse(xhr.responseText);
      resolve(resp);
    }
    xhr.send(null);
  });
}

SessionAPI.prototype.patch = function(session_id, updates) {
  var xhr = new XMLHttpRequest();
  xhr.open("PATCH", this.baseURI + "/sessions/" + session_id + '.json', true);
  return new Promise(function(resolve, reject) {
    xhr.onerror = reject;
    xhr.onload = function(e) {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(xhr.responseText);
        return;
      }
      var resp = JSON.parse(xhr.responseText);
      resolve(resp);
    }
    xhr.send(JSON.stringify(updates));
  });
}

SessionAPI.prototype.post = function(file) {
  var form = new FormData();
  form.append('file', file);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.baseURI + "/sessions", true);

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
