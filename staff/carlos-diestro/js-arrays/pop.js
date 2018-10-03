function pop(array) {
  var newArray = [],
      element;

  if(array.length) {
    duplicate();

    element = array[array.length - 1];
    array.length = 0;

    for(var i = 0; i < newArray.length - 1; i++) {
      array[i] = newArray[i];
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