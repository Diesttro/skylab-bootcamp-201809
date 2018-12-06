const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Thread = new Schema({
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  attached: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  comments: [{
    author: {
      type: ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    type: ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: ObjectId,
    ref: 'User'
  }]
})

module.exports = Thread