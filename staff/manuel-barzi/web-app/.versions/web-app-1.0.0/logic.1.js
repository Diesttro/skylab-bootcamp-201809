const { User } = require('./data')

const logic = {
    _users: [], // { name: 'Peter', surname: 'Sellers', username: 'u', password: 'p' }
    _user: null, // WARN! NO SENSE! should be multi-user

    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        let user = this._users.find(user => user.username === username)

        if (user) throw Error(`username ${username} already registered`)

        user = new User(name, surname, username, password)

        this._users.push(user)
    },

    loginUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        this._user = this._users.find(user => user.username === username && user.password === password)

        if (!this._user) throw Error('invalid username or password')
    },

    get loggedIn() {
        return !!this._user
    },

    logout() {
        this._user = null
    }
}

module.exports = logic