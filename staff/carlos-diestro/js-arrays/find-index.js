function findIndex(array, callback) {
  var position = -1;

  for(var i = 0; i < array.length; i++) {
    if(callback(array[i])) {
      position = i;
      break;
    }
  }

  return position;
}