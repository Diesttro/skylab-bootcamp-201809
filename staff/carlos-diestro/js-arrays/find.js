function find(array, callback) {
  var element = undefined;

  for(var i = 0; i < array.length; i++) {
    if(callback(array[i])) {
      element = array[i];
      break;
    }
  }

  return element;
}