function splice(array, start, delElements) {
  var duplicatedArray = [],
      newArray = [],
      num = start + delElements - 1;
      
  duplicate();

  array.length = 0;

  for(var i = 0, j = 0, k = 0; i < duplicatedArray.length; i++) {
    if(i >= start && i <= num) {
      newArray[k] = duplicatedArray[i];
      k++;
    } else {
      array[j] = duplicatedArray[i];
      j++;
    }
  }

  function duplicate() {
    for(var i = 0; i < array.length; i++) {
      duplicatedArray[i] = array[i];
    }
  }

  return newArray;
}