/**
 * Component abstraction
 * 
 * @param {string} id The id of the DOM element associated to this component
 * @param {string} tag The tag name of the DOM element associated to this component
 */
function Component(id, tag) {
    this.element = document.createElement(tag || 'div');

    if (id) this.element.id = id;
    
    this._width = 0;
    this._height = 0;
    this._x = 0;
    this._y = 0;
}

Object.defineProperty(Component.prototype, 'style', {
    get: function () {
        return this.element.style;
    }
});

Object.defineProperty(Component.prototype, 'color', {
    get: function () {
        return this.style.backgroundColor;
    },

    set: function (color) {
        this.style.backgroundColor = color;
    }
});

Object.defineProperty(Component.prototype, 'width', {
    get: function () {
        return this._width;
    },

    set: function (width) {
        this._width = width;
        this.style.width = width + 'px';
    }
});

Object.defineProperty(Component.prototype, 'height', {
    get: function () {
        return this._height;
    },

    set: function (height) {
        this._height = height;
        this.style.height = height + 'px';
    }
});

Object.defineProperty(Component.prototype, 'x', {
    get: function () {
        return this._x;
    },

    set: function (x) {
        this._x = x;
        this.style.left = x + 'px';
    }
});

Object.defineProperty(Component.prototype, 'y', {
    get: function () {
        return this._y;
    },

    set: function (y) {
        this._y = y;
        this.style.top = y + 'px';
    }
});

Component.prototype.add = function (child) {
    if (!(child instanceof Component)) throw TypeError(child + ' is not a Component');

    this.element.appendChild(child.element);
};