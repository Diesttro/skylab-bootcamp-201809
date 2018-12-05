const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const User = new Schema({
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/users/default.png'
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
    type: String,
    default: ''
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