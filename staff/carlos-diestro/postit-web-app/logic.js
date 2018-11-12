const { User } = require('./data')

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
    if (typeof id !== 'number') throw TypeError(`${id} is not a number`)

    return User.findById(id)
      .then(user => {
        if (!user) throw Error(`user with id ${id} not found`)

        const _user = user.toObject()

        _user.id = id

        delete _user.password

        return _user
      })
  },

  addUserPostit(userId, postit) {
    if (typeof userId !== 'number') throw TypeError(`${userId} is not a number`)
    if (typeof postit !== 'object') throw TypeError(`${postit} is not an object`)

    return User.findById(userId)
      .then(user => {
        if (!user) throw Error(`user with id ${id} not found`)

        user.postits.push(postit)

        return user.save()
      })
  },

  updateUserPostit(userId, updatedPostit) {
    if (typeof userId !== 'number') throw TypeError(`${userId} is not a number`)
    if (typeof updatedPostit !== 'object') throw TypeError(`${updatedPostit} is not an object`)

    return User.findById(userId)
      .then(user => {
        if (!user) throw Error(`user with id ${id} not found`)

        const index = user.postits.findIndex(postit => postit.id === updatedPostit.id)

        user.postits[index] = updatedPostit

        return user.save()
      })
  },

  deleteUserPostit(userId, postitId) {
    if (typeof userId !== 'number') throw TypeError(`${userId} is not a number`)
    if (typeof postitId !== 'number') throw TypeError(`${postitId} is not a number`)

    return User.findById(userId)
      .then(user => {
        if (!user) throw Error(`user with id ${id} not found`)

        const postits = user.postits.filter(postit => postit.id !== postitId)

        user.postits = postits

        return user.save()
      })
  }
}

module.exports = logic