require('dotenv').config()
const express = require('express')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')
const logic = require('./logic')
const package = require('./package.json')

const { argv: [, , port = process.env.PORT || 8080] } = process

const app = express()

app.use(express.static('./public'))
app.set('view engine', 'pug')

const formBodyParser = bodyParser.urlencoded({ extended: false })

const mySession = session({
  secret: 'my super secret',
  cookie: { maxAge: 60 * 60 * 24 },
  resave: true,
  saveUninitialized: true,
  store: new FileStore({
    path: './.sessions'
  })
})

app.use(mySession)

app.get('/', (req, res) => {
  req.session.error = null

  res.render('landing')
})

app.get('/signup', (req, res) => {
  res.render('signup', { error: req.session.error })
})

app.post('/signup', formBodyParser, (req, res) => {
  const { name, surname, username, password } = req.body

  try {
    logic.registerUser(name, surname, username, password)
      .then(() => {
        req.session.error = null

        res.render('signup-confirm', { name })
      })
      .catch(({ message }) => {
        req.session.error = message

        res.redirect('/signup')
      })
  } catch ({ message }) {
    error = message

    res.redirect('/signup')
  }
})

app.get('/login', (req, res) => {
  res.render('login', { error: req.session.error })
})

app.post('/login', formBodyParser, (req, res) => {
  const { username, password } = req.body

  try {
    logic.authenticateUser(username, password)
      .then(id => {
        req.session.userId = id

        req.session.error = null

        res.redirect('/home')
      })
      .catch(({ message }) => {
        req.session.error = message

        res.redirect('/login')
      })
  } catch ({ message }) {
    error = message

    res.redirect('/login')
  }
})

app.get('/home', (req, res) => {
  const id = req.session.userId
debugger
  if (id) {
    try {
      logic.retrieveUser(id)
        .then(({ name, postits }) => res.render('home', { name, postits }))
        .catch(({ message }) => {
          req.session.error = message

          res.redirect('/')
        })
    } catch ({ message }) {
      req.session.error = message

      res.redirect('/')
    }
  } else res.redirect('/')
})

app.post('/home', formBodyParser, (req, res) => {
  const id = req.session.userId

  switch(req.body.action) {
    case 'update':
      var postit = {
        id: Number(req.body.postit),
        text: req.body.text
      }

      try {
        logic.updateUserPostit(id, postit)
          .then(user => {
            req.session.error = null
    
            res.redirect('/home')
          })
          .catch(({ message }) => {
            req.session.error = message
    
            res.redirect('/home')
          })
      } catch ({ message }) {
        error = message
    
        res.redirect('/home')
      }

      break
    case 'delete':
      try {
        logic.deleteUserPostit(id, Number(req.body.postit))
          .then(user => {
            req.session.error = null
    
            res.redirect('/home')
          })
          .catch(({ message }) => {
            req.session.error = message
    
            res.redirect('/home')
          })
      } catch ({ message }) {
        error = message
    
        res.redirect('/home')
      }

      break
    default:
      var postit = {
        id: Date.now(),
        text: req.body.text
      }
    
      try {
        logic.addUserPostit(id, postit)
          .then(user => {
            req.session.error = null
    
            res.redirect('/home')
          })
          .catch(({ message }) => {
            req.session.error = message
    
            res.redirect('/home')
          })
      } catch ({ message }) {
        error = message
    
        res.redirect('/home')
      }
  }
})

app.get('/logout', (req, res) => {
  req.session.userId = null

  res.redirect('/')
})

app.listen(port, () => console.log(`Server ${package.version} up and running on port ${port}`))