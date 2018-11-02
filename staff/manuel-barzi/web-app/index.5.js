const express = require('express')
const bodyParser = require('body-parser')
const sessionIdMiddleware = require('./helpers/session-id-middleware')
const buildView = require('./helpers/build-view')
const logic = require('./logic')

const { argv: [, , port = 8080] } = process

const app = express()

let error = null

const sessions = {}

const formBodyParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    error = null

    res.send(buildView(`<a href="/login">Login</a> or <a href="/register">Register</a>`))
})

app.get('/register', (req, res) => {
    res.send(buildView(`<form action="/register" method="POST">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="surname" placeholder="Surname">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Register</button>
        </form>
        ${error ? `<p style="color: red">${error}</p>` : ''}
        <a href="/">go back</a>`))
})

app.post('/register', formBodyParser, (req, res) => {
    const { name, surname, username, password } = req.body

    try {
        logic.registerUser(name, surname, username, password)

        error = null

        res.send(buildView(`<p>Ok! user ${name} registered.</p>
                <a href="/">go back</a>`))
    } catch ({ message }) {
        error = message

        res.redirect('/register')
    }
})

app.get('/login', (req, res) => {
    res.send(buildView(`<form action="/login" method="POST">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Login</button>
        </form>
        ${error ? `<p style="color: red">${error}</p>` : ''}
        <a href="/">go back</a>`))
})

app.post('/login', [formBodyParser, sessionIdMiddleware], (req, res) => {
    const { username, password } = req.body

    try {
        const id = logic.authenticateUser(username, password)

        sessions[req.sid] = id

        error = null

        res.redirect('/home')
    } catch ({ message }) {
        error = message

        res.redirect('/login')
    }
})

app.get('/home', sessionIdMiddleware, (req, res) => {
    const id = sessions[req.sid]

    if (id) {
        const user = logic.retrieveUser(id)

        res.send(buildView(`<p>Welcome ${user.name}!</p>
                        <a href="/logout">logout</a>`))
    } else res.redirect('/')
})

app.get('/logout', sessionIdMiddleware, (req, res) => {
    delete sessions[req.sid]

    res.redirect('/')
})

app.get('/users', (req, res) => {
    res.send(buildView(`<ul>
            ${logic._users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>`))
})

app.listen(port, () => console.log(`Server up and running on port ${port}`))