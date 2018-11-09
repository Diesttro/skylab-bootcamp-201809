/**
 * Provides prototype inheritance mechanism
 * 
 * @param {Function} from The constructor function to extend from
 */
Function.prototype.extend = function(from) {
    this.prototype = Object.create(from.prototype);
    this.prototype.constructor = this;
};