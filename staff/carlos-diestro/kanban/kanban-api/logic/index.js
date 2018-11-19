const { User, Postit } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')
const fs = require('fs')

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

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, surname, username, password })

            await user.save()
        })()
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            const user = await User.findOne({ username })
            
            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            if (user.avatar) {
                const bitmap = fs.readFileSync(user.avatar)
    
                const buffer = new Buffer(bitmap).toString('base64')

                const image = `data:image/${user.avatar.split('.').pop()};base64,${buffer}`

                user.avatar = image
            }

            await Promise.all(user.friends.map(async (id, index) => {
                var friend = await User.findById({ _id: id }).lean()

                user.friends[index] = friend.username
            }))

            return user
        })()
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

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _username = await User.findOne({ username })
                
                if (_username) throw new AlreadyExistsError(`username ${_username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)

                return await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)

                return await user.save()
            }
        })()
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

        return (async () => {
            const user = await User.findById(id).lean()
            
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = new Postit({ text, user: user._id })

            return await postit.save()
        })()
    },

    listPostits(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return (async () => {
            const user = await User.findById(id).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            let postits = await Postit.find({ user: user._id }).lean()
            const fPostits = await Postit.find({ collaborators: user._id }).lean()

            postits.push(...fPostits)

            return postits.map(postit => {
                postit.id = postit._id.toString()
                
                delete postit._id

                postit.user = postit.user.toString()

                return postit
            })
        })()
    },

    /**
     * Removes a postit
     * 
     * @param {string} id The user id
     * @param {string}  The postit id
     * 
     * @throws {TypeError} On non-string user id, or non-string postit id
     * @throws {Error} On empty or blank user id or postit text
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id, or postit id
     */
    removePostit(uid, pid) {
        if (typeof pid !== 'string') throw TypeError(`${pid} is not a string`)

        if (!pid.trim().length) throw new ValueError('postit id is empty or blank')

        return (async () => {
            return await Postit.deleteOne({ _id: pid, user: uid })
        })()
    },

    modifyPostit(uid, pid, text, status) {
        if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)

        if (!uid.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof pid !== 'string') throw TypeError(`${pid} is not a string`)

        if (!pid.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim().length) throw new ValueError('text is empty or blank')

        if (typeof status !== 'string') throw TypeError(`${status} is not a string`)

        if (!status.trim().length) throw new ValueError('postit id is empty or blank')

        return (async () => {
            return await Postit.updateOne({ _id: pid, $or: [{ user: uid },  { collaborators: uid }] }, { text, status, modified: Date.now() }, (err, raw) => {
                if (err) throw Error(error)
    debugger
                return raw
            })
        })()
    },

    addFriend(uid, fname) {
        if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)

        if (!uid.trim().length) throw new ValueError('user id is empty or blank')

        if (typeof fname !== 'string') throw TypeError(`${fname} is not a string`)

        if (!fname.trim().length) throw new ValueError('postit id is empty or blank')
        
        return User.findOne({ username: fname }).lean().then(user => {
            if (user) {
                return User.updateOne({ _id: uid }, { $push: { friends: user._id } })
                    .then(result => result)
            }
        })
    },

    removeFriend(uid, fname) {
        if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)

        if (!uid.trim().length) throw new ValueError('user id is empty or blank')

        if (typeof fname !== 'string') throw TypeError(`${fname} is not a string`)

        if (!fname.trim().length) throw new ValueError('postit id is empty or blank')
        
        return User.findOne({ username: fname }).lean().then(user => {
            if (user) {
                return User.updateOne({ _id: uid }, { $pull: { friends: user._id } })
                    .then(result => result)
            }
        })
    },

    addCollaborator(uid, pid, cname) {
        if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)

        if (!uid.trim().length) throw new ValueError('user id is empty or blank')

        if (typeof pid !== 'string') throw TypeError(`${pid} is not a string`)

        if (!pid.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof cname !== 'string') throw TypeError(`${cname} is not a string`)

        if (!cname.trim().length) throw new ValueError('collaborator id is empty or blank')

        // return (async () =>  {
        //     return await Postit.updateOne({ _id: pid, user: uid }, { $push: { collaborators: cid } }, (err, raw) => {
        //         if (err) throw Error(err)

        //         return raw
        //     })
        // })

        return User.findOne({ username: cname }).lean().then(user => {
            if (user) {
                return Postit.updateOne({ _id: pid, user: uid }, { $push: { collaborators: user._id } })
                    .then(result => result)
            }
        })
    },

    removeCollaborator(uid, pid, cname) {
        if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)

        if (!uid.trim().length) throw new ValueError('user id is empty or blank')

        if (typeof pid !== 'string') throw TypeError(`${pid} is not a string`)

        if (!pid.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof cname !== 'string') throw TypeError(`${cname} is not a string`)

        if (!cname.trim().length) throw new ValueError('collaborator id is empty or blank')

        return User.findOne({ username: cname }).lean().then(user => {
            if (user) {
                return Postit.updateOne({ _id: pid, user: uid }, { $pull: { collaborators: user._id } })
                    .then(result => result)
            }
        })
    },

    addUserImage(uid, path) {
        debugger

        return (async () => {
            return await User.updateOne({ _id: uid }, { avatar: path })
        })()
    }
}

module.exports = logic