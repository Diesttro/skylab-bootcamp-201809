class Ayay {

    constructor() {
        this.length = 0;
    }

    push(element) {
        this[this.length] = element;
        if (element) this.length++;
        return this.length;
    }

    forEach(callback) {
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        for (let i = 0; i < this.length; i++) callback(this[i], i, this);       
    }

    map(callback) {
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        let result = [];
        for (let i = 0; !!(this[i]); i++)  result[i] = callback(this[i], i)
        return result;
    }

    sort() {
        if (this.length <= 0) throw new TypeError('ayay is empty');

        for (let i = 0; i < this.length - 1; i++) {
            let min = i;
            for (var j = i; j < this.length; j++) if ('' + this[j] < '' + this[min]) min = j;

            let sorted = this[i];
            this[i] = this[min];
            this[min] = sorted;
        }
        return this;
    }

    find(callback) {
        if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
        for (let i = 0; i < this.length; i++) if (callback(this[i])) this.push(this[i]);
        return this;
    }

    pop() {
        if (this.length === 0) return this.length;
        let result = this[this.length - 1]
        this.length = this.length - 1;  
        return result;
    }

}

