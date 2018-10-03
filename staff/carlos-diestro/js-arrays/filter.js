function filter(array, callback) {
  var newArray = [];

  for(var i = 0, j = 0; i < array.length; i++) {
    if(callback(array[i])) {
      newArray[j] = array[i];
      j++;
    }
  }

  return newArray;
}