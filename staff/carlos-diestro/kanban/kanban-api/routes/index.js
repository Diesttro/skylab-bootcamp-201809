const express = require('express')
const bodyParser = require('body-parser')
const multer  = require('multer')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')
const fs = require('fs')

const jsonBodyParser = bodyParser.json()

const imgDir = __dirname.replace('routes', 'uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgDir)
    },
    filename: function (req, file, cb) {
        cb(null, req.params.uid + '.' + file.originalname.split('.').pop())
    }
})

const upload = multer({ storage: storage }).single('avatar')

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
                    data: user
                })
            )
    }, res)
})

router.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { name, surname, username, newPassword, password } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, name ? name : null, surname ? surname : null, username ? username : null, newPassword ? newPassword : null, password)
            .then(() =>
                res.json({
                    message: 'user updated'
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
                data: postits
            }))
    }, res)
})

router.put('/users/:id/postits/:postitId', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, postitId }, body: { text, status } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.modifyPostit(id, postitId, text, status)
            .then(() => res.json({
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
                message: 'postit removed'
            }))
    }, res)

})

router.post('/users/:id/friends', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { name } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addFriend(id, name)
            .then(() => res.json({
                message: 'friend added'
            }))

    }, res)
})

router.delete('/users/:id/friends', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { name } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.removeFriend(id, name)
            .then(() => res.json({
                message: 'friend removed'
            }))

    }, res)
})

router.post('/users/:uid/postits/:pid/collab', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { uid, pid }, body: { name } } = req

        if (uid !== sub) throw Error('token sub does not match user id')

        return logic.addCollaborator(uid, pid, name)
            .then(() => res.json({
                message: 'collaborator added'
            }))

    }, res)
})

router.post('/users/:uid/image', [bearerTokenParser, jwtVerifier, upload], (req, res) => {
    const { sub, params: { uid }, file: { mimetype, path } } = req

    if (uid !== sub) throw Error('token sub does not match user id')

    // res.sendFile(path)

    const buffer = fs.readFileSync(path).toString('base64')

    const image = `data:${mimetype};base64,${buffer}`
    
    return logic.addUserImage(uid, path)
        .then(() => 
            res.json({
                data: image
            }))
})

module.exports = router