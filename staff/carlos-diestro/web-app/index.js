const express = require('express')

const { argv: [, , port] } = process

const app = express()

const users = []

let _user = {}

const isLoggedIn = (req, res, next) => {
    if(Object.keys(_user).length > 0) {
        res.redirect('/private')
    } else {
        next()
    }
}

const isNotLoggedIn = (req, res, next) => {
    if(Object.keys(_user).length === 0) {
        res.redirect('/')
    } else {
        next()
    }
}

// app.use('/private', (req, res, next) => {
//     if(Object.keys(_user).length === 0) {
//         res.redirect('/')
//     } else {
//         next()
//     }
// })

app.get('/', isLoggedIn, (req, res) => {
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

app.get('/login', isLoggedIn, (req, res) => {
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
        <a href="/">go back</a>
    </body>
</html>`)
})

app.get('/register', isLoggedIn, (req, res) => {
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
    })
})

app.post('/login', (req, res) => {
    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const auth = {}

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            auth[key] = value
        })

        users.forEach(user => {
            if(auth.username === user.username && auth.password === user.password) {
                _user = user
            }
        })

        if(Object.keys(_user).length) {
            res.redirect('/private')
        } else {
            res.send(`Wrong credentials`)
        }
    })
})

app.get('/private', isNotLoggedIn, (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello ${_user.username}!</h1>
        <a href="/logout">Log out</a>
    </body>
</html>`)
})

app.get('/logout', isNotLoggedIn, (req, res) => {
    _user = {}

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

app.listen(port || 3000)