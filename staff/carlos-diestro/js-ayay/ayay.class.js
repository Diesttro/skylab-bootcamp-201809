class Ayay {
  constructor() {
    this.length = 0;
  }

  push() {
    for (var i = 0; i < arguments.length; i++) {
      this[this.length] = arguments[i];
      this.length++;
    }
  
    return this.length;
  }

  pop() {
    var element = undefined;

    if (this.length !== 0) {
      element = this[this.length - 1];
      
      delete this[this.length - 1];
      this.length--;
    }

    return element;
  }
}