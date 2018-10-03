function fill(array, substitute, start, end) {
  var newArray = [],
  start = start || 0,
  end = end || array.length;

  duplicate();

  for(var i = start; i < end; i++) {
    newArray[i] = substitute;
  }

  function duplicate() {
    for(var i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
  }

  return newArray;
}