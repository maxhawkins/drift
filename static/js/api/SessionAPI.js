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
      resolve(resp.session);
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
