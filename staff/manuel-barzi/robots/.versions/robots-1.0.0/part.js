/**
 * Part abstraction
 * 
 * @param {string} id The id of the DOM element associated to this component 
 * @param {string} tag The tag name of the DOM element associated to this component 
 */
function Part(id, tag) {
    Component.call(this, id, tag);

    this.style.position = 'absolute';
    this.style.transformOrigin = 'top center';
    this._rotation = 0;
}

Object.extend(Component, Part);

Object.defineProperty(Component.prototype, 'rotation', {
    get: function () {
        return this._rotation;
    },

    set: function (rotation) {
        this._rotation = rotation;
        this.style.transform = 'rotate(' + rotation + 'deg)';
    }
});