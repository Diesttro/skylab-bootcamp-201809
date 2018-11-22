const { User, Thread, Chat } = require('../data')

const logic = {
  register(fullname, username, email, password) {
    return (async () => {
      const user = await User.findOne({ username }).lean()

      if (user) throw Error('username already exist')

      const newUser = new User({ fullname, username, email, password })

      return newUser.save()
    })()
  },

  authenticate(username, password) {
    return (async () => {
      const user = await User.findOne({ username }).lean()

      if (!user || user.password !== password) throw Error('username or password are not valid')

      return user._id.toString()
    })()
  },

  retrieveUser(id) {
    return (async () => {
      const projection = {
        password: false
      }

      const user = await User.findById({ _id: id }, projection).lean()

      if (!user) throw Error(`username ${username} does not exist`)

      return user
    })()
  },

  retrieveUserByUsername(id, username) {
    return (async () => {
      const followerProjecion = {
        fullname: true,
        username: true,
        email: true,
        avatar: true,
        description: true,
        country: true,
        following: true,
        followers: true,
        private: true
      }

      let user = await User.findOne({ username }, followerProjecion).lean()

      if (!user) throw Error(`username ${username} does not exist`)

      if (user.private) {
        user = await User.findOne({ username, followers: id }, followerProjecion).lean()
        
        if (!user) {
          const notFollowerProjection = {
            fullname: true,
            username: true,
            email: true,
            avatar: true,
            description: true,
            country: true,
            private: true
          }

          user = await User.findOne({ username }, notFollowerProjection).lean()
        }
      }

      return user
    })()
  },

  findUsersByUsername(username) {
    return (async () => {
      const users = await User.find({ username: /'.*' + username + '.*'/ }).lean()
      
      debugger
    })()
  },

  followUserByUsername(id, username) {
    return (async () => {
      const user = await User.findOne({ username }).lean()

      if (!user) throw Error(`username ${username} does not exist`)

      let result

      if (user.private) {
        result = await User.updateOne({ username }, { $push: { pending: id } })
      } else {
        result = await User.updateOne({ username }, { $push: { followers: id } })
      }

      return result
    })()
  },

  unfollowUserByUsername(uid, username) {
    return (async () => {
      return await User.updateOne({ username }, { $pull: { followers: uid } })
    })()
  },

  addThread(uid, text, attached = null) {
    return (async () => {
      const thread = new Thread({ author: uid, text, attached })

      return thread.save()
    })()
  },

  removeThread(id, uid) {
    return (async () => {
      return Thread.deleteOne({ _id: id, author: uid })
    })()
  },

  retrieveThread(id) {
    return (async () => {
      let thread =  await Thread.findById(id).lean().populate([{ path: 'author', select: 'fullname username avatar'}, { path: 'comments.author', select: 'fullname username avatar'}]).exec()

      thread.id = thread._id.toString()
      delete thread._id

      thread.author.id = thread.author._id.toString()
      delete thread.author._id

      thread.comments.forEach(comment => {
        comment.id = comment._id.toString()
        delete comment._id

        comment.author.id = comment.author._id.toString()
        delete comment.author._id
      })

      return thread
    })()
  },

  retrieveUserThreads(uid) {
    return (async () => {
      let threads = await Thread.find({ author: uid }).lean().populate([{ path: 'author', select: 'fullname username avatar'}, { path: 'comments.author', select: 'fullname username avatar'}]).exec()

      threads.forEach(thread => {
        thread.id = thread._id.toString()
        delete thread._id

        thread.author.id = thread.author._id.toString()
        delete thread.author._id

        thread.comments.forEach(comment => {
          comment.id = comment._id.toString()
          delete comment._id
  
          comment.author.id = comment.author._id.toString()
          delete comment.author._id //Not working
        })
      })

      return threads
    })()
  },

  addComment(tid, uid, text) {
    return (async () => {
      return await Thread.updateOne({ _id: tid }, { $push: { comments: [{ author: uid, text }] } })
    })()
  },

  removeComment(tid, id, uid) {
    return (async () => {
      return await Thread.updateOne({ _id: tid }, { $pull: { comments: { _id: id, author: uid } } })
    })()
  }
}

module.exports = logic