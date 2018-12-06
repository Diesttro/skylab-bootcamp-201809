const fs = require('fs')
const path = require('path')
const { models: { User, Thread, Chat } } = require('cuve-data')
const validate = require('../utils/validate')

const logic = {
  /**
   * Register a user
   * 
   * @param {string} fullname 
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   */
  register(fullname, username, email, password) {
    validate([
      { key: 'fullname', value: fullname, type: String },
      { key: 'username', value: username, type: String },
      { key: 'email', value: email, type: String },
      { key: 'password', value: password, type: String }
    ])

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
   * @param {string} username 
   * @param {string} password 
   */
  authenticate(username, password) {
    validate([
      { key: 'username', value: username, type: String },
      { key: 'password', value: password, type: String }
    ])

    return (async () => {
      const user = await User.findOne({ username })

      if (!user || user.password !== password) throw Error('username or password are not valid')

      return user.id
    })()
  },

  /**
   * Retrieve a user
   * 
   * @param {string} id 
   */
  retrieveUser(id) {
    validate([
      { key: 'id', value: id, type: String },
    ])

    return (async () => {
      const projection = {
        password: false
      }

      const user = await User.findById({ _id: id }, projection).lean().populate([
        { path: 'followers', select: 'avatar fullname username' },
        { path: 'pending', select: 'avatar fullname username' }
      ])

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
   * @param {string} id 
   * @param {string} username 
   */
  retrieveUserByUsername(id, username) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'username', value: username, type: String }
    ])
    
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
        pending: true,
        private: true
      }

      let user = await User.findOne({ username }).lean()

      if (!user) throw Error(`user ${username} does not exist`)

      const blocked = user.blocked.find(bid => bid.toString() === id)

      if (blocked) user = await User.findOne({ username }, notFollowerProjection).lean()
      else if (user.private) {
        user = await User.findOne({ username, followers: id }, followerProjection).lean().populate([{ path: 'followers', select: 'avatar username' }, { path: 'following', select: 'avatar username' }])

        if (!user) {
          user = await User.findOne({ username }, notFollowerProjection).lean()
        } else {
          const threads = await this.retrieveUserThreads(user._id.toString())

          user.threads = threads

          user.followers.forEach(user => {
            if (user._id) {
              user.id = user._id.toString()
              delete user._id
            }
          })
  
          user.following.forEach(user => {
            if (user._id) {
              user.id = user._id.toString()
              delete user._id
            }
          })
        }
      }
      else {
        user = await User.findOne({ username }, followerProjection).lean().populate([{ path: 'followers', select: 'avatar username' }, { path: 'following', select: 'avatar username' }])

        const threads = await this.retrieveUserThreads(user._id.toString())

        user.threads = threads

        user.followers.forEach(user => {
          if (user._id) {
            user.id = user._id.toString()
            delete user._id
          }
        })

        user.following.forEach(user => {
          if (user._id) {
            user.id = user._id.toString()
            delete user._id
          }
        })
      }

      user.id = user._id.toString()
      delete user._id
      delete user.__v

      return user
    })()
  },

  /**
   * Find user by the fullname and the username
   * 
   * @param {string} username 
   */
  findUsersByUsername(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    return (async () => {
      const users = await User.aggregate([
        {
          $match: {
            $or: [
              { fullname: { $regex: username, $options: 'i' } },
              { username: { $regex: username, $options: 'i' } }
            ]
          }
        },
        {
          $project: { _id: 0, id: '$_id', avatar: 1, username: 1 }
        }
      ])

      users.forEach(user => {
        user.id = user.id.toString()
      })

      return users
    })()
  },

  /**
   * Follow user by the username
   * 
   * @param {string} id 
   * @param {string} username 
   */
  followUserByUsername(id, username) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'username', value: username, type: String }
    ])

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

  /**
   * Unfollow user by the username
   * 
   * @param {string} id 
   * @param {string} username 
   */
  unfollowUserByUsername(id, username) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'username', value: username, type: String }
    ])

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

  /**
   * Accept a pending follow
   * 
   * @param {string} id 
   * @param {string} username 
   */
  acceptFollowerByUsername(id, username) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'username', value: username, type: String }
    ])

    return (async () => {
      const follower = await User.findOne({ username })

      await User.updateOne({ _id: id }, { $pull: { pending: follower.id } })
      await User.updateOne({ _id: id }, { $push: { followers: follower.id } })
      await User.updateOne({ _id: follower.id }, { $push: { following: id } })
    })()
  },

  /**
   * Reject pending follow 
   * 
   * @param {string} id 
   * @param {string} username 
   */
  rejectFollowerByUsername(id, username) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'username', value: username, type: String }
    ])

    return (async () => {
      const follower = await User.findOne({ username })

      await User.updateOne({ _id: id }, { $pull: { pending: follower.id } })
    })()
  },

  /**
   * Add new thread
   * 
   * @param {string} uid 
   * @param {string} text 
   * @param {string} attached 
   */
  addThread(uid, text, attached = null) {
    validate([
      { key: 'uid', value: uid, type: String },
      { key: 'text', value: text, type: String }
    ])

    return (async () => {
      const thread = new Thread({ author: uid, text, attached })

      return thread.save()
    })()
  },

  /**
   * Remove thread
   * 
   * @param {string} id 
   * @param {string} uid 
   */
  removeThread(id, uid) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.deleteOne({ _id: id, author: uid })
    })()
  },

  /**
   * Retrieve the thread data
   * 
   * @param {string} id 
   */
  retrieveThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    return (async () => {
      let thread = await Thread.findById(id).lean().populate([
        { path: 'author', select: 'fullname username avatar' },
        { path: 'comments.author', select: 'fullname username avatar' }
      ]).exec()

      // const thread = await Thread.aggregate([
      //   {
      //     $match: { _id: ObjectId(id) }
      //   },
      //   {
      //     $lookup: {
      //       from: 'users',
      //       localField: 'author',
      //       foreignField: '_id',
      //       as: 'user'
      //     }
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       id: '$_id',
      //       text: 1,
      //       'user.id': '$user._id',
      //       'user.username': 1
      //     }
      //   }
      // ])

      thread.id = thread._id.toString()
      delete thread._id

      thread.author.id = thread.author._id.toString()
      delete thread.author._id

      thread.comments.forEach(comment => {
        comment.id = comment._id.toString()
        delete comment._id

        if (comment.author._id) {
          comment.author.id = comment.author._id.toString()
          delete comment.author._id
        }
      })

      return thread
    })()
  },

  /**
   * Retrieve user threads and shared threads by the user
   * 
   * @param {string} uid 
   */
  retrieveUserThreads(uid) {
    validate([
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      let threads = await Thread.find({ $or: [{ author: uid }, { shares: uid }] }).lean().populate([
        { path: 'author', select: 'fullname username avatar' },
        { path: 'comments.author', select: 'fullname username avatar' }
      ]).sort({ date: 'desc' }).exec()

      threads.forEach(thread => {
        thread.id = thread._id.toString()
        delete thread._id

        if (thread.author._id) {
          thread.author.id = thread.author._id.toString()
          delete thread.author._id
        }

        thread.comments.forEach(comment => {
          comment.id = comment._id.toString()
          delete comment._id

          if (comment.author._id) {
            comment.author.id = comment.author._id.toString()
            delete comment.author._id
          }
        })
      })

      return threads
    })()
  },

  /**
   * Retrieve thread of following users
   * 
   * @param {string} uid 
   */
  retrieveFollowingUsersThreads(uid) {
    validate([
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      const user = await User.findOne({ _id: uid }, { following: true }).lean()

      let threads = await Thread.find({ $or: [{ author: { $in: user.following } }, { shares: { $in: user.following } }] }).lean().populate([
        { path: 'author', select: 'fullname username avatar' },
        { path: 'comments.author', select: 'fullname username avatar' }
      ]).sort({ date: 'desc' }).exec()

      threads.forEach(thread => {
        thread.id = thread._id.toString()
        delete thread._id

        if (thread.author._id) {
          thread.author.id = thread.author._id.toString()
          delete thread.author._id
        }

        thread.comments.forEach(comment => {
          comment.id = comment._id.toString()
          delete comment._id

          if (comment.author._id) {
            comment.author.id = comment.author._id.toString()
            delete comment.author._id
          }
        })
      })

      return threads
    })()
  },

  /**
   * Add new comment
   * 
   * @param {string} tid 
   * @param {string} uid 
   * @param {string} text 
   */
  addComment(tid, uid, text) {
    validate([
      { key: 'tid', value: tid, type: String },
      { key: 'uid', value: uid, type: String },
      { key: 'text', value: text, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: tid }, { $push: { comments: [{ author: uid, text }] } })
    })()
  },

  /**
   * Remove comment
   * 
   * @param {string} tid 
   * @param {string} id 
   * @param {string} uid 
   */
  removeComment(tid, id, uid) {
    validate([
      { key: 'tid', value: tid, type: String },
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: tid }, { $pull: { comments: { _id: id, author: uid } } })
    })()
  },

  /**
   * Share a thread
   * 
   * @param {string} id 
   * @param {string} uid 
   */
  shareThread(id, uid) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: id }, { $push: { shares: uid } })
    })()
  },

  /**
   * Unshare a thread
   * 
   * @param {string} id 
   * @param {string} uid 
   */
  unshareThread(id, uid) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: id }, { $pull: { shares: uid } })
    })()
  },

  /**
   * Like a thread
   * 
   * @param {string} id 
   * @param {string} uid 
   */
  likeThread(id, uid) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: id }, { $push: { likes: uid } })
    })()
  },

  /**
   * Unlike a thread
   * 
   * @param {string} id 
   * @param {string} uid 
   */
  unlikeThread(id, uid) {
    validate([
      { key: 'id', value: id, type: String },
      { key: 'uid', value: uid, type: String }
    ])

    return (async () => {
      return await Thread.updateOne({ _id: id }, { $pull: { likes: uid } })
    })()
  },

  /**
   * Retrieve users by amount of threads
   */
  retrievePopularPeople() {
    return (async () => {
      const popularPpl = await Thread.aggregate(
        [
          {
            $group: {
              _id: '$author',
              count: { $sum: 1 }
            }
          },
          {
            $sort: { count: -1 }
          },
          {
            $limit: 6
          }
          // {
          //   $lookup: {
          //     from: 'users',
          //     localField: '_id',
          //     foreignField: '_id',
          //     as: 'user'
          //   }
          // }
        ]
      )

      const users = await User.find({ _id: { $in: popularPpl } }, { _id: 0, avatar: 1, username: 1 }).lean()

      return users
    })()
  },

  /**
   * Save new message in chat
   * 
   * @param {string} sender 
   * @param {string} receiver 
   * @param {string} text 
   */
  saveMessage(sender, receiver, text) {
    validate([
      { key: 'sender', value: sender, type: String },
      { key: 'receiver', value: receiver, type: String }
    ])

    return (async () => {
      const messages = [{
        sender,
        text
      }]

      // OLD LOGIC
      let chat = await Chat.findOne({ members: { $all: [sender, receiver] } })

      if (chat) {
        if (text) {
          const result = await Chat.updateOne({ _id: chat.id }, { $set: { last: Date.now() }, $push: { messages } })

          return chat.id
        }
      } else {
        const members = [sender, receiver]

        const newChat = new Chat({ members })

        newChat.save()

        return newChat.id
      }
    })()
  },

  /**
   * Retrieve user chats
   * 
   * @param {string} id 
   */
  retrieveUserChats(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    return (async () => {
      const chats = await Chat.find({ members: id }, { __v: 0, 'messages._id': 0 }).lean().populate([
        { path: 'members', select: '_id avatar username' },
        { path: 'messages.sender', select: '_id' }
      ]).sort({ last: 'desc' })

      if (!chats) return []

      chats.forEach(chat => {
        chat.id = chat._id.toString()
        delete chat._id

        chat.members.forEach(member => {
          if (member._id) {
            member.id = member._id.toString()
            delete member._id
          }
        })

        chat.messages.forEach(message => {
          if (message.sender._id) {
            message.sender.id = message.sender._id.toString()
            delete message.sender._id
          }
        })
      })

      return chats
    })()
  },

  /**
   * Retrieve a chat
   * 
   * @param {string} id 
   */
  retrieveChat(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    return (async () => {
      const chat = await Chat.findOne({ _id: id }, { __v: 0, 'messages._id': 0 }).lean().populate([
        { path: 'members', select: '_id avatar username' },
        { path: 'messages.sender', select: '_id' }
      ])

      if (!chat) throw Error('chat not found')

      chat.id = chat._id.toString()
      delete chat._id

      chat.members.forEach(member => {
        if (member._id) {
          member.id = member._id.toString()
          delete member._id
        }
      })

      chat.messages.forEach(message => {
        if (message.sender._id) {
          message.sender.id = message.sender._id.toString()
          delete message.sender._id
        }
      })

      return chat
    })()
  },

  // /**
  //  * Retrieve followers of user by username
  //  * 
  //  * @param {string} username 
  //  */
  // async retrieveFollowersByUsername(username) {
  //   return await User.find({ username }, { followers: 1, _id: 0}).lean().populate({ path: 'followers', select: 'avatar username -_id' })
  // },

  // /**
  //  * Retrieve following of user by username
  //  * 
  //  * @param {string} username 
  //  */
  // async retrieveFollowingByUsername(username) {
  //   return await User.find({ username }, { following: 1, _id: 0}).lean().populate({ path: 'following', select: 'avatar username -_id' })
  // },

  /**
   * Save profile changes
   * 
   * @param {string} id 
   * @param {object} changes 
   */
  async saveUserChanges(id, changes) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    try {
      await User.updateOne({ _id: id }, { $set: changes })
    } catch (error) {
      throw Error(error)
    }
  },

  /**
   * Save image on disk
   * 
   * @param {string} id 
   * @param {file} img 
   * @param {string} type 
   * @param {string} dir 
   */
  saveImage(id, img, type, dir) {
    const folder = '../public' + dir
    const filename = id + '.' + type

    pathFile = path.join(__dirname, folder + filename)

    try {
      fs.writeFileSync(pathFile, img, 'binary')

      return  dir + filename
    } catch (error) {
      throw Error(error)
    }
  }
}

module.exports = logic