function Ayay() {
    this.length = 0;
}

Ayay.prototype.push = function() {
  for (var i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
    this.length++;
  }

  return this.length;
};

Ayay.prototype.pop = function() {
  var element = undefined;

    if (this.length !== 0) {
      element = this[this.length - 1];
      
      delete this[this.length - 1];
      this.length--;
    }

    return element;
};

Ayay.prototype.forEach = function(callback) {
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    for (var i = 0; i < this.length; i++) callback(this[i], i, this);
};

Ayay.prototype.map = function(callback) {
  if (typeof callback !== 'function') throw Error(callback + ' is not a function');

  var newAyay = new Ayay;

  for (var i = 0; i < this.length; i++) {
    newAyay.push(callback(this[i], i, this));  
  }

  return newAyay;
};

Ayay.prototype.sort = function() {
  var temp;

  for(var i = 0; i < this.length; i++) {
    for(var j = i + 1; j < this.length; j++) {
      if(this[i].toString() > this[j].toString()) {
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
      }
    }
  }

  return this;
};

Ayay.prototype.filter = function(callback) {
  if (typeof callback !== 'function') throw Error(callback + ' is not a function');

  var newAyay = new Ayay;

  for (var i = 0, j = 0; i < this.length; i++) {
    if (callback(this[i])) {
      newAyay.push(this[i]);
    }
  }

  return newAyay;
};

Ayay.prototype.find = function(callback) {
  if (typeof callback !== 'function') throw Error(callback + ' is not a function');
  
  var element = undefined;

  for(var i = 0; i < this.length; i++) {
    if(callback(this[i])) {
      element = this[i];
      break;
    }
  }

  return element;
};