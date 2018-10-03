function includes(array, string) {
  var finded = false;

  for(var i = 0; i < array.length; i++) {
    if(array[i] == string) {
      finded = true;
      break;
    }
  }

  return finded;
}