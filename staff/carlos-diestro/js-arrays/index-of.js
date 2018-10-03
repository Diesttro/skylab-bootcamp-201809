function indexOf(array, search) {
  var postion = -1;

  for(var i = 0; i < array.length; i++) {
    if(search == array[i]) {
      position = i;
      break;
    }
  }

  return position;
}