const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
// const bearerTokenParser = require('../utils/bearer-token-parser')
// const jwtVerifier = require('./jwt-verifier')
// const fs = require('fs')

const jsonBodyParser = bodyParser.json()
const router = express.Router()

const { env: { JWT_SECRET } } = process

router.post('/register', jsonBodyParser, async (req, res) => {
  const { fullname, username, email, password } = req.body

  try {
    await logic.register(fullname, username, email, password)

    res.json({
      message: 'user registered'
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.post('/auth', jsonBodyParser, async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await logic.authenticate(username, password)

    const token = jwt.sign({ sub: id }, JWT_SECRET)

    res.json({
      data: {
        id,
        token
      },
      message: 'user authenticated'
    })
  } catch (error) {
    res.status(401).json({
      error: error.message
    })
  }
})

router.get('/users/:id', jsonBodyParser, async (req, res) => {
  const { params: { id }, sub } = req

  try {
    const id = await logic.authenticate(username, password)

    const token = jwt.sign({ sub: id }, JWT_SECRET)

    res.json({
      data: {
        id,
        token
      },
      message: 'user authenticated'
    })
  } catch (error) {
    res.status(401).json({
      error: error.message
    })
  }
})

module.exports = router