function sort(array) {
  var newArray = [],
      temp;

  for(var i = 0; i < array.length; i++) {
    newArray[i] = array[i];
  }

  for(var i = 0; i < newArray.length; i++) {
    for(var j = i + 1; j < newArray.length; j++) {
      if(newArray[i].toString() > newArray[j].toString()) {
        temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
      }
    }
  }

  return newArray;
}