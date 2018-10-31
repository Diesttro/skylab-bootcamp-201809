const forEach = (array, callback, index = 0) => {
  if(index < array.length) {
    callback(array[index], index)
    
    forEach(array, callback, ++index)
  }
}

module.exports = forEach