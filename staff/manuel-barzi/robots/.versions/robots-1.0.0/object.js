/**
 * Provides prototype inheritance mechanism
 * 
 * @param {Function} from The constructor function to extend from
 * @param {Function} to The constructor function to extend to
 */
Object.extend = function(from, to) {
    to.prototype = Object.create(from.prototype);
    to.prototype.constructor = to;
};