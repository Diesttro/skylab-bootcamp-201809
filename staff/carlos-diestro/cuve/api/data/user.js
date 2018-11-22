const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const User = new Schema({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  country: {
    type: String
  },
  private: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  shares: [{
    type: ObjectId,
    ref: 'Thread'
  }],
  likes: [{
    type: ObjectId,
    ref: 'Thread'
  }],
  followers: [{
    type: ObjectId,
    ref: 'User'
  }],
  following: [{
    type: ObjectId,
    ref: 'User'
  }],
  pending: [{
    type: ObjectId,
    ref: 'User'
  }],
  mentions: [{
    type: ObjectId,
    ref: 'User'
  }],
  blocked: [{
    type: ObjectId,
    ref: 'User'
  }],
  signed: {
    type: Date,
    default: Date.now
  }
})

module.exports = User