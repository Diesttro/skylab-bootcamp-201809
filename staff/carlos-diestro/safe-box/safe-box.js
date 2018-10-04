// safe-box.js

var safeBox = {
  saveSecret: function(secret, password) {
    return {
      secret: secret,
      password: password
    }
  },
  retrieveSecret: function(npassword) {
    if(npassword === this.password) {
      return 'ok';
    } else {
      return 'ko';
    }
  }
};