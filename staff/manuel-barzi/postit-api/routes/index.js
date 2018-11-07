const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')

const jsonBodyParser = bodyParser.json()

const router = express.Router()

const { env: { JWT_SECRET } } = process

router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { name, surname, username, password } = req.body

        return logic.registerUser(name, surname, username, password)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${username} successfully registered`
                })
            })
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    status: 'OK',
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    status: 'OK',
                    data: user
                })
            )
    }, res)
})

router.post('/users/:id/postits', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { text } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPostit(id, text)
            .then(() => res.json({
                status: 'OK',
                message: 'postit added'
            }))

    }, res)
})

router.get('/users/:id/postits', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listPostits(id)
            .then(postits => res.json({
                status: 'OK',
                data: postits
            }))
    }, res)
})

router.put('/users/:id/postits/:postitId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId }, body: { text } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyPostit(id, postitId, text)
            .then(() => res.json({
                status: 'OK',
                message: 'postit modified'
            }))
    }, res)
})

router.delete('/users/:id/postits/:postitId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removePostit(id, postitId)
            .then(() => res.json({
                status: 'OK',
                message: 'postit removed'
            }))
    }, res)

})

module.exports = router