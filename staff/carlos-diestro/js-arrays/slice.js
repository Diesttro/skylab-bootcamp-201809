function slice(array, begin, end) {
  var newArray= [];
      begin = begin || 0,
      end = end || array.length;

  for(var i = begin, j = 0; i < end; i++, j++) {
    newArray[j] = array[i];
  }

  return newArray;
}