function of() {
  var newArray = [];

  for(var i = 0; i < arguments.length; i++) {
    newArray[i] = arguments[i];
  }

  return newArray;
}