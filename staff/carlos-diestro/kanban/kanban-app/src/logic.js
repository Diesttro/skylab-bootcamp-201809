const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',

    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    login(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    logout() {
        this._postits = []
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    retrieveUser() {
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
                
                return res.data
            })
    },

    addPostit(text) {
        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim()) throw Error('text is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ text })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    listPostits() {
        return fetch(`${this.url}/users/${this._userId}/postits`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
    },

    removePostit(id) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    modifyPostit(id, text, status) {
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)

        if (!id.trim().length) throw Error('id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)

        if (!text.trim()) throw Error('text is empty or blank')

        if (typeof status !== 'string') throw TypeError(`${status} is not a string`)

        if (!status.trim()) throw Error('status is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ text, status })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    addFriend(name) {
        if (typeof name !== 'string') throw new TypeError(`${name} is not a string`)

        if (!name.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res
            })
    },

    removeFriend(name) {
        if (typeof name !== 'string') throw new TypeError(`${name} is not a string`)

        if (!name.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/friends`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res
            })
    },

    addCollaborator(pid, name) {
        if (typeof name !== 'string') throw new TypeError(`${name} is not a string`)

        if (!name.trim().length) throw Error('id is empty or blank')

        return fetch(`${this.url}/users/${this._userId}/postits/${pid}/collab`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res
            })
    },

    addImage(file) {
        // if (typeof name !== 'string') throw new TypeError(`${name} is not a string`)

        // if (!name.trim().length) throw Error('id is empty or blank')

        let avatar = new FormData()

        avatar.append('avatar', file)

        return fetch(`${this.url}/users/${this._userId}/image`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data;boundary="boundary"',
                'Authorization': `Bearer ${this._token}`
            },
            body: avatar
        })
            .then(res => res.blob())
    },
}

// export default logic
module.exports = logic