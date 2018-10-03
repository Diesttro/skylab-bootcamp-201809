function concatAll(array) {
  for(var i = 1; i < arguments.length; i++) {
    if(arguments[i] instanceof Array) {
      for(var j = 0; j < arguments[i][j]; j++) {
        array[array.length] = arguments[i][j];
      }
    } else {
      array[array.length] = arguments[i];
    }
  }

  return array;
}