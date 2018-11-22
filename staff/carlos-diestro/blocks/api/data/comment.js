const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Comment = new Schema({
  thread: {
    type: ObjectId,
    ref: 'Thread'
  },
  author: [{
    type: ObjectId,
    ref: 'User'
  }],
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Comment

