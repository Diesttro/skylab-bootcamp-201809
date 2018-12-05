require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const router = require('./routes')
const cors = require('./utils/cors')

const { env: { PORT, MONGO_URL } } = process

mongoose.connect(MONGO_URL, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    console.log(`db server running at ${MONGO_URL}`)

    const { argv: [, , port = PORT || 8080] } = process

    const app = express()

    app.use(express.static('public'))

    app.use(cors)

    app.use('/api', router)

    app.listen(port, () => console.log(`server up and running on port ${port}`))
  })
  .catch(console.error)