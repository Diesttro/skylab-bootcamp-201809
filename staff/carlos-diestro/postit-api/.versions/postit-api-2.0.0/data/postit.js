const uid = require('uuid/v4')

class Postit {
    constructor({ id, text }) {
        this.id = id || uid()
        this.text = text
    }
}

module.exports = Postit