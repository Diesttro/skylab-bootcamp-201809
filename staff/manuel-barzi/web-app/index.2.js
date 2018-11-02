const express = require('express')
const logic = require('./logic')

const { argv: [, , port = 8080] } = process

const app = express()

let error = null

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

        const user = {}

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            user[key] = value
        })

        const { name, surname, username, password } = user

        try {
            logic.registerUser(name, surname, username, password)

            error = null

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
        } catch ({ message }) {
            error = message

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

        const user = {}

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            user[key] = value
        })

        const { username, password } = user

        try {
            logic.loginUser(username, password)

            error = null

            res.redirect('/home')
        } catch ({ message }) {
            error = message

            res.redirect('/login')
        }
    })
})

app.get('/home', (req, res) => {
    if (logic.loggedIn)
        res.send(`<!DOCTYPE html>
                <html>
                    <head>
                        <title>Hello World!</title>
                    </head>
                    <body>
                        <h1>Hello World!</h1>
                        <p>Welcome ${logic._user.name}!</p>
                        <a href="/logout">logout</a>
                    </body>
                </html>`)
    else res.redirect('/')
})

app.get('/logout', (req, res) => {
    logic.logout()

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
            ${logic._users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>
    </body>
</html>`)
})

app.listen(port, () => console.log(`Server up and running on port ${port}`))