const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
// const jwtVerifier = require('./jwt-verifier')
// const fs = require('fs')

const jsonBodyParser = bodyParser.json()

const router = express.Router()

router.post('/user', jsonBodyParser, (req, res) => {
  const { fullname, username, email, password } = req.body
})
