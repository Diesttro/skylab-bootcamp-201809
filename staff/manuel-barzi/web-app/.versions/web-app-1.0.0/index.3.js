const express = require('express')
const logic = require('./logic')

const { argv: [, , port = 8080] } = process

const app = express()

let error = null

const sessions = {}

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

function parseBody(req, callback) {
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const body = {}

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            body[key] = value
        })

        callback(body)
    })
}

app.post('/register', (req, res) => {
    parseBody(req, body => {
        const { name, surname, username, password } = body

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
                            <p>Ok! user ${name} registered.</p>
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
    parseBody(req, body => {
        const { username, password } = body

        try {
            debugger
            const id = logic.authenticateUser(username, password)

            sessions[getSessionId(req)] = id

            error = null

            res.redirect('/home')
        } catch ({ message }) {
            error = message

            res.redirect('/login')
        }
    })
})

app.get('/home', (req, res) => {
    const id = sessions[getSessionId(req)]

    debugger

    if (id) {
        const user = logic.retrieveUser(id)

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
    } else res.redirect('/')
})

app.get('/logout', (req, res) => {
    delete sessions[getSessionId(req)]

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

function getSessionId(req) {
    const { ip, headers } = req

    const userAgent = headers['user-agent']

    return `${ip}-${userAgent}`
}

app.listen(port, () => console.log(`Server up and running on port ${port}`))