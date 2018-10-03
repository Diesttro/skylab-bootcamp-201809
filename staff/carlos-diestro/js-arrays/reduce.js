function reduce(array, callback, num) {
  var accum = num || 0;
  
  for(var i = 0; i < array.length; i++) {
    accum = callback(accum, array[i]);
  }

  return accum;
}