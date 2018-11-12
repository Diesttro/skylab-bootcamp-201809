require('dotenv').config()

const { MongoClient } = require('mongodb')
const express = require('express')
const package = require('./package.json')
const router = require('./routes')
const cors = require('./utils/cors')
const { User } = require('./data')

const { env: { PORT, MONGO_URL } } = process

const client = new MongoClient(MONGO_URL, { useNewUrlParser: true })

client.connect()
    .then(() => {
        console.log(`db server running at ${MONGO_URL}`)

        const db = client.db('postit')

        users = db.collection('users')

        User._collection = users

        const { argv: [, , port = PORT || 8080] } = process

        const app = express()

        app.use(cors)

        app.use('/api', router)

        app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))
    })
    .catch(console.error)