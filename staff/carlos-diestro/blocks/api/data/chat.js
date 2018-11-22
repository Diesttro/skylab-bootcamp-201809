const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Chat = new Schema({
  members: [{
    type: ObjectId,
    ref: 'User'
  }],
  messages: [{
    sender: {
      type: ObjectId,
      ref: 'User'
    },
    text: {
      type: String
    },
    read: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
})

module.exports = Chat