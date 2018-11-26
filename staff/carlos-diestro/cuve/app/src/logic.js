const logic = {
  _userId: sessionStorage.getItem('userId') || null,
  _token: sessionStorage.getItem('token') || null,
  url: 'http://localhost:8080/api/',

  signUp(fullname, username, email, password, repassword) {
    if (repassword !== password) throw Error('passwords do not match')

    return (async() => {
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
      debugger
      return res
    })()
  },

  async signIn(username, password) {
    const endpoint = 'auth'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ username, password })
    }

    return await fetch(this.url + endpoint, options)

  }
}

export default logic