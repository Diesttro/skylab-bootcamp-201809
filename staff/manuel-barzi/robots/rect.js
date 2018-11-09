/**
 * Rect function abstraction
 * 
 * @param {Number} fromX 
 * @param {Number} fromY 
 * @param {Number} toX 
 * @param {Number} toY 
 */
function Rect(fromX, fromY, toX, toY) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
}

Rect.prototype.y = function (x) {
    return (this.toY - this.fromY) / (this.toX - this.fromX) * x + this.fromY;
};

Rect.prototype.x = function (y) {
    return (this.toX - this.fromX) / (this.toY - this.fromY) * y + this.fromX;
};