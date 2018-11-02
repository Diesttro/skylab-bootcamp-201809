const express = require('express')

const { argv: [, , port = 8080] } = process

const app = express()

const users = [
    { name: 'Peter', surname: 'Sellers', username: 'u', password: 'p' }
]

let user = null, error = null

app.get('/', (req, res) => {
    error = null
    
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <a href="/login">Login</a> or <a href="/register">Register</a>
    </body>
</html>`)
})

app.get('/register', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/register" method="POST">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="surname" placeholder="Surname">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Register</button>
        </form>
        ${error ? `<p style="color: red">${error}</p>` : ''}
        <a href="/">go back</a>
    </body>
</html>`)
})

app.post('/register', (req, res) => {
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const user = { id: Date.now() }

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            user[key] = value
        })

        const { name, surname, username, password } = user

        if (name && surname && username && password) {
            error = null

            users.push(user)

            res.send(`<!DOCTYPE html>
                    <html>
                        <head>
                            <title>Hello World!</title>
                        </head>
                        <body>
                            <h1>Hello World!</h1>
                            <p>Ok! user ${user.name} registered.</p>
                            <a href="/">go back</a>
                        </body>
                    </html>`)
        } else {
            error = 'some of the fields are empty, please check them'

            res.redirect('/register')
        }
    })
})

app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Login</button>
        </form>
        ${error ? `<p style="color: red">${error}</p>` : ''}
        <a href="/">go back</a>
    </body>
</html>`)
})

app.post('/login', (req, res) => {
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const _user = {}

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            _user[key] = value
        })

        user = users.find(({ username, password }) => username === _user.username && password === _user.password)

        if (user) {
            error = null

            res.redirect('/home')
        } else {
            error = 'wrong credentials'

            res.redirect('/login')
        }
    })
})

app.get('/home', (req, res) => {
    if (user)
        res.send(`<!DOCTYPE html>
                <html>
                    <head>
                        <title>Hello World!</title>
                    </head>
                    <body>
                        <h1>Hello World!</h1>
                        <p>Welcome ${user.name}!</p>
                        <a href="/logout">logout</a>
                    </body>
                </html>`)
    else res.redirect('/')
})

app.get('/logout', (req, res) => {
    user = null

    res.redirect('/')
})

app.get('/users', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <ul>
            ${users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>
    </body>
</html>`)
})

app.listen(port, () => console.log(`Server up and running on port ${port}`))