import data from './data'

const { storage, PostIt, User } = data

const logic = {
  host: '192.168.0.35:5000',

  createPostIt(userId, text) {
    const postit = new PostIt(userId, text)

    const postits = this.listPostIts()

    postits.push(postit)

    this.persistPostIts(postits)
  },

  deletePostIt(id) {
    let postits = this.listPostIts()

    postits = postits.filter((item) => item.id !== id)

    this.persistPostIts(postits)
  },

  persistPostIts(postits) {
    storage.setItem('postits', JSON.stringify(postits))
  },

  listPostIts(userId) {
    let postits = JSON.parse(storage.getItem('postits'))

    if (userId) {
      postits = postits.filter((item) => item.userId === userId)
    }
    
    return postits
  },

  editPostIt(id, text) {
    let postits = this.listPostIts()
    let newPostits = []
    // const postit = postits.find(item => item.id === id)
    postits.forEach(item => {
      if(item.id === id) item.text = text

      newPostits.push(item)
    })

    this.persistPostIts(newPostits)
  },

  setUsers(users) {
    storage.setItem('users', JSON.stringify(users))
  },

  getUsers() {
    return JSON.parse(storage.getItem('users'))
  },

  signIn(name, email, password) {
    const user = new User(name, email, password)

    const users = this.getUsers()

    users.push(user)

    this.setUsers(users)
  },

  logIn(name, password) {
    const users = this.getUsers()
    
    let user

    // debugger

    users.forEach(userDb => {
      if (userDb.name === name && userDb.password === password) {
        user = userDb
      }
    })
  
    return user
  },

  setSession(id) {
    storage.setItem('session', JSON.stringify(id))
  },

  getSession() {
    return JSON.parse(storage.getItem('session'))
  },

  createUser(username, email, name, surname, password) {
    if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
    if (typeof email !== 'string') throw TypeError(`${email} is not a string`)
    if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
    if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
    if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

    if (!username.trim()) throw Error('username is empty or blank')
    if (!email.trim()) throw Error('email is empty or blank')
    if (!name.trim()) throw Error('name is empty or blank')
    if (!surname.trim()) throw Error('surname is empty or blank')
    if (!password.trim()) throw Error('password is empty or blank')

    const endpoint = 'http://' + this.host + '/api/users'
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, name, surname, password })
    }

    return fetch(endpoint, params)
      .then(response => response.json())
      .then(response => {
        if (response.message) throw Error(response.message)
    })
  },

  authUser(username, password) {
    if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
    if (typeof password !== 'string') throw TypeError(`${password} is not a string`)
    
    if (!username.trim()) throw Error('username is empty or blank')
    if (!password.trim()) throw Error('password is empty or blank')

    const endpoint = 'http://' + this.host + '/api/auth'
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }

    return fetch(endpoint, params)
      .then(response => response.json())
      .then(response => {
        if (response.message) throw Error(response.message)

        return response.data
      })
  },

  getUserPostits(uid) {
    if (typeof uid !== 'string') throw TypeError(`${uid} is not a string`)
    
    if (!uid.trim()) throw Error('id is empty or blank')

    const endpoint = 'http://' + this.host + '/api/users/' + uid + '/postits'
    const params = {
      method: 'GET'
    }

    return fetch(endpoint, params)
      .then(response => response.json())
      .then(response => {
        if (response.message) throw Error(response.message)

        return response.data
      })
  }
}

export default logic