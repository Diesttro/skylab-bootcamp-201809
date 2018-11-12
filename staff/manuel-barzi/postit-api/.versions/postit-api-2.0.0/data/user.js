const uid = require('uuid/v4')

class User {
    constructor({ id, name, surname, username, password, postits }) {
        this.id = id || uid()

        this.name = name
        this.surname = surname
        this.username = username
        this.password = password

        this.postits = postits || []
    }

    save() {
        return User._collection.findOne({ id: this.id })
            .then(user => {
                if (user) {
                    return User._collection.updateOne({ id: this.id }, { $set: this })
                } else {
                    return User._collection.insertOne(this)
                }
            })
    }

    toObject() {
        const { name, surname, username, password, postits } = this

        return { name, surname, username, password, postits }
    }

    static findByUsername(username) {
        return this._collection.findOne({ username })
            .then(user => user ? new User(user) : undefined)
    }

    static findById(id) {
        return this._collection.findOne({ id })
            .then(user => user ? new User(user) : undefined)
    }
}

User._collection = 'NO-COLLECTION'

module.exports = User