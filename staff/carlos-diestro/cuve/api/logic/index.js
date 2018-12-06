const fs = require('fs')
const path = require('path')
const url = require('url')
const ip = require('ip')
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

  findUsersByUsername(username) {
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

  acceptFollowerByUsername(id, username) {
    return (async () => {
      const follower = await User.findOne({ username })

      await User.updateOne({ _id: id }, { $pull: { pending: follower.id } })
      await User.updateOne({ _id: id }, { $push: { followers: follower.id } })
      await User.updateOne({ _id: follower.id }, { $push: { following: id } })
    })()
  },

  rejectFollowerByUsername(id, username) {
    return (async () => {
      const follower = await User.findOne({ username })

      await User.updateOne({ _id: id }, { $pull: { pending: follower.id } })
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
   * Retrieve user and shared threads
   * 
   * @param {*} uid 
   */
  retrieveUserThreads(uid) {
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

  retrieveFollowingUsersThreads(uid) {
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
  },

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

  saveMessage(sender, receiver, text) {
    return (async () => {
      // const members = [sender, receiver]
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

      // const chat = await Chat.findOne({ _id: id })

      // if (!chat) {
      //   const newChat = new Chat({ members, messages })

      //   return newChat.save()
      // } else {
      //   return await Chat.updateOne({ _id: id }, { $push: { messages } })
      // }
    })()
  },

  retrieveUserChats(id) {
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

  retrieveChat(id) {
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

  // async readChat() {
  //   try {
  //     const chat = await Chat.update(
  //       { 
  //         $and: [
  //           { _id: '5c070f20da3f341be4481c8c' },
  //           { messages: { $elemMatch: { sender: '5c070e65da3f341be4481c89' } } } 
  //         ]
  //       },
  //       {
  //         $set: { 'messages.$[].read': false }
  //       }
  //     )
  //     debugger
  //   } catch (error) {
  //     debugger
  //   }
  // },

  // saveUserPhoto(id, file, type) {
  //   const folder = '/users'
  //   const pathDir = 'public' + folder
  //   const filename = id + '.' + type

  //   return new Promise((resolve, reject) => {
  //     try {
  //       const pathToFile = path.join(pathDir, filename)
  //       const pathToUrl = 'http://' + ip.address() + ':' + process.env.PORT + folder + '/' + filename

  //       const ws = fs.createWriteStream(pathToFile)

  //       file.pipe(ws)

  //       file.on('end', () => resolve(pathToUrl))

  //       file.on('error', reject)
  //     } catch (err) {
  //       reject(err)
  //     }
  //   })
  // },

  async retrieveFollowersByUsername(username) {
    return await User.find({ username }, { followers: 1, _id: 0}).lean().populate({ path: 'followers', select: 'avatar username -_id' })
  },

  async retrieveFollowingByUsername(username) {
    return await User.find({ username }, { following: 1, _id: 0}).lean().populate({ path: 'following', select: 'avatar username -_id' })
  },

  async saveUserChanges(id, changes) {
    try {
      await User.updateOne({ _id: id }, { $set: changes })
    } catch (error) {
      debugger
      throw Error(error)
    }
  },

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