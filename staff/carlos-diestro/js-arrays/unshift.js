function unshift(array) {
  var newArray = [];

  duplicate();

  array.length = 0;

  for(var i = 1; i < arguments.length; i++) {
    array[array.length] = arguments[i];
  }

  for(var i = 0; i < newArray.length; i++) {
    array[array.length] = newArray[i];
  }

  function duplicate() {
    for(var i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
  }

  return array.length;
}