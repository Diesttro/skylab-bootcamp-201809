const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const Busboy = require('busboy')
const jwtHelper = require('../utils/jwt-helper')

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

router.post('/users/:id/update', [jwtHelper, fileUpload(), jsonBodyParser], async (req, res) => {
  const { params: { id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    if (req.files) {
      req.body.avatar = logic.saveImage(id, req.files.avatar.data, req.files.avatar.mimetype.split('/').pop(), '/users/')
    }

    logic.saveUserChanges(id, req.body)

    res.json({
      message: 'changes saved'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/id/:id', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const user = await logic.retrieveUser(id)

    res.json({
      data: user,
      message: 'user found'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/search/:username/', jsonBodyParser, async (req, res) => {
  const { params: { username } } = req

  try {
    const users = await logic.findUsersByUsername(username)

    res.json({
      data: users
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/popular', async (req, res) => {
  try {
    const users = await logic.retrievePopularPeople()

    res.json({
      data: users
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/username/:username/:id*?', jsonBodyParser, async (req, res) => {
  const { params: { username, id } } = req

  try {
    const user = await logic.retrieveUserByUsername(id, username)

    res.json({
      data: user,
      message: 'user found'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.post('/users/:id/follow/:username', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.followUserByUsername(id, username)

    res.json({
      message: 'user followed'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.delete('/users/:id/unfollow/:username', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req
  
  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.unfollowUserByUsername(id, username)

    res.json({
      message: 'user unfollowed'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.post('/users/:id/follow/:username/accept', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.acceptFollowerByUsername(id, username)

    res.json({
      message: 'user accepted'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.delete('/users/:id/follow/:username/reject', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req
  
  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.rejectFollowerByUsername(id, username)

    res.json({
      message: 'user rejected'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/:uid/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const threads = await logic.retrieveUserThreads(uid)

    res.json({
      data: threads
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.get('/users/:uid/following/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const threads = await logic.retrieveFollowingUsersThreads(uid)

    res.json({
      data: threads
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.get('/users/threads/:tid', async (req, res) => {
  const { params: { tid } } = req

  try {
    const thread = await logic.retrieveThread(tid)

    res.json({
      data: thread
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  const { text } = req.body

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.addThread(uid, text)

    res.json({
      message: 'thread added'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')
    
    const result = await logic.removeThread(tid, uid)

    res.json({
      message: 'thread removed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/comments', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  const { text } = req.body

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.addComment(tid, uid, text)

    res.json({
      message: 'comment added'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/comments/:cid', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid, cid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.removeComment(tid, cid, uid)

    res.json({
      message: 'comment removed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/share', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.shareThread(tid, uid)

    res.json({
      message: 'thread shared'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/unshare', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.unshareThread(tid, uid)

    res.json({
      message: 'thread unshared'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/like', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.likeThread(tid, uid)

    res.json({
      message: 'thread liked'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/unlike', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.unlikeThread(tid, uid)

    res.json({
      message: 'thread unliked'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:id/chats', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { id }, sub } = req

  const { to, text } = req.body

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.saveMessage(id, to, text)

    res.json({
      message: 'message sended'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.get('/users/:id/chats', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const chats = await logic.retrieveUserChats(id)

    res.json({
      data: chats
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.get('/users/:id/chats/:cid', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { id, cid }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const chat = await logic.retrieveChat(cid)

    res.json({
      data: chat
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

module.exports = router