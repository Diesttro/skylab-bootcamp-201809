const jwt = require('jsonwebtoken')

const { env: { JWT_SECRET } } = process

function jwtHelper(req, res, next) {
  try {
    const { headers: { authorization } } = req

    const token = authorization ? authorization.split(' ')[1] : null

    const { sub } = jwt.verify(token, JWT_SECRET)

    req.sub = sub

    next()
  } catch ({ message }) {
    res.json({
      error: message
    })
  }
}

  module.exports = jwtHelper