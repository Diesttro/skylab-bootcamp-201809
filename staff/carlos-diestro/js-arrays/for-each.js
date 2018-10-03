function forEach(array, callback) {
  if(!(array instanceof Array)) throw Error('array is not valid');

  for(var i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}