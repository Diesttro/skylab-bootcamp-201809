const { User, Thread, Chat } = require('../data')

const logic = {
  /**
   * Register a user
   * 
   * @param {*} fullname 
   * @param {*} username 
   * @param {*} email 
   * @param {*} password 
   */
  register(fullname, username, email, password) {
    return (async () => {
      const user = await User.findOne({ username }).lean()

      if (user) throw Error('username already exist')

      const newUser = new User({ fullname, username, email, password })

      return newUser.save()
    })()
  },

  /**
   * Authenticate a user
   * 
   * @param {*} username 
   * @param {*} password 
   */
  authenticate(username, password) {
    return (async () => {
      const user = await User.findOne({ username })

      if (!user || user.password !== password) throw Error('username or password are not valid')

      return user.id
    })()
  },

  /**
   * Retrieve a user
   * 
   * @param {*} id 
   */
  retrieveUser(id) {
    return (async () => {
      const projection = {
        password: false
      }

      const user = await User.findById({ _id: id }, projection).lean().populate('followers', 'id fullname username avatar')

      if (!user) throw Error(`username ${username} does not exist`)

      user.id = user._id.toString()
      delete user._id
      delete user.__v

      return user
    })()
  },

  /**
   * Retrieve a user by username depending on his configuration
   * 
   * @param {*} id 
   * @param {*} username 
   */
  retrieveUserByUsername(id, username) {
    return (async () => {
      const followerProjection = {
        fullname: true,
        username: true,
        email: true,
        avatar: true,
        description: true,
        signed: true,
        country: true,
        following: true,
        followers: true,
        pending: true,
        private: true
      }

      const notFollowerProjection = {
        fullname: true,
        username: true,
        email: true,
        avatar: true,
        description: true,
        signed: true,
        country: true,
        followers: true,
        pending: true,
        private: true
      }

      let user = await User.findOne({ username }).lean()
      
      if (!user) throw Error(`user ${username} does not exist`)

      const blocked = user.blocked.find(bid => bid.toString() === id)

      if (blocked) user = await User.findOne({ username }, notFollowerProjection).lean()
      else if (user.private) {
        user = await User.findOne({ username, followers: id }, followerProjection).lean()
        
        if (!user) {
          user = await User.findOne({ username }, notFollowerProjection).lean()
        } else {
          const threads = await this.retrieveUserThreads(user._id.toString())

          user.threads = threads
        }
      }
      else {
        user = await User.findOne({ username }, followerProjection).lean()

        const threads = await this.retrieveUserThreads(user._id.toString())

        user.threads = threads
      }

      user.id = user._id.toString()
      delete user._id
      delete user.__v

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
      const user = await User.findOne({ username })

      if (!user) throw Error(`username ${username} does not exist`)

      let result

      if (user.private) {
        result = await User.updateOne({ username }, { $push: { pending: id } })
      } else {
        result = await User.updateOne({ username }, { $push: { followers: id } })
        result = await User.updateOne({ _id: id }, { $push: { following: user.id } })
      }

      return result
    })()
  },

  unfollowUserByUsername(id, username) {
    return (async () => {
      let result

      const follower = await User.findOne({ username, followers: id })

      if (!follower) result = await User.updateOne({ username }, { $pull: { pending: id } })
      else {
        result = await User.updateOne({ username }, { $pull: { followers: id } })
        result = await User.updateOne({ _id: id }, { $pull: { following: follower.id } })
      }

      return result
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
      return await Thread.deleteOne({ _id: id, author: uid })
    })()
  },

  retrieveThread(id) {
    return (async () => {
      let thread =  await Thread.findById(id).lean().populate([
        { path: 'author', select: 'fullname username avatar'},
        { path: 'comments.author', select: 'fullname username avatar'}
      ]).exec()

      // thread.id = thread._id.toString()
      // delete thread._id

      // thread.author.id = thread.author._id.toString()
      // delete thread.author._id

      // thread.comments.forEach(comment => {
      //   comment.id = comment._id.toString()
      //   delete comment._id

      //   comment.author.id = comment.author._id.toString()
      //   delete comment.author._id
      // })

      return thread
    })()
  },

  /**
   * Retrieve user and shared threads
   * 
   * @param {*} uid 
   */
  retrieveUserThreads(uid) {
    return (async () => {
      let threads = await Thread.find({ $or: [{ author: uid }, { shares: uid }] }).lean().populate([
        { path: 'author', select: 'fullname username avatar'},
        { path: 'comments.author', select: 'fullname username avatar'}
      ]).sort({ date: 'desc' }).exec()

      // threads.forEach(thread => {
      //   thread.id = thread._id.toString()
      //   delete thread._id

      //   thread.author.id = thread.author._id.toString()
      //   delete thread.author._id

      //   thread.comments.forEach(comment => {
      //     comment.id = comment._id.toString()
      //     delete comment._id
  
      //     comment.author.id = comment.author._id.toString()
      //     delete comment.author._id
      //   })
      // })

      return threads
    })()
  },

  retrieveFollowingUsersThreads(uid) {
    return (async () => {
      const user = await User.findOne({ _id: uid }, { following: true }).lean()

      let threads = await Thread.find({ $or: [{ author: { $in: user.following } }, { shares: { $in: user.following } }] }).lean().populate([
        { path: 'author', select: 'fullname username avatar'},
        { path: 'comments.author', select: 'fullname username avatar'}
      ]).sort({ date: 'desc' }).exec()

      // threads.forEach(thread => {
      //   thread.id = thread._id.toString()
      //   delete thread._id

      //   thread.author.id = thread.author._id.toString()
      //   delete thread.author._id

      //   thread.comments.forEach(comment => {
      //     comment.id = comment._id.toString()
      //     delete comment._id
  
      //     comment.author.id = comment.author._id.toString()
      //     delete comment.author._id
      //   })
      // })

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
  },

  shareThread(id, uid) {
    return (async () => {
      return await Thread.updateOne({ _id: id }, { $push: { shares: uid } })
    })()
  },

  unshareThread(id, uid) {
    return (async () => {
      return await Thread.updateOne({ _id: id }, { $pull: { shares: uid } })
    })()
  },

  likeThread(id, uid) {
    return (async () => {
      return await Thread.updateOne({ _id: id }, { $push: { likes: uid } })
    })()
  },

  unlikeThread(id, uid) {
    return (async () => {
      return await Thread.updateOne({ _id: id }, { $pull: { likes: uid } })
    })()
  }
}

module.exports = logic