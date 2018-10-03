function concat(array1, array2) {
  var length = array1.length;
  
  for(var i = 0; i < array2.length; i++) {
    array1[length + i] = array2[i];
  }

  return array1;
}