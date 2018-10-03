function isArray(object) {
  var is = false;
  
  if(object instanceof Array) {
    is = true;
  }

  return is;
}