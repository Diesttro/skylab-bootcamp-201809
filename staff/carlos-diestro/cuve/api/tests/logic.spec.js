const mongoose = require('mongoose')
const { expect } = require('chai')
const { User, Thread, Chat } = require('../data')
const logic = require('../logic')
const MONGO_URL = 'mongodb://localhost:27017/dev_cuve'

describe('logic', () => {
  before(() => mongoose.connect(MONGO_URL, { useCreateIndex: true, useNewUrlParser: true }))

  describe('user', () => {
    let fullname, username, email, password
      
    before(() => {
      fullname = `fn-${Math.random()}`
      username = `un-${Math.random()}`
      email = `em-${Math.random()}`
      password = `pw-${Math.random()}`
    })

    describe('register', () => {
      it('should succeed on correct data', async () => {
        const result = await logic.register(fullname, username, email, password)
        
        const user = await User.findOne({ username })

        expect(user.fullname).to.be.equal(fullname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(user.password).to.be.equal(password)
      })
    })

    describe('authenticate', () => {
      it('should succeed on correct data', async () => {
        const uid = await logic.authenticate(username, password)

        const { _id: uidDb } = await User.findOne({ username }, { _id: true }).lean()
        
        expect(uid).to.be.equal(uidDb.toString())
      })
    })

    describe('retrieve', () => {
      let userDb

      before(async () => {
        userDb = await User.findOne({ username })
      })

      it('should succeed on retrieve self profile', async () => {
        const user = await logic.retrieveUser(userDb.id)

        expect(user.fullname).to.be.equal(fullname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(user.password).to.be.undefined
        // expect(user.likes.length).to.be.equal(0)
        expect(user.followers.length).to.be.equal(0)
        expect(user.following.length).to.be.equal(0)
        expect(user.mentions.length).to.be.equal(0)
        expect(user.blocked.length).to.be.equal(0)
      })

      it('should succeed on retrieve public profile', async () => {
        const user = await logic.retrieveUserByUsername(userDb.id, userDb.username)

        expect(user.fullname).to.be.equal(fullname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(user.password).to.be.undefined
        expect(user.followers.length).to.be.equal(0)
        expect(user.following.length).to.be.equal(0)
      })

      it('should succeed on retrieve private profile', async () => {
        await User.updateOne({ username }, { description: 'hola mundo', private: true })

        const user = await logic.retrieveUserByUsername(userDb.id, userDb.username)

        expect(user.fullname).to.be.equal(fullname)
        expect(user.username).to.be.equal(username)
        expect(user.password).to.be.undefined
        expect(user.followers).to.be.undefined
        expect(user.following).to.be.undefined
      })
    })
  })

  describe('thread', () => {
    let user
    
    before(() => {
      user = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user.save()
    })

    describe('add thread', () => {
      it('should succeed on correct data', async () => {
        const text = 'lorem ipsum'

        await logic.addThread(user.id, text)
        
        const thread = await Thread.find({ author: user.id }).lean()
        
        expect(thread.length).to.be.equal(1)
        expect(thread[0].text).to.be.equal(text)

      })
    })

    describe('add comment', () => {
      it('should succeed on correct data', async () => {
        let thread = await Thread.findOne({ author: user.id })

        user2 = new User({
          fullname: `fn-${Math.random()}`,
          username: `un-${Math.random()}`,
          email: `em-${Math.random()}`,
          password: `pw-${Math.random()}`
        })
  
        user2.save()

        const text = 'dolor sit amet'
        const text2 = 'consectetur adipiscing'

        await logic.addComment(thread.id, user2.id, text2)
        await logic.addComment(thread.id, user.id, text)

        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.comments.length).to.be.equal(2)
        expect(thread.comments[0].author.toString()).to.be.equal(user2.id)
        expect(thread.comments[0].text).to.be.equal(text2)
      })
    })

    describe('remove comment', () => {
      it('should succeed on correct data', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        const result = await logic.removeComment(thread.id, thread.comments[0]._id.toString(), thread.comments[0].author._id.toString())
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.comments.length).to.be.equal(1)
      })
    })

    describe('share', () => {
      it('should succeed on share a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        const result = await logic.shareThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.shares.length).to.be.equal(1)
      })

      it('should succeed on unshare a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })

        const result = await logic.unshareThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.shares.length).to.be.equal(0)
      })
    })

    describe('like', () => {
      it('should succeed on like a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        const result = await logic.likeThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.likes.length).to.be.equal(1)
      })

      it('should succeed on unlike a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        const result = await logic.unlikeThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.likes.length).to.be.equal(0)
      })
    })

    describe('retrieve thread', () => {
      it('should succeed on correct data', async () => {
        const thread = await Thread.findOne({ author: user.id })

        const currentThread = await logic.retrieveThread(thread.id)

        expect(currentThread.id).to.be.equal(thread.id)
        expect(currentThread.author.id).to.be.equal(thread.author._id.toString())
        expect(currentThread.text).to.be.equal(thread.text)
      })
    })

    describe('retrieve user threads', () => {
      it('should succeed on correct data', async () => {
        const userThreads = await logic.retrieveUserThreads(user.id)
        
        const threads = await Thread.find({ author: user.id })

        expect(userThreads.length).to.be.equal(threads.length)
      })
    })
  })

  describe('follow', () => {
    let user, user2, user3

    before(() => {
      user = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user.save()

      user2 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user2.save()

      user3 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`,
        private: true
      })

      user3.save()
    })

    describe('add follower', () => {
      it('should succeed on follow public profile', async () => {
        await logic.followUserByUsername(user2.id, user.username)

        const _user = await User.findOne({ _id: user.id })

        expect(_user.followers.length).to.be.equal(1)
        expect(_user.following.length).to.be.equal(0)
        expect(_user.pending.length).to.be.equal(0)
        expect(_user.followers[0]._id.toString()).to.be.equal(user2.id)
      })

      it('should succeed on follow private profile', async () => {
        await logic.followUserByUsername(user.id, user3.username)

        const _user = await User.findOne({ _id: user3.id })

        expect(_user.followers.length).to.be.equal(0)
        expect(_user.following.length).to.be.equal(0)
        expect(_user.pending.length).to.be.equal(1)
        expect(_user.pending[0]._id.toString()).to.be.equal(user.id)
      })
    })

    describe('remove follower', () => {
      it('should succeed on unfollow public profile', async () => {
        await logic.unfollowUserByUsername(user2.id, user.username)

        const _user = await User.findOne({ _id: user.id })

        expect(_user.followers.length).to.be.equal(0)
        expect(_user.following.length).to.be.equal(0)
        expect(_user.pending.length).to.be.equal(0)
      })

      it('should succeed on unfollow public profile', async () => {
        await logic.unfollowUserByUsername(user.id, user3.username)

        const _user = await User.findOne({ _id: user.id })

        expect(_user.pending.length).to.be.equal(0)
        expect(_user.followers.length).to.be.equal(0)
        expect(_user.following.length).to.be.equal(0)
      })
    })
  })

  describe('find user', () => {
    let user

    before(() => {
      user = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user.save()
    })

    it('should succeed on find user by username', async () => {
      const results = await logic.findUsersByUsername(user.username)

      expect(results.length).to.be.equal(1)
      expect(results[0].id).to.be.equal(user.id)
      expect(results[0].fullname).to.be.undefined
      expect(results[0].username).to.be.equal(user.username)
    })
  })

  after(async () => {
    await User.deleteMany()
    await Thread.deleteMany()
    
    return mongoose.disconnect()
  })
})