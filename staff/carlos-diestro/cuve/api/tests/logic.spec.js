const { mongoose, models: { User, Thread, Chat } } = require('cuve-data')
const { expect } = require('chai')
const logic = require('../logic')
const MONGO_URL = 'mongodb://localhost:27017/dev_cuve'

describe('logic', () => {
  before(() => mongoose.connect(MONGO_URL, { useCreateIndex: true, useNewUrlParser: true }))

  !false && describe('users', () => {
    let fullname, username, email, password
      
    before(() => {
      fullname = `fn-${Math.random()}`
      username = `un-${Math.random()}`
      email = `em-${Math.random()}`
      password = `pw-${Math.random()}`
    })

    describe('register', () => {
      it('should succeed on correct data', async () => {
        await logic.register(fullname, username, email, password)
        
        const user = await User.findOne({ username })

        expect(user.fullname).to.be.equal(fullname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(user.password).to.be.equal(password)
      })

      it('should fail on non string fullname', () => {
        expect(() => {
          logic.register(undefined, username, email, password)
        }).to.throw(TypeError, 'undefined is not a string')
      })

      it('should fail on non string username', () => {
        expect(() => {
          logic.register(fullname, 123, email, password)
        }).to.throw(TypeError, '123 is not a string')
      })

      it('should fail on non string email', () => {
        expect(() => {
          logic.register(fullname, username, ['test', 2], password)
        }).to.throw(TypeError, 'test,2 is not a string')
      })

      it('should fail on non string password', () => {
        expect(() => {
          logic.register(fullname, username, email)
        }).to.throw(TypeError, 'undefined is not a string')
      })
    })

    describe('authenticate', () => {
      it('should succeed on correct data', async () => {
        const uid = await logic.authenticate(username, password)

        const { _id: uidDb } = await User.findOne({ username }, { _id: true }).lean()
        
        expect(uid).to.be.equal(uidDb.toString())
      })

      it('should fail on non string username', () => {
        expect(() => {
          logic.authenticate(123, password)
        }).to.throw(TypeError, '123 is not a string')
      })

      it('should fail on non string password', () => {
        expect(() => {
          logic.authenticate(username)
        }).to.throw(TypeError, 'undefined is not a string')
      })
    })

    describe('retrieve', () => {
      let userDb

      before(async () => {
        userDb = await User.findOne({ username })
      })

      describe('self profile', () => {
        it('should succeed on retrieve self profile', async () => {
          const user = await logic.retrieveUser(userDb.id)

          expect(user.fullname).to.be.equal(fullname)
          expect(user.username).to.be.equal(username)
          expect(user.email).to.be.equal(email)
          expect(user.password).to.be.undefined
          expect(user.followers.length).to.be.equal(0)
          expect(user.following.length).to.be.equal(0)
          expect(user.mentions.length).to.be.equal(0)
          expect(user.blocked.length).to.be.equal(0)
        })

        it('should fail on non string id', () => {
          expect(() => {
            logic.retrieveUser(10)
          }).to.throw(TypeError, '10 is not a string')
        })
      })

      describe('other profile', () => {
        it('should succeed on retrieve public profile', async () => {
          const user = await logic.retrieveUserByUsername(userDb.id, userDb.username)

          expect(user.fullname).to.be.equal(fullname)
          expect(user.username).to.be.equal(username)
          expect(user.email).to.be.equal(email)
          expect(user.password).to.be.undefined
          expect(user.threads.length).to.be.equal(0)
          expect(user.followers.length).to.be.equal(0)
          expect(user.following.length).to.be.equal(0)
          expect(user.private).to.be.false
        })

        it('should succeed on retrieve private profile', async () => {
          await User.updateOne({ username }, { description: 'hola mundo', private: true })

          const user = await logic.retrieveUserByUsername(userDb.id, userDb.username)

          expect(user.fullname).to.be.equal(fullname)
          expect(user.username).to.be.equal(username)
          expect(user.password).to.be.undefined
          expect(user.threads).to.be.undefined
          expect(user.followers).to.be.undefined
          expect(user.following).to.be.undefined
          expect(user.private).to.be.true
        })

        it('should fail on non string id', () => {
          expect(() => {
            logic.retrieveUserByUsername(undefined, userDb.username)
          }).to.throw(TypeError, 'undefined is not a string')
        })

        it('should fail on non string username', () => {
          expect(() => {
            logic.retrieveUserByUsername(userDb.id, 999)
          }).to.throw(TypeError, '999 is not a string')
        })
      })
    })
  })

  !false && describe('threads', () => {
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
        expect(thread[0].author._id.toString()).to.be.equal(user.id)
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
  
        await logic.removeComment(thread.id, thread.comments[0]._id.toString(), thread.comments[0].author._id.toString())
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.comments.length).to.be.equal(1)
      })
    })

    describe('share threads', () => {
      it('should succeed on share a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        await logic.shareThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.shares.length).to.be.equal(1)
        expect(thread.likes.length).to.be.equal(0)
      })
    })

    describe('unshare threads', () => {
      it('should succeed on unshare a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })

        await logic.unshareThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.shares.length).to.be.equal(0)
        expect(thread.likes.length).to.be.equal(0)
      })
    })

    describe('like threads', () => {
      it('should succeed on like a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        await logic.likeThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.likes.length).to.be.equal(1)
        expect(thread.shares.length).to.be.equal(0)
      })
    })

    describe('unlike threads', () => {
      it('should succeed on unlike a thread', async () => {
        let thread = await Thread.findOne({ author: user.id })
  
        await logic.unlikeThread(thread.id, user2.id)
  
        thread = await Thread.findOne({ author: user.id })
        
        expect(thread.likes.length).to.be.equal(0)
        expect(thread.shares.length).to.be.equal(0)
      })      
    })

    describe('retrieve thread', () => {
      it('should succeed on correct data', async () => {
        const thread = await Thread.findOne({ author: user.id })

        const currentThread = await logic.retrieveThread(thread.id)

        expect(currentThread.id).to.be.equal(thread.id)
        expect(currentThread.author.id).to.be.equal(thread.author._id.toString())
        expect(currentThread.text).to.be.equal(thread.text)
        expect(currentThread.comments.length).to.be.equal(thread.comments.length)
      })
    })

    describe('retrieve user threads', () => {
      it('should succeed on correct data', async () => {
        const userThreads = await logic.retrieveUserThreads(user.id)
        
        const threads = await Thread.find({ author: user.id })

        expect(userThreads.length).to.be.equal(threads.length)
      })
    })

    describe('remove user thread', () => {
      it('should succeed on correct data', async () => {
        const userThreads = await Thread.find({ author: user.id })

        await logic.removeThread(userThreads[0]._id.toString(), user.id)

        const _userThreads = await Thread.find({ author: user.id })

        expect(_userThreads.length).to.be.equal(0)
      })
    })
  })

  !false && describe('follows', () => {
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

      it('should succeed on unfollow private profile', async () => {
        await logic.unfollowUserByUsername(user.id, user3.username)

        const _user = await User.findOne({ _id: user.id })

        expect(_user.pending.length).to.be.equal(0)
        expect(_user.followers.length).to.be.equal(0)
        expect(_user.following.length).to.be.equal(0)
      })
    })

    describe('accept follower', () => {
      it('should succeed on accept follow', async () => {
        await logic.followUserByUsername(user.id, user3.username)

        await logic.acceptFollowerByUsername(user3.id, user.username)

        const _user = await User.findOne({ _id: user3.id })

        expect(_user.followers.length).to.be.equal(1)
        expect(_user.following.length).to.be.equal(0)
        expect(_user.pending.length).to.be.equal(0)
        expect(_user.followers[0]._id.toString()).to.be.equal(user.id)
      })
    })

    describe('reject follower', () => {
      it('should succeed on reject follow', async () => {
        await logic.followUserByUsername(user2.id, user3.username)

        await logic.rejectFollowerByUsername(user3.id, user2.username)

        const _user = await User.findOne({ _id: user3.id })

        expect(_user.followers.length).to.be.equal(1)
        expect(_user.followers[0]._id.toString()).to.be.equal(user.id)
        expect(_user.following.length).to.be.equal(0)
        expect(_user.pending.length).to.be.equal(0)
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
      expect(results[0].avatar).to.be.equal(user.avatar)
      expect(results[0].username).to.be.equal(user.username)
      expect(results[0].fullname).to.be.undefined
      expect(results[0].email).to.be.undefined
      expect(results[0].followers).to.be.undefined
      expect(results[0].following).to.be.undefined
      expect(results[0].pending).to.be.undefined
    })

    it('should succeed on find user by fullname', async () => {
      const results = await logic.findUsersByUsername(user.fullname)

      expect(results.length).to.be.equal(1)
      expect(results[0].id).to.be.equal(user.id)
      expect(results[0].avatar).to.be.equal(user.avatar)
      expect(results[0].username).to.be.equal(user.username)
      expect(results[0].fullname).to.be.undefined
      expect(results[0].email).to.be.undefined
      expect(results[0].followers).to.be.undefined
      expect(results[0].following).to.be.undefined
      expect(results[0].pending).to.be.undefined
    })
  })

  describe('retrieve following users threads', () => {
    let user1, user2

    before(() => {
      user1 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user1.save()

      user2 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user2.save()
    })

    it('should succeed on retrieve threads', async () => {
      const text1 = 'lorem ipsum'

      await logic.addThread(user1.id, text1)

      const text2 = 'lorem ipsum'

      await logic.addThread(user1.id, text2)

      await logic.followUserByUsername(user2.id, user1.username)
      
      const threads = await logic.retrieveFollowingUsersThreads(user2.id)

      expect(threads.length).to.be.equal(2)
    })
  })

  describe('save changes', () => {
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

    it('should succeed on save user changes', async () => {
      const changes = {
        fullname: 'test1',
        username: 'test1',
        email: 'test1@test1.com',
        description: 'lorem ipsum',
        private: true
      }

      await logic.saveUserChanges(user.id, changes)

      const _user = await User.findOne({ _id: user.id })
      
      expect(_user.id).to.be.equal(user.id)
      expect(_user.fullname).to.be.equal(changes.fullname)
      expect(_user.username).to.be.equal(changes.username)
      expect(_user.email).to.be.equal(changes.email)
      expect(_user.description).to.be.equal(changes.description)
      expect(_user.private).to.be.equal(changes.private)
    })
  })

  describe('chat', () => {
    let user1, user2

    before(() => {
      user1 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user1.save()

      user2 = new User({
        fullname: `fn-${Math.random()}`,
        username: `un-${Math.random()}`,
        email: `em-${Math.random()}`,
        password: `pw-${Math.random()}`
      })

      user2.save()
    })

    describe('new chat', () => {
      it('should succeed on create new chat', async () => {
        const chatId = await logic.saveMessage(user1.id, user2.id)

        const chats = await Chat.find({}) //Don't found chat without this

        const chat = await Chat.findOne({ _id: chatId }).lean()

        expect(chat.members.length).to.be.equal(2)
        expect(chat.messages.length).to.be.equal(0)
        expect([chat.members[0]._id.toString(), chat.members[1]._id.toString()]).to.include.members([user1.id, user2.id])
      })
    })

    describe('add message', () => {
      it('should succeed on send new message', async () => {
        const text = 'lorem ipsum'
        const chatId = await logic.saveMessage(user1.id, user2.id, text)

        const chat = await Chat.findOne({ _id: chatId }).lean()

        expect(chat.members.length).to.be.equal(2)
        expect(chat.messages.length).to.be.equal(1)
        expect(chat.messages[0].sender._id.toString()).to.be.equal(user1.id)
        expect(chat.messages[0].text).to.be.equal(text)
      })
    })

    describe('retrieve user chats', () => {
      it('should succeed on retrieve user chats', async () => {
        const chats = await Chat.find({ members: user1.id })

        const userChats = await logic.retrieveUserChats(user1.id)

        expect(chats.length).to.be.equal(userChats.length)
        expect(chats[0].id).to.be.equal(userChats[0].id)
        expect([chats[0].members[0]._id.toString(), chats[0].members[1]._id.toString()]).to.include.members([user1.id, user2.id])
      })
    })

    describe('retrieve chat', () => {
      it('should succeed on retrieve chat', async () => {
        const chats = await Chat.find({ members: user1.id })

        const chat = await logic.retrieveChat(chats[0].id)

        expect(chats[0].id).to.be.equal(chat.id)
        expect([chats[0].members[0]._id.toString(), chats[0].members[1]._id.toString()]).to.include.members([chat.members[0].id, chat.members[1].id])
        expect(chats[0].messages.length).to.be.equal(chat.messages.length)
      })
    })
  })

  after(async () => {
    await User.deleteMany()
    await Thread.deleteMany()
    await Chat.deleteMany()
    
    return mongoose.disconnect()
  })
})