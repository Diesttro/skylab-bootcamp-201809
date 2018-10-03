function shift(array) {
  var newArray = [],
      element;

  if(array.length) {
    duplicate();

    element = array[0];
    array.length = 0;

    for(var i = 1; i < newArray.length; i++) {
      array[i - 1] = newArray[i];
    }

  } else {
    element = undefined;
  }

  function duplicate() {
    for(var i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
  }

  return element;
}