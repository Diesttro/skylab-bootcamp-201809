require('dotenv').config()

const jwt = require('jsonwebtoken')

const token = jwt.sign({ sub: '123', exp: Math.floor(Date.now() / 1000) + 1 }, process.env.JWT_SECRET)

console.log(token)

const before = Date.now()

// while(Date.now() - before < 3000);

try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    console.log(payload)
} catch(err) {
    console.log('hey, token not valid')
}
