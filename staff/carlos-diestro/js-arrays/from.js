function from(array, callback) {
  var newArray = [];

  for(var i = 0; i < array.length; i++) {
    if(typeof callback == 'function') {
      newArray[i] = callback(array[i]);
    } else {
      newArray[i] = array[i];
    }
  }

  return newArray;
}