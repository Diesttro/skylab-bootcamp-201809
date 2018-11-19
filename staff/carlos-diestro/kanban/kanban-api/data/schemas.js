const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Postit = new Schema({
    text: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'TODO'
    },
    modified: {
        type: Date,
        default: Date.now
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: ObjectId,
        ref: 'User'
    }]
})

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    friends: [{
        type: ObjectId,
        ref: 'User',
        unique: true
    }],
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
})

module.exports = {
    Postit,
    User
}

