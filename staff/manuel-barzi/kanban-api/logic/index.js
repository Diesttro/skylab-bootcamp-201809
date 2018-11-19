const { User, Postit } = require('../data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const fs = require('fs')
const path = require('path')

const logic = {
    registerUser(name, surname, username, password) {
        validate([{ key: 'name', value: name, type: String }, { key: 'surname', value: surname, type: String }, { key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, surname, username, password })

            await user.save()
        })()
    },

    authenticateUser(username, password) {
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

    updateUser(id, name, surname, username, newPassword, password) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
            { key: 'surname', value: surname, type: String, optional: true },
            { key: 'username', value: username, type: String, optional: true },
            { key: 'password', value: password, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    },

    addCollaborator(id, collaboratorUsername) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'collaboratorUsername', value: collaboratorUsername, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const collaborator = await User.findOne({ username: collaboratorUsername })

            if (!collaborator) throw new NotFoundError(`user with username ${collaboratorUsername} not found`)

            if (user.id === collaborator.id) throw new NotAllowedError('user cannot add himself as a collaborator')

            user.collaborators.forEach(_collaboratorId => {
                if (_collaboratorId === collaborator.id) throw new AlreadyExistsError(`user with id ${id} arleady has collaborator with id ${_collaboratorId}`)
            })

            user.collaborators.push(collaborator._id)

            await user.save()
        })()
    },

    listCollaborators(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const collaborators = await Promise.all(user.collaborators.map(async collaboratorId => await User.findById(collaboratorId)))

            return collaborators.map(({ id, username }) => ({ id, username }))
        })()
    },

    // TODO review! fails because of "Uncaught Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed"
    _saveUserPhoto(id, file, filename) {
        const folder = `data/users/${id}`

        return new Promise((resolve, reject) => {
            const pathToFile = path.join(folder, filename)

            debugger

            const ws = fs.createWriteStream(pathToFile)

            fs.access(folder, fs.constants.F_OK, err => {
                if (err)
                    fs.mkdir(folder, err => {
                        if (err) return reject(err)

                        file.pipe(ws)

                        file.on('end', () => {
                            debugger

                            ws.close()

                            resolve()
                        })

                        file.on('error', err => {
                            debugger
                        })
                    })
                else
                    fs.readdir(folder, (err, files) => {
                        debugger
                        if (err) return reject(err)

                        const deletes = files.map(file => new Promise((resolve, reject) => {
                            debugger
                            fs.unlink(path.join(folder, file), err => {
                                if (err) return reject(err)

                                resolve()
                            })
                        }))

                        Promise.all(deletes)
                            .then(() => {
                                file.pipe(ws)

                                file.on('end', () => resolve())
                            })
                    })
            })
        })
    },

    saveUserPhoto(id, file, filename) {
        const folder = `data/users/${id}`

        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder)
                } else {
                    const files = fs.readdirSync(folder)

                    files.forEach(file => fs.unlinkSync(path.join(folder, file)))
                }

                const pathToFile = path.join(folder, filename)

                const ws = fs.createWriteStream(pathToFile)

                file.pipe(ws)

                resolve()
            } catch (err) {
                reject(err)
            }
        })
    },

    retrieveUserPhoto(id) {
        const folder = `data/users/${id}`

        return new Promise((resolve, reject) => {
            try {
                let file

                if (!fs.existsSync(folder)) {
                    file = 'data/users/default/profile.png'
                } else {
                    const files = fs.readdirSync(folder)

                    file = `data/users/${id}/${files[0]}`
                }

                const rs = fs.createReadStream(file)

                resolve(rs)
            } catch (err) {
                reject(err)
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
        validate([
            { key: 'id', value: id, type: String },
            { key: 'text', value: text, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = new Postit({ text, user: user.id })

            await postit.save()
        })()
    },

    listPostits(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])

        return (async () => {
            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postits = await Postit.find({ $or: [{ user: user._id }, { assignedTo: user._id }] })
                .lean()

            postits.forEach(postit => {
                postit.id = postit._id.toString()

                delete postit._id

                postit.user = postit.user.toString()

                if (postit.assignedTo)
                    postit.assignedTo = postit.assignedTo.toString()

                return postit
            })

            return postits
        })()
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
        validate([
            { key: 'id', value: id, type: String },
            { key: 'postitId', value: postitId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: user._id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

            await postit.remove()
        })()
    },

    modifyPostit(id, postitId, text) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'postitId', value: postitId, type: String },
            { key: 'text', value: text, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: user._id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

            postit.text = text

            await postit.save()
        })()
    },

    movePostit(id, postitId, status) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'postitId', value: postitId, type: String },
            { key: 'status', value: status, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: user._id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

            postit.status = status

            await postit.save()
        })()
    },

    assignPostit(id, postitId, collaboratorId) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'postitId', value: postitId, type: String },
            { key: 'collaboratorId', value: collaboratorId, type: String }
        ])

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: user._id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found`)

            postit.assignedTo = collaboratorId

            await postit.save()
        })()
    }
}

module.exports = logic