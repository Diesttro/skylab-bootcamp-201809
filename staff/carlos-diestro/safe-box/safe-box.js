// safe-box.js

var safeBox;

(function() {
  var _secret;
  var _password;

  safeBox = {
    saveSecret: function(secret, password) {
      if(typeof password !== 'string' ||password.trim().length === 0) throw Error('invalid password');

      _secret = secret;
      _password = password
    },
    retrieveSecret: function(password) {
      if(password === _password) {
        return _secret;
      }
    }
  }
})();