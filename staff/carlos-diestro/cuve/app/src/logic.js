const validate = require('./utils/validate')

const logic = {
  url: 'http://localhost:8080/api/',
  _user: JSON.parse(sessionStorage.getItem('user')) || null,

  async signUp(fullname, username, email, password, repassword) {
    validate([
      { key: 'fullname', value: fullname, type: String },
      { key: 'username', value: username, type: String },
      { key: 'email', value: email, type: String },
      { key: 'password', value: password, type: String },
      { key: 'repassword', value: repassword, type: String }
    ])

    if (repassword !== password) throw Error('passwords do not match')

    const endpoint = 'register'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ fullname, username, email, password })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res
  },

  async signIn(username, password) {
    validate([
      { key: 'username', value: username, type: String },
      { key: 'password', value: password, type: String }
    ])

    const endpoint = 'auth'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ username, password })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)

    const { id, token } = res.data
    
    this._user = {
      id,
      token
    }

    sessionStorage.setItem('user', JSON.stringify(this._user))
  },

  signOut() {
    this._user = null
    
    sessionStorage.removeItem('user')
  },

  async getUserData() {
    const endpoint = 'users/id/' + this._user.id
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res
  },

  async getUserThreads() {
    const endpoint = 'users/' + this._user.id + '/threads'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async getFollowingUsersThreads() {
    const endpoint = 'users/' + this._user.id + '/following/threads'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async writeThread(text) {
    validate([
      { key: 'text', value: text, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      },
      body: JSON.stringify({ text })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.data
  },

  async shareThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/share'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    debugger

    if (res.error) throw Error(res.error)

    return res.message
  },

  async unshareThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/unshare'
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    debugger

    if (res.error) throw Error(res.error)

    return res.message
  },

  async likeThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/like'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    debugger

    return res.data
  },

  async unlikeThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/unlike'
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    debugger

    if (res.error) throw Error(res.error)

    return res.data
  }
}

export default logic