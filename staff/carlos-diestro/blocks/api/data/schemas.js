const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const User = new Schema({
  username: {
    type: String,
    required: true
  },
  avatar: String,
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  threads: [Thread],
  likes: [Thread],
  chats: [Chat],
  followers: [[User]],
  following: [[User]],
  mentions: [[User]],
  blocked: [[User]]
})

const Comment = new Schema({
  author: String,
  avatar: String,
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
})

const Thread = new Schema({
  author: User,
  avatar: String,
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [Comment],
  shared: [User],
  favourites: [User]
})

const Chat = new Schema({
  members: [User],
  messages: [{
    sender: String,
    avatar: String,
    text: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
})

module.exports = {
  User,
  Thread,
  Comment,
  Chat
}