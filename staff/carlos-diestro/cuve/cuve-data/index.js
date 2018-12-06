const mongoose = require('mongoose')
const User = require('./user')
const Thread = require('./thread')
const Chat = require('./chat')

module.exports = {
	mongoose,
	models: {
		User: mongoose.model('User', User),
		Thread: mongoose.model('Thread', Thread),
		Chat: mongoose.model('Chat', Chat)
	}
}