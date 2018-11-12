const mongoose = require('mongoose')

const { Postit, User } = require('./schemas')

module.exports = {
    Postit: mongoose.model('Postit', Postit),
    User: mongoose.model('User', User)
}