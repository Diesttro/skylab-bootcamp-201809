const { User, Postit } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')

const logic = {
    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!surname.trim()) throw new ValueError('surname is empty or blank')
        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return User.findOne({ username })
            .then(user => {
                if (user) throw new AlreadyExistsError(`username ${username} already registered`)

                user = new User({ name, surname, username, password })

                return user.save()
            })
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return User.findOne({ username })
            .then(user => {
                if (!user || user.password !== password) throw new AuthError('invalid username or password')

                return user.id
            })
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return User.findById(id, { '_id': 0, password: 0, postits: 0, __v: 0 })
            // .then(user => {
            //     if (!user) throw new NotFoundError(`user with id ${id} not found`)

            //     const _user = user.toObject()

            //     _user.id = id

            //     delete _user.password
            //     delete _user.postits

            //     return _user
            // })
            .lean()
            .then(user => { // ALT
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                user.id = id

                return user
            })
    },

    updateUser(id, name, surname, username, newPassword, password) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (name != null && typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (surname != null && typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (username != null && typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (newPassword != null && typeof newPassword !== 'string') throw TypeError(`${newPassword} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')
        if (name != null && !name.trim().length) throw new ValueError('name is empty or blank')
        if (surname != null && !surname.trim().length) throw new ValueError('surname is empty or blank')
        if (username != null && !username.trim().length) throw new ValueError('username is empty or blank')
        if (newPassword != null && !newPassword.trim().length) throw new ValueError('newPassword is empty or blank')
        if (!password.trim().length) throw new ValueError('password is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                if (user.password !== password) throw new AuthError('invalid password')

                if (username) {
                    return User.findOne({ username })
                        .then(_user => {
                            if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                            name != null && (user.name = name)
                            surname != null && (user.surname = surname)
                            user.username = username
                            newPassword != null && (user.password = newPassword)

                            return user.save()
                        })
                } else {
                    name != null && (user.name = name)
                    surname != null && (user.surname = surname)
                    newPassword != null && (user.password = newPassword)

                    return user.save()
                }
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

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw new ValueError('text is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                const postit = new Postit({ text })

                user.postits.push(postit)

                return user.save()
            })
    },

    listPostits(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return User.findById(id)
            .lean()
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                // return user.postits.map(({ _id, text }) => { id: _id.toString(), text })
                return user.postits.map(postit => {
                    postit.id = postit._id.toString()

                    delete postit._id

                    return postit
                })
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

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)

        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                const { postits } = user

                const index = postits.findIndex(postit => postit.id === postitId)

                if (index < 0) throw new NotFoundError(`postit with id ${postitId} not found in user with id ${id}`)

                postits.splice(index, 1)

                return user.save()
            })
    },

    modifyPostit(id, postitId, text) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)

        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw new ValueError('text is empty or blank')

        return User.findById(id)
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                const { postits } = user

                const postit = postits.find(postit => postit.id === postitId)

                if (!postit) throw new NotFoundError(`postit with id ${postitId} not found in user with id ${id}`)

                postit.text = text

                return user.save()
            })
    }
}

module.exports = logic