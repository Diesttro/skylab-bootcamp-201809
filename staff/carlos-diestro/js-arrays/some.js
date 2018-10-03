function some(array, callback) {
  var pass = false;

  for(var i = 0; i < array.length; i++) {
    if(callback(array[i])) {
      pass = true;
      break;
    }
  }

  return pass;
}