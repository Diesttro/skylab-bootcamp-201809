const { User, Postit } = require('../data')

const logic = {
    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return User.findByUsername(username)
            .then(user => {
                if (user) throw Error(`username ${username} already registered`)

                user = new User({ name, surname, username, password })

                return user.save()
            })
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return User.findByUsername(username)
            .then(user => {
                if (!user || user.password !== password) throw Error('invalid username or password')

                return user.id
            })
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const _user = user.toObject()

                _user.id = id

                delete _user.password
                delete _user.postits

                return _user
            })
    },

    /**
     * Adds a postit
     * 
     * @param {string} id The user id
     * @param {string} text The postit text
     * 
     * @throws {TypeError} On non-string user id, or non-string postit text
     * @throws {Error} On empty or blank user id or postit text
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id
     */
    addPostit(id, text) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw Error('text is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const postit = new Postit({ text })

                user.postits.push(postit)

                return user.save()
            })
    },

    listPostits(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                return user.postits
            })
    },

    /**
     * Removes a postit
     * 
     * @param {string} id The user id
     * @param {string} postitId The postit id
     * 
     * @throws {TypeError} On non-string user id, or non-string postit id
     * @throws {Error} On empty or blank user id or postit text
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id, or postit id
     */
    removePostit(id, postitId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)

        if (!postitId.trim().length) throw Error('postit id is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const { postits } = user

                // by filtering

                // const _postits = postits.filter(postit => postit.id !== postitId)

                // if (_postits.length !== postits.length - 1) throw Error(`postit with id ${postitId} not found in user with id ${id}`)

                // user.postits = _postits

                // by finding index

                const index = postits.findIndex(postit => postit.id === postitId)

                if (index < 0) throw Error(`postit with id ${postitId} not found in user with id ${id}`)

                postits.splice(index, 1)

                return user.save()
            })
    },

    modifyPostit(id, postitId, text) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)

        if (!postitId.trim().length) throw Error('postit id is empty or blank')

        if(typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw Error('text is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw Error(`user with id ${id} not found`)

                const { postits } = user

                const postit = postits.find(postit => postit.id === postitId)

                if (!postit) throw Error(`postit with id ${postitId} not found in user with id ${id}`)

                postit.text = text

                return user.save()
            })
    }
}

module.exports = logic