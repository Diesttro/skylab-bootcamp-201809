function join(array, token) {
  var string = array[0];

  for(var i = 1; i < array.length; i++) {
    string += token + array[i];
  }

  return string;
}