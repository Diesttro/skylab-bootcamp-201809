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
    debugger
    return res.data
  },
}

export default logic