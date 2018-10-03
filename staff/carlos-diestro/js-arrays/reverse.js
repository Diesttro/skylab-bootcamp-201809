function reverse(array) {
  var newArray = [];

  for(var i = 0; i < array.length; i++) {
    newArray[i] = array[i];
  }

  for(var i = 0, j = newArray.length - 1; i < newArray.length; i++, j--) {
    array[i] = newArray[j];
  }
}