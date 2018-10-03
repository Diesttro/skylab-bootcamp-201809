function every(array, callback) {
  var pass = true;

  for(var i = 0; i < array.length; i++) {
    if(!callback(array[i])) {
      pass = false;
      break;
    }
  }

  return pass;
}